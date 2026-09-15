import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductRow } from "@/components/product/ProductRow";
import { SearchForm } from "@/components/search/SearchForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ctaSubline } from "@/lib/affiliate/cta";
import { breadcrumbJsonLd, buildMetadata, itemListJsonLd, jsonLd, siteUrl } from "@/lib/seo";
import { getArticlesByTopic } from "@/lib/articles";
import { getCategoryAwards, getProductsByCategory } from "@/lib/products";
import { categoryToolsLabel } from "@/lib/text";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = await prisma.category.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { id: true, name: true, slug: true, description: true },
  });
  if (!category) notFound();

  const [products, awards, comparisons] = await Promise.all([
    getProductsByCategory(category.slug),
    getCategoryAwards(category.slug),
    getArticlesByTopic("comparisons", 3),
  ]);

  const awardItems = awards?.items ?? [];
  const freeOptions = products.filter((product) => product.hasFreePlan).length;
  const trialOptions = products.filter((product) => product.hasFreeTrial).length;
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: category.name, path: `/categories/${category.slug}` },
  ]);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />

      {/* Category introduction: what this is, how big the field is, and the two ways
          into it - read our picks, or search within the category. */}
      <section className="band">
        <div className="shell py-8 sm:py-12">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Categories", href: "/categories" }, { name: category.name }]} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow">Buying guide</p>
              <h1 className="section-heading mt-3 max-w-3xl">Best {categoryToolsLabel(category.name)}</h1>
              {category.description && <p className="lede mt-5 max-w-2xl">{category.description}</p>}
              <div className="mt-7 flex flex-wrap gap-3">
                {awardItems.length > 0 && <a href="#our-picks" className="button-primary">See our picks</a>}
                {products.length >= 2 && (
                  <Link href={`/compare?category=${encodeURIComponent(category.slug)}`} className="button-secondary">
                    Compare {category.name}
                  </Link>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-3 gap-4 border-t border-[var(--line)] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <Stat value={products.length} label={products.length === 1 ? "tool reviewed" : "tools reviewed"} />
              <Stat value={freeOptions} label="with a free plan" />
              <Stat value={trialOptions} label="with a free trial" />
            </dl>
          </div>
        </div>
      </section>

      {/* Award slots lead the page: they answer "which one for me?" before the grid
          answers "what exists?". Curated only, so the block hides when nothing is set. */}
      {awardItems.length > 0 && awards && (
        <section id="our-picks" className="shell scroll-mt-24 py-14 sm:py-20">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={jsonLd(itemListJsonLd(`Best ${categoryToolsLabel(category.name)}`, awardItems.map((item) => ({ name: item.product.name, path: `/tools/${item.product.slug}` }))))}
          />
          <SectionHeader
            eyebrow="Our picks"
            title="Our top picks"
            intro="Each slot is assigned by an editor, with the reasoning written next to it. Nobody can buy a position."
            href={`/best/${awards.slug}`}
            linkLabel="See the full ranking"
          />

          <div className="mt-6 rule-list border-b border-[var(--line)]">
            {awardItems.map((item, index) => (
              <ProductRow
                key={item.id}
                product={item.product}
                rank={index + 1}
                award={item.award}
                reason={item.rationale ? { label: "Why it wins this slot:", text: item.rationale } : null}
                entryPriceLabel={ctaSubline(item.product.pricingPlans)}
                action={<AffiliateCta product={item.product} placement="category-award" className="w-full" />}
              />
            ))}
          </div>

          <div className="mt-6"><Disclosure /></div>
        </section>
      )}

      {/* The full field, as a browsable grid rather than a second ranking. */}
      <section className="band-sunken">
        <div className="shell py-14 sm:py-20">
          <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="min-w-0">
              <p className="eyebrow">Everything in this category</p>
              <h2 className="section-heading mt-3">All {categoryToolsLabel(category.name)}</h2>
            </div>
            <div className="w-full lg:max-w-sm">
              {/* The same directory search, pre-scoped to this category. */}
              <SearchForm
                id="category-search"
                label={`Search within ${category.name}`}
                placeholder={`Search ${category.name}`}
                scope={{ category: category.slug }}
              />
            </div>
          </div>

          <ProductGrid
            products={products}
            className="mt-8"
            emptyTitle="No published tools here yet."
            emptyBody="This category is published, but its shortlist is still being edited."
            emptyHref="/categories"
            emptyLinkLabel="Explore other categories"
          />
        </div>
      </section>

      {comparisons.length > 0 && (
        <section className="shell py-14 sm:py-20">
          <SectionHeader eyebrow="Head to head" title="Written comparisons" href="/comparisons" linkLabel="All comparisons" />
          <ul className="mt-6 rule-list border-b border-[var(--line)]">
            {comparisons.map((article) => (
              <li key={article.id}>
                <Link href={`/articles/${article.slug}`} className="group block py-5">
                  <span className="text-lg font-bold tracking-[-0.02em] group-hover:text-[var(--accent-deep)]">{article.title}</span>
                  {article.excerpt && <span className="mt-1 block max-w-2xl text-sm leading-6 text-[var(--muted)]">{article.excerpt}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <strong className="block text-2xl font-bold tracking-[-0.03em] text-[var(--ink)]">{value}</strong>
        <span className="mt-1 block text-[0.68rem] uppercase leading-4 tracking-[0.1em] text-[var(--muted)]" aria-hidden="true">{label}</span>
      </dd>
    </div>
  );
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
