import Link from "next/link";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { RuledGrid } from "@/components/layout/RuledGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getPublishedEditorialLists } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata("Best picks", "Curated shortlists of the digital tools worth your time, ranked with editorial context.", "/best");

export default async function EditorialListsPage() {
  const lists = await getPublishedEditorialLists();

  return (
    <div>
      <section className="band">
        <div className="shell py-8 sm:py-12">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Best picks" }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow">Buying guides</p>
              <h1 className="section-heading mt-3 max-w-3xl">Shortlists worth trusting.</h1>
            </div>
            <div>
              <p className="lede">Every list is ranked by hand, with the reasoning written down. No sponsored placements, no filler entries.</p>
              <div className="mt-5"><Disclosure /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-12 sm:py-16">
        {lists.length ? (
          <RuledGrid columns="sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list, index) => (
              <Link key={list.slug} href={`/best/${list.slug}`} className="ruled-cell group flex flex-col">
                <span className="text-xs font-bold tracking-[0.14em] text-[var(--accent-deep)]">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="mt-4 text-xl font-bold tracking-[-0.025em] group-hover:text-[var(--accent-deep)]">{list.title}</h2>
                {list.description && <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{list.description}</p>}
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-deep)]">
                  Read the list <span aria-hidden="true" className="hover-shift">&#8594;</span>
                </span>
              </Link>
            ))}
          </RuledGrid>
        ) : (
          <div className="rounded-[var(--radius-surface)] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] p-8 text-[var(--muted)]">
            <p>Curated lists are being prepared.</p>
            <Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Browse all tools</Link>
          </div>
        )}
      </section>
    </div>
  );
}
