import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getAudiences, getProducts, getPublishedCategories, getUseCases } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import { PricingModel } from "@prisma/client";

export const dynamic = "force-dynamic";

const pricingModels = new Set(Object.values(PricingModel));

type ToolsSearchParams = {
  q?: string;
  category?: string;
  pricing?: string;
  freePlan?: string;
  freeTrial?: string;
  useCase?: string;
  audience?: string;
};

/**
 * Filtered states are noindex/follow.
 *
 * Every filter combination was previously indexable, which is a duplicate-content
 * surface that multiplies with each new facet. The bare directory stays indexed and
 * links still flow through to the tool pages.
 */
export async function generateMetadata({ searchParams }: { searchParams: Promise<ToolsSearchParams> }): Promise<Metadata> {
  const params = await searchParams;
  const isFiltered = Boolean(params.q || params.category || params.pricing || params.freePlan || params.freeTrial || params.useCase || params.audience);
  return buildMetadata(
    "Explore digital tools",
    "Search a curated directory of software, AI tools and digital products by what you need them to do.",
    "/tools",
    isFiltered ? { robots: { index: false, follow: true } } : {},
  );
}

export default async function ToolsPage({ searchParams }: { searchParams: Promise<ToolsSearchParams> }) {
  const params = await searchParams;
  const pricingModel = pricingModels.has(params.pricing as PricingModel) ? params.pricing as PricingModel : undefined;
  const freePlan = params.freePlan === "true" ? true : undefined;
  const freeTrial = params.freeTrial === "true" ? true : undefined;

  const [products, categories, useCases, audiences] = await Promise.all([
    getProducts({
      query: params.q?.trim(),
      category: params.category,
      pricingModel,
      freePlan,
      freeTrial,
      useCase: params.useCase,
      audience: params.audience,
    }),
    getPublishedCategories(),
    getUseCases(),
    getAudiences(),
  ]);

  const hasFilters = Boolean(params.q || params.category || pricingModel || freePlan || freeTrial || params.useCase || params.audience);

  return <section className="shell py-20 sm:py-28">
    <header className="max-w-3xl">
      <p className="eyebrow">Curated directory</p>
      <h1 className="section-heading mt-5">Find the right tool for the work.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Start with what you need it to do. Search matches names, descriptions, use cases and audiences — not just tool names.</p>
    </header>

    {/* A finished panel, not an open band: border-y with no horizontal padding left the
        controls flush against the white edge, which read as a cut-off background. */}
    <form action="/tools" className="surface mt-12 p-5 sm:mt-16 sm:p-7">
      <div className="grid gap-4 lg:grid-cols-[minmax(14rem,1.4fr)_1fr_1fr_auto] lg:items-end">
        <label className="block text-sm font-semibold">
          Search
          <input name="q" defaultValue={params.q} placeholder="e.g. invoicing, project management" aria-label="Search tools by name, description or use case" className="mt-2 block min-h-12 w-full border border-[var(--line)] bg-[var(--background)] px-4 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[#2180f8]/15" />
        </label>
        <label className="block text-sm font-semibold">
          Category
          <select name="category" defaultValue={params.category ?? ""} className="mt-2 block min-h-12 w-full border border-[var(--line)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[#2180f8]/15">
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Pricing
          <select name="pricing" defaultValue={params.pricing ?? ""} className="mt-2 block min-h-12 w-full border border-[var(--line)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[#2180f8]/15">
            <option value="">All pricing</option>
            <option value="FREE">Free</option><option value="FREEMIUM">Freemium</option><option value="SUBSCRIPTION">Subscription</option>
            <option value="ONE_TIME">One-time</option><option value="LIFETIME">Lifetime</option><option value="USAGE_BASED">Usage-based</option><option value="CUSTOM">Custom</option>
          </select>
        </label>
        <button className="button-primary min-h-12 w-full lg:w-auto">Apply filters <span aria-hidden="true">↗</span></button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Use case
          <select name="useCase" defaultValue={params.useCase ?? ""} className="mt-2 block min-h-12 w-full border border-[var(--line)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--accent)]">
            <option value="">Any use case</option>
            {useCases.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Audience
          <select name="audience" defaultValue={params.audience ?? ""} className="mt-2 block min-h-12 w-full border border-[var(--line)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--accent)]">
            <option value="">Any audience</option>
            {audiences.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--muted)]">
        <label className="inline-flex items-center gap-2"><input type="checkbox" name="freePlan" value="true" defaultChecked={freePlan} className="h-4 w-4 accent-[#2180f8]" /> Has a free plan</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" name="freeTrial" value="true" defaultChecked={freeTrial} className="h-4 w-4 accent-[#2180f8]" /> Has a free trial</label>
        {hasFilters && <Link href="/tools" className="editorial-link font-semibold text-[var(--ink)]">Clear all filters</Link>}
      </div>
    </form>

    <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--line)] pb-4">
      <p className="text-sm font-semibold text-[var(--ink)]"><span className="text-[var(--accent-deep)]">{products.length}</span> {products.length === 1 ? "tool" : "tools"} found</p>
      {hasFilters && <p className="text-sm text-[var(--muted)]">Showing matches for your current filters</p>}
    </div>

    <ProductGrid
      products={products}
      className="mt-8"
      emptyTitle="Nothing fits those filters yet."
      emptyBody={params.q ? "Try a broader term, or clear the filters to browse the full directory." : "Clear one or more filters to see more of the curated directory."}
      emptyLinkLabel="Clear filters"
    />

    {/* Need-first entry points into the taxonomy landings. */}
    {(useCases.length > 0 || audiences.length > 0) && (
      <div className="mt-20 border-t border-[var(--line)] pt-10">
        <p className="eyebrow">Browse by need</p>
        {useCases.length > 0 && <>
          <h2 className="mt-4 text-xl font-bold tracking-[-0.03em]">By use case</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {useCases.map((item) => (
              <Link key={item.slug} href={`/tools/use-case/${item.slug}`} className="tag hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">{item.name} <span className="text-[var(--muted)]">{item._count.products}</span></Link>
            ))}
          </div>
        </>}
        {audiences.length > 0 && <>
          <h2 className="mt-8 text-xl font-bold tracking-[-0.03em]">By audience</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {audiences.map((item) => (
              <Link key={item.slug} href={`/tools/audience/${item.slug}`} className="tag hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">{item.name} <span className="text-[var(--muted)]">{item._count.products}</span></Link>
            ))}
          </div>
        </>}
      </div>
    )}
  </section>;
}
