import { getRank, getRankColor } from '../../lib/stats'
import { CrownIcon, SkullIcon, ClipboardIcon, TrophyIcon, StarIcon, HeartIcon } from '../ui/Icons'

interface ResultScreenProps {
  won: boolean
  timeMs: number
  guesses: number
  opponentName?: string
  opponentTime?: number
  stats: { level: number; currentStreak: number; maxStreak: number }
  onPlayAgain: () => void
  onHome: () => void
  onShare: () => void
}

export function ResultScreen({ won, timeMs, guesses, opponentName, opponentTime, stats, onPlayAgain, onHome, onShare }: ResultScreenProps) {
  const rank = getRank(stats.level)
  const rankColor = getRankColor(rank)
  const timeStr = timeMs < 60000
    ? `${(timeMs / 1000).toFixed(1)}s`
    : `${Math.floor(timeMs / 60000)}m ${(Math.floor(timeMs / 1000) % 60)}s`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md animate-slide-up">
      <div className="bg-white rounded-[28px] p-8 max-w-sm w-full mx-4 text-center shadow-2xl border border-slate-100">
        {/* Icon */}
        <div className="mb-4 animate-bounce-in">
          {won ? (
            <CrownIcon size={72} className="text-amber-400 mx-auto drop-shadow-md" />
          ) : (
            <SkullIcon size={64} className="text-slate-300 mx-auto" />
          )}
        </div>

        {/* Title */}
        <h2 className={`text-3xl font-black mb-2 ${won ? 'text-indigo-500' : 'text-slate-400'}`}>
          {won ? 'VICTORY!' : 'DEFEATED'}
        </h2>

        {won ? (
          <p className="text-slate-400 mb-5 text-sm font-medium">
            {opponentName
              ? `Beat ${opponentName} by ${((opponentTime! - timeMs) / 1000).toFixed(1)}s`
              : 'Puzzle conquered!'}
          </p>
        ) : (
          <p className="text-slate-400 mb-5 text-sm font-medium">
            {opponentName ? `${opponentName} beat you.` : 'Better luck tomorrow!'}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="marsh-card p-3">
            <div className="flex justify-center mb-1">
              <StarIcon size={14} className="text-indigo-400" />
            </div>
            <div className="text-xl font-black text-slate-700">{timeStr}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Time</div>
          </div>
          <div className="marsh-card p-3">
            <div className="flex justify-center mb-1">
              <TrophyIcon size={14} className="text-amber-400" />
            </div>
            <div className="text-xl font-black text-slate-700">{guesses}/6</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Guesses</div>
          </div>
          <div className="marsh-card p-3">
            <div className="flex justify-center mb-1">
              <CrownIcon size={14} className={rankColor} />
            </div>
            <div className={`text-xl font-black ${rankColor}`}>{rank}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Rank</div>
          </div>
        </div>

        {/* Streak */}
        {stats.currentStreak > 0 && (
          <div className="flex items-center justify-center gap-2 mb-5 text-rose-400">
            <HeartIcon size={18} className="animate-heart-beat" />
            <span className="font-bold text-sm">{stats.currentStreak} day streak</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onShare}
            className="marsh-btn marsh-btn-primary w-full py-3.5"
          >
            <span className="flex items-center justify-center gap-2">
              <ClipboardIcon size={18} className="text-white" />
              Share Result
            </span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={onPlayAgain}
              className="marsh-btn marsh-btn-secondary flex-1 py-3.5"
            >
              Play Again
            </button>
            <button
              onClick={onHome}
              className="marsh-btn marsh-btn-secondary flex-1 py-3.5"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
