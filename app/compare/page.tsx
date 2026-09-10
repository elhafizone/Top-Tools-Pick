import Link from "next/link";
import { getPublishedComparisons } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata("Tool comparisons | TopToolsPick", "Compare digital tools using editorial context, pricing, ratings, and direct links.", "/compare");

export default async function ComparisonsPage() {
  const comparisons = await getPublishedComparisons();
  return <section className="shell py-20 sm:py-28"><header className="max-w-3xl"><p className="eyebrow">Decision guides</p><h1 className="section-heading mt-5">Compare with context.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">The useful differences are rarely just a feature list. Read the trade-offs, then visit the tools themselves.</p></header>{comparisons.length ? <div className="mt-12 grid border-t border-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">{comparisons.map((comparison, index) => <Link key={comparison.id} href={`/compare/${comparison.slug}`} className="group border-b border-[var(--line)] py-7 pr-6 sm:nth-[even]:border-l sm:nth-[even]:pl-6 lg:nth-[3n+2]:border-l lg:nth-[3n+2]:pl-6 lg:nth-[3n]:border-l lg:nth-[3n]:pl-6"><span className="text-xs font-bold tracking-[0.16em] text-[var(--accent)]">0{index + 1}</span><h2 className="mt-5 text-2xl font-bold tracking-[-0.04em] group-hover:text-[var(--accent-deep)]">{comparison.title}</h2><p className="mt-3 text-sm text-[var(--muted)]">{comparison.productA.name} <span className="text-[var(--accent)]">vs</span> {comparison.productB.name}</p><span className="mt-8 block text-sm font-semibold">Read comparison ↗</span></Link>)}</div> : <p className="mt-10 border border-dashed border-[var(--line)] p-8 text-[var(--muted)]">No published comparisons yet.</p>}</section>;
}
