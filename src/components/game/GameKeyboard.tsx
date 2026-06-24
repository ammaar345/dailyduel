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

function getKeyStyle(state?: string): string {
  switch (state) {
    case 'correct': return 'bg-emerald-400 text-white shadow-sm'
    case 'present': return 'bg-amber-400 text-white shadow-sm'
    case 'absent': return 'bg-slate-200 text-slate-400'
    default: return 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
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
            const style = getKeyStyle(state)

            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={`
                  kb-key h-14 font-bold text-sm
                  flex items-center justify-center cursor-pointer
                  select-none
                  ${isWide ? 'w-[68px] text-xs' : 'w-10'}
                  ${style}
                `}
              >
                {key === '⌫' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                    <line x1="18" y1="9" x2="12" y2="15" />
                    <line x1="12" y1="9" x2="18" y2="15" />
                  </svg>
                ) : key === 'ENTER' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 10 4 15 9 20" />
                    <path d="M20 4v7a4 4 0 01-4 4H4" />
                  </svg>
                ) : key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export const GameKeyboard = memo(GameKeyboardInner)
