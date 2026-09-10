import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts, getPublishedCategories } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import { PricingModel } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata("Explore digital tools | TopToolsPick", "Browse our curated directory of software, AI tools and digital products.", "/tools");

const pricingModels = new Set(Object.values(PricingModel));

type ToolsSearchParams = { q?: string; category?: string; pricing?: string; freePlan?: string; freeTrial?: string };

export default async function ToolsPage({ searchParams }: { searchParams: Promise<ToolsSearchParams> }) {
  const params = await searchParams;
  const pricingModel = pricingModels.has(params.pricing as PricingModel) ? params.pricing as PricingModel : undefined;
  const freePlan = params.freePlan === "true" ? true : undefined;
  const freeTrial = params.freeTrial === "true" ? true : undefined;
  const [products, categories] = await Promise.all([
    getProducts({ query: params.q?.trim(), category: params.category, pricingModel, freePlan, freeTrial }),
    getPublishedCategories(),
  ]);
  const hasFilters = Boolean(params.q || params.category || pricingModel || freePlan || freeTrial);

  return <section className="shell py-20 sm:py-28">
    <header className="max-w-3xl">
      <p className="eyebrow">Curated directory</p>
      <h1 className="section-heading mt-5">Find the right tool for the work.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Search a considered catalog of software, AI tools, and digital products. Start broad, then narrow by what matters to you.</p>
    </header>

    <form action="/tools" className="mt-12 border-y border-[var(--line)] bg-white py-5 sm:mt-16 sm:py-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(14rem,1.4fr)_1fr_1fr_auto] lg:items-end">
        <label className="block text-sm font-semibold">
          Search
          <input name="q" defaultValue={params.q} placeholder="Search by name or use" aria-label="Search tools by name or description" className="mt-2 block min-h-12 w-full border border-[var(--line)] bg-[var(--background)] px-4 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[#2180f8]/15" />
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

    {products.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState hasQuery={Boolean(params.q)} />}
  </section>;
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return <div className="mt-8 border border-dashed border-[var(--line)] bg-white px-6 py-12 sm:px-10">
    <p className="eyebrow">No matches</p>
    <h2 className="mt-4 text-2xl font-bold tracking-[-0.04em]">Nothing fits those filters yet.</h2>
    <p className="mt-3 max-w-xl leading-7 text-[var(--muted)]">{hasQuery ? "Try a broader name or description, or clear the filters to browse the full directory." : "Clear one or more filters to see more of the curated directory."}</p>
    <Link href="/tools" className="button-secondary mt-7">Clear filters</Link>
  </div>;
}
