import { useState, useEffect } from 'react'
import { DuelPage } from './pages/DuelPage'
import { PracticePage } from './pages/PracticePage'
import { HomePage } from './pages/HomePage'
import { RealtimeDuelPage } from './pages/RealtimeDuelPage'
import { SettingsDialog } from './components/ui/SettingsDialog'
import { getDailyPuzzle, getPuzzleForDate } from './lib/daily'
import { loadStats, saveStats, addXP, XP_WIN, XP_LOSS, type Stats } from './lib/stats'
import { loadSettings, type Settings } from './lib/settings'
import { parseChallenge, buildChallengeUrl } from './lib/challenge'
import { parseRoom } from './lib/rtc'

type Page = 'home' | 'practice' | 'duel' | 'live' | 'stats' | 'settings'

// Parse once — URL doesn't change during the session
const challenge = parseChallenge()
const roomCode = parseRoom()

export default function App() {
  // A ?room= link drops you straight into the live duel lobby as the guest
  const [page, setPage] = useState<Page>(roomCode ? 'live' : 'home')
  const [stats, setStats] = useState<Stats>(() => loadStats())
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [showSettings, setShowSettings] = useState(false)

  const [puzzle] = useState(() => {
    if (challenge) {
      return getPuzzleForDate(new Date(challenge.date + 'T00:00:00'))
    }
    return getDailyPuzzle()
  })

  useEffect(() => {
    saveStats(stats)
  }, [stats])

  useEffect(() => {
    document.documentElement.classList.remove('high', 'soft', 'dark')
    if (settings.contrast !== 'medium') {
      document.documentElement.classList.add(settings.contrast)
    }
  }, [settings.contrast])

  useEffect(() => {
    document.documentElement.classList.toggle('no-anim', !settings.animations)
  }, [settings.animations])

  // Streak and the daily W/L record are decided by the FIRST completed game of
  // the day — replays still earn XP and count games, but can't farm or kill streaks.
  const handleWin = (timeMs: number) => {
    setStats(s => {
      const key = `dailyduel-day-${new Date().toISOString().slice(0, 10)}`
      const firstOfDay = !localStorage.getItem(key)
      if (firstOfDay) localStorage.setItem(key, 'won')
      const updated = {
        ...s,
        gamesPlayed: s.gamesPlayed + 1,
        gamesWon: s.gamesWon + 1,
        currentStreak: firstOfDay ? s.currentStreak + 1 : s.currentStreak,
        maxStreak: firstOfDay ? Math.max(s.maxStreak, s.currentStreak + 1) : s.maxStreak,
        bestTime: s.bestTime === 0 ? timeMs : Math.min(s.bestTime, timeMs),
        totalPlayTime: s.totalPlayTime + timeMs,
        lastPlayed: Date.now(),
      }
      return addXP(XP_WIN)(updated)
    })
  }

  const handleLoss = () => {
    setStats(s => {
      const key = `dailyduel-day-${new Date().toISOString().slice(0, 10)}`
      const firstOfDay = !localStorage.getItem(key)
      if (firstOfDay) localStorage.setItem(key, 'lost')
      const updated = {
        ...s,
        gamesPlayed: s.gamesPlayed + 1,
        gamesWon: s.gamesWon,
        currentStreak: firstOfDay ? 0 : s.currentStreak,
        lastPlayed: Date.now(),
      }
      return addXP(XP_LOSS)(updated)
    })
  }

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings)
    localStorage.setItem('dailyduel-settings', JSON.stringify(newSettings))
  }

  // Challenge share handler — link carries your best time today if you've won
  const handleChallengeShare = () => {
    const url = buildChallengeUrl()
    navigator.clipboard.writeText(url).catch(() => {})
    return url
  }

  const renderPage = () => {
    switch (page) {
      case 'practice':
        return (
          <PracticePage
            puzzle={puzzle}
            settings={settings}
            stats={stats}
            rival={challenge?.result ?? null}
            onWin={handleWin}
            onLoss={handleLoss}
            onBack={() => setPage('home')}
            onSettings={() => setShowSettings(true)}
          />
        )
      case 'duel':
        return (
          <DuelPage
            puzzle={puzzle}
            settings={settings}
            stats={stats}
            onWin={handleWin}
            onLoss={handleLoss}
            onBack={() => setPage('home')}
            onSettings={() => setShowSettings(true)}
          />
        )
      case 'live':
        return (
          <RealtimeDuelPage
            puzzle={puzzle}
            settings={settings}
            stats={stats}
            joinCode={roomCode}
            onWin={handleWin}
            onLoss={handleLoss}
            onBack={() => setPage('home')}
            onSettings={() => setShowSettings(true)}
          />
        )
      default:
        return (
          <HomePage
            stats={stats}
            settings={settings}
            onNavigate={setPage}
            onSettings={() => setShowSettings(true)}
            challenge={challenge}
            onChallengeShare={handleChallengeShare}
          />
        )
    }
  }

  return (
    <>
      {renderPage()}
      {showSettings && (
        <SettingsDialog
          settings={settings}
          onChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  )
}
