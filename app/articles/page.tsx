import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { TOPIC_LABELS, getPublishedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata("Guides & news", "Useful ideas, practical guides, and editorial notes for better digital work.", "/articles");

type ArticleListItem = Awaited<ReturnType<typeof getPublishedArticles>>["articles"][number];

function formatDate(value: Date | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

const kickerFor = (topic: string | null) => TOPIC_LABELS[topic ?? ""] ?? "Guide";

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const { articles, page, totalPages, total } = await getPublishedArticles(requestedPage);
  // Without this, ?page=999 renders an empty body with a live paginator.
  if (total > 0 && page > totalPages) notFound();
  const featured = page === 1 ? articles[0] : undefined;
  const remaining = featured ? articles.slice(1) : articles;

  return (
    <div>
      <section className="band">
        <div className="shell py-8 sm:py-12">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides & news" }]} />
          <div className="mt-8 max-w-3xl">
            <p className="eyebrow">From the desk</p>
            <h1 className="section-heading mt-3">Useful technology, clearly considered.</h1>
            <p className="lede mt-5">
              Practical notes on AI, productivity and the tools shaping better digital work &mdash; written to help you decide, not to fill a page.
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-12 sm:py-16">
        {total === 0 ? <EmptyState /> : (
          <>
            {featured && <FeaturedArticle article={featured} />}
            {remaining.length > 0 && (
              <div className={`grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 ${featured ? "mt-12" : ""}`}>
                {remaining.map((article) => <ArticleCard key={article.id} article={article} />)}
              </div>
            )}
            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
          </>
        )}
      </section>
    </div>
  );
}

function FeaturedArticle({ article }: { article: ArticleListItem }) {
  // No stock placeholder when a piece has no image: an empty tinted box reads as a
  // broken layout, where a full-width text lead reads as a deliberate editorial choice.
  const hasImage = Boolean(article.featuredImage);
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group grid gap-8 border-b border-[var(--line)] pb-10 ${hasImage ? "md:grid-cols-[1.05fr_.95fr] md:items-center" : ""}`}
    >
      {hasImage && (
        <div className="min-w-0 md:order-2">
          <ArticleImage article={article} featured />
        </div>
      )}
      <div className="min-w-0 md:order-1">
        <p className="eyebrow">{kickerFor(article.topic)} &middot; Featured</p>
        <h2 className="section-heading mt-4 max-w-3xl group-hover:text-[var(--accent-deep)]">
          {article.title}
        </h2>
        {article.excerpt && <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">{article.excerpt}</p>}
        <ArticleMeta article={article} />
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: ArticleListItem }) {
  return (
    <article className="group flex h-full flex-col border-b border-[var(--line)] py-7">
      {article.featuredImage && <ArticleImage article={article} />}
      <div className={`flex flex-1 flex-col ${article.featuredImage ? "pt-5" : ""}`}>
        <p className="eyebrow">{kickerFor(article.topic)}</p>
        <h2 className="mt-3 text-lg font-bold leading-snug tracking-[-0.02em]">
          <Link href={`/articles/${article.slug}`} className="group-hover:text-[var(--accent-deep)]">{article.title}</Link>
        </h2>
        {article.excerpt && <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{article.excerpt}</p>}
        <ArticleMeta article={article} />
      </div>
    </article>
  );
}

function ArticleImage({ article, featured = false }: { article: { title: string; featuredImage: string | null }; featured?: boolean }) {
  if (!article.featuredImage) return null;
  return (
    <div className={`overflow-hidden rounded-[var(--radius-surface)] border border-[var(--line)] bg-[var(--surface-sunken)] ${featured ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
      {/* CMS images may use arbitrary trusted media hosts. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={article.featuredImage}
        alt={article.title}
        loading={featured ? "eager" : "lazy"}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
}

function ArticleMeta({ article }: { article: { author: string | null; publishedAt: Date | null } }) {
  return (
    <div className="metadata mt-5 flex flex-wrap gap-x-4 gap-y-1">
      {article.author && <span>By {article.author}</span>}
      {article.publishedAt && <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>}
    </div>
  );
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  return (
    <nav aria-label="Article pages" className="mt-12 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-6 text-sm">
      {page > 1 ? <Link href={`/articles?page=${page - 1}`} className="button-secondary">&#8592; Newer</Link> : <span />}
      <span className="text-[var(--muted)]">Page {page} of {totalPages}</span>
      {page < totalPages ? <Link href={`/articles?page=${page + 1}`} className="button-secondary">Older &#8594;</Link> : <span />}
    </nav>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[var(--radius-surface)] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] p-8 sm:p-12">
      <p className="eyebrow">Coming soon</p>
      <h2 className="sub-heading mt-3">The journal is being edited.</h2>
      <p className="mt-3 max-w-xl leading-7 text-[var(--muted)]">
        There are no published articles yet. Check back soon for practical notes and guides from the TopToolsPick editorial team.
      </p>
      <Link href="/tools" className="button-primary mt-7">Explore tools</Link>
    </div>
  );
}
