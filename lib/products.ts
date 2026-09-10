import { prisma } from "@/lib/db/prisma";
import type { PricingModel } from "@prisma/client";

const productContext = {
  category: true,
  subcategory: true,
  tags: { include: { tag: true } },
  useCases: { include: { useCase: true } },
  audiences: { include: { audience: true } },
  platforms: { include: { platform: true } },
  pricingPlans: { orderBy: { priceAmount: "asc" as const } },
  affiliatePrograms: {
    where: { status: "ACTIVE" as const },
    include: { links: { where: { enabled: true }, orderBy: { priority: "desc" as const } } },
  },
  reviews: { where: { published: true }, orderBy: { createdAt: "desc" as const } },
} as const;

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { status: "PUBLISHED", featured: true },
    include: { category: true, pricingPlans: true },
    orderBy: [{ editorialScore: "desc" }, { rating: "desc" }],
    take: 6,
  });
}

export type ProductFilters = {
  query?: string;
  category?: string;
  pricingModel?: PricingModel;
  freePlan?: boolean;
  freeTrial?: boolean;
};

export async function getProducts(filters: ProductFilters = {}) {
  const { query, category, pricingModel, freePlan, freeTrial } = filters;
  return prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { category: { slug: category, status: "PUBLISHED" as const } } : {}),
      ...(pricingModel ? { pricingModel } : {}),
      ...(freePlan !== undefined ? { hasFreePlan: freePlan } : {}),
      ...(freeTrial !== undefined ? { hasFreeTrial: freeTrial } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { shortDescription: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { editorialScore: "desc" },
  });
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

export async function getComparisonBySlug(slug: string) {
  return prisma.comparison.findFirst({
    where: { slug, status: "PUBLISHED", productA: { status: "PUBLISHED" }, productB: { status: "PUBLISHED" } },
    include: {
      productA: { include: { category: true, pricingPlans: true, affiliatePrograms: { where: { status: "ACTIVE" }, include: { links: { where: { enabled: true } } } } } },
      productB: { include: { category: true, pricingPlans: true, affiliatePrograms: { where: { status: "ACTIVE" }, include: { links: { where: { enabled: true } } } } } },
    },
  });
}

export async function getPublishedComparisons() {
  return prisma.comparison.findMany({
    where: { status: "PUBLISHED", productA: { status: "PUBLISHED" }, productB: { status: "PUBLISHED" } },
    include: { productA: { select: { name: true, slug: true } }, productB: { select: { name: true, slug: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPublishedCategories() {
  return prisma.category.findMany({ where: { parentId: null, status: "PUBLISHED" }, orderBy: { name: "asc" } });
}

export async function getEditorialListBySlug(slug: string) {
  return prisma.editorialList.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      items: {
        orderBy: { rank: "asc" },
        include: { product: { include: { category: true, pricingPlans: true } } },
      },
    },
  });
}

export async function getPublishedEditorialLists() {
  return prisma.editorialList.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, title: true, description: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}
