/**
 * Adds the Hostinger affiliate link.
 * Run: node prisma/add-hostinger-affiliate.mjs
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const AFFILIATE_URL = 'https://www.hostg.xyz/SHF5v';

// Find Hostinger product
const product = await prisma.product.findUnique({
  where: { slug: 'hostinger' },
  select: { id: true, name: true, affiliatePrograms: { select: { id: true, status: true } } },
});

if (!product) { console.error('❌ Product "hostinger" not found'); process.exit(1); }
console.log(`✓ Found: ${product.name}`);

let programId;

if (product.affiliatePrograms.length > 0) {
  // Use existing program
  programId = product.affiliatePrograms[0].id;
  console.log(`✓ Using existing affiliate program: ${programId}`);

  // Update status to ACTIVE if not already
  await prisma.affiliateProgram.update({
    where: { id: programId },
    data: { status: 'ACTIVE' },
  });
} else {
  // Create new program
  const program = await prisma.affiliateProgram.create({
    data: {
      productId: product.id,
      name: 'Hostinger Affiliate Program',
      network: 'Direct',
      commissionType: 'percentage',
      status: 'ACTIVE',
    },
  });
  programId = program.id;
  console.log(`✓ Created affiliate program: ${programId}`);
}

// Check if this URL already exists
const existing = await prisma.affiliateLink.findFirst({
  where: { programId, url: AFFILIATE_URL },
});

if (existing) {
  console.log('↩ Link already exists, enabling it...');
  await prisma.affiliateLink.update({
    where: { id: existing.id },
    data: { enabled: true, priority: 10 },
  });
} else {
  await prisma.affiliateLink.create({
    data: {
      programId,
      label: 'Get Hostinger',
      url: AFFILIATE_URL,
      enabled: true,
      priority: 10,
    },
  });
  console.log(`✓ Created affiliate link: ${AFFILIATE_URL}`);
}

console.log('\nDone — Hostinger affiliate link is live.');
await prisma.$disconnect();
