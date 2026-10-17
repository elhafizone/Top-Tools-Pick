// Sets Product.logoUrl from docs/seo/icon-update-map.json (slug -> CDN url).
// Default = CHECK ONLY. --apply updates logoUrl only, after saving the old values.
// Run: node --env-file=.env.local scripts/apply-icon-map.mjs [--apply]
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "node:fs";
const apply = process.argv.includes("--apply");
const map = JSON.parse(readFileSync("docs/seo/icon-update-map.json", "utf8"));
const prisma = new PrismaClient();
const rows = await prisma.product.findMany({ where: { slug: { in: Object.keys(map) } }, select: { id: true, slug: true, logoUrl: true } });
const missing = [];
for (const r of rows) {
  const res = await fetch(map[r.slug], { method: "HEAD" });
  if (!res.ok) missing.push(r.slug);
}
console.log(`products: ${rows.length} | CDN files not reachable yet: ${missing.length}`);
missing.slice(0, 10).forEach((s) => console.log("  not reachable:", s));
if (!apply) console.log("\nCHECK ONLY - nothing written.");
else if (missing.length) console.log("\nRefusing to apply: some CDN files are not reachable yet.");
else {
  writeFileSync(`docs/seo/icon-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(rows.map((r) => ({ slug: r.slug, logoUrl: r.logoUrl })), null, 1));
  await prisma.$transaction(rows.map((r) => prisma.product.update({ where: { id: r.id }, data: { logoUrl: map[r.slug] } })), { timeout: 120000 });
  console.log(`updated ${rows.length} logos`);
}
await prisma.$disconnect();
