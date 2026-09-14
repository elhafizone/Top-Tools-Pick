import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

/**
 * Editorial worklist rather than a link menu.
 *
 * With no click logging (by decision), the useful dashboard is not "what converted"
 * but "what is still missing" — the fields and relations that decide whether a page
 * can persuade anyone, and whether a CTA earns anything at all.
 */
export default async function AdminDashboard() {
  await requireAdmin();

  const [
    publishedProducts,
    liveAffiliateLinks,
    totalAffiliateLinks,
    activePrograms,
    missingNotFor,
    missingVerdict,
    productsWithAlternatives,
    boundLists,
    publishedLists,
    comparisonArticles,
    articlesWithLinks,
    totalArticles,
  ] = await Promise.all([
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.affiliateLink.count({ where: { enabled: true, program: { status: "ACTIVE" } } }),
    prisma.affiliateLink.count(),
    prisma.affiliateProgram.count({ where: { status: "ACTIVE" } }),
    prisma.product.count({ where: { status: "PUBLISHED", OR: [{ notFor: null }, { notFor: "" }] } }),
    prisma.product.count({ where: { status: "PUBLISHED", OR: [{ verdict: null }, { verdict: "" }] } }),
    prisma.productAlternative.groupBy({ by: ["productId"] }),
    prisma.editorialList.count({ where: { status: "PUBLISHED", categoryId: { not: null } } }),
    prisma.editorialList.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "PUBLISHED", topic: "comparisons" } }),
    prisma.articleProductLink.groupBy({ by: ["articleId"] }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
  ]);

  const withAlternatives = productsWithAlternatives.length;
  const withArticleLinks = articlesWithLinks.length;

  const tiles = [
    {
      label: "Live affiliate links",
      value: `${liveAffiliateLinks} / ${totalAffiliateLinks}`,
      urgent: liveAffiliateLinks === 0,
      note: liveAffiliateLinks === 0
        ? "No CTA on the site earns anything yet. A link only counts when its programme is ACTIVE and the link is enabled."
        : `${activePrograms} active ${activePrograms === 1 ? "programme" : "programmes"}.`,
      href: "/admin/affiliate-links",
    },
    {
      label: "Missing “not for”",
      value: `${missingNotFor} / ${publishedProducts}`,
      urgent: missingNotFor === publishedProducts && publishedProducts > 0,
      note: "Who a tool does not suit is the strongest trust signal on a review page.",
      href: "/admin/products",
    },
    {
      label: "Missing verdict",
      value: `${missingVerdict} / ${publishedProducts}`,
      urgent: false,
      note: "The verdict section stays hidden until written, along with its closing CTA.",
      href: "/admin/products",
    },
    {
      label: "Tools with alternatives",
      value: `${withAlternatives} / ${publishedProducts}`,
      urgent: withAlternatives === 0,
      note: "Curated only — the Alternatives section hides entirely when empty.",
      href: "/admin/products",
    },
    {
      label: "Shortlists bound to a category",
      value: `${boundLists} / ${publishedLists}`,
      urgent: publishedLists > 0 && boundLists === 0,
      note: "A bound list puts its award slots at the top of that category page.",
      href: "/admin/editorial-lists",
    },
    {
      label: "Comparison articles",
      value: String(comparisonArticles),
      urgent: comparisonArticles === 0,
      note: "Indexable head-to-head content. /compare itself is deliberately noindex.",
      href: "/admin/articles",
    },
    {
      label: "Articles linking to tools",
      value: `${withArticleLinks} / ${totalArticles}`,
      urgent: totalArticles > 0 && withArticleLinks === 0,
      note: "Article bodies are plain text, so this relation is their only route to a tool page.",
      href: "/admin/articles",
    },
  ];

  const sections = [
    ["Products", "/admin/products"],
    ["Editorial Lists", "/admin/editorial-lists"],
    ["Articles", "/admin/articles"],
    ["Stories", "/admin/stories"],
    ["Affiliate Links", "/admin/affiliate-links"],
    ["Categories", "/admin/categories"],
  ] as const;

  return <section>
    <p className="text-sm font-bold uppercase tracking-widest text-[#2180F8]">Protected workspace</p>
    <h1 className="mt-2 text-4xl font-black">What needs attention</h1>
    <p className="mt-4 max-w-2xl text-slate-600">
      Counts of the editorial work that decides whether a page can actually help someone choose —
      and whether a call-to-action earns anything.
    </p>

    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map((tile) => (
        <Link key={tile.label} href={tile.href} className={`border bg-white p-5 transition hover:border-[#2180F8] ${tile.urgent ? "border-red-300" : "border-slate-200"}`}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{tile.label}</p>
          <p className={`mt-2 text-3xl font-black ${tile.urgent ? "text-red-700" : "text-slate-900"}`}>{tile.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{tile.note}</p>
        </Link>
      ))}
    </div>

    <h2 className="mt-12 text-xl font-black">Manage</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map(([label, href]) => (
        <Link href={href} key={href} className="border border-slate-200 bg-white p-5 transition hover:border-[#2180F8]">
          <h3 className="font-bold">{label}</h3>
          <p className="mt-2 text-sm text-slate-500">Open {label.toLowerCase()} management.</p>
        </Link>
      ))}
    </div>
  </section>;
}
