/**
 * Adds curated alternatives for QuickBooks and 1Password
 * so their /alternatives pages meet the 3-entry threshold for indexing.
 * Run: node prisma/fix-alternatives.mjs
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function pid(slug) {
  const p = await prisma.product.findUnique({ where: { slug }, select: { id: true, name: true } });
  if (!p) console.warn(`  ⚠ not found: ${slug}`);
  return p;
}

async function addAlternatives(productSlug, alts) {
  const product = await pid(productSlug);
  if (!product) return;
  console.log(`\n→ Adding alternatives for ${product.name}:`);

  for (const [rank, { slug, reason }] of alts.entries()) {
    const alt = await pid(slug);
    if (!alt) continue;

    await prisma.productAlternative.upsert({
      where: { productId_alternativeId: { productId: product.id, alternativeId: alt.id } },
      update: { rank: rank + 1, reason },
      create: { productId: product.id, alternativeId: alt.id, rank: rank + 1, reason },
    });
    console.log(`  #${rank + 1} ${alt.name}`);
  }
}

// ── QuickBooks alternatives ──────────────────────────────────────
await addAlternatives('quickbooks', [
  { slug: 'xero',       reason: 'Xero matches QuickBooks on core accounting but wins on unlimited users — every plan includes as many seats as you need, with no per-user charge.' },
  { slug: 'freshbooks', reason: 'FreshBooks strips out the complexity that freelancers never need. If invoicing and time tracking are your primary workflows, it is faster and cleaner than QuickBooks.' },
  { slug: 'wave',       reason: 'Wave is completely free for invoicing and accounting with no artificial limits. The trade-off is fewer integrations and slower support, but for simple books it is hard to beat at the price.' },
  { slug: 'gusto',      reason: 'Gusto handles payroll far better than QuickBooks while covering basic accounting. Teams that treat payroll as the main financial task often switch and never go back.' },
  { slug: 'stripe',     reason: 'Stripe is not an accounting tool, but its billing, invoicing, and revenue recognition features replace a large slice of what small online businesses use QuickBooks for.' },
]);

// ── 1Password alternatives ───────────────────────────────────────
await addAlternatives('1password', [
  { slug: 'bitwarden',  reason: 'Bitwarden is open-source, independently audited, and free for individuals with no meaningful restrictions. Security-conscious users who want to verify every line of code choose it over 1Password.' },
  { slug: 'nordvpn',    reason: 'NordVPN bundles NordPass — a capable password manager — with its VPN subscription. If you already pay for NordVPN, adding a password manager for free is hard to argue with.' },
  { slug: 'okta',       reason: 'Okta replaces per-user password vaults with centralised SSO and identity management. Enterprises that need lifecycle management and compliance reporting outgrow 1Password and move to Okta.' },
  { slug: 'auth0',      reason: 'Auth0 handles authentication at the application layer rather than the individual user layer. Development teams that need to ship secure login flows without building them choose Auth0 over individual password managers.' },
]);

console.log('\n✓ Done.');
await prisma.$disconnect();
