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
      className="rounded-2xl p-6 flex flex-col gap-6"
      style={{
        background: '#FFFFFF',
        boxShadow: 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px',
      }}
    >
      {/* Ring + title */}
      <div className="flex items-center gap-5">
        <CircularProgress pct={record.win_rate_pct} size={100} strokeWidth={9} />

        <div className="flex flex-col gap-1 min-w-0">
          <h3
            className="leading-tight tracking-[-0.02em]"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(16px, 3.5vw, 20px)',
              color: '#1D1D1D',
              fontWeight: 400,
            }}
          >
            {record.title}
          </h3>
          {record.subtitle && (
            <p className="text-sm leading-snug" style={{ color: '#4F4841', fontWeight: 300 }}>
              {record.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Stat tiles */}
      <div className="flex gap-3">
        <StatCell value={record.won}   label="Won"   colour="green" />
        <StatCell value={record.lost}  label="Lost"  colour="red"   />
        {showVoid && (
          <StatCell value={record.void!} label="Void" colour="amber" />
        )}
        <StatCell value={record.total} label="Total" colour="muted" />
      </div>
    </div>
  );
}
