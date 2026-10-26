// Judges up to --count products (default 15) against same-category peers and creates
// a ProductAlternative only when Gemini judges one a genuine substitute - never a
// same-category guess. Products with no genuine match are marked (via AuditLog) so
// they are not re-asked about every run. Paced at 15/day by default to share Gemini's
// free-tier daily quota with article generation.
// Run: npx tsx --env-file=.env.local scripts/generate-alternatives.ts [--count=15]
import { judgeNextAlternatives } from "../lib/alternatives/generate";
import { prisma } from "../lib/db/prisma";

const countArg = process.argv.find((arg) => arg.startsWith("--count="));
const count = countArg ? Number(countArg.split("=")[1]) : 15;

async function main() {
  const results = await judgeNextAlternatives(count);
  for (const result of results) {
    if (result.status === "created") console.log(`MATCH  ${result.productSlug} -> ${result.alternativeSlug}: "${result.reason}"`);
    else if (result.status === "no-match") console.log(`SKIP   ${result.productSlug}: ${result.reason}`);
    else if (result.status === "no-candidates") console.log(`SKIP   ${result.productSlug}: no other published product in its category`);
    else if (result.status === "quota-exhausted") console.log("Gemini's free daily quota is used up for today - re-run tomorrow.");
    else console.log("No eligible products left - every published product has been judged or already has an alternative.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
