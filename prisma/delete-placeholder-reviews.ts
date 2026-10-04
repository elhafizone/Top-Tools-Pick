/**
 * delete-placeholder-reviews.ts
 * Removes all placeholder review records so the "Editorial review" section
 * disappears from tool pages until real editorial content is written.
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/delete-placeholder-reviews.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.review.deleteMany({});
  console.log(`Deleted ${result.count} placeholder reviews.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
