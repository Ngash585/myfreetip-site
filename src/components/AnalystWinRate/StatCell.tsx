interface StatCellProps {
  value: number | string;
  label: string;
  colour: 'green' | 'red' | 'amber' | 'muted';
}

const COLOUR_MAP: Record<StatCellProps['colour'], string> = {
  green: '#3DB157',
  red:   '#C0392B',
  amber: '#B8860B',
  muted: '#1D1D1D',
};

export function StatCell({ value, label, colour }: StatCellProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl px-3 py-4 gap-1 flex-1"
      style={{ background: '#F8F4EF' }}
    >
      <span
        className="leading-none tracking-[-0.02em]"
        style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 'clamp(22px, 6vw, 32px)',
          color: COLOUR_MAP[colour],
          fontWeight: 400,
        }}
      >
        {value}
      </span>
      <span
        className="text-[11px] font-medium uppercase tracking-wider text-center leading-none"
        style={{ color: '#777777' }}
      >
        {label}
      </span>
    </div>
  );
}
