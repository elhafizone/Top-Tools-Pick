import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * A small starter set of curated alternatives, so the feature is visible rather than
 * shipping empty. Additive and idempotent: upsert by (productId, alternativeId).
 *
 * Every reason here is traceable to a field we already store (hasFreePlan, bestFor,
 * pros/cons) rather than an outside claim. Edit or delete any of them from
 * /admin/products/<id> - this script is a starting point, not a fixture to preserve.
 */
const curated: Array<{ product: string; alternative: string; reason: string }> = [
  {
    product: "notion",
    alternative: "airtable",
    reason: "Stronger relational structure once your records outgrow a document.",
  },
  {
    product: "notion",
    alternative: "asana",
    reason: "Clearer task ownership, dependencies and timelines for multi-step projects.",
  },
  {
    product: "notion",
    alternative: "slack",
    reason: "Better if the real need is day-to-day team communication rather than documents.",
  },
  {
    product: "1password",
    alternative: "bitwarden",
    reason: "Free plan covers unlimited passwords across unlimited devices; 1Password has no free tier.",
  },
  {
    product: "shopify",
    alternative: "woocommerce",
    reason: "Free and self-hosted, so there is no monthly platform fee and you own the stack.",
  },
  {
    product: "quickbooks",
    alternative: "wave",
    reason: "Core accounting and invoicing cost nothing, with no subscription at all.",
  },
  {
    product: "quickbooks",
    alternative: "freshbooks",
    reason: "Simpler when the main job is billing clients rather than keeping full books.",
  },
];

async function main() {
  const slugs = [...new Set(curated.flatMap((row) => [row.product, row.alternative]))];
  const products = await prisma.product.findMany({ where: { slug: { in: slugs } }, select: { id: true, slug: true } });
  const idBySlug = new Map(products.map((row) => [row.slug, row.id]));

  let written = 0;
  const ranks = new Map<string, number>();

  for (const row of curated) {
    const productId = idBySlug.get(row.product);
    const alternativeId = idBySlug.get(row.alternative);
    if (!productId || !alternativeId) {
      console.warn(`SKIP  ${row.product} -> ${row.alternative}: product not found`);
      continue;
    }
    const rank = (ranks.get(row.product) ?? 0) + 1;
    ranks.set(row.product, rank);

    await prisma.productAlternative.upsert({
      where: { productId_alternativeId: { productId, alternativeId } },
      update: { rank, reason: row.reason },
      create: { productId, alternativeId, rank, reason: row.reason },
    });
    console.log(`ok    ${row.product} -> ${row.alternative} (rank ${rank})`);
    written += 1;
  }

  console.log(`\nwrote ${written} curated alternatives`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
