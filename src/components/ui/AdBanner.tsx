import { useEffect, useRef, memo } from 'react'

/**
 * Google AdSense banner (manual placement — chosen over Auto Ads, which spammed
 * a banner between every card on this single-screen app).
 *
 * Live: client ca-pub-4302153561917574, unit "dailyduel-banner" slot 1301972363.
 * The adsbygoogle.js loader lives in index.html <head>; this just requests a fill.
 * Ads only serve on the approved live domain — on localhost the slot stays blank.
 * Renders nothing until both IDs are non-placeholder.
 */
const ADSENSE_CLIENT = 'ca-pub-4302153561917574'
const ADSENSE_SLOT = '1301972363' // dailyduel-banner display unit

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
