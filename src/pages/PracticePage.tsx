import { useState, useEffect, useCallback } from 'react'
import { GameBoard } from '../components/game/GameBoard'
import { GameKeyboard } from '../components/game/GameKeyboard'
import { ResultScreen } from '../components/game/ResultScreen'
import { createGameState, handleKeyPress, getKeyStates } from '../lib/gameLogic'
import type { Puzzle } from '../lib/daily'
import type { Stats } from '../lib/stats'
import type { Settings } from '../lib/settings'
import { playKeyClick, playBackspace, playCorrect, playPresent, playAbsent, playWin, playLose, playClick } from '../lib/sounds'

interface PracticePageProps {
  puzzle: Puzzle
  settings: Settings
  stats: Stats
  onWin: (timeMs: number) => void
  onLoss: () => void
  onBack: () => void
  onSettings: () => void
}

export function PracticePage({ puzzle, settings, stats, onWin, onLoss, onBack, onSettings }: PracticePageProps) {
  const [game, setGame] = useState(createGameState)
  const [shakeRow, setShakeRow] = useState<number | null>(null)

  const handleKey = useCallback((key: string) => {
    setGame(prev => {
      if (prev.gameStatus !== 'playing') return prev
      const result = handleKeyPress(key, prev, puzzle.word)
      if (result.eventType === 'key' && settings.sound) playKeyClick()
      if (result.eventType === 'backspace' && settings.sound) playBackspace()
      if (result.eventType === 'correct' && settings.sound) playCorrect()
      if (result.eventType === 'present' && settings.sound) playPresent()
      if (result.eventType === 'absent' && settings.sound) playAbsent()
      if (result.eventType === 'win' && settings.sound) playWin()
      if (result.eventType === 'lose' && settings.sound) playLose()
      if (result.eventType === 'invalid') {
        setShakeRow(result.state.guesses.length)
        setTimeout(() => setShakeRow(null), 400)
      }
      return result.state
    })
  }, [puzzle.word, settings.sound])

  // Win/loss callbacks
  useEffect(() => {
    if (game.gameStatus === 'won') onWin(game.elapsedMs)
    if (game.gameStatus === 'lost') onLoss()
  }, [game.gameStatus, game.elapsedMs, onWin, onLoss])

  // Physical keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (game.gameStatus !== 'playing') return
      if (e.key === 'Enter') handleKey('ENTER')
      else if (e.key === 'Backspace') handleKey('⌫')
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase())
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [game.gameStatus, handleKey])

  const handleShare = () => {
    const emojiMap = { correct: '🟩', present: '🟨', absent: '⬛' }
    const grid = game.guesses.map(g => g.result.map(r => emojiMap[r]).join('')).join('\n')
    const text = `DailyDuel Practice\n${game.guesses.length}/6\n\n${grid}\n\ndailyduel.app`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  const handleRestart = () => {
    if (settings.sound) playClick()
    setGame(createGameState())
  }

  return (
    <div className="min-h-dvh flex flex-col items-center px-4 py-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <button
          onClick={() => {
            if (settings.sound) playClick()
            onBack()
          }}
          className="text-zinc-500 hover:text-white transition-colors cursor-pointer text-2xl"
        >
          ←
        </button>
        <h1 className="text-xl font-black tracking-tight">
          PRACTICE
        </h1>
        <button
          onClick={() => {
            if (settings.sound) playClick()
            onSettings()
          }}
          className="text-zinc-500 hover:text-white transition-colors cursor-pointer text-2xl"
        >
          ⚙
        </button>
      </div>

      {/* Date badge */}
      <div className="text-xs text-zinc-600 mb-4 tracking-widest uppercase">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
      </div>

      {/* Board */}
      <div className="mb-4">
        <GameBoard
          guesses={game.guesses}
          currentGuess={game.currentGuess}
          maxGuesses={6}
          shakeRow={shakeRow}
        />
      </div>

      {/* Keyboard */}
      <div className="mt-auto">
        <GameKeyboard
          onKey={(key) => {
            if (game.gameStatus !== 'playing') return
            handleKey(key)
          }}
          keyStates={getKeyStates(game.guesses)}
        />
      </div>

      {/* Result overlay */}
      {game.gameStatus !== 'playing' && (
        <ResultScreen
          won={game.gameStatus === 'won'}
          timeMs={game.elapsedMs}
          guesses={game.guesses.length}
          stats={stats}
          onPlayAgain={handleRestart}
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
