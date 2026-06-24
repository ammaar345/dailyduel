import { getWordForDate } from './words'

export interface Puzzle {
  word: string
  date: string
  seed: number
}

export function getDailyPuzzle(): Puzzle {
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0]
  const word = getWordForDate(now)
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()

  return { word, date: dateStr, seed }
}

export function checkGuess(guess: string, target: string): ('correct' | 'present' | 'absent')[] {
  const result: ('correct' | 'present' | 'absent')[] = Array(5).fill('absent')
  const targetChars = target.split('')
  const guessChars = guess.split('')

  // First pass: correct positions
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = 'correct'
      targetChars[i] = '#'
      guessChars[i] = '#'
    }
  }

  // Second pass: wrong positions
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === '#') continue
    const idx = targetChars.indexOf(guessChars[i])
    if (idx !== -1) {
      result[i] = 'present'
      targetChars[idx] = '#'
    }
  }

  return result
}

export function isValidWord(word: string): boolean {
  // For MVP, accept any 5-letter combination
  return word.length === 5
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}
