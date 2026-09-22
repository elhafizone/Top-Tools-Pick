/**
 * fix-logos-and-dates.ts
 * - Replace dead clearbit logo URLs with reliable sources (local files or Google favicons)
 * - Set lastReviewedAt = today for tools with real reviewed content
 * - Set lastReviewedAt = null for tools not yet reviewed (removes the fake Sep 1, 2025 date)
 *
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/fix-logos-and-dates.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TODAY = new Date("2026-09-22");

// Tools reviewed with real content in this session or prior sessions.
// lastReviewedAt = TODAY
const REVIEWED_SLUGS = new Set([
  "elevenlabs",
  "perplexity",
  "figma",
  "github",
  "shopify",
  "vercel",
  "claude",
  "chatgpt",
  "notion",
]);

// Logo map: slug → logoUrl
// Local paths for tools with downloaded logos; Google favicon CDN for the rest.
// Google favicons (sz=128) are served from Google's own CDN and are highly reliable.
const LOGO_URLS: Record<string, string> = {
  // Local SVG/AVIF files
  "1password":   "/tool-logos/1password.avif",
  "ahrefs":      "/tool-logos/ahrefs.avif",
  "bitwarden":   "/tool-logos/bitwarden.svg",
  "chatgpt":     "/tool-logos/chatgpt.svg",
  "claude":      "/tool-logos/claude.svg",
  "elevenlabs":  "/tool-logos/elevenlabs.avif",
  "figma":       "/tool-logos/figma.svg",
  "github":      "/tool-logos/github.svg",
  "linear":      "/tool-logos/linear.avif",
  "notion":      "/tool-logos/notion.svg",
  "perplexity":  "/tool-logos/perplexity.svg",
  "shopify":     "/tool-logos/shopify.svg",
  "vercel":      "/tool-logos/vercel.avif",

  // Google favicon CDN for tools without local logos
  "airtable":    "https://www.google.com/s2/favicons?domain=airtable.com&sz=128",
  "asana":       "https://www.google.com/s2/favicons?domain=asana.com&sz=128",
  "bigcommerce": "https://www.google.com/s2/favicons?domain=bigcommerce.com&sz=128",
  "canva":       "https://www.google.com/s2/favicons?domain=canva.com&sz=128",
  "capcut":      "https://www.google.com/s2/favicons?domain=capcut.com&sz=128",
  "cloudways":   "https://www.google.com/s2/favicons?domain=cloudways.com&sz=128",
  "coursera":    "https://www.google.com/s2/favicons?domain=coursera.org&sz=128",
  "descript":    "https://www.google.com/s2/favicons?domain=descript.com&sz=128",
  "framer":      "https://www.google.com/s2/favicons?domain=framer.com&sz=128",
  "freshbooks":  "https://www.google.com/s2/favicons?domain=freshbooks.com&sz=128",
  "hostinger":   "https://www.google.com/s2/favicons?domain=hostinger.com&sz=128",
  "kinsta":      "https://www.google.com/s2/favicons?domain=kinsta.com&sz=128",
  "loom":        "https://www.google.com/s2/favicons?domain=loom.com&sz=128",
  "mailchimp":   "https://www.google.com/s2/favicons?domain=mailchimp.com&sz=128",
  "miro":        "https://www.google.com/s2/favicons?domain=miro.com&sz=128",
  "nordvpn":     "https://www.google.com/s2/favicons?domain=nordvpn.com&sz=128",
  "quickbooks":  "https://www.google.com/s2/favicons?domain=quickbooks.intuit.com&sz=128",
  "riverside":   "https://www.google.com/s2/favicons?domain=riverside.fm&sz=128",
  "semrush":     "https://www.google.com/s2/favicons?domain=semrush.com&sz=128",
  "slack":       "https://www.google.com/s2/favicons?domain=slack.com&sz=128",
  "teachable":   "https://www.google.com/s2/favicons?domain=teachable.com&sz=128",
  "udemy":       "https://www.google.com/s2/favicons?domain=udemy.com&sz=128",
  "wave":        "https://www.google.com/s2/favicons?domain=waveapps.com&sz=128",
  "woocommerce": "https://www.google.com/s2/favicons?domain=woocommerce.com&sz=128",
  "zoom":        "https://www.google.com/s2/favicons?domain=zoom.us&sz=128",
};

async function main() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, name: true },
  });

  let updated = 0;
  for (const { slug, name } of products) {
    const logoUrl = LOGO_URLS[slug];
    const lastReviewedAt = REVIEWED_SLUGS.has(slug) ? TODAY : null;

    await prisma.product.update({
      where: { slug },
      data: {
        ...(logoUrl ? { logoUrl } : {}),
        lastReviewedAt,
      },
    });

    const logoNote = logoUrl?.startsWith("/") ? "local" : logoUrl ? "google" : "unchanged";
    const dateNote = lastReviewedAt ? "reviewed today" : "cleared";
    console.log(`  ${name.padEnd(22)} logo:${logoNote}  date:${dateNote}`);
    updated++;
  }

  console.log(`\nDone — updated ${updated} products.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
