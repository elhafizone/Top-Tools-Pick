import { prisma } from "@/lib/db/prisma";
import type { PricingModel, Prisma } from "@prisma/client";

const productContext = {
  category: true,
  subcategory: true,
  tags: { include: { tag: true } },
  useCases: { include: { useCase: true } },
  audiences: { include: { audience: true } },
  platforms: { include: { platform: true } },
  // Explicit ordering: editors control the order via sortOrder, and plans with no
  // priceAmount sort last instead of relying on Postgres' implicit NULLS LAST.
  pricingPlans: {
    orderBy: [{ sortOrder: "asc" }, { priceAmount: { sort: "asc", nulls: "last" } }],
  },
  affiliatePrograms: {
    where: { status: "ACTIVE" },
    include: { links: { where: { enabled: true }, orderBy: { priority: "desc" } } },
  },
  reviews: { where: { published: true }, orderBy: { createdAt: "desc" } },
  // "Mentioned in" - closes the loop back up to the shortlists and guides that link here.
  editorialItems: {
    where: { list: { status: "PUBLISHED" } },
    include: { list: { select: { slug: true, title: true } } },
    orderBy: { rank: "asc" },
  },
  articleLinks: {
    where: { article: { status: "PUBLISHED" } },
    include: { article: { select: { slug: true, title: true, topic: true } } },
    orderBy: { rank: "asc" },
  },
  // `satisfies` rather than `as const`: the latter makes the orderBy arrays readonly,
  // which Prisma's generated input types reject.
} satisfies Prisma.ProductInclude;

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { status: "PUBLISHED", featured: true },
    include: {
      category: true,
      pricingPlans: true,
      // Needed by AffiliateCta on the homepage's featured pick. Scoped the same way as
      // every other outbound surface: active programmes, enabled links, priority first.
      affiliatePrograms: { where: { status: "ACTIVE" }, include: { links: { where: { enabled: true }, orderBy: { priority: "desc" } } } },
    },
    orderBy: [{ editorialScore: "desc" }, { rating: "desc" }],
    take: 6,
  });
}

/**
 * Sort orders offered on the directory.
 *
 * Every one is a deterministic tiebreak on `name` so two products with the same score
 * never swap places between requests - a list that reshuffles on reload reads as broken.
 */
export const SORT_ORDERS = {
  recommended: [{ featured: "desc" as const }, { editorialScore: "desc" as const }, { name: "asc" as const }],
  rating: [{ rating: "desc" as const }, { editorialScore: "desc" as const }, { name: "asc" as const }],
  name: [{ name: "asc" as const }],
  newest: [{ createdAt: "desc" as const }, { name: "asc" as const }],
};

export type SortOrder = keyof typeof SORT_ORDERS;

export const isSortOrder = (value: string | undefined): value is SortOrder =>
  Boolean(value && Object.prototype.hasOwnProperty.call(SORT_ORDERS, value));

export type ProductFilters = {
  query?: string;
  category?: string;
  pricingModel?: PricingModel;
  freePlan?: boolean;
  freeTrial?: boolean;
  useCase?: string;
  audience?: string;
  platform?: string;
  sort?: SortOrder;
};

/**
 * Need-based search.
 *
 * Matching only name + shortDescription meant a query like "tool for making websites"
 * or "invoicing" found nothing, even though the words sit in description, bestFor or
 * the taxonomy. This widens the match across everything a reader can actually see.
 *
 * Deliberately plain ILIKE rather than Postgres full-text: Prisma's schema language
 * cannot express a tsvector column or a GIN index, so FTS would need raw SQL that
 * `db push` fights on every later change. At this catalogue size it is not worth it.
 */
const searchFilter = (query: string) => ({
  OR: [
    { name: { contains: query, mode: "insensitive" as const } },
    { shortDescription: { contains: query, mode: "insensitive" as const } },
    { description: { contains: query, mode: "insensitive" as const } },
    { bestFor: { contains: query, mode: "insensitive" as const } },
    { keyFeatures: { contains: query, mode: "insensitive" as const } },
    { category: { name: { contains: query, mode: "insensitive" as const } } },
    { tags: { some: { tag: { name: { contains: query, mode: "insensitive" as const } } } } },
    { useCases: { some: { useCase: { name: { contains: query, mode: "insensitive" as const } } } } },
    { audiences: { some: { audience: { name: { contains: query, mode: "insensitive" as const } } } } },
  ],
});

export async function getProducts(filters: ProductFilters = {}) {
  const { query, category, pricingModel, freePlan, freeTrial, useCase, audience, platform, sort } = filters;
  return prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { category: { slug: category, status: "PUBLISHED" as const } } : {}),
      ...(pricingModel ? { pricingModel } : {}),
      ...(freePlan !== undefined ? { hasFreePlan: freePlan } : {}),
      ...(freeTrial !== undefined ? { hasFreeTrial: freeTrial } : {}),
      ...(useCase ? { useCases: { some: { useCase: { slug: useCase } } } } : {}),
      ...(audience ? { audiences: { some: { audience: { slug: audience } } } } : {}),
      ...(platform ? { platforms: { some: { platform: { slug: platform } } } } : {}),
      ...(query ? searchFilter(query) : {}),
    },
    include: { category: true },
    orderBy: SORT_ORDERS[sort ?? "recommended"],
  });
}

/** Taxonomy terms with published counts, for the browse-by-facet rails and filters. */
export async function getUseCases() {
  const rows = await prisma.useCase.findMany({
    select: { name: true, slug: true, _count: { select: { products: { where: { product: { status: "PUBLISHED" } } } } } },
    orderBy: { name: "asc" },
  });
  return rows.filter((row) => row._count.products > 0);
}

export async function getAudiences() {
  const rows = await prisma.audience.findMany({
    select: { name: true, slug: true, _count: { select: { products: { where: { product: { status: "PUBLISHED" } } } } } },
    orderBy: { name: "asc" },
  });
  return rows.filter((row) => row._count.products > 0);
}

export async function getPlatforms() {
  const rows = await prisma.platform.findMany({
    select: { name: true, slug: true, _count: { select: { products: { where: { product: { status: "PUBLISHED" } } } } } },
    orderBy: { name: "asc" },
  });
  return rows.filter((row) => row._count.products > 0);
}

/** Resolves a facet slug to its display name, or null when it does not exist. */
export async function getFacet(kind: "use-case" | "audience" | "platform", slug: string) {
  if (kind === "use-case") return prisma.useCase.findUnique({ where: { slug }, select: { name: true, slug: true } });
  if (kind === "audience") return prisma.audience.findUnique({ where: { slug }, select: { name: true, slug: true } });
  return prisma.platform.findUnique({ where: { slug }, select: { name: true, slug: true } });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({ where: { slug, status: "PUBLISHED", category: { status: "PUBLISHED" } }, include: productContext });
}

export async function getProductsByCategory(slug: string) {
  return prisma.product.findMany({
    where: { status: "PUBLISHED", category: { slug, status: "PUBLISHED" } },
    include: { category: true },
    orderBy: { editorialScore: "desc" },
  });
}

export async function getProductsByUseCase(slug: string) {
  return prisma.product.findMany({
    where: { status: "PUBLISHED", useCases: { some: { useCase: { slug } } } },
    include: { category: true },
    orderBy: { editorialScore: "desc" },
  });
}

export async function getProductsByAudience(slug: string) {
  return prisma.product.findMany({
    where: { status: "PUBLISHED", audiences: { some: { audience: { slug } } } },
    include: { category: true },
    orderBy: { editorialScore: "desc" },
  });
}

export async function getProductsByPlatform(slug: string) {
  return prisma.product.findMany({
    where: { status: "PUBLISHED", platforms: { some: { platform: { slug } } } },
    include: { category: true },
    orderBy: { editorialScore: "desc" },
  });
}

export async function getRelatedProducts(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { categoryId: true } });
  if (!product) return [];
  return prisma.product.findMany({
    where: { status: "PUBLISHED", categoryId: product.categoryId, id: { not: productId } },
    include: { category: true },
    orderBy: { editorialScore: "desc" },
    take: 3,
  });
}

export async function getPublishedCategories() {
  return prisma.category.findMany({ where: { parentId: null, status: "PUBLISHED" }, orderBy: { name: "asc" } });
}

/**
 * Categories that actually have something to show, with their published count.
 * Surfaces that promise a starting point - the homepage above all - must use this
 * rather than getPublishedCategories, or they send people into empty pages.
 */
export async function getPopulatedCategories() {
  const categories = await prisma.category.findMany({
    where: { parentId: null, status: "PUBLISHED" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: { select: { products: { where: { status: "PUBLISHED" } } } },
    },
    orderBy: { name: "asc" },
  });
  return categories.filter((category) => category._count.products > 0);
}

export async function getEditorialListBySlug(slug: string) {
  return prisma.editorialList.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: { select: { name: true, slug: true } },
      items: {
        where: { product: { status: "PUBLISHED", category: { status: "PUBLISHED" } } },
        orderBy: { rank: "asc" },
        include: {
          product: {
            include: {
              category: true,
              pricingPlans: { orderBy: [{ sortOrder: "asc" }, { priceAmount: { sort: "asc", nulls: "last" } }] },
              // A ranked buying list is the strongest conversion surface on the site,
              // so its items need everything the outbound CTA resolves against.
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

/** Award slots for a category, via the shortlist bound to it. Curated only. */
export async function getCategoryAwards(categorySlug: string) {
  const list = await prisma.editorialList.findFirst({
    where: { status: "PUBLISHED", category: { slug: categorySlug } },
    include: {
      items: {
        where: { award: { not: null }, product: { status: "PUBLISHED", category: { status: "PUBLISHED" } } },
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
  return list ? { slug: list.slug, title: list.title, items: list.items } : null;
}

export async function getPublishedEditorialLists() {
  return prisma.editorialList.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, title: true, description: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

export const MIN_COMPARE = 2;
export const MAX_COMPARE = 4;

/** Only categories with enough published products to actually compare are offered. */
export async function getComparableCategories() {
  const categories = await prisma.category.findMany({
    where: { status: "PUBLISHED" },
    select: { name: true, slug: true, description: true, _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
    orderBy: { name: "asc" },
  });
  return categories.filter((category) => category._count.products >= MIN_COMPARE);
}

export async function getCategoryWithComparableProducts(slug: string) {
  const category = await prisma.category.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      name: true,
      slug: true,
      description: true,
      products: {
        where: { status: "PUBLISHED" },
        orderBy: [{ editorialScore: "desc" }, { name: "asc" }],
        select: { slug: true, name: true, shortDescription: true },
      },
    },
  });
  return category && category.products.length >= MIN_COMPARE ? category : null;
}

/** Comparison rows. Scoped to the category so a URL cannot mix products across categories. */
export async function getProductsForComparison(categorySlug: string, slugs: string[]) {
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, status: "PUBLISHED", category: { slug: categorySlug, status: "PUBLISHED" } },
    include: {
      category: { select: { name: true, slug: true } },
      pricingPlans: { orderBy: { priceAmount: "asc" } },
      platforms: { include: { platform: { select: { name: true } } } },
      useCases: { include: { useCase: { select: { name: true } } } },
      audiences: { include: { audience: { select: { name: true } } } },
      affiliatePrograms: { where: { status: "ACTIVE" }, include: { links: { where: { enabled: true }, orderBy: { priority: "desc" } } } },
    },
  });
  // Preserve the order the visitor picked rather than the database's.
  return slugs.map((slug) => products.find((product) => product.slug === slug)).filter((product) => product !== undefined);
}
