// Async friend-challenge system (PvP without a server).
// Flow: you win -> your result is stored -> challenge link carries date + time + guesses
// -> friend opens link, plays the same puzzle against your ghost time
// -> their result screen compares against you -> they share back. Viral ping-pong.

export interface ChallengeResult {
  timeMs: number
  guesses: number
}

export interface Challenge {
  date: string
  result: ChallengeResult | null
}

const resultKey = (date: string) => `dailyduel-result-${date}`

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Store your fastest winning result for a puzzle date (used in challenge links). */
export function saveDayResult(date: string, timeMs: number, guesses: number): void {
  try {
    const existing = getDayResult(date)
    if (existing && existing.timeMs <= timeMs) return // keep the fastest
    localStorage.setItem(resultKey(date), JSON.stringify({ timeMs: Math.round(timeMs), guesses }))
  } catch { /* storage full/blocked — challenge link just won't carry a time */ }
}

export function getDayResult(date: string): ChallengeResult | null {
  try {
    const raw = localStorage.getItem(resultKey(date))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed.timeMs !== 'number' || typeof parsed.guesses !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

/** Build a shareable challenge URL. Includes your result if you've won today. */
export function buildChallengeUrl(): string {
  const date = todayStr()
  const base = `${window.location.origin}${window.location.pathname}`
  const result = getDayResult(date)
  const params = new URLSearchParams({ challenge: date })
  if (result) {
    params.set('t', String(result.timeMs))
    params.set('g', String(result.guesses))
  }
  return `${base}?${params.toString()}`
}

/** Parse an incoming challenge from the current URL. */
export function parseChallenge(): Challenge | null {
  const params = new URLSearchParams(window.location.search)
  const date = params.get('challenge')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const t = Number(params.get('t'))
  const g = Number(params.get('g'))
  const result = t > 0 && g > 0 && g <= 6 ? { timeMs: t, guesses: g } : null
  return { date, result }
}
