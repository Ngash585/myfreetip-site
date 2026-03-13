import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getBookmakers } from '@/lib/api'
import { BookmakerLogoStrip } from '@/components/bookmakers/BookmakerLogoStrip'
import { BookmakerCard } from '@/components/bookmakers/BookmakerCard'

const YEAR = new Date().getFullYear()

export default function PromoCodes() {
  usePageMeta({
    title: `Betting Site Promo Codes ${YEAR} — Kenya | MyFreeTip`,
    description: `Exclusive promo codes for the best betting sites in Kenya in ${YEAR}. Copy your code and claim your welcome bonus today.`,
    canonical: 'https://myfreetip.com/promo-codes',
  })

  const { data: all = [] } = useQuery({
    queryKey: ['bookmakers'],
    queryFn: getBookmakers,
  })

  const bookmakers = all.filter((b) => b.show_promo_codes)

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
              { '@type': 'ListItem', position: 2, name: 'Promo Codes', item: 'https://myfreetip.com/promo-codes' },
            ],
          }),
        }}
      />

      {/* Page heading */}
      <div className="mt-8 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: '#1D1D1D' }}>
          Betting Site Promo Codes
        </h1>
      </div>

      {/* Logo strip */}
      {bookmakers.length > 0 && (
        <div className="mb-6">
          <BookmakerLogoStrip
            bookmakers={bookmakers}
            seeAllHref="/bookmakers"
            scrollTargetPrefix="pc-card-"
          />
        </div>
      )}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-xs" style={{ color: '#777777' }}>
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li>»</li>
          <li style={{ color: '#1D1D1D' }}>Promo Codes</li>
        </ol>
      </nav>

      {/* Intro */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2" style={{ color: '#1D1D1D' }}>
          Betting Site Promo Codes {YEAR}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
          Below are the latest verified promo codes for the top betting sites available in Kenya.
          Each code has been personally tested by our team. Copy the code and enter it during
          sign-up or deposit to unlock your welcome bonus.
        </p>
      </div>

      {/* Cards — code always visible, no reveal */}
      <div className="flex flex-col gap-6">
        {bookmakers.map((bm) => (
          <div key={bm.slug} id={`pc-card-${bm.slug}`}>
            <BookmakerCard bookmaker={bm} revealMode={false} />
          </div>
        ))}
      </div>

    </div>
  )
}
