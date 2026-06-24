export interface Settings {
  sound: boolean
  volume: number
  contrast: 'medium' | 'high' | 'soft' | 'dark'
  animations: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  sound: true,
  volume: 0.7,
  contrast: 'medium',
  animations: true,
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem('dailyduel-settings')
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}
