import Link from "next/link";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import { RuledGrid } from "@/components/layout/RuledGrid";
import { getPublishedArticles } from "@/lib/articles";
import { MAX_COMPARE, MIN_COMPARE, getComparableCategories, getFeaturedProducts, getPopulatedCategories, getPublishedEditorialLists } from "@/lib/products";
import { prisma } from "@/lib/db/prisma";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata(
  "TopToolsPick — Choose the right tool before you pay",
  "Independent research for the moment before you buy: ranked shortlists, honest comparisons and real alternatives across software, AI tools and digital services.",
  "/",
  // The home title already names the site; templating it would repeat the suffix.
  { absolute: true },
);

export default async function Home() {
  const [products, categories, comparableCategories, editorialLists, articles, stories, totalTools] = await Promise.all([
    getFeaturedProducts(),
    getPopulatedCategories(),
    getComparableCategories(),
    getPublishedEditorialLists(),
    getPublishedArticles(1),
    prisma.story.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
  ]);

  const leadProduct = products[0];
  const supportingProducts = products.slice(1, 4);
  const leadArticle = articles.articles[0];
  const supportingArticles = articles.articles.slice(1, 3);
  const shortlists = editorialLists.slice(0, 3);

  return (
    <div>
      {/* 1 — Hero. Search is the primary action: most people arrive with a need, not a tool name. */}
      <section className="border-b border-[var(--line)] bg-white">
        {/* Asymmetric on purpose: the sticky header already supplies visual space above,
            so a symmetric py-36 left the hero floating. Keep the generous space below. */}
        <div className="shell grid gap-14 pb-20 pt-10 sm:pb-28 sm:pt-14 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:gap-20 lg:pb-32 lg:pt-16">
          <div>
            <p className="eyebrow">Independent tool research</p>
            <h1 className="display-heading mt-7 max-w-4xl">
              Choose the right tool <span className="text-[var(--accent)]">before you pay.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--muted)]">
              Tell us what you are trying to get done. We will show you what fits, what does not, what it costs, and what to use instead.
            </p>
            <form method="get" action="/tools" role="search" className="mt-9 flex max-w-xl flex-wrap gap-3">
              <label htmlFor="hero-search" className="sr-only">What do you need a tool for?</label>
              <input
                id="hero-search"
                type="search"
                name="q"
                placeholder="e.g. project management, invoicing, SEO"
                className="h-[2.875rem] min-w-0 flex-1 rounded-[var(--radius-control)] border border-[var(--line)] bg-white px-4 text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              />
              <button type="submit" className="button-primary">Find a tool <span aria-hidden="true">↗</span></button>
            </form>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Not sure yet? <Link href="/best" className="editorial-link font-semibold text-[var(--ink)]">Start from a ranked shortlist</Link>.
            </p>
            <div className="mt-8 max-w-md"><Disclosure /></div>
          </div>
          <div className="border-l-2 border-[var(--accent)] pl-6 sm:pl-8 lg:mb-3">
            <p className="eyebrow">How this works</p>
            <p className="mt-5 max-w-sm text-2xl font-bold leading-tight tracking-[-0.04em] text-[var(--ink)]">
              Every tool is judged on who it suits, who it does not, and what it actually costs.
            </p>
            <div className="mt-9 grid max-w-sm grid-cols-3 gap-4 border-t border-[var(--line)] pt-5">
              <Metric value={totalTools} label="tools reviewed" />
              <Metric value={categories.length} label="categories" />
              <Metric value={editorialLists.length} label="shortlists" />
            </div>
          </div>
        </div>
      </section>

      {/* 2 — The decision entry point for people who cannot name a tool yet. */}
      {shortlists.length > 0 && (
        <section className="shell py-20 sm:py-28">
          <SectionIntro eyebrow="Not sure what to choose?" title="Start from a ranked shortlist." href="/best" linkLabel="All shortlists" />
          <RuledGrid className="mt-10" columns={gridColumns(shortlists.length)}>
            {shortlists.map((list, index) => (
              <Link key={list.slug} href={`/best/${list.slug}`} className="ruled-cell group flex flex-col">
                <span className="text-xs font-bold tracking-[0.16em] text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-4 block text-xl font-bold tracking-[-0.03em] group-hover:text-[var(--accent-deep)]">{list.title}</span>
                <span className="mt-2 block max-w-md flex-1 text-sm leading-6 text-[var(--muted)]">{list.description}</span>
                <span className="editorial-link mt-5 inline-block text-sm font-semibold text-[var(--ink)]">See the ranking <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </RuledGrid>
        </section>
      )}

      {/* 3 — Head-to-head. Phase 2 replaces this with written comparisons. */}
      {comparableCategories.length > 0 && (
        <section className="bg-[var(--ink)] text-white">
          <div className="shell py-20 sm:py-28">
            <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#303640] pb-6">
              <div>
                <p className="eyebrow !text-[#7eb8ff]">Down to two or three?</p>
                <h2 className="section-heading mt-4">Put them side by side.</h2>
              </div>
              <Link href="/compare" className="shrink-0 text-sm font-semibold text-[#7eb8ff]">Open the comparison tool ↗</Link>
            </div>
            <p className="mt-7 max-w-2xl leading-7 text-[#aeb4c2]">
              Pick a category, then line up {MIN_COMPARE}&ndash;{MAX_COMPARE} tools on pricing, free plans, ratings and platforms in one table.
            </p>
            <div className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {comparableCategories.slice(0, 6).map((category) => (
                <Link key={category.slug} href={`/compare?category=${encodeURIComponent(category.slug)}`} className="group flex items-center justify-between gap-4 border-b border-[#303640] py-5">
                  <span>
                    <span className="block font-bold group-hover:text-[#7eb8ff]">{category.name}</span>
                    <span className="mt-1 block text-sm text-[#aeb4c2]">{category._count.products} tools to compare</span>
                  </span>
                  <span className="text-[#7eb8ff]" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4 — Need-first browsing. Counts come from getPopulatedCategories, so no dead ends. */}
      <section className="border-b border-[var(--line)] bg-white">
        <div className="shell py-20 sm:py-28">
          <SectionIntro eyebrow="Browse by need" title="What are you trying to do?" href="/categories" linkLabel="All categories" />
          {categories.length ? (
            <RuledGrid className="mt-10" columns="sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 6).map((category, index) => (
                <Link key={category.id} href={`/categories/${category.slug}`} className="ruled-cell group">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold tracking-[0.16em] text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-xs font-semibold text-[var(--muted)]">{category._count.products} tools</span>
                  </span>
                  <span className="mt-4 flex items-start justify-between gap-4">
                    <span>
                      <span className="block text-xl font-bold tracking-[-0.03em] group-hover:text-[var(--accent-deep)]">{category.name}</span>
                      <span className="mt-2 block max-w-xs text-sm leading-6 text-[var(--muted)]">{category.description ?? "Compare the leading options."}</span>
                    </span>
                    <span className="text-xl text-[var(--accent)]" aria-hidden="true">↗</span>
                  </span>
                </Link>
              ))}
            </RuledGrid>
          ) : <EmptySection message="Categories are being prepared." href="/tools" />}
        </div>
      </section>

      {/* 5 — Editor's picks. */}
      <section className="shell py-20 sm:py-28">
        <SectionIntro eyebrow="The shortlist" title="Tools we keep recommending." href="/tools" linkLabel="Browse all tools" />
        {leadProduct ? (
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.08fr_.92fr]">
            <LeadProduct product={leadProduct} />
            <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {supportingProducts.map((product, index) => <SupportingProduct key={product.id} product={product} index={index} />)}
            </div>
          </div>
        ) : <EmptySection message="Featured tools are being edited. Explore the full directory for now." href="/tools" />}
      </section>

      {/* 6 — Trust. An affiliate site has to say how it makes money and how it ranks. */}
      <section className="border-y border-[var(--line)] bg-white">
        <div className="shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="eyebrow">How we pick</p>
            <h2 className="section-heading mt-4">No paid placements.</h2>
            <Link href="/methodology" className="editorial-link mt-6 inline-block text-sm font-semibold text-[var(--ink)]">Read our editorial policy ↗</Link>
            <div className="mt-8 max-w-md"><Disclosure /></div>
          </div>
          <div className="grid gap-px bg-[var(--line)] sm:grid-cols-3">
            <Principle title="Ranked by hand" body="Every shortlist is ordered by an editor, with the reasoning written next to it. Nobody can buy a position." />
            <Principle title="Fit before features" body="We lead with who a tool suits and who it does not, because the wrong tool is expensive however good it is." />
            <Principle title="Labelled links" body="Some outbound links earn us a commission. They are marked, and they never change what we recommend or what you pay." />
          </div>
        </div>
      </section>

      {/* 7 — Supporting editorial. */}
      {(leadArticle || stories.length > 0) && (
        <section className="shell py-20 sm:py-28">
          <SectionIntro eyebrow="Guides" title="How to think about the choice." href="/articles" linkLabel="All guides" />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              {leadArticle ? <Link href={`/articles/${leadArticle.slug}`} className="group block border-b border-[var(--line)] pb-8">
                <span className="eyebrow">Featured guide</span>
                <h3 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.05em] sm:text-4xl group-hover:text-[var(--accent-deep)]">{leadArticle.title}</h3>
                {leadArticle.excerpt && <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">{leadArticle.excerpt}</p>}
                <EditorialMeta author={leadArticle.author} publishedAt={leadArticle.publishedAt} />
              </Link> : <EmptySection message="Guides are being written." href="/tools" />}
              {supportingArticles.length > 0 && <div className="grid gap-x-8 sm:grid-cols-2">
                {supportingArticles.map((article) => <Link key={article.id} href={`/articles/${article.slug}`} className="group border-b border-[var(--line)] py-6">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">Guide</span>
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

      {/* 8 — Closing CTA, back to the same search. */}
      <section className="shell py-20 sm:py-28">
        <div className="border-t-2 border-[var(--accent)] pt-7 sm:flex sm:items-end sm:justify-between sm:gap-10">
          <div><p className="eyebrow">Still deciding?</p><h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Start with the job, not the tool.</h2></div>
          <form method="get" action="/tools" role="search" className="mt-7 flex max-w-md flex-wrap gap-3 sm:mt-0">
            <label htmlFor="closing-search" className="sr-only">What do you need a tool for?</label>
            <input
              id="closing-search"
              type="search"
              name="q"
              placeholder="What do you need a tool for?"
              className="h-[2.875rem] min-w-0 flex-1 rounded-[var(--radius-control)] border border-[var(--line)] bg-white px-4 text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            />
            <button type="submit" className="button-primary">Search <span aria-hidden="true">↗</span></button>
          </form>
        </div>
      </section>
    </div>
  );
}

/** A single shortlist in a three-column grid looks like a rendering bug, so narrow the grid instead. */
function gridColumns(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "sm:grid-cols-2";
  return "sm:grid-cols-2 lg:grid-cols-3";
}

function Metric({ value, label }: { value: number; label: string }) {
  return <div><strong className="block text-2xl tracking-[-0.05em]">{value}</strong><span className="mt-1 block text-[0.68rem] uppercase leading-4 tracking-[0.1em] text-[var(--muted)]">{label}</span></div>;
}

function Principle({ title, body }: { title: string; body: string }) {
  return <div className="bg-white p-6 sm:p-7"><h3 className="text-lg font-bold tracking-[-0.03em]">{title}</h3><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{body}</p></div>;
}

function SectionIntro({ eyebrow, title, href, linkLabel }: { eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return <div className="flex items-end justify-between gap-5"><div><p className="eyebrow">{eyebrow}</p><h2 className="section-heading mt-4">{title}</h2></div>{href && linkLabel && <Link href={href} className="editorial-link shrink-0 text-sm font-semibold">{linkLabel} ↗</Link>}</div>;
}

function LeadProduct({ product }: { product: Awaited<ReturnType<typeof getFeaturedProducts>>[number] }) {
  return <article className="flex min-h-[22rem] flex-col justify-between bg-[var(--ink)] p-7 text-white sm:p-10">
    <div className="flex items-start justify-between gap-5"><span className="tag border-[#414752] text-[#cbd0da]">{product.category.name}</span><span className="text-sm text-[#cbd0da]"><span aria-hidden="true">★</span> {Number(product.rating).toFixed(1)}</span></div>
    <div className="mt-16"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7eb8ff]">Featured tool</p><h3 className="mt-3 text-4xl font-bold tracking-[-0.06em]"><Link href={`/tools/${product.slug}`} className="hover:text-[#7eb8ff]">{product.name}</Link></h3>{product.bestFor && <p className="mt-3 max-w-lg leading-7 text-[#cbd0da]"><span className="font-semibold text-white">Best for:</span> {product.bestFor}</p>}<div className="mt-7 flex items-center justify-between border-t border-[#303640] pt-5 text-sm"><span className="text-[#cbd0da]">Editorial score <strong className="text-white">{product.editorialScore}/100</strong></span><Link href={`/tools/${product.slug}`} className="font-semibold text-[#7eb8ff]">See if it fits ↗</Link></div></div>
  </article>;
}

function SupportingProduct({ product, index }: { product: Awaited<ReturnType<typeof getFeaturedProducts>>[number]; index: number }) {
  return <article className="group flex items-center justify-between gap-5 py-6 first:pt-0 last:pb-0"><div className="flex min-w-0 items-start gap-4"><span className="pt-1 text-xs font-bold text-[var(--accent)]">0{index + 2}</span><div className="min-w-0"><p className="eyebrow">{product.category.name}</p><h3 className="mt-2 truncate text-2xl font-bold tracking-[-0.04em]"><Link href={`/tools/${product.slug}`} className="group-hover:text-[var(--accent-deep)]">{product.name}</Link></h3><p className="mt-1 line-clamp-1 text-sm text-[var(--muted)]">{product.shortDescription}</p><DecisionBadges hasFreePlan={product.hasFreePlan} hasFreeTrial={product.hasFreeTrial} pricingModel={product.pricingModel} className="mt-3" /></div></div><span className="shrink-0 text-sm font-semibold text-[var(--muted)]">{product.editorialScore}</span></article>;
}

function EditorialMeta({ author, publishedAt }: { author: string | null; publishedAt: Date | null }) {
  return <div className="metadata mt-5 flex flex-wrap gap-x-4 gap-y-1">{author && <span>By {author}</span>}{publishedAt && <time dateTime={publishedAt.toISOString()}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(publishedAt)}</time>}</div>;
}

function EmptySection({ message, href }: { message: string; href: string }) {
  return <div className="mt-10 border border-dashed border-[var(--line)] p-8 text-[var(--muted)]"><p>{message}</p><Link href={href} className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Continue exploring ↗</Link></div>;
}
