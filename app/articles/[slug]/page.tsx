import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticleBySlug } from "@/lib/articles";
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
  const publishedDate = formatDate(article.publishedAt);
  const description = articleDescription(article);
  const breadcrumbs = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "News", path: "/articles" }, { name: article.title, path: `/articles/${article.slug}` }]);
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
    <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1"><Link href="/" className="hover:text-[var(--ink)]">Home</Link><span aria-hidden="true">/</span><Link href="/articles" className="hover:text-[var(--ink)]">News</Link><span aria-hidden="true">/</span><span className="text-[var(--ink)]">{article.title}</span></nav>
    <header className="mx-auto mt-14 max-w-4xl">
      <p className="eyebrow">News</p>
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
  </article>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return buildMetadata("Article not found | TopToolsPick", "The requested article could not be found.", `/articles/${slug}`);
  const title = article.seoTitle ?? `${article.title} | TopToolsPick`;
  const description = article.seoDescription ?? articleDescription(article);
  const canonical = article.canonicalUrl ?? `${siteUrl}/articles/${article.slug}`;
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, siteName: "TopToolsPick", type: "article", ...(article.featuredImage ? { images: [article.featuredImage] } : {}), publishedTime: article.publishedAt?.toISOString(), authors: article.author ? [article.author] : undefined } };
}
