import Link from "next/link";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import { RuledGrid } from "@/components/layout/RuledGrid";
import { ProductLogo } from "@/components/product/ProductLogo";
import { SearchForm } from "@/components/search/SearchForm";
import { Rating, ScoreMeter } from "@/components/ui/Rating";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ctaSubline } from "@/lib/affiliate/cta";
import { getPublishedArticles } from "@/lib/articles";
import { MAX_COMPARE, MIN_COMPARE, getComparableCategories, getFeaturedProducts, getPopulatedCategories, getPublishedEditorialLists } from "@/lib/products";
import { prisma } from "@/lib/db/prisma";
import { buildMetadata } from "@/lib/seo";
import { truncate } from "@/lib/text";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata(
  "TopToolsPick — Choose the right tool before you pay",
  "Independent research for the moment before you buy: ranked shortlists, honest comparisons and real alternatives across software, AI tools and digital services.",
  "/",
  // The home title already names the site; templating it would repeat the suffix.
  { absolute: true },
);

type FeaturedProduct = Awaited<ReturnType<typeof getFeaturedProducts>>[number];

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
      {/* 1 - Hero. One job: turn "I need something for X" into a search. */}
      <section className="hero-wash border-b border-[var(--line)]">
        <div className="shell grid gap-12 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20 lg:pb-24 lg:pt-20">
          <div className="min-w-0">
            <p className="eyebrow">Independent tool research</p>
            <h1 className="display-heading mt-5 max-w-3xl">
              Choose the right tool <span className="text-[var(--accent)]">before you pay.</span>
            </h1>
            <p className="lede mt-6 max-w-xl">
              Tell us what you are trying to get done. We will show you what fits, what does not,
              what it costs, and what to use instead.
            </p>

            <SearchForm
              id="hero-search"
              label="What do you need a tool for?"
              placeholder="e.g. project management, invoicing, SEO"
              size="lg"
              submitLabel="Find a tool"
              className="mt-8 max-w-xl"
            />

            {categories.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-sm text-[var(--muted)]">Popular:</span>
                {categories.slice(0, 4).map((category) => (
                  <Link key={category.id} href={`/categories/${category.slug}`} className="badge hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            <p className="mt-6 text-sm text-[var(--muted)]">
              Not sure yet? <Link href="/best" className="editorial-link font-semibold text-[var(--ink)]">Start from a ranked shortlist</Link>.
            </p>
          </div>

          {/* The trust panel. Not decoration: it states the method and the scale of the
              research before anyone clicks a commercial link. */}
          <div className="panel panel-raised p-6 sm:p-8">
            <p className="eyebrow">How this works</p>
            <p className="mt-4 text-xl font-bold leading-snug tracking-[-0.02em] text-[var(--ink)] sm:text-2xl">
              Every tool is judged on who it suits, who it does not, and what it actually costs.
            </p>
            <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-[var(--line)] pt-6">
              <Metric value={totalTools} label="tools reviewed" />
              <Metric value={categories.length} label="categories" />
              <Metric value={editorialLists.length} label="shortlists" />
            </dl>
            <ul className="mt-6 flex flex-col gap-2.5 border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)]">
              <Assurance>Ranked by an editor, never by a commission rate.</Assurance>
              <Assurance>Free plans, trials and prices come from our own records.</Assurance>
              <Assurance>Commercial links are labelled and never change a ranking.</Assurance>
            </ul>
            <Link href="/methodology" className="editorial-link mt-6 inline-block text-sm font-semibold text-[var(--ink)]">
              Read our editorial policy
            </Link>
          </div>
        </div>
      </section>

      {/* 2 - Recommended tools. The people furthest along the decision want a name. */}
      {leadProduct && (
        <section className="shell py-16 sm:py-20">
          <SectionHeader
            eyebrow="Editor's picks"
            title="Tools we keep recommending."
            href="/tools"
            linkLabel="Browse all tools"
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
            <LeadProduct product={leadProduct} />
            {supportingProducts.length > 0 && (
              <div className="rule-list border-y border-[var(--line)]">
                {supportingProducts.map((product) => <SupportingProduct key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3 - Categories: the entry point for people who cannot name a tool yet. */}
      <section className="band">
        <div className="shell py-16 sm:py-20">
          <SectionHeader eyebrow="Browse by need" title="What are you trying to do?" href="/categories" linkLabel="All categories" />
          {categories.length ? (
            <RuledGrid className="mt-8" columns="sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 6).map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`} className="ruled-cell group flex flex-col">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                      {category._count.products} {category._count.products === 1 ? "tool" : "tools"}
                    </span>
                    <span className="text-[var(--accent)] hover-shift" aria-hidden="true">&#8594;</span>
                  </span>
                  <span className="mt-4 block text-xl font-bold tracking-[-0.025em] group-hover:text-[var(--accent-deep)]">{category.name}</span>
                  <span className="mt-2 block max-w-sm flex-1 text-sm leading-6 text-[var(--muted)]">
                    {category.description ?? "Compare the leading options."}
                  </span>
                </Link>
              ))}
            </RuledGrid>
          ) : <EmptySection message="Categories are being prepared." href="/tools" />}
        </div>
      </section>

      {/* 4 - Buying guides. The ranked shortlist is the strongest editorial format here. */}
      {shortlists.length > 0 && (
        <section className="shell py-16 sm:py-20">
          <SectionHeader
            eyebrow="Buying guides"
            title="Start from a ranked shortlist."
            intro="Every list is ordered by an editor, with the reasoning written next to each pick."
            href="/best"
            linkLabel="All shortlists"
          />
          <RuledGrid className="mt-8" columns={gridColumns(shortlists.length)}>
            {shortlists.map((list, index) => (
              <Link key={list.slug} href={`/best/${list.slug}`} className="ruled-cell group flex flex-col">
                <span className="text-xs font-bold tracking-[0.14em] text-[var(--accent-deep)]">{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-4 block text-xl font-bold tracking-[-0.025em] group-hover:text-[var(--accent-deep)]">{list.title}</span>
                <span className="mt-2 block max-w-md flex-1 text-sm leading-6 text-[var(--muted)]">{list.description}</span>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-deep)]">
                  See the ranking <span aria-hidden="true" className="hover-shift">&#8594;</span>
                </span>
              </Link>
            ))}
          </RuledGrid>
        </section>
      )}

      {/* 5 - Head to head, for the people closest to paying. */}
      {comparableCategories.length > 0 && (
        <section className="band-ink">
          <div className="shell py-16 sm:py-20">
            <SectionHeader
              tone="ink"
              eyebrow="Down to two or three?"
              title="Put them side by side."
              intro={`Pick a category, then line up ${MIN_COMPARE}-${MAX_COMPARE} tools on pricing, free plans, features and verdicts in one table.`}
              href="/compare"
              linkLabel="Open the comparison tool"
            />
            <div className="mt-6 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {comparableCategories.slice(0, 6).map((category) => (
                <Link
                  key={category.slug}
                  href={`/compare?category=${encodeURIComponent(category.slug)}`}
                  className="group flex items-center justify-between gap-4 border-b border-[var(--ink-line)] py-5"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold group-hover:text-[var(--ink-accent)]">{category.name}</span>
                    <span className="mt-1 block text-sm text-[var(--ink-muted)]">{category._count.products} tools to compare</span>
                  </span>
                  <span className="shrink-0 text-[var(--ink-accent)] hover-shift" aria-hidden="true">&#8594;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6 - Editorial. Guides and stories in the same visual system as everything else. */}
      {(leadArticle || stories.length > 0) && (
        <section className="shell py-16 sm:py-20">
          <SectionHeader eyebrow="From the desk" title="How to think about the choice." href="/articles" linkLabel="All guides" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
            <div>
              {leadArticle ? (
                <Link href={`/articles/${leadArticle.slug}`} className="group block border-b border-[var(--line)] pb-7">
                  <span className="eyebrow">Featured guide</span>
                  <h3 className="mt-4 max-w-2xl text-2xl font-bold leading-tight tracking-[-0.03em] group-hover:text-[var(--accent-deep)] sm:text-3xl">
                    {leadArticle.title}
                  </h3>
                  {leadArticle.excerpt && <p className="mt-3 max-w-xl leading-7 text-[var(--muted)]">{leadArticle.excerpt}</p>}
                  <EditorialMeta author={leadArticle.author} publishedAt={leadArticle.publishedAt} />
                </Link>
              ) : <EmptySection message="Guides are being written." href="/tools" />}

              {supportingArticles.length > 0 && (
                <div className="grid gap-x-8 sm:grid-cols-2">
                  {supportingArticles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="group border-b border-[var(--line)] py-6">
                      <span className="eyebrow">Guide</span>
                      <h3 className="mt-3 text-lg font-bold leading-snug tracking-[-0.02em] group-hover:text-[var(--accent-deep)]">{article.title}</h3>
                      <EditorialMeta author={article.author} publishedAt={article.publishedAt} />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {stories.length > 0 && (
              <div className="border-t-2 border-[var(--ink)] pt-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow">Visual guides</p>
                  <Link href="/stories" className="text-sm font-semibold text-[var(--accent-deep)]">View stories</Link>
                </div>
                <div className="mt-4 rule-list">
                  {stories.map((story) => (
                    <Link key={story.id} href={`/stories/${story.slug}`} className="group block py-5">
                      <h3 className="text-lg font-bold leading-snug tracking-[-0.02em] group-hover:text-[var(--accent-deep)]">{story.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{story.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 7 - Closing discovery prompt, back to the same search. */}
      <section className="band-sunken">
        <div className="shell flex flex-col gap-7 py-14 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
          <div className="max-w-xl">
            <p className="eyebrow">Still deciding?</p>
            <h2 className="section-heading mt-3">Start with the job, not the tool.</h2>
            <div className="mt-5 max-w-md"><Disclosure /></div>
          </div>
          <SearchForm
            id="closing-search"
            label="What do you need a tool for?"
            placeholder="What do you need a tool for?"
            size="lg"
            submitLabel="Search"
            className="lg:max-w-lg"
          />
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
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <strong className="block text-2xl font-bold tracking-[-0.03em]">{value}</strong>
        <span className="mt-1 block text-[0.68rem] uppercase leading-4 tracking-[0.1em] text-[var(--muted)]" aria-hidden="true">{label}</span>
      </dd>
    </div>
  );
}

function Assurance({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 leading-6">
      <span aria-hidden="true" className="mt-[0.15rem] font-bold text-[var(--accent-deep)]">&#10003;</span>
      <span>{children}</span>
    </li>
  );
}

/**
 * The lead pick, presented as a product rather than a card: identity, the numbers
 * people compare, and what it is actually for.
 */
function LeadProduct({ product }: { product: FeaturedProduct }) {
  return (
    <article className="panel panel-raised flex flex-col p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="badge badge-solid">Featured tool</span>
        <Link href={`/categories/${product.category.slug}`} className="badge hover:border-[var(--accent)] hover:text-[var(--accent-deep)]">
          {product.category.name}
        </Link>
      </div>

      <div className="mt-6 flex items-start gap-4 sm:gap-5">
        <ProductLogo name={product.name} logoUrl={product.logoUrl} size="xl" />
        <div className="min-w-0">
          <h3 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
            <Link href={`/tools/${product.slug}`} className="hover:text-[var(--accent-deep)]">{product.name}</Link>
          </h3>
          <Rating value={Number(product.rating)} className="mt-2" />
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{truncate(product.shortDescription, 150)}</p>
        </div>
      </div>

      {product.bestFor && (
        <p className="mt-5 leading-7 text-[var(--ink-body)]">
          <span className="font-semibold text-[var(--ink)]">Best for:</span> {truncate(product.bestFor, 160)}
        </p>
      )}

      <div className="flex-1" />

      <DecisionBadges
        hasFreePlan={product.hasFreePlan}
        hasFreeTrial={product.hasFreeTrial}
        pricingModel={product.pricingModel}
        entryPriceLabel={ctaSubline(product.pricingPlans)}
        className="mt-6"
      />

      <ScoreMeter score={product.editorialScore} className="mt-6" />

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        <AffiliateCta product={product} placement="home-featured" className="w-full" />
        <Link href={`/tools/${product.slug}`} className="button-secondary w-full">Read the review</Link>
      </div>
    </article>
  );
}

function SupportingProduct({ product }: { product: FeaturedProduct }) {
  return (
    <article className="group flex items-start gap-4 py-5 first:pt-0 last:pb-0">
      <ProductLogo name={product.name} logoUrl={product.logoUrl} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{product.category.name}</p>
        <h3 className="mt-1.5 text-lg font-bold tracking-[-0.02em]">
          <Link href={`/tools/${product.slug}`} className="group-hover:text-[var(--accent-deep)]">{product.name}</Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{product.shortDescription}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Rating value={Number(product.rating)} showValue={false} />
          <DecisionBadges hasFreePlan={product.hasFreePlan} hasFreeTrial={product.hasFreeTrial} pricingModel={product.pricingModel} />
        </div>
      </div>
      <span className="shrink-0 pt-1 text-sm font-semibold text-[var(--muted)]" aria-label={`Editorial score ${product.editorialScore} out of 100`}>
        {product.editorialScore}
      </span>
    </article>
  );
}

function EditorialMeta({ author, publishedAt }: { author: string | null; publishedAt: Date | null }) {
  return (
    <div className="metadata mt-4 flex flex-wrap gap-x-4 gap-y-1">
      {author && <span>By {author}</span>}
      {publishedAt && <time dateTime={publishedAt.toISOString()}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(publishedAt)}</time>}
    </div>
  );
}

function EmptySection({ message, href }: { message: string; href: string }) {
  return (
    <div className="mt-8 rounded-[var(--radius-surface)] border border-dashed border-[var(--line-strong)] p-8 text-[var(--muted)]">
      <p>{message}</p>
      <Link href={href} className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Continue exploring</Link>
    </div>
  );
}
