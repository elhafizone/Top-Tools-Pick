import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { ProductCard } from "@/components/product/ProductCard";
import { getBestAffiliateLink, safeHostname } from "@/lib/affiliate/links";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { breadcrumbJsonLd, jsonLd, productMetadata, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id);
  const ctaUrl = getBestAffiliateLink(product);
  const websiteHost = safeHostname(product.websiteUrl);
  const isAffiliateLink = ctaUrl !== product.websiteUrl;
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: product.category.name, path: `/categories/${product.category.slug}` },
    { name: product.name, path: `/tools/${product.slug}` },
  ]);
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.shortDescription,
    url: product.websiteUrl,
    applicationCategory: product.category.name,
    ...(Number(product.rating) > 0 && product.reviews.length > 0 ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Number(product.rating),
        bestRating: 5,
        ratingCount: product.reviews.length,
      },
    } : {}),
  };

  return <article>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(softwareJsonLd)} />

    <section className="border-b border-[var(--line)] bg-white">
      <div className="shell py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href="/" className="hover:text-[var(--ink)]">Home</Link><span aria-hidden="true">/</span>
          <Link href="/tools" className="hover:text-[var(--ink)]">Tools</Link><span aria-hidden="true">/</span>
          <Link href={`/categories/${product.category.slug}`} className="hover:text-[var(--ink)]">{product.category.name}</Link><span aria-hidden="true">/</span>
          <span className="text-[var(--ink)]">{product.name}</span>
        </nav>
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-16">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--blue-wash)] text-xl font-black text-[var(--accent)]" aria-hidden="true">{product.name.slice(0, 1)}</span>
              <Link href={`/categories/${product.category.slug}`} className="tag hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">{product.category.name}</Link>
            </div>
            <h1 className="section-heading mt-7 max-w-4xl break-words">{product.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{product.shortDescription}</p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
              <span><strong className="text-[var(--ink)]">{product.editorialScore}/100</strong> editorial score</span>
              <span><span aria-hidden="true">★</span> <strong className="text-[var(--ink)]">{Number(product.rating).toFixed(1)}/5</strong> rating</span>
              <span className="capitalize">{product.pricingModel.replaceAll("_", " ").toLowerCase()}</span>
            </div>
          </div>
          <div className="lg:pb-1">
            {ctaUrl && <>
              <a href={ctaUrl} target="_blank" rel="nofollow sponsored noopener noreferrer" className="button-primary w-full sm:w-auto lg:w-full">
                Visit {product.name} <span aria-hidden="true">↗</span>
              </a>
              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">Opens the {isAffiliateLink ? "partner" : "official"} website in a new tab.</p>
            </>}
          </div>
        </div>
      </div>
    </section>

    <div className="shell grid gap-14 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
      <div className="min-w-0">
        <section aria-labelledby="overview-heading">
          <p className="eyebrow">The editorial note</p>
          <h2 id="overview-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">What to know about {product.name}</h2>
          <p className="article-content mt-6 max-w-2xl">{product.description}</p>
        </section>

        <section aria-labelledby="details-heading" className="mt-16">
          <p className="eyebrow">Quick read</p>
          <h2 id="details-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">At a glance</h2>
          <dl className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            <InfoRow label="Category" value={product.category.name} />
            {product.bestFor && <InfoRow label="Best for" value={product.bestFor} />}
            <InfoRow label="Pricing model" value={formatLabel(product.pricingModel)} />
            <InfoRow label="Free plan" value={product.hasFreePlan ? "Available" : "Not listed"} />
            <InfoRow label="Free trial" value={product.hasFreeTrial ? "Available" : "Not listed"} />
            {websiteHost && <InfoRow label="Website" value={websiteHost} />}
          </dl>
        </section>

        {product.pricingPlans.length > 0 && <section aria-labelledby="pricing-heading" className="mt-16">
          <p className="eyebrow">Plans</p><h2 id="pricing-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">Pricing details</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{product.pricingPlans.map((plan) => <div key={plan.id} className="surface p-5"><h3 className="font-bold">{plan.name}</h3><p className="mt-2 text-sm text-[var(--muted)]">{plan.priceLabel}</p>{plan.billingPeriod && <p className="mt-1 text-xs text-[var(--muted)]">Billed {plan.billingPeriod}</p>}</div>)}</div>
        </section>}

        {(product.pros || product.cons) && <section aria-label="Editorial strengths and limitations" className="mt-16 grid gap-8 sm:grid-cols-2">
          {product.pros && <EditorialColumn title="Pros" value={product.pros} tone="positive" />}
          {product.cons && <EditorialColumn title="Cons" value={product.cons} tone="neutral" />}
        </section>}

        {product.reviews.length > 0 && <section aria-labelledby="reviews-heading" className="mt-16">
          <p className="eyebrow">Editorial review</p><h2 id="reviews-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">From the journal</h2>
          {product.reviews.map((review) => <div key={review.id} className="mt-7 border-l-2 border-[var(--accent)] pl-5"><h3 className="text-xl font-bold">{review.title}</h3><p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{review.body}</p><p className="mt-3 text-xs text-[var(--muted)]">By {review.author}</p></div>)}
        </section>}

        <Taxonomy title="Use cases" items={product.useCases.map(({ useCase }) => useCase.name)} />
        <Taxonomy title="Audiences" items={product.audiences.map(({ audience }) => audience.name)} />
        <Taxonomy title="Platforms" items={product.platforms.map(({ platform }) => platform.name)} />
        <Taxonomy title="Tags" items={product.tags.map(({ tag }) => tag.name)} />
      </div>

      <aside className="h-fit border-t border-[var(--ink)] pt-5 lg:sticky lg:top-24">
        <p className="eyebrow">Trust & transparency</p>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">We may earn a commission when you visit a merchant through a labeled affiliate link. This does not change your price.</p>
        <div className="mt-5"><Disclosure /></div>
      </aside>
    </div>

    {related.length > 0 && <section className="border-t border-[var(--line)]">
      <div className="shell py-16 sm:py-24"><p className="eyebrow">Keep exploring</p><div className="flex flex-wrap items-end justify-between gap-4"><h2 className="mt-4 text-3xl font-bold tracking-[-0.05em]">More from {product.category.name}</h2><Link href={`/categories/${product.category.slug}`} className="editorial-link text-sm font-semibold">View category ↗</Link></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></div>
    </section>}
  </article>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-wrap justify-between gap-3 py-4 text-sm"><dt className="text-[var(--muted)]">{label}</dt><dd className="text-right font-semibold capitalize">{value}</dd></div>;
}

function EditorialColumn({ title, value, tone }: { title: string; value: string; tone: "positive" | "neutral" }) {
  return <div className={`border-t-2 pt-4 ${tone === "positive" ? "border-[var(--accent)]" : "border-[var(--line)]"}`}><h2 className="text-xl font-bold">{title}</h2><p className="mt-3 leading-7 text-[var(--muted)]">{value}</p></div>;
}

function Taxonomy({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return <section className="mt-12"><h2 className="text-xl font-bold">{title}</h2><div className="mt-4 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="tag">{item}</span>)}</div></section>;
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return productMetadata("Tool not found", "The requested tool could not be found.", slug);
  return {
    ...productMetadata(product.name, product.shortDescription, slug),
    openGraph: { title: `${product.name} | TopToolsPick`, description: product.shortDescription, url: new URL(`/tools/${slug}`, siteUrl).toString(), siteName: "TopToolsPick", type: "website" },
  };
}
