import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { ProductCard } from "@/components/product/ProductCard";
import { getEditorialListBySlug } from "@/lib/products";
import { breadcrumbJsonLd, editorialListMetadata, jsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function EditorialListPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const list = await getEditorialListBySlug(slug);
  if (!list) notFound();
  const breadcrumbs = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Best picks", path: "/best" }, { name: list.title, path: `/best/${slug}` }]);
  return <article className="shell py-20 sm:py-28">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1"><Link href="/" className="hover:text-[var(--ink)]">Home</Link><span aria-hidden="true">/</span><Link href="/best" className="hover:text-[var(--ink)]">Best picks</Link><span aria-hidden="true">/</span><span className="text-[var(--ink)]">{list.title}</span></nav>
    <header className="mt-14 max-w-4xl border-b border-[var(--line)] pb-12"><p className="eyebrow">Curated collection</p><h1 className="section-heading mt-5">{list.title}</h1>{list.description && <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{list.description}</p>}<div className="mt-6"><Disclosure /></div></header>
    {list.items.length ? <div className="mt-12 grid gap-10 lg:grid-cols-2">{list.items.map((item) => <article key={item.id} className="relative"><span className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-[var(--accent)] text-sm font-bold text-white">{item.rank}</span><ProductCard product={item.product} />{item.rationale && <p className="mt-3 px-5 text-sm leading-6 text-[var(--muted)]">{item.rationale}</p>}</article>)}</div> : <div className="mt-12 border border-dashed border-[var(--line)] p-8 text-[var(--muted)]"><p>This collection has no published items yet.</p><Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Browse tools ↗</Link></div>}
  </article>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const list = await getEditorialListBySlug(slug);
  return list ? editorialListMetadata(list.seoTitle ?? list.title, list.seoDescription ?? list.description, slug) : editorialListMetadata("Editorial list not found", "The requested editorial list could not be found.", slug);
}
