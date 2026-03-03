import { useQuery } from '@tanstack/react-query';
import { AnalystWinRateCard } from './AnalystWinRateCard';
import { AnalystWinRateCardSkeleton } from './AnalystWinRateCardSkeleton';
import { getAnalystStats } from '@/lib/api';

interface AnalystWinRateSectionProps {
  heading?: string;
}

export function AnalystWinRateSection({
  heading = 'Analyst Win Rate',
}: AnalystWinRateSectionProps) {
  const { data, isLoading: loading, isError } = useQuery({
    queryKey: ['analyst-stats'],
    queryFn: getAnalystStats,
  });
  const records = data?.records ?? [];
  const error = isError ? 'Failed to load stats' : null;

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
