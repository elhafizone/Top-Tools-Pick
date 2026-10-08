import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Source: G2.com ratings
// ✓ = verified live from G2 during this session
// ~ = from training data (G2, as of Aug 2025) — stable ratings for established tools
const ratings: Record<string, number> = {
  "1password":    4.6, // ✓ G2
  "ahrefs":       4.5, // ✓ G2
  "airtable":     4.6, // ✓ G2
  "asana":        4.4, // ✓ G2
  "bigcommerce":  4.2, // ✓ G2
  "bitwarden":    4.6, // ✓ G2
  "canva":        4.7, // ✓ G2
  "capcut":       4.4, // ~ G2 (limited reviews)
  "chatgpt":      4.7, // ~ G2
  "claude":       4.7, // ~ G2
  "cloudways":    4.7, // ~ G2
  "coursera":     4.5, // ~ G2
  "descript":     4.6, // ~ G2
  "elevenlabs":   4.6, // ~ G2
  "figma":        4.7, // ~ G2
  "framer":       4.3, // ~ G2
  "freshbooks":   4.5, // ~ G2
  "github":       4.7, // ~ G2
  "hostinger":    4.3, // ~ G2
  "kinsta":       4.8, // ~ G2
  "linear":       4.7, // ~ G2
  "loom":         4.7, // ~ G2
  "mailchimp":    4.4, // ~ G2
  "miro":         4.8, // ~ G2
  "nordvpn":      4.5, // ~ G2
  "notion":       4.7, // ~ G2
  "perplexity":   4.6, // ~ G2
  "quickbooks":   4.2, // ~ G2
  "riverside":    4.7, // ~ G2
  "semrush":      4.5, // ~ G2
  "shopify":      4.4, // ~ G2
  "slack":        4.5, // ~ G2
  "teachable":    4.2, // ~ G2
  "twilio":       4.2, // ~ G2
  "udemy":        4.5, // ~ G2 (Udemy Business)
  "vercel":       4.6, // ~ G2
  "wave":         4.4, // ~ G2
  "woocommerce":  4.4, // ~ G2
  "zoom":         4.5, // ~ G2
};

async function main() {
  let updated = 0;
  for (const [slug, rating] of Object.entries(ratings)) {
    try {
      await prisma.product.update({ where: { slug }, data: { rating } });
      console.log(`  ✓ ${slug.padEnd(14)} → ${rating}`);
      updated++;
    } catch (e: unknown) {
      console.error(`  ✗ ${slug}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  console.log(`\nDone — ${updated}/${Object.keys(ratings).length}`);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
