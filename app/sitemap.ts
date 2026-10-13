import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

const BASE = "https://toptoolspick.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages — /compare is excluded: it carries noindex (user-driven builder, not a
  // content destination) so including it wastes crawl budget without indexing benefit.
  const statics: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/best`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/affiliate-disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Product pages — alternatives are only included when the product has enough curated
  // entries to be indexable (mirrors the INDEXABLE_ALTERNATIVES threshold on the page).
  const MIN_ALTERNATIVES = 3;
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      updatedAt: true,
      _count: {
        select: {
          alternatives: {
            where: { alternative: { status: "PUBLISHED", category: { status: "PUBLISHED" } } },
          },
        },
      },
    },
  });

  const productUrls: MetadataRoute.Sitemap = products.flatMap((p) => {
    const rows: MetadataRoute.Sitemap = [
      { url: `${BASE}/tools/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly", priority: 0.85 },
    ];
    if (p._count.alternatives >= MIN_ALTERNATIVES) {
      rows.push({ url: `${BASE}/tools/${p.slug}/alternatives`, lastModified: p.updatedAt, changeFrequency: "monthly", priority: 0.5 });
    }
    return rows;
  });

  // Category pages
  const categories = await prisma.category.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/categories/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // Editorial list pages (buying guides)
  const lists = await prisma.editorialList.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const listUrls: MetadataRoute.Sitemap = lists.map((l) => ({
    url: `${BASE}/best/${l.slug}`,
    lastModified: l.updatedAt,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // Article pages
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Story pages
  const stories = await prisma.story.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, publishedAt: true },
  });

  const storyUrls: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${BASE}/stories/${s.slug}`,
    lastModified: s.publishedAt ?? now,
    changeFrequency: "monthly",
    priority: 0.55,
  }));

  // Facet pages — use-case, audience, platform. Only include facets with enough tools
  // to be indexable (mirrors the MIN_INDEXABLE gate on each facet page).
  const MIN_FACET = 3;

  const [useCases, audiences, platforms] = await Promise.all([
    prisma.useCase.findMany({
      select: { slug: true, _count: { select: { products: { where: { product: { status: "PUBLISHED" } } } } } },
    }),
    prisma.audience.findMany({
      select: { slug: true, _count: { select: { products: { where: { product: { status: "PUBLISHED" } } } } } },
    }),
    prisma.platform.findMany({
      select: { slug: true, _count: { select: { products: { where: { product: { status: "PUBLISHED" } } } } } },
    }),
  ]);

  const useCaseUrls: MetadataRoute.Sitemap = useCases
    .filter((u) => u._count.products >= MIN_FACET)
    .map((u) => ({ url: `${BASE}/tools/use-case/${u.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 }));

  const audienceUrls: MetadataRoute.Sitemap = audiences
    .filter((a) => a._count.products >= MIN_FACET)
    .map((a) => ({ url: `${BASE}/tools/audience/${a.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.65 }));

  const platformUrls: MetadataRoute.Sitemap = platforms
    .filter((p) => p._count.products >= MIN_FACET)
    .map((p) => ({ url: `${BASE}/tools/platform/${p.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.65 }));

  return [...statics, ...productUrls, ...categoryUrls, ...listUrls, ...articleUrls, ...storyUrls, ...useCaseUrls, ...audienceUrls, ...platformUrls];
}
