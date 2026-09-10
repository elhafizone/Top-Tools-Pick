import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getPublishedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata("News | TopToolsPick", "Useful ideas, practical guides, and editorial notes for better digital work.", "/articles");

function formatDate(value: Date | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const { articles, page, totalPages, total } = await getPublishedArticles(requestedPage);
  const featured = page === 1 ? articles[0] : undefined;
  const remaining = featured ? articles.slice(1) : articles;

  return <section className="shell py-20 sm:py-28">
    <header className="max-w-3xl">
      <p className="eyebrow">News & ideas</p>
      <h1 className="section-heading mt-5">Useful technology, clearly considered.</h1>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">Concise editorial notes on AI, productivity, and the tools shaping better digital work.</p>
    </header>

    {total === 0 ? <EmptyState /> : <div className="mt-12">
      {featured && <FeaturedArticle article={featured} />}
      {remaining.length > 0 && <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{remaining.map((article) => <ArticleCard key={article.id} article={article} />)}</div>}
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
    </div>}
  </section>;
}

function FeaturedArticle({ article }: { article: Awaited<ReturnType<typeof getPublishedArticles>>["articles"][number] }) {
  return <Link href={`/articles/${article.slug}`} className="group grid overflow-hidden border border-[var(--line)] bg-[var(--ink)] text-white md:grid-cols-[1.1fr_.9fr]">
    <div className="flex min-h-80 flex-col justify-end p-7 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2180F8]">Featured news</p>
      <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-[-0.05em] sm:text-4xl">{article.title}</h2>
      {article.excerpt && <p className="mt-4 max-w-xl text-sm leading-7 text-[#c9d0c6]">{article.excerpt}</p>}
      <ArticleMeta article={article} inverted />
    </div>
    <ArticleImage article={article} featured />
  </Link>;
}

function ArticleCard({ article }: { article: Awaited<ReturnType<typeof getPublishedArticles>>["articles"][number] }) {
  return <article className="flex h-full flex-col border-b border-[var(--line)] pb-7">
    <ArticleImage article={article} />
    <div className="flex flex-1 flex-col pt-6">
      <p className="eyebrow">News</p>
      <h2 className="mt-3 text-xl font-bold tracking-[-0.03em]"><Link href={`/articles/${article.slug}`} className="hover:text-[#2180F8]">{article.title}</Link></h2>
      {article.excerpt && <p className="mt-3 flex-1 text-sm leading-6 text-[#68707d]">{article.excerpt}</p>}
      <ArticleMeta article={article} />
    </div>
  </article>;
}

function ArticleImage({ article, featured = false }: { article: { title: string; featuredImage: string | null }; featured?: boolean }) {
  if (!article.featuredImage) return <div className={`flex items-end border-b border-[var(--line)] bg-[var(--blue-wash)] p-6 text-sm font-semibold text-[var(--accent-deep)] ${featured ? "min-h-32 md:min-h-full" : "h-20"}`}>Editorial note</div>;
  return <div className={`${featured ? "min-h-64 md:min-h-full" : "h-44"} overflow-hidden bg-[#edf6ff]`}>
    {/* CMS images may use arbitrary trusted media hosts. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={article.featuredImage} alt={article.title} loading={featured ? "eager" : "lazy"} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
  </div>;
}

function ArticleMeta({ article, inverted = false }: { article: { author: string | null; publishedAt: Date | null }; inverted?: boolean }) {
  return <div className={`mt-6 flex flex-wrap gap-x-4 gap-y-1 text-xs ${inverted ? "text-[#aeb7ad]" : "text-[#7d8796]"}`}>
    {article.author && <span>By {article.author}</span>}
    {article.publishedAt && <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>}
  </div>;
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  return <nav aria-label="Article pages" className="mt-10 flex items-center justify-between border-t border-[#e4e7ed] pt-5 text-sm">
    {page > 1 ? <Link href={`/articles?page=${page - 1}`} className="editorial-link font-semibold">← Newer articles</Link> : <span />}
    <span className="text-[#68707d]">Page {page} of {totalPages}</span>
    {page < totalPages ? <Link href={`/articles?page=${page + 1}`} className="editorial-link font-semibold">Older articles →</Link> : <span />}
  </nav>;
}

function EmptyState() {
  return <div className="mt-12 border border-dashed border-[#c9d4e2] bg-[#ffffff] p-8 sm:p-12"><p className="eyebrow">Coming soon</p><h2 className="mt-4 text-2xl font-bold tracking-[-0.04em]">The journal is being edited.</h2><p className="mt-3 max-w-xl leading-7 text-[#68707d]">There are no published articles yet. Check back soon for practical notes and guides from the TopToolsPick editorial team.</p><Link href="/tools" className="button-primary mt-7">Explore tools ↗</Link></div>;
}
