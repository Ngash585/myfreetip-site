import { useRef, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getBookmakerBySlug } from '@/lib/api'

const NAV_SECTIONS = [
  { id: 'review',       label: 'Review' },
  { id: 'verdict',      label: 'Verdict' },
  { id: 'pros-cons',    label: 'Pros & Cons' },
  { id: 'bonus-details', label: 'Bonus Details' },
]

function StarBar({ value }: { value: number }) {
  const filled = Math.round(value / 2) // out of 5 stars
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-xl" style={{ color: i < filled ? '#F5A623' : '#E5E5E5' }}>★</span>
      ))}
      <span className="ml-1 font-bold text-lg text-white">{value.toFixed(1)}</span>
    </div>
  )
}

function ClaimButton({ href, color }: { href: string; color: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-bold text-white text-sm transition-opacity hover:opacity-85"
      style={{ background: color }}
    >
      Claim Bonus
    </a>
  )
}

export default function BookmakerReview() {
  const { slug = '' } = useParams<{ slug: string }>()
  const [activeSection, setActiveSection] = useState('review')
  const stickyNavRef = useRef<HTMLDivElement>(null)

  const { data: bm, isLoading } = useQuery({
    queryKey: ['bookmaker', slug],
    queryFn: () => getBookmakerBySlug(slug),
  })

  usePageMeta({
    title: bm?.meta_title ?? (bm ? `${bm.name} Review ${new Date().getFullYear()} | MyFreeTip` : 'Bookmaker Review | MyFreeTip'),
    description: bm?.meta_description ?? (bm ? `Read our ${bm.name} review for ${new Date().getFullYear()}. Honest assessment of odds, bonuses, payments and more.` : ''),
    canonical: bm ? `https://myfreetip.com/bookmakers/${bm.slug}` : undefined,
  })

  // Intersection observer to highlight active jump nav link
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [bm])

  function scrollTo(id: string) {
    const nav = stickyNavRef.current
    const navHeight = nav ? nav.getBoundingClientRect().height : 0
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8
    window.scrollTo({ top, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-12">
        <div className="h-48 rounded-2xl animate-pulse" style={{ background: '#E5E5E5' }} />
      </div>
    )
  }

  if (!bm) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-12 text-center">
        <p className="text-lg font-semibold" style={{ color: '#1D1D1D' }}>Bookmaker not found.</p>
        <Link to="/bookmakers" className="mt-4 inline-block text-sm" style={{ color: '#3DB157' }}>
          ← Back to Bookmaker Reviews
        </Link>
      </div>
    )
  }

  const brandColor = bm.brand_color ?? '#1A56DB'
  const YEAR = new Date().getFullYear()
  const claimUrl = bm.claim_url ?? '#'

  // Schema.org Review markup
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: `${bm.name} Review ${YEAR}`,
    reviewBody: bm.review_body,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: bm.our_score ?? bm.star_rating,
      bestRating: 10,
    },
    author: { '@type': 'Organization', name: 'MyFreeTip' },
    itemReviewed: {
      '@type': 'Organization',
      name: bm.name,
      url: claimUrl,
    },
  }

  // FAQ Schema — triggers rich results for "[bookmaker] review Kenya" queries
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${bm.name} available in Kenya?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ${bm.name} is fully available to Kenyan bettors and supports M-Pesa for deposits and withdrawals.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the ${bm.name} welcome bonus?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: bm.offer_headline
            ? `${bm.offer_headline}. ${bm.offer_subheadline ?? ''}`
            : `${bm.name} offers a welcome bonus for new customers. Check the current offer above.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the ${bm.name} promo code?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: bm.promo_code
            ? `The ${bm.name} promo code is ${bm.promo_code}. Enter it when registering or making your first deposit to unlock the welcome bonus.`
            : `Visit the ${bm.name} website via our link to see the latest promo code offer.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I withdraw from ${bm.name} in Kenya?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${bm.name} supports M-Pesa withdrawals in Kenya. Log in to your account, go to the cashier or withdrawal section, select M-Pesa, enter your phone number and amount, and confirm. Most withdrawals are processed quickly.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is ${bm.name} rated?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `MyFreeTip rates ${bm.name} ${(bm.our_score ?? bm.star_rating ?? 0).toFixed(1)} out of 10 based on odds quality, payment options, mobile experience, and bonus value.`,
        },
      },
    ],
  }

  return (
    <>
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myfreetip.com/' },
              { '@type': 'ListItem', position: 2, name: 'Bookmakers', item: 'https://myfreetip.com/bookmakers' },
              { '@type': 'ListItem', position: 3, name: bm.name, item: `https://myfreetip.com/bookmakers/${bm.slug}` },
            ],
          }),
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">

        {/* ── Hero ── */}
        <div
          className="rounded-2xl px-6 py-8 mt-6 mb-0"
          style={{ background: '#080A2D' }}
        >
          <div className="flex items-center gap-5 flex-wrap">
            {/* Logo */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden shrink-0"
              style={{ background: bm.logo_bg_color ?? brandColor }}
            >
              {bm.logo_url ? (
                <img src={bm.logo_url} alt={bm.name} className="w-14 h-14 object-contain" />
              ) : (
                <span className="text-white text-sm font-bold leading-tight text-center px-1">
                  {bm.name.toUpperCase().slice(0, 4)}
                </span>
              )}
            </div>

            {/* Name + rating */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {bm.name} Review {YEAR}
              </h1>
              {bm.star_rating && <StarBar value={bm.star_rating} />}
            </div>

            {/* Claim CTA */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <ClaimButton href={claimUrl} color={brandColor} />
              {bm.promo_code && (
                <p className="text-xs text-white/60 font-mono tracking-wide">
                  Code: {bm.promo_code}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Sticky jump nav ── */}
        <div
          ref={stickyNavRef}
          className="sticky top-0 z-20 bg-white flex items-center gap-0 overflow-x-auto scrollbar-hide"
          style={{ borderBottom: '1px solid rgba(29,29,29,0.1)' }}
        >
          {NAV_SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className="px-4 py-3 text-sm whitespace-nowrap relative transition-colors shrink-0"
              style={{
                color: activeSection === id ? '#1D1D1D' : '#777777',
                fontWeight: activeSection === id ? 600 : 400,
              }}
            >
              {label}
              {activeSection === id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: brandColor }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="my-5">
          <ol className="flex items-center gap-1.5 text-xs" style={{ color: '#777777' }}>
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li>»</li>
            <li><Link to="/bookmakers" className="hover:underline">Bookmakers</Link></li>
            <li>»</li>
            <li style={{ color: '#1D1D1D' }}>{bm.name}</li>
          </ol>
        </nav>

        {/* ── Review section ── */}
        <section id="review" className="mb-12 scroll-mt-16">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1D1D1D' }}>
            {bm.name} Review
          </h2>

          {bm.review_body ? (
            <div className="flex flex-col gap-4">
              {bm.review_body.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: '#333333' }}>
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: '#777777' }}>Full review coming soon.</p>
          )}

          {bm.screenshot_url && (
            <div className="mt-6 rounded-2xl overflow-hidden">
              <img
                src={bm.screenshot_url}
                alt={`${bm.name} platform screenshot`}
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </section>

        {/* ── Verdict section ── */}
        <section id="verdict" className="mb-12 scroll-mt-16">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1D1D1D' }}>
            Our Verdict
          </h2>
          <div
            className="rounded-2xl p-6"
            style={{ background: '#FFFFFF', boxShadow: 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px' }}
          >
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl font-black" style={{ color: brandColor }}>
                {(bm.our_score ?? bm.star_rating ?? 0).toFixed(1)}
              </span>
              <span className="text-lg font-semibold" style={{ color: '#777777' }}>/ 10</span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#555555' }}>
              {bm.name} is a strong choice for Kenyan bettors, offering an excellent combination
              of competitive odds, reliable M-Pesa payments, and a generous welcome bonus
              available with code <strong>{bm.promo_code ?? 'MYFREETIP'}</strong>.
            </p>
            <ClaimButton href={claimUrl} color={brandColor} />
          </div>
        </section>

        {/* ── Pros & Cons ── */}
        <section id="pros-cons" className="mb-12 scroll-mt-16">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1D1D1D' }}>
            Pros &amp; Cons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pros */}
            <div
              className="rounded-2xl p-5"
              style={{ background: '#FFFFFF', boxShadow: 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px' }}
            >
              <p className="text-sm font-bold mb-3" style={{ color: '#16A34A' }}>Pros</p>
              <ul className="flex flex-col gap-2">
                {(bm.pros ?? []).map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#1D1D1D' }}>
                    <span style={{ color: '#16A34A', marginTop: 1 }}>✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div
              className="rounded-2xl p-5"
              style={{ background: '#FFFFFF', boxShadow: 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px' }}
            >
              <p className="text-sm font-bold mb-3" style={{ color: '#C0392B' }}>Cons</p>
              <ul className="flex flex-col gap-2">
                {(bm.cons ?? []).map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#1D1D1D' }}>
                    <span style={{ color: '#C0392B', marginTop: 1 }}>✕</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Compare / internal links ── */}
        {(() => {
          const others = [
            { slug: 'paripesa', name: 'Paripesa' },
            { slug: '1xbet',    name: '1xBet' },
            { slug: 'melbet',   name: 'Melbet' },
          ].filter((b) => b.slug !== bm.slug)
          return (
            <section className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#777777' }}>
                Compare bookmakers
              </p>
              <div className="flex flex-wrap gap-2">
                {others.map((b) => (
                  <Link
                    key={b.slug}
                    to={`/bookmakers/${b.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                    style={{ background: '#F2EEE9', color: '#1D1D1D' }}
                  >
                    {b.name} Review →
                  </Link>
                ))}
                <Link
                  to="/bookmakers"
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  style={{ background: '#F2EEE9', color: '#1D1D1D' }}
                >
                  All Bookmakers →
                </Link>
              </div>
            </section>
          )
        })()}

        {/* ── Bonus Details ── */}
        <section id="bonus-details" className="scroll-mt-16">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1D1D1D' }}>
            Bonus Details
          </h2>
          <div
            className="rounded-2xl p-5"
            style={{ background: '#FFFFFF', boxShadow: 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px' }}
          >
            {bm.offer_headline && (
              <p className="font-bold text-xl mb-1" style={{ color: '#1D1D1D' }}>
                {bm.offer_headline}
              </p>
            )}
            {bm.offer_subheadline && (
              <p className="text-sm font-semibold mb-4" style={{ color: '#555555' }}>
                {bm.offer_subheadline}
              </p>
            )}

            {/* Code box */}
            {bm.promo_code && (
              <div
                className="rounded-xl px-4 py-3 mb-4"
                style={{ background: '#F8F4EF', border: '2px dashed #D4C5B0' }}
              >
                <span
                  className="font-mono font-bold tracking-[0.2em] text-lg"
                  style={{ color: '#1D1D1D', fontFamily: '"DM Mono", monospace' }}
                >
                  {bm.promo_code.split('').join(' ')}
                </span>
              </div>
            )}

            {bm.terms && (
              <p className="text-[11px] leading-relaxed mb-5" style={{ color: '#AAAAAA' }}>
                {bm.terms}
              </p>
            )}

            <ClaimButton href={claimUrl} color={brandColor} />
          </div>
        </section>

      </div>
    </>
  )
}
