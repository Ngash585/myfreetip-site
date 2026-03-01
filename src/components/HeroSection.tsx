import { useEffect, useState } from "react";
import type { AnalystStatRecord } from "@/lib/api";
import { getAnalystStats } from "@/lib/api";

const TODAY = new Date().toLocaleDateString("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const DS = "'DM Serif Display', Georgia, serif";

export function HeroSection() {
  const [record, setRecord] = useState<AnalystStatRecord | null>(null);

  useEffect(() => {
    getAnalystStats()
      .then((p) => setRecord(p.records[0] ?? null))
      .catch(() => {});
  }, []);

  return (
    <section>

      {/* ── Social proof pill — sits close to headline ── */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4"
        style={{ background: '#EAF7EE', border: '1px solid rgba(61,177,87,0.30)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: '#3DB157' }} />
        <span className="text-xs font-medium tracking-wide" style={{ color: '#2D9A47' }}>
          40,000 bettors follow our daily picks
        </span>
        <span className="select-none" style={{ color: 'rgba(61,177,87,0.35)' }}>|</span>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#3DB157' }}>LIVE</span>
      </div>

      {/* ── Headline — 48px mobile, 64px desktop ── */}
      <div className="mb-5">
        <h1
          className="leading-[1.05] tracking-[-0.04em] text-[48px] md:text-[64px]"
          style={{ fontFamily: DS, color: '#1D1D1D', fontWeight: 400 }}
        >
          Stop guessing.
        </h1>
        <h1
          className="leading-[1.05] tracking-[-0.04em] text-[48px] md:text-[64px]"
          style={{ fontFamily: DS, color: 'rgba(29,29,29,0.35)', fontWeight: 400 }}
        >
          Start winning.
        </h1>
      </div>

      {/* ── Body copy ── */}
      <p
        className="mb-7 max-w-[520px] text-[15px] md:text-[17px]"
        style={{ color: '#4F4841', lineHeight: '1.7', fontWeight: 300, hyphens: 'none' }}
      >
        Every day, our analysis finds the highest-confidence match and gives
        you a booking code —{" "}
        <strong style={{ color: '#1D1D1D', fontWeight: 500 }}>
          just paste it into 1xBet, Paripesa, Melbet and more.
        </strong>{" "}
        It costs you nothing.
      </p>

      {/* ── Stats — single inline row with hairline dividers at all sizes ── */}
      {record ? (
        <>
          <div className="flex items-stretch">
            <StatNum value={`${record.win_rate_pct}%`} label="Win Rate" color="#3DB157" first />
            <div className="w-px self-stretch my-1" style={{ background: 'rgba(29,29,29,0.10)' }} />
            <StatNum value={record.won}   label="Won"   color="#1D1D1D" />
            <div className="w-px self-stretch my-1" style={{ background: 'rgba(29,29,29,0.10)' }} />
            <StatNum value={record.lost}  label="Lost"  color="#1D1D1D" />
            <div className="w-px self-stretch my-1" style={{ background: 'rgba(29,29,29,0.10)' }} />
            <StatNum value={record.total} label="Total" color="#1D1D1D" />
          </div>

          <p className="text-xs mt-3" style={{ color: '#777777' }}>
            {TODAY} · {record.period_label ?? "all time"} · losses never hidden
          </p>

          {/* Desktop secondary CTA */}
          <a
            href="/predictions"
            className="mt-6 hidden lg:inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: '#4F4841' }}
          >
            See today's picks
            <span style={{ color: '#3DB157' }}>↓</span>
          </a>
        </>
      ) : (
        <div className="h-20 rounded-2xl animate-pulse" style={{ background: '#F2EEE9' }} />
      )}

      {/* ── Scroll cue (mobile only) ── */}
      <div className="mt-8 flex flex-col items-center gap-1 lg:hidden">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: '#B8860B' }}>
          Today's best bet below
        </p>
        <span className="text-xs animate-bounce" style={{ color: '#B8860B' }}>↓</span>
      </div>

    </section>
  );
}

function StatNum({
  value,
  label,
  color,
  first = false,
}: {
  value: string | number;
  label: string;
  color: string;
  first?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center text-center ${first ? 'pr-5 md:pr-6' : 'px-5 md:px-6'}`}>
      <span
        className="leading-none tracking-[-0.03em] text-[38px] md:text-[52px]"
        style={{ fontFamily: DS, color, fontWeight: 400 }}
      >
        {value}
      </span>
      <span
        className="mt-1.5 uppercase tracking-[0.08em] text-[10px] md:text-[11px]"
        style={{ color: '#777777', fontWeight: 400 }}
      >
        {label}
      </span>
    </div>
  );
}
