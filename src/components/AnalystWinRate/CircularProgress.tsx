import { useEffect, useRef } from 'react';

interface CircularProgressProps {
  pct: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({ pct, size = 100, strokeWidth = 9 }: CircularProgressProps) {
  const arcRef = useRef<SVGCircleElement>(null);

  const centre = size / 2;
  const radius = centre - strokeWidth / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, pct));

  useEffect(() => {
    const el = arcRef.current;
    if (!el) return;
    const targetOffset = circumference * (1 - clampedPct / 100);
    el.style.transition = 'none';
    el.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.strokeDashoffset = String(targetOffset);
      });
    });
  }, [circumference, clampedPct]);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden
      >
        {/* Track */}
        <circle
          cx={centre} cy={centre} r={radius}
          fill="none"
          stroke="rgba(29, 29, 29, 0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Arc */}
        <circle
          ref={arcRef}
          cx={centre} cy={centre} r={radius}
          fill="none"
          stroke="#3DB157"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="leading-none"
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: size * 0.22,
            color: '#3DB157',
            fontWeight: 400,
          }}
        >
          {clampedPct}%
        </span>
      </div>
    </div>
  );
}
