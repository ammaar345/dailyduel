import { memo } from 'react'

interface TileProps {
  letter: string
  status: 'empty' | 'correct' | 'present' | 'absent'
  delay?: number
  /** md = full board (practice), sm = compact side-by-side duel boards */
  size?: 'md' | 'sm'
}

function getTileStyle(status: string): { bg: string; border: string; text: string } {
  switch (status) {
    case 'correct':
      return { bg: 'var(--tile-correct)', border: 'var(--tile-correct-border)', text: 'var(--tile-correct-text)' }
    case 'present':
      return { bg: 'var(--tile-present)', border: 'var(--tile-present-border)', text: 'var(--tile-present-text)' }
    case 'absent':
      return { bg: 'var(--tile-absent)', border: 'var(--tile-absent-border, #CFD8DC)', text: 'var(--tile-absent-text)' }
    default:
      return { bg: 'var(--tile-empty, #FFFFFF)', border: 'var(--tile-empty-border, #E8E4DF)', text: 'var(--text-primary, #4A5568)' }
  }
}

function TileInner({ letter, status, delay = 0, size = 'md' }: TileProps) {
  const isEmpty = status === 'empty' && !letter
  const colors = isEmpty ? null : getTileStyle(status)
  const sizeClasses = size === 'sm'
    ? 'w-[min(6.4vw,44px)] h-[min(6.4vw,44px)] text-[min(3.6vw,1.15rem)] rounded-lg border'
    : 'w-12 h-12 text-xl sm:w-14 sm:h-14 sm:text-2xl rounded-2xl border-2'

  return (
    <div
      className={`
        tile-dither relative flex items-center justify-center
        font-semibold transition-all duration-200 ${sizeClasses}
        ${isEmpty ? 'bg-[#FAFBFC] border-[#E8E4DF] text-transparent' : ''}
        ${status !== 'empty' ? 'animate-pop-in' : ''}
      `}
      style={{
        animationDelay: status !== 'empty' ? `${delay}ms` : undefined,
        ...(colors ? {
          background: colors.bg,
          borderColor: colors.border,
          color: colors.text,
        } : {}),
      }}
    >
      {letter}
    </div>
  )
}

export const Tile = memo(TileInner)
