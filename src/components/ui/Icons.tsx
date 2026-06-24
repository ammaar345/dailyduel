import { memo } from 'react'

interface IconProps {
  size?: number
  className?: string
}

// Marshmallow Crown — darker gold, depth shading, sparkle detail
export const CrownIcon = memo(function CrownIcon({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Base band */}
      <rect x="10" y="44" width="44" height="8" rx="4" fill="currentColor" opacity="0.35" />
      <rect x="10" y="44" width="44" height="5" rx="2.5" fill="currentColor" />
      {/* Crown body — three peaks */}
      <path
        d="M10 44V26l12 10 10-16 10 16 12-10v18c0 3-2 5-5 5H15c-3 0-5-2-5-5z"
        fill="currentColor"
      />
      {/* Peak tip glows */}
      <circle cx="10" cy="24" r="5" fill="currentColor" opacity="0.6" />
      <circle cx="32" cy="14" r="6" fill="currentColor" opacity="0.8" />
      <circle cx="54" cy="24" r="5" fill="currentColor" opacity="0.6" />
      {/* Inner gem on center peak */}
      <circle cx="32" cy="20" r="3" fill="white" opacity="0.35" />
      <circle cx="32" cy="19" r="1.5" fill="white" opacity="0.5" />
      {/* Side gem highlights */}
      <circle cx="10" cy="23" r="2" fill="white" opacity="0.3" />
      <circle cx="54" cy="23" r="2" fill="white" opacity="0.3" />
      {/* Base band detail */}
      <circle cx="20" cy="47.5" r="2" fill="white" opacity="0.25" />
      <circle cx="32" cy="47.5" r="2" fill="white" opacity="0.25" />
      <circle cx="44" cy="47.5" r="2" fill="white" opacity="0.25" />
    </svg>
  )
})

// Marshmallow Gear/Cog — bubbly cloud-shaped settings icon
export const GearIcon = memo(function GearIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3.5" fill="currentColor" opacity="0.3" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="4.5" r="2.5" fill="currentColor" opacity="0.8" />
      <circle cx="12" cy="19.5" r="2.5" fill="currentColor" opacity="0.8" />
      <circle cx="4.5" cy="12" r="2.5" fill="currentColor" opacity="0.8" />
      <circle cx="19.5" cy="12" r="2.5" fill="currentColor" opacity="0.8" />
      <circle cx="6.8" cy="6.8" r="2.2" fill="currentColor" opacity="0.7" />
      <circle cx="17.2" cy="17.2" r="2.2" fill="currentColor" opacity="0.7" />
      <circle cx="6.8" cy="17.2" r="2.2" fill="currentColor" opacity="0.7" />
      <circle cx="17.2" cy="6.8" r="2.2" fill="currentColor" opacity="0.7" />
    </svg>
  )
})

// Marshmallow Sword — detailed rounded duel icon with hilt
export const SwordIcon = memo(function SwordIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Blade 1 — diagonal */}
      <path d="M5 19L17 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M5 19L8 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Blade 2 — crossing */}
      <path d="M19 5L7 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M19 5L16 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Center cross-guard bubble */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.3" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      {/* Tip sparkles */}
      <circle cx="5" cy="19" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="19" cy="5" r="1.2" fill="currentColor" opacity="0.5" />
    </svg>
  )
})

// Marshmallow Fire — multi-layer flame with inner glow
export const FireIcon = memo(function FireIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Outer flame */}
      <path
        d="M12 22c-5 0-7-3.5-7-7 0-4.5 3-7 4.5-9.5 0 3 2.5 4.5 2.5 4.5s2.5-1.5 2.5-4.5C16 7.5 19 10.5 19 15c0 3.5-2 7-7 7z"
        fill="currentColor"
      />
      {/* Middle flame — lighter */}
      <path
        d="M12 22c-3 0-4.5-2-4.5-4.5 0-3 2-4.5 3-6 0 2 1.5 3 1.5 3s1.5-1 1.5-3c1 1.5 3 3 3 6 0 2.5-1.5 4.5-4.5 4.5z"
        fill="currentColor" opacity="0.6"
      />
      {/* Inner glow — white hot core */}
      <path
        d="M12 22c-1.5 0-2.5-1-2.5-2.5 0-1.5 1-2.5 1.5-3 .5.5 1 1 1 1s.5-.5 1-1c.5.5 1.5 1.5 1.5 3 0 1.5-1 2.5-2.5 2.5z"
        fill="white" opacity="0.4"
      />
    </svg>
  )
})

// Marshmallow Star — bubbly, rounded with shine
export const StarIcon = memo(function StarIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.8 6.2H21l-5.2 4.2 2 6.6L12 15l-5.8 4 2-6.6L3 8.2h6.2z" />
      <circle cx="10" cy="8" r="1.2" fill="white" opacity="0.35" />
    </svg>
  )
})

// Marshmallow Clipboard — for share
export const ClipboardIcon = memo(function ClipboardIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="4" width="14" height="18" rx="3" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="2" width="8" height="4" rx="2" fill="currentColor" />
      <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="18" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
})

// Marshmallow Back Arrow
export const BackIcon = memo(function BackIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
      <path d="M14 8l-4 4 4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
})

// Marshmallow Close X
export const CloseIcon = memo(function CloseIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
})

// Marshmallow Skull for defeat
export const SkullIcon = memo(function SkullIcon({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <ellipse cx="32" cy="30" rx="20" ry="22" fill="currentColor" opacity="0.15" />
      <ellipse cx="32" cy="28" rx="18" ry="20" fill="currentColor" />
      <circle cx="24" cy="26" r="5" fill="white" />
      <circle cx="40" cy="26" r="5" fill="white" />
      <circle cx="24" cy="27" r="2.5" fill="currentColor" opacity="0.6" />
      <circle cx="40" cy="27" r="2.5" fill="currentColor" opacity="0.6" />
      <ellipse cx="32" cy="36" rx="3" ry="2.5" fill="white" opacity="0.5" />
      <rect x="26" y="46" width="3" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
      <rect x="31" y="46" width="3" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
      <rect x="36" y="46" width="3" height="5" rx="1.5" fill="currentColor" opacity="0.8" />
    </svg>
  )
})

// Marshmallow Heart for streak — chunky with shine bubble
export const HeartIcon = memo(function HeartIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21s-7.5-4.5-9.5-9.5C1 8 2.5 4.5 6 3.5S12 4 12 4s3.5-.5 6 1.5c3.5 1.5 5 5 3.5 8-2 5-9.5 7.5-9.5 7.5z" />
      {/* Shine bubble */}
      <ellipse cx="8.5" cy="8" rx="2" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 8.5 8)" />
    </svg>
  )
})

// Marshmallow Trophy — wider cup, handles, sparkle accents, star detail
export const TrophyIcon = memo(function TrophyIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Cup body */}
      <path d="M7 3h10v7c0 3.5-2 6-5 6s-5-2.5-5-6V3z" fill="currentColor" />
      {/* Left handle */}
      <path d="M7 5H4.5c0 3.5 1.5 5.5 3 5.5V5z" fill="currentColor" opacity="0.5" />
      {/* Right handle */}
      <path d="M17 5h2.5c0 3.5-1.5 5.5-3 5.5V5z" fill="currentColor" opacity="0.5" />
      {/* Stem */}
      <rect x="10.5" y="16" width="3" height="2.5" rx="1" fill="currentColor" opacity="0.7" />
      {/* Base */}
      <rect x="7" y="18.5" width="10" height="2.5" rx="1.25" fill="currentColor" opacity="0.85" />
      {/* Star on cup */}
      <path d="M12 5.5l1 2h2.2l-1.7 1.4.6 2.2L12 9.5l-2.1 1.6.6-2.2L8.8 7.5H11z" fill="white" opacity="0.35" />
      {/* Shine */}
      <ellipse cx="9.5" cy="6" rx="1" ry="1.5" fill="white" opacity="0.25" transform="rotate(-10 9.5 6)" />
    </svg>
  )
})

// Marshmallow Play button
export const PlayIcon = memo(function PlayIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
})

// Marshmallow X for close (smaller, for button)
export const XIcon = memo(function XIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
})

// Target/crosshair icon for Practice Mode
export const TargetIcon = memo(function TargetIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Outer ring */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      {/* Middle ring */}
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      {/* Bullseye */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      {/* Crosshair lines */}
      <line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
})

// Crossed Swords icon for Duel Mode
export const CrossedSwordsIcon = memo(function CrossedSwordsIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Sword 1 — bottom-left to top-right */}
      <path d="M4 20L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 20l3-1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 6l-1 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Sword 2 — top-left to bottom-right */}
      <path d="M20 20L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 20l-3-1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M6 6l1 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Shield in center */}
      <circle cx="12" cy="13" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="13" r="1.2" fill="currentColor" />
    </svg>
  )
})
