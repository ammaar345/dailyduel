import type { Stats } from '../../lib/stats'
import { getRank, getRankColor } from '../../lib/stats'
import { CloseIcon } from './Icons'

interface XpModalProps {
  stats: Stats
  onClose: () => void
}

export function XpModal({ stats, onClose }: XpModalProps) {
  const rank = getRank(stats.level)
  const rankColor = getRankColor(rank)
  const xpInLevel = stats.xp % 100
  const totalXP = stats.xp

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A5568]/20 backdrop-blur-md animate-slide-up"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] p-7 max-w-xs w-full mx-4 shadow-2xl border border-[#E8E4DF]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#A0AEC0] hover:text-[#718096] transition-colors cursor-pointer"
        >
          <CloseIcon size={16} />
        </button>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#4A5568] mb-5 text-center">XP Details</h3>

        {/* Level + Rank */}
        <div className="text-center mb-5">
          <div className="text-5xl font-bold font-mono-nums text-[#64B5F6] mb-1">{stats.level}</div>
          <div className="text-sm text-[#718096] font-medium">Current Level</div>
          <div className={`text-base font-bold mt-1 ${rankColor}`}>{rank}</div>
        </div>

        {/* XP Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-[#718096] font-medium mb-2">
            <span className="font-mono-nums">{xpInLevel} XP</span>
            <span className="font-mono-nums">100 XP</span>
          </div>
          <div className="w-full bg-[#E3F2FD] rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${xpInLevel}%`,
                background: 'linear-gradient(90deg, #90CAF9, #64B5F6)',
              }}
            />
          </div>
          <div className="text-center text-xs text-[#A0AEC0] mt-1.5 font-medium">
            {100 - xpInLevel} XP to next level
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="marsh-card p-3 text-center">
            <div className="text-xl font-bold font-mono-nums text-[#4A5568]">{totalXP}</div>
            <div className="text-xs text-[#718096] uppercase tracking-wider font-medium">Total XP</div>
          </div>
          <div className="marsh-card p-3 text-center">
            <div className="text-xl font-bold font-mono-nums text-[#4A5568]">{stats.gamesPlayed}</div>
            <div className="text-xs text-[#718096] uppercase tracking-wider font-medium">Played</div>
          </div>
          <div className="marsh-card p-3 text-center">
            <div className="text-xl font-bold font-mono-nums text-[#4A5568]">{stats.gamesWon}</div>
            <div className="text-xs text-[#718096] uppercase tracking-wider font-medium">Wins</div>
          </div>
          <div className="marsh-card p-3 text-center">
            <div className="text-xl font-bold font-mono-nums text-[#4A5568]">{stats.maxStreak}</div>
            <div className="text-xs text-[#718096] uppercase tracking-wider font-medium">Max Streak</div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="marsh-btn marsh-btn-secondary w-full py-3 mt-5 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  )
}
