import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { ProductRow } from "@/components/product/ProductRow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
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

/** A rough minutes-to-read figure. Useful context on a long guide, and honest enough. */
function readingMinutes(content: string) {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 220));
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
  const sectionName = isComparison ? "Comparisons" : "Guides & news";
  const sectionPath = isComparison ? "/comparisons" : "/articles";
  const paragraphs = article.content.split(/\r?\n\r?\n/).filter(Boolean);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: sectionName, path: sectionPath },
    { name: article.title, path: `/articles/${article.slug}` },
  ]);
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

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd)} />

      <section className="band">
        <div className="shell mx-auto max-w-5xl py-8 sm:py-12">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: sectionName, href: sectionPath }, { name: article.title }]} />
          <header className="reading-column mx-auto mt-10">
            <p className="eyebrow">{kicker}</p>
            <h1 className="section-heading mt-3">{article.title}</h1>
            {article.excerpt && <p className="lede mt-5">{article.excerpt}</p>}
            <div className="metadata mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--line)] pt-5">
              {article.author && <span className="font-semibold text-[var(--ink)]">By {article.author}</span>}
              {publishedDate && <time dateTime={article.publishedAt?.toISOString()}>{publishedDate}</time>}
              <span>{readingMinutes(article.content)} min read</span>
            </div>
          </header>
        </div>
      </section>

      {article.featuredImage && (
        <div className="shell mt-10">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[var(--radius-surface)] border border-[var(--line)] bg-[var(--surface-sunken)]">
            {/* CMS images may use arbitrary trusted media hosts. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.featuredImage} alt={article.title} loading="eager" className="max-h-[32rem] w-full object-cover" />
          </div>
        </div>
      )}

      <div className="shell mx-auto max-w-5xl py-12 sm:py-16">
        <div className="article-content reading-column mx-auto">
          {paragraphs.map((paragraph, index) => <p key={`${article.id}-${index}`}>{paragraph}</p>)}
        </div>
        {article.source && (
          <p className="reading-column mx-auto mt-10 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">Source: {article.source}</p>
        )}

        {/* Article bodies are plain text, so this rail is the only route from editorial
            content into the commercial pages. It is also where the affiliate CTA belongs. */}
        {article.productLinks.length > 0 && (
          <section aria-labelledby="tools-mentioned" className="mt-14">
            <p className="eyebrow">{isComparison ? "Tools compared" : "Tools mentioned"}</p>
            <h2 id="tools-mentioned" className="section-heading mt-3 border-b border-[var(--line)] pb-5">Where to go next</h2>
            <div className="rule-list border-b border-[var(--line)]">
              {article.productLinks.map(({ product, note }) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  reason={note ? { label: "In this piece:", text: note } : null}
                  action={<AffiliateCta product={product} placement="article-mentions" className="w-full" />}
                />
              ))}
            </div>
            <div className="mt-6"><Disclosure /></div>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-reading" className="mt-14">
            <p className="eyebrow">Keep reading</p>
            <h2 id="related-reading" className="section-heading mt-3 border-b border-[var(--line)] pb-5">Related</h2>
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id} className="border-b border-[var(--line)]">
                  <Link href={`/articles/${item.slug}`} className="group block py-6">
                    <span className="eyebrow">{TOPIC_LABELS[item.topic ?? ""] ?? "Guide"}</span>
                    <span className="mt-3 block text-lg font-bold leading-snug tracking-[-0.02em] group-hover:text-[var(--accent-deep)]">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
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
  return {
    title: storedTitle ? { absolute: storedTitle } : title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "TopToolsPick",
      type: "article",
      ...(article.featuredImage ? { images: [article.featuredImage] } : {}),
      publishedTime: article.publishedAt?.toISOString(),
      authors: article.author ? [article.author] : undefined,
    },
  };
}
