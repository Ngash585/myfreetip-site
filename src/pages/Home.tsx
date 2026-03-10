import { useQuery } from "@tanstack/react-query";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getTipCards } from "@/lib/api";
import { PredictionCard, PredictionCardSkeleton } from "@/components/PredictionCard";
import { AnalystWinRateSection } from "@/components/AnalystWinRate";
import { FreePicksSection } from "@/components/FreePicksSection";
import { LatestNewsSnippet } from "@/components/LatestNewsSnippet";
import { HeroSection } from "@/components/HeroSection";
import { NewsletterSignup } from "@/components/NewsletterSignup";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
            </>
          )}

          {!bestBetLoading && !bestBet && (
            <p className="text-white/40 text-sm">No pick available today.</p>
          )}
        </div>
      </div>

      {/* ── Full-width sections ── */}
      <div className="flex flex-col gap-16 pb-20">

        <section>
          <FreePicksSection />
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
