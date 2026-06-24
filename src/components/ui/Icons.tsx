import { memo } from 'react'

interface IconProps {
  size?: number
  className?: string
}

// Marshmallow Crown — soft, rounded, bubbly
export const CrownIcon = memo(function CrownIcon({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path
        d="M12 48c0-2 1-3 3-3h34c2 0 3 1 3 3v3c0 1-1 2-2 2H11c-1 0-2-1-2-2v-3z"
        fill="currentColor" opacity="0.25"
      />
      <path
        d="M14 44V28l10 8 8-14 8 14 10-8v16c0 2-1 3-3 3H17c-2 0-3-1-3-3z"
        fill="currentColor"
      />
      <circle cx="14" cy="26" r="4" fill="currentColor" opacity="0.7" />
      <circle cx="32" cy="18" r="5" fill="currentColor" />
      <circle cx="50" cy="26" r="4" fill="currentColor" opacity="0.7" />
      <circle cx="23" cy="22" r="2.5" fill="white" opacity="0.5" />
      <circle cx="32" cy="15" r="2.5" fill="white" opacity="0.5" />
      <circle cx="41" cy="22" r="2.5" fill="white" opacity="0.5" />
    </svg>
  )
})

// Marshmallow Gear/Cog — bubbly cloud-shaped settings icon
export const GearIcon = memo(function GearIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3.5" fill="currentColor" opacity="0.3" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      {/* Bubbly teeth around the gear */}
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

// Marshmallow Sword — rounded, bubbly duel icon
export const SwordIcon = memo(function SwordIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M5 19L10 14M18 6L14 10M10 14l-1.5-1.5M14 10l1.5 1.5M10 14l4-4"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M14 6l4 4-2 2-4-4 2-2zM10 14l-4 4-2-2 4-4"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
    </svg>
  )
})

// Marshmallow Fire — soft rounded flame
export const FireIcon = memo(function FireIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2c1 3-2 5-2 8 0 2 1 3 2 4 1-1 2-2 2-4 0-3-3-5-2-8z"
        fill="currentColor" opacity="0.5"
      />
      <path
        d="M12 22c-4 0-6-3-6-6 0-4 3-6 4-8 0 3 2 4 2 4s2-1 2-4c1 2 4 4 4 8 0 3-2 6-6 6z"
        fill="currentColor"
      />
      <path
        d="M12 22c-2 0-3-1.5-3-3.5 0-2 1.5-3 2-4 .5 1 2 2 2 4 0 2-1 3.5-1 3.5z"
        fill="white" opacity="0.3"
      />
    </svg>
  )
})

// Marshmallow Star — bubbly, rounded
export const StarIcon = memo(function StarIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.5 6.5H21l-5.3 4 2 6.5L12 15l-5.7 4 2-6.5L3 8.5h6.5z" />
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

// Marshmallow Heart for streak
export const HeartIcon = memo(function HeartIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21s-7-4.5-9-9c-1.5-3.5 0-7 3.5-8.5S12 4 12 4s2-.5 5.5 1c3.5 1.5 5 5 3.5 8.5-2 4.5-9 7.5-9 7.5z" />
    </svg>
  )
})

// Marshmallow Trophy for best time
export const TrophyIcon = memo(function TrophyIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 4h10v8c0 3-2 5-5 5s-5-2-5-5V4z" fill="currentColor" />
      <path d="M7 6H4c0 3 2 5 3 5V6zM17 6h3c0 3-2 5-3 5V6z" fill="currentColor" opacity="0.5" />
      <rect x="10" y="17" width="4" height="3" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="7" y="20" width="10" height="2" rx="1" fill="currentColor" opacity="0.8" />
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
