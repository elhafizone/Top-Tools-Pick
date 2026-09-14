import { prisma } from "@/lib/db/prisma";

export const ARTICLES_PER_PAGE = 6;

const publishedArticleWhere = { status: "PUBLISHED" as const };

/**
 * Article topics. Free text in the database so a new topic never needs a schema
 * change, but the values the app routes on are named here so they stay consistent.
 */
export const ARTICLE_TOPICS = ["comparisons", "guides", "news"] as const;
export type ArticleTopic = (typeof ARTICLE_TOPICS)[number];

export const TOPIC_LABELS: Record<string, string> = {
  comparisons: "Comparison",
  guides: "Guide",
  news: "News",
};

export async function getPublishedArticles(page = 1, topic?: string) {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const where = { ...publishedArticleWhere, ...(topic ? { topic } : {}) };
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      skip: (safePage - 1) * ARTICLES_PER_PAGE,
      take: ARTICLES_PER_PAGE,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    articles,
    page: safePage,
    total,
    totalPages: Math.ceil(total / ARTICLES_PER_PAGE),
  };
}

/** Articles in one topic, newest first. Used by /comparisons and the compare rail. */
export async function getArticlesByTopic(topic: string, take?: number) {
  return prisma.article.findMany({
    where: { ...publishedArticleWhere, topic },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    ...(take ? { take } : {}),
  });
}

export async function getPublishedArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, ...publishedArticleWhere },
    include: {
      // Article bodies are plain text, so the "tools mentioned" rail is the only way
      // an article can link into the commercial pages at all.
      productLinks: {
        where: { product: { status: "PUBLISHED", category: { status: "PUBLISHED" } } },
        orderBy: { rank: "asc" },
        include: {
          product: {
            include: {
              category: true,
              pricingPlans: { orderBy: [{ sortOrder: "asc" }, { priceAmount: { sort: "asc", nulls: "last" } }] },
              affiliatePrograms: {
                where: { status: "ACTIVE" },
                include: { links: { where: { enabled: true }, orderBy: { priority: "desc" } } },
              },
            },
          },
        },
      },
    },
  });
}

/** Prefers articles in the same topic, then falls back to filling from anything else. */
export async function getRelatedPublishedArticles(articleId: string, topic?: string | null) {
  const sameTopic = topic
    ? await prisma.article.findMany({
        where: { ...publishedArticleWhere, topic, id: { not: articleId } },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        take: 3,
      })
    : [];
  if (sameTopic.length >= 3) return sameTopic;

  const exclude = [articleId, ...sameTopic.map((article) => article.id)];
  const filler = await prisma.article.findMany({
    where: { ...publishedArticleWhere, id: { notIn: exclude } },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: 3 - sameTopic.length,
  });
  return [...sameTopic, ...filler];
}
