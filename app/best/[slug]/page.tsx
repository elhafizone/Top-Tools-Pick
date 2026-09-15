import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { ProductRow } from "@/components/product/ProductRow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ctaSubline } from "@/lib/affiliate/cta";
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

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
      {itemListJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(itemListJsonLd)} />}

      <section className="band">
        <div className="shell py-8 sm:py-12">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Best picks", href: "/best" }, { name: list.title }]} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow">Ranked shortlist</p>
              <h1 className="section-heading mt-3 max-w-3xl">{list.title}</h1>
              {list.description && <p className="lede mt-5 max-w-2xl">{list.description}</p>}
              {list.category && (
                <p className="mt-5 text-sm text-[var(--muted)]">
                  Part of <Link href={`/categories/${list.category.slug}`} className="editorial-link font-semibold text-[var(--ink)]">{list.category.name}</Link>
                </p>
              )}
            </div>

            {/* The contents list doubles as the answer for anyone who only wants the
                names: rank, tool and award slot, before a word of prose. */}
            {list.items.length > 0 && (
              <nav aria-label="The picks" className="panel panel-raised p-5">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">The picks</p>
                <ol className="mt-3 rule-list">
                  {list.items.map((item) => (
                    <li key={item.id} className="py-2.5">
                      <a href={`#pick-${item.rank}`} className="flex items-baseline gap-3 text-sm hover:text-[var(--accent-deep)]">
                        <span className="w-4 shrink-0 font-bold text-[var(--accent-deep)]">{item.rank}</span>
                        <span className="min-w-0">
                          <span className="font-semibold text-[var(--ink)]">{item.product.name}</span>
                          {item.award && <span className="ml-1.5 text-[var(--muted)]">— {item.award}</span>}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>

          <div className="mt-8 max-w-2xl"><Disclosure /></div>
        </div>
      </section>

      <div className="shell py-12 sm:py-16">
        {list.items.length ? (
          <ol className="rule-list border-y border-[var(--line)]">
            {list.items.map((item) => (
              <li key={item.id} id={`pick-${item.rank}`} className="scroll-mt-24">
                <ProductRow
                  product={item.product}
                  headingLevel="h2"
                  rank={item.rank}
                  award={item.award}
                  reason={item.rationale ? { label: "Why it ranks here:", text: item.rationale } : null}
                  entryPriceLabel={ctaSubline(item.product.pricingPlans)}
                  action={<AffiliateCta product={item.product} placement="best-list" className="w-full" />}
                />
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-[var(--radius-surface)] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] p-8 text-[var(--muted)]">
            <p>This collection has no published items yet.</p>
            <Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Browse tools</Link>
          </div>
        )}

        {list.category && list.items.length > 0 && (
          <div className="mt-12 flex flex-col gap-5 border-t-2 border-[var(--accent)] pt-7 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <div>
              <p className="eyebrow">Narrow it down</p>
              <h2 className="section-heading mt-3">Put your finalists side by side.</h2>
            </div>
            <Link href={`/compare?category=${encodeURIComponent(list.category.slug)}`} className="button-primary shrink-0">
              Compare {list.category.name}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
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
