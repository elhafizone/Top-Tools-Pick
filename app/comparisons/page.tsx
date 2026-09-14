import Link from "next/link";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { RuledGrid } from "@/components/layout/RuledGrid";
import { getArticlesByTopic } from "@/lib/articles";
import { getComparableCategories } from "@/lib/products";
import { buildMetadata, jsonLd, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata(
  "Tool comparisons",
  "Head-to-head comparisons with a clear verdict: which tool wins, for whom, and what it costs.",
  "/comparisons",
);

/**
 * The indexable half of the comparison story.
 *
 * The interactive builder at /compare is deliberately noindex - auto-generated
 * combinations are thin and near-duplicate. Written comparisons are ordinary
 * articles with topic="comparisons", so they reuse the whole editorial pipeline
 * (workflow, sitemap, Article JSON-LD) and are indexed like any other real page.
 */
export default async function ComparisonsPage() {
  const [articles, categories] = await Promise.all([
    getArticlesByTopic("comparisons"),
    getComparableCategories(),
  ]);

  const itemList = articles.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tool comparisons",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      url: new URL(`/articles/${article.slug}`, siteUrl).toString(),
    })),
  } : null;

  return (
    <section className="shell py-20 sm:py-28">
      {itemList && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(itemList)} />}

      <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1">
        <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--ink)]">Comparisons</span>
      </nav>

      <header className="mt-10 grid gap-8 border-b border-[var(--line)] pb-12 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div>
          <p className="eyebrow">Head to head</p>
          <h1 className="section-heading mt-5 max-w-4xl">Which one should you actually pick?</h1>
        </div>
        <p className="leading-7 text-[var(--muted)]">Every comparison ends with a verdict: who each tool wins for, where it loses, and what it costs to start.</p>
      </header>

      {articles.length > 0 ? (
        <ul className="mt-12 divide-y divide-[var(--line)] border-b border-[var(--line)]">
          {articles.map((article) => (
            <li key={article.id}>
              <Link href={`/articles/${article.slug}`} className="group block py-8">
                <span className="eyebrow">Comparison</span>
                <h2 className="mt-3 max-w-3xl text-2xl font-bold tracking-[-0.04em] group-hover:text-[var(--accent-deep)] sm:text-3xl">{article.title}</h2>
                {article.excerpt && <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{article.excerpt}</p>}
                {article.publishedAt && (
                  <p className="metadata mt-4">
                    <time dateTime={article.publishedAt.toISOString()}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(article.publishedAt)}</time>
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 border border-dashed border-[var(--line)] bg-white p-8 text-[var(--muted)]">
          <p>Written comparisons are being prepared. In the meantime you can build your own side-by-side below.</p>
        </div>
      )}

      {/* The self-service alternative, always offered. */}
      {categories.length > 0 && (
        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t-2 border-[var(--accent)] pt-7">
            <div>
              <p className="eyebrow">Build your own</p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em]">Compare any tools side by side</h2>
            </div>
            <Link href="/compare" className="editorial-link text-sm font-semibold">Open the tool &#8599;</Link>
          </div>
          <RuledGrid className="mt-8" columns="sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.slug} href={`/compare?category=${encodeURIComponent(category.slug)}`} className="ruled-cell group">
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-lg font-bold tracking-[-0.03em] group-hover:text-[var(--accent-deep)]">{category.name}</span>
                    <span className="mt-1 block text-sm text-[var(--muted)]">{category._count.products} tools to compare</span>
                  </span>
                  <span className="text-[var(--accent)]" aria-hidden="true">↗</span>
                </span>
              </Link>
            ))}
          </RuledGrid>
        </div>
      )}

      <div className="mt-12"><Disclosure /></div>
    </section>
  );
}
