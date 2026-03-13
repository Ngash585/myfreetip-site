import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getBookmakers } from '@/lib/api'
import { BookmakerLogoStrip } from '@/components/bookmakers/BookmakerLogoStrip'
import { BookmakerCard } from '@/components/bookmakers/BookmakerCard'

const YEAR = new Date().getFullYear()

export default function SignUpBonuses() {
  usePageMeta({
    title: `Sign Up Bonuses ${YEAR} — Best Welcome Offers in Kenya | MyFreeTip`,
    description: `The best sign-up bonuses and welcome offers from Kenyan betting sites in ${YEAR}. Reveal your exclusive code and claim your bonus.`,
    canonical: 'https://myfreetip.com/sign-up-bonuses',
  })

  const { data: all = [] } = useQuery({
    queryKey: ['bookmakers'],
    queryFn: getBookmakers,
  })

  const bookmakers = all.filter((b) => b.show_sign_up_bonuses)

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
              { '@type': 'ListItem', position: 2, name: 'Sign Up Bonuses', item: 'https://myfreetip.com/sign-up-bonuses' },
            ],
          }),
        }}
      />

      {/* Page heading */}
      <div className="mt-8 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: '#1D1D1D' }}>
          Sign Up Bonuses
        </h1>
      </div>

      {/* Logo strip */}
      {bookmakers.length > 0 && (
        <div className="mb-6">
          <BookmakerLogoStrip
            bookmakers={bookmakers}
            seeAllHref="/bookmakers"
            scrollTargetPrefix="sub-card-"
          />
        </div>
      )}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-xs" style={{ color: '#777777' }}>
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li>»</li>
          <li style={{ color: '#1D1D1D' }}>Sign Up Bonuses</li>
        </ol>
      </nav>

      {/* Intro */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2" style={{ color: '#1D1D1D' }}>
          Sign Up Bonuses {YEAR}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
          Claim your welcome bonus from Kenya's top betting sites. Tap "Reveal Code" on any offer
          to unlock your exclusive promo code, then use it when signing up or making your first deposit.
        </p>
      </div>

      {/* Cards — reveal mode: code hidden behind button */}
      <div className="flex flex-col gap-6">
        {bookmakers.map((bm) => (
          <div key={bm.slug} id={`sub-card-${bm.slug}`}>
            <BookmakerCard bookmaker={bm} revealMode />
          </div>
        ))}
      </div>

    </div>
  )
}
