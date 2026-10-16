// Applies docs/seo/title-fix-dry-run.csv to Product.seoTitle.
// Default is a CHECK ONLY run (reads, writes nothing). Pass --apply to write.
// Safety: only rows marked auto-ok; a row is skipped if the current seoTitle no longer
// equals old_title (someone edited it since the CSV was made); one transaction, so a
// failure rolls everything back. Touches seoTitle only. Rollback: swap old/new columns.
// Run: node --env-file=.env.local scripts/seo-apply-titles.mjs [--apply]
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const apply = process.argv.includes("--apply");
const file = process.argv.find((a) => a.endsWith(".csv")) ?? "docs/seo/title-fix-dry-run.csv";

function parseCsv(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const [header, ...data] = parseCsv(readFileSync(file, "utf8").replace(/^\uFEFF/, "")).filter((r) => r.length > 1);
const idx = Object.fromEntries(header.map((h, i) => [h, i]));
const wanted = data.filter((r) => r[idx.status] === "auto-ok");

const prisma = new PrismaClient();
const current = await prisma.product.findMany({
  where: { slug: { in: wanted.map((r) => r[idx.slug]) } },
  select: { id: true, slug: true, seoTitle: true },
});
const bySlug = new Map(current.map((p) => [p.slug, p]));

const toWrite = [], skipped = [];
for (const r of wanted) {
  const p = bySlug.get(r[idx.slug]);
  if (!p) skipped.push([r[idx.slug], "not found"]);
  else if ((p.seoTitle ?? "").trim() !== r[idx.old_title]) skipped.push([p.slug, "changed since CSV"]);
  else if (!r[idx.new_title].trim() || r[idx.new_title].length > 120) skipped.push([p.slug, "invalid new title"]);
  else toWrite.push({ id: p.id, slug: p.slug, title: r[idx.new_title] });
}

console.log(`CSV auto-ok rows: ${wanted.length} | will update: ${toWrite.length} | skipped: ${skipped.length}`);
skipped.slice(0, 20).forEach(([s, why]) => console.log(`  skip ${s}: ${why}`));

if (!apply) {
  console.log("\nCHECK ONLY - nothing written. Re-run with --apply to write.");
} else {
  await prisma.$transaction(
    toWrite.map((w) => prisma.product.update({ where: { id: w.id }, data: { seoTitle: w.title } })),
    { timeout: 120000 },
  );
  console.log(`Updated ${toWrite.length} seoTitle values.`);
}
await prisma.$disconnect();
