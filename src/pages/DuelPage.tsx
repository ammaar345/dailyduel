import { useState, useEffect, useCallback, useRef } from 'react'
import { DuelBoard } from '../components/game/DuelBoard'
import { GameKeyboard } from '../components/game/GameKeyboard'
import { ResultScreen } from '../components/game/ResultScreen'
import { createGameState, handleKeyPress, getKeyStates } from '../lib/gameLogic'
import { createBotSolver, botMakeGuess } from '../lib/botSolver'
import type { Puzzle } from '../lib/daily'
import { XP_WIN, XP_LOSS, type Stats } from '../lib/stats'
import type { Settings } from '../lib/settings'
import { playKeyClick, playBackspace, playCorrect, playWin, playLose, playClick } from '../lib/sounds'
import { BackIcon, GearIcon } from '../components/ui/Icons'
import { SITE_HOST } from '../lib/site'
import { ColorKey } from '../components/game/ColorKey'
import { GameTimer } from '../components/game/GameTimer'
import { AdBanner } from '../components/ui/AdBanner'

interface DuelPageProps {
  puzzle: Puzzle
  settings: Settings
  stats: Stats
  onWin: (timeMs: number) => void
  onLoss: () => void
  onBack: () => void
  onSettings: () => void
}

// Bot difficulty config — decent pace, not too fast/slow
const BOT_GUESS_INTERVAL_MS = 3500  // time between bot guesses

export function DuelPage({ puzzle, settings, stats, onWin, onLoss, onBack, onSettings }: DuelPageProps) {
  const [player, setPlayer] = useState(createGameState)
  const [botSolver, setBotSolver] = useState(createBotSolver)
  const [countdown, setCountdown] = useState(3)
  const [started, setStarted] = useState(false)
  const [playerWon, setPlayerWon] = useState<boolean | null>(null)
  const [invalidMsg, setInvalidMsg] = useState(false)
  const botStartTimeRef = useRef<number>(0)
  const botSolvedAtRef = useRef<number>(0) // actual bot solve timestamp
  const reportedRef = useRef(false) // guard: report duel result to stats once

  const showInvalid = useCallback(() => {
    setInvalidMsg(true)
    setTimeout(() => setInvalidMsg(false), 1200)
  }, [])

  // Countdown
  useEffect(() => {
    if (countdown <= 0) {
      setStarted(true)
      botStartTimeRef.current = Date.now()
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 800)
    return () => clearTimeout(timer)
  }, [countdown])

  // Smart Bot AI — makes real Wordle guesses at a pace
  useEffect(() => {
    // Bot is done after 6 guesses even without solving (board only has 6 rows)
    if (!started || player.gameStatus !== 'playing' || botSolver.solved || botSolver.guesses.length >= 6) return

    const id = setInterval(() => {
      setBotSolver(prev => {
        if (prev.solved || prev.guesses.length >= 6 || player.gameStatus !== 'playing') return prev

        // Bot makes a real guess using solver logic
        const next = botMakeGuess(prev, puzzle.word)

        // Check if bot solved
        if (next.solved) {
          botSolvedAtRef.current = Date.now()
          // Bot solved — player loses unless they already won
          setPlayerWon(w => w === true ? true : false)
        }

        return next
      })
    }, BOT_GUESS_INTERVAL_MS)

    return () => clearInterval(id)
  }, [started, player.gameStatus, botSolver.solved, botSolver.guesses.length, puzzle.word])

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
      }
      if (result.eventType === 'lose') {
        if (settings.sound) playLose()
        setPlayerWon(false)
      }
      if (result.eventType === 'invalid') {
        showInvalid()
      }
      return result.state
    })
  }, [started, player.gameStatus, puzzle.word, settings.sound, showInvalid])

  // Physical keyboard — key press animation is handled inside GameKeyboard
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

  // Report duel result to global stats exactly once per round
  useEffect(() => {
    if (playerWon === null || reportedRef.current) return
    reportedRef.current = true
    if (playerWon) onWin(player.elapsedMs)
    else onLoss()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerWon])

  const handleShare = () => {
    const emojiMap = { correct: '🟩', present: '🟨', absent: '⬛' }
    const grid = player.guesses.map(g => g.result.map(r => emojiMap[r]).join('')).join('\n')
    const result = playerWon === true ? 'WON' : playerWon === false ? 'LOST' : 'DRAW'
    const text = `DailyDuel Duel\n${result} in ${player.guesses.length} guesses\n\n${grid}\n\n${SITE_HOST}`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  // Both done check
  const bothDone = playerWon !== null

  const handleRestart = () => {
    if (settings.sound) playClick()
    setPlayer(createGameState())
    setBotSolver(createBotSolver())
    setCountdown(3)
    setStarted(false)
    setPlayerWon(null)
    botSolvedAtRef.current = 0
    reportedRef.current = false
  }

  // Actual bot solve time (falls back to elapsed-so-far if bot never solved)
  const botTimeMs = botSolvedAtRef.current > 0
    ? botSolvedAtRef.current - botStartTimeRef.current
    : undefined

  return (
    <div className="min-h-dvh flex flex-col items-center px-4 py-4 max-w-2xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-2">
        <button
          onClick={() => {
            if (settings.sound) playClick()
            onBack()
          }}
          className="w-10 h-10 flex items-center justify-center text-[#A0AEC0] hover:text-[#90CAF9] transition-colors cursor-pointer"
        >
          <BackIcon size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-[#64B5F6] uppercase">Duel Mode</h1>
        <button
          onClick={() => {
            if (settings.sound) playClick()
            onSettings()
          }}
          className="w-10 h-10 flex items-center justify-center text-[#A0AEC0] hover:text-[#90CAF9] transition-colors cursor-pointer"
        >
          <GearIcon size={20} />
        </button>
      </div>

      {/* Countdown */}
      {!started && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-8xl font-bold text-[#90CAF9] animate-bounce-in drop-shadow-lg">
            {countdown > 0 ? countdown : 'GO!'}
          </div>
        </div>
      )}

      {/* Invalid word toast */}
      {started && (
        <div className={`relative w-full h-0 ${invalidMsg ? 'z-50' : ''}`}>
          <div className={`absolute left-1/2 -translate-x-1/2 top-0 transition-all duration-200 ${invalidMsg ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
              Not in word list
            </div>
          </div>
        </div>
      )}

      {/* Duel boards */}
      {started && (
        <>
          {/* Live timer */}
          <div className="w-full flex justify-center mb-2">
            <GameTimer startTime={player.startTime} running={player.gameStatus === 'playing'} />
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mt-1">
            <DuelBoard
              playerName="YOU"
              guesses={player.guesses}
              currentGuess={player.currentGuess}
              isCurrentPlayer={true}
              solved={player.gameStatus === 'won'}
            />
            <DuelBoard
              playerName="RIVAL BOT"
              guesses={botSolver.guesses}
              currentGuess=""
              isCurrentPlayer={false}
              solved={botSolver.solved}
            />
          </div>

          {/* Ad Banner - Shown during duels */}
          <AdBanner />

          {/* Color Key Legend */}
          <div className="w-full mt-3 mb-1">
            <ColorKey />
          </div>

          {/* Keyboard */}
          <div className="mt-2">
            <GameKeyboard
              onKey={handleKey}
              keyStates={getKeyStates(player.guesses)}
            />
          </div>
        </>
      )}

      {/* Result overlay */}
      {bothDone && (
        <ResultScreen
          won={playerWon === true}
          timeMs={player.gameStatus === 'won' ? player.elapsedMs : (botTimeMs ?? player.elapsedMs)}
          guesses={player.guesses.length}
          opponentName="RIVAL BOT"
          opponentTime={botTimeMs}
          xpEarned={playerWon === true ? XP_WIN : XP_LOSS}
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
