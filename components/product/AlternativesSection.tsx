import Link from "next/link";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import type { CuratedAlternative } from "@/lib/alternatives";

type Props = {
  items: CuratedAlternative[];
  /** The tool these are alternatives to. */
  productName: string;
  /** Link to the dedicated page - only passed when that page is worth visiting. */
  moreHref?: string;
  headingId?: string;
};

/**
 * "If this is not right for you, here is what to use instead."
 *
 * Every row shows the editor's own reason. Rows without one still render, but the
 * reason line is simply absent rather than filled with a generated sentence.
 * Returns null when nothing is curated, so the page never shows an empty promise.
 */
export function AlternativesSection({ items, productName, moreHref, headingId = "alternatives-heading" }: Props) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="mt-16">
      <p className="eyebrow">Not the right fit?</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h2 id={headingId} className="text-3xl font-bold tracking-[-0.05em]">Alternatives to {productName}</h2>
        {moreHref && <Link href={moreHref} className="editorial-link text-sm font-semibold">Compare all alternatives ↗</Link>}
      </div>

      <ul className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {items.map(({ alternative, reason }) => (
          <li key={alternative.id} className="grid gap-5 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="eyebrow">{alternative.category.name}</p>
              <h3 className="mt-2 text-xl font-bold tracking-[-0.03em]">
                <Link href={`/tools/${alternative.slug}`} className="hover:text-[var(--accent-deep)]">{alternative.name}</Link>
              </h3>
              {reason && (
                <p className="mt-2 max-w-xl leading-7 text-[var(--ink)]">
                  <span className="font-semibold">Why instead:</span> <span className="text-[var(--muted)]">{reason}</span>
                </p>
              )}
              <DecisionBadges
                hasFreePlan={alternative.hasFreePlan}
                hasFreeTrial={alternative.hasFreeTrial}
                pricingModel={alternative.pricingModel}
                className="mt-4"
              />
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Link href={`/tools/${alternative.slug}`} className="button-secondary">Read review</Link>
              <AffiliateCta product={alternative} placement="alternatives" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
