import { checkGuess } from './daily'
import { isInDictionary } from './dictionary'
import { getAllAnswers } from './words'

/**
 * Smart bot solver for DailyDuel.
 * Uses real Wordle strategy: common-letter-first elimination.
 *
 * Strategy:
 * 1. Open with a high-vowel / common-consonant word (like CRANE or SAUCE)
 * 2. Filter remaining possible answers based on tile feedback
 * 3. Pick the next guess that maximizes letter frequency coverage among remaining candidates
 * 4. Always guesses real dictionary words
 */

// Common opening words ranked by letter frequency coverage
const OPENERS = ['CRANE', 'SLATE', 'SAUCE', 'RAISE', 'ARISE', 'STARE', 'SNARE', 'IRATE']

// Letter frequency in English (approximate, for 5-letter words)
const LETTER_FREQ: Record<string, number> = {
  E: 12.7, T: 9.1, A: 8.2, O: 7.5, I: 7.0, N: 6.7, S: 6.3, H: 6.1, R: 6.0,
  D: 4.3, L: 4.0, C: 2.8, U: 2.8, M: 2.4, W: 2.4, F: 2.2, G: 2.0, Y: 2.0,
  P: 1.9, B: 1.5, V: 1.0, K: 0.8, J: 0.2, X: 0.2, Q: 0.1, Z: 0.1,
}

function scoreWord(word: string, remaining: string[]): number {
  let score = 0
  const letters = new Set(word.split(''))
  for (const letter of letters) {
    score += LETTER_FREQ[letter] || 0
  }
  // Bonus: how many remaining answers share letters with this word
  let overlap = 0
  for (const candidate of remaining) {
    let matches = 0
    for (let i = 0; i < 5; i++) {
      if (word.includes(candidate[i])) matches++
    }
    if (matches >= 3) overlap++
  }
  score += (overlap / Math.max(remaining.length, 1)) * 5
  return score
}

// Filter possible answers based on guess results
function filterCandidates(
  candidates: string[],
  guess: string,
  result: ('correct' | 'present' | 'absent')[]
): string[] {
  return candidates.filter(candidate => {
    for (let i = 0; i < 5; i++) {
      const gLetter = guess[i]
      const status = result[i]

      if (status === 'correct') {
        if (candidate[i] !== gLetter) return false
      } else if (status === 'present') {
        if (candidate[i] === gLetter) return false
        if (!candidate.includes(gLetter)) return false
      } else {
        // absent: but the letter might appear as correct/present elsewhere
        const hasCorrectElsewhere = guess.split('').some((l: string, j: number) => j !== i && l === gLetter && (result[j] === 'correct' || result[j] === 'present'))
        if (hasCorrectElsewhere) {
          if (candidate[i] === gLetter) return false
        } else {
          if (candidate.includes(gLetter)) return false
        }
      }
    }
    return true
  })
}

export interface BotGuess {
  word: string
  result: ('correct' | 'present' | 'absent')[]
}

export interface BotSolver {
  guesses: BotGuess[]
  candidates: string[]
  solved: boolean
}

export function createBotSolver(): BotSolver {
  return {
    guesses: [],
    candidates: [...getAllAnswers()],
    solved: false,
  }
}

export function botMakeGuess(solver: BotSolver, targetWord: string): BotSolver {
  if (solver.solved) return solver

  let guess: string

  if (solver.guesses.length === 0) {
    guess = OPENERS[Math.floor(Math.random() * OPENERS.length)]
  } else if (solver.candidates.length <= 2) {
    guess = solver.candidates[0]
  } else {
    let best = solver.candidates[0]
    let bestScore = -1

    const candidatesToScore = solver.candidates.length > 20
      ? solver.candidates.slice(0, 30)
      : solver.candidates

    for (const word of candidatesToScore) {
      const s = scoreWord(word, solver.candidates)
      if (s > bestScore) {
        bestScore = s
        best = word
      }
    }
    guess = best
  }

  // Fallback if guess not in dictionary
  if (!isInDictionary(guess)) {
    guess = solver.candidates[0]
  }

  const result = checkGuess(guess, targetWord)
  const isSolved = result.every(r => r === 'correct')

  const newCandidates = isSolved
    ? []
    : filterCandidates(solver.candidates, guess, result)

  return {
    guesses: [...solver.guesses, { word: guess, result }],
    candidates: newCandidates,
    solved: isSolved,
  }
}
