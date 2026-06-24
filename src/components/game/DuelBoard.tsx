import { Tile } from './Tile'
import type { guess } from '../../lib/gameLogic'

interface DuelBoardProps {
  playerName: string
  guesses: guess[]
  currentGuess: string
  isCurrentPlayer?: boolean
  solved: boolean
}

export function DuelBoard({ playerName, guesses, currentGuess, isCurrentPlayer, solved }: DuelBoardProps) {
  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${
      isCurrentPlayer ? 'border-purple-500 bg-purple-500/10' : 'border-zinc-700 bg-zinc-900'
    } ${solved ? 'animate-pulse-glow' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        {solved && <span className="text-2xl animate-crown">👑</span>}
        <span className={`text-sm font-bold tracking-wider ${
          isCurrentPlayer ? 'text-purple-400' : 'text-zinc-400'
        }`}>
          {playerName}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {Array.from({ length: 6 }).map((_, rowIdx) => {
          const guessData = guesses[rowIdx]
          const isCurrentRow = rowIdx === guesses.length

          return (
            <div key={rowIdx} className="flex gap-1">
              {Array.from({ length: 5 }).map((_, colIdx) => {
                if (guessData) {
                  return (
                    <Tile
                      key={colIdx}
                      letter={guessData.word[colIdx] ?? ''}
                      status={guessData.result[colIdx]}
                      delay={colIdx * 60}
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
    </div>
  )
}
