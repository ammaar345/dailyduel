import Peer, { type DataConnection } from 'peerjs'

/**
 * Real-time 1v1 duel transport over WebRTC via PeerJS.
 *
 * Uses PeerJS's free public broker for signaling (no account, no server of ours),
 * then a direct peer-to-peer DataChannel for gameplay messages. HTTPS required
 * (Cloudflare Pages + localhost both qualify).
 *
 * Flow:
 *   Host: createRoom() -> gets a short room code -> shares link ?room=CODE
 *   Guest: joinRoom(code) -> connects to host -> DataChannel opens on both sides
 */

// Messages exchanged over the DataChannel. Colors only for opponent rows —
// letters are never sent, so a player can't copy the opponent's guesses.
export type RtcMessage =
  | { type: 'hello'; puzzleDate: string }
  | { type: 'progress'; rows: ('correct' | 'present' | 'absent')[][]; guessCount: number; solved: boolean }
  | { type: 'result'; solved: boolean; elapsedMs: number; guessCount: number }
  | { type: 'rematch' }

export type RtcRole = 'host' | 'guest'
export type RtcState = 'connecting' | 'waiting' | 'connected' | 'disconnected' | 'error'

export interface RtcHandlers {
  onState: (state: RtcState) => void
  onMessage: (msg: RtcMessage) => void
}

// PeerJS ids can be long/ugly; we prefix a short room code so links are shareable.
const ID_PREFIX = 'dailyduel-'

function makeRoomCode(): string {
  // 6 chars, unambiguous alphabet (no 0/O/1/I)
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)]
  return code
}

export class DuelConnection {
  private peer: Peer | null = null
  private conn: DataConnection | null = null
  private handlers: RtcHandlers
  private destroyed = false
  role: RtcRole
  roomCode = ''

  constructor(role: RtcRole, handlers: RtcHandlers) {
    this.role = role
    this.handlers = handlers
  }

  // Never emit after destroy() — prevents a torn-down connection (e.g. React
  // StrictMode's throwaway first mount) from pushing 'error' onto the live one.
  private emitState(s: RtcState) {
    if (!this.destroyed) this.handlers.onState(s)
  }
  private emitMessage(m: RtcMessage) {
    if (!this.destroyed) this.handlers.onMessage(m)
  }

  /** Host: open a room, resolve with the shareable room code. */
  createRoom(): Promise<string> {
    return new Promise((resolve, reject) => {
      const code = makeRoomCode()
      this.roomCode = code
      const peer = new Peer(ID_PREFIX + code)
      this.peer = peer

      const timeout = setTimeout(() => {
        this.emitState('error')
        reject(new Error('Timed out reaching the matchmaking broker'))
      }, 12000)

      peer.on('open', () => {
        clearTimeout(timeout)
        this.emitState('waiting')
        resolve(code)
      })
      peer.on('connection', (conn) => {
        this.bindConnection(conn)
      })
      peer.on('error', (err) => {
        clearTimeout(timeout)
        if (this.destroyed) return
        // 'unavailable-id' means someone already holds this code — retry once with a new one
        if ((err as { type?: string }).type === 'unavailable-id') {
          this.destroy()
          this.destroyed = false
          this.createRoom().then(resolve, reject)
          return
        }
        this.emitState('error')
      })
    })
  }

  /** Guest: connect to an existing room code. */
  joinRoom(code: string): void {
    this.roomCode = code
    this.handlers.onState('connecting')
    const peer = new Peer() // random id for the guest
    this.peer = peer

    const timeout = setTimeout(() => this.emitState('error'), 12000)

    peer.on('open', () => {
      const conn = peer.connect(ID_PREFIX + code, { reliable: true })
      this.bindConnection(conn, timeout)
    })
    peer.on('error', () => {
      clearTimeout(timeout)
      this.emitState('error')
    })
  }

  private bindConnection(conn: DataConnection, timeout?: ReturnType<typeof setTimeout>) {
    this.conn = conn
    conn.on('open', () => {
      if (timeout) clearTimeout(timeout)
      this.emitState('connected')
    })
    conn.on('data', (data) => {
      this.emitMessage(data as RtcMessage)
    })
    conn.on('close', () => this.emitState('disconnected'))
    conn.on('error', () => this.emitState('disconnected'))
  }

  send(msg: RtcMessage): void {
    if (this.conn && this.conn.open) this.conn.send(msg)
  }

  destroy(): void {
    this.destroyed = true
    try { this.conn?.close() } catch { /* already closed */ }
    try { this.peer?.destroy() } catch { /* already destroyed */ }
    this.conn = null
    this.peer = null
  }
}

/** Build the shareable room link for a code. */
export function buildRoomUrl(code: string): string {
  return `${window.location.origin}${window.location.pathname}?room=${code}`
}

/** Read an incoming room code from the URL, if present. */
export function parseRoom(): string | null {
  const code = new URLSearchParams(window.location.search).get('room')
  if (!code || !/^[A-Z2-9]{6}$/.test(code)) return null
  return code
}
