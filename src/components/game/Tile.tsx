import { memo } from 'react'

interface TileProps {
  letter: string
  status: 'empty' | 'correct' | 'present' | 'absent'
  delay?: number
}

function getBg(status: string): string {
  switch (status) {
    case 'correct': return 'bg-green-500'
    case 'present': return 'bg-yellow-500'
    case 'absent': return 'bg-zinc-700'
    default: return 'bg-zinc-800 border-2 border-zinc-600'
  }
}

function TileInner({ letter, status, delay = 0 }: TileProps) {
  const bg = status === 'empty' ? 'bg-transparent border-2 border-zinc-600' : getBg(status)

  return (
    <div
      className={`
        tile-dither relative w-14 h-14 flex items-center justify-center
        text-2xl font-bold rounded-lg transition-all duration-200
        ${bg}
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
