import type { Metadata } from "next";
import Link from "next/link";
import { ComparisonView } from "@/components/compare/ComparisonView";
import { ProductPicker } from "@/components/compare/ProductPicker";
import { RuledGrid } from "@/components/layout/RuledGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getArticlesByTopic } from "@/lib/articles";
import {
  MAX_COMPARE,
  MIN_COMPARE,
  getCategoryWithComparableProducts,
  getComparableCategories,
  getProductsForComparison,
} from "@/lib/products";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Search = { category?: string | string[]; tools?: string | string[] };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
const many = (value: string | string[] | undefined) => (Array.isArray(value) ? value : value ? [value] : []);

/** Generated combinations stay shareable but unindexed: they are thin, near-duplicate pages. */
export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const params = await searchParams;
  const base = buildMetadata(
    "Compare tools side by side",
    `Pick a category, then compare ${MIN_COMPARE} to ${MAX_COMPARE} tools on pricing, ratings, platforms and editorial verdicts.`,
    "/compare",
  );
  if (!first(params.category)) return base;
  return { ...base, robots: { index: false, follow: true }, alternates: { canonical: new URL("/compare", siteUrl).toString() } };
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const categorySlug = first(params.category);
  const requested = [...new Set(many(params.tools))].filter(Boolean);

  const category = categorySlug ? await getCategoryWithComparableProducts(categorySlug) : null;
  const categories = category ? [] : await getComparableCategories();

  const valid = category ? requested.filter((slug) => category.products.some((product) => product.slug === slug)) : [];
  const tooMany = valid.length > MAX_COMPARE;
  const products = category && valid.length >= MIN_COMPARE && !tooMany ? await getProductsForComparison(category.slug, valid) : [];
  const hasResults = products.length >= MIN_COMPARE;
  const comparisonArticles = await getArticlesByTopic("comparisons", 4);

  return (
    <div>
      <section className="band">
        <div className="shell py-8 sm:py-12">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Compare", href: category ? "/compare" : undefined },
              ...(category ? [{ name: category.name }] : []),
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <p className="eyebrow">Build your own comparison</p>
            <h1 className="section-heading mt-3">{hasResults ? `${category!.name} compared` : "Compare tools side by side."}</h1>
            <p className="lede mt-5">
              {hasResults
                ? "Every value below is recorded against the tool in our own data, so the columns line up and nothing is invented to fill a gap."
                : `Start with the category you are shopping in, then put ${MIN_COMPARE}-${MAX_COMPARE} tools next to each other. Comparisons stay inside one category so the columns actually line up.`}
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-12 sm:py-16">
        {!category ? (
          <CategoryStep categories={categories} invalid={Boolean(categorySlug)} />
        ) : hasResults ? (
          /*
           * Results first. Submitting the picker is a GET, which drops any fragment, so
           * the reliable way to land people on their comparison is to put it at the top
           * and demote the picker to an "adjust" step underneath. No JS, no scroll hack.
           */
          <>
            <ComparisonView products={products} />

            <div className="mt-16">
              <SectionHeader
                eyebrow="Adjust your selection"
                title="Swap a tool in or out"
                href="/compare"
                linkLabel="Change category"
              />
              <ProductPicker
                categorySlug={category.slug}
                options={category.products}
                initial={valid}
                min={MIN_COMPARE}
                max={MAX_COMPARE}
              />
            </div>
          </>
        ) : (
          <>
            <SectionHeader
              eyebrow={`Step 2 — choose ${MIN_COMPARE}-${MAX_COMPARE} tools`}
              title={category.name}
              href="/compare"
              linkLabel="Change category"
            />

            {tooMany && <Notice>You picked {valid.length} tools. Compare at most {MAX_COMPARE} at a time.</Notice>}
            {!tooMany && requested.length > 0 && valid.length < MIN_COMPARE && (
              <Notice>Select at least {MIN_COMPARE} tools from {category.name} to build a comparison.</Notice>
            )}

            <ProductPicker
              categorySlug={category.slug}
              options={category.products}
              initial={tooMany ? [] : valid}
              min={MIN_COMPARE}
              max={MAX_COMPARE}
            />
          </>
        )}
      </section>

      {/* The indexable counterpart: written comparisons live as articles. */}
      {comparisonArticles.length > 0 && (
        <section className="band-sunken">
          <div className="shell py-14 sm:py-16">
            <SectionHeader
              eyebrow="Written comparisons"
              title="Want our verdict instead?"
              href="/comparisons"
              linkLabel="All comparisons"
            />
            <ul className="mt-6 rule-list border-b border-[var(--line)]">
              {comparisonArticles.map((article) => (
                <li key={article.id}>
                  <Link href={`/articles/${article.slug}`} className="group block py-5">
                    <span className="text-lg font-bold tracking-[-0.02em] group-hover:text-[var(--accent-deep)]">{article.title}</span>
                    {article.excerpt && <span className="mt-1 block max-w-2xl text-sm leading-6 text-[var(--muted)]">{article.excerpt}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="mt-8 rounded-[var(--radius-control)] border border-[var(--accent-line)] bg-[var(--accent-soft)] px-5 py-4 text-sm font-semibold text-[var(--accent-deep)]">
      {children}
    </p>
  );
}

function CategoryStep({ categories, invalid }: { categories: Awaited<ReturnType<typeof getComparableCategories>>; invalid: boolean }) {
  if (!categories.length) {
    return (
      <div className="rounded-[var(--radius-surface)] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] p-8 text-[var(--muted)]">
        <p>No category has {MIN_COMPARE} or more published tools yet, so there is nothing to compare.</p>
        <Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Browse all tools</Link>
      </div>
    );
  }

  return (
    <>
      <SectionHeader eyebrow="Step 1" title="Choose a category" intro="Comparisons stay inside one category, so every column means the same thing." />
      {invalid && <Notice>That category is not available for comparison. Pick one below.</Notice>}
      <RuledGrid className="mt-8" columns="sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.slug} href={`/compare?category=${encodeURIComponent(category.slug)}`} className="ruled-cell group flex flex-col">
            <span className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{category._count.products} tools</span>
              <span className="text-[var(--accent)] hover-shift" aria-hidden="true">&#8594;</span>
            </span>
            <h3 className="mt-4 text-xl font-bold tracking-[-0.025em] group-hover:text-[var(--accent-deep)]">{category.name}</h3>
            {category.description && <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{category.description}</p>}
          </Link>
        ))}
      </RuledGrid>
    </>
  );
}
