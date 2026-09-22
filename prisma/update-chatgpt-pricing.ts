/**
 * update-chatgpt-pricing.ts
 * Replaces placeholder pricing plan with real ChatGPT plans (USD, Sept 2025).
 * Run: npx tsx prisma/update-chatgpt-pricing.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SLUG = "chatgpt";

const PLANS = [
  {
    name: "Free",
    priceAmount: 0,
    currency: "USD",
    billingPeriod: "monthly",
    priceLabel: "Free",
    description: "Unlimited text chats with GPT-4o mini; limited access to GPT-4o, DALL·E and web browsing",
    sortOrder: 0,
  },
  {
    name: "Plus",
    priceAmount: 20,
    currency: "USD",
    billingPeriod: "monthly",
    priceLabel: "$20 / month",
    description: "Full GPT-4o access, DALL·E 3 image generation, real-time web browsing, GPT Store, Projects, 5× more messages than Free",
    sortOrder: 1,
  },
  {
    name: "Pro",
    priceAmount: 200,
    currency: "USD",
    billingPeriod: "monthly",
    priceLabel: "$200 / month",
    description: "Maximum throughput, o1 Pro reasoning model, unlimited image generation, early access to the latest models",
    sortOrder: 2,
  },
  {
    name: "Team",
    priceAmount: 25,
    currency: "USD",
    billingPeriod: "per user/month (billed annually)",
    priceLabel: "$25 / user / month",
    description: "Everything in Plus plus admin controls, shared workspace, higher usage caps; $30/user if billed monthly",
    sortOrder: 3,
  },
  {
    name: "Enterprise",
    priceAmount: null,
    currency: "USD",
    billingPeriod: null,
    priceLabel: "Contact for pricing",
    description: "Custom deployment, SAML SSO, SOC 2 compliance, dedicated onboarding and enterprise security controls",
    sortOrder: 4,
  },
];

async function main() {
  const product = await prisma.product.findUnique({ where: { slug: SLUG }, select: { id: true } });
  if (!product) throw new Error(`Product "${SLUG}" not found`);

  // Remove existing plans
  await prisma.pricingPlan.deleteMany({ where: { productId: product.id } });

  // Insert real plans
  for (const plan of PLANS) {
    await prisma.pricingPlan.create({
      data: { ...plan, productId: product.id },
    });
  }

  console.log(`Done. ${PLANS.length} pricing plans created for "${SLUG}".`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
