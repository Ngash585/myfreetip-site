interface StatCellProps {
  value: number | string;
  label: string;
  /** Controls the number colour */
  colour: 'green' | 'red' | 'amber' | 'muted';
}

const COLOUR_MAP: Record<StatCellProps['colour'], string> = {
  green: '#16A34A',
  red:   '#E53E3E',
  amber: '#F4B400',
  muted: 'rgba(250,250,235,0.55)',
};

export function StatCell({ value, label, colour }: StatCellProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl px-3 py-4 gap-1 flex-1"
      style={{ background: 'rgba(255,255,255,0.06)', minWidth: 0 }}
    >
      <span
        className="font-display font-extrabold leading-none"
        style={{
          fontFamily: "'Montserrat Variable', Montserrat, sans-serif",
          fontSize: 'clamp(22px, 6vw, 32px)',
          color: COLOUR_MAP[colour],
        }}
      >
        {value}
      </span>
      <span
        className="font-sans text-[12px] font-medium text-center leading-none"
        style={{ color: 'rgba(250,250,235,0.55)' }}
      >
        {label}
      </span>
    </div>
  );
}
