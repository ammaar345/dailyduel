import type { Settings } from '../../lib/settings'

interface SettingsDialogProps {
  settings: Settings
  onChange: (s: Settings) => void
  onClose: () => void
}

export function SettingsDialog({ settings, onChange, onClose }: SettingsDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border-2 border-zinc-700 rounded-3xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Sound */}
        <div className="mb-4">
          <label className="flex items-center justify-between">
            <span className="text-sm font-bold">Sound</span>
            <button
              onClick={() => onChange({ ...settings, sound: !settings.sound })}
              className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.sound ? 'bg-purple-600' : 'bg-zinc-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${
                settings.sound ? 'translate-x-6' : ''
              }`} />
            </button>
          </label>
        </div>

        {/* Volume */}
        {settings.sound && (
          <div className="mb-4">
            <label className="text-sm font-bold block mb-2">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={e => onChange({ ...settings, volume: parseFloat(e.target.value) })}
              className="w-full accent-purple-600"
            />
          </div>
        )}

        {/* Contrast */}
        <div className="mb-4">
          <label className="text-sm font-bold block mb-2">Theme</label>
          <div className="grid grid-cols-2 gap-2">
            {(['medium', 'high', 'soft', 'dark'] as const).map(c => (
              <button
                key={c}
                onClick={() => onChange({ ...settings, contrast: c })}
                className={`py-2 px-3 rounded-lg text-sm font-bold capitalize cursor-pointer ${
                  settings.contrast === c
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Animations */}
        <div className="mb-6">
          <label className="flex items-center justify-between">
            <span className="text-sm font-bold">Animations</span>
            <button
              onClick={() => onChange({ ...settings, animations: !settings.animations })}
              className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.animations ? 'bg-purple-600' : 'bg-zinc-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${
                settings.animations ? 'translate-x-6' : ''
              }`} />
            </button>
          </label>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  )
}
