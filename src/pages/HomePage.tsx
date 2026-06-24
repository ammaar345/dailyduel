import type { Stats } from '../lib/stats'
import type { Settings } from '../lib/settings'
import { getRank, getRankColor } from '../lib/stats'
import { playClick } from '../lib/sounds'
import { CrownIcon, GearIcon, SwordIcon, FireIcon, TrophyIcon, HeartIcon } from '../components/ui/Icons'

interface HomePageProps {
  stats: Stats
  settings: Settings
  onNavigate: (page: 'practice' | 'duel' | 'stats' | 'settings') => void
  onSettings: () => void
}

export function HomePage({ stats, settings, onNavigate, onSettings }: HomePageProps) {
  const rank = getRank(stats.level)
  const rankColor = getRankColor(rank)
  const xpInLevel = stats.xp % 100

  const handleNav = (page: 'practice' | 'duel') => {
    if (settings.sound) playClick()
    onNavigate(page)
  }

  return (
    <div className="min-h-dvh flex flex-col items-center px-4 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-black tracking-tight mb-1 text-slate-700">
          daily<span className="text-indigo-400">duel</span>
        </h1>
        <p className="text-slate-400 text-xs tracking-widest uppercase font-semibold">head-to-head word battles</p>
      </div>

      {/* Crown */}
      <div className="mb-5 animate-float">
        <CrownIcon size={64} className="text-amber-400 drop-shadow-sm" />
      </div>

      {/* Rank Card */}
      <div className="w-full marsh-card p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Rank</span>
          <span className={`text-sm font-black ${rankColor}`}>{rank}</span>
        </div>
        <div className="w-full bg-indigo-50 rounded-full h-3 mb-2 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${xpInLevel}%`,
              background: 'linear-gradient(90deg, #a5b4fc, #818cf8)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 font-semibold">
          <span>Lv {stats.level}</span>
          <span>{xpInLevel}/100 XP</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 w-full mb-8">
        <div className="marsh-card p-4 text-center">
          <div className="flex justify-center mb-1">
            <TrophyIcon size={18} className="text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-700">{stats.gamesWon}</div>
          <div className="text-xs text-slate-400 uppercase font-bold">Wins</div>
        </div>
        <div className="marsh-card p-4 text-center">
          <div className="flex justify-center mb-1">
            <HeartIcon size={18} className={stats.currentStreak > 0 ? 'text-rose-400 animate-heart-beat' : 'text-slate-300'} />
          </div>
          <div className="text-2xl font-black text-slate-700">{stats.currentStreak}</div>
          <div className="text-xs text-slate-400 uppercase font-bold">Streak</div>
        </div>
        <div className="marsh-card p-4 text-center">
          <div className="flex justify-center mb-1">
            <FireIcon size={18} className="text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-slate-700">
            {stats.bestTime > 0 ? `${(stats.bestTime / 1000).toFixed(1)}s` : '—'}
          </div>
          <div className="text-xs text-slate-400 uppercase font-bold">Best</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={() => handleNav('practice')}
          className="marsh-btn marsh-btn-primary w-full py-4 text-lg"
        >
          <span className="flex items-center justify-center gap-2">
            <TrophyIcon size={20} className="text-white" />
            Practice Mode
          </span>
        </button>
        <button
          onClick={() => handleNav('duel')}
          className="marsh-btn marsh-btn-secondary w-full py-4 text-lg"
        >
          <span className="flex items-center justify-center gap-2">
            <SwordIcon size={20} className="text-indigo-400" />
            Start Duel
          </span>
        </button>
      </div>

      {/* Footer */}
      <button
        onClick={() => {
          if (settings.sound) playClick()
          onSettings()
        }}
        className="mt-8 flex items-center gap-2 text-slate-400 hover:text-indigo-400 text-sm font-semibold transition-colors cursor-pointer"
      >
        <GearIcon size={18} className="text-current" />
        Settings
      </button>
    </div>
  )
}
