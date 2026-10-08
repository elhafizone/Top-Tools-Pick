import { PrismaClient } from '../node_modules/@prisma/client/index.js';

const prisma = new PrismaClient();

const programs = [
  {
    productId: 'cmu0vz49d002thl8w7pg8yqqe',
    name: 'NordVPN',
    network: 'impact',
    commissionType: 'percentage',
    commissionValue: null,
    recurring: false,
    status: 'PENDING_VERIFICATION',
  },
  {
    productId: 'cmuw4wg6g0013hljsmwqr9zp8',
    name: 'Grammarly',
    network: 'impact',
    commissionType: 'percentage',
    commissionValue: null,
    recurring: false,
    status: 'PENDING_VERIFICATION',
  },
  {
    productId: 'cmuv3d44y0003hlxo217yboee',
    name: 'HubSpot',
    network: 'impact',
    commissionType: 'percentage',
    commissionValue: 30,
    recurring: true,
    status: 'PENDING_VERIFICATION',
  },
  {
    productId: 'cmuvi8i67001hhlbkohax8ryh',
    name: 'Hootsuite',
    network: 'impact',
    commissionType: 'percentage',
    commissionValue: 20,
    recurring: false,
    status: 'PENDING_VERIFICATION',
  },
  {
    productId: 'cmu0vyq4p001nhl8wc593rje8',
    name: 'Coursera',
    network: 'impact',
    commissionType: 'percentage',
    commissionValue: 10,
    recurring: false,
    status: 'PENDING_VERIFICATION',
  },
  {
    productId: 'cmu0vylqw000ohl8w8qynxb3u',
    name: 'Cloudways',
    network: 'impact',
    commissionType: 'percentage',
    commissionValue: null,
    recurring: false,
    status: 'PENDING_VERIFICATION',
  },
  {
    productId: 'cmuv3s7rv000jhlq4g6ictoxm',
    name: 'Wix',
    network: 'impact',
    commissionType: 'flat',
    commissionValue: 50,
    recurring: false,
    status: 'PENDING_VERIFICATION',
  },
  {
    productId: 'cmuw52esq0001hli05rkunyhc',
    name: 'Moz Pro',
    network: 'impact',
    commissionType: 'percentage',
    commissionValue: null,
    recurring: true,
    status: 'PENDING_VERIFICATION',
  },
];

async function main() {
  for (const p of programs) {
    const existing = await prisma.affiliateProgram.findFirst({
      where: { productId: p.productId, network: 'impact' },
    });
    if (existing) {
      console.log(`SKIP (exists): ${p.name}`);
      continue;
    }
    const created = await prisma.affiliateProgram.create({
      data: {
        productId: p.productId,
        name: p.name,
        network: p.network,
        commissionType: p.commissionType,
        commissionValue: p.commissionValue,
        recurring: p.recurring,
        status: p.status,
      },
    });
    console.log(`CREATED: ${p.name} -> ${created.id}`);
  }
}

main()
  .catch((e) => { console.error(e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
