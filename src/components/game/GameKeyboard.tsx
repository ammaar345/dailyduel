import { memo } from 'react'

interface GameKeyboardProps {
  onKey: (key: string) => void
  keyStates: Record<string, 'correct' | 'present' | 'absent'>
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

function getKeyBg(state?: string): string {
  switch (state) {
    case 'correct': return 'bg-green-500 text-white'
    case 'present': return 'bg-yellow-500 text-white'
    case 'absent': return 'bg-zinc-700 text-zinc-400'
    default: return 'bg-zinc-800 hover:bg-zinc-700 text-white'
  }
}

function GameKeyboardInner({ onKey, keyStates }: GameKeyboardProps) {
  return (
    <div className="flex flex-col gap-1.5 items-center mt-4">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1.5">
          {row.map((key) => {
            const isWide = key === 'ENTER' || key === '⌫'
            const state = keyStates[key]
            const bg = getKeyBg(state)

            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={`
                  kb-key h-14 rounded-lg font-bold text-sm
                  flex items-center justify-center cursor-pointer
                  select-none transition-colors
                  ${isWide ? 'w-[68px] text-xs' : 'w-10'}
                  ${bg}
                `}
              >
                {key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export const GameKeyboard = memo(GameKeyboardInner)
