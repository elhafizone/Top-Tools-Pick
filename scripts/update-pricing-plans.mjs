// Updates PricingPlan rows from a reviewed JSON file. Default = CHECK ONLY: prints a
// before/after comparison and writes nothing. --apply replaces each listed product's
// plans (except names in keepPlans) in one transaction. Touches only PricingPlan rows and
// the explicit `flags` in the file; never lastReviewedAt, never affiliate data.
// Run: node --env-file=.env.local scripts/update-pricing-plans.mjs docs/tools/pricing-update-2026-10-16.json [--apply]
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const apply = process.argv.includes("--apply");
const file = process.argv.find((a) => a.endsWith(".json"));
const spec = JSON.parse(readFileSync(file, "utf8"));
const prisma = new PrismaClient();

const line = (p) => `${p.name}: ${p.priceLabel}`;
const work = [];
for (const item of spec.products) {
  const product = await prisma.product.findUnique({
    where: { slug: item.slug },
    select: { id: true, hasFreePlan: true, hasFreeTrial: true, pricingPlans: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) { console.log(`SKIP ${item.slug}: not found`); continue; }
  const kept = product.pricingPlans.filter((p) => item.keepPlans.includes(p.name));
  console.log(`\n=== ${item.slug}  (source: ${item.source}, checked ${spec.checkedAt})`);
  console.log("BEFORE:\n" + product.pricingPlans.map((p) => `  - ${line(p)}`).join("\n"));
  console.log("AFTER:\n" + [...item.plans.map((p) => `  - ${line(p)}`), ...kept.map((p) => `  - ${line(p)}   [kept, not re-verified]`)].join("\n"));
  for (const [k, v] of Object.entries(item.flags)) if (product[k] !== v) console.log(`FLAG ${k}: ${product[k]} -> ${v}`);
  work.push({ item, product, kept });
}

if (!apply) {
  console.log("\nCHECK ONLY - nothing written. Re-run with --apply to write.");
} else {
  await prisma.$transaction(async (tx) => {
    for (const { item, product, kept } of work) {
      await tx.pricingPlan.deleteMany({ where: { productId: product.id, id: { notIn: kept.map((k) => k.id) } } });
      await tx.pricingPlan.createMany({
        data: item.plans.map((p, i) => ({ productId: product.id, name: p.name, priceLabel: p.priceLabel, priceAmount: p.priceAmount, currency: p.currency, billingPeriod: p.billingPeriod, description: p.description, sortOrder: i })),
      });
      // Kept plans sort after the verified ones.
      for (const [i, k] of kept.entries()) await tx.pricingPlan.update({ where: { id: k.id }, data: { sortOrder: item.plans.length + i } });
      if (Object.keys(item.flags).length) await tx.product.update({ where: { id: product.id }, data: item.flags });
      console.log(`updated ${item.slug}`);
    }
  }, { timeout: 120000 });
}
await prisma.$disconnect();
