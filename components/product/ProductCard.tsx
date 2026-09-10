import Link from "next/link";
import type { Product, Category } from "@prisma/client";

type ProductWithCategory = Product & { category: Category };

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const pricing = product.pricingModel.replaceAll("_", " ").toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase());
  return <article className="surface group flex h-full min-w-0 flex-col p-6 transition hover:-translate-y-1 hover:border-[#9bc7ff] hover:shadow-[0_12px_30px_rgba(21,23,28,.07)] sm:p-7">
    <div className="flex items-start justify-between gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--blue-wash)] text-lg font-black text-[var(--accent)]" aria-hidden="true">{product.name.slice(0, 1)}</div><span className="tag shrink-0"><span aria-hidden="true">★</span>&nbsp; {Number(product.rating).toFixed(1)}</span></div>
    <p className="eyebrow mt-8 truncate">{product.category.name}</p>
    <h3 className="mt-2 break-words text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]"><Link href={`/tools/${product.slug}`} className="group-hover:text-[var(--accent-deep)]">{product.name}</Link></h3>
    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{pricing}</p>
    <p className="mt-4 flex-1 text-sm leading-7 text-[var(--muted)]">{product.shortDescription}</p>
    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-5"><p className="text-xs font-semibold text-[var(--muted)]">Score <span className="text-[var(--ink)]">{product.editorialScore}/100</span></p><Link href={`/tools/${product.slug}`} aria-label={`Read the editorial note about ${product.name}`} className="editorial-link text-sm font-semibold text-[var(--ink)]">Read note <span aria-hidden="true">↗</span></Link></div>
  </article>;
}
