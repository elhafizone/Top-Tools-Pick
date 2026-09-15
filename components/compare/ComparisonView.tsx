import Link from "next/link";
import { AffiliateCta } from "@/components/affiliate/AffiliateCta";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { DecisionBadges } from "@/components/decision/DecisionBadges";
import { ProductLogo } from "@/components/product/ProductLogo";
import { Rating, ScoreMeter } from "@/components/ui/Rating";
import { safeHostname } from "@/lib/affiliate/links";
import { ctaSubline } from "@/lib/affiliate/cta";
import type { getProductsForComparison } from "@/lib/products";
import { toBullets } from "@/lib/text";

type ComparedProduct = Awaited<ReturnType<typeof getProductsForComparison>>[number];

const dash = <span className="no-mark">&mdash;</span>;
const yes = <span className="yes-mark">&#10003; Yes</span>;
const no = <span className="no-mark">No</span>;

const text = (value: string | null | undefined) => (value && value.trim() ? value : dash);
const list = (values: string[]) => (values.length ? values.join(", ") : dash);

function bulletCell(value: string | null | undefined) {
  const points = toBullets(value);
  if (points.length === 0) return dash;
  if (points.length === 1) return points[0];
  return (
    <ul className="flex flex-col gap-1.5">
      {points.map((point) => (
        <li key={point} className="flex gap-2">
          <span aria-hidden="true" className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-[var(--muted-soft)]" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The comparison experience: a scannable summary, then the full attribute matrix.
 *
 * The summary exists because a table answers "how do these differ?" but not "so which
 * one?". The one honest headline this data supports is which tool carries the highest
 * editorial score, so that is what is marked - labelled as exactly that, never as a
 * generic "winner", because the score is our rating and not a claim about every reader.
 *
 * Nothing here is derived beyond that: each cell prints a stored column or an em dash.
 */
export function ComparisonView({ products, headingId = "comparison-heading" }: { products: ComparedProduct[]; headingId?: string }) {
  const names = products.map((product) => product.name);
  const topScore = Math.max(...products.map((product) => product.editorialScore));
  // A tie means no single tool leads, so nothing is marked rather than marking two.
  const leaderSlug = products.filter((product) => product.editorialScore === topScore).length === 1
    ? products.find((product) => product.editorialScore === topScore)?.slug
    : undefined;

  const rows: Array<{ label: string; render: (product: ComparedProduct) => React.ReactNode }> = [
    { label: "Summary", render: (p) => p.shortDescription },
    { label: "Best for", render: (p) => bulletCell(p.bestFor) },
    { label: "Not for", render: (p) => bulletCell(p.notFor) },
    { label: "Pricing model", render: (p) => <span className="capitalize">{p.pricingModel.replaceAll("_", " ").toLowerCase()}</span> },
    { label: "Entry plan", render: (p) => text(ctaSubline(p.pricingPlans)) },
    { label: "Free plan", render: (p) => (p.hasFreePlan ? yes : no) },
    { label: "Free trial", render: (p) => (p.hasFreeTrial ? yes : no) },
    { label: "Key features", render: (p) => bulletCell(p.keyFeatures) },
    { label: "Strengths", render: (p) => bulletCell(p.pros) },
    { label: "Trade-offs", render: (p) => bulletCell(p.cons) },
    { label: "Platforms", render: (p) => list(p.platforms.map((item) => item.platform.name)) },
    { label: "Use cases", render: (p) => list(p.useCases.map((item) => item.useCase.name)) },
    { label: "Built for", render: (p) => list(p.audiences.map((item) => item.audience.name)) },
    { label: "Website", render: (p) => safeHostname(p.websiteUrl) ?? dash },
  ];

  const columnWidth = products.length > 3 ? "min-w-[15rem]" : "min-w-[17rem]";

  return (
    <section aria-labelledby={headingId} className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <p className="eyebrow">Side by side</p>
          <h2 id={headingId} className="section-heading mt-3">{names.join(" vs ")}</h2>
        </div>
        <p className="text-sm text-[var(--muted)]">
          {products.length} tools &middot;{" "}
          <Link href={`/categories/${products[0].category.slug}`} className="editorial-link font-semibold text-[var(--ink)]">
            {products[0].category.name}
          </Link>
        </p>
      </div>

      {/* 1 - the answer, as far as the data honestly supports one. */}
      <div className={`mt-8 grid gap-4 ${products.length > 2 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2"}`}>
        {products.map((product) => {
          const leads = product.slug === leaderSlug;
          return (
            <div
              key={product.slug}
              className={`panel flex flex-col p-5 ${leads ? "border-[var(--accent)] shadow-[var(--shadow-md)]" : "panel-raised"}`}
            >
              <div className="flex items-start gap-3">
                <ProductLogo name={product.name} logoUrl={product.logoUrl} size="md" />
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold tracking-[-0.02em]">
                    <Link href={`/tools/${product.slug}`} className="hover:text-[var(--accent-deep)]">{product.name}</Link>
                  </h3>
                  <Rating value={Number(product.rating)} className="mt-1.5" />
                </div>
              </div>

              {/* The slot is reserved in every card, marked in one. Without it the cards
                  below the badge sit at different heights and stop being comparable. */}
              <div className="mt-4 flex h-6 items-center">
                {leads && <p className="badge badge-solid">Highest editorial score</p>}
              </div>

              <ScoreMeter score={product.editorialScore} className="mt-3" />

              {product.bestFor && (
                <p className="mt-4 text-sm leading-6 text-[var(--ink-body)]">
                  <span className="font-semibold text-[var(--ink)]">Best for:</span> {product.bestFor}
                </p>
              )}

              <div className="flex-1" />

              <DecisionBadges
                hasFreePlan={product.hasFreePlan}
                hasFreeTrial={product.hasFreeTrial}
                pricingModel={product.pricingModel}
                entryPriceLabel={ctaSubline(product.pricingPlans)}
                className="mt-5"
              />

              <div className="mt-5 flex flex-col gap-2">
                <AffiliateCta product={product} placement="compare-summary" className="w-full" />
                <Link href={`/tools/${product.slug}`} className="button-secondary w-full">Read the review</Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 - the detail, for anyone who wants to check the reasoning. */}
      <div className="mt-14">
        <h3 className="sub-heading">Full comparison</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Every value below is recorded against the tool in our own data. An em dash means we have not verified it.
        </p>

        <div className="table-scroll mt-6 border-t border-[var(--line-strong)]">
          <table className="data-table">
            <caption className="sr-only">Feature comparison of {names.join(", ")}</caption>
            <thead>
              <tr>
                <th scope="col" className="col-sticky w-36 pr-5 align-bottom text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)] sm:w-44">
                  Attribute
                </th>
                {products.map((product) => (
                  <th key={product.slug} scope="col" className={`border-l border-[var(--line)] ${columnWidth}`}>
                    <span className="flex items-center gap-2.5">
                      <ProductLogo name={product.name} logoUrl={product.logoUrl} size="sm" />
                      <Link href={`/tools/${product.slug}`} className="text-base font-bold tracking-[-0.02em] hover:text-[var(--accent-deep)]">
                        {product.name}
                      </Link>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="col-sticky">{row.label}</th>
                  {products.map((product) => (
                    <td key={product.slug}>{row.render(product)}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="col-sticky">Visit</th>
                {/* Same resolution and wording as every other CTA on the site: routed
                    through /go, labelled from stored columns. */}
                {products.map((product) => (
                  <td key={product.slug}>
                    <div className="flex flex-col gap-2">
                      <AffiliateCta product={product} placement="compare-table" />
                      <Link href={`/tools/${product.slug}`} className="button-secondary">Read the review</Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8"><Disclosure /></div>
    </section>
  );
}
