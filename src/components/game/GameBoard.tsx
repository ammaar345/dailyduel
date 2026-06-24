import { Tile } from './Tile'
import type { guess } from '../../lib/gameLogic'

interface GameBoardProps {
  guesses: guess[]
  currentGuess: string
  maxGuesses: number
  shakeRow?: number | null
}

export function GameBoard({ guesses, currentGuess, maxGuesses, shakeRow }: GameBoardProps) {
  return (
    <div className="flex flex-col gap-1.5 items-center">
      {Array.from({ length: maxGuesses }).map((_, rowIdx) => {
        const guessData = guesses[rowIdx]
        const isCurrentRow = rowIdx === guesses.length

        return (
          <div
            key={rowIdx}
            className={`flex gap-1.5 ${shakeRow === rowIdx ? 'animate-shake' : ''}`}
          >
            {Array.from({ length: 5 }).map((_, colIdx) => {
              if (guessData) {
                return (
                  <Tile
                    key={colIdx}
                    letter={guessData.word[colIdx] ?? ''}
                    status={guessData.result[colIdx]}
                    delay={colIdx * 100}
                  />
                )
              }
              if (isCurrentRow && colIdx < currentGuess.length) {
                return (
                  <Tile
                    key={colIdx}
                    letter={currentGuess[colIdx]}
                    status="empty"
                  />
                )
              }
              return <Tile key={colIdx} letter="" status="empty" />
            })}
          </div>
        )
      })}
    </div>
  )
}
