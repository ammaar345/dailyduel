import { useState, useEffect, useCallback, useRef } from 'react'
import { GameBoard } from '../components/game/GameBoard'
import { GameKeyboard } from '../components/game/GameKeyboard'
import { ResultScreen } from '../components/game/ResultScreen'
import { createGameState, handleKeyPress, getKeyStates } from '../lib/gameLogic'
import type { Puzzle } from '../lib/daily'
import { XP_WIN, XP_LOSS, type Stats } from '../lib/stats'
import type { Settings } from '../lib/settings'
import { playKeyClick, playBackspace, playCorrect, playPresent, playAbsent, playWin, playLose, playClick } from '../lib/sounds'
import { BackIcon, GearIcon, CrossedSwordsIcon } from '../components/ui/Icons'
import { SITE_HOST } from '../lib/site'
import { saveDayResult, buildChallengeUrl, type ChallengeResult } from '../lib/challenge'
import { ColorKey } from '../components/game/ColorKey'
import { GameTimer } from '../components/game/GameTimer'
import { AdBanner } from '../components/ui/AdBanner'

interface PracticePageProps {
  puzzle: Puzzle
  settings: Settings
  stats: Stats
  /** Friend-challenge ghost — when set, this is a Friend Duel against their time */
  rival?: ChallengeResult | null
  onWin: (timeMs: number) => void
  onLoss: () => void
  onBack: () => void
  onSettings: () => void
}

export function PracticePage({ puzzle, settings, stats, rival, onWin, onLoss, onBack, onSettings }: PracticePageProps) {
  const [game, setGame] = useState(createGameState)
  const [shakeRow, setShakeRow] = useState<number | null>(null)
  const [invalidMsg, setInvalidMsg] = useState(false)
  // Keep a stable ref to settings.sound so callbacks don't go stale on theme change
  const soundRef = useRef(settings.sound)
  soundRef.current = settings.sound

  const showInvalid = useCallback(() => {
    setInvalidMsg(true)
    setTimeout(() => setInvalidMsg(false), 1200)
  }, [])

  const handleKey = useCallback((key: string) => {
    setGame(prev => {
      if (prev.gameStatus !== 'playing') return prev
      const result = handleKeyPress(key, prev, puzzle.word)
      if (result.eventType === 'key' && soundRef.current) playKeyClick()
      if (result.eventType === 'backspace' && soundRef.current) playBackspace()
      if (result.eventType === 'correct' && soundRef.current) playCorrect()
      if (result.eventType === 'present' && soundRef.current) playPresent()
      if (result.eventType === 'absent' && soundRef.current) playAbsent()
      if (result.eventType === 'win' && soundRef.current) playWin()
      if (result.eventType === 'lose' && soundRef.current) playLose()
      if (result.eventType === 'invalid') {
        setShakeRow(result.state.guesses.length)
        setTimeout(() => setShakeRow(null), 400)
        showInvalid()
      }
      return result.state
    })
  }, [puzzle.word, showInvalid])

  // Win/loss callbacks — use refs to avoid stale closure on theme change
  const onWinRef = useRef(onWin)
  onWinRef.current = onWin
  const onLossRef = useRef(onLoss)
  onLossRef.current = onLoss

  // In a friend duel, winning means solving AND being faster than the rival
  const rivalWon = rival ? game.gameStatus === 'won' && game.elapsedMs < rival.timeMs : null

  useEffect(() => {
    if (game.gameStatus === 'won') {
      saveDayResult(puzzle.date, game.elapsedMs, game.guesses.length)
      if (rival && game.elapsedMs >= rival.timeMs) onLossRef.current() // solved, but rival was faster
      else onWinRef.current(game.elapsedMs)
    }
    if (game.gameStatus === 'lost') onLossRef.current()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.gameStatus, game.elapsedMs])

  // Physical keyboard — key press animation is handled inside GameKeyboard
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
    const header = rival
      ? `DailyDuel Friend Duel\n${rivalWon ? 'I WON' : 'I lost'} — ${(game.elapsedMs / 1000).toFixed(1)}s vs ${(rival.timeMs / 1000).toFixed(1)}s`
      : `DailyDuel Practice\n${game.guesses.length}/6`
    const raceLink = game.gameStatus === 'won' ? `\nRace me: ${buildChallengeUrl()}` : `\n${SITE_HOST}`
    const text = `${header}\n\n${grid}\n${raceLink}`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  const handleRestart = () => {
    if (soundRef.current) playClick()
    setGame(createGameState())
  }

  return (
    <div className="min-h-dvh flex flex-col items-center px-4 py-4 max-w-lg mx-auto page-enter">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <button
          onClick={() => {
            if (soundRef.current) playClick()
            onBack()
          }}
          className="w-10 h-10 flex items-center justify-center text-[#A0AEC0] hover:text-[#90CAF9] transition-colors cursor-pointer"
        >
          <BackIcon size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-[#4A5568] uppercase">{rival ? 'Friend Duel' : 'Practice'}</h1>
        <button
          onClick={() => {
            if (soundRef.current) playClick()
            onSettings()
          }}
          className="w-10 h-10 flex items-center justify-center text-[#A0AEC0] hover:text-[#90CAF9] transition-colors cursor-pointer"
        >
          <GearIcon size={20} />
        </button>
      </div>

      {/* Date badge */}
      <div className="marsh-card px-4 py-1.5 mb-5">
        <span className="text-xs text-[#718096] tracking-widest uppercase font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Rival target banner — friend duel mode */}
      {rival && (
        <div className="marsh-card px-4 py-2 mb-3 flex items-center gap-2 border-[#90CAF9]">
          <CrossedSwordsIcon size={16} className="text-[#64B5F6]" />
          <span className="text-xs font-semibold text-[#4A5568]">
            Beat your rival: <span className="font-mono-nums text-[#64B5F6]">{(rival.timeMs / 1000).toFixed(1)}s</span>
            <span className="text-[#A0AEC0] font-medium"> · {rival.guesses}/6 guesses</span>
          </span>
        </div>
      )}

      {/* Live timer */}
      <GameTimer startTime={game.startTime} running={game.gameStatus === 'playing'} className="mb-3" />

      {/* Ad Banner - Shown during practice games */}
      <AdBanner />

      {/* Invalid word toast */}
      <div className={`relative w-full h-0 ${invalidMsg ? 'z-50' : ''}`}>
        <div className={`absolute left-1/2 -translate-x-1/2 top-0 transition-all duration-200 ${invalidMsg ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
            Not in word list
          </div>
        </div>
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

      {/* Color Key Legend */}
      <div className="mb-4">
        <ColorKey />
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
          won={rival ? rivalWon === true : game.gameStatus === 'won'}
          timeMs={game.elapsedMs}
          guesses={game.guesses.length}
          opponentName={rival ? 'YOUR RIVAL' : undefined}
          opponentTime={rival ? rival.timeMs : undefined}
          xpEarned={(rival ? rivalWon : game.gameStatus === 'won') ? XP_WIN : XP_LOSS}
          stats={stats}
          onPlayAgain={handleRestart}
          onHome={() => {
            if (soundRef.current) playClick()
            onBack()
          }}
          onShare={handleShare}
        />
      )}
    </div>
  )
}
