"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product, Category } from "@prisma/client";
import { ProductCard } from "@/components/product/ProductCard";

const INITIAL_COUNT = 12;

type Props = {
  products: Array<Product & { category: Category }>;
  emptyTitle?: string;
  emptyBody?: string;
  emptyHref?: string;
  emptyLinkLabel?: string;
  className?: string;
};

/** The tool grid plus its empty state, shared by /tools, the facet routes and category pages. */
export function ProductGrid({
  products,
  emptyTitle = "Nothing here yet.",
  emptyBody = "Try a broader search, or browse the full directory.",
  emptyHref = "/tools",
  emptyLinkLabel = "Browse all tools",
  className,
}: Props) {
  const [visible, setVisible] = useState(INITIAL_COUNT);

  if (products.length === 0) {
    return (
      <div className={`rounded-[var(--radius-surface)] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] px-6 py-12 sm:px-10 ${className ?? ""}`}>
        <p className="eyebrow">No matches</p>
        <h2 className="sub-heading mt-3">{emptyTitle}</h2>
        <p className="mt-3 max-w-xl leading-7 text-[var(--muted)]">{emptyBody}</p>
        <Link href={emptyHref} className="button-secondary mt-6">{emptyLinkLabel}</Link>
      </div>
    );
  }

  const shown = products.slice(0, visible);
  const remaining = products.length - visible;

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      {remaining > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + INITIAL_COUNT)}
            className="button-secondary"
          >
            Load more <span className="ml-1 text-[var(--muted)]">({remaining} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
}
