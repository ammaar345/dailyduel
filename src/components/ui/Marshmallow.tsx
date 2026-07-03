import { useEffect, useId, useState } from 'react'

/**
 * Realistic marshmallow renderer.
 *
 * Two modes:
 * 1. SVG (default) — plump cylinder with gradient shading, powdery top and soft sheen.
 * 2. Image — if `public/marshmallow.png` exists (transparent PNG), it is auto-detected
 *    and used instead of the SVG for maximum realism. Drop the file in and refresh.
 */

interface MarshmallowTint {
  base: string
  shade: string
  glow: string
}

const TINTS: MarshmallowTint[] = [
  { base: '#FFF9F4', shade: '#E8D8CC', glow: '#FFFFFF' }, // classic white
  { base: '#FFEAF1', shade: '#EFC3D3', glow: '#FFF8FA' }, // strawberry pink
  { base: '#ECF9F2', shade: '#C9E5D5', glow: '#F9FFFC' }, // mint
  { base: '#FFF6E4', shade: '#EEDFC0', glow: '#FFFDF6' }, // toasted cream
]

const IMG_URL = `${import.meta.env.BASE_URL}marshmallow.png`

// Probe for the optional PNG once per session, shared across all instances
let imgProbe: Promise<boolean> | null = null
function probeMarshmallowImage(): Promise<boolean> {
  if (!imgProbe) {
    imgProbe = new Promise(resolve => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = IMG_URL
    })
  }
  return imgProbe
}

function useMarshmallowImage(): boolean {
  const [hasImg, setHasImg] = useState(false)
  useEffect(() => {
    let alive = true
    probeMarshmallowImage().then(ok => { if (alive && ok) setHasImg(true) })
    return () => { alive = false }
  }, [])
  return hasImg
}

export function MarshmallowSvg({ size, tint }: { size: number; tint: MarshmallowTint }) {
  const id = useId()
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Cylinder side — light hits centre-left */}
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={tint.shade} />
          <stop offset="0.3" stopColor={tint.base} />
          <stop offset="0.58" stopColor={tint.glow} />
          <stop offset="1" stopColor={tint.shade} />
        </linearGradient>
        {/* Powdery top face */}
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tint.glow} />
          <stop offset="1" stopColor={tint.base} />
        </linearGradient>
        {/* Soft sheen */}
        <radialGradient id={`${id}-sheen`} cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Cylinder body with rounded bottom */}
      <path d="M6 14 L6 40 A18 9 0 0 0 42 40 L42 14 Z" fill={`url(#${id}-body)`} />

      {/* Bottom contact shading */}
      <path d="M6 38 L6 40 A18 9 0 0 0 42 40 L42 38 A18 9 0 0 1 6 38 Z" fill={tint.shade} opacity="0.45" />

      {/* Top cap */}
      <ellipse cx="24" cy="14" rx="18" ry="9" fill={`url(#${id}-top)`} />
      {/* Powder ring on top */}
      <ellipse cx="24" cy="13.4" rx="14" ry="6.4" fill={tint.glow} opacity="0.75" />

      {/* Side sheen */}
      <ellipse cx="17" cy="29" rx="7" ry="12" fill={`url(#${id}-sheen)`} />

      {/* Powder specks */}
      <circle cx="29" cy="24" r="0.9" fill="#FFFFFF" opacity="0.5" />
      <circle cx="14" cy="34" r="0.7" fill="#FFFFFF" opacity="0.4" />
      <circle cx="33" cy="33" r="0.8" fill={tint.shade} opacity="0.25" />
    </svg>
  )
}

interface Drop {
  left: string
  size: number
  duration: number
  delay: number
  opacity: number
  tint: number
}

// Hand-tuned spread — stable across renders, no Math.random() churn
const DROPS: Drop[] = [
  { left: '4%', size: 26, duration: 22, delay: 0, opacity: 0.8, tint: 0 },
  { left: '12%', size: 18, duration: 28, delay: -9, opacity: 0.55, tint: 1 },
  { left: '20%', size: 32, duration: 19, delay: -14, opacity: 0.9, tint: 2 },
  { left: '28%', size: 20, duration: 26, delay: -4, opacity: 0.6, tint: 3 },
  { left: '37%', size: 24, duration: 23, delay: -18, opacity: 0.75, tint: 0 },
  { left: '45%', size: 16, duration: 30, delay: -11, opacity: 0.5, tint: 1 },
  { left: '53%', size: 28, duration: 21, delay: -6, opacity: 0.85, tint: 3 },
  { left: '61%', size: 19, duration: 27, delay: -20, opacity: 0.55, tint: 2 },
  { left: '69%', size: 30, duration: 20, delay: -2, opacity: 0.9, tint: 0 },
  { left: '77%', size: 17, duration: 29, delay: -16, opacity: 0.5, tint: 1 },
  { left: '84%', size: 25, duration: 24, delay: -8, opacity: 0.75, tint: 2 },
  { left: '91%', size: 21, duration: 25, delay: -13, opacity: 0.65, tint: 3 },
  { left: '96%', size: 15, duration: 31, delay: -22, opacity: 0.45, tint: 0 },
  { left: '33%', size: 14, duration: 32, delay: -25, opacity: 0.4, tint: 2 },
]

interface MarshmallowRainProps {
  count?: number
  /** Multiplier on fall speed — higher = faster (e.g. 5 for celebration bursts) */
  speed?: number
  className?: string
}

export function MarshmallowRain({ count = 14, speed = 1, className = '' }: MarshmallowRainProps) {
  const hasImg = useMarshmallowImage()
  const drops = DROPS.slice(0, count)

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute animate-marshmallow-rain"
          style={{
            left: d.left,
            top: '-60px',
            opacity: d.opacity,
            animationDuration: `${d.duration / speed}s`,
            animationDelay: `${d.delay / speed}s`,
          }}
        >
          {hasImg ? (
            <img
              src={IMG_URL}
              width={d.size}
              alt=""
              draggable={false}
              style={{ height: 'auto', transform: `rotate(${(i * 47) % 360}deg)` }}
            />
          ) : (
            <MarshmallowSvg size={d.size} tint={TINTS[d.tint]} />
          )}
        </div>
      ))}
    </div>
  )
}
