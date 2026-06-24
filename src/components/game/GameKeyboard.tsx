import { memo, useEffect } from 'react'

interface GameKeyboardProps {
  onKey: (key: string) => void
  keyStates: Record<string, 'correct' | 'present' | 'absent'>
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

function getKeyColors(state?: string): { bg: string; text: string; border?: string } {
  switch (state) {
    case 'correct': return { bg: 'var(--tile-correct-border, #81C784)', text: 'var(--tile-correct-text, #FFFFFF)' }
    case 'present': return { bg: 'var(--tile-present-border, #FFD54F)', text: 'var(--tile-present-text, #4A5568)' }
    case 'absent': return { bg: 'var(--tile-absent)', text: 'var(--tile-absent-text)' }
    default: return { bg: 'var(--tile-empty)', text: 'var(--text-primary)', border: 'var(--tile-empty-border)' }
  }
}

function GameKeyboardInner({ onKey, keyStates }: GameKeyboardProps) {
  const handleClick = (key: string) => {
    const button = document.querySelector(`button[data-key="${key}"]`)
    button?.classList.add('pressed')
    setTimeout(() => button?.classList.remove('pressed'), 200)
    onKey(key)
  }

  // Add click animation to on-screen keyboard when pressed
  useEffect(() => {
    const handlePhysicalKey = (e: KeyboardEvent) => {
      const key = e.key === 'Enter' ? 'ENTER' : e.key === 'Backspace' ? '⌫' : e.key.toUpperCase()
      const button = document.querySelector(`button[data-key="${key}"]`)
      button?.classList.add('pressed')
      setTimeout(() => button?.classList.remove('pressed'), 200)
    }
    window.addEventListener('keydown', handlePhysicalKey)
    return () => window.removeEventListener('keydown', handlePhysicalKey)
  }, [])

  return (
    <div className="flex flex-col gap-1.5 items-center mt-4">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1.5">
          {row.map((key) => {
            const isWide = key === 'ENTER' || key === '⌫'
            const state = keyStates[key]
            const colors = getKeyColors(state)

            return (
              <button
                key={key}
                data-key={key}
                onClick={() => handleClick(key)}
                className={`
                  kb-key h-14 font-semibold text-sm
                  flex items-center justify-center cursor-pointer
                  select-none
                  ${isWide ? 'w-[68px] text-xs' : 'w-10'}
                `}
                style={{
                  background: colors.bg,
                  color: colors.text,
                  border: colors.border ? `1.5px solid ${colors.border}` : 'none',
                }}
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
