import Link from "next/link";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { getPublishedArticles } from "@/lib/articles";
import { MAX_COMPARE, MIN_COMPARE, getComparableCategories, getFeaturedProducts, getPublishedCategories, getPublishedEditorialLists } from "@/lib/products";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories, comparableCategories, editorialLists, articles, stories] = await Promise.all([
    getFeaturedProducts(),
    getPublishedCategories(),
    getComparableCategories(),
    getPublishedEditorialLists(),
    getPublishedArticles(1),
    prisma.story.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3 }),
  ]);

  const leadProduct = products[0];
  const supportingProducts = products.slice(1, 4);
  const leadArticle = articles.articles[0];
  const supportingArticles = articles.articles.slice(1, 3);

  return (
    <div>
      <section className="border-b border-[var(--line)] bg-white">
        <div className="shell grid gap-14 py-20 sm:py-28 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:gap-20 lg:py-36">
          <div>
            <p className="eyebrow">Independent tool discovery</p>
            <h1 className="display-heading mt-7 max-w-4xl">
              Find the tools that make <span className="text-[var(--accent)]">good work easier.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--muted)]">
              TopToolsPick is a considered guide to software, AI products, and digital services worth your time. Start with what you need, not an endless directory.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/tools" className="button-primary">Explore the tools <span aria-hidden="true">↗</span></Link>
              <Link href="/articles" className="button-secondary">Read the latest</Link>
            </div>
            <div className="mt-8 max-w-md"><Disclosure /></div>
          </div>
          <div className="border-l-2 border-[var(--accent)] pl-6 sm:pl-8 lg:mb-3">
            <p className="eyebrow">A clearer starting point</p>
            <p className="mt-5 max-w-sm text-2xl font-bold leading-tight tracking-[-0.04em] text-[var(--ink)]">
              Useful recommendations, editorial context, and fewer tabs to compare.
            </p>
            <div className="mt-9 grid max-w-sm grid-cols-3 gap-4 border-t border-[var(--line)] pt-5">
              <Metric value={products.length} label="featured tools" />
              <Metric value={categories.length} label="ways to explore" />
              <Metric value={articles.total} label="editorial notes" />
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-20 sm:py-28">
        <SectionIntro eyebrow="The shortlist" title="Tools with a point of view." href="/tools" linkLabel="Browse all tools" />
        {leadProduct ? (
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.08fr_.92fr]">
            <LeadProduct product={leadProduct} />
            <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {supportingProducts.map((product, index) => <SupportingProduct key={product.id} product={product} index={index} />)}
            </div>
          </div>
        ) : <EmptySection message="Featured tools are being edited. Explore the full directory for now." href="/tools" />}
      </section>

      <section className="border-y border-[var(--line)] bg-white">
        <div className="shell py-20 sm:py-28">
          <SectionIntro eyebrow="Explore by need" title="Start with a direction." />
          {categories.length ? (
            <div className="mt-10 grid border-t border-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 6).map((category, index) => (
                <Link key={category.id} href={`/categories/${category.slug}`} className="group border-b border-[var(--line)] py-6 pr-6 sm:nth-[even]:border-l sm:nth-[even]:pl-6 lg:nth-[3n+2]:border-l lg:nth-[3n+2]:pl-6 lg:nth-[3n]:border-l lg:nth-[3n]:pl-6">
                  <span className="text-xs font-bold tracking-[0.16em] text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mt-4 flex items-start justify-between gap-4">
                    <span>
                      <span className="block text-xl font-bold tracking-[-0.03em] group-hover:text-[var(--accent-deep)]">{category.name}</span>
                      <span className="mt-2 block max-w-xs text-sm leading-6 text-[var(--muted)]">{category.description ?? "Explore our editorial picks."}</span>
                    </span>
                    <span className="text-xl text-[var(--accent)]" aria-hidden="true">↗</span>
                  </span>
                </Link>
              ))}
            </div>
          ) : <EmptySection message="Categories are being prepared." href="/tools" />}
        </div>
      </section>

      {(leadArticle || stories.length > 0) && (
        <section className="shell py-20 sm:py-28">
          <SectionIntro eyebrow="From the journal" title="Ideas for better digital work." href="/articles" linkLabel="All news" />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              {leadArticle ? <Link href={`/articles/${leadArticle.slug}`} className="group block border-b border-[var(--line)] pb-8">
                <span className="eyebrow">Featured note</span>
                <h3 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.05em] sm:text-4xl group-hover:text-[var(--accent-deep)]">{leadArticle.title}</h3>
                {leadArticle.excerpt && <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">{leadArticle.excerpt}</p>}
                <EditorialMeta author={leadArticle.author} publishedAt={leadArticle.publishedAt} />
              </Link> : <EmptySection message="News notes are coming soon." href="/tools" />}
              {supportingArticles.length > 0 && <div className="grid gap-x-8 sm:grid-cols-2">
                {supportingArticles.map((article) => <Link key={article.id} href={`/articles/${article.slug}`} className="group border-b border-[var(--line)] py-6">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">News</span>
                  <h3 className="mt-3 text-xl font-bold leading-tight tracking-[-0.03em] group-hover:text-[var(--accent-deep)]">{article.title}</h3>
                  <EditorialMeta author={article.author} publishedAt={article.publishedAt} />
                </Link>)}
              </div>}
            </div>
            {stories.length > 0 && <div className="border-t border-[var(--ink)] pt-5">
              <div className="flex items-center justify-between gap-4"><p className="eyebrow">Visual guides</p><Link href="/stories" className="editorial-link text-sm font-semibold">View stories ↗</Link></div>
              <div className="mt-6">{stories.map((story, index) => <Link key={story.id} href={`/stories/${story.slug}`} className="group block border-b border-[var(--line)] py-5 first:pt-0">
                <span className="text-xs font-bold text-[var(--accent)]">0{index + 1}</span>
                <h3 className="mt-2 text-xl font-bold leading-tight tracking-[-0.03em] group-hover:text-[var(--accent-deep)]">{story.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{story.description}</p>
              </Link>)}</div>
            </div>}
          </div>
        </section>
      )}

      {(comparableCategories.length > 0 || editorialLists.length > 0) && <section className="bg-[var(--ink)] text-white">
        <div className="shell grid gap-12 py-20 sm:py-28 lg:grid-cols-2">
          {comparableCategories.length > 0 && <DiscoveryColumn eyebrow="Make a decision" title="Compare them yourself." href="/compare" linkLabel="Open the comparison tool">
            <p className="pb-2 text-sm leading-6 text-[#aeb4c2]">Pick a category, then line up {MIN_COMPARE}&ndash;{MAX_COMPARE} tools on pricing, ratings and platforms.</p>
            {comparableCategories.slice(0, 3).map((category) => <Link key={category.slug} href={`/compare?category=${encodeURIComponent(category.slug)}`} className="group flex items-center justify-between gap-4 border-b border-[#303640] py-5">
              <span><span className="block font-bold group-hover:text-[#7eb8ff]">{category.name}</span><span className="mt-1 block text-sm text-[#aeb4c2]">{category._count.products} tools to compare</span></span><span className="text-[#7eb8ff]" aria-hidden="true">↗</span>
            </Link>)}
          </DiscoveryColumn>}
          {editorialLists.length > 0 && <DiscoveryColumn eyebrow="Curated collections" title="A shorter way to choose." href="/best" linkLabel="View best picks">
            {editorialLists.slice(0, 3).map((list) => <Link key={list.slug} href={`/best/${list.slug}`} className="group block border-b border-[#303640] py-5 first:pt-0">
              <span className="block font-bold group-hover:text-[#7eb8ff]">{list.title}</span><span className="mt-1 block text-sm leading-6 text-[#aeb4c2]">{list.description}</span>
            </Link>)}
          </DiscoveryColumn>}
        </div>
      </section>}

      <section className="shell py-20 sm:py-28">
        <div className="border-t-2 border-[var(--accent)] pt-7 sm:flex sm:items-end sm:justify-between sm:gap-10">
          <div><p className="eyebrow">Keep exploring</p><h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-[-0.05em] sm:text-4xl">The right tool is usually closer than you think.</h2></div>
          <Link href="/tools" className="button-primary mt-7 sm:mt-0">Explore the directory <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return <div><strong className="block text-2xl tracking-[-0.05em]">{value}</strong><span className="mt-1 block text-[0.68rem] uppercase leading-4 tracking-[0.1em] text-[var(--muted)]">{label}</span></div>;
}

function SectionIntro({ eyebrow, title, href, linkLabel }: { eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return <div className="flex items-end justify-between gap-5"><div><p className="eyebrow">{eyebrow}</p><h2 className="section-heading mt-4">{title}</h2></div>{href && linkLabel && <Link href={href} className="editorial-link shrink-0 text-sm font-semibold">{linkLabel} ↗</Link>}</div>;
}

function LeadProduct({ product }: { product: Awaited<ReturnType<typeof getFeaturedProducts>>[number] }) {
  return <article className="flex min-h-[22rem] flex-col justify-between bg-[var(--ink)] p-7 text-white sm:p-10">
    <div className="flex items-start justify-between gap-5"><span className="tag border-[#414752] text-[#cbd0da]">{product.category.name}</span><span className="text-sm text-[#cbd0da]"><span aria-hidden="true">★</span> {Number(product.rating).toFixed(1)}</span></div>
    <div className="mt-16"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7eb8ff]">Featured tool</p><h3 className="mt-3 text-4xl font-bold tracking-[-0.06em]"><Link href={`/tools/${product.slug}`} className="hover:text-[#7eb8ff]">{product.name}</Link></h3><p className="mt-3 max-w-lg leading-7 text-[#cbd0da]">{product.shortDescription}</p><div className="mt-7 flex items-center justify-between border-t border-[#303640] pt-5 text-sm"><span className="text-[#cbd0da]">Editorial score <strong className="text-white">{product.editorialScore}/100</strong></span><Link href={`/tools/${product.slug}`} className="font-semibold text-[#7eb8ff]">Read note ↗</Link></div></div>
  </article>;
}

function SupportingProduct({ product, index }: { product: Awaited<ReturnType<typeof getFeaturedProducts>>[number]; index: number }) {
  return <article className="group flex items-center justify-between gap-5 py-6 first:pt-0 last:pb-0"><div className="flex min-w-0 items-start gap-4"><span className="pt-1 text-xs font-bold text-[var(--accent)]">0{index + 2}</span><div className="min-w-0"><p className="eyebrow">{product.category.name}</p><h3 className="mt-2 truncate text-2xl font-bold tracking-[-0.04em]"><Link href={`/tools/${product.slug}`} className="group-hover:text-[var(--accent-deep)]">{product.name}</Link></h3><p className="mt-1 line-clamp-1 text-sm text-[var(--muted)]">{product.shortDescription}</p></div></div><span className="shrink-0 text-sm font-semibold text-[var(--muted)]">{product.editorialScore}</span></article>;
}

function EditorialMeta({ author, publishedAt }: { author: string | null; publishedAt: Date | null }) {
  return <div className="metadata mt-5 flex flex-wrap gap-x-4 gap-y-1">{author && <span>By {author}</span>}{publishedAt && <time dateTime={publishedAt.toISOString()}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(publishedAt)}</time>}</div>;
}

function DiscoveryColumn({ eyebrow, title, href, linkLabel, children }: { eyebrow: string; title: string; href: string; linkLabel: string; children: React.ReactNode }) {
  return <div><div className="flex items-end justify-between gap-4 border-b border-[#303640] pb-5"><div><p className="eyebrow !text-[#7eb8ff]">{eyebrow}</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.05em]">{title}</h2></div><Link href={href} className="shrink-0 text-sm font-semibold text-[#7eb8ff]">{linkLabel} ↗</Link></div><div>{children}</div></div>;
}

function EmptySection({ message, href }: { message: string; href: string }) {
  return <div className="mt-10 border border-dashed border-[var(--line)] p-8 text-[var(--muted)]"><p>{message}</p><Link href={href} className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Continue exploring ↗</Link></div>;
}
