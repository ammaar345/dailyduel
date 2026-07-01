import { useState, useEffect, useRef } from 'react'

interface GameTimerProps {
  startTime: number
  running: boolean
  className?: string
}

export function GameTimer({ startTime, running, className = '' }: GameTimerProps) {
  const [elapsed, setElapsed] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!running || !startTime) {
      setElapsed(0)
      return
    }

    const tick = () => {
      setElapsed(Date.now() - startTime)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [running, startTime])

  const seconds = (elapsed / 1000).toFixed(1)
  const mins = Math.floor(elapsed / 60000)
  const secs = ((elapsed % 60000) / 1000).toFixed(1)

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      <svg className="w-3.5 h-3.5 text-[#718096]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
      <span className="font-mono text-sm font-bold text-[#4A5568] tabular-nums tracking-tight">
        {mins > 0 ? `${mins}m ${secs}s` : `${seconds}s`}
      </span>
    </div>
  )
}
