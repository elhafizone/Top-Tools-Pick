import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { AlternativesSection } from "@/components/product/AlternativesSection";
import { getAlternatives } from "@/lib/alternatives";
import { getProductBySlug } from "@/lib/products";
import { breadcrumbJsonLd, jsonLd, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * "{tool} alternatives" is the highest commercial-intent query shape on the site, so
 * the route is worth owning. But a page listing one or two curated rows is thin, and
 * thin pages are exactly what the noindex on /compare exists to avoid - so indexing
 * is gated on enough curated content to be genuinely useful.
 */
const INDEXABLE_ALTERNATIVES = 3;

export default async function AlternativesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const alternatives = await getAlternatives(product.id);
  // Nothing curated means there is no page to show - send people to the review instead.
  if (alternatives.length === 0) notFound();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: product.name, path: `/tools/${product.slug}` },
    { name: "Alternatives", path: `/tools/${product.slug}/alternatives` },
  ]);

  return <article>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />

    <section className="border-b border-[var(--line)] bg-white">
      <div className="shell py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href="/" className="hover:text-[var(--ink)]">Home</Link><span aria-hidden="true">/</span>
          <Link href="/tools" className="hover:text-[var(--ink)]">Tools</Link><span aria-hidden="true">/</span>
          <Link href={`/tools/${product.slug}`} className="hover:text-[var(--ink)]">{product.name}</Link><span aria-hidden="true">/</span>
          <span className="text-[var(--ink)]">Alternatives</span>
        </nav>
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
          <div className="min-w-0">
            <p className="eyebrow">Alternatives</p>
            <h1 className="section-heading mt-5 max-w-4xl break-words">The best {product.name} alternatives</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              {alternatives.length} tools worth considering instead of {product.name}, each with the reason an editor picked it.
            </p>
            <div className="mt-8 max-w-md"><Disclosure /></div>
          </div>
          <div className="surface h-fit p-6">
            <p className="text-sm leading-6 text-[var(--muted)]">Still leaning towards {product.name}?</p>
            <Link href={`/tools/${product.slug}`} className="editorial-link mt-3 inline-block text-sm font-semibold text-[var(--ink)]">Read the full review ↗</Link>
            <div className="mt-5 border-t border-[var(--line)] pt-5">
              <AffiliateCta product={product} placement="alternatives-hero" className="w-full" showCaption />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="shell py-16 sm:py-24">
      <AlternativesSection items={alternatives} productName={product.name} headingId="all-alternatives-heading" />
      <div className="mt-14 border-t-2 border-[var(--accent)] pt-7 sm:flex sm:items-end sm:justify-between sm:gap-10">
        <div>
          <p className="eyebrow">Narrow it down</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-[-0.05em]">Put your finalists side by side.</h2>
        </div>
        <Link href={`/compare?category=${encodeURIComponent(product.category.slug)}&tools=${encodeURIComponent(product.slug)}`} className="button-primary mt-7 sm:mt-0">
          Compare them <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  </article>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Alternatives not found" };

  const alternatives = await getAlternatives(product.id);
  const title = `${product.name} alternatives`;
  const description = `${alternatives.length} alternatives to ${product.name}, with the reason to pick each one instead.`;
  const canonical = new URL(`/tools/${slug}/alternatives`, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: "TopToolsPick", type: "website" },
    twitter: { card: "summary_large_image", title, description },
    // Follow, so link equity still reaches the alternatives; index only once it is substantial.
    ...(alternatives.length >= INDEXABLE_ALTERNATIVES ? {} : { robots: { index: false, follow: true } }),
  };
}
