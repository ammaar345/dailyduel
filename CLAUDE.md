# DailyDuel — Head-to-Head Daily Word Battles

## Project Overview
DailyDuel is a competitive daily word puzzle game where two players race to solve the same puzzle. Built on React 19 + TypeScript + Tailwind v4 + Vite, leveraging the proven daily game model with a unique PvP twist that drives viral sharing.

**Repo**: https://github.com/ammaar345/dailyduel
**Branch**: `feature/initial-setup`
**Dev**: `npm run dev` (localhost:3000)

---

## What's Built (V0.1 — June 23, 2026)

### Homepage
- Animated crown hero
- Rank card with XP bar + level display
- Win / streak / best-time stat cards
- Navigation to Practice and Duel modes
- Settings button

### Practice Mode
- 5-letter Wordle-style board (6 guesses)
- On-screen keyboard with color feedback (green/yellow/zinc)
- Physical keyboard support
- Daily puzzle seeded from date (same word for everyone)
- Win/loss result screen with time, guesses, rank, share to clipboard
- Shake animation on invalid guess
- Tile pop-in animations with staggered delays
- Web Audio API sounds (key click, backspace, correct, present, absent, win, lose)

### Duel Mode
- 3-2-1 countdown before race
- Side-by-side boards: YOU vs RIVAL BOT
- Bot opponent with randomized solve time (8-20s)
- Real-time board updates as both play
- Crown animation on solved board
- Win/loss result screen with opponent comparison + share

### Settings
- Sound toggle + volume slider
- 4 contrast themes (medium, high, soft, dark)
- Animations toggle

### Progression System (LocalStorage)
- XP earned from every game
- Level-up system (100 XP per level)
- Ranks: Bronze > Silver > Gold > Platinum > Diamond > Crown
- Win streak tracking with fire emoji

### Sound Engine
- Web Audio API oscillator-based (zero external files)
- Key clicks, backspace, enter, correct/present/absent feedback
- Win fanfare (ascending notes), lose drone
- Click sound for navigation

### Actual File Structure
```
src/
├── main.tsx                     # Entry point
├── App.tsx                      # Router + state management
├── index.css                    # Tailwind v4 + animations + dither overlay
├── vite-env.d.ts                # Vite type declarations
├── components/
│   ├── game/
│   │   ├── Tile.tsx             # Letter tile with status color + dither
│   │   ├── GameBoard.tsx        # 5x6 grid (practice mode)
│   │   ├── GameKeyboard.tsx     # On-screen keyboard with color states
│   │   ├── DuelBoard.tsx        # Compact board for side-by-side duels
│   │   └── ResultScreen.tsx     # Win/loss overlay with stats + share
│   └── ui/
│       └── SettingsDialog.tsx   # Sound/theme/animation settings
├── lib/
│   ├── words.ts                 # 80+ curated 5-letter words, date-seeded
│   ├── daily.ts                 # Puzzle generation, guess checking, validation
│   ├── gameLogic.ts             # Game state machine, key handling, win/loss
│   ├── stats.ts                 # Stats load/save, XP, rank calculation
│   ├── settings.ts              # Settings load/save with defaults
│   └── sounds.ts                # Web Audio API sound effects
└── pages/
    ├── HomePage.tsx             # Main menu with stats
    ├── PracticePage.tsx         # Single-player practice
    └── DuelPage.tsx             # 1v1 duel vs bot
```

### Tech Notes
- Tailwind v4 (`@import "tailwindcss"`, no config file)
- Tile dither via CSS SVG background pattern
- CSS animations: pop-in, shake, slide-up, pulse-glow, crown-bounce, fire-flicker
- Date-seeded puzzle (same word for everyone on same day)
- Word list: 80+ 5-letter words across categories (animals, nature, tech, food, actions, colors, abstract, objects)
- No external audio files — all sounds generated via Web Audio API oscillators

### What Works Now
- Practice mode: fully playable Wordle clone with sounds + stats
- Duel mode: race a bot on the same daily puzzle, side-by-side boards
- Progression: XP, levels, ranks, streaks all persist in LocalStorage
- Settings: sound, theme, animations all functional
- Share: copies emoji grid to clipboard on win/loss
- TypeScript: zero compilation errors, clean build

### What's NOT Built Yet
- Real-time PvP (WebRTC) — bot is placeholder
- Room creation/joining via shareable link
- Dictionary validation (currently accepts any 5 letters)
- Battle pass / cosmetic shop
- Carbon Ads / Gumroad integration
- Friends list / rivalry tracking
- Push notifications
- Tournament mode
- Mobile responsive (works but not optimized)
- GitHub Pages deployment

---

## Original Plan (Pre-Build)

## Core Concept: Real-Time Word Battles

### The Twist
Not another Wordle clone. Two players compete on the exact same puzzle simultaneously. Fastest solver wins the crown, loser gets "try again tomorrow."

### How It Works
1. **Daily Puzzle Load**: Both players get identical puzzle (seeded by date)
2. **Real-Time Competition**: Live side-by-side boards or split-screen
3. **Race Mechanics**: First to solve wins, loser sees "Better luck tomorrow!"
4. **Victory Conditions**: 
   - Solve correctly before opponent = Crown + "Beat X in Y seconds"
   - Solve after opponent = "Try again tomorrow" + replay option
5. **Shareable Results**: "I beat Sarah in 3.2 seconds!" with puzzle stats

## Gameplay Flow

### Single Duel Mode
1. Player A creates room/links to Player B
2. Both load same daily puzzle
3. Race begins simultaneously
4. Real-time updates show who's ahead
5. Winner declared immediately upon solve
6. Results screen with stats and share button

### Tournament Mode (Future)
1. 8-player bracket system
2. Daily tournaments with prizes
3. Global leaderboard
4. Ranked seasons

### Practice Mode
- Single player puzzle solving
- No time pressure
- Learn puzzle patterns
- Build strategy

## Monetization Strategy

### Primary: Carbon Ads
- **Placement**: Header banner + interstitial after duels
- **RPM**: $3-5 (gaming audience pays well)
- **Target**: 10K daily duels = $900-1500/mo

### Secondary: "Duel Pack" ($3 via Gumroad)
- 100 exclusive themed puzzles
- Advanced statistics dashboard
- Puzzle solving patterns guide
- Personal improvement tracker
- Lifetime updates

### Tertiary: "Duel Master" ($5 one-time)
- Removes all ads
- Exclusive crown animations
- Early access to new features
- Discord role in community server

## Revenue Projections

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Daily Duels | 1K | 5K | 10K |
| Ad Revenue | $90-150 | $450-750 | $900-1500 |
| Duel Pack Sales | 30 = $90 | 100 = $300 | 200 = $600 |
| Duel Master Sales | 10 = $50 | 50 = $250 | 100 = $500 |
| **Total** | **$230-290** | **$1000-1300** | **$2000-2600** |

## Technical Architecture

### Frontend Stack
- **React 19** + TypeScript
- **Tailwind v4** for styling
- **Vite** for build tooling
- **WebRTC** for real-time duels (peer-to-peer)
- **Web Audio API** for enhanced sound effects

### Data Flow
1. **Daily Puzzle System** (reuse TrailWord logic)
   - Date-seeded puzzles
   - 115 curated words + categories
   - swear word filtering
   
2. **Duel Engine**
   - Room creation/joining
   - Real-time state sync
   - Win condition detection
   - Result calculation

3. **State Management**
   - React useState for UI state
   - LocalStorage for stats/persistence
   - WebRTC DataChannel for live updates

### Key Components
```
src/
├── components/
│   ├── game/
│   │   ├── Tile.tsx               ✅ built
│   │   ├── GameBoard.tsx          ✅ built
│   │   ├── GameKeyboard.tsx       ✅ built
│   │   ├── DuelBoard.tsx          ✅ built
│   │   ├── ResultScreen.tsx       ✅ built
│   │   └── TournamentBracket.tsx  🔲 future
│   ├── ui/
│   │   ├── SettingsDialog.tsx     ✅ built
│   │   ├── icons.tsx              🔲 future
│   │   └── animations.tsx         🔲 future
│   └── monetization/
│       ├── AdBanner.tsx           🔲 future
│       ├── GumroadButton.tsx      🔲 future
│       └── PurchaseDialog.tsx     🔲 future
├── lib/
│   ├── words.ts                   ✅ built (80+ words)
│   ├── daily.ts                   ✅ built
│   ├── gameLogic.ts               ✅ built
│   ├── stats.ts                   ✅ built
│   ├── settings.ts                ✅ built
│   ├── sounds.ts                  ✅ built
│   ├── duel-engine.ts             🔲 future (WebRTC)
│   └── webrtc.ts                  🔲 future (peer-to-peer)
└── pages/
    ├── HomePage.tsx               ✅ built
    ├── PracticePage.tsx           ✅ built
    ├── DuelPage.tsx               ✅ built (bot only)
    └── TournamentPage.tsx         🔲 future
```

## Build Plan (3 Days)

### Day 1: Foundation & UI
- [ ] Clone TrailWord structure
- [ ] Create duel-specific UI components
- [ ] Implement room creation/joining flow
- [ ] Build side-by-side game boards
- [ ] Add basic sound effects

### Day 2: Real-Time Engine
- [ ] Implement WebRTC room management
- [ ] Create real-time state synchronization
- [ ] Add win detection system
- [ ] Build results screen with sharing
- [ ] Practice mode integration

### Day 3: Monetization & Polish
- [ ] Add Carbon Ads integration
- [ ] Build Gumroad purchase flow
- [ ] Implement "Duel Pack" content
- [ ] Add settings/stats persistence
- [ ] Polish animations and UX

## Features & Enhancements

### Phase 1 (V1.0)
- ✅ Daily puzzles
- ✅ Real-time duels
- ✅ Practice mode
- ✅ Basic stats
- ✅ Ad monetization
- ✅ Gumroad integration

### Phase 2 (V1.5)
- 🔄 Tournaments
- 🔄 Global leaderboard
- 🔄 Puzzle difficulty levels
- 🔄 Hint system (limited uses)
- 🔄 Custom puzzle packs

### Phase 3 (V2.0)
- 🔄 Mobile app (React Native)
- 🔄 AI puzzle generation
- 🔄 Sponsorship integration
- 🔄 Live events
- 🔄 Social features

## Marketing Strategy

### Launch Channels
1. **Reddit**: r/gaming, r/wordle, r/webgames
2. **Twitter/X**: Wordle communities, gaming influencers
3. **ProductHunt**: Launch for visibility
4. **Discord**: Gaming communities
5. **TikTok**: "Beat your friends in word puzzles" videos

### Viral Loops
- "I beat my friend in 2.1 seconds!" - shareable results
- Daily challenge: "Beat today's puzzle faster than yesterday"
- Tournament brackets drive group play
- Leaderboard competition

## Competitive Analysis

### Advantages
- **Unique PvP twist** - not another Wordle clone
- **Viral sharing** - people love competitive results
- **Proven model** - daily games work
- **Fast build** - reuse TrailWord foundation
- **Clear monetization** - multiple revenue streams

### Challenges
- **Real-time complexity** - WebRTC implementation
- **Serverless constraint** - peer-to-peer only
- **User acquisition** - need viral sharing
- **Content generation** - 365 daily puzzles needed

## Success Metrics

### V1.0 Targets
- 1K daily active users by month 1
- 100 "Duel Pack" sales by month 2
- 50%+ retention rate
- <100ms real-time sync latency

### Long-term Goals
- 10K daily duels by month 6
- $2K+/mo revenue by month 6
- #1 spot on ProductHunt
- Featured in major gaming blogs

## Future Roadmap

### Q1 2026 (Post-Launch)
- Mobile app development
- Tournament system
- Puzzle editor for user-generated content
- Integration with major word game APIs

### Q2 2026 (Scaling)
- Premium tournament entries ($1-5 each)
- Corporate team-building tournaments
- API for third-party integrations
- Merchandise store

### Q3 2026 (Expansion)
- Multi-language support
- Theme packs (sports, movies, etc.)
- Seasonal events with prizes
- Sponsorship deals

## Risks & Mitigations

### Technical Risks
- **WebRTC complexity** → Start simple, add features incrementally
- **Real-time sync issues** → Implement fallback polling mechanism
- **Performance** → Optimize with React.memo and useCallback

### Business Risks
- **Market saturation** → Focus on unique PvP angle
- **User acquisition** → Strong viral loop is key
- **Monetization** → Test multiple price points

## Competitive Dominance: How to Milk More Than the Milking Games

### What Top Money Games Do (And How We Beat Them)

#### 1. Wordle (NYT) — The $1M Acquisition
**What they milk:** Streak addiction, daily ritual, social sharing (colored grid)
**Their weakness:** Solo only. No real competition. No progression. One game per day = limited engagement.
**Our edge:** PvP duels make it social AND competitive. Add streaks + progression + ranks to trap users in daily loops.

#### 2. Candy Crush / Match-3 — $1B+/Year from King
**What they milk:** Lives system (wait or pay), boosters, "one more level," social leaderboards
**Their weakness:** Pay-to-win mechanics. No real skill. Predatory IAP.
**Our edge:** Skill-based competition. Never pay-to-win. Monetize through cosmetics + battle pass, not lives/energy.

#### 3. Fortnite — Battle Pass King
**What they milk:** Battle pass ($10/season), cosmetic skins, FOMO (limited-time items), social play
**Their weakness:** Requires high-end hardware. Complex. Kids need parents' credit cards.
**Our edge:** Browser-based, zero-install. Same battle pass model but accessible to everyone. Lower barrier = more players.

#### 4. Chess.com — Competitive Depth
**What they milk:** Premium ($7/mo) for lessons, puzzles, analysis. Free tier is limited.
**Their weakness:** Steep learning curve. Intimidating for casuals. Old demographics.
**Our edge:** Word games are universal. Everyone knows 5-letter words. PvP with simpler rules = mass appeal.

#### 5. Among Us — Social Virality
**What they milk:** Cosmetics, maps, roles. Massive social engagement.
**Their weakness:** Needs 4+ players. Complex setup. No daily hook.
**Our edge:** 1v1 duels = instant matchmaking. Daily puzzle = daily hook. No lobby waiting.

#### 6. Trivia Crack / Words With Friends
**What they milk:** Turn-based competition, ads, premium removal
**Their weakness:** Slow pace. No real-time thrill. Feels dated.
**Our edge:** Real-time speed. "Beat your friend in 2 seconds" is visceral. Turn-based is boring.

### The DailyDuel Secret Sauce: 5 Pillars of Domination

#### Pillar 1: Streak Addiction (Steal from Wordle)
- Track daily win streaks
- "Don't break your 14-day streak!" push notification
- Streak milestones unlock exclusive rewards
- Streak freezes available (free weekly, buy extra)
- **Why it works:** Loss aversion. People hate losing progress more than they enjoy gaining it.

#### Pillar 2: Progression & Unlocks (Steal from Fortnite/Roblox)
- XP system: earn XP from every duel (win = more XP)
- Ranks: Bronze → Silver → Gold → Platinum → Diamond → Crown → Legend
- Seasonal resets every 3 months (keeps it fresh)
- Unlockable cosmetics: board themes, crown styles, victory animations, keyboard skins
- **Why it works:** Players invest time → feel committed → spend money to show off.

#### Pillar 3: Battle Pass (Steal from Fortnite)
- Free track: basic rewards (1 reward per 5 levels)
- Premium track ($3/season): exclusive cosmetics, early access, bonus XP
- 30-day season with 30 levels
- Limited-time exclusive items (FOMO)
- **Why it works:** $3 is cheap enough for impulse buy. 10% of players buying = $30 per 100 players/season.

#### Pillar 4: Social Graph (Steal from Among Us/Chess.com)
- Friends list (add via username/link)
- Rivalry system: track head-to-head record with each friend
- "Best of 3/5/7" duel series
- Spectator mode: watch friends duel live
- Rematch button with "revenge" narrative
- **Why it works:** Friends keep friends playing. Social bonds = retention.

#### Pillar 5: Daily Ritual (Steal from Wordle + Duolingo)
- Daily puzzle at midnight (local time)
- Daily reward for logging in (XP bonus)
- "Puzzle of the Day" has bonus XP
- Weekly challenge: "Win 5 duels this week" → bonus rewards
- Monthly tournament bracket (free entry)
- **Why it works:** Habit formation. Once it's a daily routine, quitting feels like loss.

### The Money Machine: Revenue Stack

| Layer | Price | Model | Target |
|-------|-------|-------|--------|
| **Ads** | $0 (free users) | Carbon Ads banner | All free users |
| **Battle Pass** | $3/season (30 days) | One-time purchase | 10-15% of players |
| **Cosmetics** | $1-5 each | Individual purchase | Whales (1-3%) |
| **Streak Freeze** | $1 each | Consumable | Streak-conscious (20%) |
| **Ad Removal** | $5 one-time | Permanent | Ad-haters (5%) |
| **Premium Duel** | $0.50 entry | Tournament fee | Competitive (5%) |

### Revenue Projection (With New Monetization)

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Daily Active Users | 2K | 15K | 50K |
| Ad Revenue | $180-300 | $1,350-2,250 | $4,500-7,500 |
| Battle Pass Sales | 200 × $3 = $600 | 1,500 × $3 = $4,500 | 5,000 × $3 = $15,000 |
| Cosmetic Sales | $100 | $750 | $2,500 |
| Streak Freezes | $50 | $375 | $1,250 |
| Ad Removal | $50 | $375 | $1,250 |
| Tournament Fees | $25 | $187 | $625 |
| **Total** | **$1,005-1,125** | **$7,537-8,437** | **$25,075-28,325** |

### Why DailyDuel Beats Every Competitor

| Feature | Wordle | Candy Crush | Fortnite | Chess.com | **DailyDuel** |
|---------|--------|-------------|----------|-----------|---------------|
| Daily hook | ✅ | ❌ | ❌ | ❌ | ✅ |
| Real-time PvP | ❌ | ❌ | ✅ | ✅ | ✅ |
| Skill-based | ✅ | ❌ | ✅ | ✅ | ✅ |
| Zero install | ✅ | ❌ | ❌ | ✅ | ✅ |
| Free to play | ✅ | ⚠️ P2W | ⚠️ BP | ⚠️ Premium | ✅ |
| Streak system | ✅ | ❌ | ❌ | ❌ | ✅ |
| Progression | ❌ | ✅ | ✅ | ✅ | ✅ |
| Social graph | ❌ | ✅ | ✅ | ✅ | ✅ |
| Battle pass | ❌ | ❌ | ✅ | ❌ | ✅ |
| Tournaments | ❌ | ❌ | ✅ | ✅ | ✅ |
| Browser-based | ✅ | ❌ | ❌ | ✅ | ✅ |
| Mobile-ready | ✅ | ✅ | ❌ | ✅ | ✅ |

**DailyDuel is the only game that combines ALL of these advantages.**

### Implementation Priority

#### Phase 1: Core Addiction Loop (Week 1)
- [ ] Streak system with daily tracking
- [ ] XP and leveling system
- [ ] Basic rank progression (Bronze → Crown)
- [ ] Daily reward login bonus
- [ ] Friends list (add/track rivals)

#### Phase 2: Monetization (Week 2)
- [ ] Battle Pass with free + premium tracks
- [ ] Cosmetic shop (board themes, crown styles)
- [ ] Streak freeze items
- [ ] Ad removal option
- [ ] Carbon Ads integration

#### Phase 3: Social Virality (Week 3)
- [ ] Spectator mode
- [ ] Best-of series (3/5/7)
- [ ] Shareable rivalry stats
- [ ] Weekly challenges
- [ ] Monthly tournament bracket

#### Phase 4: Retention Mechanics (Week 4)
- [ ] Push notifications for streaks
- [ ] Achievement badges
- [ ] Leaderboard (friends, global, regional)
- [ ] Season system with resets
- [ ] Puzzle of the day with bonus XP

### The Viral Loop That Prints Money

```
Player A beats Player B → 
"I beat you in 2.1 seconds!" share →
Player B joins to prove themselves →
Player B creates account →
Both play daily to maintain streaks →
Both buy battle pass for exclusive cosmetics →
Both invite friends to duel →
Friends invite friends →
VIRAL GROWTH + RECURRING REVENUE
```

### Key Differentiators (What Nobody Else Has)

1. **"Duel Time" stat**: Track average solve time, show improvement over weeks
2. **"Rivalry Score"**: Head-to-head record with each friend (creates narrative)
3. **"Crown Defense"**: If you're #1 on leaderboard, others challenge you to take the crown
4. **"Puzzle Streak Bonus"**: Solve 7 days in a row → get mystery cosmetic
5. **"Comeback Mechanic"**: If you lose 3 duels in a row, next duel gives 2x XP (prevents rage quit)

### Technical Requirements for New Features

| Feature | Complexity | Time | Dependencies |
|---------|-----------|------|--------------|
| Streak system | Low | 2 hours | LocalStorage |
| XP/leveling | Low | 3 hours | LocalStorage |
| Battle Pass | Medium | 1 week | Gumroad integration |
| Friends list | Medium | 1 week | LocalStorage + share links |
| Spectator mode | High | 2 weeks | WebRTC enhancement |
| Tournaments | High | 2 weeks | Bracket algorithm |
| Push notifications | Medium | 3 days | Web Push API |
| Cosmetic shop | Medium | 1 week | Gumroad integration |

## Conclusion

DailyDuel combines the proven daily game model with competitive gameplay to create a unique viral experience. The build is fast (3 days), revenue is clear (multiple streams), and the market is ready for something beyond Wordle clones. The key is executing the real-time duel mechanics smoothly and building a strong viral loop through competitive sharing.

---

## What To Do Next (Prioritized)

### 1. Dictionary Validation
- Add real 5-letter word list (TWL or SOWPODS, ~12K words)
- Reject invalid guesses with shake + "not a word" toast
- Keep answer list curated (80+ fun/common words)

### 2. Real WebRTC PvP
- Replace bot with real human opponent
- Room creation via shareable link (`dailyduel.app/room/ABC123`)
- Signaling through Firebase Realtime Database (free tier)
- Peer-to-peer state sync via WebRTC DataChannel
- Fallback: "connection lost" + retry if WebRTC fails
- This is THE viral mechanic — "beat your friend" only works with real friends

### 3. GitHub Pages Deploy
- `npm run build` -> push `dist/` to `gh-pages` branch
- Zero-cost hosting, ready to go

### 4. Carbon Ads
- Header banner (728x90 or responsive)
- Interstitial after duel results
- $3-5 RPM for gaming audience
- Only show to free users (not battle pass holders)

### 5. Battle Pass ($3/Season)
- Free track: 1 reward every 5 levels (board theme, keyboard skin)
- Premium track ($3 via Gumroad): exclusive cosmetics, bonus XP, early access
- 30-day seasons with 30 levels
- Gumroad integration for purchase + delivery

### 6. Cosmetic Shop
- Board themes (Matrix green, ocean blue, sunset, monochrome)
- Crown styles (gold, diamond, fire, neon)
- Keyboard skins (different colors/layouts)
- Victory animations (confetti, lightning, fire trail)
- $1-5 per item via Gumroad

### 7. Social Features
- Friends list via shareable profile links
- Rivalry tracking (head-to-head record per friend)
- "Best of 3/5/7" duel series
- Spectator mode (watch friends duel live)
- Weekly challenges ("Win 5 duels this week")

### 8. Retention Mechanics
- Push notifications for streaks ("Don't break your 7-day streak!")
- Achievement badges (first win, 10-win streak, sub-5s solve)
- Leaderboard (friends, global, regional)
- Seasonal resets every 3 months
- Daily login reward (bonus XP)
