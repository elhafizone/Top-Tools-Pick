// READ-ONLY audit: published products whose SEO title/description (or the description
// shown on the page) carry a stale year or a hard-coded price. Writes nothing.
// Run: node --env-file=.env.local scripts/seo-audit-stale-metadata.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const thisYear = new Date().getFullYear();
const price = /[$£€]\s?\d[\d,]*(\.\d+)?/;
const years = (s) => [...(s ?? "").matchAll(/\b(20\d{2})\b/g)].map((m) => Number(m[1]));

const rows = await prisma.product.findMany({
  where: { status: "PUBLISHED" },
  select: { slug: true, seoTitle: true, seoDescription: true, shortDescription: true, lastReviewedAt: true },
  orderBy: { slug: "asc" },
});

const staleYear = [], priceInMeta = [], suffixInTitle = [], longTitle = [], noTitle = [];
for (const r of rows) {
  const t = r.seoTitle?.trim() ?? "";
  const d = r.seoDescription?.trim() ?? "";
  if (!t) noTitle.push(r.slug);
  if (years(t + " " + d).some((y) => y < thisYear)) staleYear.push(`${r.slug}: ${t}`);
  if (price.test(d) || price.test(t)) priceInMeta.push(`${r.slug}: ${(price.test(d) ? d : t).slice(0, 110)}`);
  if (/\|\s*TopToolsPick\s*$/i.test(t)) suffixInTitle.push(r.slug);
  if (t.length > 65) longTitle.push(`${r.slug} (${t.length})`);
}
const noReview = rows.filter((r) => !r.lastReviewedAt).length;

const show = (label, arr, n = 40) => {
  console.log(`\n## ${label}: ${arr.length}`);
  arr.slice(0, n).forEach((x) => console.log(`- ${x}`));
  if (arr.length > n) console.log(`- ... ${arr.length - n} more`);
};
console.log(`Published products: ${rows.length}; year now: ${thisYear}`);
show(`Stale year (< ${thisYear}) in seoTitle/seoDescription`, staleYear);
show("Hard-coded price in seoTitle/seoDescription", priceInMeta);
show("seoTitle ends with '| TopToolsPick' (stored suffix)", suffixInTitle);
show("seoTitle longer than 65 chars", longTitle);
show("No seoTitle (falls back to generated title + template suffix)", noTitle);
console.log(`\n## Missing lastReviewedAt: ${noReview} of ${rows.length}`);
await prisma.$disconnect();
