import { useEffect, useState } from 'react';
import { AnalystWinRateCard } from './AnalystWinRateCard';
import { AnalystWinRateCardSkeleton } from './AnalystWinRateCardSkeleton';
import { getAnalystStats } from '@/lib/api';
import type { AnalystStatRecord } from '@/lib/api';

interface AnalystWinRateSectionProps {
  heading?: string;
}

export function AnalystWinRateSection({
  heading = 'Analyst Win Rate',
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
      {/* Section heading */}
      <h2
        className="mb-6 text-[13px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: '#777777' }}
      >
        {heading}
      </h2>

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
