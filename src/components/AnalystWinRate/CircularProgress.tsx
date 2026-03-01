import { useEffect, useRef } from 'react';

interface CircularProgressProps {
  /** 0–100 */
  pct: number;
  /** Outer diameter in px. Default: 100 */
  size?: number;
  /** Ring stroke width. Default: 9 */
  strokeWidth?: number;
}

export function CircularProgress({
  pct,
  size = 100,
  strokeWidth = 9,
}: CircularProgressProps) {
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
        {/* Track ring */}
        <circle
          cx={centre}
          cy={centre}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Animated fill arc */}
        <circle
          ref={arcRef}
          cx={centre}
          cy={centre}
          r={radius}
          fill="none"
          stroke="#16A34A"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>

      {/* Centred percentage label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display font-extrabold leading-none"
          style={{
            fontFamily: "'Montserrat Variable', Montserrat, sans-serif",
            fontSize: size * 0.22,
            color: '#16A34A',
          }}
        >
          {clampedPct}%
        </span>
      </div>
    </div>
  );
}
