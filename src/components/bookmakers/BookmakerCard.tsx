import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { BookmakerEntry } from '@/lib/api'

type Props = {
  bookmaker: BookmakerEntry
  /** true = code hidden behind "Reveal Code" button (Sign Up Bonuses page) */
  revealMode?: boolean
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export function BookmakerCard({ bookmaker: bm, revealMode = false }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const brandColor = bm.brand_color ?? '#1A56DB'
  const score = bm.our_score ?? bm.star_rating
  const codeLabel = 'Promo Code:'

  function handleCopy() {
    if (!bm.promo_code) return
    navigator.clipboard.writeText(bm.promo_code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="relative">
      {/* ── White card ── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: '#FFFFFF', boxShadow: 'rgba(29, 29, 29, 0.1) 0px 4px 24px 0px' }}
      >
        {/* "Trending Now" badge — shown when featured */}
        {bm.featured && (
          <div
            className="absolute top-0 left-0 z-10 px-3 py-1.5 text-xs font-bold text-white rounded-br-xl"
            style={{ background: '#1A56DB' }}
          >
            Trending Now
          </div>
        )}

        {/* Rank badge — top right */}
        <div
          className="absolute top-2.5 right-3 z-10 text-sm font-bold"
          style={{ color: '#BBBBBB' }}
        >
          {bm.rank}
        </div>

        {/* ── Header row: chevron logo + offer text ── */}
        <div className="flex items-stretch">
          {/* Brand-coloured logo — fixed width so it doesn't balloon on wide screens */}
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              background: bm.logo_bg_color ?? brandColor,
              width: 160,
              minHeight: 100,
              clipPath: 'polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)',
              zIndex: 1,
            }}
          >
            {bm.logo_url ? (
              <img
                src={bm.logo_url}
                alt={bm.name}
                className="object-contain"
                style={{ width: 80, height: 60 }}
              />
            ) : (
              <span className="text-white font-black text-base leading-tight text-center px-4">
                {bm.name}
              </span>
            )}
          </div>

          {/* Offer text */}
          <div className="flex-1 flex flex-col justify-center pl-4 pr-8 py-3 gap-0.5">
            <Link
              to={`/bookmakers/${bm.slug}`}
              className="text-sm font-bold hover:underline leading-snug"
              style={{ color: brandColor }}
            >
              {bm.name}
            </Link>
            {bm.offer_headline && (
              <p className="font-black text-base leading-tight" style={{ color: '#1D1D1D' }}>
                {bm.offer_headline}
              </p>
            )}
            {bm.offer_subheadline && (
              <p className="text-xs leading-snug mt-0.5" style={{ color: '#444444' }}>
                {bm.offer_subheadline}
              </p>
            )}
            <Link
              to={`/bookmakers/${bm.slug}`}
              className="text-xs mt-1 hover:underline"
              style={{ color: brandColor }}
            >
              {bm.name} bonus
            </Link>
          </div>
        </div>

        {/* ── Middle row: score | code | claim ── */}
        {/* Fixed-width score + claim columns; code column takes remaining space */}
        <div
          className="flex items-stretch"
          style={{ borderTop: '1px solid rgba(29,29,29,0.1)', borderBottom: '1px solid rgba(29,29,29,0.1)' }}
        >
          {/* Our Score — fixed width */}
          <div
            className="flex flex-col justify-center px-3 py-3 shrink-0"
            style={{ width: 96, borderRight: '1px solid rgba(29,29,29,0.1)' }}
          >
            <p className="text-[10px] font-medium leading-none mb-1" style={{ color: '#777777' }}>
              Our Score
            </p>
            <p className="font-black text-3xl leading-none" style={{ color: '#1D1D1D' }}>
              {score ? score.toFixed(1) : '—'}
            </p>
            <Link
              to={`/bookmakers/${bm.slug}`}
              className="text-[11px] mt-1.5 hover:underline"
              style={{ color: brandColor }}
            >
              Read Review
            </Link>
          </div>

          {/* Promo code — flex-1, takes remaining space */}
          <div
            className="flex-1 flex flex-col justify-center px-3 py-3 min-w-0"
            style={{ borderRight: '1px solid rgba(29,29,29,0.1)' }}
          >
            {revealMode && !revealed ? (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="w-full py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-85"
                style={{ background: '#080A2D' }}
              >
                Reveal Code
              </button>
            ) : (
              <>
                <p className="text-[10px] font-medium mb-1" style={{ color: '#777777' }}>
                  {codeLabel}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-left w-full"
                  style={{
                    border: '1.5px solid rgba(29,29,29,0.2)',
                    background: copied ? '#F0FDF4' : '#FFFFFF',
                  }}
                  title="Copy code"
                >
                  <span
                    className="font-mono font-bold text-sm leading-none tracking-wide flex-1 truncate"
                    style={{ color: '#1D1D1D', fontFamily: '"DM Mono", monospace' }}
                  >
                    {copied ? 'Copied!' : bm.promo_code}
                  </span>
                  <span className="shrink-0" style={{ color: '#777777' }}>
                    <CopyIcon />
                  </span>
                </button>
                <Link
                  to={`/bookmakers/${bm.slug}`}
                  className="text-[11px] mt-1.5 hover:underline leading-tight"
                  style={{ color: brandColor }}
                >
                  {bm.name} Promo Code
                </Link>
              </>
            )}
          </div>

          {/* Claim — fixed width so button stays pill-sized at any card width */}
          <div
            className="flex flex-col items-center justify-center px-3 py-3 gap-2 shrink-0"
            style={{ width: 140 }}
          >
            {bm.claim_url ? (
              <>
                <a
                  href={bm.claim_url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="w-full text-center px-4 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-85"
                  style={{ background: brandColor }}
                >
                  Claim →
                </a>
                <a
                  href={bm.claim_url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="text-[11px] hover:underline text-center"
                  style={{ color: brandColor }}
                >
                  Visit {bm.name}
                </a>
              </>
            ) : (
              <span className="text-xs" style={{ color: '#BBBBBB' }}>No link</span>
            )}
          </div>
        </div>
      </div>

      {/* ── T&Cs below the card (outside the white box) ── */}
      {bm.terms && (
        <p className="text-[11px] leading-relaxed mt-2 px-1" style={{ color: '#666666' }}>
          <strong>{bm.name}:</strong> {bm.terms}
        </p>
      )}
    </div>
  )
}
