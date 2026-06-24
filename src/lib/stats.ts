export interface Stats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  bestTime: number
  totalPlayTime: number
  lastPlayed: number
  xp: number
  level: number
  // Rivalry tracking
  rivals: Record<string, { wins: number; losses: number; lastPlayed: number }>
}

const DEFAULT_STATS: Stats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  bestTime: 0,
  totalPlayTime: 0,
  lastPlayed: 0,
  xp: 0,
  level: 1,
  rivals: {},
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem('dailyduel-stats')
    if (!raw) return DEFAULT_STATS
    return { ...DEFAULT_STATS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATS
  }
}

export function saveStats(stats: Stats): void {
  localStorage.setItem('dailyduel-stats', JSON.stringify(stats))
}

export function addXP(amount: number): (s: Stats) => Stats {
  return (s) => {
    const newXP = s.xp + amount
    const newLevel = Math.floor(newXP / 100) + 1
    return { ...s, xp: newXP, level: newLevel }
  }
}

export function getRank(level: number): string {
  if (level >= 100) return 'CROWN'
  if (level >= 75) return 'DIAMOND'
  if (level >= 50) return 'PLATINUM'
  if (level >= 30) return 'GOLD'
  if (level >= 15) return 'SILVER'
  return 'BRONZE'
}

export function getRankColor(rank: string): string {
  switch (rank) {
    case 'CROWN': return 'text-amber-500'
    case 'DIAMOND': return 'text-cyan-500'
    case 'PLATINUM': return 'text-indigo-400'
    case 'GOLD': return 'text-amber-400'
    case 'SILVER': return 'text-slate-400'
    default: return 'text-amber-400'
  }
}
