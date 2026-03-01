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
    <section>

      {/* ── Social proof pill ── */}
      <div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/8 rounded-full px-3 py-1.5 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <span className="text-xs text-emerald-300 font-medium tracking-wide">
          40,000 bettors follow our daily picks
        </span>
        <span className="text-emerald-700 select-none">|</span>
        <span className="text-xs text-emerald-400 font-bold tracking-widest">LIVE</span>
      </div>

      {/* ── Headline ── */}
      <div className="mb-5">
        <h1 className="text-5xl sm:text-6xl lg:text-6xl font-black leading-[1.05] tracking-tight text-white">
          Stop guessing.
        </h1>
        <h1 className="text-5xl sm:text-6xl lg:text-6xl font-black leading-[1.05] tracking-tight text-white/20">
          Start winning.
        </h1>
      </div>

      {/* ── Green accent dash ── */}
      <div className="w-10 h-1 bg-emerald-500 rounded-full mb-6" />

      {/* ── Subtext ── */}
      <p className="text-base text-white/60 leading-7 mb-8 max-w-lg">
        Every day, our analysis finds the highest-confidence match and gives
        you a booking code —{" "}
        <strong className="text-white font-semibold">
          just paste it into 1xBet, Paripesa, Melbet and more.
        </strong>{" "}
        It costs you nothing.
      </p>

      {/* ── Stats bar ── */}
      {record ? (
        <>
          <div className="grid grid-cols-4 bg-[#1a2634] rounded-2xl overflow-hidden border border-[#2a3a4a]">
            <div className="py-5 text-center border-r border-[#2a3a4a]">
              <p className="text-2xl font-extrabold text-emerald-400 tracking-tight">
                {record.win_rate_pct}%
              </p>
              <p className="text-[11px] text-white/35 mt-1 uppercase tracking-wider">Win Rate</p>
            </div>
            <div className="py-5 text-center border-r border-[#2a3a4a]">
              <p className="text-2xl font-extrabold text-emerald-400 tracking-tight">
                {record.won}
              </p>
              <p className="text-[11px] text-white/35 mt-1 uppercase tracking-wider">Won</p>
            </div>
            <div className="py-5 text-center border-r border-[#2a3a4a]">
              <p className="text-2xl font-extrabold text-red-400 tracking-tight">
                {record.lost}
              </p>
              <p className="text-[11px] text-white/35 mt-1 uppercase tracking-wider">Lost</p>
            </div>
            <div className="py-5 text-center">
              <p className="text-2xl font-extrabold text-white tracking-tight">
                {record.total}
              </p>
              <p className="text-[11px] text-white/35 mt-1 uppercase tracking-wider">Total</p>
            </div>
          </div>

          <p className="text-[11px] text-white/25 text-center mt-2.5 tracking-wide">
            {TODAY} · {record.period_label ?? "all time"} · losses never hidden
          </p>
        </>
      ) : (
        <div className="h-[88px] bg-[#1a2634] rounded-2xl animate-pulse border border-[#2a3a4a]" />
      )}

      {/* ── Scroll cue (mobile only — desktop has card on the right) ── */}
      <div className="mt-10 flex flex-col items-center gap-1 lg:hidden">
        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.18em]">
          Today's best bet below
        </p>
        <span className="text-white/20 text-xs animate-bounce">↓</span>
      </div>

    </section>
  );
}
