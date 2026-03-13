import type { BookmakerEntry } from '@/lib/api'

type Props = {
  bookmaker: BookmakerEntry
}

export function BookmakerInlineBanner({ bookmaker: bm }: Props) {
  return (
    <div
      className="rounded-2xl flex items-center gap-4 px-5 py-4"
      style={{
        background: '#FFFFFF',
        boxShadow: 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px',
      }}
    >
      {/* Logo */}
      <div
        className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
        style={{ background: bm.logo_bg_color ?? bm.brand_color ?? '#1D1D1D' }}
      >
        {bm.logo_url ? (
          <img src={bm.logo_url} alt={bm.name} className="w-10 h-10 object-contain" />
        ) : (
          <span className="text-white text-xs font-bold text-center leading-tight">
            {bm.name.toUpperCase().slice(0, 4)}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        {bm.offer_headline && (
          <p className="font-bold text-sm leading-snug truncate" style={{ color: '#1D1D1D' }}>
            {bm.offer_headline}
          </p>
        )}
        {bm.offer_subheadline && (
          <p className="text-xs mt-0.5 truncate" style={{ color: '#555555' }}>
            {bm.offer_subheadline}
          </p>
        )}
      </div>

      {/* CTA */}
      {bm.claim_url && (
        <a
          href={bm.claim_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="shrink-0 px-4 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-85"
          style={{ background: bm.brand_color ?? '#1A56DB' }}
        >
          Claim
        </a>
      )}
    </div>
  )
}
