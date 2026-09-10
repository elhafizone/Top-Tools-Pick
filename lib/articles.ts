import { prisma } from "@/lib/db/prisma";

export const ARTICLES_PER_PAGE = 6;

const publishedArticleWhere = { status: "PUBLISHED" as const };

export async function getPublishedArticles(page = 1) {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: publishedArticleWhere,
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      skip: (safePage - 1) * ARTICLES_PER_PAGE,
      take: ARTICLES_PER_PAGE,
    }),
    prisma.article.count({ where: publishedArticleWhere }),
  ]);

  return {
    articles,
    page: safePage,
    total,
    totalPages: Math.ceil(total / ARTICLES_PER_PAGE),
  };
}

export async function getPublishedArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, ...publishedArticleWhere },
  });
}

export async function getRelatedPublishedArticles(articleId: string) {
  return prisma.article.findMany({
    where: { ...publishedArticleWhere, id: { not: articleId } },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: 3,
  });
}
