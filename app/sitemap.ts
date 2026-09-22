import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://toptoolspick.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const statics: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/best`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/affiliate-disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Product pages
  const products = await prisma.product.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
  });

  const productUrls: MetadataRoute.Sitemap = products.flatMap((p) => [
    { url: `${BASE}/tools/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/tools/${p.slug}/alternatives`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 },
  ]);

  // Category pages
  const categories = await prisma.category.findMany({
    where: { status: "published" },
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
    where: { status: "published" },
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
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
  });

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...statics, ...productUrls, ...categoryUrls, ...listUrls, ...articleUrls];
}
