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

      {/* ── Social proof pill ── */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-8"
        style={{ background: '#EAF7EE', border: '1px solid rgba(61,177,87,0.30)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: '#3DB157' }} />
        <span className="text-xs font-medium tracking-wide" style={{ color: '#2D9A47' }}>
          40,000 bettors follow our daily picks
        </span>
        <span className="select-none" style={{ color: 'rgba(61,177,87,0.35)' }}>|</span>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#3DB157' }}>LIVE</span>
      </div>

      {/* ── Headline — DM Serif Display ── */}
      <div className="mb-8">
        <h1
          className="leading-[1.05] tracking-[-0.04em]"
          style={{ fontFamily: DS, fontSize: 'clamp(48px, 8vw, 72px)', color: '#1D1D1D', fontWeight: 400 }}
        >
          Stop guessing.
        </h1>
        <h1
          className="leading-[1.05] tracking-[-0.04em]"
          style={{ fontFamily: DS, fontSize: 'clamp(48px, 8vw, 72px)', color: 'rgba(29,29,29,0.20)', fontWeight: 400 }}
        >
          Start winning.
        </h1>
      </div>

      {/* ── Body copy ── */}
      <p
        className="mb-10 max-w-lg"
        style={{ fontSize: '17px', color: '#4F4841', lineHeight: '1.7', fontWeight: 300 }}
      >
        Every day, our analysis finds the highest-confidence match and gives
        you a booking code —{" "}
        <strong style={{ color: '#1D1D1D', fontWeight: 500 }}>
          just paste it into 1xBet, Paripesa, Melbet and more.
        </strong>{" "}
        It costs you nothing.
      </p>

      {/* ── Stats row — inline on warm bg, no card ── */}
      {record ? (
        <>
          <div className="flex items-stretch">
            <StatNum value={`${record.win_rate_pct}%`} label="Win Rate" color="#3DB157" first />
            <div className="w-px self-stretch my-1" style={{ background: 'rgba(29,29,29,0.10)' }} />
            <StatNum value={record.won}   label="Won"   color="#1D1D1D" />
            <div className="w-px self-stretch my-1" style={{ background: 'rgba(29,29,29,0.10)' }} />
            <StatNum value={record.lost}  label="Lost"  color="#C0392B" />
            <div className="w-px self-stretch my-1" style={{ background: 'rgba(29,29,29,0.10)' }} />
            <StatNum value={record.total} label="Total" color="#1D1D1D" />
          </div>

          <p className="text-xs mt-3" style={{ color: '#777777' }}>
            {TODAY} · {record.period_label ?? "all time"} · losses never hidden
          </p>
        </>
      ) : (
        <div className="h-24 rounded-2xl animate-pulse" style={{ background: '#F2EEE9' }} />
      )}

      {/* ── Scroll cue (mobile only) ── */}
      <div className="mt-10 flex flex-col items-center gap-1 lg:hidden">
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
    <div className={`flex flex-col items-center text-center ${first ? 'pr-6' : 'px-6'}`}>
      <span
        className="leading-none tracking-[-0.03em]"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '52px', color, fontWeight: 400 }}
      >
        {value}
      </span>
      <span
        className="mt-1.5 uppercase tracking-[0.08em] text-[11px]"
        style={{ color: '#777777', fontWeight: 400 }}
      >
        {label}
      </span>
    </div>
  );
}
