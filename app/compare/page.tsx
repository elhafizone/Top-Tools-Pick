import type { Metadata } from "next";
import Link from "next/link";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { ProductPicker } from "@/components/compare/ProductPicker";
import { RuledGrid } from "@/components/layout/RuledGrid";
import { getArticlesByTopic } from "@/lib/articles";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { safeHostname } from "@/lib/affiliate/links";
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
    <section className="shell py-20 sm:py-28">
      <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1">
        <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
        <span aria-hidden="true">/</span>
        {category ? <Link href="/compare" className="hover:text-[var(--ink)]">Compare</Link> : <span className="text-[var(--ink)]">Compare</span>}
        {category && <><span aria-hidden="true">/</span><span className="text-[var(--ink)]">{category.name}</span></>}
      </nav>

      <header className="mt-10 max-w-3xl">
        <p className="eyebrow">Build your own comparison</p>
        <h1 className="section-heading mt-5">{hasResults ? `${category!.name} compared` : "Compare tools side by side."}</h1>
        {!hasResults && (
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Start with the category you are shopping in, then put {MIN_COMPARE}&ndash;{MAX_COMPARE} tools next to each other. Comparisons stay inside one category so the columns actually line up.
          </p>
        )}
      </header>

      {!category ? (
        <CategoryStep categories={categories} invalid={Boolean(categorySlug)} />
      ) : hasResults ? (
        /*
         * Results first. Submitting the picker is a GET, which drops any fragment, so
         * the reliable way to land people on their comparison is to put it at the top
         * and demote the picker to an "adjust" step underneath. No JS, no scroll hack.
         */
        <>
          <ComparisonTable products={products} />

          <div className="mt-16 border-t border-[var(--line)] pt-7">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="eyebrow">Adjust your selection</p>
                <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em]">Swap a tool in or out</h2>
              </div>
              <Link href="/compare" className="editorial-link text-sm font-semibold">Change category &#8599;</Link>
            </div>
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
          <div className="mt-12 flex flex-wrap items-baseline justify-between gap-4 border-t border-[var(--line)] pt-7">
            <div>
              <p className="eyebrow">Step 2 &mdash; choose tools</p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em]">{category.name}</h2>
            </div>
            <Link href="/compare" className="editorial-link text-sm font-semibold">Change category &#8599;</Link>
          </div>

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

      {/* The indexable counterpart: written comparisons live as articles. */}
      {comparisonArticles.length > 0 && (
        <aside className="mt-16 border-t-2 border-[var(--accent)] pt-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Written comparisons</p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em]">Want our verdict instead?</h2>
            </div>
            <Link href="/comparisons" className="editorial-link text-sm font-semibold">All comparisons &#8599;</Link>
          </div>
          <ul className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {comparisonArticles.map((article) => (
              <li key={article.id} className="py-5">
                <Link href={`/articles/${article.slug}`} className="group block">
                  <span className="text-lg font-bold tracking-[-0.03em] group-hover:text-[var(--accent-deep)]">{article.title}</span>
                  {article.excerpt && <span className="mt-1 block max-w-2xl text-sm leading-6 text-[var(--muted)]">{article.excerpt}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </section>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <p role="status" className="mt-8 border-l-2 border-[var(--accent)] bg-[var(--blue-wash)] px-5 py-4 text-sm font-semibold text-[var(--accent-deep)]">{children}</p>;
}

function CategoryStep({ categories, invalid }: { categories: Awaited<ReturnType<typeof getComparableCategories>>; invalid: boolean }) {
  if (!categories.length) {
    return (
      <div className="mt-12 border border-dashed border-[var(--line)] p-8 text-[var(--muted)]">
        <p>No category has {MIN_COMPARE} or more published tools yet, so there is nothing to compare.</p>
        <Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Browse all tools &#8599;</Link>
      </div>
    );
  }
  return (
    <>
      <div className="mt-12 border-t border-[var(--line)] pt-7"><p className="eyebrow">Step 1 &mdash; choose a category</p></div>
      {invalid && <Notice>That category is not available for comparison. Pick one below.</Notice>}
      <RuledGrid className="mt-8" columns="sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/compare?category=${encodeURIComponent(category.slug)}`}
            className="ruled-cell group"
          >
            <span className="text-xs font-bold tracking-[0.16em] text-[var(--accent)]">{category._count.products} tools</span>
            <h3 className="mt-4 text-2xl font-bold tracking-[-0.04em] group-hover:text-[var(--accent-deep)]">{category.name}</h3>
            {category.description && <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{category.description}</p>}
            <span className="mt-7 block text-sm font-semibold">Compare in {category.name} &#8599;</span>
          </Link>
        ))}
      </RuledGrid>
    </>
  );
}

type ComparedProduct = Awaited<ReturnType<typeof getProductsForComparison>>[number];

const sentence = (value: string | null) => (value && value.trim() ? value : "—");
const list = (values: string[]) => (values.length ? values.join(", ") : "—");

function ComparisonTable({ products }: { products: ComparedProduct[] }) {
  const rows: Array<{ label: string; render: (product: ComparedProduct) => React.ReactNode }> = [
    { label: "Summary", render: (p) => p.shortDescription },
    { label: "Rating", render: (p) => `${Number(p.rating).toFixed(1)} / 5` },
    { label: "Editorial score", render: (p) => `${p.editorialScore} / 100` },
    { label: "Pricing model", render: (p) => <span className="capitalize">{p.pricingModel.replaceAll("_", " ").toLowerCase()}</span> },
    { label: "Free plan", render: (p) => (p.hasFreePlan ? "Yes" : "No") },
    { label: "Free trial", render: (p) => (p.hasFreeTrial ? "Yes" : "No") },
    { label: "Entry plan", render: (p) => sentence(p.pricingPlans[0]?.priceLabel ?? null) },
    { label: "Best for", render: (p) => sentence(p.bestFor) },
    { label: "Strengths", render: (p) => sentence(p.pros) },
    { label: "Trade-offs", render: (p) => sentence(p.cons) },
    { label: "Platforms", render: (p) => list(p.platforms.map((item) => item.platform.name)) },
    { label: "Use cases", render: (p) => list(p.useCases.map((item) => item.useCase.name)) },
    { label: "Built for", render: (p) => list(p.audiences.map((item) => item.audience.name)) },
    { label: "Website", render: (p) => safeHostname(p.websiteUrl) ?? "—" },
  ];

  const names = products.map((product) => product.name);

  return (
    <section aria-labelledby="comparison-heading" className="mt-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-[var(--accent)] pt-7">
        <h2 id="comparison-heading" className="text-2xl font-bold tracking-[-0.04em]">{names.join(" vs ")}</h2>
        <p className="text-sm text-[var(--muted)]">{products.length} tools &middot; {products[0].category.name}</p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
          <caption className="sr-only">Feature comparison of {names.join(", ")}</caption>
          <thead>
            <tr>
              <th scope="col" className="w-40 border-b border-[var(--line)] px-4 py-5 align-bottom text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Attribute</th>
              {products.map((product) => (
                <th key={product.slug} scope="col" className="border-b border-l border-[var(--line)] px-5 py-5 align-bottom">
                  <Link href={`/tools/${product.slug}`} className="text-xl font-bold tracking-[-0.03em] hover:text-[var(--accent-deep)]">{product.name}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="align-top">
                <th scope="row" className="border-b border-[var(--line)] px-4 py-4 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">{row.label}</th>
                {products.map((product) => (
                  <td key={product.slug} className="border-b border-l border-[var(--line)] px-5 py-4 leading-6">{row.render(product)}</td>
                ))}
              </tr>
            ))}
            <tr className="align-top">
              <th scope="row" className="px-4 py-6 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Visit</th>
              {/* Same resolution and wording as every other CTA: the outbound button
                  here is the affiliate link, routed through /go like the rest. */}
              {products.map((product) => (
                <td key={product.slug} className="border-l border-[var(--line)] px-5 py-6">
                  <div className="flex flex-col gap-2">
                    <AffiliateCta product={product} placement="compare-table" />
                    <Link href={`/tools/${product.slug}`} className="button-secondary text-center">Read review</Link>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8"><Disclosure /></div>
    </section>
  );
}
