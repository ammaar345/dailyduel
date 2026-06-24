import { checkGuess, isValidWord } from './daily'

export interface guess {
  word: string
  result: ('correct' | 'present' | 'absent')[]
}

export interface GameState {
  guesses: guess[]
  currentGuess: string
  gameStatus: 'playing' | 'won' | 'lost'
  startTime: number
  elapsedMs: number
}

export function createGameState(): GameState {
  return {
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    startTime: Date.now(),
    elapsedMs: 0,
  }
}

export function handleKeyPress(
  key: string,
  state: GameState,
  targetWord: string,
  maxGuesses: number = 6
): { state: GameState; eventType?: 'key' | 'backspace' | 'enter' | 'correct' | 'present' | 'absent' | 'win' | 'lose' | 'invalid' } {
  if (state.gameStatus !== 'playing') return { state, eventType: undefined }

  if (key === '⌫') {
    return {
      state: {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1),
      },
      eventType: 'backspace',
    }
  }

  if (key === 'ENTER') {
    if (state.currentGuess.length !== 5) return { state, eventType: undefined }
    if (!isValidWord(state.currentGuess)) return { state, eventType: 'invalid' }

    const result = checkGuess(state.currentGuess, targetWord)
    const newGuesses = [...state.guesses, { word: state.currentGuess, result }]

    const won = result.every(r => r === 'correct')
    const lost = newGuesses.length >= maxGuesses && !won
    const elapsed = Date.now() - state.startTime

    return {
      state: {
        ...state,
        guesses: newGuesses,
        currentGuess: '',
        gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
        elapsedMs: elapsed,
      },
      eventType: won ? 'win' : lost ? 'lose' : (result as string[]).includes('correct') ? 'correct' : (result as string[]).includes('present') ? 'present' : 'absent',
    }
  }

  // Letter key
  if (/^[A-Z]$/.test(key) && state.currentGuess.length < 5) {
    return {
      state: {
        ...state,
        currentGuess: state.currentGuess + key,
      },
      eventType: 'key',
    }
  }

  return { state, eventType: undefined }
}

export function getKeyStates(guesses: guess[]): Record<string, 'correct' | 'present' | 'absent'> {
  const states: Record<string, 'correct' | 'present' | 'absent'> = {}

  for (const g of guesses) {
    for (let i = 0; i < g.word.length; i++) {
      const letter = g.word[i]
      const status = g.result[i]
      if (status === 'correct') {
        states[letter] = 'correct'
      } else if (status === 'present' && states[letter] !== 'correct') {
        states[letter] = 'present'
      } else if (!states[letter]) {
        states[letter] = 'absent'
      }
    }
  }

  return states
}
