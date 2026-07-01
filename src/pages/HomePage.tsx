import { useState } from 'react'
import type { Stats } from '../lib/stats'
import type { Settings } from '../lib/settings'
import { getRank, getRankColor } from '../lib/stats'
import { playClick } from '../lib/sounds'
import { CrownIcon, GearIcon, FireIcon, TrophyIcon, HeartIcon, TargetIcon, CrossedSwordsIcon, StarIcon } from '../components/ui/Icons'
import { XpModal } from '../components/ui/XpModal'
import { AdBanner } from '../components/ui/AdBanner'

interface HomePageProps {
  stats: Stats
  settings: Settings
  onNavigate: (page: 'practice' | 'duel' | 'stats' | 'settings') => void
  onSettings: () => void
}

function getStreakWeek(): { day: string; played: boolean; won: boolean }[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = `dailyduel-day-${d.toISOString().slice(0, 10)}`
    const dayResult = localStorage.getItem(key)
    result.push({
      day: days[d.getDay()],
      played: !!dayResult,
      won: dayResult === 'won',
    })
  }
  return result
}

function getMotd(stats: Stats, todayPlayed: boolean): { line1: string; line2: string } {
  if (todayPlayed) return { line1: 'Nice work today!', line2: 'Come back tomorrow for a new puzzle.' }
  if (stats.gamesPlayed === 0) return { line1: 'Ready for your first duel?', line2: '5 letters. 6 guesses. Beat the bot.' }
  if (stats.currentStreak >= 3) return { line1: `${stats.currentStreak}-day streak!`, line2: 'Keep it alive — solve today\'s puzzle.' }
  if (stats.gamesWon > stats.gamesPlayed / 2) return { line1: 'You\'re on a roll.', line2: 'Today\'s puzzle is waiting for you.' }
  return { line1: 'A new puzzle is ready.', line2: 'Solve it before the bot does.' }
}

// SVG marshmallow — puffy pillow shape with bold outline, 3D shading, soft volume
function Marshmallow({ color, shadow, width, height, delay }: { color: string; shadow: string; width: number; height: number; delay: string }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-marshmallow-float"
      style={{ animationDelay: delay }}
    >
      {/* Soft drop shadow */}
      <ellipse cx="18" cy="42" rx="12" ry="3" fill="#000" fillOpacity="0.05" />

      {/* Main pillow body — super round, wide & short */}
      <rect x="4" y="8" width="28" height="28" rx="14" ry="14" fill={color} stroke={shadow} strokeWidth="2.5" />

      {/* Top puffy dome */}
      <ellipse cx="18" cy="12" rx="13" ry="8" fill={color} stroke={shadow} strokeWidth="2.5" />
      {/* Cover inner stroke overlap */}
      <ellipse cx="18" cy="12.5" rx="11" ry="5.5" fill={color} />

      {/* Bottom puffy dome */}
      <ellipse cx="18" cy="32" rx="13" ry="8" fill={color} stroke={shadow} strokeWidth="2.5" />
      <ellipse cx="18" cy="31.5" rx="11" ry="5.5" fill={color} />

      {/* 3D left shading */}
      <rect x="6" y="12" width="10" height="20" rx="5" fill={shadow} fillOpacity="0.12" />

      {/* 3D right highlight */}
      <rect x="22" y="12" width="6" height="18" rx="3" fill="white" fillOpacity="0.18" />

      {/* Big specular highlight — puffy shine */}
      <ellipse cx="13" cy="20" rx="5" ry="8" fill="white" fillOpacity="0.35" />
      {/* Top shine crescent */}
      <ellipse cx="15" cy="10" rx="6" ry="2.5" fill="white" fillOpacity="0.45" />
      {/* Bottom rim light */}
      <ellipse cx="17" cy="33" rx="6" ry="1.5" fill="white" fillOpacity="0.10" />
    </svg>
  )
}

// Floating cloud puff
function CloudPuff({ x, y, scale, delay, opacity }: { x: string; y: string; scale: number; delay: string; opacity: number }) {
  return (
    <svg
      width="80"
      height="40"
      viewBox="0 0 80 40"
      className="absolute animate-float-cloud"
      style={{ left: x, top: y, transform: `scale(${scale})`, animationDelay: delay, opacity }}
      fill="none"
    >
      <circle cx="25" cy="25" r="15" fill="#90CAF9" fillOpacity="0.15" />
      <circle cx="45" cy="20" r="18" fill="#90CAF9" fillOpacity="0.12" />
      <circle cx="60" cy="26" r="12" fill="#90CAF9" fillOpacity="0.10" />
    </svg>
  )
}

// Floating star sparkle
function Sparkle({ x, y, delay, size }: { x: string; y: string; delay: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className="absolute animate-float-cloud"
      style={{ left: x, top: y, animationDelay: delay }}
    >
      <path d="M10 0L12.2 7.8L20 10L12.2 12.2L10 20L7.8 12.2L0 10L7.8 7.8Z" fill="#FFD54F" fillOpacity="0.25" />
    </svg>
  )
}

export function HomePage({ stats, settings, onNavigate, onSettings }: HomePageProps) {
  const [showXpModal, setShowXpModal] = useState(false)
  const rank = getRank(stats.level)
  const rankColor = getRankColor(rank)
  const xpInLevel = stats.xp % 100
  const streakWeek = getStreakWeek()
  const todayPlayed = streakWeek[6]?.played
  const motd = getMotd(stats, todayPlayed)

  const handleNav = (page: 'practice' | 'duel') => {
    if (settings.sound) playClick()
    onNavigate(page)
  }

  return (
    <div className="min-h-dvh flex flex-col items-center relative overflow-hidden">
      {/* === FULL-WIDTH BACKGROUND === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">

        {/* Giant cloud blobs */}
        <div className="absolute -top-48 -left-[20%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-[#90CAF9]/[0.10] rounded-full blur-[100px] animate-cloud-drift" />
        <div className="absolute -top-16 -right-[20%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-[#B39DDB]/[0.09] rounded-full blur-[100px] animate-cloud-drift" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[40%] -left-[25%] w-[65vw] h-[65vw] max-w-[750px] max-h-[750px] bg-[#80CBC4]/[0.07] rounded-full blur-[100px] animate-cloud-drift" style={{ animationDelay: '-1.5s' }} />
        <div className="absolute top-[30%] -right-[15%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-[#FFD54F]/[0.08] rounded-full blur-[100px] animate-cloud-drift" style={{ animationDelay: '-4s' }} />
        <div className="absolute -bottom-32 -left-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-[#FFAB91]/[0.06] rounded-full blur-[100px] animate-cloud-drift" style={{ animationDelay: '-5s' }} />
        <div className="absolute bottom-[10%] -right-[20%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#90CAF9]/[0.07] rounded-full blur-[100px] animate-cloud-drift" style={{ animationDelay: '-2s' }} />

        {/* Marshmallows — puffy pillow shapes scattered across edges */}
        <div className="absolute top-[8%] left-[3%]"><Marshmallow color="#FFF0F5" shadow="#E8B4C8" width={30} height={37} delay="0s" /></div>
        <div className="absolute top-[22%] right-[4%]"><Marshmallow color="#F0F0FF" shadow="#C8C0E0" width={26} height={32} delay="-2s" /></div>
        <div className="absolute top-[45%] left-[2%]"><Marshmallow color="#FFF8F0" shadow="#E8D0B0" width={28} height={34} delay="-4s" /></div>
        <div className="absolute top-[65%] right-[3%]"><Marshmallow color="#F5F0FF" shadow="#D0C0E8" width={27} height={33} delay="-6s" /></div>
        <div className="absolute top-[80%] left-[5%]"><Marshmallow color="#FFF0F5" shadow="#E8B4C8" width={24} height={29} delay="-1.5s" /></div>
        <div className="absolute top-[35%] right-[6%]"><Marshmallow color="#F0FFF0" shadow="#B8D8B0" width={22} height={27} delay="-8s" /></div>
        <div className="absolute top-[55%] left-[7%]"><Marshmallow color="#FFFFF0" shadow="#E0E0B0" width={26} height={32} delay="-3.5s" /></div>
        <div className="absolute top-[10%] right-[8%]"><Marshmallow color="#FFF5EE" shadow="#E0C8B8" width={22} height={27} delay="-5.5s" /></div>
        <div className="absolute top-[90%] right-[5%]"><Marshmallow color="#F8F0FF" shadow="#D8C0E8" width={28} height={34} delay="-7s" /></div>
        <div className="absolute top-[75%] left-[4%]"><Marshmallow color="#F0FFFF" shadow="#B0D8D8" width={24} height={29} delay="-9s" /></div>

        {/* Cloud puffs — scattered */}
        <CloudPuff x="2%" y="5%" scale={1.2} delay="0s" opacity={0.6} />
        <CloudPuff x="85%" y="12%" scale={0.9} delay="-2s" opacity={0.5} />
        <CloudPuff x="5%" y="38%" scale={1.0} delay="-4s" opacity={0.4} />
        <CloudPuff x="88%" y="55%" scale={1.1} delay="-1s" opacity={0.5} />
        <CloudPuff x="3%" y="72%" scale={0.8} delay="-3s" opacity={0.4} />
        <CloudPuff x="90%" y="80%" scale={1.0} delay="-5s" opacity={0.45} />

        {/* Sparkle stars */}
        <Sparkle x="6%" y="3%" delay="0s" size={14} />
        <Sparkle x="92%" y="8%" delay="-1.5s" size={12} />
        <Sparkle x="10%" y="30%" delay="-3s" size={10} />
        <Sparkle x="88%" y="35%" delay="-4.5s" size={16} />
        <Sparkle x="4%" y="50%" delay="-2s" size={12} />
        <Sparkle x="91%" y="62%" delay="-6s" size={10} />
        <Sparkle x="7%" y="78%" delay="-5s" size={14} />
        <Sparkle x="89%" y="88%" delay="-7s" size={11} />
        <Sparkle x="15%" y="15%" delay="-8s" size={8} />
        <Sparkle x="80%" y="45%" delay="-9s" size={9} />

        {/* Left decorative strip */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#90CAF9]/20 via-[#B39DDB]/10 to-[#80CBC4]/15 rounded-full" />
        <div className="absolute top-0 left-3 w-1 h-1/2 bg-gradient-to-b from-[#FFD54F]/15 to-transparent rounded-full animate-float-cloud" />
        <div className="absolute top-1/3 left-1.5 w-0.5 h-1/3 bg-[#B39DDB]/20 rounded-full animate-float-cloud" style={{ animationDelay: '-1.5s' }} />
        <div className="absolute bottom-0 left-4 w-0.5 h-2/5 bg-[#80CBC4]/15 rounded-full animate-float-cloud" style={{ animationDelay: '-3s' }} />

        {/* Right decorative strip */}
        <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[#FFD54F]/20 via-[#90CAF9]/10 to-[#B39DDB]/15 rounded-full" />
        <div className="absolute top-1/4 right-2.5 w-1 h-1/2 bg-gradient-to-b from-[#90CAF9]/15 to-transparent rounded-full animate-float-cloud" style={{ animationDelay: '-0.5s' }} />
        <div className="absolute top-0 right-4 w-0.5 h-2/5 bg-[#FFD54F]/15 rounded-full animate-float-cloud" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-0 right-1.5 w-0.5 h-1/3 bg-[#80CBC4]/18 rounded-full animate-float-cloud" style={{ animationDelay: '-4s' }} />

        {/* Floating dots along edges */}
        <div className="absolute top-[5%] left-8 w-2.5 h-2.5 bg-[#90CAF9]/25 rounded-full animate-float-cloud" />
        <div className="absolute top-[15%] right-10 w-2 h-2 bg-[#FFD54F]/20 rounded-full animate-float-cloud" style={{ animationDelay: '-1s' }} />
        <div className="absolute top-[35%] left-6 w-2 h-2 bg-[#B39DDB]/22 rounded-full animate-float-cloud" style={{ animationDelay: '-2.5s' }} />
        <div className="absolute top-[55%] right-7 w-2.5 h-2.5 bg-[#80CBC4]/20 rounded-full animate-float-cloud" style={{ animationDelay: '-3.5s' }} />
        <div className="absolute top-[75%] left-9 w-2 h-2 bg-[#FFAB91]/18 rounded-full animate-float-cloud" style={{ animationDelay: '-4.5s' }} />
        <div className="absolute top-[90%] right-6 w-2 h-2 bg-[#90CAF9]/22 rounded-full animate-float-cloud" style={{ animationDelay: '-5.5s' }} />

        {/* Corner radiance */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#90CAF9]/[0.07] rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B39DDB]/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#80CBC4]/[0.05] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFD54F]/[0.05] rounded-full blur-3xl" />

        {/* Bottom wave */}
        <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 400 80" fill="none" preserveAspectRatio="none">
          <path d="M0 50C80 20 160 60 240 30C300 10 360 40 400 25V80H0Z" fill="url(#hw1)" fillOpacity="0.10" />
          <path d="M0 60C60 40 140 65 220 40C300 15 360 50 400 35V80H0Z" fill="url(#hw2)" fillOpacity="0.06" />
          <defs>
            <linearGradient id="hw1" x1="0" y1="0" x2="400" y2="0">
              <stop offset="0%" stopColor="#90CAF9" />
              <stop offset="50%" stopColor="#B39DDB" />
              <stop offset="100%" stopColor="#80CBC4" />
            </linearGradient>
            <linearGradient id="hw2" x1="0" y1="0" x2="400" y2="0">
              <stop offset="0%" stopColor="#80CBC4" />
              <stop offset="50%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#90CAF9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Top arc */}
        <svg className="absolute top-0 left-0 w-full h-5" viewBox="0 0 400 6" fill="none" preserveAspectRatio="none">
          <path d="M0 3C100 0 200 6 300 2C350 0 380 3 400 1V0H0Z" fill="url(#htop)" fillOpacity="0.12" />
          <defs>
            <linearGradient id="htop" x1="0" y1="0" x2="400" y2="0">
              <stop offset="0%" stopColor="#90CAF9" />
              <stop offset="100%" stopColor="#B39DDB" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* === CONTENT COLUMN === */}
      <div className="w-full max-w-xl mx-auto px-5 py-4 flex flex-col items-center">

        {/* Header row — title on left, settings on right */}
        <div className="w-full flex items-start justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#4A5568]">
              daily<span className="text-[#64B5F6]">duel</span>
            </h1>
            <p className="text-[#718096] text-[10px] tracking-widest uppercase font-medium mt-0.5">head-to-head word battles</p>
          </div>
          <button
            onClick={() => { if (settings.sound) playClick(); onSettings() }}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-[#F0F7FA] hover:bg-[#E3F2FD] transition-all duration-300 cursor-pointer hover:scale-110 mt-1"
          >
            <div className="transition-all duration-300 group-hover:rotate-90">
              <GearIcon size={20} className="text-[#A0AEC0] group-hover:text-[#64B5F6]" />
            </div>
          </button>
        </div>

        {/* Crown */}
        <div className="mb-3 animate-float">
          <CrownIcon size={52} className="text-[#E8B830] drop-shadow-sm" />
        </div>

        {/* ACTION BUTTONS — right after header */}
        <div className="flex flex-col gap-2.5 w-full mb-3">
          <button
            onClick={() => handleNav('duel')}
            className="marsh-btn marsh-btn-secondary w-full py-4 text-sm font-semibold group/btn"
          >
            <span className="flex items-center justify-center gap-2">
              <CrossedSwordsIcon size={18} className="text-[#64B5F6] group-hover/btn:scale-125 transition-transform duration-300" />
              Start Duel
            </span>
          </button>
          <button
            onClick={() => handleNav('practice')}
            className="marsh-btn marsh-btn-practice w-full py-3.5 text-sm font-semibold group/btn"
          >
            <span className="flex items-center justify-center gap-2">
              <TargetIcon size={18} className="text-[#4A5568] group-hover/btn:scale-125 transition-transform duration-300" />
              Practice Mode
            </span>
          </button>
        </div>

        {/* Daily Challenge — compact strip */}
        <div className="w-full marsh-card p-3 mb-3 text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-3">
            <div className="text-xs text-[#718096] uppercase tracking-wider font-medium">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="h-4 w-px bg-[#E2E8F0]" />
            <div className="text-sm font-semibold text-[#4A5568]">{motd.line1}</div>
            {todayPlayed && (
              <>
                <div className="h-4 w-px bg-[#E2E8F0]" />
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#A5D6A7]/30 text-[#2E7D32] text-[11px] font-semibold">
                  <TrophyIcon size={12} className="text-[#43A047]" /> Done
                </div>
              </>
            )}
          </div>
        </div>

        {/* Rank Card — clickable */}
        <button
          onClick={() => { if (settings.sound) playClick(); setShowXpModal(true) }}
          className="group w-full marsh-card p-3 mb-3 cursor-pointer hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[#718096] uppercase tracking-wider font-medium">Rank</span>
            <span className={`text-sm font-bold ${rankColor} group-hover:scale-110 inline-block transition-transform`}>{rank}</span>
          </div>
          <div className="w-full bg-[#E3F2FD] rounded-full h-2 mb-1 overflow-hidden">
            <div className="h-2 rounded-full transition-all duration-700 ease-out" style={{ width: `${xpInLevel}%`, background: 'linear-gradient(90deg, #90CAF9, #64B5F6)' }} />
          </div>
          <div className="flex justify-between text-[11px] text-[#718096] font-medium">
            <span>Lv {stats.level}</span>
            <span className="font-mono-nums">{xpInLevel}/100 XP</span>
          </div>
        </button>

        {/* Ad Banner */}
        <AdBanner />

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5 w-full mb-3">
          <div className="group marsh-card p-3.5 text-center cursor-pointer hover:scale-105 hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-center mb-1.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFF8E1] flex items-center justify-center group-hover-wiggle">
                <TrophyIcon size={18} className="text-[#FFD54F]" />
              </div>
            </div>
            <div className="text-xl font-bold font-mono-nums text-[#4A5568] group-hover-scale">{stats.gamesWon}</div>
            <div className="text-[10px] text-[#718096] uppercase font-medium mt-0.5">Wins</div>
          </div>
          <div className="group marsh-card p-3.5 text-center cursor-pointer hover:scale-105 hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-center mb-1.5">
              <div className="w-9 h-9 rounded-xl bg-[#EDE7F6] flex items-center justify-center group-hover-wiggle">
                <HeartIcon size={18} className={stats.currentStreak > 0 ? 'text-[#B39DDB] animate-heart-beat' : 'text-[#CBD5E0]'} />
              </div>
            </div>
            <div className="text-xl font-bold font-mono-nums text-[#4A5568] group-hover-scale">{stats.currentStreak}</div>
            <div className="text-[10px] text-[#718096] uppercase font-medium mt-0.5">Streak</div>
          </div>
          <div className="group marsh-card p-3.5 text-center cursor-pointer hover:scale-105 hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-center mb-1.5">
              <div className="w-9 h-9 rounded-xl bg-[#E0F2F1] flex items-center justify-center group-hover-wiggle">
                <FireIcon size={18} className="text-[#80CBC4]" />
              </div>
            </div>
            <div className="text-xl font-bold font-mono-nums text-[#4A5568] group-hover-scale">
              {stats.gamesPlayed > 0 ? `${Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%` : '--'}
            </div>
            <div className="text-[10px] text-[#718096] uppercase font-medium mt-0.5">Win Rate</div>
          </div>
        </div>

        {/* Weekly Streak Calendar */}
        <div className="w-full marsh-card p-3.5 mb-3 hover:scale-[1.005] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#718096] uppercase tracking-wider font-medium">This Week</span>
            <div className="flex items-center gap-3 text-[10px] text-[#718096]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#A5D6A7] inline-block" /> Won</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#FFE082] inline-block" /> Lost</span>
            </div>
          </div>
          <div className="flex justify-between gap-1.5">
            {streakWeek.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[9px] text-[#A0AEC0] font-medium">{day.day}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 cursor-default hover:scale-110 hover:-translate-y-0.5 ${
                  day.won
                    ? 'bg-[#A5D6A7] text-[#1B5E20] shadow-sm hover:shadow-md'
                    : day.played
                      ? 'bg-[#FFE082] text-[#E65100] shadow-sm hover:shadow-md'
                      : 'bg-[#ECEFF1] text-[#B0BEC5] hover:bg-[#E0E0E0]'
                }`}>
                  {day.won ? 'W' : day.played ? 'L' : '-'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Play — compact */}
        <div className="w-full marsh-raised p-3 mb-4 rounded-2xl">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-[#E3F2FD] flex items-center justify-center text-sm font-bold text-[#64B5F6]">5</div>
              <div className="text-[10px] text-[#718096] leading-tight">letters</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-[#FFF8E1] flex items-center justify-center text-sm font-bold text-[#FFD54F]">6</div>
              <div className="text-[10px] text-[#718096] leading-tight">max tries</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2F1] flex items-center justify-center text-sm">
                <CrossedSwordsIcon size={16} className="text-[#80CBC4]" />
              </div>
              <div className="text-[10px] text-[#718096] leading-tight">race bot</div>
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-2 text-[10px] text-[#718096]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#A5D6A7] inline-block" /> Right spot</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#FFE082] inline-block" /> Wrong spot</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#ECEFF1] inline-block" /> Absent</span>
          </div>
        </div>

        {/* Star divider */}
        <div className="flex items-center gap-2 mb-3 w-full opacity-25">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#90CAF9] to-transparent" />
          <div className="animate-float-cloud"><StarIcon size={10} className="text-[#FFD54F]" /></div>
          <div className="animate-float-cloud" style={{ animationDelay: '-1.5s' }}><StarIcon size={7} className="text-[#B39DDB]" /></div>
          <div className="animate-float-cloud" style={{ animationDelay: '-3s' }}><StarIcon size={9} className="text-[#80CBC4]" /></div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#90CAF9] to-transparent" />
        </div>

        {/* Bottom tagline */}
        <p className="text-[10px] text-[#A0AEC0]/50 tracking-widest uppercase font-medium mb-4">new puzzle daily at midnight</p>
      </div>

      {/* XP Modal */}
      {showXpModal && <XpModal stats={stats} onClose={() => setShowXpModal(false)} />}
    </div>
  )
}
