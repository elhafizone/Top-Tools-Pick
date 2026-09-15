import Link from "next/link";
import type { PricingModel } from "@prisma/client";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import { ProductLogo } from "@/components/product/ProductLogo";
import { Rating } from "@/components/ui/Rating";
import { truncate } from "@/lib/text";

export type RowProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  logoUrl?: string | null;
  rating: unknown;
  editorialScore: number;
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  pricingModel: PricingModel;
  bestFor?: string | null;
  category?: { name: string; slug: string } | null;
};

type Props = {
  product: RowProduct;
  /** Position in a ranked list. Renders the numeral that carries the ranking. */
  rank?: number;
  /** Curated award slot, e.g. "Best overall". The loudest label on the row. */
  award?: string | null;
  /** The editor's line for why this tool is here - the reason the row exists. */
  reason?: { label: string; text: string } | null;
  /** Entry plan price label, shown as a decision pill next to the free-plan badges. */
  entryPriceLabel?: string | null;
  /** Outbound CTA. Passed in, because not every query loads affiliate programmes. */
  action?: React.ReactNode;
  /** Heading level, so a row never breaks the document outline of its page. */
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * A product as a comparison row.
 *
 * This is the site's default way to present a set of tools that have been ranked or
 * curated: rows rather than cards, because the eye can run down a column of "best for"
 * lines and price pills and compare them, which is exactly the job on a category page,
 * a shortlist or an alternatives list. Cards stay for open-ended discovery, where there
 * is no ordering to respect.
 *
 * Everything shown maps to a stored column, so a row never implies a claim the data
 * does not make - a tool with no `bestFor` simply shows one line less.
 */
export function ProductRow({
  product,
  rank,
  award,
  reason,
  entryPriceLabel,
  action,
  headingLevel: Heading = "h3",
  className = "",
}: Props) {
  const rating = Number(product.rating) || 0;

  return (
    <article className={`grid gap-6 py-7 lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:gap-10 ${className}`}>
      <div className="flex min-w-0 gap-4 sm:gap-5">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <ProductLogo name={product.name} logoUrl={product.logoUrl} size="lg" />
          {rank !== undefined && (
            <span className="text-xs font-bold tracking-[0.08em] text-[var(--muted)]">
              <span className="sr-only">Rank </span>#{rank}
            </span>
          )}
        </div>

        <div className="min-w-0">
          {(award || product.category) && (
            <div className="flex flex-wrap items-center gap-2">
              {award && <span className="badge badge-solid">{award}</span>}
              {product.category && (
                <Link href={`/categories/${product.category.slug}`} className="badge hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">
                  {product.category.name}
                </Link>
              )}
            </div>
          )}

          <Heading className={`sub-heading ${award || product.category ? "mt-3" : ""}`}>
            <Link href={`/tools/${product.slug}`} className="hover:text-[var(--accent-deep)]">{product.name}</Link>
          </Heading>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{product.shortDescription}</p>

          {reason?.text && (
            <p className="mt-3 max-w-2xl border-l-2 border-[var(--accent)] pl-4 text-sm leading-6 text-[var(--ink-body)]">
              <span className="font-semibold text-[var(--ink)]">{reason.label}</span> {reason.text}
            </p>
          )}

          {!reason && product.bestFor && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-body)]">
              <span className="font-semibold text-[var(--ink)]">Best for:</span> {truncate(product.bestFor, 130)}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Rating value={rating} />
            <span className="text-sm text-[var(--muted)]">
              Score <strong className="font-semibold text-[var(--ink)]">{product.editorialScore}</strong>/100
            </span>
            <DecisionBadges
              hasFreePlan={product.hasFreePlan}
              hasFreeTrial={product.hasFreeTrial}
              pricingModel={product.pricingModel}
              entryPriceLabel={entryPriceLabel}
            />
          </div>
        </div>
      </div>

      {/* Capped below the two-column breakpoint: a full-bleed blue button across a
          tablet width turns an editorial row into an advertisement. */}
      <div className="flex flex-col gap-2.5 sm:max-w-[17rem] lg:max-w-none lg:pt-1">
        {action}
        <Link href={`/tools/${product.slug}`} className="button-secondary w-full">Read the review</Link>
      </div>
    </article>
  );
}
