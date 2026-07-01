import { isInDictionary } from './dictionary'

// Curated answer pool for daily puzzles (fun, common 5-letter words)
const ANSWERS: string[] = [
  // Animals
  'EAGLE', 'TIGER', 'WHALE', 'PANDA', 'HORSE',
  'LEMON', 'RIVER', 'CLOUD', 'STORM',
  // Nature
  'PLANT', 'OCEAN', 'FLAME', 'FROST', 'BLAZE',
  'STONE', 'BREEZE', 'CANYON', 'VALLEY', 'MEADOW',
  // Tech
  'PIXEL', 'QUERY', 'BITES', 'BYTES', 'LOGIC',
  'FORCE', 'VIRUS', 'STACK', 'FRAME', 'MOUSE',
  // Food
  'PIZZA', 'TACOS', 'NOODLE', 'GRAPE', 'MANGO',
  'BREAD', 'CHEESE', 'OLIVE', 'CHERRY',
  // Actions
  'DANCE', 'FLYER', 'SLEEP', 'WRITE', 'READS',
  'LEARN', 'BUILD', 'SWING', 'CLIMB', 'SHOUT',
  // Colors
  'CORAL', 'IVORY', 'AMBER', 'AZURE', 'MAUVE',
  'JADE', 'ROSE', 'LILAC',
  // Abstract
  'DREAM', 'BRISK', 'SOLAR', 'LUNAR', 'PRIME',
  'NOBLE', 'VIGOR', 'GRACE', 'HAVEN', 'ZEST',
  // Objects
  'CLOCK', 'CHAIR', 'BRUSH', 'PLATE', 'BRICK',
  'FLUTE', 'RULER', 'TOWER', 'SWORD', 'CROWN',
]

// Hash-based seeded random
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

export function getWordForDate(date: Date): string {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  const rng = seededRandom(seed)
  const idx = Math.floor(rng() * ANSWERS.length)
  return ANSWERS[idx]
}

export function getAllAnswers(): readonly string[] {
  return ANSWERS
}

export function isValidWord(word: string): boolean {
  return word.length === 5 && isInDictionary(word)
}
