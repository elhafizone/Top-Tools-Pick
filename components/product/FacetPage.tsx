import Link from "next/link";
import type { Product, Category } from "@prisma/client";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { ProductGrid } from "@/components/product/ProductGrid";
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
    <section className="shell py-20 sm:py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(itemListJsonLd(heading, products.map((p) => ({ name: p.name, path: `/tools/${p.slug}` }))))}
        />
      )}

      <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1">
        <Link href="/" className="hover:text-[var(--ink)]">Home</Link><span aria-hidden="true">/</span>
        <Link href="/tools" className="hover:text-[var(--ink)]">Tools</Link><span aria-hidden="true">/</span>
        <span className="text-[var(--ink)]">{facetName}</span>
      </nav>

      <header className="mt-10 grid gap-8 border-b border-[var(--line)] pb-12 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div>
          <p className="eyebrow">{kicker}</p>
          <h1 className="section-heading mt-5 max-w-4xl">{heading}</h1>
        </div>
        <p className="leading-7 text-[var(--muted)]">{intro}</p>
      </header>

      <p className="mt-8 text-sm font-semibold text-[var(--ink)]">
        <span className="text-[var(--accent-deep)]">{products.length}</span> {products.length === 1 ? "tool" : "tools"}
      </p>

      <ProductGrid
        products={products}
        className="mt-6"
        emptyTitle="No tools listed here yet."
        emptyBody="This is a real category in our taxonomy, but nothing is published against it yet."
      />

      <div className="mt-12"><Disclosure /></div>
    </section>
  );
}
