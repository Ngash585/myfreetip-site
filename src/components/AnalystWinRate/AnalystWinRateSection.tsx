import { useEffect, useState } from 'react';
import { AnalystWinRateCard } from './AnalystWinRateCard';
import { AnalystWinRateCardSkeleton } from './AnalystWinRateCardSkeleton';
import { getAnalystStats } from '@/lib/api';
import type { AnalystStatRecord } from '@/lib/api';

interface AnalystWinRateSectionProps {
  /** The gold step-circle number shown in the section header. Default: 5 */
  stepNumber?: number;
  /** Section title. Default: "ANALYST WIN RATE" */
  heading?: string;
}

export function AnalystWinRateSection({
  stepNumber = 5,
  heading = 'ANALYST WIN RATE',
}: AnalystWinRateSectionProps) {
  const [records, setRecords] = useState<AnalystStatRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getAnalystStats()
      .then(payload => {
        if (!mounted) return;
        setRecords(payload.records);
      })
      .catch(err => {
        if (!mounted) return;
        setError(err?.message ?? 'Failed to load stats');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  return (
    <section>
      {/* Section header — gold step-circle + label */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: '#F4B400', color: '#F4B400' }}
        >
          <span className="font-mono text-[11px] font-bold leading-none">
            {stepNumber}
          </span>
        </div>
        <span
          className="font-mono text-[12px] font-extrabold uppercase tracking-[0.16em]"
          style={{ color: '#F4B400' }}
        >
          {heading}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        {loading && <AnalystWinRateCardSkeleton />}

        {!loading && error && (
          <p className="text-sm text-red-400 py-4">
            Could not load analyst stats. Please try again later.
          </p>
        )}

        {!loading && !error && records.length === 0 && (
          <p className="text-sm py-4" style={{ color: 'rgba(250,250,235,0.55)' }}>
            No analyst stats available yet.
          </p>
        )}

        {!loading && !error && records.map((record, i) => (
          <AnalystWinRateCard key={i} record={record} />
        ))}
      </div>
    </section>
  );
}
