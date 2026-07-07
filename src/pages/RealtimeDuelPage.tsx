import { useState, useEffect, useCallback, useRef } from 'react'
import { DuelBoard } from '../components/game/DuelBoard'
import { GameKeyboard } from '../components/game/GameKeyboard'
import { ResultScreen } from '../components/game/ResultScreen'
import { createGameState, handleKeyPress, getKeyStates, type guess } from '../lib/gameLogic'
import type { Puzzle } from '../lib/daily'
import { XP_WIN, XP_LOSS, type Stats } from '../lib/stats'
import type { Settings } from '../lib/settings'
import { playKeyClick, playBackspace, playCorrect, playWin, playLose, playClick } from '../lib/sounds'
import { BackIcon, GearIcon, ClipboardIcon, CrossedSwordsIcon } from '../components/ui/Icons'
import { ColorKey } from '../components/game/ColorKey'
import { GameTimer } from '../components/game/GameTimer'
import { DuelConnection, buildRoomUrl, type RtcMessage, type RtcState } from '../lib/rtc'

interface RealtimeDuelPageProps {
  puzzle: Puzzle
  settings: Settings
  stats: Stats
  /** Room code from a shared link — set means we're the guest joining. */
  joinCode?: string | null
  onWin: (timeMs: number) => void
  onLoss: () => void
  onBack: () => void
  onSettings: () => void
}

type Phase = 'lobby' | 'countdown' | 'playing' | 'done'

export function RealtimeDuelPage({ puzzle, settings, stats, joinCode, onWin, onLoss, onBack, onSettings }: RealtimeDuelPageProps) {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [connState, setConnState] = useState<RtcState>(joinCode ? 'connecting' : 'connecting')
  const [roomLink, setRoomLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const [player, setPlayer] = useState(createGameState)
  const [oppRows, setOppRows] = useState<guess[]>([])
  const [oppSolved, setOppSolved] = useState(false)
  const [playerWon, setPlayerWon] = useState<boolean | null>(null)
  const [invalidMsg, setInvalidMsg] = useState(false)

  const connRef = useRef<DuelConnection | null>(null)
  const soundRef = useRef(settings.sound)
  soundRef.current = settings.sound
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const playerRef = useRef(player)
  playerRef.current = player

  // Refs for arbitration without stale closures
  const finalizedRef = useRef(false)
  const mySolvedRef = useRef(false)
  const myFailedRef = useRef(false)
  const myElapsedRef = useRef(0)
  const oppSolvedRef = useRef(false)
  const oppFailedRef = useRef(false)
  const oppElapsedRef = useRef(0)
  const onWinRef = useRef(onWin); onWinRef.current = onWin
  const onLossRef = useRef(onLoss); onLossRef.current = onLoss

  // Decide the winner exactly once. Called after any state change.
  const finalize = useCallback((won: boolean | 'draw') => {
    if (finalizedRef.current) return
    finalizedRef.current = true
    setPhase('done')
    if (won === true) {
      if (soundRef.current) playWin()
      setPlayerWon(true)
      onWinRef.current(myElapsedRef.current)
    } else {
      if (soundRef.current) playLose()
      setPlayerWon(false)
      onLossRef.current()
    }
  }, [])

  const evaluate = useCallback(() => {
    if (finalizedRef.current) return
    const meDone = mySolvedRef.current || myFailedRef.current
    const oppDone = oppSolvedRef.current || oppFailedRef.current
    if (mySolvedRef.current && oppSolvedRef.current) {
      finalize(myElapsedRef.current <= oppElapsedRef.current)
    } else if (mySolvedRef.current && !oppDone) {
      finalize(true) // I solved, opponent still going
    } else if (oppSolvedRef.current && !meDone) {
      finalize(false) // opponent solved, I'm still going
    } else if (meDone && oppDone) {
      // neither solved (both failed) → draw counts as a loss for stats but shown as draw
      finalize('draw')
    }
  }, [finalize])

  // Set up the connection once
  useEffect(() => {
    let cancelled = false
    const handlers = {
      onState: (s: RtcState) => {
        if (cancelled) return
        setConnState(s)
        if (s === 'connected') {
          // greet + start the local countdown
          conn.send({ type: 'hello', puzzleDate: puzzle.date })
          setPhase(p => (p === 'lobby' ? 'countdown' : p))
        }
        if (s === 'disconnected' && !finalizedRef.current) {
          // opponent dropped after the game started — award the win to whoever's still here
          if (phaseRef.current === 'playing') finalize(true)
          else setConnState('disconnected')
        }
      },
      onMessage: (msg: RtcMessage) => {
        if (cancelled) return
        if (msg.type === 'progress') {
          setOppRows(msg.rows.map(r => ({ word: '', result: r })))
          setOppSolved(msg.solved)
          if (msg.guessCount >= 6 && !msg.solved) { oppFailedRef.current = true; evaluate() }
        } else if (msg.type === 'result') {
          oppElapsedRef.current = msg.elapsedMs
          if (msg.solved) { oppSolvedRef.current = true; setOppSolved(true) }
          else oppFailedRef.current = true
          evaluate()
        }
      },
    }
    const conn = new DuelConnection(joinCode ? 'guest' : 'host', handlers)
    connRef.current = conn

    if (joinCode) {
      conn.joinRoom(joinCode)
    } else {
      conn.createRoom().then(code => { if (!cancelled) setRoomLink(buildRoomUrl(code)) }).catch(() => {})
    }
    return () => { cancelled = true; conn.destroy() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Countdown → playing
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown <= 0) {
      setPhase('playing')
      setPlayer(createGameState()) // reset the clock to the fair start
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 800)
    return () => clearTimeout(t)
  }, [phase, countdown])

  const showInvalid = useCallback(() => {
    setInvalidMsg(true)
    setTimeout(() => setInvalidMsg(false), 1200)
  }, [])

  // Side-effects (sound, network sends) live here — NOT inside the setState
  // updater, which React double-invokes under StrictMode and would double-send.
  const handleKey = useCallback((key: string) => {
    if (phaseRef.current !== 'playing') return
    const prev = playerRef.current
    if (prev.gameStatus !== 'playing') return
    const result = handleKeyPress(key, prev, puzzle.word)
    const ev = result.eventType
    if (ev === 'key' && soundRef.current) playKeyClick()
    if (ev === 'backspace' && soundRef.current) playBackspace()
    if (ev === 'correct' && soundRef.current) playCorrect()
    if (ev === 'invalid') { showInvalid(); return }

    const st = result.state
    // Broadcast progress (colors only, no letters) after a committed guess
    if (st.guesses.length !== prev.guesses.length) {
      const rows = st.guesses.map(g => g.result)
      const solved = st.gameStatus === 'won'
      connRef.current?.send({ type: 'progress', rows, guessCount: st.guesses.length, solved })

      if (st.gameStatus === 'won') {
        mySolvedRef.current = true
        myElapsedRef.current = st.elapsedMs
        connRef.current?.send({ type: 'result', solved: true, elapsedMs: st.elapsedMs, guessCount: st.guesses.length })
        evaluate()
      } else if (st.gameStatus === 'lost') {
        myFailedRef.current = true
        connRef.current?.send({ type: 'result', solved: false, elapsedMs: st.elapsedMs, guessCount: st.guesses.length })
        evaluate()
      }
    }
    playerRef.current = st
    setPlayer(st)
  }, [puzzle.word, showInvalid, evaluate])

  // Physical keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== 'playing') return
      if (e.key === 'Enter') handleKey('ENTER')
      else if (e.key === 'Backspace') handleKey('⌫')
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase())
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, handleKey])

  const handleCopy = () => {
    if (soundRef.current) playClick()
    navigator.clipboard.writeText(roomLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    const emojiMap = { correct: '🟩', present: '🟨', absent: '⬛' }
    const grid = player.guesses.map(g => g.result.map(r => emojiMap[r]).join('')).join('\n')
    const outcome = playerWon ? 'WON' : 'LOST'
    const text = `DailyDuel LIVE duel\n${outcome} in ${player.guesses.length} guesses\n\n${grid}\n\nddailyduel.pages.dev`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div className="min-h-dvh flex flex-col items-center px-4 py-4 max-w-2xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-2">
        <button onClick={() => { if (soundRef.current) playClick(); onBack() }} className="w-10 h-10 flex items-center justify-center text-[#A0AEC0] hover:text-[#90CAF9] transition-colors cursor-pointer">
          <BackIcon size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-[#64B5F6] uppercase">Live Duel</h1>
        <button onClick={() => { if (soundRef.current) playClick(); onSettings() }} className="w-10 h-10 flex items-center justify-center text-[#A0AEC0] hover:text-[#90CAF9] transition-colors cursor-pointer">
          <GearIcon size={20} />
        </button>
      </div>

      {/* LOBBY — connecting / waiting */}
      {phase === 'lobby' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center max-w-sm">
          {connState === 'error' ? (
            <>
              <div className="text-5xl">😕</div>
              <p className="text-[#4A5568] font-semibold">Couldn't reach the matchmaking server.</p>
              <p className="text-[#718096] text-sm">Check your connection and try again, or duel the bot instead.</p>
              <button onClick={onBack} className="marsh-btn marsh-btn-secondary px-6 py-3 mt-2">Back</button>
            </>
          ) : joinCode ? (
            <>
              <div className="animate-float"><CrossedSwordsIcon size={48} className="text-[#64B5F6]" /></div>
              <p className="text-[#4A5568] font-semibold">Joining duel {joinCode}…</p>
              <p className="text-[#718096] text-sm">Connecting to your opponent.</p>
            </>
          ) : (
            <>
              <div className="animate-float"><CrossedSwordsIcon size={48} className="text-[#64B5F6]" /></div>
              <p className="text-[#4A5568] font-semibold text-lg">Waiting for your opponent…</p>
              <p className="text-[#718096] text-sm">Send this link to a friend. When they open it, the duel begins.</p>
              {roomLink ? (
                <button onClick={handleCopy} className="marsh-btn marsh-btn-primary w-full py-3.5 mt-2">
                  <span className="flex items-center justify-center gap-2">
                    <ClipboardIcon size={18} className="text-white" />
                    {copied ? 'Copied!' : 'Copy Duel Link'}
                  </span>
                </button>
              ) : (
                <p className="text-[#A0AEC0] text-sm animate-pulse">Creating room…</p>
              )}
              {roomLink && <p className="text-[10px] text-[#A0AEC0] break-all mt-1">{roomLink}</p>}
            </>
          )}
        </div>
      )}

      {/* COUNTDOWN */}
      {phase === 'countdown' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-[#718096] font-semibold uppercase tracking-wider text-sm">Opponent connected!</p>
          <div className="text-8xl font-bold text-[#90CAF9] animate-bounce-in drop-shadow-lg">
            {countdown > 0 ? countdown : 'GO!'}
          </div>
        </div>
      )}

      {/* PLAYING */}
      {(phase === 'playing' || phase === 'done') && (
        <>
          <div className="w-full flex justify-center mb-2">
            <GameTimer startTime={player.startTime} running={phase === 'playing' && player.gameStatus === 'playing'} />
          </div>

          {invalidMsg && (
            <div className="relative w-full h-0 z-50">
              <div className="absolute left-1/2 -translate-x-1/2 top-0">
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">Not in word list</div>
              </div>
            </div>
          )}

          <div className="w-full grid grid-cols-2 gap-4 mt-1">
            <DuelBoard playerName="YOU" guesses={player.guesses} currentGuess={player.currentGuess} isCurrentPlayer solved={player.gameStatus === 'won'} />
            <DuelBoard playerName="RIVAL" guesses={oppRows} currentGuess="" solved={oppSolved} />
          </div>

          <div className="w-full mt-3 mb-1"><ColorKey /></div>

          <div className="mt-2">
            <GameKeyboard onKey={handleKey} keyStates={getKeyStates(player.guesses)} />
          </div>
        </>
      )}

      {/* RESULT */}
      {phase === 'done' && playerWon !== null && (
        <ResultScreen
          won={playerWon}
          timeMs={player.gameStatus === 'won' ? player.elapsedMs : (oppElapsedRef.current || player.elapsedMs)}
          guesses={player.guesses.length}
          opponentName="RIVAL"
          opponentTime={oppElapsedRef.current || undefined}
          xpEarned={playerWon ? XP_WIN : XP_LOSS}
          stats={stats}
          onPlayAgain={() => { if (soundRef.current) playClick(); onBack() }}
          onHome={() => { if (soundRef.current) playClick(); onBack() }}
          onShare={handleShare}
        />
      )}
    </div>
  )
}
