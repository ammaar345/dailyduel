const WORDS: string[] = [
  // 5-letter words organized by category
  // Animals
  'EAGLE', 'TIGER', 'WHALE', 'PANDA', 'HORSE',
  'LEMON', 'TIGER', 'RIVER', 'CLOUD', 'STORM',
  // Nature
  'PLANT', 'OCEAN', 'FLAME', 'FROST', 'BLAZE',
  'STONE', 'BREEZE', 'CANYON', 'VALLEY', 'MEADOW',
  // Tech
  'PIXEL', 'QUERY', 'BITES', 'BYTES', 'LOGIC',
  'FORCE', 'VIRUS', 'STACK', 'FRAME', 'MOUSE',
  // Food
  'PIZZA', 'TACOS', 'NOODLE', 'GRAPE', 'MANGO',
  'BREAD', 'CHEESE', 'OLIVE', 'BANANA', 'CHERRY',
  // Actions
  'DANCE', 'FLYER', 'SLEEP', 'WRITE', 'READS',
  'LEARN', 'BUILD', 'SWING', 'CLIMB', 'SHOUT',
  // Colors
  'CORAL', 'IVORY', 'AMBER', 'AZURE', 'MAUVE',
  'JADE', 'ROSE', 'LILAC', 'TAN', 'TURQUOISE',
  // Abstract
  'DREAM', 'BRISK', 'SOLAR', 'LUNAR', 'PRIME',
  'NOBLE', 'VIGOR', 'GRACE', 'HAVEN', 'ZEST',
  // Objects
  'CLOCK', 'CHAIR', 'BRUSH', 'PLATE', 'BRICK',
  'FLUTE', 'RULER', 'TOWER', 'SWORD', 'CROWN',
]

// Deduplicate
const UNIQUE_WORDS = [...new Set(WORDS)]

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
  const idx = Math.floor(rng() * UNIQUE_WORDS.length)
  return UNIQUE_WORDS[idx]
}

export function getAllWords(): readonly string[] {
  return UNIQUE_WORDS
}

export function isValidWord(word: string): boolean {
  // For MVP, accept any 5-letter combination
  // In production, check against a real dictionary
  return word.length === 5
}
