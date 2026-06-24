import type { Stats } from '../lib/stats'
import type { Settings } from '../lib/settings'
import { getRank, getRankColor } from '../lib/stats'
import { playClick } from '../lib/sounds'

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
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black tracking-tight mb-2">
          DAILY<span className="text-purple-500">DUEL</span>
        </h1>
        <p className="text-zinc-500 text-sm tracking-widest uppercase">Head-to-Head Word Battles</p>
      </div>

      {/* Crown */}
      <div className="text-7xl mb-6 animate-crown">👑</div>

      {/* Rank Card */}
      <div className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">Rank</span>
          <span className={`text-sm font-black ${rankColor}`}>{rank}</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-3 mb-1">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${xpInLevel}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-500">
          <span>LV {stats.level}</span>
          <span>{xpInLevel}/100 XP</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 w-full mb-8">
        <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-white">{stats.gamesWon}</div>
          <div className="text-xs text-zinc-500 uppercase">Wins</div>
        </div>
        <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
            {stats.currentStreak > 0 && <span className="animate-fire">🔥</span>}
            {stats.currentStreak}
          </div>
          <div className="text-xs text-zinc-500 uppercase">Streak</div>
        </div>
        <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-purple-400">
            {stats.bestTime > 0 ? `${(stats.bestTime / 1000).toFixed(1)}s` : '—'}
          </div>
          <div className="text-xs text-zinc-500 uppercase">Best</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={() => handleNav('practice')}
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white text-xl font-black rounded-2xl transition-all active:scale-95 cursor-pointer"
        >
          Practice Mode
        </button>
        <button
          onClick={() => handleNav('duel')}
          className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xl font-black rounded-2xl border-2 border-zinc-600 transition-all active:scale-95 cursor-pointer"
        >
          Start Duel ⚔️
        </button>
      </div>

      {/* Footer */}
      <button
        onClick={() => {
          if (settings.sound) playClick()
          onSettings()
        }}
        className="mt-8 text-zinc-600 hover:text-zinc-400 text-sm transition-colors cursor-pointer"
      >
        ⚙ Settings
      </button>
    </div>
  )
}
