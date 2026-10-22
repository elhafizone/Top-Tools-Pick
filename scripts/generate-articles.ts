// Generates SEO articles automatically: picks an uncovered product or curated
// alternative pair, writes an article via Claude, validates it against the same
// contract as scripts/import-article-batch.mjs, and creates it as DRAFT (or
// PUBLISHED with --publish / ARTICLE_AUTO_PUBLISH=true). Never overwrites a slug.
//
// Run: npx tsx --env-file=.env.local scripts/generate-articles.ts [--count=N] [--publish]
import { generateOneArticle } from "../lib/articles/generate";
import { prisma } from "../lib/db/prisma";

const countArg = process.argv.find((arg) => arg.startsWith("--count="));
const count = countArg ? Number(countArg.split("=")[1]) : 1;
const publish = process.argv.includes("--publish") ? true : undefined;

async function main() {
  for (let i = 0; i < count; i++) {
    const result = await generateOneArticle({ publish });
    if (result.status === "created") {
      console.log(`created ${result.published ? "PUBLISHED" : "DRAFT"} ${result.slug}`);
    } else {
      console.log(`skipped:\n  - ${result.errors.join("\n  - ")}`);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
