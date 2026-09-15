import Link from "next/link";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { RuledGrid } from "@/components/layout/RuledGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
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
    <div>
      {itemList && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(itemList)} />}

      <section className="band">
        <div className="shell py-8 sm:py-12">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Comparisons" }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow">Head to head</p>
              <h1 className="section-heading mt-3 max-w-3xl">Which one should you actually pick?</h1>
            </div>
            <p className="lede">Every comparison ends with a verdict: who each tool wins for, where it loses, and what it costs to start.</p>
          </div>
        </div>
      </section>

      <section className="shell py-12 sm:py-16">
        {articles.length > 0 ? (
          <ul className="rule-list border-y border-[var(--line)]">
            {articles.map((article) => (
              <li key={article.id}>
                <Link href={`/articles/${article.slug}`} className="group block py-7">
                  <span className="eyebrow">Comparison</span>
                  <h2 className="mt-3 max-w-3xl text-xl font-bold tracking-[-0.025em] group-hover:text-[var(--accent-deep)] sm:text-2xl">{article.title}</h2>
                  {article.excerpt && <p className="mt-2 max-w-2xl leading-7 text-[var(--muted)]">{article.excerpt}</p>}
                  {article.publishedAt && (
                    <p className="metadata mt-4">
                      <time dateTime={article.publishedAt.toISOString()}>
                        {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(article.publishedAt)}
                      </time>
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-[var(--radius-surface)] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] p-8 text-[var(--muted)]">
            <p>Written comparisons are being prepared. In the meantime you can build your own side-by-side below.</p>
          </div>
        )}

        {/* The self-service alternative, always offered. */}
        {categories.length > 0 && (
          <div className="mt-16">
            <SectionHeader
              eyebrow="Build your own"
              title="Compare any tools side by side"
              intro="Pick a category, choose your finalists, and read them off one table."
              href="/compare"
              linkLabel="Open the comparison tool"
            />
            <RuledGrid className="mt-8" columns="sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 6).map((category) => (
                <Link key={category.slug} href={`/compare?category=${encodeURIComponent(category.slug)}`} className="ruled-cell group">
                  <span className="flex items-start justify-between gap-4">
                    <span>
                      <span className="block text-lg font-bold tracking-[-0.02em] group-hover:text-[var(--accent-deep)]">{category.name}</span>
                      <span className="mt-1 block text-sm text-[var(--muted)]">{category._count.products} tools to compare</span>
                    </span>
                    <span className="text-[var(--accent)] hover-shift" aria-hidden="true">&#8594;</span>
                  </span>
                </Link>
              ))}
            </RuledGrid>
          </div>
        )}

        <div className="mt-12"><Disclosure /></div>
      </section>
    </div>
  );
}
