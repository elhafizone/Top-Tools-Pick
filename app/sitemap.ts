import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { getAudiences, getPlatforms, getUseCases } from "@/lib/products";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** Indexable surfaces that exist regardless of content. Kept in one place so the
 *  no-database fallback can never drift out of sync with the real branch again. */
const staticEntries = (): MetadataRoute.Sitemap => [
  { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  { url: `${siteUrl}/tools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${siteUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteUrl}/best`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteUrl}/comparisons`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  { url: `${siteUrl}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  { url: `${siteUrl}/stories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  { url: `${siteUrl}/methodology`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${siteUrl}/affiliate-disclosure`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
];

/** A dedicated alternatives page is only indexable once it has this many curated rows. */
const INDEXABLE_ALTERNATIVES = 3;
/** Facet landings below this many products are noindex, so they stay out of the sitemap too. */
const INDEXABLE_FACET = 3;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.DATABASE_URL) return staticEntries();

  const [products, categories, stories, editorialLists, articles, alternativeCounts, useCases, audiences, platforms] = await Promise.all([
    prisma.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.story.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.editorialList.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.article.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    // Only list alternatives pages the metadata will actually allow to be indexed.
    prisma.productAlternative.groupBy({
      by: ["productId"],
      where: { alternative: { status: "PUBLISHED", category: { status: "PUBLISHED" } } },
      _count: { alternativeId: true },
    }),
    getUseCases(),
    getAudiences(),
    getPlatforms(),
  ]);

  const indexableAlternativeIds = new Set(
    alternativeCounts.filter((row) => row._count.alternativeId >= INDEXABLE_ALTERNATIVES).map((row) => row.productId),
  );
  const productSlugsById = new Map(
    (await prisma.product.findMany({
      where: { id: { in: [...indexableAlternativeIds] }, status: "PUBLISHED" },
      select: { id: true, slug: true, updatedAt: true },
    })).map((row) => [row.id, row]),
  );

  return [
    ...staticEntries(),
    ...categories.map((category) => ({ url: `${siteUrl}/categories/${category.slug}`, lastModified: category.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...products.map((product) => ({ url: `${siteUrl}/tools/${product.slug}`, lastModified: product.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...[...productSlugsById.values()].map((product) => ({ url: `${siteUrl}/tools/${product.slug}/alternatives`, lastModified: product.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...stories.map((story) => ({ url: `${siteUrl}/stories/${story.slug}`, lastModified: story.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...editorialLists.map((list) => ({ url: `${siteUrl}/best/${list.slug}`, lastModified: list.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...articles.map((article) => ({ url: `${siteUrl}/articles/${article.slug}`, lastModified: article.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    // Facet landings, listed only where the page is actually indexable.
    ...useCases.filter((row) => row._count.products >= INDEXABLE_FACET).map((row) => ({ url: `${siteUrl}/tools/use-case/${row.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...audiences.filter((row) => row._count.products >= INDEXABLE_FACET).map((row) => ({ url: `${siteUrl}/tools/audience/${row.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...platforms.filter((row) => row._count.products >= INDEXABLE_FACET).map((row) => ({ url: `${siteUrl}/tools/platform/${row.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}
