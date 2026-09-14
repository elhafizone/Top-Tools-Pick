import Link from "next/link";
import type { Product, Category } from "@prisma/client";
import { ProductCard } from "@/components/product/ProductCard";

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
  if (products.length === 0) {
    return (
      <div className={`border border-dashed border-[var(--line)] bg-white px-6 py-12 sm:px-10 ${className ?? ""}`}>
        <p className="eyebrow">No matches</p>
        <h2 className="mt-4 text-2xl font-bold tracking-[-0.04em]">{emptyTitle}</h2>
        <p className="mt-3 max-w-xl leading-7 text-[var(--muted)]">{emptyBody}</p>
        <Link href={emptyHref} className="button-secondary mt-7">{emptyLinkLabel}</Link>
      </div>
    );
  }

  return (
    <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className ?? ""}`}>
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
