import { useState } from 'react'
import { Copy, X } from 'lucide-react'
import { BOOKMAKERS } from '@/constants/bookmakers'
import type { WallStage } from '@/lib/vip'

interface VipWallPopupProps {
  stage: WallStage
  onClose: () => void
  onDownloadTap: () => void
  onGoBack: () => void
  onUnlock: (email: string) => Promise<void>
}

export function VipWallPopup({ stage, onClose, onDownloadTap, onGoBack, onUnlock }: VipWallPopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {stage === 'returning' ? (
        <Screen2 onGoBack={onGoBack} onUnlock={onUnlock} onClose={onClose} />
      ) : (
        <Screen1 onDownloadTap={onDownloadTap} onClose={onClose} />
      )}
    </div>
  )
}

// ─── Screen 1 — The Invitation ────────────────────────────────────────────────

function Screen1({ onDownloadTap, onClose }: { onDownloadTap: () => void; onClose: () => void }) {
  const [codeCopied, setCodeCopied] = useState(false)

  function copyPromoCode() {
    navigator.clipboard.writeText('MYFREETIP').then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    }).catch(() => {})
  }

  function handleDownload(url: string) {
    onDownloadTap()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="relative w-full max-w-sm rounded-2xl overflow-y-auto"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 25px 80px rgba(0,0,0,0.40)',
        maxHeight: '92dvh',
      }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
        style={{ width: 32, height: 32, background: 'rgba(29,29,29,0.08)' }}
        aria-label="Close"
      >
        <X style={{ width: 16, height: 16, color: '#1D1D1D' }} />
      </button>

      <div className="px-6 pt-7 pb-7 flex flex-col gap-5">
        {/* Green label */}
        <span
          className="self-start inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
          style={{ background: '#EAF7EE', color: '#2D9A47' }}
        >
          ★ VIP ACCESS — FREE
        </span>

        {/* Headline */}
        <h2 className="text-xl font-bold leading-snug" style={{ color: '#1D1D1D', marginTop: -4 }}>
          How to become a VIP member
        </h2>

        {/* Intro */}
        <div className="flex flex-col gap-1" style={{ marginTop: -8 }}>
          <p className="text-sm leading-relaxed" style={{ color: '#4F4841' }}>
            No subscription. No monthly fee. No catch.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#4F4841' }}>
            Here is everything you need to do:
          </p>
        </div>

        {/* Steps */}
        <ol className="flex flex-col gap-3" style={{ marginTop: -4 }}>
          {[
            'Download the Paripesa app using the button below',
            'Use promo code MYFREETIP when you register',
            'Deposit any amount you are comfortable with',
            'Claim your welcome bonus from Paripesa',
            'Come back here and sign up with your email',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold"
                style={{ width: 22, height: 22, minWidth: 22, background: '#EAF7EE', color: '#2D9A47', marginTop: 1 }}
              >
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: '#1D1D1D' }}>
                {step}
              </span>
            </li>
          ))}
        </ol>

        {/* Closing line */}
        <p className="text-xs leading-relaxed" style={{ color: '#8a9bb0' }}>
          That's it. You are VIP for life. The bookie pays your bonus.
          You pay us nothing. You pay the bookie nothing extra.
        </p>

        {/* Promo code block */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ border: '2px dashed rgba(61,177,87,0.45)', background: '#F8FDF9' }}
        >
          <span
            className="text-xs font-semibold uppercase tracking-widest flex-shrink-0"
            style={{ color: '#777777' }}
          >
            Promo code
          </span>
          <span
            className="flex-1 text-sm font-bold tracking-widest"
            style={{ fontFamily: "'DM Mono', monospace", color: '#1D1D1D' }}
          >
            MYFREETIP
          </span>
          <button
            type="button"
            onClick={copyPromoCode}
            className="flex-shrink-0 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
            style={{
              background: codeCopied ? '#3DB157' : '#080A2D',
              color: '#FFFFFF',
              minHeight: 34,
            }}
          >
            <Copy style={{ width: 11, height: 11 }} />
            {codeCopied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>

        {/* Bookmaker section */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-center" style={{ color: '#8a9bb0' }}>
            Recommended Bookmaker
          </p>

          {/* Paripesa — primary, full width */}
          <button
            type="button"
            onClick={() => handleDownload(BOOKMAKERS.paripesa.affiliateUrl)}
            className="w-full rounded-xl font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80"
            style={{
              background: '#1A56DB',
              color: '#FFFFFF',
              padding: '14px 20px',
              minHeight: 52,
            }}
          >
            Download Paripesa App →
          </button>

          <p className="text-xs text-center" style={{ color: '#8a9bb0' }}>Other options</p>

          {/* 1xBet + Melbet — secondary, side by side */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleDownload(BOOKMAKERS['1xbet'].affiliateUrl)}
              className="flex-1 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80"
              style={{ background: '#1E3A6E', color: '#FFFFFF', padding: '11px 16px', minHeight: 44 }}
            >
              1xBet
            </button>
            <button
              type="button"
              onClick={() => handleDownload(BOOKMAKERS.melbet.affiliateUrl)}
              className="flex-1 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80"
              style={{ background: '#F5A623', color: '#1A1A1A', padding: '11px 16px', minHeight: 44 }}
            >
              Melbet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Screen 2 — The Return ────────────────────────────────────────────────────

function Screen2({
  onGoBack,
  onUnlock,
  onClose,
}: {
  onGoBack: () => void
  onUnlock: (email: string) => Promise<void>
  onClose: () => void
}) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onUnlock(trimmed)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className="relative w-full max-w-sm rounded-2xl"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 25px 80px rgba(0,0,0,0.40)',
      }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
        style={{ width: 32, height: 32, background: 'rgba(29,29,29,0.08)' }}
        aria-label="Close"
      >
        <X style={{ width: 16, height: 16, color: '#1D1D1D' }} />
      </button>

      <form onSubmit={handleSubmit} className="px-6 pt-7 pb-7 flex flex-col gap-5">
        {/* Green label */}
        <span
          className="self-start inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
          style={{ background: '#EAF7EE', color: '#2D9A47' }}
        >
          ★ Welcome Back
        </span>

        {/* Headline */}
        <h2 className="text-xl font-bold leading-snug" style={{ color: '#1D1D1D', marginTop: -4 }}>
          Done registering? You're almost in.
        </h2>

        {/* Body */}
        <p className="text-sm leading-relaxed" style={{ color: '#4F4841', marginTop: -8 }}>
          Enter the email you used to register and your VIP access is unlocked
          instantly — permanently. No waiting. No approval.
        </p>

        {/* Email input */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="w-full rounded-xl px-4 py-3.5 text-sm outline-none"
          style={{
            border: '1.5px solid rgba(29,29,29,0.18)',
            color: '#1D1D1D',
            background: '#FAFAFA',
            fontSize: 15,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#3DB157' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(29,29,29,0.18)' }}
        />

        {error && (
          <p className="text-xs" style={{ color: '#C0392B', marginTop: -12 }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60"
          style={{
            background: '#080A2D',
            color: '#FFFFFF',
            padding: '14px 20px',
            minHeight: 52,
          }}
        >
          {loading ? 'Unlocking…' : 'Unlock My VIP Access →'}
        </button>

        {/* Go back */}
        <button
          type="button"
          onClick={onGoBack}
          className="text-xs text-center transition-opacity hover:opacity-70"
          style={{ color: '#8a9bb0' }}
        >
          Haven't registered yet? Go back
        </button>
      </form>
    </div>
  )
}
