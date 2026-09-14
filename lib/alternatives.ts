import { prisma } from "@/lib/db/prisma";

/**
 * Curated alternatives only - by explicit decision.
 *
 * There is no derived fallback. An alternative is only worth showing alongside a
 * reason ("better free plan", "better for small teams"), and a reason like that
 * cannot be inferred from a shared category without inventing a claim. So when no
 * editor has written the rows, this returns [] and the UI hides the section entirely.
 *
 * Both the alternative and its category must be published, matching the visibility
 * rule getProductBySlug already applies.
 */
export async function getAlternatives(productId: string, limit?: number) {
  const rows = await prisma.productAlternative.findMany({
    where: {
      productId,
      alternative: { status: "PUBLISHED", category: { status: "PUBLISHED" } },
    },
    orderBy: [{ rank: "asc" }, { createdAt: "asc" }],
    ...(limit ? { take: limit } : {}),
    include: {
      alternative: {
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
  });
  return rows;
}

export type CuratedAlternative = Awaited<ReturnType<typeof getAlternatives>>[number];

/** Count only - used to decide whether the dedicated alternatives page is worth indexing. */
export async function countAlternatives(productId: string) {
  return prisma.productAlternative.count({
    where: {
      productId,
      alternative: { status: "PUBLISHED", category: { status: "PUBLISHED" } },
    },
  });
}
