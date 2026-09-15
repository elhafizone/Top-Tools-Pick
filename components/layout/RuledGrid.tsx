/**
 * Editorial grid with hairline rules between cells.
 *
 * Every cell draws its own left border and left gutter; the grid is then shifted left by
 * exactly one gutter plus one pixel inside an `overflow-hidden` wrapper, so the leftmost
 * column's border and gutter are clipped away. The first column stays flush with the page
 * margin, every other column gets a divider and matching inset, and the grid still spans
 * the full width because it is widened by the same amount it was shifted.
 *
 * The point is that this holds for any column count, any number of items, and any cell
 * that spans several columns. The previous approach derived dividers from `nth-child`
 * arithmetic, which broke in two ways: a `sm:` rule keeps applying at `lg` (breakpoints are
 * min-width), so cards 4 and 10 of a 3-column grid picked up a stray border and a 24px
 * indent; and a single `col-span-2` card shifted every following card's visual column away
 * from its DOM index, inverting the dividers entirely at tablet width.
 *
 * The shift lives in `.ruled-grid` rather than in a utility class so it reads the same
 * `--ruled-gutter` token as `.ruled-cell`'s padding. When the two were written out
 * separately, narrowing the cell padding at mobile left the shift wider than the padding
 * and the single column's own text was clipped off the left edge.
 *
 * Cells are expected to carry `ruled-cell` (see globals.css) for the border and padding.
 */
export function RuledGrid({ columns, className = "", children }: { columns: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`overflow-hidden border-t border-[var(--line)] ${className}`}>
      <div className={`ruled-grid ${columns}`}>{children}</div>
    </div>
  );
}
