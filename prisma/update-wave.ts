/**
 * update-wave.ts
 * Real content + pricing for Wave (waveapps.com)
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/update-wave.ts
 */
import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();

const TODAY = new Date("2026-10-04");

async function main() {
  await prisma.product.update({
    where: { slug: "wave" },
    data: {
      name: "Wave",
      shortDescription:
        "Free accounting, invoicing, and bookkeeping software for freelancers and small businesses, with optional payroll and advisor add-ons.",
      description:
        "Wave is a cloud-based accounting platform built for freelancers, sole proprietors, and small business owners who want professional financial tools without a monthly fee. The free Starter plan covers unlimited invoicing, estimates, bills, and bookkeeping records with no cap on the number of invoices or clients. The Pro plan ($190/year) unlocks automatic bank transaction imports via Plaid, auto-categorization, unlimited receipt capture, and discounted payment processing rates. Wave was acquired by Intuit in 2024; as a result, bank transaction auto-import moved from the free plan to Pro-only. Optional add-ons include payroll (from $40/month) and Wave Advisors, which pairs you with a dedicated human bookkeeper starting at $149/month.",
      websiteUrl: "https://www.waveapps.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "Free unlimited invoicing, estimates, and bills with no client or invoice cap",
        "Double-entry bookkeeping and chart of accounts for accurate financial records",
        "Auto-import and categorize bank transactions on Pro plan via Plaid",
        "Online payment acceptance with credit cards and bank transfers (ACH)",
        "Unlimited receipt capture and expense tracking on Pro plan",
        "Payroll add-on for US and Canadian businesses from $40/month",
        "Wave Advisors: dedicated human bookkeeper starting at $149/month",
      ].join("\n"),
      bestFor:
        "Freelancers, sole proprietors, and micro-businesses that need professional invoicing and accounting without a monthly subscription",
      notFor:
        "Growing businesses that need multi-currency support, inventory management, or advanced reporting beyond basic P&L and balance sheets",
      verdict:
        "Wave's free Starter plan remains one of the most generous in accounting software—unlimited invoices and bookkeeping at no cost. The move of bank auto-import to the $190/year Pro plan stings for users who relied on that feature for free, but $190/year is still far cheaper than QuickBooks or FreshBooks. For freelancers and very small businesses, Wave is hard to beat on value.",
      seoTitle: "Wave Review: Pricing, Features & Free Plan",
      seoDescription:
        "Wave review: free accounting and invoicing software for freelancers and small businesses. Pro plan from $190/year with auto-bank import and receipt capture.",
      lastReviewedAt: TODAY,
      pricingPlans: {
        deleteMany: {},
        create: [
          {
            name: "Starter",
            priceAmount: 0,
            currency: "USD",
            billingPeriod: null,
            priceLabel: "Free forever",
            description:
              "Unlimited invoices, estimates, bills, and bookkeeping. Online payments at standard rates (2.9% + $0.60/card).",
            sortOrder: 0,
          },
          {
            name: "Pro",
            priceAmount: 190,
            currency: "USD",
            billingPeriod: "yearly",
            priceLabel: "$190/year (billed annually)",
            description:
              "Everything in Starter plus auto-import bank transactions, auto-categorization, unlimited receipt capture, late payment reminders, and discounted payment rates.",
            sortOrder: 1,
          },
          {
            name: "Wave Advisors",
            priceAmount: 149,
            currency: "USD",
            billingPeriod: "monthly",
            priceLabel: "From $149/month",
            description:
              "Includes Pro features plus a dedicated human bookkeeper, monthly financial statements, and expert accounting support.",
            sortOrder: 2,
          },
        ],
      },
    },
  });
  console.log("Done — Wave updated.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
