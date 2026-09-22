/**
 * fix-seo-titles.ts — remove "2025" and competitor comparisons from all seoTitle / seoDescription fields
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/fix-seo-titles.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const UPDATES: Array<{ slug: string; seoTitle: string; seoDescription: string }> = [
  {
    slug: "claude",
    seoTitle: "Claude AI Review — Pricing, Context Window and Who It's For | TopToolsPick",
    seoDescription:
      "Claude review: free, Pro and Max plans explained, 1M-token context window, code and reasoning strengths, and who should use it for their workflow.",
  },
  {
    slug: "chatgpt",
    seoTitle: "ChatGPT Review — Features, Pricing and Who It's For | TopToolsPick",
    seoDescription:
      "ChatGPT review: free vs Plus vs Team plans, GPT-4o capabilities, plugin ecosystem, code interpreter, and who gets the most value out of it.",
  },
  {
    slug: "notion",
    seoTitle: "Notion Review — Pricing, Features and Who Should Use It | TopToolsPick",
    seoDescription:
      "Notion review: free vs Plus vs Business plans, block-based editing, databases, Notion AI, and when it is the right workspace for your team.",
  },
];

async function main() {
  let updated = 0;
  for (const { slug, seoTitle, seoDescription } of UPDATES) {
    const product = await prisma.product.findUnique({ where: { slug }, select: { id: true, name: true, seoTitle: true } });
    if (!product) {
      console.log(`  SKIP  "${slug}" — not found`);
      continue;
    }
    await prisma.product.update({
      where: { slug },
      data: { seoTitle, seoDescription },
    });
    console.log(`  OK    ${product.name}`);
    console.log(`         title: ${seoTitle}`);
    updated++;
  }
  console.log(`\nDone — updated ${updated} / ${UPDATES.length} products.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
