import type { Metadata } from "next";
import Link from "next/link";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { ProductPicker } from "@/components/compare/ProductPicker";
import { getBestAffiliateLink, safeHostname } from "@/lib/affiliate/links";
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
    "Compare tools side by side | TopToolsPick",
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
        <h1 className="section-heading mt-5">Compare tools side by side.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Start with the category you are shopping in, then put {MIN_COMPARE}&ndash;{MAX_COMPARE} tools next to each other. Comparisons stay inside one category so the columns actually line up.
        </p>
      </header>

      {!category ? (
        <CategoryStep categories={categories} invalid={Boolean(categorySlug)} />
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

          {products.length >= MIN_COMPARE && <ComparisonTable products={products} />}
        </>
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
      <div className="mt-8 grid border-t border-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/compare?category=${encodeURIComponent(category.slug)}`}
            className="group border-b border-[var(--line)] py-7 pr-6 sm:nth-[even]:border-l sm:nth-[even]:pl-6 lg:nth-[3n+2]:border-l lg:nth-[3n+2]:pl-6 lg:nth-[3n]:border-l lg:nth-[3n]:pl-6"
          >
            <span className="text-xs font-bold tracking-[0.16em] text-[var(--accent)]">{category._count.products} tools</span>
            <h3 className="mt-4 text-2xl font-bold tracking-[-0.04em] group-hover:text-[var(--accent-deep)]">{category.name}</h3>
            {category.description && <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{category.description}</p>}
            <span className="mt-7 block text-sm font-semibold">Compare in {category.name} &#8599;</span>
          </Link>
        ))}
      </div>
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
              {products.map((product) => {
                const ctaUrl = getBestAffiliateLink(product);
                return (
                  <td key={product.slug} className="border-l border-[var(--line)] px-5 py-6">
                    {ctaUrl ? (
                      <a href={ctaUrl} target="_blank" rel="nofollow sponsored noopener noreferrer" className="button-primary">
                        Visit {product.name} <span aria-hidden="true">&#8599;</span>
                      </a>
                    ) : (
                      <Link href={`/tools/${product.slug}`} className="button-secondary">Read profile</Link>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8"><Disclosure /></div>
    </section>
  );
}
