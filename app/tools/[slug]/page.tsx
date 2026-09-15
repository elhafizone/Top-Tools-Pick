import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import { AlternativesSection } from "@/components/product/AlternativesSection";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductLogo } from "@/components/product/ProductLogo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Rating, ScoreMeter } from "@/components/ui/Rating";
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
  const reviewedOn = product.lastReviewedAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(product.lastReviewedAt)
    : null;

  /* An in-page contents bar. A buying guide is long by design, so the sections it
     actually has are listed up front rather than leaving people to scroll and guess. */
  const sections = [
    { id: "overview", label: "Overview", show: true },
    { id: "fit", label: "Who it's for", show: bestForPoints.length > 0 || notForPoints.length > 0 },
    { id: "features", label: "Features", show: featurePoints.length > 0 },
    { id: "pricing", label: "Pricing", show: product.pricingPlans.length > 0 },
    { id: "pros-cons", label: "Pros & cons", show: prosPoints.length > 0 || consPoints.length > 0 },
    { id: "alternatives", label: "Alternatives", show: alternatives.length > 0 },
    { id: "verdict", label: "Verdict", show: Boolean(product.verdict) },
  ].filter((section) => section.show);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: product.category.name, path: `/categories/${product.category.slug}` },
    { name: product.name, path: `/tools/${product.slug}` },
  ]);
  // Keeps websiteUrl (never the affiliate URL) and only emits offers where a plan has
  // both a numeric price and a currency.
  const softwareJsonLd = softwareApplicationJsonLd(product);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(softwareJsonLd)} />

      {/* Identity and decision summary. Everything needed to judge fit is above the fold. */}
      <section className="band">
        <div className="shell py-8 sm:py-12">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: product.category.name, href: `/categories/${product.category.slug}` },
              { name: product.name },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-14">
            <div className="min-w-0">
              <div className="flex items-start gap-5">
                <ProductLogo name={product.name} logoUrl={product.logoUrl} size="xl" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/categories/${product.category.slug}`} className="badge hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">
                      {product.category.name}
                    </Link>
                    {product.verified && <span className="badge badge-accent">Verified listing</span>}
                  </div>
                  <h1 className="section-heading mt-3 break-words">{product.name}</h1>
                </div>
              </div>

              <p className="lede mt-6 max-w-2xl">{product.shortDescription}</p>

              {bestForPoints.length > 0 && (
                <p className="mt-5 max-w-2xl leading-7 text-[var(--ink-body)]">
                  <span className="font-semibold text-[var(--ink)]">Best for:</span> {bestForPoints.join(" · ")}
                </p>
              )}

              <DecisionBadges
                hasFreePlan={product.hasFreePlan}
                hasFreeTrial={product.hasFreeTrial}
                pricingModel={product.pricingModel}
                entryPriceLabel={entryPrice}
                className="mt-6"
              />

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">
                <Rating value={Number(product.rating)} />
                <span>
                  Editorial score <strong className="font-semibold text-[var(--ink)]">{product.editorialScore}</strong>/100
                </span>
                {reviewedOn && <span>Last reviewed {reviewedOn}</span>}
                {websiteHost && <span className="truncate">{websiteHost}</span>}
              </div>
            </div>

            {/* The decision panel. One primary action, then the two things people do
                instead of converting: check the alternatives, or line it up against rivals. */}
            <div className="h-fit lg:sticky lg:top-24">
              <div className="panel panel-raised p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                  {/* "Starts at" in front of "Free plan available" reads as a mistake, so
                      the price framing is only used when the stored label is a price. */}
                  {entryPrice ? (/[\d$£€]/.test(entryPrice) ? "Starts at" : "Entry plan") : "Get started"}
                </p>
                {entryPrice && <p className="mt-1.5 text-xl font-bold tracking-[-0.03em] text-[var(--ink)] sm:text-2xl">{entryPrice}</p>}

                <div className="mt-5">
                  {ctaUrl
                    ? <AffiliateCta product={product} placement="tool-hero" className="w-full" showCaption />
                    : <p className="text-sm text-[var(--muted)]">No verified link is available for this tool yet.</p>}
                </div>

                <ScoreMeter score={product.editorialScore} className="mt-6 border-t border-[var(--line)] pt-5" />

                <div className="mt-5 flex flex-col gap-2.5 border-t border-[var(--line)] pt-5 text-sm">
                  {alternatives.length > 0 && (
                    <Link href={`/tools/${product.slug}/alternatives`} className="inline-flex items-center gap-1.5 font-semibold text-[var(--accent-deep)]">
                      See {alternatives.length} alternatives <span aria-hidden="true">&#8594;</span>
                    </Link>
                  )}
                  <Link
                    href={`/compare?category=${encodeURIComponent(product.category.slug)}&tools=${encodeURIComponent(product.slug)}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-[var(--accent-deep)]"
                  >
                    Compare with similar tools <span aria-hidden="true">&#8594;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {sections.length > 1 && (
        <nav aria-label="On this page" className="band-sunken sticky top-[4.25rem] z-30 -mt-px">
          <div className="shell scroll-x-quiet">
            <ul className="flex min-w-max gap-6 py-3.5 text-sm font-medium">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="whitespace-nowrap text-[var(--muted)] hover:text-[var(--accent-deep)]">{section.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      <div className="shell grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <div className="min-w-0">
          <section aria-labelledby="overview" className="scroll-mt-32">
            <p className="eyebrow">The editorial note</p>
            <h2 id="overview" className="section-heading mt-3">What to know about {product.name}</h2>
            <div className="article-content reading-column mt-5">
              {product.description.split(/\r?\n\r?\n/).filter(Boolean).map((paragraph, index) => (
                <p key={`${product.id}-overview-${index}`}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Fit before features: the question people actually arrive with. */}
          {(bestForPoints.length > 0 || notForPoints.length > 0) && (
            <section aria-labelledby="fit" className="mt-14 scroll-mt-32">
              <p className="eyebrow">Is it right for you?</p>
              <h2 id="fit" className="section-heading mt-3">Who {product.name} suits</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {bestForPoints.length > 0 && <PointList title="Choose it if" points={bestForPoints} tone="positive" />}
                {notForPoints.length > 0 && <PointList title="Look elsewhere if" points={notForPoints} tone="neutral" />}
              </div>
            </section>
          )}

          {featurePoints.length > 0 && (
            <section aria-labelledby="features" className="mt-14 scroll-mt-32">
              <p className="eyebrow">What you get</p>
              <h2 id="features" className="section-heading mt-3">Key features</h2>
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {featurePoints.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-6 text-[var(--ink-body)]">
                    <span aria-hidden="true" className="mt-1 font-bold text-[var(--accent-deep)]">&#10003;</span>{point}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {product.pricingPlans.length > 0 && (
            <section aria-labelledby="pricing" className="mt-14 scroll-mt-32">
              <p className="eyebrow">What it costs</p>
              <h2 id="pricing" className="section-heading mt-3">Pricing</h2>
              <div className="table-scroll mt-6 border-t border-[var(--line-strong)]">
                <table className="data-table">
                  <caption className="sr-only">{product.name} pricing plans</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="min-w-[10rem] text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Plan</th>
                      <th scope="col" className="min-w-[9rem] border-l border-[var(--line)] text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Price</th>
                      <th scope="col" className="min-w-[14rem] border-l border-[var(--line)] text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">What it includes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.pricingPlans.map((plan) => (
                      <tr key={plan.id}>
                        <th scope="row" className="!normal-case !tracking-normal !text-[var(--ink)] !text-sm">{plan.name}</th>
                        <td>
                          <span className="font-semibold text-[var(--ink)]">{plan.priceLabel}</span>
                          {plan.billingPeriod && <span className="mt-0.5 block text-xs text-[var(--muted)]">Billed {plan.billingPeriod}</span>}
                        </td>
                        <td>{plan.description ?? <span className="no-mark">&mdash;</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-[var(--muted)]">Prices are recorded from the vendor&apos;s public pricing page and can change. Check before you buy.</p>
            </section>
          )}

          {(prosPoints.length > 0 || consPoints.length > 0) && (
            <section aria-labelledby="pros-cons" className="mt-14 scroll-mt-32">
              <p className="eyebrow">The trade-off</p>
              <h2 id="pros-cons" className="section-heading mt-3">Pros and cons</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {prosPoints.length > 0 && <PointList title="Pros" points={prosPoints} tone="positive" />}
                {consPoints.length > 0 && <PointList title="Cons" points={consPoints} tone="neutral" />}
              </div>
            </section>
          )}

          <section aria-labelledby="at-a-glance" className="mt-14 scroll-mt-32">
            <p className="eyebrow">Quick read</p>
            <h2 id="at-a-glance" className="section-heading mt-3">At a glance</h2>
            <dl className="mt-6 rule-list border-y border-[var(--line)]">
              <InfoRow label="Category" value={product.category.name} />
              <InfoRow label="Pricing model" value={formatLabel(product.pricingModel)} />
              {entryPrice && <InfoRow label="Entry plan" value={entryPrice} />}
              <InfoRow label="Free plan" value={product.hasFreePlan ? "Available" : "Not listed"} yes={product.hasFreePlan} />
              <InfoRow label="Free trial" value={product.hasFreeTrial ? "Available" : "Not listed"} yes={product.hasFreeTrial} />
              {product.platforms.length > 0 && <InfoRow label="Platforms" value={product.platforms.map(({ platform }) => platform.name).join(", ")} />}
              {websiteHost && <InfoRow label="Website" value={websiteHost} />}
              {reviewedOn && <InfoRow label="Last reviewed" value={reviewedOn} />}
            </dl>
          </section>

          {/* Link out whenever the dedicated page is indexable, so internal linking
              reinforces the page we actually want ranked - not only when it holds more
              rows than this section already shows. */}
          <div id="alternatives" className="scroll-mt-32">
            <AlternativesSection
              items={alternatives.slice(0, 4)}
              productName={product.name}
              moreHref={alternatives.length >= INDEXABLE_ALTERNATIVES ? `/tools/${product.slug}/alternatives` : undefined}
            />
          </div>

          {comparisonArticles.length > 0 && (
            <section aria-labelledby="comparisons-heading" className="mt-14">
              <p className="eyebrow">Head to head</p>
              <h2 id="comparisons-heading" className="section-heading mt-3">{product.name} compared</h2>
              <ul className="mt-6 rule-list border-y border-[var(--line)]">
                {comparisonArticles.map((link) => (
                  <li key={link.articleId}>
                    <Link href={`/articles/${link.article.slug}`} className="group block py-5">
                      <span className="text-lg font-bold tracking-[-0.02em] group-hover:text-[var(--accent-deep)]">{link.article.title}</span>
                      {link.note && <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{link.note}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* The verdict, with the CTA repeated at the point of decision. */}
          {product.verdict && (
            <section aria-labelledby="verdict" className="mt-14 scroll-mt-32">
              <div className="panel panel-raised border-l-[3px] border-l-[var(--accent)] p-6 sm:p-8">
                <p className="eyebrow">The verdict</p>
                <h2 id="verdict" className="section-heading mt-3">Our take on {product.name}</h2>
                <div className="article-content reading-column mt-5">
                  {product.verdict.split(/\r?\n\r?\n/).filter(Boolean).map((paragraph, index) => (
                    <p key={`${product.id}-verdict-${index}`}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-6">
                  <AffiliateCta product={product} placement="tool-verdict" />
                  <Link href={`/compare?category=${encodeURIComponent(product.category.slug)}&tools=${encodeURIComponent(product.slug)}`} className="button-secondary">
                    Compare before deciding
                  </Link>
                </div>
              </div>
            </section>
          )}

          {product.reviews.length > 0 && (
            <section aria-labelledby="reviews-heading" className="mt-14">
              <p className="eyebrow">Editorial review</p>
              <h2 id="reviews-heading" className="section-heading mt-3">From the journal</h2>
              {product.reviews.map((review) => (
                <div key={review.id} className="mt-6 border-l-2 border-[var(--accent)] pl-5">
                  <h3 className="sub-heading">{review.title}</h3>
                  <p className="article-content reading-column mt-3">{review.body}</p>
                  <p className="metadata mt-3">By {review.author}</p>
                </div>
              ))}
            </section>
          )}

          {(product.editorialItems.length > 0 || mentionedIn.length > 0) && (
            <section aria-labelledby="mentioned-heading" className="mt-14">
              <p className="eyebrow">Where this appears</p>
              <h2 id="mentioned-heading" className="section-heading mt-3">Mentioned in</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {product.editorialItems.map((item) => (
                  <li key={item.id}>
                    <Link href={`/best/${item.list.slug}`} className="badge hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">
                      {item.list.title}{item.award ? ` — ${item.award}` : ""}
                    </Link>
                  </li>
                ))}
                {mentionedIn.map((link) => (
                  <li key={link.articleId}>
                    <Link href={`/articles/${link.article.slug}`} className="badge hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">
                      {link.article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* These were inert <span>s while the query helpers behind them sat unused,
              so every taxonomy term was a dead end. They are real destinations now. */}
          <div className="mt-14 border-t border-[var(--line)] pt-8">
            <Taxonomy title="Use cases" items={product.useCases.map(({ useCase }) => ({ name: useCase.name, href: `/tools/use-case/${useCase.slug}` }))} />
            <Taxonomy title="Audiences" items={product.audiences.map(({ audience }) => ({ name: audience.name, href: `/tools/audience/${audience.slug}` }))} />
            <Taxonomy title="Platforms" items={product.platforms.map(({ platform }) => ({ name: platform.name, href: `/tools/platform/${platform.slug}` }))} />
            <Taxonomy title="Tags" items={product.tags.map(({ tag }) => ({ name: tag.name }))} />
          </div>
        </div>

        <aside className="h-fit lg:sticky lg:top-32">
          <div className="border-t-2 border-[var(--ink)] pt-5">
            <p className="eyebrow">Trust &amp; transparency</p>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              We may earn a commission when you visit a merchant through a labelled affiliate link.
              This does not change your price, and it never changes a ranking.
            </p>
            {programDisclosure && <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{programDisclosure}</p>}
            <div className="mt-5"><Disclosure /></div>
            <Link href="/methodology" className="editorial-link mt-5 inline-block text-sm font-semibold text-[var(--ink)]">How we pick</Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="band-sunken">
          <div className="shell py-14 sm:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
              <div>
                <p className="eyebrow">Keep exploring</p>
                <h2 className="section-heading mt-3">More from {product.category.name}</h2>
              </div>
              <Link href={`/categories/${product.category.slug}`} className="text-sm font-semibold text-[var(--accent-deep)]">View category</Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function InfoRow({ label, value, yes }: { label: string; value: string; yes?: boolean }) {
  return (
    <div className="flex flex-wrap justify-between gap-3 py-3.5 text-sm">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className={`text-right font-semibold ${yes === false ? "text-[var(--muted-soft)]" : "text-[var(--ink)]"}`}>
        {yes === true && <span aria-hidden="true" className="yes-mark mr-1.5">&#10003;</span>}
        {value}
      </dd>
    </div>
  );
}

/**
 * Renders a free-text column as a list when the editor used separators, and as a
 * paragraph when they wrote one sentence - so existing rows keep reading naturally.
 */
function PointList({ title, points, tone }: { title: string; points: string[]; tone: "positive" | "neutral" }) {
  return (
    <div className={`panel h-full p-5 sm:p-6 ${tone === "positive" ? "border-[var(--accent-line)] bg-[var(--accent-soft)]" : ""}`}>
      <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[var(--ink)]">{title}</h3>
      {points.length === 1
        ? <p className="mt-3 leading-7 text-[var(--ink-body)]">{points[0]}</p>
        : (
          <ul className="mt-3 flex flex-col gap-2.5">
            {points.map((point) => (
              <li key={point} className="flex gap-3 leading-6 text-[var(--ink-body)]">
                <span aria-hidden="true" className={tone === "positive" ? "font-bold text-[var(--accent-deep)]" : "text-[var(--muted-soft)]"}>
                  {tone === "positive" ? "✓" : "–"}
                </span>
                {point}
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}

function Taxonomy({ title, items }: { title: string; items: Array<{ name: string; href?: string }> }) {
  if (!items.length) return null;
  return (
    <section className="mt-6 first:mt-0">
      <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-[var(--muted)]">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => item.href
          ? <Link key={item.name} href={item.href} className="badge hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">{item.name}</Link>
          : <span key={item.name} className="badge">{item.name}</span>)}
      </div>
    </section>
  );
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
