import { memo } from 'react'

interface TileProps {
  letter: string
  status: 'empty' | 'correct' | 'present' | 'absent'
  delay?: number
}

function getTileStyle(status: string): string {
  switch (status) {
    case 'correct':
      return 'bg-emerald-100 border-2 border-emerald-300 text-emerald-700 shadow-sm'
    case 'present':
      return 'bg-amber-100 border-2 border-amber-300 text-amber-700 shadow-sm'
    case 'absent':
      return 'bg-slate-100 border-2 border-slate-200 text-slate-400'
    default:
      return 'bg-white border-2 border-slate-200 text-slate-700'
  }
}

function TileInner({ letter, status, delay = 0 }: TileProps) {
  const style = status === 'empty' && !letter
    ? 'bg-white/50 border-2 border-slate-100 text-transparent'
    : getTileStyle(status)

  return (
    <div
      className={`
        tile-dither relative w-14 h-14 flex items-center justify-center
        text-2xl font-bold rounded-2xl transition-all duration-200
        ${style}
        ${status !== 'empty' ? 'animate-pop-in' : ''}
      `}
      style={{
        animationDelay: status !== 'empty' ? `${delay}ms` : undefined,
      }}
    >
      {letter}
    </div>
  )
}

export const Tile = memo(TileInner)
