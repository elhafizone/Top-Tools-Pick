// Validates and imports an article batch as DRAFT. Default = CHECK ONLY (writes nothing).
// --apply creates articles as DRAFT in one transaction; existing slugs are skipped, never overwritten.
// Run: node --env-file=.env.local scripts/import-article-batch.mjs docs/articles/batch-1/articles.json [--apply]
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const apply = process.argv.includes("--apply");
const file = process.argv.find((a) => a.endsWith(".json"));
const articles = JSON.parse(readFileSync(file, "utf8"));
const prisma = new PrismaClient();
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

const existingArticles = new Set((await prisma.article.findMany({ select: { slug: true } })).map((a) => a.slug));
const batchSlugs = new Set(articles.map((a) => a.slug));
const productRows = await prisma.product.findMany({ select: { id: true, slug: true } });
const products = new Map(productRows.map((p) => [p.slug, p.id]));

let bad = 0;
const ready = [];
for (const a of articles) {
  const e = [];
  if (existingArticles.has(a.slug)) { console.log(`SKIP ${a.slug}: already exists`); continue; }
  if (words(a.content) < 400) e.push(`content only ${words(a.content)} words`);
  if (!a.seoTitle || a.seoTitle.length > 60) e.push(`seoTitle length ${a.seoTitle?.length}`);
  if (!a.seoDescription || a.seoDescription.length < 120 || a.seoDescription.length > 155) e.push(`seoDescription length ${a.seoDescription?.length}`);
  if (!a.excerpt || a.excerpt.length > 200) e.push("excerpt missing or > 200 chars");
  if (!/^## /m.test(a.content) || !/\*\*Quick answer:\*\*/.test(a.content)) e.push("needs a Quick answer and H2 sections");
  if (!/## Sources/.test(a.content) || !(a.sources?.length >= 1)) e.push("needs a Sources section and sources[]");
  for (const t of a.tools) if (!products.has(t.slug)) e.push(`unknown product: ${t.slug}`);
  for (const m of a.content.matchAll(/\]\((\/[^)\s]+)\)/g)) {
    const [, kind, slug] = m[1].match(/^\/(tools|articles)\/([^/#?]+)/) ?? [];
    if (kind === "tools" && !products.has(slug)) e.push(`broken link ${m[1]}`);
    if (kind === "articles" && !existingArticles.has(slug) && !batchSlugs.has(slug)) e.push(`broken link ${m[1]}`);
  }
  if (e.length) { bad++; console.log(`FAIL ${a.slug}\n  - ${e.join("\n  - ")}`); }
  else { ready.push(a); console.log(`OK   ${a.slug} (${words(a.content)} words, ${a.tools.length} tool links)`); }
}
if (bad) console.log(`\n${bad} article(s) failed validation.`);
if (!apply) console.log("\nCHECK ONLY - nothing written. Re-run with --apply to create the OK articles as DRAFT.");
else if (!bad) {
  await prisma.$transaction(async (tx) => {
    for (const a of ready) {
      await tx.article.create({
        data: {
          title: a.title, slug: a.slug, excerpt: a.excerpt, content: a.content, status: "DRAFT",
          author: "TopToolsPick Editorial", topic: a.topic, seoTitle: a.seoTitle, seoDescription: a.seoDescription,
          productLinks: { create: a.tools.map((t) => ({ productId: products.get(t.slug), rank: t.rank, note: t.note })) },
        },
      });
      console.log(`created DRAFT ${a.slug}`);
    }
  }, { timeout: 120000 });
}
await prisma.$disconnect();
