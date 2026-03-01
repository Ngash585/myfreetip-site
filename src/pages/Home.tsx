import { useEffect, useState } from "react";
import type { TipCard } from "@/lib/api";
import { getTipCards } from "@/lib/api";
import { PredictionCard, PredictionCardSkeleton } from "@/components/PredictionCard";
import { AnalystWinRateSection } from "@/components/AnalystWinRate";
import { FreePicksSection } from "@/components/FreePicksSection";
import { LatestNewsSnippet } from "@/components/LatestNewsSnippet";

export default function Home() {
  const [bestBet, setBestBet]           = useState<TipCard | null>(null);
  const [bestBetLoading, setBestBetLoading] = useState(true);

  useEffect(() => {
    getTipCards()
      .then((cards) => setBestBet(cards[0] ?? null))
      .catch(() => setBestBet(null))
      .finally(() => setBestBetLoading(false));
  }, []);

  return (
    <div className="px-4 py-6 text-white max-w-2xl mx-auto">

      {/* Best Bet Today */}
      <section>
        {bestBetLoading && <PredictionCardSkeleton />}
        {!bestBetLoading && bestBet && (
          <>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-[#8a9bb0] uppercase tracking-wide">
                Best Bet Today
              </span>
            </div>
            <PredictionCard card={bestBet} />
          </>
        )}
        {!bestBetLoading && !bestBet && (
          <p className="text-[#8a9bb0] text-sm">No pick available today.</p>
        )}
      </section>

      {/* Free Picks snippet */}
      <section className="mt-8">
        <FreePicksSection />
      </section>

      {/* Latest News */}
      <section className="mt-8">
        <LatestNewsSnippet />
      </section>

      {/* Analyst Win Rate */}
      <section className="mt-8">
        <AnalystWinRateSection stepNumber={5} />
      </section>

    </div>
  );
}
