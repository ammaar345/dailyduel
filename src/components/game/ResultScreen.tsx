import { getRank, getRankColor } from '../../lib/stats'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-slide-up">
      <div className="bg-zinc-900 border-2 border-zinc-700 rounded-3xl p-8 max-w-sm w-full mx-4 text-center">
        {/* Crown / Skull */}
        <div className="text-6xl mb-4">
          {won ? '👑' : '💀'}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black mb-2">
          {won ? 'DUEL WON!' : 'DEFEATED'}
        </h2>

        {won ? (
          <p className="text-zinc-400 mb-4">
            {opponentName
              ? `Beat ${opponentName} by ${(opponentTime! - timeMs) / 1000}s`
              : 'Puzzle conquered!'}
          </p>
        ) : (
          <p className="text-zinc-400 mb-4">
            {opponentName ? `${opponentName} beat you.` : 'Better luck tomorrow!'}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-800 rounded-xl p-3">
            <div className="text-2xl font-black">{timeStr}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Time</div>
          </div>
          <div className="bg-zinc-800 rounded-xl p-3">
            <div className="text-2xl font-black">{guesses}/6</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Guesses</div>
          </div>
          <div className="bg-zinc-800 rounded-xl p-3">
            <div className={`text-2xl font-black ${rankColor}`}>{rank}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Rank</div>
          </div>
        </div>

        {/* Streak */}
        {stats.currentStreak > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4 text-orange-400">
            <span className="animate-fire text-xl">🔥</span>
            <span className="font-bold">{stats.currentStreak} day streak</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onShare}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Share Result 📋
          </button>
          <div className="flex gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
              Practice Again
            </button>
            <button
              onClick={onHome}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
