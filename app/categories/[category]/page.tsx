import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import { ProductGrid } from "@/components/product/ProductGrid";
import { breadcrumbJsonLd, buildMetadata, itemListJsonLd, jsonLd, siteUrl } from "@/lib/seo";
import { getArticlesByTopic } from "@/lib/articles";
import { getCategoryAwards, getProductsByCategory } from "@/lib/products";
import { categoryToolsLabel } from "@/lib/text";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = await prisma.category.findFirst({ where: { slug, status: "PUBLISHED" }, select: { id: true, name: true, slug: true, description: true } });
  if (!category) notFound();
  const [products, awards, comparisons] = await Promise.all([
    getProductsByCategory(category.slug),
    getCategoryAwards(category.slug),
    getArticlesByTopic("comparisons", 3),
  ]);
  const awardItems = awards?.items ?? [];
  const breadcrumbs = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Categories", path: "/categories" }, { name: category.name, path: `/categories/${category.slug}` }]);

  return <article>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    <section className="border-b border-[var(--line)] bg-white">
      <div className="shell py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1"><Link href="/" className="hover:text-[var(--ink)]">Home</Link><span aria-hidden="true">/</span><Link href="/categories" className="hover:text-[var(--ink)]">Categories</Link><span aria-hidden="true">/</span><span className="text-[var(--ink)]">{category.name}</span></nav>
        <header className="mt-12 grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
          <div><p className="eyebrow">Category guide</p><h1 className="section-heading mt-5 max-w-4xl">{category.name}</h1>{category.description && <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{category.description}</p>}</div>
          <div className="border-l-2 border-[var(--accent)] pl-5"><strong className="block text-3xl tracking-[-0.05em]">{products.length}</strong><span className="metadata mt-1 block">published {products.length === 1 ? "tool" : "tools"} in this category</span></div>
        </header>
      </div>
    </section>
    {/* Award slots lead the page: they answer "which one for me?" before the grid
        answers "what exists?". Curated only, so the block hides when nothing is set. */}
    {awardItems.length > 0 && awards && (
      <section className="shell py-16 sm:py-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(itemListJsonLd(`Best ${categoryToolsLabel(category.name)}`, awardItems.map((item) => ({ name: item.product.name, path: `/tools/${item.product.slug}` }))))}
        />
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div>
            <p className="eyebrow">Our picks</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em]">Best {categoryToolsLabel(category.name)}</h2>
          </div>
          <Link href={`/best/${awards.slug}`} className="editorial-link text-sm font-semibold">See the full ranking ↗</Link>
        </div>
        <ul className="mt-8 divide-y divide-[var(--line)] border-b border-[var(--line)]">
          {awardItems.map((item) => (
            <li key={item.id} className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start lg:gap-12">
              <div className="min-w-0">
                <span className="tag border-[var(--accent)] font-bold text-[var(--accent-deep)]">{item.award}</span>
                <h3 className="mt-4 text-2xl font-bold tracking-[-0.04em]">
                  <Link href={`/tools/${item.product.slug}`} className="hover:text-[var(--accent-deep)]">{item.product.name}</Link>
                </h3>
                {item.rationale && <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{item.rationale}</p>}
                <DecisionBadges hasFreePlan={item.product.hasFreePlan} hasFreeTrial={item.product.hasFreeTrial} pricingModel={item.product.pricingModel} className="mt-4" />
              </div>
              <div className="flex flex-col gap-3 lg:pt-1">
                <AffiliateCta product={item.product} placement="category-award" className="w-full text-center" />
                <Link href={`/tools/${item.product.slug}`} className="button-secondary w-full text-center">Read review</Link>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6"><Disclosure /></div>
      </section>
    )}

    {/* No "how to choose" block: Category has no field for it, and reusing
        description would print the same sentence twice on one page. Add a dedicated
        column before reintroducing this section. */}

    <section className="shell py-16 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <p className="eyebrow">Everything in this category</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em]">All {categoryToolsLabel(category.name)}</h2>
        </div>
        <Link href={`/compare?category=${encodeURIComponent(category.slug)}`} className="editorial-link text-sm font-semibold">Compare them ↗</Link>
      </div>
      <ProductGrid
        products={products}
        className="mt-8"
        emptyTitle="No published tools here yet."
        emptyBody="This category is published, but its shortlist is still being edited."
        emptyHref="/categories"
        emptyLinkLabel="Explore other categories"
      />
    </section>

    {comparisons.length > 0 && (
      <section className="border-t border-[var(--line)]">
        <div className="shell py-16 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Head to head</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em]">Written comparisons</h2>
            </div>
            <Link href="/comparisons" className="editorial-link text-sm font-semibold">All comparisons ↗</Link>
          </div>
          <ul className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {comparisons.map((article) => (
              <li key={article.id} className="py-5">
                <Link href={`/articles/${article.slug}`} className="group block">
                  <span className="text-lg font-bold tracking-[-0.03em] group-hover:text-[var(--accent-deep)]">{article.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )}
  </article>;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await prisma.category.findFirst({ where: { slug, status: "PUBLISHED" }, select: { name: true, description: true, seoTitle: true, seoDescription: true } });
  if (!category) return buildMetadata("Category not found", "The requested category could not be found.", `/categories/${slug}`);
  // A stored seoTitle is used verbatim: some already end in "| TopToolsPick" and the
  // root layout's title template would otherwise repeat the suffix.
  const storedTitle = category.seoTitle?.trim();
  const title = storedTitle ?? categoryToolsLabel(category.name);
  const description = category.seoDescription ?? category.description ?? `Explore ${category.name} tools on TopToolsPick.`;
  const metadata = buildMetadata(title, description, `/categories/${slug}`, { absolute: Boolean(storedTitle) });
  return { ...metadata, openGraph: { title, description, url: new URL(`/categories/${slug}`, siteUrl).toString(), siteName: "TopToolsPick", type: "website" } };
}
