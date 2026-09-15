import Link from "next/link";
import type { Product, Category } from "@prisma/client";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import { ProductLogo } from "@/components/product/ProductLogo";
import { Rating } from "@/components/ui/Rating";
import { truncate } from "@/lib/text";

type ProductWithCategory = Product & { category: Category };

/**
 * A product as a discovery card.
 *
 * Cards are for browsing a set with no inherent order - the directory, a category's
 * full list, a facet landing. Anywhere the set *is* ordered or curated, `ProductRow`
 * is used instead, so a ranking is never flattened into an anonymous grid.
 *
 * The card leads with identity (logo, name, category) and closes with the two numbers
 * people actually compare, so a column of cards can be scanned down rather than read.
 */
export function ProductCard({ product }: { product: ProductWithCategory }) {
  return (
    <article className="panel panel-raised panel-hover group flex h-full min-w-0 flex-col p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <ProductLogo name={product.name} logoUrl={product.logoUrl} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold tracking-[-0.02em] text-[var(--ink)]">
            <Link href={`/tools/${product.slug}`} className="group-hover:text-[var(--accent-deep)]">{product.name}</Link>
          </h3>
          <p className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
            {product.category.name}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{truncate(product.shortDescription, 120)}</p>

      {product.bestFor && (
        <p className="mt-3 text-sm leading-6 text-[var(--ink-body)]">
          <span className="font-semibold text-[var(--ink)]">Best for:</span> {truncate(product.bestFor, 70)}
        </p>
      )}

      <div className="flex-1" />

      <DecisionBadges
        hasFreePlan={product.hasFreePlan}
        hasFreeTrial={product.hasFreeTrial}
        pricingModel={product.pricingModel}
        className="mt-5"
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
        <Rating value={Number(product.rating)} />
        <Link
          href={`/tools/${product.slug}`}
          aria-label={`Read the ${product.name} review`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-deep)]"
        >
          Read review <span aria-hidden="true" className="hover-shift">&#8594;</span>
        </Link>
      </div>
    </article>
  );
}
