import { useEffect, memo } from 'react'

export const AdBanner = memo(() => {
  useEffect(() => {
    // Carbon Ads integration
    // To get your placement ID:
    // 1. Sign up at https://carbonads.net/
    // 2. Create a new ad unit
    // 3. Replace "YOUR_PLACEMENT_ID" below
    // 4. Replace "dailyduel.app" with your actual domain

    const script = document.createElement('script')
    script.async = true
    script.type = 'text/javascript'
    script.src = `https://cdn.carbonads.com/carbon.js?serve=YOUR_PLACEMENT_ID&format=cover`
    script.id = '_carbonads_js'

    const adContainer = document.getElementById('carbonads')
    if (adContainer) {
      adContainer.appendChild(script)
    }

    return () => {
      if (adContainer && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="mb-6">
      <div id="carbonads" className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        {/* Carbon ad will be inserted here by the script */}
        <div className="text-center text-xs text-gray-500 mb-2">
          <span className="font-semibold">Advertisement</span>
        </div>
      </div>
    </div>
  )
})