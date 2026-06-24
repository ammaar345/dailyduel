let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol: number = 0.3) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Audio not supported
  }
}

// ASMR gentle keyboard sound — softer, more natural typing feel
export function playKeyClick() {
  // Two-note tap for natural keyboard feel (1 keypress = 2 sounds)
  playTone(1500, 0.02, 'sine', 0.1)  // High soft tap
  setTimeout(() => playTone(1200, 0.02, 'sine', 0.1), 15)  // Lower muffled tap
}

export function playBackspace() {
  playTone(300, 0.08, 'square', 0.15)
}

export function playEnter() {
  playTone(500, 0.1, 'triangle', 0.2)
}

export function playCorrect() {
  playTone(523, 0.15, 'sine', 0.25)
  setTimeout(() => playTone(659, 0.15, 'sine', 0.25), 100)
}

export function playPresent() {
  playTone(440, 0.15, 'sine', 0.2)
}

export function playAbsent() {
  playTone(200, 0.15, 'square', 0.1)
}

export function playWin() {
  const notes = [523, 587, 659, 784, 1047]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.3), i * 80)
  })
}

export function playLose() {
  playTone(400, 0.3, 'sawtooth', 0.2)
  setTimeout(() => playTone(300, 0.4, 'sawtooth', 0.2), 200)
}

export function playClick() {
  playTone(600, 0.03, 'sine', 0.1)
}
