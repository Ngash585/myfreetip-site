import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getBookmakers } from '@/lib/api'
import { BookmakerLogoStrip } from '@/components/bookmakers/BookmakerLogoStrip'
import { BookmakerCard } from '@/components/bookmakers/BookmakerCard'

const YEAR = new Date().getFullYear()

export default function Bookmakers() {
  usePageMeta({
    title: `Bookmaker Reviews ${YEAR} — Best Betting Sites in Kenya | MyFreeTip`,
    description: `Honest, in-depth bookmaker reviews for Kenyan bettors in ${YEAR}. We compare welcome bonuses, odds, M-Pesa payments, and overall value.`,
    canonical: 'https://myfreetip.com/bookmakers',
  })

  const { data: bookmakers = [] } = useQuery({
    queryKey: ['bookmakers'],
    queryFn: getBookmakers,
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
              { '@type': 'ListItem', position: 2, name: 'Bookmakers', item: 'https://myfreetip.com/bookmakers' },
            ],
          }),
        }}
      />

      {/* Page heading */}
      <div className="mt-8 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: '#1D1D1D' }}>
          Bookmaker Reviews
        </h1>
      </div>

      {/* Logo strip */}
      {bookmakers.length > 0 && (
        <div className="mb-6">
          <BookmakerLogoStrip
            bookmakers={bookmakers}
            seeAllHref="/bookmakers"
            scrollTargetPrefix="bm-card-"
          />
        </div>
      )}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-xs" style={{ color: '#777777' }}>
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li>»</li>
          <li style={{ color: '#1D1D1D' }}>Bookmakers</li>
        </ol>
      </nav>

      {/* Intro */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2" style={{ color: '#1D1D1D' }}>
          Bookmaker Reviews {YEAR}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
          We test and review every bookmaker ourselves before publishing. Below you will find our
          honest assessments of the best betting sites available to Kenyan bettors, ranked by
          overall value. Click any review to read the full analysis.
        </p>
      </div>

      {/* Card grid */}
      <div className="flex flex-col gap-6">
        {bookmakers.map((bm) => (
          <div key={bm.slug} id={`bm-card-${bm.slug}`}>
            <BookmakerCard bookmaker={bm} revealMode={false} />
          </div>
        ))}
      </div>

    </div>
  )
}
