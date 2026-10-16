// DRY RUN ONLY - this script never writes to the database.
// Proposes evergreen seoTitle values (strips a stale hard-coded year, repairs mojibake)
// and writes a CSV with old and new values, which doubles as the rollback backup.
// Run: node --env-file=.env.local scripts/seo-fix-titles-dry-run.mjs
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";

const prisma = new PrismaClient();
const thisYear = new Date().getFullYear();

const MOJIBAKE = [["â€“", "–"], ["â€”", "—"], ["â€™", "’"], ["â€˜", "‘"], ["â€œ", "“"], ["â€\u009d", "”"], ["Ã©", "é"], ["Ã¨", "è"], ["Ã¼", "ü"], ["Ã¶", "ö"], ["Ã¤", "ä"], ["Ã±", "ñ"]];
const fixMojibake = (s) => MOJIBAKE.reduce((acc, [bad, good]) => acc.split(bad).join(good), s);

function proposeTitle(title) {
  let t = fixMojibake(title);
  const hadStaleYear = (t.match(/\b20\d{2}\b/g) ?? []).some((y) => Number(y) < thisYear);
  if (hadStaleYear) t = t.replace(/\s*\b20(?:[0-2]\d)\b(?<!2026)/g, (m) => (m.trim() === String(thisYear) ? m : ""));
  t = t.replace(/\s{2,}/g, " ").replace(/\s+([–—:,?])/g, " $1").replace(/\s+–\s*$/, "").trim();
  // A removal that leaves a dangling preposition ("Best X in –") needs a human.
  const dangling = /\b(in|for|of)\s+([–—:|]|$)/i.test(t);
  return { t, hadStaleYear, dangling };
}

const rows = await prisma.product.findMany({
  where: { status: "PUBLISHED", seoTitle: { not: null } },
  select: { slug: true, seoTitle: true },
  orderBy: { slug: "asc" },
});

const csvCell = (v) => `"${String(v).replaceAll('"', '""')}"`;
const out = [["slug", "old_title", "new_title", "status"].join(",")];
const stats = { changed: 0, manual: 0, unchanged: 0 };
for (const r of rows) {
  const old = r.seoTitle.trim();
  const { t, dangling } = proposeTitle(old);
  const status = t === old ? "unchanged" : dangling ? "needs-manual-review" : "auto-ok";
  if (status === "unchanged") stats.unchanged++;
  else if (status === "auto-ok") stats.changed++;
  else stats.manual++;
  if (status !== "unchanged") out.push([r.slug, old, t, status].map(csvCell).join(","));
}
mkdirSync("docs/seo", { recursive: true });
writeFileSync("docs/seo/title-fix-dry-run.csv", "\uFEFF" + out.join("\n"), "utf8");
console.log(`Products with a seoTitle: ${rows.length}`, stats, "\nWrote docs/seo/title-fix-dry-run.csv (no DB writes).");
await prisma.$disconnect();
