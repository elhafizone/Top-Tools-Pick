/**
 * update-bigcommerce-teachable.ts
 * Real content + pricing for BigCommerce and Teachable
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/update-bigcommerce-teachable.ts
 */
import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();

const TODAY = new Date("2026-10-04");

type Plan = { name: string; priceAmount?: number | null; currency?: string; billingPeriod?: string | null; priceLabel: string; description?: string; sortOrder: number; };

const updates = [
  {
    slug: "bigcommerce",
    plans: [
      { name: "Core", priceAmount: 29, currency: "USD", billingPeriod: "monthly (billed annually)", priceLabel: "$29/month (billed annually)", description: "Up to $30K/year in GMV. Zero payment processing fees with embedded providers, 24/7 chat & email support.", sortOrder: 0 },
      { name: "Growth", priceAmount: 79, currency: "USD", billingPeriod: "monthly (billed annually)", priceLabel: "$79/month (billed annually)", description: "Up to $100K/year in GMV. Everything in Core plus 24/7 live phone support.", sortOrder: 1 },
      { name: "Scale", priceAmount: 299, currency: "USD", billingPeriod: "monthly (billed annually)", priceLabel: "$299/month (billed annually)", description: "Up to $33,333/month in GMV (0.9% overage above cap). For fast-growing businesses with up to ~$1M/year.", sortOrder: 2 },
      { name: "Performance", priceAmount: 1499, currency: "USD", billingPeriod: "monthly (billed annually)", priceLabel: "From $1,499/month (billed annually)", description: "For $1M+ annual sales. Custom payment terms, dedicated Customer Success Manager, and 24/7 phone support.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "BigCommerce",
      shortDescription: "Hosted e-commerce platform for mid-market and enterprise retailers with no per-transaction fees, multi-storefront support, and headless commerce capabilities.",
      description: "BigCommerce is a SaaS e-commerce platform built for businesses that need more than Shopify's standard feature set without the complexity of custom enterprise solutions. Plans are based on annual GMV rather than features—so you get the full feature set at every tier and only upgrade when your sales grow past each plan's GMV cap. BigCommerce charges zero transaction fees when using its embedded payment providers (like PayPal Braintree), making it cost-effective for high-volume merchants. Key capabilities include native multi-channel selling on Amazon, eBay, Walmart, Facebook, and Instagram; multi-storefront management from a single backend; headless commerce APIs for custom frontends; B2B tools for wholesale pricing and quote management; and a wide app marketplace. BigCommerce offers a 15-day free trial on all plans.",
      websiteUrl: "https://www.bigcommerce.com",
      pricingModel: PricingModel.SUBSCRIPTION,
      hasFreePlan: false,
      hasFreeTrial: true,
      keyFeatures: [
        "Zero transaction fees when using embedded payment providers like PayPal Braintree",
        "Full feature set on every plan — no feature gating behind higher tiers",
        "Native multi-channel selling on Amazon, eBay, Walmart, Facebook, and Instagram",
        "Multi-storefront management from a single backend (Scale and above)",
        "Headless commerce APIs for custom React, Vue, or Next.js storefronts",
        "B2B features: customer groups, wholesale pricing, and quote management",
        "GMV-based plan auto-upgrades as your business grows",
      ].join("\n"),
      bestFor: "Mid-market e-commerce businesses with complex catalog needs, multi-channel ambitions, or high transaction volumes that want to avoid per-sale fees",
      notFor: "Beginners building their first store who need a simpler setup, or businesses with under $30K/year in sales who are better served by Shopify's entry-level plans",
      verdict: "BigCommerce is the strongest Shopify alternative for established retailers. No transaction fees, all features at every tier, and built-in B2B capabilities make it compelling for businesses above $30K/year. The GMV-based pricing means you always know when you'll upgrade. For stores under that threshold, Shopify's app ecosystem and lower learning curve usually win.",
      seoTitle: "BigCommerce Review: Pricing, Features & Plans",
      seoDescription: "BigCommerce review: e-commerce platform with no transaction fees and full features on every plan. Core from $29/month (billed annually), 15-day free trial.",
      lastReviewedAt: TODAY,
    },
  },
  {
    slug: "teachable",
    plans: [
      { name: "Starter", priceAmount: 29, currency: "USD", billingPeriod: "monthly (billed annually)", priceLabel: "$29/month (billed annually)", description: "Up to 5 products, 7.5% transaction fee, AI course creation, iOS/Android student apps, global payments.", sortOrder: 0 },
      { name: "Builder", priceAmount: 69, currency: "USD", billingPeriod: "monthly (billed annually)", priceLabel: "$69/month (billed annually)", description: "Up to 10 products, 0% transaction fee, affiliate program, real-time support, 1 admin user.", sortOrder: 1 },
      { name: "Growth", priceAmount: 139, currency: "USD", billingPeriod: "monthly (billed annually)", priceLabel: "$139/month (billed annually)", description: "Up to 50 products, 0% fee, course certificates, remove Teachable branding, subtitles/translations, 5 admin users.", sortOrder: 2 },
      { name: "Custom", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "Custom pricing", description: "For high-volume education businesses. Flexible product/student/admin limits, dedicated success manager, priority SLA support.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Teachable",
      shortDescription: "Online course platform for creators to build, sell, and scale courses, coaching, and digital downloads with built-in payments and tax handling.",
      description: "Teachable is a creator-focused platform for building and selling online courses, coaching programs, and digital products. It handles the technical side of running an online education business: video hosting, student management, checkout, global payments, affiliate tracking, and automatic tax compliance in 180+ countries. Creators keep 100% of revenue on paid plans (0% transaction fee from Builder upward). The course builder includes AI-assisted content creation, quiz and assignment tools, completion certificates, and an iOS/Android student app. Teachable has hosted over 120,000 course creators since 2013. The Starter plan has a 7.5% transaction fee; upgrading to Builder removes it and unlocks an affiliate program for growing through referrals.",
      websiteUrl: "https://teachable.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: false,
      hasFreeTrial: true,
      keyFeatures: [
        "Full course builder with video hosting, quizzes, assignments, and completion certificates",
        "0% transaction fees on Builder and higher plans",
        "Built-in affiliate program for growing through referrals",
        "Automatic tax handling in 180+ countries (VAT, GST, sales tax)",
        "AI-assisted course creation tools",
        "iOS and Android student apps included on all plans",
        "7-day free trial plus 30-day money-back guarantee",
      ].join("\n"),
      bestFor: "Individual creators and small teams who want a dedicated course platform with built-in payments, affiliates, and tax compliance without managing their own tech stack",
      notFor: "Creators who need a full community platform alongside courses (Kajabi or Circle are better fits), or those who only need occasional webinars rather than a structured course library",
      verdict: "Teachable earns its place as one of the most reliable course platforms for serious creators. The 0% transaction fee on paid plans, automatic tax compliance, and strong affiliate tools make it easy to run a course business without worrying about the operational details. The Starter plan's 7.5% fee is a hurdle—upgrade to Builder as soon as you have consistent sales.",
      seoTitle: "Teachable Review: Pricing, Features & Plans",
      seoDescription: "Teachable review: online course platform with 0% transaction fees from $69/month. Sell courses, coaching, and digital products with built-in payments and tax handling.",
      lastReviewedAt: TODAY,
    },
  },
];

async function main() {
  let updated = 0;
  for (const { slug, data, plans } of updates) {
    try {
      await prisma.product.update({
        where: { slug },
        data: { ...data, pricingPlans: { deleteMany: {}, create: plans } },
      });
      console.log(`  ✓ ${slug}`);
      updated++;
    } catch (e: unknown) {
      console.error(`  ✗ ${slug}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  console.log(`\nDone — updated ${updated} / ${updates.length} products.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
