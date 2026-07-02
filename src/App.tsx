import { useState, useEffect } from 'react'
import { DuelPage } from './pages/DuelPage'
import { PracticePage } from './pages/PracticePage'
import { HomePage } from './pages/HomePage'
import { SettingsDialog } from './components/ui/SettingsDialog'
import { getDailyPuzzle, getPuzzleForDate } from './lib/daily'
import { loadStats, saveStats, addXP, type Stats } from './lib/stats'
import { loadSettings, type Settings } from './lib/settings'

type Page = 'home' | 'practice' | 'duel' | 'stats' | 'settings'

// XP rewards per game outcome
const XP_WIN = 30
const XP_LOSS = 10

// Parse once — URL doesn't change during the session
const challengeDate = new URLSearchParams(window.location.search).get('challenge')

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [stats, setStats] = useState<Stats>(() => loadStats())
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [showSettings, setShowSettings] = useState(false)

  const [puzzle] = useState(() => {
    if (challengeDate) {
      return getPuzzleForDate(new Date(challengeDate + 'T00:00:00'))
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

  const handleWin = (timeMs: number) => {
    setStats(s => {
      const updated = {
        ...s,
        gamesPlayed: s.gamesPlayed + 1,
        gamesWon: s.gamesWon + 1,
        currentStreak: s.currentStreak + 1,
        maxStreak: Math.max(s.maxStreak, s.currentStreak + 1),
        bestTime: s.bestTime === 0 ? timeMs : Math.min(s.bestTime, timeMs),
        totalPlayTime: s.totalPlayTime + timeMs,
        lastPlayed: Date.now(),
      }
      const key = `dailyduel-day-${new Date().toISOString().slice(0, 10)}`
      localStorage.setItem(key, 'won')
      return addXP(XP_WIN)(updated)
    })
  }

  const handleLoss = () => {
    setStats(s => {
      const updated = {
        ...s,
        gamesPlayed: s.gamesPlayed + 1,
        gamesWon: s.gamesWon,
        currentStreak: 0,
        lastPlayed: Date.now(),
      }
      const key = `dailyduel-day-${new Date().toISOString().slice(0, 10)}`
      localStorage.setItem(key, 'lost')
      return addXP(XP_LOSS)(updated)
    })
  }

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings)
    localStorage.setItem('dailyduel-settings', JSON.stringify(newSettings))
  }

  // Challenge share handler
  const handleChallengeShare = () => {
    const today = new Date().toISOString().slice(0, 10)
    const url = `${window.location.origin}${window.location.pathname}?challenge=${today}`
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
      default:
        return (
          <HomePage
            stats={stats}
            settings={settings}
            onNavigate={setPage}
            onSettings={() => setShowSettings(true)}
            challengeDate={challengeDate}
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
