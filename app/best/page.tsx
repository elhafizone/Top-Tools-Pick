import Link from "next/link";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { RuledGrid } from "@/components/layout/RuledGrid";
import { getPublishedEditorialLists } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata("Best picks", "Curated shortlists of the digital tools worth your time, ranked with editorial context.", "/best");

export default async function EditorialListsPage() {
  const lists = await getPublishedEditorialLists();
  return <section className="shell py-20 sm:py-28"><header className="max-w-3xl"><p className="eyebrow">Curated collections</p><h1 className="section-heading mt-5">Shortlists worth trusting.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">Every list is ranked by hand, with the reasoning written down. No sponsored placements, no filler entries.</p><div className="mt-6"><Disclosure /></div></header>{lists.length ? <RuledGrid className="mt-12" columns="sm:grid-cols-2 lg:grid-cols-3">{lists.map((list, index) => <Link key={list.slug} href={`/best/${list.slug}`} className="ruled-cell group"><span className="text-xs font-bold tracking-[0.16em] text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span><h2 className="mt-5 text-2xl font-bold tracking-[-0.04em] group-hover:text-[var(--accent-deep)]">{list.title}</h2>{list.description && <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{list.description}</p>}<span className="mt-8 block text-sm font-semibold">Read the list ↗</span></Link>)}</RuledGrid> : <div className="mt-12 border border-dashed border-[var(--line)] p-8 text-[var(--muted)]"><p>Curated lists are being prepared.</p><Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Browse all tools ↗</Link></div>}</section>;
}
