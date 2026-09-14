import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import { TOPIC_LABELS, getPublishedArticleBySlug, getRelatedPublishedArticles } from "@/lib/articles";
import { breadcrumbJsonLd, buildMetadata, jsonLd, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

function formatDate(value: Date | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(value);
}

function articleDescription(article: { excerpt: string | null; content: string }) {
  return article.excerpt ?? article.content.replace(/\s+/g, " ").slice(0, 155);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();
  const related = await getRelatedPublishedArticles(article.id, article.topic);
  const publishedDate = formatDate(article.publishedAt);
  const description = articleDescription(article);
  const kicker = TOPIC_LABELS[article.topic ?? ""] ?? "Guide";
  const isComparison = article.topic === "comparisons";
  const sectionName = isComparison ? "Comparisons" : "Guides";
  const sectionPath = isComparison ? "/comparisons" : "/articles";
  const breadcrumbs = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: sectionName, path: sectionPath }, { name: article.title, path: `/articles/${article.slug}` }]);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    mainEntityOfPage: `${siteUrl}/articles/${article.slug}`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    ...(article.author ? { author: { "@type": "Person", name: article.author } } : {}),
    ...(article.featuredImage ? { image: [article.featuredImage] } : {}),
    publisher: { "@type": "Organization", name: "TopToolsPick" },
  };

  return <article className="shell py-20 sm:py-28">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd)} />
    <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1"><Link href="/" className="hover:text-[var(--ink)]">Home</Link><span aria-hidden="true">/</span><Link href={sectionPath} className="hover:text-[var(--ink)]">{sectionName}</Link><span aria-hidden="true">/</span><span className="text-[var(--ink)]">{article.title}</span></nav>
    <header className="mx-auto mt-14 max-w-4xl">
      <p className="eyebrow">{kicker}</p>
      <h1 className="section-heading mt-5 max-w-4xl">{article.title}</h1>
      {article.excerpt && <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{article.excerpt}</p>}
      <div className="metadata mt-6 flex flex-wrap gap-x-4 gap-y-1">{article.author && <span>By {article.author}</span>}{publishedDate && <time dateTime={article.publishedAt?.toISOString()}>{publishedDate}</time>}</div>
    </header>
    {article.featuredImage && <div className="mx-auto mt-12 max-w-5xl overflow-hidden bg-[#edf6ff]">
      {/* CMS images may use arbitrary trusted media hosts. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={article.featuredImage} alt={article.title} loading="eager" className="max-h-[34rem] w-full object-cover" />
    </div>}
    <div className="mx-auto mt-14 max-w-2xl">
      <div className="article-content">{article.content.split(/\r?\n\r?\n/).filter(Boolean).map((paragraph, index) => <p key={`${article.id}-${index}`}>{paragraph}</p>)}</div>
      {article.source && <p className="mt-10 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">Source: {article.source}</p>}
    </div>

    {/* Article bodies are plain text, so this rail is the only route from editorial
        content into the commercial pages. It is also where the affiliate CTA belongs. */}
    {article.productLinks.length > 0 && (
      <section aria-labelledby="tools-mentioned" className="mx-auto mt-16 max-w-3xl border-t-2 border-[var(--accent)] pt-7">
        <p className="eyebrow">{isComparison ? "Tools compared" : "Tools mentioned"}</p>
        <h2 id="tools-mentioned" className="mt-4 text-3xl font-bold tracking-[-0.05em]">Where to go next</h2>
        <ul className="mt-7 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {article.productLinks.map(({ product, note }) => (
            <li key={product.id} className="grid gap-5 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <p className="eyebrow">{product.category.name}</p>
                <h3 className="mt-2 text-xl font-bold tracking-[-0.03em]">
                  <Link href={`/tools/${product.slug}`} className="hover:text-[var(--accent-deep)]">{product.name}</Link>
                </h3>
                <p className="mt-2 max-w-xl leading-7 text-[var(--muted)]">{note ?? product.shortDescription}</p>
                <DecisionBadges hasFreePlan={product.hasFreePlan} hasFreeTrial={product.hasFreeTrial} pricingModel={product.pricingModel} className="mt-4" />
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <Link href={`/tools/${product.slug}`} className="button-secondary">Read review</Link>
                <AffiliateCta product={product} placement="article-mentions" />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6"><Disclosure /></div>
      </section>
    )}

    {related.length > 0 && (
      <section aria-labelledby="related-reading" className="mx-auto mt-16 max-w-3xl border-t border-[var(--line)] pt-7">
        <p className="eyebrow">Keep reading</p>
        <h2 id="related-reading" className="mt-4 text-3xl font-bold tracking-[-0.05em]">Related</h2>
        <ul className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {related.map((item) => (
            <li key={item.id} className="py-5">
              <Link href={`/articles/${item.slug}`} className="group block">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">{TOPIC_LABELS[item.topic ?? ""] ?? "Guide"}</span>
                <span className="mt-2 block text-lg font-bold tracking-[-0.03em] group-hover:text-[var(--accent-deep)]">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )}
  </article>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return buildMetadata("Article not found", "The requested article could not be found.", `/articles/${slug}`);
  // A stored seoTitle is used verbatim; only the generated fallback gets templated.
  const storedTitle = article.seoTitle?.trim();
  const title = storedTitle ?? article.title;
  const description = article.seoDescription ?? articleDescription(article);
  const canonical = article.canonicalUrl ?? `${siteUrl}/articles/${article.slug}`;
  return { title: storedTitle ? { absolute: storedTitle } : title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, siteName: "TopToolsPick", type: "article", ...(article.featuredImage ? { images: [article.featuredImage] } : {}), publishedTime: article.publishedAt?.toISOString(), authors: article.author ? [article.author] : undefined } };
}
