import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import { getEditorialListBySlug } from "@/lib/products";
import { breadcrumbJsonLd, buildMetadata, editorialListMetadata, jsonLd, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function EditorialListPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const list = await getEditorialListBySlug(slug);
  if (!list) notFound();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Best picks", path: "/best" },
    { name: list.title, path: `/best/${slug}` },
  ]);

  // A ranked list is an ItemList - marking it up was missing despite rank + rationale
  // already being stored per item.
  const itemListJsonLd = list.items.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: list.title,
    description: list.description,
    numberOfItems: list.items.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: list.items.map((item) => ({
      "@type": "ListItem",
      position: item.rank,
      name: item.product.name,
      url: new URL(`/tools/${item.product.slug}`, siteUrl).toString(),
    })),
  } : null;

  return <article className="shell py-20 sm:py-28">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    {itemListJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(itemListJsonLd)} />}

    <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1">
      <Link href="/" className="hover:text-[var(--ink)]">Home</Link><span aria-hidden="true">/</span>
      <Link href="/best" className="hover:text-[var(--ink)]">Best picks</Link><span aria-hidden="true">/</span>
      <span className="text-[var(--ink)]">{list.title}</span>
    </nav>

    <header className="mt-14 max-w-4xl border-b border-[var(--line)] pb-12">
      <p className="eyebrow">Curated collection</p>
      <h1 className="section-heading mt-5">{list.title}</h1>
      {list.description && <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{list.description}</p>}
      {list.category && (
        <p className="mt-5 text-sm text-[var(--muted)]">
          Part of <Link href={`/categories/${list.category.slug}`} className="editorial-link font-semibold text-[var(--ink)]">{list.category.name}</Link>
        </p>
      )}
      <div className="mt-6"><Disclosure /></div>
    </header>

    {list.items.length ? (
      <ol className="mt-12 divide-y divide-[var(--line)] border-b border-[var(--line)]">
        {list.items.map((item) => (
          <li key={item.id} className="grid gap-6 py-9 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-12">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--accent)] text-sm font-bold text-white">{item.rank}</span>
                {/* The award slot is the headline claim, so it leads. Curated only. */}
                {item.award && <span className="tag border-[var(--accent)] font-bold text-[var(--accent-deep)]">{item.award}</span>}
                <Link href={`/categories/${item.product.category.slug}`} className="tag hover:border-[var(--accent)]">{item.product.category.name}</Link>
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em]">
                <Link href={`/tools/${item.product.slug}`} className="hover:text-[var(--accent-deep)]">{item.product.name}</Link>
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{item.product.shortDescription}</p>
              {item.rationale && (
                <p className="mt-4 max-w-2xl border-l-2 border-[var(--accent)] pl-5 leading-7 text-[var(--ink)]">
                  <span className="font-semibold">Why it ranks here:</span> <span className="text-[var(--muted)]">{item.rationale}</span>
                </p>
              )}
              {item.product.bestFor && (
                <p className="mt-4 max-w-2xl leading-7"><span className="font-semibold">Best for:</span> <span className="text-[var(--muted)]">{item.product.bestFor}</span></p>
              )}
              <DecisionBadges
                hasFreePlan={item.product.hasFreePlan}
                hasFreeTrial={item.product.hasFreeTrial}
                pricingModel={item.product.pricingModel}
                className="mt-5"
              />
            </div>

            {/* The conversion surface this page was missing entirely. */}
            <div className="flex flex-col gap-3 lg:pt-2">
              <AffiliateCta product={item.product} placement="best-list" className="w-full text-center" />
              <Link href={`/tools/${item.product.slug}`} className="button-secondary w-full text-center">Read review</Link>
              <p className="text-xs leading-5 text-[var(--muted)]">Editorial score {item.product.editorialScore}/100</p>
            </div>
          </li>
        ))}
      </ol>
    ) : (
      <div className="mt-12 border border-dashed border-[var(--line)] p-8 text-[var(--muted)]">
        <p>This collection has no published items yet.</p>
        <Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Browse tools ↗</Link>
      </div>
    )}
  </article>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const list = await getEditorialListBySlug(slug);
  if (!list) return editorialListMetadata("Editorial list not found", "The requested editorial list could not be found.", slug);
  // prisma/seed.ts stores seoTitle values that already end in "| TopToolsPick", so a
  // stored title must bypass the root layout's template or the suffix is doubled.
  const storedTitle = list.seoTitle?.trim();
  return buildMetadata(
    storedTitle ?? list.title,
    list.seoDescription ?? list.description,
    `/best/${slug}`,
    { absolute: Boolean(storedTitle) },
  );
}
