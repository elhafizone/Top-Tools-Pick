import Link from "next/link";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { ProductRow } from "@/components/product/ProductRow";
import { ctaSubline } from "@/lib/affiliate/cta";
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
 * Every row shows the editor's own reason. Rows without one fall back to the tool's
 * "best for" line rather than a generated sentence. Returns null when nothing is
 * curated, so the page never shows an empty promise.
 */
export function AlternativesSection({ items, productName, moreHref, headingId = "alternatives-heading" }: Props) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="mt-14">
      <p className="eyebrow">Not the right fit?</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
        <h2 id={headingId} className="section-heading">Alternatives to {productName}</h2>
        {moreHref && (
          <Link href={moreHref} className="shrink-0 text-sm font-semibold text-[var(--accent-deep)]">Compare all alternatives</Link>
        )}
      </div>

      <div className="rule-list border-b border-[var(--line)]">
        {items.map(({ alternative, reason }) => (
          <ProductRow
            key={alternative.id}
            product={alternative}
            reason={reason ? { label: "Why instead:", text: reason } : null}
            entryPriceLabel={ctaSubline(alternative.pricingPlans)}
            action={<AffiliateCta product={alternative} placement="alternatives" className="w-full" />}
          />
        ))}
      </div>
    </section>
  );
}
