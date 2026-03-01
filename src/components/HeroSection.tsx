import { useEffect, useState } from "react";
import type { AnalystStatRecord } from "@/lib/api";
import { getAnalystStats } from "@/lib/api";

const TODAY = new Date().toLocaleDateString("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function HeroSection() {
  const [record, setRecord] = useState<AnalystStatRecord | null>(null);

  useEffect(() => {
    getAnalystStats()
      .then((p) => setRecord(p.records[0] ?? null))
      .catch(() => {});
  }, []);

  return (
    <section className="mb-10">

      {/* ── Social proof pill ─────────────────────────────────── */}
      <div className="inline-flex items-center gap-2 border border-emerald-500/40 bg-emerald-500/10 rounded-full px-3 py-1.5 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <span className="text-xs text-emerald-300 font-medium">
          40,000 bettors follow our daily picks
        </span>
        <span className="text-emerald-600 select-none">|</span>
        <span className="text-xs text-emerald-400 font-bold tracking-widest">LIVE</span>
      </div>

      {/* ── Headline ──────────────────────────────────────────── */}
      <div className="mb-4">
        <h1 className="text-5xl sm:text-6xl font-black leading-none tracking-tight text-white">
          Stop guessing.
        </h1>
        <h1 className="text-5xl sm:text-6xl font-black leading-none tracking-tight text-[#3a4a5a]">
          Start winning.
        </h1>
      </div>

      {/* ── Green accent dash ─────────────────────────────────── */}
      <div className="w-10 h-1 bg-emerald-500 rounded-full mb-5" />

      {/* ── Subtext ───────────────────────────────────────────── */}
      <p className="text-base text-[#8a9bb0] leading-relaxed mb-6">
        Every day, our analysis finds the highest-confidence match and gives
        you a booking code —{" "}
        <strong className="text-white">
          just paste it into 1xBet, Paripesa, Melbet and more.
        </strong>{" "}
        It costs you nothing.
      </p>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      {record ? (
        <>
          <div className="grid grid-cols-4 bg-[#1a2634] rounded-2xl overflow-hidden border border-[#2a3a4a]">
            <div className="py-4 text-center border-r border-[#2a3a4a]">
              <p className="text-2xl font-extrabold text-emerald-400">
                {record.win_rate_pct}%
              </p>
              <p className="text-[11px] text-[#8a9bb0] mt-0.5">Win Rate</p>
            </div>
            <div className="py-4 text-center border-r border-[#2a3a4a]">
              <p className="text-2xl font-extrabold text-emerald-400">
                {record.won}
              </p>
              <p className="text-[11px] text-[#8a9bb0] mt-0.5">Won</p>
            </div>
            <div className="py-4 text-center border-r border-[#2a3a4a]">
              <p className="text-2xl font-extrabold text-red-400">
                {record.lost}
              </p>
              <p className="text-[11px] text-[#8a9bb0] mt-0.5">Lost</p>
            </div>
            <div className="py-4 text-center">
              <p className="text-2xl font-extrabold text-white">
                {record.total}
              </p>
              <p className="text-[11px] text-[#8a9bb0] mt-0.5">Total</p>
            </div>
          </div>

          <p className="text-[11px] text-[#4a5a6a] text-center mt-2 italic">
            {TODAY} · {record.period_label ?? "all time"} · losses never hidden
          </p>
        </>
      ) : (
        /* skeleton while loading */
        <div className="h-20 bg-[#1a2634] rounded-2xl animate-pulse border border-[#2a3a4a]" />
      )}

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <div className="mt-8 flex flex-col items-center gap-1">
        <p className="text-[10px] font-semibold text-[#4a5a6a] uppercase tracking-[0.18em]">
          Today's best bet below
        </p>
        <span className="text-[#4a5a6a] text-xs animate-bounce">↓</span>
      </div>

    </section>
  );
}
