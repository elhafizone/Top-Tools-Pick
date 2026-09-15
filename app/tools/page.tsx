import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchForm } from "@/components/search/SearchForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAudiences, getProducts, getPublishedCategories, getUseCases, isSortOrder } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import { PricingModel } from "@prisma/client";

export const dynamic = "force-dynamic";

const pricingModels = new Set(Object.values(PricingModel));

const PRICING_OPTIONS = [
  { value: "FREE", label: "Free" },
  { value: "FREEMIUM", label: "Freemium" },
  { value: "SUBSCRIPTION", label: "Subscription" },
  { value: "ONE_TIME", label: "One-time" },
  { value: "LIFETIME", label: "Lifetime" },
  { value: "USAGE_BASED", label: "Usage-based" },
  { value: "CUSTOM", label: "Custom" },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest rated" },
  { value: "name", label: "A to Z" },
  { value: "newest", label: "Recently added" },
];

type ToolsSearchParams = {
  q?: string;
  category?: string;
  pricing?: string;
  freePlan?: string;
  freeTrial?: string;
  useCase?: string;
  audience?: string;
  sort?: string;
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
  const isFiltered = Boolean(params.q || params.category || params.pricing || params.freePlan || params.freeTrial || params.useCase || params.audience || params.sort);
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
  const sort = isSortOrder(params.sort) ? params.sort : "recommended";

  const [products, categories, useCases, audiences] = await Promise.all([
    getProducts({
      query: params.q?.trim(),
      category: params.category,
      pricingModel,
      freePlan,
      freeTrial,
      useCase: params.useCase,
      audience: params.audience,
      sort,
    }),
    getPublishedCategories(),
    getUseCases(),
    getAudiences(),
  ]);

  const activeCategory = categories.find((category) => category.slug === params.category);
  const activeUseCase = useCases.find((item) => item.slug === params.useCase);
  const activeAudience = audiences.find((item) => item.slug === params.audience);

  /** The chips that let someone unpick one decision without losing the rest. */
  const applied: Array<{ label: string; removeHref: string }> = [];
  const withoutKey = (key: keyof ToolsSearchParams) => {
    const next = new URLSearchParams();
    for (const [name, value] of Object.entries(params)) {
      if (name !== key && value) next.set(name, String(value));
    }
    const query = next.toString();
    return query ? `/tools?${query}` : "/tools";
  };
  if (params.q?.trim()) applied.push({ label: `“${params.q.trim()}”`, removeHref: withoutKey("q") });
  if (activeCategory) applied.push({ label: activeCategory.name, removeHref: withoutKey("category") });
  if (pricingModel) applied.push({ label: PRICING_OPTIONS.find((option) => option.value === pricingModel)?.label ?? pricingModel, removeHref: withoutKey("pricing") });
  if (activeUseCase) applied.push({ label: activeUseCase.name, removeHref: withoutKey("useCase") });
  if (activeAudience) applied.push({ label: activeAudience.name, removeHref: withoutKey("audience") });
  if (freePlan) applied.push({ label: "Has a free plan", removeHref: withoutKey("freePlan") });
  if (freeTrial) applied.push({ label: "Has a free trial", removeHref: withoutKey("freeTrial") });

  const hasFilters = applied.length > 0;

  return (
    <div>
      {/* Search leads the page: this is the route most people take into the site. */}
      <section className="band">
        <div className="shell py-10 sm:py-14">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Tools" }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow">Curated directory</p>
              <h1 className="section-heading mt-3 max-w-3xl">Find the right tool for the work.</h1>
              <SearchForm
                id="directory-search"
                label="Search tools by name, description or use case"
                placeholder="e.g. invoicing, project management, SEO"
                defaultValue={params.q}
                size="lg"
                submitLabel="Search"
                className="mt-7 max-w-2xl"
              />
              <p className="mt-3 text-sm text-[var(--muted)]">
                Search matches names, descriptions, use cases and audiences &mdash; not just tool names.
              </p>
            </div>
            <p className="lede lg:pb-2">
              {products.length === 0
                ? "Nothing matches yet."
                : <><strong className="font-semibold text-[var(--ink)]">{products.length}</strong> published {products.length === 1 ? "tool" : "tools"} {hasFilters ? "match your filters" : "in the directory"}.</>}
            </p>
          </div>
        </div>
      </section>

      <div className="shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
        {/* Filters. A plain GET form, so everything works without JavaScript and every
            filtered view is a shareable URL. */}
        <form action="/tools" className="h-fit lg:sticky lg:top-24">
          {/* The current query survives a filter change without being retyped. */}
          {params.q && <input type="hidden" name="q" value={params.q} />}

          <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-[var(--ink)]">Refine</h2>
            {hasFilters && <Link href={params.q ? `/tools?q=${encodeURIComponent(params.q)}` : "/tools"} className="text-xs font-semibold text-[var(--accent-deep)]">Clear all</Link>}
          </div>

          <div className="mt-5 flex flex-col gap-5">
            <div>
              <label htmlFor="filter-category" className="field-label">Category</label>
              <select id="filter-category" name="category" defaultValue={params.category ?? ""} className="field">
                <option value="">All categories</option>
                {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="filter-pricing" className="field-label">Pricing</label>
              <select id="filter-pricing" name="pricing" defaultValue={params.pricing ?? ""} className="field">
                <option value="">Any pricing</option>
                {PRICING_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="filter-use-case" className="field-label">Use case</label>
              <select id="filter-use-case" name="useCase" defaultValue={params.useCase ?? ""} className="field">
                <option value="">Any use case</option>
                {useCases.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="filter-audience" className="field-label">Audience</label>
              <select id="filter-audience" name="audience" defaultValue={params.audience ?? ""} className="field">
                <option value="">Any audience</option>
                {audiences.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </div>

            <fieldset className="border-0 p-0">
              <legend className="field-label">Cost to start</legend>
              <div className="flex flex-col gap-2.5 text-sm text-[var(--ink-body)]">
                <label className="inline-flex items-center gap-2.5">
                  <input type="checkbox" name="freePlan" value="true" defaultChecked={freePlan} className="h-4 w-4 accent-[var(--accent)]" /> Has a free plan
                </label>
                <label className="inline-flex items-center gap-2.5">
                  <input type="checkbox" name="freeTrial" value="true" defaultChecked={freeTrial} className="h-4 w-4 accent-[var(--accent)]" /> Has a free trial
                </label>
              </div>
            </fieldset>

            <div>
              <label htmlFor="filter-sort" className="field-label">Sort by</label>
              <select id="filter-sort" name="sort" defaultValue={sort} className="field">
                {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>

            <button className="button-primary w-full">Apply</button>
          </div>
        </form>

        <div className="min-w-0">
          {applied.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pb-6">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Filtering by</span>
              {applied.map((chip) => (
                <Link
                  key={chip.label}
                  href={chip.removeHref}
                  className="badge badge-accent hover:border-[var(--accent)]"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  {chip.label} <span aria-hidden="true">&times;</span>
                </Link>
              ))}
            </div>
          )}

          <ProductGrid
            products={products}
            emptyTitle="Nothing fits those filters yet."
            emptyBody={params.q ? "Try a broader term, or clear the filters to browse the full directory." : "Clear one or more filters to see more of the curated directory."}
            emptyLinkLabel="Clear filters"
          />

          {/* Need-first entry points into the taxonomy landings. */}
          {(useCases.length > 0 || audiences.length > 0) && (
            <div className="mt-16 border-t border-[var(--line)] pt-10">
              <p className="eyebrow">Browse by need</p>
              {useCases.length > 0 && (
                <>
                  <h2 className="mt-3 text-lg font-bold tracking-[-0.02em]">By use case</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {useCases.map((item) => (
                      <Link key={item.slug} href={`/tools/use-case/${item.slug}`} className="badge hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">
                        {item.name} <span className="text-[var(--muted-soft)]">{item._count.products}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
              {audiences.length > 0 && (
                <>
                  <h2 className="mt-8 text-lg font-bold tracking-[-0.02em]">By audience</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {audiences.map((item) => (
                      <Link key={item.slug} href={`/tools/audience/${item.slug}`} className="badge hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">
                        {item.name} <span className="text-[var(--muted-soft)]">{item._count.products}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
