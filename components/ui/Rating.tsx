const STAR_PATH = "M12 2.6l2.77 5.61 6.19.9-4.48 4.37 1.06 6.17L12 16.75l-5.54 2.9 1.06-6.17L3.04 9.11l6.19-.9L12 2.6z";

function StarRow({ className }: { className: string }) {
  return (
    <span className={`inline-flex gap-[2px] ${className}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <svg key={index} viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden="true" focusable="false">
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

type Props = {
  /** 0-5, as stored on Product.rating. */
  value: number;
  /** Hide the numeral where space is tight. */
  showValue?: boolean;
  className?: string;
};

/**
 * Star rating.
 *
 * The site previously printed a lone "★ 4.6", which reads as decoration rather than a
 * score. Five stars with a proportional fill is the vocabulary people already know from
 * every other place they research a purchase, and it scans in a column without being read.
 *
 * The stars are decorative: the accessible value is the text next to them, so screen
 * readers hear "4.6 out of 5" once rather than five identical star labels.
 */
export function Rating({ value, showValue = true, className = "" }: Props) {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));
  const percent = (clamped / 5) * 100;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex" aria-hidden="true">
        <StarRow className="text-[var(--line-strong)]" />
        {/*
         * The filled row must land pixel-for-pixel on top of the grey one, or the grey
         * star edges show through and each star reads as two overlapping stars.
         *
         * That needs `flex` here. The grey row is a flex item of the wrapper, so its
         * `inline-flex` is blockified and it sits flush with the top of the box. Left as
         * a block, this overlay put its row on a line box instead, where the inherited
         * 20px line-height and baseline alignment pushed it exactly 1px lower. Making the
         * overlay a flex container blockifies its row the same way, so both rows share
         * one layout mode and one position. `shrink-0` keeps the row at its natural width
         * so the percentage width clips it rather than squashing it.
         */}
        <span className="absolute inset-y-0 left-0 flex overflow-hidden" style={{ width: `${percent}%` }}>
          <StarRow className="shrink-0 text-[var(--accent)]" />
        </span>
      </span>
      {showValue && (
        <span className="text-sm font-semibold text-[var(--ink)]">
          {clamped.toFixed(1)}
          <span className="font-normal text-[var(--muted)]">/5</span>
          <span className="sr-only"> rating</span>
        </span>
      )}
    </span>
  );
}

/**
 * The editorial score as a labelled meter.
 *
 * "84/100" on its own is a number with no scale; the bar gives it one at a glance,
 * which is the whole point of a score on a page meant to speed up a decision.
 */
export function ScoreMeter({ score, className = "", label = "Editorial score" }: { score: number; className?: string; label?: string }) {
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</span>
        <span className="text-sm font-bold text-[var(--ink)]">{clamped}<span className="font-normal text-[var(--muted)]">/100</span></span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]"
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
