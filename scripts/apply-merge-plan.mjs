// Applies docs/seo/duplicate-merge-plan.json. Default = CHECK ONLY (writes nothing).
// --apply, per redirected product: status -> ARCHIVED and canonicalUrl -> /tools/<kept slug>
// (the tool page then answers with a 301 to it). Article links on the old page move to the
// kept page when it does not have them yet. Old values are saved to a backup file first.
// Nothing is deleted. Rollback: restore status/canonicalUrl from the backup file.
// Run: node --env-file=.env.local scripts/apply-merge-plan.mjs [--only=slug1,slug2] [--apply]
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "node:fs";

const apply = process.argv.includes("--apply");
const only = (process.argv.find((a) => a.startsWith("--only=")) ?? "").slice(7).split(",").filter(Boolean);
const plan = JSON.parse(readFileSync("docs/seo/duplicate-merge-plan.json", "utf8"));
const prisma = new PrismaClient();

const slugs = plan.flatMap((g) => [g.keep, ...g.redirect_to_keep, ...g.also_keep_separate]);
const rows = await prisma.product.findMany({
  where: { slug: { in: slugs } },
  select: {
    id: true, slug: true, status: true, canonicalUrl: true,
    _count: { select: { editorialItems: true, articleLinks: true, reviews: true } },
    articleLinks: { select: { articleId: true, rank: true, note: true } },
  },
});
const by = new Map(rows.map((r) => [r.slug, r]));

const actions = [], problems = [];
for (const g of plan) {
  const keep = by.get(g.keep);
  if (!keep || keep.status !== "PUBLISHED") { problems.push(`${g.site}: kept page "${g.keep}" missing or not published`); continue; }
  for (const slug of g.redirect_to_keep) {
    const r = by.get(slug);
    if (!r) { problems.push(`${slug}: not found`); continue; }
    if (r.status === "ARCHIVED") continue; // already merged
    if (only.length && !only.includes(slug)) continue;
    actions.push({ from: r, to: keep });
  }
}

console.log(`groups: ${plan.length} | pages to merge: ${actions.length} | problems: ${problems.length}`);
problems.forEach((p) => console.log("  PROBLEM", p));
const deps = actions.filter((a) => a.from._count.articleLinks || a.from._count.editorialItems || a.from._count.reviews);
console.log(`pages with article links / list entries / reviews: ${deps.length}`);
deps.forEach((a) => console.log(`  ${a.from.slug} -> ${a.to.slug}: articles ${a.from._count.articleLinks}, list entries ${a.from._count.editorialItems}, reviews ${a.from._count.reviews}`));

if (!apply) {
  console.log("\nCHECK ONLY - nothing written. Re-run with --apply to merge.");
} else if (problems.length) {
  console.log("\nRefusing to apply while there are problems.");
} else {
  const stamp = new Date().toISOString().slice(0, 10);
  const backupFile = `docs/seo/merge-backup-${stamp}${only.length ? "-" + only.join("_") : ""}.json`;
  writeFileSync(backupFile, JSON.stringify(actions.map((a) => ({ slug: a.from.slug, status: a.from.status, canonicalUrl: a.from.canonicalUrl, mergedInto: a.to.slug })), null, 1));
  await prisma.$transaction(async (tx) => {
    for (const { from, to } of actions) {
      const keepLinks = new Set((await tx.articleProductLink.findMany({ where: { productId: to.id }, select: { articleId: true } })).map((l) => l.articleId));
      for (const l of from.articleLinks) {
        if (keepLinks.has(l.articleId)) continue;
        await tx.articleProductLink.update({ where: { articleId_productId: { articleId: l.articleId, productId: from.id } }, data: { productId: to.id } });
      }
      await tx.product.update({ where: { id: from.id }, data: { status: "ARCHIVED", canonicalUrl: `/tools/${to.slug}`, featured: false } });
    }
  }, { timeout: 120000 });
  console.log(`merged ${actions.length} pages. Backup: ${backupFile}`);
}
await prisma.$disconnect();
