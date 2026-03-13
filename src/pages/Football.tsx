import { useQuery } from '@tanstack/react-query'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getSportTipCards } from '@/lib/api'
import { PredictionCard, PredictionCardSkeleton } from '@/components/PredictionCard'

// Bet type pill — maps prediction text to a display colour
function BetTypePill({ prediction }: { prediction: string }) {
  const lower = prediction.toLowerCase()

  let bg = '#E5E5E5'
  let color = '#555555'

  if (lower.includes('draw')) { bg = '#FEF3C7'; color = '#92400E' }
  else if (lower.includes('both teams') || lower.includes('btts')) { bg = '#DCFCE7'; color = '#15803D' }
  else if (lower.includes('away') || lower.includes('home')) { bg = '#DBEAFE'; color = '#1D4ED8' }
  else if (lower.includes('over')) { bg = '#EDE9FE'; color = '#6D28D9' }
  else if (lower.includes('under')) { bg = '#FEE2E2'; color = '#B91C1C' }
  else if (lower.includes('win')) { bg = '#DCFCE7'; color = '#15803D' }

  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold leading-none"
      style={{ background: bg, color }}
    >
      {prediction}
    </span>
  )
}

export default function Football() {
  usePageMeta({
    title: 'Football Predictions Today — Free Tips | MyFreeTip',
    description: 'Free daily football predictions and match analysis. Confidence-based tips with transparent results. No noise, just football analysis.',
    canonical: 'https://myfreetip.com/football',
  })

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['sport-tips', 'football'],
    queryFn: () => getSportTipCards('football'),
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">

      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myfreetip.com/' },
              { '@type': 'ListItem', position: 2, name: 'Football', item: 'https://myfreetip.com/football' },
            ],
          }),
        }}
      />

      {/* Page header */}
      <div className="pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" role="img" aria-label="Football">⚽</span>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: '#1D1D1D' }}>
            Football Predictions
          </h1>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
          Free daily football tips with confidence ratings and transparent results.
          All predictions include bet type labels so you can scan for your preferred markets at a glance.
        </p>
      </div>

      {/* Bet type legend */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { label: 'Draw',             bg: '#FEF3C7', color: '#92400E' },
          { label: 'Both Teams Score', bg: '#DCFCE7', color: '#15803D' },
          { label: 'Away / Home Win',  bg: '#DBEAFE', color: '#1D4ED8' },
          { label: 'Over x.x Goals',   bg: '#EDE9FE', color: '#6D28D9' },
        ].map((pill) => (
          <span
            key={pill.label}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{ background: pill.bg, color: pill.color }}
          >
            {pill.label}
          </span>
        ))}
      </div>

      {/* Tip cards */}
      {isLoading && (
        <div className="flex flex-col gap-6">
          <PredictionCardSkeleton />
          <PredictionCardSkeleton />
        </div>
      )}

      {!isLoading && cards.length === 0 && (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: '#FFFFFF', boxShadow: 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px' }}
        >
          <p className="font-semibold mb-1" style={{ color: '#1D1D1D' }}>No football tips today.</p>
          <p className="text-sm" style={{ color: '#777777' }}>
            Check back later — new tips are posted daily.
          </p>
        </div>
      )}

      {!isLoading && cards.length > 0 && (
        <div className="flex flex-col gap-6">
          {cards.map((card) => (
            <div key={card.id}>
              {/* Bet type pills for each leg */}
              {card.legs.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 px-1">
                  {card.legs.map((leg, i) => (
                    <BetTypePill key={i} prediction={leg.pick_title ?? leg.prediction} />
                  ))}
                </div>
              )}
              <PredictionCard card={card} />
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
