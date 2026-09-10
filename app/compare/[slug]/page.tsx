import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { getBestAffiliateLink } from "@/lib/affiliate/links";
import { getComparisonBySlug } from "@/lib/products";
import { breadcrumbJsonLd, comparisonMetadata, jsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) notFound();
  const { productA, productB } = comparison;
  const breadcrumbs = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Comparisons", path: "/compare" }, { name: comparison.title, path: `/compare/${slug}` }]);
  return <article className="shell py-20 sm:py-28">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1"><Link href="/" className="hover:text-[var(--ink)]">Home</Link><span aria-hidden="true">/</span><Link href="/compare" className="hover:text-[var(--ink)]">Comparisons</Link><span aria-hidden="true">/</span><span className="text-[var(--ink)]">{comparison.title}</span></nav>
    <header className="mt-14 max-w-4xl border-b border-[var(--line)] pb-12"><p className="eyebrow">Editorial comparison</p><h1 className="section-heading mt-5">{comparison.title}</h1>{comparison.description && <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{comparison.description}</p>}</header>
    <section aria-label="Compared tools" className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2"><ComparisonCard product={productA} /><ComparisonCard product={productB} /></section>
    <section className="mt-12 border-l-2 border-[var(--accent)] bg-[var(--blue-wash)] p-7 sm:p-10"><p className="eyebrow">Editorial conclusion</p><h2 className="mt-4 text-3xl font-bold tracking-[-0.05em]">The short answer</h2><p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--accent-deep)]">{comparison.verdict}</p><div className="mt-7"><Disclosure /></div></section>
  </article>;
}

function ComparisonCard({ product }: { product: NonNullable<Awaited<ReturnType<typeof getComparisonBySlug>>>["productA"] }) {
  const ctaUrl = getBestAffiliateLink(product);
  return <section className="bg-white p-7 sm:p-9"><p className="eyebrow">{product.category.name}</p><h2 className="mt-4 text-2xl font-bold tracking-[-0.04em]"><Link href={`/tools/${product.slug}`} className="hover:text-[var(--accent-deep)]">{product.name}</Link></h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{product.shortDescription}</p><dl className="mt-7 divide-y divide-[var(--line)] border-y border-[var(--line)] text-sm"><div className="flex justify-between gap-4 py-4"><dt className="text-[var(--muted)]">Rating</dt><dd className="font-semibold">{Number(product.rating).toFixed(1)} / 5</dd></div><div className="flex justify-between gap-4 py-4"><dt className="text-[var(--muted)]">Editorial score</dt><dd className="font-semibold">{product.editorialScore}/100</dd></div><div className="flex justify-between gap-4 py-4"><dt className="text-[var(--muted)]">Pricing</dt><dd className="font-semibold capitalize">{product.pricingModel.replaceAll("_", " ").toLowerCase()}</dd></div></dl><div className="mt-7 flex flex-wrap gap-4"><Link href={`/tools/${product.slug}`} className="button-secondary">Read tool profile</Link><a href={ctaUrl} target="_blank" rel="nofollow sponsored noopener noreferrer" className="editorial-link self-center text-sm font-semibold">Visit website ↗</a></div></section>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  return comparison ? comparisonMetadata(comparison.title, comparison.verdict, slug) : comparisonMetadata("Comparison not found", "The requested comparison could not be found.", slug);
}
