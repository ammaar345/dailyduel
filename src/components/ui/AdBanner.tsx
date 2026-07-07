import { useEffect, useRef, memo } from 'react'

/**
 * Google AdSense banner — chosen over Carbon Ads (Carbon requires 10k monthly views).
 * AdSense has no traffic minimum, just a site review.
 *
 * Setup:
 * 1. Sign up at https://adsense.google.com — add site ddailyduel.pages.dev
 *    (site must be live and needs a privacy policy page for approval)
 * 2. After approval: AdSense > Ads > By ad unit > Display ads > create unit
 * 3. Replace ADSENSE_CLIENT with your ca-pub-XXXXXXXXXXXXXXXX
 * 4. Replace ADSENSE_SLOT with the ad unit's slot number
 *
 * Renders nothing until both IDs are configured.
 */
const ADSENSE_CLIENT = 'ca-pub-4302153561917574'
const ADSENSE_SLOT = 'XXXXXXXXXX' // TODO: create ad unit after approval, paste slot number here

const configured = !ADSENSE_CLIENT.includes('X') && !ADSENSE_SLOT.includes('X')

interface AdBannerProps {
  className?: string
}

export const AdBanner = memo(({ className = '' }: AdBannerProps) => {
  const insRef = useRef<HTMLModElement>(null)
  const pushedRef = useRef(false)

  useEffect(() => {
    // adsbygoogle.js is loaded once in index.html <head>; here we just request a fill
    if (!configured || !insRef.current || pushedRef.current) return
    pushedRef.current = true
    try {
      // @ts-expect-error — adsbygoogle is injected by the AdSense script
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // Ad blocked or script failed — banner stays empty, game unaffected
    }
  }, [])

  if (!configured) return null

  return (
    <div className={`w-full max-w-lg mb-4 ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
})
