// Offline validator for docs/tools/tool-onboarding-standard.md. No database access.
// Run: node scripts/validate-tool-batch.mjs path/to/tools.json   (one object or an array)
import { readFileSync } from "node:fs";
const input = JSON.parse(readFileSync(process.argv[2], "utf8"));
const tools = Array.isArray(input) ? input : [input];
const words = (s) => (s ?? "").trim().split(/\s+/).filter(Boolean).length;
const PRICING = ["FREE", "FREEMIUM", "SUBSCRIPTION", "ONE_TIME", "LIFETIME", "USAGE_BASED", "CUSTOM"];
let failed = 0;
for (const t of tools) {
  const e = [];
  const need = (ok, msg) => { if (!ok) e.push(msg); };
  need(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug ?? "") && !/\b20\d\d\b/.test(t.slug ?? ""), "slug must be lowercase-hyphen, no year");
  need(/^https:\/\/[^?#]+$/.test(t.websiteUrl ?? ""), "websiteUrl must be https without params");
  need(words(t.shortDescription) >= 12 && words(t.shortDescription) <= 25, "shortDescription 12-25 words");
  need(words(t.description) >= 150 && (t.description ?? "").split(/\n\n/).filter(Boolean).length >= 3, "description >= 150 words in 3+ paragraphs");
  need(t.bestFor?.trim() && t.notFor?.trim(), "bestFor and notFor required");
  need((t.pros?.length ?? 0) >= 3 && t.pros.length <= 6 && (t.cons?.length ?? 0) >= 3 && t.cons.length <= 6, "3-6 pros and 3-6 cons");
  need((t.keyFeatures?.length ?? 0) >= 5 && t.keyFeatures.length <= 8, "5-8 keyFeatures");
  need(PRICING.includes(t.pricingModel), "invalid pricingModel");
  need((t.pricingPlans?.length ?? 0) >= 1 && t.pricingPlans.every((p) => p.name && p.priceLabel), "every pricing plan needs name and priceLabel");
  need(t.pricingPlans?.every((p) => p.priceAmount == null || p.currency), "numeric price needs a currency");
  need(!t.hasFreePlan || t.pricingPlans?.some((p) => /free/i.test(p.name + p.priceLabel)), "hasFreePlan but no free plan listed");
  need(words(t.verdict) >= 20, "verdict too short");
  need(t.seoTitle && t.seoTitle.length <= 60 && !/\b20\d\d\b|\$\d|best/i.test(t.seoTitle), "seoTitle <= 60, no year/price/'Best'");
  need(t.seoDescription && t.seoDescription.length >= 120 && t.seoDescription.length <= 155, "seoDescription 120-155 chars");
  need(t.useCases?.length && t.audiences?.length && t.platforms?.length, "needs use case, audience and platform");
  need(!t.alternatives?.length || t.alternatives.every((a) => a.slug && a.reason), "each alternative needs a reason");
  need(t.logoFile, "logoFile required");
  need((t.sources?.length ?? 0) >= 2 && t.sources.some((s) => /pricing/i.test(s.note ?? "")) && t.sources.every((s) => /^https:\/\//.test(s.url) && /^\d{4}-\d\d-\d\d$/.test(s.checkedAt)), ">= 2 dated sources incl. the official pricing page");
  need(!t.lastReviewedAt || t.lastReviewedAt === t.sources?.map((s) => s.checkedAt).sort().at(-1), "lastReviewedAt must equal the latest source check date");
  if (e.length) { failed++; console.log(`FAIL ${t.slug || "(no slug)"}\n  - ${e.join("\n  - ")}`); } else console.log(`OK   ${t.slug}`);
}
process.exit(failed ? 1 : 0);
