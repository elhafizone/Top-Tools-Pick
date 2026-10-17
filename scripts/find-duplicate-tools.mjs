// READ-ONLY. Finds products that look like the same tool published more than once and
// writes docs/seo/duplicate-tools-report.md. Changes nothing.
// Run: node --env-file=.env.local scripts/find-duplicate-tools.mjs
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";

const prisma = new PrismaClient();
const rows = await prisma.product.findMany({
  select: {
    slug: true, name: true, websiteUrl: true, status: true, description: true, lastReviewedAt: true, canonicalUrl: true,
    _count: { select: { pricingPlans: true, alternatives: true, alternativeFor: true, articleLinks: true, editorialItems: true, useCases: true } },
  },
  orderBy: { slug: "asc" },
});

const words = (s) => (s ?? "").trim().split(/\s+/).filter(Boolean).length;
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
const registrable = (h) => h.split(".").slice(-2).join(".");
// Suffix words that name a variant of the same product rather than another product.
const NOISE = new Set(["ai", "app", "editor", "ide", "com", "cms", "sms", "scheduling", "audio", "method", "fm", "ui"]);
const key = (slug) => slug.split("-").filter((t) => !NOISE.has(t)).join("-") || slug;

// Higher = more complete page; the best-filled page of a group is the one to keep.
const score = (p) =>
  Math.min(words(p.description), 250) / 5 + p._count.pricingPlans * 8 + (p.lastReviewedAt ? 10 : 0) +
  p._count.articleLinks * 6 + p._count.editorialItems * 6 + (p._count.alternatives + p._count.alternativeFor) * 4 + p._count.useCases * 2;

const live = rows.filter((r) => r.status === "PUBLISHED");
const byHost = new Map();
for (const r of live) { const h = host(r.websiteUrl); (byHost.get(h) ?? byHost.set(h, []).get(h)).push(r); }

const strong = [], family = [];
for (const [h, list] of byHost) {
  if (list.length < 2) continue;
  // Same hostname: duplicates when their slug keys collapse or one slug extends another.
  const used = new Set();
  for (const a of list) {
    if (used.has(a.slug)) continue;
    const grp = list.filter((b) => key(a.slug) === key(b.slug) || a.slug.startsWith(b.slug + "-") || b.slug.startsWith(a.slug + "-"));
    if (grp.length > 1) { grp.forEach((g) => used.add(g.slug)); strong.push({ h, grp }); }
  }
  const rest = list.filter((x) => !used.has(x.slug));
  if (rest.length > 1) family.push({ h, grp: rest });
}
// Different hostnames, same registrable domain (e.g. gemini.google.com vs analytics.google.com): vendor family.
const byReg = new Map();
for (const [h, list] of byHost) (byReg.get(registrable(h)) ?? byReg.set(registrable(h), []).get(registrable(h))).push(...list);
const vendorOnly = [...byReg].filter(([, l]) => new Set(l.map((x) => host(x.websiteUrl))).size > 1 && l.length > 1);

const fmt = (p) => `${p.slug} (score ${Math.round(score(p))}; ${words(p.description)} words, ${p._count.pricingPlans} plans, ${p.lastReviewedAt ? "reviewed" : "not reviewed"})`;
let md = `# Duplicate tools report\n\nGenerated ${new Date().toISOString().slice(0, 10)} from the live database (read-only). ${live.length} published products.\n\n`;
md += `**Policy:** one page per tool or vendor, at \`/tools/<name>\`, covering everything it offers. Keep the most complete page, redirect the rest.\n\n`;
md += `## A. Same product published more than once (${strong.length} groups) - recommended to merge\n\n| Keep | Redirect to it | Site |\n|---|---|---|\n`;
for (const { h, grp } of strong) {
  const sorted = [...grp].sort((a, b) => score(b) - score(a) || a.slug.length - b.slug.length);
  md += `| ${fmt(sorted[0])} | ${sorted.slice(1).map(fmt).join("<br>")} | ${h} |\n`;
}
md += `\n## B. Same hostname, different product lines (${family.length} groups) - decide per group\n\n`;
for (const { h, grp } of family) md += `- **${h}**: ${grp.map((p) => p.slug).join(", ")}\n`;
md += `\n## C. Same vendor, different sites (${vendorOnly.length} vendors) - usually fine\n\n`;
for (const [d, l] of vendorOnly) md += `- **${d}**: ${l.map((p) => p.slug).join(", ")}\n`;
writeFileSync("docs/seo/duplicate-tools-report.md", md, "utf8");
writeFileSync("docs/seo/duplicate-groups.json", JSON.stringify(strong.map(({ h, grp }) => ({
  site: h,
  members: [...grp].sort((a, b) => score(b) - score(a) || a.slug.length - b.slug.length).map((p) => ({ slug: p.slug, name: p.name, score: Math.round(score(p)) })),
})), null, 1), "utf8");
console.log(`published ${live.length} | A (merge): ${strong.length} groups, ${strong.reduce((n, g) => n + g.grp.length - 1, 0)} redirects | B: ${family.length} | C: ${vendorOnly.length}`);
await prisma.$disconnect();
