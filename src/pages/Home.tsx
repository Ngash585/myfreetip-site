import { useEffect, useState } from "react";
import type { TipCard } from "@/lib/api";
import { getTipCards } from "@/lib/api";
import { PredictionCard, PredictionCardSkeleton } from "@/components/PredictionCard";
import { AnalystWinRateSection } from "@/components/AnalystWinRate";
import { FreePicksSection } from "@/components/FreePicksSection";
import { LatestNewsSnippet } from "@/components/LatestNewsSnippet";
import { HeroSection } from "@/components/HeroSection";

export default function Home() {
  const [bestBet, setBestBet]               = useState<TipCard | null>(null);
  const [bestBetLoading, setBestBetLoading] = useState(true);

  useEffect(() => {
    getTipCards()
      .then((cards) => setBestBet(cards[0] ?? null))
      .catch(() => setBestBet(null))
      .finally(() => setBestBetLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── Hero + Best Bet — single col mobile, 2-col desktop ── */}
      <div className="pt-10 pb-16 lg:pt-16 lg:pb-20 lg:grid lg:grid-cols-[1fr_440px] lg:gap-16 lg:items-start">

        <HeroSection />

        {/* Best Bet card — stacks below on mobile, sticky right col on desktop */}
        <div className="mt-8 lg:mt-0 lg:sticky lg:top-24">
          {bestBetLoading && <PredictionCardSkeleton />}

          {!bestBetLoading && bestBet && (
            <>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                  Best Bet Today
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
          <AnalystWinRateSection stepNumber={5} />
        </section>

      </div>
    </div>
  );
}
