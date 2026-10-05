/**
 * Adds featured images to comparison articles using curated Unsplash photos.
 * Run: node prisma/add-article-images.mjs
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Curated Unsplash photo IDs relevant to each comparison topic
const images = [
  {
    slug: 'notion-vs-obsidian',
    // Open notebook on a desk — note-taking / knowledge management
    featuredImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'xero-vs-quickbooks',
    // Calculator and financial documents — accounting
    featuredImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'slack-vs-microsoft-teams',
    // Team working together at laptops — collaboration / communication
    featuredImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'hubspot-vs-salesforce',
    // Business charts and CRM dashboard on screen — sales / CRM
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop',
  },
  {
    slug: 'shopify-vs-woocommerce',
    // Shopping bags and e-commerce parcels — online store
    featuredImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80&auto=format&fit=crop',
  },
];

let updated = 0;
for (const { slug, featuredImage } of images) {
  const result = await prisma.article.updateMany({
    where: { slug },
    data: { featuredImage },
  });
  if (result.count > 0) { updated++; console.log(`✓ ${slug}`); }
  else console.warn(`⚠ not found: ${slug}`);
}

console.log(`\nDone — updated: ${updated}`);
await prisma.$disconnect();
