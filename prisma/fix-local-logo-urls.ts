/**
 * fix-local-logo-urls.ts
 * Replace /tool-logos/* local paths (which 404 on Hostinger) with GitHub raw URLs.
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/fix-local-logo-urls.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const REPO = "https://raw.githubusercontent.com/elhafizone/Top-Tools-Pick/main/public/tool-logos";

// Slugs that have local logo files committed to the repo.
const LOCAL_LOGOS: Record<string, string> = {
  "1password":  `${REPO}/1password.avif`,
  "ahrefs":     `${REPO}/ahrefs.avif`,
  "bitwarden":  `${REPO}/bitwarden.svg`,
  "chatgpt":    `${REPO}/chatgpt.svg`,
  "claude":     `${REPO}/claude.svg`,
  "elevenlabs": `${REPO}/elevenlabs.avif`,
  "figma":      `${REPO}/figma.svg`,
  "github":     `${REPO}/github.svg`,
  "linear":     `${REPO}/linear.avif`,
  "notion":     `${REPO}/notion.svg`,
  "perplexity": `${REPO}/perplexity.svg`,
  "shopify":    `${REPO}/shopify.svg`,
  "vercel":     `${REPO}/vercel.avif`,
};

async function main() {
  let updated = 0;
  for (const [slug, logoUrl] of Object.entries(LOCAL_LOGOS)) {
    await prisma.product.update({ where: { slug }, data: { logoUrl } });
    console.log(`  ✓ ${slug.padEnd(12)} → ${logoUrl}`);
    updated++;
  }
  console.log(`\nDone — updated ${updated} logo URLs.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
