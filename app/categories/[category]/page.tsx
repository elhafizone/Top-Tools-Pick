import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { breadcrumbJsonLd, buildMetadata, jsonLd, siteUrl } from "@/lib/seo";
import { getProductsByCategory } from "@/lib/products";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = await prisma.category.findFirst({ where: { slug, status: "PUBLISHED" }, select: { id: true, name: true, slug: true, description: true } });
  if (!category) notFound();
  const products = await getProductsByCategory(category.slug);
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
    <section className="shell py-16 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5"><div><p className="eyebrow">The shortlist</p><h2 className="mt-4 text-3xl font-bold tracking-[-0.05em]">Tools in {category.name}</h2></div><Link href="/tools" className="editorial-link text-sm font-semibold">Browse all tools ↗</Link></div>
      {products.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="mt-8 border border-dashed border-[var(--line)] bg-white p-8 sm:p-10"><h3 className="text-2xl font-bold tracking-[-0.04em]">No published tools here yet.</h3><p className="mt-3 max-w-xl leading-7 text-[var(--muted)]">This category is published, but its shortlist is still being edited.</p><Link href="/categories" className="button-secondary mt-7">Explore other categories</Link></div>}
    </section>
  </article>;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await prisma.category.findFirst({ where: { slug, status: "PUBLISHED" }, select: { name: true, description: true, seoTitle: true, seoDescription: true } });
  if (!category) return buildMetadata("Category not found | TopToolsPick", "The requested category could not be found.", `/categories/${slug}`);
  const title = category.seoTitle ?? `${category.name} tools | TopToolsPick`;
  const description = category.seoDescription ?? category.description ?? `Explore ${category.name} tools on TopToolsPick.`;
  const metadata = buildMetadata(title, description, `/categories/${slug}`);
  return { ...metadata, openGraph: { title, description, url: new URL(`/categories/${slug}`, siteUrl).toString(), siteName: "TopToolsPick", type: "website" } };
}
