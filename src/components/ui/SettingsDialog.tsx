import type { Settings } from '../../lib/settings'
import { GearIcon, CloseIcon } from './Icons'

interface SettingsDialogProps {
  settings: Settings
  onChange: (s: Settings) => void
  onClose: () => void
}

export function SettingsDialog({ settings, onChange, onClose }: SettingsDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A5568]/20 backdrop-blur-md">
      <div className="bg-white rounded-[28px] p-7 max-w-sm w-full mx-4 shadow-2xl border border-[#E8E4DF] animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <GearIcon size={22} className="text-[#90CAF9]" />
            <h2 className="text-xl font-bold text-[#4A5568]">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-[#EAF4F8] hover:bg-[#DCEEF8] rounded-full text-[#718096] cursor-pointer transition-colors"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Sound */}
        <div className="mb-5">
          <label className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#4A5568]">Sound</span>
            <button
              onClick={() => onChange({ ...settings, sound: !settings.sound })}
              className={`marsh-toggle ${settings.sound ? 'on' : 'off'}`}
              aria-label="Toggle sound"
            />
          </label>
        </div>

        {/* Volume */}
        {settings.sound && (
          <div className="mb-5">
            <label className="text-sm font-semibold text-[#4A5568] block mb-2">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={e => onChange({ ...settings, volume: parseFloat(e.target.value) })}
              className="w-full accent-[#90CAF9]"
            />
          </div>
        )}

        {/* Contrast */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-[#4A5568] block mb-2">Theme</label>
          <div className="grid grid-cols-2 gap-2">
            {(['medium', 'high', 'soft', 'dark'] as const).map(c => (
              <button
                key={c}
                onClick={() => onChange({ ...settings, contrast: c })}
                className={`py-2.5 px-3 rounded-2xl text-sm font-semibold capitalize cursor-pointer transition-all ${
                  settings.contrast === c
                    ? 'bg-[#90CAF9] text-white shadow-md'
                    : 'bg-[#EAF4F8] text-[#718096] hover:bg-[#DCEEF8] hover:text-[#4A5568]'
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
            <span className="text-sm font-semibold text-[#4A5568]">Animations</span>
            <button
              onClick={() => onChange({ ...settings, animations: !settings.animations })}
              className={`marsh-toggle ${settings.animations ? 'on' : 'off'}`}
              aria-label="Toggle animations"
            />
          </label>
        </div>

        <button
          onClick={onClose}
          className="marsh-btn marsh-btn-primary w-full py-3.5"
        >
          Done
        </button>
      </div>
    </div>
  )
}
