import { CircularProgress } from './CircularProgress';
import { StatCell } from './StatCell';
import type { AnalystStatRecord } from '@/lib/api';

interface AnalystWinRateCardProps {
  record: AnalystStatRecord;
}

export function AnalystWinRateCard({ record }: AnalystWinRateCardProps) {
  const showVoid = record.void != null && record.void > 0;

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-5"
      style={{
        background: 'linear-gradient(145deg, #0D1E30 0%, #0B1A28 100%)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top row: ring + title */}
      <div className="flex items-center gap-5">
        <CircularProgress pct={record.win_rate_pct} size={100} strokeWidth={9} />

        <div className="flex flex-col gap-1 min-w-0">
          <h3
            className="font-display font-extrabold text-white leading-tight"
            style={{
              fontFamily: "'Montserrat Variable', Montserrat, sans-serif",
              fontSize: 'clamp(15px, 3.5vw, 20px)',
            }}
          >
            {record.title}
          </h3>
          {record.subtitle && (
            <p className="text-[13px] leading-snug" style={{ color: 'rgba(250,250,235,0.55)' }}>
              {record.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Stat tiles row */}
      <div className="flex gap-2.5">
        <StatCell value={record.won}  label="Won"   colour="green" />
        <StatCell value={record.lost} label="Lost"  colour="red"   />
        {showVoid && (
          <StatCell value={record.void!} label="Void" colour="amber" />
        )}
        <StatCell value={record.total} label="Total" colour="muted" />
      </div>
    </div>
  );
}
