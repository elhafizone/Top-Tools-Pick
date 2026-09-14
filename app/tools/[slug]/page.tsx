import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import { AlternativesSection } from "@/components/product/AlternativesSection";
import { ProductCard } from "@/components/product/ProductCard";
import { ctaSubline } from "@/lib/affiliate/cta";
import { getBestAffiliateLink, safeHostname } from "@/lib/affiliate/links";
import { getAlternatives } from "@/lib/alternatives";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { toBullets } from "@/lib/text";
import { breadcrumbJsonLd, jsonLd, productMetadata, siteUrl, softwareApplicationJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** A dedicated alternatives page is only worth indexing once enough is curated. */
const INDEXABLE_ALTERNATIVES = 3;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, alternatives] = await Promise.all([
    getRelatedProducts(product.id),
    getAlternatives(product.id),
  ]);

  const ctaUrl = getBestAffiliateLink(product);
  const websiteHost = safeHostname(product.websiteUrl);
  const entryPrice = ctaSubline(product.pricingPlans);
  const programDisclosure = product.affiliatePrograms.find((program) => program.disclosure)?.disclosure ?? null;
  const bestForPoints = toBullets(product.bestFor);
  const notForPoints = toBullets(product.notFor);
  const featurePoints = toBullets(product.keyFeatures);
  const prosPoints = toBullets(product.pros);
  const consPoints = toBullets(product.cons);
  const comparisonArticles = product.articleLinks.filter((link) => link.article.topic === "comparisons");
  const mentionedIn = product.articleLinks.filter((link) => link.article.topic !== "comparisons");

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: product.category.name, path: `/categories/${product.category.slug}` },
    { name: product.name, path: `/tools/${product.slug}` },
  ]);
  // Keeps websiteUrl (never the affiliate URL) and only emits offers where a plan has
  // both a numeric price and a currency.
  const softwareJsonLd = softwareApplicationJsonLd(product);

  return <article>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(softwareJsonLd)} />

    {/* Decision summary. Everything needed to judge fit sits above the fold. */}
    <section className="border-b border-[var(--line)] bg-white">
      <div className="shell py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href="/" className="hover:text-[var(--ink)]">Home</Link><span aria-hidden="true">/</span>
          <Link href="/tools" className="hover:text-[var(--ink)]">Tools</Link><span aria-hidden="true">/</span>
          <Link href={`/categories/${product.category.slug}`} className="hover:text-[var(--ink)]">{product.category.name}</Link><span aria-hidden="true">/</span>
          <span className="text-[var(--ink)]">{product.name}</span>
        </nav>
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--blue-wash)] text-xl font-black text-[var(--accent)]" aria-hidden="true">{product.name.slice(0, 1)}</span>
              <Link href={`/categories/${product.category.slug}`} className="tag hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">{product.category.name}</Link>
            </div>
            <h1 className="section-heading mt-7 max-w-4xl break-words">{product.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{product.shortDescription}</p>
            {bestForPoints.length > 0 && (
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--ink)]">
                <span className="font-semibold">Best for:</span> <span className="text-[var(--muted)]">{bestForPoints.join(" · ")}</span>
              </p>
            )}
            <DecisionBadges
              hasFreePlan={product.hasFreePlan}
              hasFreeTrial={product.hasFreeTrial}
              pricingModel={product.pricingModel}
              entryPriceLabel={entryPrice}
              className="mt-7"
            />
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
              <span><strong className="text-[var(--ink)]">{product.editorialScore}/100</strong> editorial score</span>
              <span><span aria-hidden="true">★</span> <strong className="text-[var(--ink)]">{Number(product.rating).toFixed(1)}/5</strong> rating</span>
              {product.lastReviewedAt && <span>Reviewed {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(product.lastReviewedAt)}</span>}
            </div>
          </div>

          <div className="h-fit lg:sticky lg:top-24">
            <div className="surface p-6">
              {ctaUrl ? <>
                <AffiliateCta product={product} placement="tool-hero" className="w-full" showCaption />
              </> : <p className="text-sm text-[var(--muted)]">No verified link is available for this tool yet.</p>}
              <div className="mt-5 flex flex-col gap-2 border-t border-[var(--line)] pt-5 text-sm">
                {alternatives.length > 0 && <Link href={`/tools/${product.slug}/alternatives`} className="editorial-link font-semibold text-[var(--ink)]">See {alternatives.length} alternatives ↗</Link>}
                <Link href={`/compare?category=${encodeURIComponent(product.category.slug)}&tools=${encodeURIComponent(product.slug)}`} className="editorial-link font-semibold text-[var(--ink)]">Compare with similar tools ↗</Link>
              </div>
            </div>
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

        {/* Fit before features: the question people actually arrive with. */}
        {(bestForPoints.length > 0 || notForPoints.length > 0) && (
          <section aria-labelledby="fit-heading" className="mt-16">
            <p className="eyebrow">Is it right for you?</p>
            <h2 id="fit-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">Who {product.name} suits</h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {bestForPoints.length > 0 && <PointList title="Choose it if" points={bestForPoints} tone="positive" />}
              {notForPoints.length > 0 && <PointList title="Look elsewhere if" points={notForPoints} tone="neutral" />}
            </div>
          </section>
        )}

        {featurePoints.length > 0 && (
          <section aria-labelledby="features-heading" className="mt-16">
            <p className="eyebrow">What you get</p>
            <h2 id="features-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">Key features</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {featurePoints.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-7 text-[var(--muted)]">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />{point}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="details-heading" className="mt-16">
          <p className="eyebrow">Quick read</p>
          <h2 id="details-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">At a glance</h2>
          <dl className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            <InfoRow label="Category" value={product.category.name} />
            <InfoRow label="Pricing model" value={formatLabel(product.pricingModel)} />
            {entryPrice && <InfoRow label="Entry plan" value={entryPrice} />}
            <InfoRow label="Free plan" value={product.hasFreePlan ? "Available" : "Not listed"} />
            <InfoRow label="Free trial" value={product.hasFreeTrial ? "Available" : "Not listed"} />
            {websiteHost && <InfoRow label="Website" value={websiteHost} />}
          </dl>
        </section>

        {product.pricingPlans.length > 0 && <section aria-labelledby="pricing-heading" className="mt-16">
          <p className="eyebrow">Plans</p><h2 id="pricing-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">Pricing details</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{product.pricingPlans.map((plan) => <div key={plan.id} className="surface p-5"><h3 className="font-bold">{plan.name}</h3><p className="mt-2 text-sm text-[var(--muted)]">{plan.priceLabel}</p>{plan.billingPeriod && <p className="mt-1 text-xs text-[var(--muted)]">Billed {plan.billingPeriod}</p>}</div>)}</div>
        </section>}

        {(prosPoints.length > 0 || consPoints.length > 0) && <section aria-label="Editorial strengths and limitations" className="mt-16 grid gap-8 sm:grid-cols-2">
          {prosPoints.length > 0 && <PointList title="Pros" points={prosPoints} tone="positive" />}
          {consPoints.length > 0 && <PointList title="Cons" points={consPoints} tone="neutral" />}
        </section>}

        {/* Link out whenever the dedicated page is indexable, so internal linking
            reinforces the page we actually want ranked - not only when it holds more
            rows than this section already shows. */}
        <AlternativesSection
          items={alternatives.slice(0, 4)}
          productName={product.name}
          moreHref={alternatives.length >= INDEXABLE_ALTERNATIVES ? `/tools/${product.slug}/alternatives` : undefined}
        />

        {comparisonArticles.length > 0 && (
          <section aria-labelledby="comparisons-heading" className="mt-16">
            <p className="eyebrow">Head to head</p>
            <h2 id="comparisons-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">{product.name} compared</h2>
            <ul className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {comparisonArticles.map((link) => (
                <li key={link.articleId} className="py-5">
                  <Link href={`/articles/${link.article.slug}`} className="group block">
                    <span className="text-lg font-bold tracking-[-0.03em] group-hover:text-[var(--accent-deep)]">{link.article.title}</span>
                    {link.note && <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{link.note}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* The verdict, with the CTA repeated at the point of decision. */}
        {product.verdict && (
          <section aria-labelledby="verdict-heading" className="mt-16 border-t-2 border-[var(--accent)] pt-7">
            <p className="eyebrow">The verdict</p>
            <h2 id="verdict-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">Our take on {product.name}</h2>
            <p className="article-content mt-6 max-w-2xl">{product.verdict}</p>
            <div className="mt-7"><AffiliateCta product={product} placement="tool-verdict" /></div>
          </section>
        )}

        {product.reviews.length > 0 && <section aria-labelledby="reviews-heading" className="mt-16">
          <p className="eyebrow">Editorial review</p><h2 id="reviews-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">From the journal</h2>
          {product.reviews.map((review) => <div key={review.id} className="mt-7 border-l-2 border-[var(--accent)] pl-5"><h3 className="text-xl font-bold">{review.title}</h3><p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{review.body}</p><p className="mt-3 text-xs text-[var(--muted)]">By {review.author}</p></div>)}
        </section>}

        {(product.editorialItems.length > 0 || mentionedIn.length > 0) && (
          <section aria-labelledby="mentioned-heading" className="mt-16">
            <p className="eyebrow">Where this appears</p>
            <h2 id="mentioned-heading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">Mentioned in</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {product.editorialItems.map((item) => (
                <li key={item.id}><Link href={`/best/${item.list.slug}`} className="tag hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">{item.list.title}{item.award ? ` — ${item.award}` : ""}</Link></li>
              ))}
              {mentionedIn.map((link) => (
                <li key={link.articleId}><Link href={`/articles/${link.article.slug}`} className="tag hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">{link.article.title}</Link></li>
              ))}
            </ul>
          </section>
        )}

        {/* These were inert <span>s while the query helpers behind them sat unused,
            so every taxonomy term was a dead end. They are real destinations now. */}
        <Taxonomy title="Use cases" items={product.useCases.map(({ useCase }) => ({ name: useCase.name, href: `/tools/use-case/${useCase.slug}` }))} />
        <Taxonomy title="Audiences" items={product.audiences.map(({ audience }) => ({ name: audience.name, href: `/tools/audience/${audience.slug}` }))} />
        <Taxonomy title="Platforms" items={product.platforms.map(({ platform }) => ({ name: platform.name, href: `/tools/platform/${platform.slug}` }))} />
        <Taxonomy title="Tags" items={product.tags.map(({ tag }) => ({ name: tag.name }))} />
      </div>

      <aside className="h-fit border-t border-[var(--ink)] pt-5 lg:sticky lg:top-24">
        <p className="eyebrow">Trust &amp; transparency</p>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">We may earn a commission when you visit a merchant through a labeled affiliate link. This does not change your price.</p>
        {programDisclosure && <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{programDisclosure}</p>}
        <div className="mt-5"><Disclosure /></div>
      </aside>
    </div>

    {related.length > 0 && <section className="border-t border-[var(--line)]">
      <div className="shell py-16 sm:py-24"><p className="eyebrow">Keep exploring</p><div className="flex flex-wrap items-end justify-between gap-4"><h2 className="mt-4 text-3xl font-bold tracking-[-0.05em]">More from {product.category.name}</h2><Link href={`/categories/${product.category.slug}`} className="editorial-link text-sm font-semibold">View category ↗</Link></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></div>
    </section>}
  </article>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-wrap justify-between gap-3 py-4 text-sm"><dt className="text-[var(--muted)]">{label}</dt><dd className="text-right font-semibold">{value}</dd></div>;
}

/**
 * Renders a free-text column as a list when the editor used separators, and as a
 * paragraph when they wrote one sentence - so existing rows keep reading naturally.
 */
function PointList({ title, points, tone }: { title: string; points: string[]; tone: "positive" | "neutral" }) {
  return <div className={`border-t-2 pt-4 ${tone === "positive" ? "border-[var(--accent)]" : "border-[var(--line)]"}`}>
    <h3 className="text-xl font-bold">{title}</h3>
    {points.length === 1
      ? <p className="mt-3 leading-7 text-[var(--muted)]">{points[0]}</p>
      : <ul className="mt-3 flex flex-col gap-2">
          {points.map((point) => (
            <li key={point} className="flex gap-3 leading-7 text-[var(--muted)]">
              <span aria-hidden="true" className={`mt-3 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "positive" ? "bg-[var(--accent)]" : "bg-[var(--muted)]"}`} />{point}
            </li>
          ))}
        </ul>}
  </div>;
}

function Taxonomy({ title, items }: { title: string; items: Array<{ name: string; href?: string }> }) {
  if (!items.length) return null;
  return <section className="mt-12">
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => item.href
        ? <Link key={item.name} href={item.href} className="tag hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">{item.name}</Link>
        : <span key={item.name} className="tag">{item.name}</span>)}
    </div>
  </section>;
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return productMetadata("Tool not found", "The requested tool could not be found.", slug);
  // seoTitle / seoDescription / canonicalUrl are editor-controlled overrides.
  // A stored seoTitle is used verbatim; only the generated fallback gets templated.
  const storedTitle = product.seoTitle?.trim();
  const title = storedTitle ?? `${product.name} review`;
  const description = product.seoDescription ?? product.shortDescription;
  const canonical = product.canonicalUrl ?? new URL(`/tools/${slug}`, siteUrl).toString();
  return {
    title: storedTitle ? { absolute: storedTitle } : title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: "TopToolsPick", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
