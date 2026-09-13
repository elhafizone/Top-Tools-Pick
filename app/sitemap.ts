import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.DATABASE_URL) {
    return [
      { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
      { url: `${siteUrl}/tools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
      { url: `${siteUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
      { url: `${siteUrl}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    ];
  }
  const [products, categories, stories, editorialLists, articles] = await Promise.all([
    prisma.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.story.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.editorialList.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.article.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/best`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/stories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    ...categories.map((category) => ({ url: `${siteUrl}/categories/${category.slug}`, lastModified: category.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...products.map((product) => ({ url: `${siteUrl}/tools/${product.slug}`, lastModified: product.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...stories.map((story) => ({ url: `${siteUrl}/stories/${story.slug}`, lastModified: story.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...editorialLists.map((list) => ({ url: `${siteUrl}/best/${list.slug}`, lastModified: list.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...articles.map((article) => ({ url: `${siteUrl}/articles/${article.slug}`, lastModified: article.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
