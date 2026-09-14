import Link from "next/link";
import type { Product, Category } from "@prisma/client";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import { truncate } from "@/lib/text";

type ProductWithCategory = Product & { category: Category };

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const pricing = product.pricingModel.replaceAll("_", " ").toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase());
  return <article className="surface group flex h-full min-w-0 flex-col p-6 transition hover:-translate-y-1 hover:border-[#9bc7ff] hover:shadow-[0_12px_30px_rgba(21,23,28,.07)] sm:p-7">
    <div className="flex items-start justify-between gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--blue-wash)] text-lg font-black text-[var(--accent)]" aria-hidden="true">{product.name.slice(0, 1)}</div><span className="tag shrink-0"><span aria-hidden="true">★</span>&nbsp; {Number(product.rating).toFixed(1)}</span></div>
    <p className="eyebrow mt-8 truncate">{product.category.name}</p>
    <h3 className="mt-2 break-words text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]"><Link href={`/tools/${product.slug}`} className="group-hover:text-[var(--accent-deep)]">{product.name}</Link></h3>
    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{pricing}</p>
    <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{product.shortDescription}</p>
    {product.bestFor && <p className="mt-4 text-sm leading-6 text-[var(--ink)]"><span className="font-semibold">Best for:</span> <span className="text-[var(--muted)]">{truncate(product.bestFor, 90)}</span></p>}
    <div className="flex-1" />
    <DecisionBadges hasFreePlan={product.hasFreePlan} hasFreeTrial={product.hasFreeTrial} pricingModel={product.pricingModel} className="mt-5" />
    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-5"><p className="text-xs font-semibold text-[var(--muted)]">Score <span className="text-[var(--ink)]">{product.editorialScore}/100</span></p><Link href={`/tools/${product.slug}`} aria-label={`See whether ${product.name} fits your needs`} className="editorial-link text-sm font-semibold text-[var(--ink)]">See if it fits <span aria-hidden="true">↗</span></Link></div>
  </article>;
}
