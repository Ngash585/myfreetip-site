import type { TipCard } from '@/lib/api'

type Props = {
  card: TipCard
}

const WON_BG = 'rgba(0,200,83,0.08)'
const LOST_BG = 'rgba(244,67,54,0.08)'
const WON_BORDER = 'rgba(0,200,83,0.35)'
const LOST_BORDER = 'rgba(244,67,54,0.35)'

export function ResultCard({ card }: Props) {
  const isWin = card.result === 'win'

  const dateLabel = card.expiresAt
    ? new Date(card.expiresAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : card.date ?? '—'

  return (
    <article
      className="rounded-xl overflow-hidden"
      style={{
        background: isWin ? WON_BG : LOST_BG,
        border: `1px solid ${isWin ? WON_BORDER : LOST_BORDER}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between gap-3 px-4 py-3"
        style={{ borderBottom: `1px solid ${isWin ? WON_BORDER : LOST_BORDER}` }}
      >
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#8a9bb0' }}>
            {card.type === 'accumulator' ? 'Accumulator' : 'Single'} · {dateLabel}
          </p>
          <h3 className="text-white font-semibold text-sm mt-0.5 truncate">{card.title}</h3>
          {card.total_odds_label && (
            <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
              Odds: {card.total_odds_label}
            </p>
          )}
        </div>

        {/* Result badge */}
        <ResultBadge result={card.result} />
      </div>

      {/* Legs */}
      <ul className="divide-y" style={{ borderColor: isWin ? WON_BORDER : LOST_BORDER }}>
        {card.legs.map((leg, i) => (
          <li key={i} className="px-4 py-2.5">
            <p className="text-white text-xs font-medium">
              {leg.match_label ?? `${leg.homeTeam} vs ${leg.awayTeam}`}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {leg.league && (
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#1a2634', color: '#8a9bb0' }}>
                  {leg.league}
                </span>
              )}
              <span className="text-xs font-medium" style={{ color: isWin ? '#00c853' : '#f44336' }}>
                {leg.pick_title ?? leg.prediction}
              </span>
              {leg.odds && (
                <span className="text-xs" style={{ color: '#8a9bb0' }}>
                  @ {leg.odds}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}

function ResultBadge({ result }: { result: string }) {
  if (result === 'win') {
    return (
      <span
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold"
        style={{ background: 'rgba(0,200,83,0.15)', color: '#00c853', border: '1px solid rgba(0,200,83,0.4)' }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M2 7.5l3.5 3.5L12 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        WON
      </span>
    )
  }
  return (
    <span
      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold"
      style={{ background: 'rgba(244,67,54,0.15)', color: '#f44336', border: '1px solid rgba(244,67,54,0.4)' }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      LOST
    </span>
  )
}

export function ResultCardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden animate-pulse"
      style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}
    >
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #2a3a4a' }}>
        <div className="h-3 w-24 rounded mb-2" style={{ background: '#2a3a4a' }} />
        <div className="h-4 w-40 rounded" style={{ background: '#2a3a4a' }} />
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="px-4 py-2.5" style={{ borderBottom: '1px solid #2a3a4a' }}>
          <div className="h-3 w-36 rounded mb-1.5" style={{ background: '#2a3a4a' }} />
          <div className="h-3 w-20 rounded" style={{ background: '#2a3a4a' }} />
        </div>
      ))}
    </div>
  )
}
