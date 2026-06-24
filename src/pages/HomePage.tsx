import { useState } from 'react'
import type { Stats } from '../lib/stats'
import type { Settings } from '../lib/settings'
import { getRank, getRankColor } from '../lib/stats'
import { playClick } from '../lib/sounds'
import { CrownIcon, GearIcon, FireIcon, TrophyIcon, HeartIcon, TargetIcon, CrossedSwordsIcon } from '../components/ui/Icons'
import { XpModal } from '../components/ui/XpModal'
import { AdBanner } from '../components/ui/AdBanner'

interface HomePageProps {
  stats: Stats
  settings: Settings
  onNavigate: (page: 'practice' | 'duel' | 'stats' | 'settings') => void
  onSettings: () => void
}

export function HomePage({ stats, settings, onNavigate, onSettings }: HomePageProps) {
  const [showXpModal, setShowXpModal] = useState(false)
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
        <h1 className="text-4xl font-bold tracking-tight mb-1 text-[#4A5568]">
          daily<span className="text-[#64B5F6]">duel</span>
        </h1>
        <p className="text-[#718096] text-xs tracking-widest uppercase font-medium">head-to-head word battles</p>
      </div>

      {/* Crown */}
      <div className="mb-5 animate-float">
        <CrownIcon size={64} className="text-[#E8B830] drop-shadow-sm" />
      </div>

      {/* Rank Card — clickable, hoverable */}
      <button
        onClick={() => {
          if (settings.sound) playClick()
          setShowXpModal(true)
        }}
        className="w-full marsh-card p-5 mb-5 cursor-pointer hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-lg text-left"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#718096] uppercase tracking-wider font-medium">Rank</span>
          <span className={`text-sm font-bold ${rankColor}`}>{rank}</span>
        </div>
        <div className="w-full bg-[#E3F2FD] rounded-full h-3 mb-2 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${xpInLevel}%`,
              background: 'linear-gradient(90deg, #90CAF9, #64B5F6)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#718096] font-medium">
          <span>Lv {stats.level}</span>
          <span className="font-mono-nums">{xpInLevel}/100 XP</span>
        </div>
      </button>

      {/* Ad Banner - Only shown to free users */}
      <AdBanner />

      {/* Stats Row — hoverable with icon wiggle */}
      <div className="grid grid-cols-3 gap-3 w-full mb-8">
        <div className="group marsh-card p-4 text-center cursor-pointer hover:scale-105 hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-center mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFF8E1] flex items-center justify-center group-hover-wiggle">
              <TrophyIcon size={20} className="text-[#FFD54F]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono-nums text-[#4A5568] group-hover-scale">{stats.gamesWon}</div>
          <div className="text-xs text-[#718096] uppercase font-medium">Wins</div>
        </div>
        <div className="group marsh-card p-4 text-center cursor-pointer hover:scale-105 hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-center mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-[#EDE7F6] flex items-center justify-center group-hover-wiggle">
              <HeartIcon size={20} className={stats.currentStreak > 0 ? 'text-[#B39DDB] animate-heart-beat' : 'text-[#CBD5E0]'} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono-nums text-[#4A5568] group-hover-scale">{stats.currentStreak}</div>
          <div className="text-xs text-[#718096] uppercase font-medium">Streak</div>
        </div>
        <div className="group marsh-card p-4 text-center cursor-pointer hover:scale-105 hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-center mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0F2F1] flex items-center justify-center group-hover-wiggle">
              <FireIcon size={20} className="text-[#80CBC4]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono-nums text-[#4A5568] group-hover-scale">
            {stats.bestTime > 0 ? `${(stats.bestTime / 1000).toFixed(1)}s` : '—'}
          </div>
          <div className="text-xs text-[#718096] uppercase font-medium">Best</div>
        </div>
      </div>

      {/* Action Buttons — compact marshmallow pills */}
      <div className="flex flex-col items-center gap-2.5 w-full">
        <button
          onClick={() => handleNav('practice')}
          className="marsh-btn marsh-btn-practice px-6 py-2 text-xs font-semibold"
        >
          <span className="flex items-center justify-center gap-1.5">
            <TargetIcon size={14} className="text-[#4A5568]" />
            Practice Mode
          </span>
        </button>
        <button
          onClick={() => handleNav('duel')}
          className="marsh-btn marsh-btn-secondary px-6 py-2 text-xs font-semibold"
        >
          <span className="flex items-center justify-center gap-1.5">
            <CrossedSwordsIcon size={14} className="text-[#64B5F6]" />
            Start Duel
          </span>
        </button>
      </div>

      {/* Footer — animated settings */}
      <button
        onClick={() => {
          if (settings.sound) playClick()
          onSettings()
        }}
        className="group mt-8 flex items-center gap-2.5 text-[#A0AEC0] hover:text-[#90CAF9] text-sm font-medium transition-all duration-300 cursor-pointer hover:scale-105"
      >
        <div className="w-8 h-8 rounded-full bg-[#F0F7FA] flex items-center justify-center transition-all duration-300 group-hover:bg-[#E3F2FD] group-hover:rotate-90">
          <GearIcon size={16} className="text-current" />
        </div>
        Settings
      </button>

      {/* XP Modal */}
      {showXpModal && <XpModal stats={stats} onClose={() => setShowXpModal(false)} />}
    </div>
  )
}
