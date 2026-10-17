// Gives the kept page of each merged group the plain tool name as its URL.
// The kept row and the archived duplicate that holds the clean slug swap slugs, so the old
// URL keeps resolving: it becomes the archived row, which 301s to the clean page.
// Default = CHECK ONLY. --apply runs one transaction and saves a backup of every slug/canonicalUrl it touches.
// Run: node --env-file=.env.local scripts/rename-to-clean-slugs.mjs [--apply]
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "node:fs";

const apply = process.argv.includes("--apply");
const MAP = {
  "capacities-app": "capacities", "cleanfeed-audio": "cleanfeed", "coda-io": "coda",
  "consensus-ai": "consensus", "cursor-ai": "cursor", "elicit-ai": "elicit", "ghost-cms": "ghost", "jasper-ai": "jasper",
  "lark-suite": "lark", "poe-ai": "poe", "runway-ml": "runway", "stability-ai-api": "stability-ai", "suno-ai": "suno",
  "tandem-app": "tandem", "tome-app": "tome", "transistor-fm": "transistor",
};
// Same product under two live slugs (windsurf.ai and the old codeium.com/windsurf listing):
// the second is archived and sent to the first instead of swapping slugs.
const FOLD = { "windsurf-ide": "windsurf" };
const prisma = new PrismaClient();
const slugs = [...Object.keys(MAP), ...Object.values(MAP), ...Object.keys(FOLD), ...Object.values(FOLD)];
const rows = await prisma.product.findMany({ where: { slug: { in: slugs } }, select: { id: true, slug: true, status: true, canonicalUrl: true } });
const by = new Map(rows.map((r) => [r.slug, r]));
const pointing = await prisma.product.findMany({ where: { canonicalUrl: { in: [...Object.keys(MAP), ...Object.keys(FOLD)].map((k) => `/tools/${k}`) } }, select: { id: true, slug: true, canonicalUrl: true } });

const work = [], problems = [];
for (const [from, to] of Object.entries(MAP)) {
  const kept = by.get(from), holder = by.get(to);
  if (!kept || kept.status !== "PUBLISHED") { problems.push(`${from}: not a published page`); continue; }
  if (!holder) { problems.push(`${to}: no archived row holds the clean slug, cannot keep ${from} redirecting`); continue; }
  if (holder.status !== "ARCHIVED") { problems.push(`${to}: clean slug is held by a non-archived page`); continue; }
  work.push({ from, to, kept, holder });
}
for (const [from, to] of Object.entries(FOLD)) {
  const a = by.get(from), b = by.get(to);
  if (!a || !b || a.status !== "PUBLISHED" || b.status !== "PUBLISHED") problems.push(`${from} -> ${to}: both must be published to fold`);
  else console.log(`  fold /tools/${from} into /tools/${to} (archive + 301)`);
}
console.log(`renames: ${work.length} | problems: ${problems.length} | other archived pages to re-point: ${pointing.filter((p) => !MAP[p.slug]).length}`);
problems.forEach((p) => console.log("  PROBLEM", p));
work.forEach((w) => console.log(`  /tools/${w.from} -> /tools/${w.to}  (old URL keeps redirecting)`));

if (!apply) console.log("\nCHECK ONLY - nothing written.");
else if (problems.length) console.log("\nRefusing to apply while there are problems.");
else {
  const backup = `docs/seo/slug-rename-backup-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(backup, JSON.stringify({ rows, pointing }, null, 1));
  await prisma.$transaction(async (tx) => {
    for (const { from, to, kept, holder } of work) {
      await tx.product.update({ where: { id: holder.id }, data: { slug: `tmp-${holder.id}` } });
      await tx.product.update({ where: { id: kept.id }, data: { slug: to, canonicalUrl: null } });
      await tx.product.update({ where: { id: holder.id }, data: { slug: from, canonicalUrl: `/tools/${to}` } });
    }
    for (const [from, to] of Object.entries(FOLD)) {
      await tx.product.update({ where: { id: by.get(from).id }, data: { status: "ARCHIVED", canonicalUrl: `/tools/${to}`, featured: false } });
    }
    // Archived duplicates that pointed at an old kept slug now point at the clean one.
    for (const p of pointing) {
      const old = p.canonicalUrl.replace("/tools/", "");
      const target = MAP[old] ?? FOLD[old];
      if (target && !MAP[p.slug] && !FOLD[p.slug]) await tx.product.update({ where: { id: p.id }, data: { canonicalUrl: `/tools/${target}` } });
    }
  }, { timeout: 120000 });
  console.log(`renamed ${work.length} pages. Backup: ${backup}`);
}
await prisma.$disconnect();
