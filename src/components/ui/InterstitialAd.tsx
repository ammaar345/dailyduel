import { useEffect, useState, useRef } from 'react'
import { CloseIcon } from './Icons'

const CARBON_PLACEMENT_ID = 'YOUR_PLACEMENT_ID'

interface InterstitialAdProps {
  onClose: () => void
}

export function InterstitialAd({ onClose }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(5)
  const containerRef = useRef<HTMLDivElement>(null)
  const closedRef = useRef(false)

  useEffect(() => {
    if (CARBON_PLACEMENT_ID === 'YOUR_PLACEMENT_ID') {
      onClose()
      return
    }
  }, [onClose])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // Load Carbon Ads script
  useEffect(() => {
    if (!containerRef.current || CARBON_PLACEMENT_ID === 'YOUR_PLACEMENT_ID') return

    const script = document.createElement('script')
    script.async = true
    script.type = 'text/javascript'
    script.src = `https://cdn.carbonads.com/cron.js?serve=${CARBON_PLACEMENT_ID}&format=cover`
    script.id = '_carbonads_interstitial'
    containerRef.current.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const handleClose = () => {
    if (closedRef.current) return
    closedRef.current = true
    onClose()
  }

  // Skip if no placement ID
  if (CARBON_PLACEMENT_ID === 'YOUR_PLACEMENT_ID') return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="marsh-card p-6 max-w-sm w-full mx-4 text-center animate-slide-up">
        {/* Close button */}
        <div className="flex justify-end mb-2">
          {countdown <= 0 ? (
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#A0AEC0] hover:text-[#4A5568] hover:bg-[#F0F7FA] transition-all cursor-pointer"
            >
              <CloseIcon size={18} />
            </button>
          ) : (
            <span className="text-xs text-[#A0AEC0] font-medium">
              {countdown}s
            </span>
          )}
        </div>

        {/* Ad container */}
        <div ref={containerRef} className="min-h-[200px] flex items-center justify-center">
          <span className="text-xs text-[#A0AEC0]">Advertisement</span>
        </div>
      </div>
    </div>
  )
}
