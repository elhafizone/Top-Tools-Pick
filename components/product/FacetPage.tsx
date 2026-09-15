import type { Product, Category } from "@prisma/client";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchForm } from "@/components/search/SearchForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { jsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

type Props = {
  kicker: string;
  heading: string;
  intro: string;
  basePath: string;
  facetName: string;
  facetSlug: string;
  products: Array<Product & { category: Category }>;
};

/**
 * Shared shell for the use-case / audience / platform landings.
 *
 * These routes finally call getProductsByUseCase / ByAudience / ByPlatform, which were
 * written in lib/products.ts and never used by any page - the taxonomy was rendered as
 * inert text on tool pages with no destination behind it.
 */
export function FacetPage({ kicker, heading, intro, basePath, facetName, facetSlug, products }: Props) {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: facetName, path: `${basePath}/${facetSlug}` },
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(itemListJsonLd(heading, products.map((p) => ({ name: p.name, path: `/tools/${p.slug}` }))))}
        />
      )}

      <section className="band">
        <div className="shell py-8 sm:py-12">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }, { name: facetName }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow">{kicker}</p>
              <h1 className="section-heading mt-3 max-w-3xl">{heading}</h1>
              <p className="lede mt-5 max-w-2xl">{intro}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">
                <span className="text-2xl font-bold tracking-[-0.03em]">{products.length}</span>{" "}
                {products.length === 1 ? "tool" : "tools"} listed
              </p>
              <SearchForm
                id="facet-search"
                label="Search tools"
                placeholder="Search all tools"
                className="mt-4"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-12 sm:py-16">
        <ProductGrid
          products={products}
          emptyTitle="No tools listed here yet."
          emptyBody="This is a real category in our taxonomy, but nothing is published against it yet."
        />
        <div className="mt-12"><Disclosure /></div>
      </section>
    </div>
  );
}
