import { Tile } from './Tile'
import type { guess } from '../../lib/gameLogic'
import { CrownIcon } from '../ui/Icons'

interface DuelBoardProps {
  playerName: string
  guesses: guess[]
  currentGuess: string
  isCurrentPlayer?: boolean
  solved: boolean
}

export function DuelBoard({ playerName, guesses, currentGuess, isCurrentPlayer, solved }: DuelBoardProps) {
  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-3xl border-2 transition-all duration-300 ${
      isCurrentPlayer
        ? 'border-indigo-300 bg-indigo-50/80 shadow-md'
        : 'border-slate-200 bg-white/60'
    } ${solved ? 'animate-pulse-soft' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        {solved && <CrownIcon size={22} className="text-amber-400 animate-float" />}
        <span className={`text-xs font-bold tracking-wider uppercase ${
          isCurrentPlayer ? 'text-indigo-500' : 'text-slate-400'
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
