import { useEffect, useRef, useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import { BOOKMAKERS } from '@/constants/bookmakers'
import { fbEvent } from '@/lib/fbpixel'

// ─── Config ───────────────────────────────────────────────────────────────────
// Flip GIVEAWAY_ENABLED to false when the giveaway ends — no redeploy needed
// if you set this via an env var: import.meta.env.VITE_GIVEAWAY_ENABLED !== 'false'
const GIVEAWAY_ENABLED   = true
const TRIGGER_DELAY_MS   = 80_000        // 80 seconds
const TRIGGER_SCROLL_PCT = 70            // 70% page scroll
const COOLDOWN_MS        = 12 * 60 * 60 * 1000  // 12 hours
const STORAGE_KEY        = 'giveaway_last_shown'
const AFFILIATE_URL      = BOOKMAKERS.paripesa.affiliateUrl
// ─────────────────────────────────────────────────────────────────────────────

function shouldSuppress(): boolean {
  // Already shown within cooldown window
  const last = localStorage.getItem(STORAGE_KEY)
  if (last && Date.now() - Number(last) < COOLDOWN_MS) return true
  // Visitor arrived from Paripesa — already registered
  if (document.referrer.includes('paripesa')) return true
  return false
}

export default function GiveawayPopup() {
  const [visible, setVisible]   = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const triggered = useRef(false)

  function show() {
    if (triggered.current || shouldSuppress()) return
    triggered.current = true
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
    setVisible(true)
    fbEvent('ViewContent', { content_name: 'Paripesa Giveaway Popup' })
  }

  useEffect(() => {
    if (!GIVEAWAY_ENABLED) return

    // Trigger 1 — time on site
    const timer = setTimeout(show, TRIGGER_DELAY_MS)

    // Trigger 2 — scroll depth
    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight
      const total    = document.documentElement.scrollHeight
      if (scrolled / total >= TRIGGER_SCROLL_PCT / 100) show()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function close() {
    setVisible(false)
  }

  function handleCTA() {
    fbEvent('Lead', { content_name: 'Paripesa Giveaway CTA Click' })
    window.open(AFFILIATE_URL, '_blank', 'noopener,noreferrer')
  }

  function copyCode() {
    navigator.clipboard.writeText('MYFREETIP').then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    }).catch(() => {})
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.78)' }}
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: 480,
          borderRadius: 20,
          background: '#080A2D',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.15)' }}
        >
          <X size={16} color="#fff" />
        </button>

        {/* Banner image */}
        <img
          src="/images/paripesa-giveaway-banner.jpg"
          alt="Paripesa Giveaway — Win KES 2,500"
          className="w-full block"
          style={{ aspectRatio: '1/1', objectFit: 'cover' }}
        />

        {/* Content */}
        <div className="px-5 pt-5 pb-6">

          {/* Headline */}
          <h2
            className="text-center font-bold mb-1"
            style={{ color: '#FFFFFF', fontSize: '1.25rem', letterSpacing: '-0.01em' }}
          >
            🎁 Paripesa Giveaway — Win KES 2,500
          </h2>
          <p className="text-center text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            10 winners sharing KES 25,000
          </p>

          {/* Steps */}
          <div
            className="rounded-xl p-4 mb-4 space-y-2"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            {[
              'Register on Paripesa with promo code MYFREETIP',
              'Deposit at least KES 600',
              'Complete all fields in your Paripesa profile',
              'Leave your Paripesa Account ID in our Twitter or Facebook post replies',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span style={{ color: '#3DB157', flexShrink: 0, marginTop: 1 }}>✅</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>{step}</span>
              </div>
            ))}
          </div>

          {/* Promo code */}
          <button
            onClick={copyCode}
            className="w-full flex items-center justify-between rounded-xl px-4 mb-4 transition-opacity hover:opacity-80"
            style={{
              height: 48,
              background: 'rgba(26,86,219,0.18)',
              border: '1.5px dashed #1A56DB',
            }}
          >
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Promo code
            </span>
            <span className="font-bold tracking-widest" style={{ color: '#FFFFFF', fontSize: '1rem' }}>
              MYFREETIP
            </span>
            {codeCopied
              ? <Check size={16} color="#3DB157" />
              : <Copy size={16} color="rgba(255,255,255,0.5)" />
            }
          </button>

          {/* Primary CTA */}
          <button
            onClick={handleCTA}
            className="w-full font-bold rounded-xl transition-opacity hover:opacity-90 active:opacity-80 mb-3"
            style={{
              height: 52,
              background: '#1A56DB',
              color: '#FFFFFF',
              fontSize: '1rem',
            }}
          >
            Register on Paripesa Now →
          </button>

          {/* Secondary — dismiss */}
          <button
            onClick={close}
            className="w-full text-sm transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.45)', height: 36 }}
          >
            Already registered? Close and continue
          </button>

          {/* Disclaimer */}
          <p className="text-center mt-3" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
            Giveaway closes 21st March. Winners verified by Paripesa. 18+ only.
          </p>
        </div>
      </div>
    </div>
  )
}
