/**
 * Seeds one editorial review per product from the stored verdict text,
 * and fixes Twilio's missing editorialScore.
 * Run once: node prisma/seed-reviews.mjs
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// --- 1. Fix Twilio editorialScore ---
await prisma.product.update({
  where: { slug: 'twilio' },
  data: { editorialScore: 82 },
});
console.log('✓ Twilio editorialScore set to 82');

// --- 2. Seed one published editorial review per product ---
const products = await prisma.product.findMany({
  where: { status: 'PUBLISHED', verdict: { not: null } },
  select: {
    id: true,
    name: true,
    verdict: true,
    editorialScore: true,
    _count: { select: { reviews: true } },
  },
});

let created = 0, skipped = 0;

for (const p of products) {
  if (p._count.reviews > 0) { skipped++; continue; }
  if (!p.verdict?.trim()) { skipped++; continue; }

  await prisma.review.create({
    data: {
      productId: p.id,
      title: `Editorial review of ${p.name}`,
      body: p.verdict.trim(),
      score: p.editorialScore ?? 80,
      author: 'TopToolsPick Editorial',
      published: true,
    },
  });
  created++;
  console.log(`✓ ${p.name}`);
}

console.log(`\nDone — created: ${created}, skipped: ${skipped}`);
await prisma.$disconnect();
