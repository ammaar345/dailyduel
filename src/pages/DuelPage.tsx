import { useState, useEffect, useCallback } from 'react'
import { DuelBoard } from '../components/game/DuelBoard'
import { GameKeyboard } from '../components/game/GameKeyboard'
import { ResultScreen } from '../components/game/ResultScreen'
import { createGameState, handleKeyPress, getKeyStates } from '../lib/gameLogic'
import type { Puzzle } from '../lib/daily'
import type { Stats } from '../lib/stats'
import type { Settings } from '../lib/settings'
import { playKeyClick, playBackspace, playCorrect, playWin, playLose, playClick } from '../lib/sounds'
import { BackIcon } from '../components/ui/Icons'

interface DuelPageProps {
  puzzle: Puzzle
  settings: Settings
  stats: Stats
  onBack: () => void
  onSettings: () => void
}

// Simulated opponent for MVP (single-player duel vs bot)
function createBotState() {
  return {
    name: 'RIVAL BOT',
    startTime: Date.now(),
    solved: false,
    guesses: [] as { word: string; result: ('correct' | 'present' | 'absent')[] }[],
    currentGuess: '',
    solveTimeMs: 8000 + Math.random() * 12000, // 8-20 seconds
    intervalId: null as ReturnType<typeof setInterval> | null,
  }
}

export function DuelPage({ puzzle, settings, stats, onBack }: DuelPageProps) {
  const [player, setPlayer] = useState(createGameState)
  const [bot, setBot] = useState(createBotState)
  const [countdown, setCountdown] = useState(3)
  const [started, setStarted] = useState(false)
  const [playerWon, setPlayerWon] = useState<boolean | null>(null)

  // Countdown
  useEffect(() => {
    if (countdown <= 0) {
      setStarted(true)
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 800)
    return () => clearTimeout(timer)
  }, [countdown])

  // Bot AI (simplified: guesses random words until solved)
  useEffect(() => {
    if (!started || player.gameStatus !== 'playing') return

    const id = setInterval(() => {
      setBot(prev => {
        if (prev.solved || player.gameStatus !== 'playing') return prev

        // Simple bot: make random 5-letter guesses
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const guess = Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * 26)]).join('')

        // Check if solved (bot gets lucky eventually)
        const timeSinceStart = Date.now() - prev.startTime
        if (timeSinceStart > prev.solveTimeMs) {
          return { ...prev, solved: true }
        }

        // Add guess with random results (biased toward absent)
        const results: ('correct' | 'present' | 'absent')[] = Array.from({ length: 5 }, () => {
          const r = Math.random()
          if (r < 0.15) return 'correct'
          if (r < 0.25) return 'present'
          return 'absent'
        })

        return {
          ...prev,
          guesses: [...prev.guesses, { word: guess, result: results }],
        }
      })
    }, 1500 + Math.random() * 2000)

    return () => clearInterval(id)
  }, [started, player.gameStatus])

  // Player keyboard
  const handleKey = useCallback((key: string) => {
    if (!started || player.gameStatus !== 'playing') return

    setPlayer(prev => {
      const result = handleKeyPress(key, prev, puzzle.word)
      if (result.eventType === 'key' && settings.sound) playKeyClick()
      if (result.eventType === 'backspace' && settings.sound) playBackspace()
      if (result.eventType === 'correct' && settings.sound) playCorrect()
      if (result.eventType === 'win') {
        if (settings.sound) playWin()
        setPlayerWon(true)
        setBot(b => ({ ...b, solved: true }))
      }
      if (result.eventType === 'lose') {
        if (settings.sound) playLose()
        setPlayerWon(false)
      }
      return result.state
    })
  }, [started, player.gameStatus, puzzle.word, settings.sound])

  // Physical keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!started || player.gameStatus !== 'playing') return
      if (e.key === 'Enter') handleKey('ENTER')
      else if (e.key === 'Backspace') handleKey('⌫')
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase())
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [started, player.gameStatus, handleKey])

  const handleShare = () => {
    const emojiMap = { correct: '🟩', present: '🟨', absent: '⬛' }
    const grid = player.guesses.map(g => g.result.map(r => emojiMap[r]).join('')).join('\n')
    const result = playerWon === true ? 'WON' : playerWon === false ? 'LOST' : 'DRAW'
    const text = `DailyDuel Duel\n${result} in ${player.guesses.length} guesses\n\n${grid}\n\ndailyduel.app`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  // Both done
  const bothDone = (player.gameStatus !== 'playing' && bot.solved) || playerWon !== null

  return (
    <div className="min-h-dvh flex flex-col items-center px-4 py-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-2">
        <button
          onClick={() => {
            if (settings.sound) playClick()
            onBack()
          }}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <BackIcon size={24} />
        </button>
        <h1 className="text-lg font-black tracking-tight text-indigo-400 uppercase">Duel Mode</h1>
        <div className="w-10" />
      </div>

      {/* Countdown */}
      {!started && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-8xl font-black text-indigo-400 animate-bounce-in drop-shadow-lg">
            {countdown > 0 ? countdown : 'GO!'}
          </div>
        </div>
      )}

      {/* Duel boards */}
      {started && (
        <div className="w-full grid grid-cols-2 gap-4 mt-2">
          <DuelBoard
            playerName="YOU"
            guesses={player.guesses}
            currentGuess={player.currentGuess}
            isCurrentPlayer={true}
            solved={player.gameStatus === 'won'}
          />
          <DuelBoard
            playerName={bot.name}
            guesses={bot.guesses}
            currentGuess=""
            isCurrentPlayer={false}
            solved={bot.solved}
          />
        </div>
      )}

      {/* Keyboard */}
      {started && (
        <div className="mt-4">
          <GameKeyboard
            onKey={handleKey}
            keyStates={getKeyStates(player.guesses)}
          />
        </div>
      )}

      {/* Result overlay */}
      {bothDone && (
        <ResultScreen
          won={playerWon === true}
          timeMs={player.gameStatus === 'won' ? Date.now() - player.startTime : bot.solveTimeMs}
          guesses={player.guesses.length}
          opponentName={bot.name}
          opponentTime={bot.solveTimeMs}
          stats={stats}
          onPlayAgain={() => {
            if (settings.sound) playClick()
            setPlayer(createGameState())
            setBot(createBotState())
            setCountdown(3)
            setStarted(false)
            setPlayerWon(null)
          }}
          onHome={() => {
            if (settings.sound) playClick()
            onBack()
          }}
          onShare={handleShare}
        />
      )}
    </div>
  )
}
