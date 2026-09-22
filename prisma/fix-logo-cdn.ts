/**
 * fix-logo-cdn.ts
 * Switch 13 local logo paths to jsDelivr CDN (serves GitHub repo files via CDN).
 * jsDelivr caches permanently, serves correct content-type, no rate limits.
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/fix-logo-cdn.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const CDN = "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos";

const LOGOS: Record<string, string> = {
  "1password":  `${CDN}/1password.avif`,
  "ahrefs":     `${CDN}/ahrefs.avif`,
  "bitwarden":  `${CDN}/bitwarden.svg`,
  "chatgpt":    `${CDN}/chatgpt.svg`,
  "claude":     `${CDN}/claude.svg`,
  "elevenlabs": `${CDN}/elevenlabs.avif`,
  "figma":      `${CDN}/figma.svg`,
  "github":     `${CDN}/github.svg`,
  "linear":     `${CDN}/linear.avif`,
  "notion":     `${CDN}/notion.svg`,
  "perplexity": `${CDN}/perplexity.svg`,
  "shopify":    `${CDN}/shopify.svg`,
  "vercel":     `${CDN}/vercel.avif`,
};

async function main() {
  for (const [slug, logoUrl] of Object.entries(LOGOS)) {
    await prisma.product.update({ where: { slug }, data: { logoUrl } });
    console.log(`  ✓ ${slug}`);
  }
  console.log(`\nDone — updated ${Object.keys(LOGOS).length} logos to jsDelivr CDN.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
