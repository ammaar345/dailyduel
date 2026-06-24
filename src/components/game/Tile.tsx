import { memo } from 'react'

interface TileProps {
  letter: string
  status: 'empty' | 'correct' | 'present' | 'absent'
  delay?: number
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

function TileInner({ letter, status, delay = 0 }: TileProps) {
  const isEmpty = status === 'empty' && !letter
  const colors = isEmpty ? null : getTileStyle(status)

  return (
    <div
      className={`
        tile-dither relative w-14 h-14 flex items-center justify-center
        text-2xl font-semibold rounded-2xl transition-all duration-200 border-2
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
