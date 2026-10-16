// Imports a validated tool batch (see docs/tools/tool-onboarding-standard.md).
// Default = CHECK ONLY (reads, writes nothing). --apply creates each product as DRAFT
// inside one transaction. Never overwrites: a slug that already exists is skipped.
// Publishing is a separate, deliberate step (admin UI) after the owner checks the facts.
// Run: node --env-file=.env.local scripts/import-tool-batch.mjs docs/tools/batch-1/tools.json [--apply]
import { PrismaClient } from "@prisma/client";
import { existsSync, readFileSync } from "node:fs";

const apply = process.argv.includes("--apply");
const file = process.argv.find((a) => a.endsWith(".json"));
const CDN = "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/";
// Placeholder editorial values, agreed with the owner until a scoring rubric exists.
const PLACEHOLDER = { rating: 4.0, editorialScore: 75 };

const tools = JSON.parse(readFileSync(file, "utf8"));
const prisma = new PrismaClient();

const slugsOf = async (model, wanted) => {
  const rows = await prisma[model].findMany({ where: { slug: { in: wanted } }, select: { id: true, slug: true } });
  return new Map(rows.map((r) => [r.slug, r.id]));
};

const plan = [];
for (const t of tools) {
  const problems = [];
  const exists = await prisma.product.findUnique({ where: { slug: t.slug }, select: { id: true } });
  if (exists) { plan.push({ t, skip: "slug already exists" }); continue; }
  const [cat] = await prisma.category.findMany({ where: { slug: t.category }, select: { id: true } });
  if (!cat) problems.push(`category not found: ${t.category}`);
  const uc = await slugsOf("useCase", t.useCases), au = await slugsOf("audience", t.audiences), pf = await slugsOf("platform", t.platforms);
  for (const [label, want, got] of [["useCase", t.useCases, uc], ["audience", t.audiences, au], ["platform", t.platforms, pf]])
    want.filter((s) => !got.has(s)).forEach((s) => problems.push(`${label} not found: ${s}`));
  const alts = await slugsOf("product", t.alternatives.map((a) => a.slug));
  t.alternatives.filter((a) => !alts.has(a.slug)).forEach((a) => problems.push(`alternative not found: ${a.slug}`));
  const hasLogo = t.logoFile && t.logoFile !== "pending" && existsSync(t.logoFile);
  if (problems.length) plan.push({ t, skip: problems.join("; ") });
  else plan.push({ t, cat, uc, au, pf, alts, logoUrl: hasLogo ? CDN + t.logoFile : null });
}

for (const p of plan) console.log(p.skip ? `SKIP ${p.t.slug}: ${p.skip}` : `READY ${p.t.slug} (logo: ${p.logoUrl ? "yes" : "none yet"}, ${p.t.pricingPlans.length} plans, ${p.t.alternatives.length} alternatives)`);

if (!apply) {
  console.log("\nCHECK ONLY - nothing written. Re-run with --apply to create the READY tools as DRAFT.");
} else {
  const ready = plan.filter((p) => !p.skip);
  await prisma.$transaction(async (tx) => {
    for (const { t, cat, uc, au, pf, alts, logoUrl } of ready) {
      const product = await tx.product.create({
        data: {
          name: t.name, slug: t.slug, shortDescription: t.shortDescription, description: t.description,
          websiteUrl: t.websiteUrl, logoUrl, categoryId: cat.id,
          pricingModel: t.pricingModel, hasFreePlan: t.hasFreePlan, hasFreeTrial: t.hasFreeTrial,
          pros: t.pros.join("\n"), cons: t.cons.join("\n"), bestFor: t.bestFor, notFor: t.notFor,
          keyFeatures: t.keyFeatures.join("\n"), integrations: t.integrations.join("\n"), verdict: t.verdict,
          seoTitle: t.seoTitle, seoDescription: t.seoDescription,
          lastReviewedAt: t.lastReviewedAt ? new Date(t.lastReviewedAt) : null,
          ...PLACEHOLDER, featured: false, verified: false, status: "DRAFT",
          pricingPlans: { create: t.pricingPlans.map((pl, i) => ({ name: pl.name, priceLabel: pl.priceLabel, priceAmount: pl.priceAmount, currency: pl.currency, billingPeriod: pl.billingPeriod, description: pl.description, sortOrder: i })) },
          useCases: { create: t.useCases.map((s) => ({ useCaseId: uc.get(s) })) },
          audiences: { create: t.audiences.map((s) => ({ audienceId: au.get(s) })) },
          platforms: { create: t.platforms.map((s) => ({ platformId: pf.get(s) })) },
        },
      });
      for (const [rank, a] of t.alternatives.entries())
        await tx.productAlternative.create({ data: { productId: product.id, alternativeId: alts.get(a.slug), rank, reason: a.reason } });
      console.log(`created DRAFT ${t.slug}`);
    }
  }, { timeout: 120000 });
}
await prisma.$disconnect();
