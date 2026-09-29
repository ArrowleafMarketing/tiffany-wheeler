import { cn } from "@/lib/cn";

type Props = {
  /** 0–5, fractional allowed. */
  value: number;
  size?: number;
  className?: string;
  /** Accessible label; defaults to "Rated X out of 5". */
  label?: string;
};

const STAR =
  "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

export function Stars({ value, size = 16, className, label }: Props) {
  const pct = Math.max(0, Math.min(5, value)) / 5;
  return (
    <span
      role="img"
      aria-label={label ?? `Rated ${value.toFixed(1)} out of 5`}
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size * 5.5, height: size }}
    >
      <Row size={size} className="text-star-empty" />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct * 100}%` }}>
        <Row size={size} className="text-star" />
      </span>
    </span>
  );
}

function Row({ size, className }: { size: number; className: string }) {
  return (
    <svg
      aria-hidden
      width={size * 5.5}
      height={size}
      viewBox={`0 0 ${24 * 5 + 12} 24`}
      className={className}
      fill="currentColor"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={STAR} transform={`translate(${i * 27} 0)`} />
      ))}
    </svg>
  );
}
