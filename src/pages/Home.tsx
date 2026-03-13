import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getTipCards, getBookmakers } from "@/lib/api";
import { PredictionCard, PredictionCardSkeleton } from "@/components/PredictionCard";
import { AnalystWinRateSection } from "@/components/AnalystWinRate";
import { FreePicksSection } from "@/components/FreePicksSection";
import { LatestNewsSnippet } from "@/components/LatestNewsSnippet";
import { HeroSection } from "@/components/HeroSection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { BookmakerLogoStrip } from "@/components/bookmakers/BookmakerLogoStrip";

export default function Home() {
  usePageMeta({
    title: "MyFreeTip \u2014 Free Daily Football Predictions and Match Analysis",
    description:
      "Free daily football match analysis, confidence-based predictions, and transparent results. Full record published including missed calls. No noise, just analysis.",
    canonical: "https://myfreetip.com/",
  });

  const { data: cards = [], isLoading: bestBetLoading } = useQuery({
    queryKey: ['tip-cards'],
    queryFn: getTipCards,
  });
  const bestBet = cards[0] ?? null;
  const matchOfTheDay = cards.find((c) => c.badge_label === "Match of the Day") ?? null;

  const { data: allBookmakers = [] } = useQuery({
    queryKey: ['bookmakers'],
    queryFn: getBookmakers,
  });
  const homepageBookmakers = allBookmakers.filter((b) => b.show_homepage_widget);
  const featuredBookmakers = homepageBookmakers.filter((b) => b.featured).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Schema.org WebSite + Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'MyFreeTip',
              url: 'https://myfreetip.com',
              description: 'Free daily football predictions, match analysis, and transparent results for Kenyan bettors.',
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://myfreetip.com/sports-news?q={search_term_string}' },
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MyFreeTip',
              url: 'https://myfreetip.com',
              logo: 'https://myfreetip.com/brand/app-icon-512.png',
              sameAs: ['https://t.me/BetsmartTi'],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: 'support@myfreetip.com',
                availableLanguage: 'English',
              },
            },
          ]),
        }}
      />

      {/* ── Hero + Best Pick — single col mobile, 2-col desktop ── */}
      <div className="pt-12 pb-12 lg:pt-20 lg:pb-20 lg:grid lg:grid-cols-[1fr_440px] lg:gap-16 lg:items-start">

        <HeroSection />

        {/* Best Pick card — stacks below on mobile, sticky right col on desktop */}
        <div className="mt-8 lg:mt-0 lg:sticky lg:top-24">
          {bestBetLoading && <PredictionCardSkeleton />}

          {!bestBetLoading && bestBet && (
            <>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: '#3DB157' }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#777777' }}>
                  Best Pick Today
                </span>
              </div>
              <PredictionCard card={bestBet} />
              <Link
                to={`/predictions#${bestBet.id}`}
                className="mt-3 block text-center text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: '#3DB157' }}
              >
                View More →
              </Link>
            </>
          )}

          {!bestBetLoading && !bestBet && (
            <p className="text-white/40 text-sm">No pick available today.</p>
          )}
        </div>
      </div>

      {/* ── Bookmaker logo strip ── */}
      {homepageBookmakers.length > 0 && (
        <div className="pb-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#777777' }}>
              Top Bookmakers
            </span>
            <Link
              to="/bookmakers"
              className="text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: '#3DB157' }}
            >
              See all →
            </Link>
          </div>
          <BookmakerLogoStrip bookmakers={homepageBookmakers} seeAllHref="/bookmakers" />
        </div>
      )}

      {/* ── Featured bookmaker widget ── */}
      {featuredBookmakers.length > 0 && (
        <div className="pb-8">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#FFFFFF', boxShadow: 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px' }}
          >
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid rgba(29,29,29,0.06)' }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#777777' }}>
                Top Betting Bonuses
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(29,29,29,0.06)' }}>
              {featuredBookmakers.map((bm) => (
                <div key={bm.slug} className="flex items-center gap-3 px-5 py-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ background: bm.logo_bg_color ?? bm.brand_color ?? '#1D1D1D' }}
                  >
                    {bm.logo_url ? (
                      <img src={bm.logo_url} alt={bm.name} className="w-7 h-7 object-contain" />
                    ) : (
                      <span className="text-white text-[10px] font-bold">{bm.name.slice(0, 3).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight truncate" style={{ color: '#1D1D1D' }}>
                      {bm.offer_headline ?? bm.name}
                    </p>
                    {bm.promo_code && (
                      <p className="text-xs font-mono mt-0.5" style={{ color: '#777777' }}>
                        Code: {bm.promo_code}
                      </p>
                    )}
                  </div>
                  {bm.claim_url && (
                    <a
                      href={bm.claim_url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-85"
                      style={{ background: bm.brand_color ?? '#1A56DB' }}
                    >
                      Claim
                    </a>
                  )}
                </div>
              ))}
            </div>
            <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(29,29,29,0.06)' }}>
              <Link
                to="/bookmakers"
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: '#3DB157' }}
              >
                See all bookmakers →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Full-width sections ── */}
      <div className="flex flex-col gap-16 pb-10">

        <section className="flex flex-col gap-6">
          {matchOfTheDay && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: '#3DB157' }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#777777' }}>
                  Match of the Day
                </span>
              </div>
              <PredictionCard card={matchOfTheDay} />
              <Link
                to={`/predictions#${matchOfTheDay.id}`}
                className="mt-3 block text-center text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: '#3DB157' }}
              >
                View More →
              </Link>
            </div>
          )}

          <FreePicksSection />

          <Link
            to="/predictions"
            className="block text-center text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: '#3DB157' }}
          >
            View all predictions →
          </Link>
        </section>

        <section>
          <LatestNewsSnippet />
        </section>

        <section>
          <AnalystWinRateSection />
        </section>

        <section>
          <NewsletterSignup variant="banner" source="homepage" />
        </section>

      </div>
    </div>
  );
}
