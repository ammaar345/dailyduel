import { useState, useEffect } from 'react'
import { DuelPage } from './pages/DuelPage'
import { PracticePage } from './pages/PracticePage'
import { HomePage } from './pages/HomePage'
import { SettingsDialog } from './components/ui/SettingsDialog'
import { getDailyPuzzle } from './lib/daily'
import { loadStats, saveStats, type Stats } from './lib/stats'
import { loadSettings, type Settings } from './lib/settings'

type Page = 'home' | 'practice' | 'duel' | 'stats' | 'settings'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [stats, setStats] = useState<Stats>(() => loadStats())
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [showSettings, setShowSettings] = useState(false)
  const [puzzle] = useState(() => getDailyPuzzle())

  useEffect(() => {
    saveStats(stats)
  }, [stats])

  useEffect(() => {
    // Remove all contrast classes first
    document.documentElement.classList.remove('high', 'soft', 'dark')
    // Add the current contrast class
    if (settings.contrast !== 'medium') {
      document.documentElement.classList.add(settings.contrast)
    }
  }, [settings.contrast])

  const handleWin = (timeMs: number) => {
    setStats(s => ({
      ...s,
      gamesPlayed: s.gamesPlayed + 1,
      gamesWon: s.gamesWon + 1,
      currentStreak: s.currentStreak + 1,
      maxStreak: Math.max(s.maxStreak, s.currentStreak + 1),
      bestTime: s.bestTime === 0 ? timeMs : Math.min(s.bestTime, timeMs),
      totalPlayTime: s.totalPlayTime + timeMs,
      lastPlayed: Date.now(),
    }))
  }

  const handleLoss = () => {
    setStats(s => ({
      ...s,
      gamesPlayed: s.gamesPlayed + 1,
      gamesWon: s.gamesWon,
      currentStreak: 0,
      lastPlayed: Date.now(),
    }))
  }

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings)
    localStorage.setItem('dailyduel-settings', JSON.stringify(newSettings))
  }

  if (showSettings) {
    return (
      <SettingsDialog
        settings={settings}
        onChange={handleSettingsChange}
        onClose={() => setShowSettings(false)}
      />
    )
  }

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
        />
      )
  }
}
