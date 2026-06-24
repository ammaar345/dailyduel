import { useEffect, useRef, memo } from 'react'

// Replace YOUR_PLACEMENT_ID with your actual Carbon Ads placement ID
// Sign up at https://carbonads.net/ -> New Ad Unit -> copy Placement ID
const CARBON_PLACEMENT_ID = 'YOUR_PLACEMENT_ID'

interface AdBannerProps {
  className?: string
}

export const AdBanner = memo(({ className = '' }: AdBannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || CARBON_PLACEMENT_ID === 'YOUR_PLACEMENT_ID') return

    const script = document.createElement('script')
    script.async = true
    script.type = 'text/javascript'
    script.src = `https://cdn.carbonads.com/cron.js?serve=${CARBON_PLACEMENT_ID}&format=cover`
    script.id = '_carbonads_js'
    containerRef.current.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // Don't render anything if no placement ID configured
  if (CARBON_PLACEMENT_ID === 'YOUR_PLACEMENT_ID') return null

  return (
    <div className={`mb-4 ${className}`}>
      <div ref={containerRef} id="carbonads" />
    </div>
  )
})