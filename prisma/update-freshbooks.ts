/**
 * update-freshbooks.ts
 * Real content + pricing for FreshBooks
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/update-freshbooks.ts
 */
import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();

const TODAY = new Date("2026-10-04");

async function main() {
  await prisma.product.update({
    where: { slug: "freshbooks" },
    data: {
      name: "FreshBooks",
      shortDescription:
        "Cloud accounting software for freelancers and small service businesses with invoicing, time tracking, expense management, and double-entry bookkeeping.",
      description:
        "FreshBooks is an accounting and invoicing platform built specifically for service-based freelancers and small businesses. It simplifies the entire billing cycle: create branded invoices, accept online payments (credit cards, ACH, Apple Pay, Google Pay, Buy Now Pay Later), track time against projects, and capture expenses on the go. The Plus plan and above include double-entry accounting, bank reconciliation, and accountant access—making it suitable for businesses that need proper books, not just basic invoicing. FreshBooks integrates with 100+ apps including Stripe, Shopify, HubSpot, Gusto, and Zapier. All plans come with a 30-day free trial and a 30-day money-back guarantee.",
      websiteUrl: "https://www.freshbooks.com",
      pricingModel: PricingModel.SUBSCRIPTION,
      hasFreePlan: false,
      hasFreeTrial: true,
      keyFeatures: [
        "Create and send custom branded invoices with automated late payment reminders",
        "Accept online payments via credit card, ACH bank transfer, Apple Pay, Google Pay, and Buy Now Pay Later",
        "Time tracking with automatic invoicing for billable hours",
        "Expense tracking with receipt scanning and automated bank import",
        "Double-entry accounting and bank reconciliation on Plus and higher plans",
        "Project profitability tracking and budget management on Premium and above",
        "100+ integrations including Stripe, Shopify, HubSpot, Gusto, and Zapier",
      ].join("\n"),
      bestFor:
        "Freelancers, consultants, and service-based small businesses that bill clients by time or project and want invoicing + accounting in one place without QuickBooks complexity",
      notFor:
        "Product-based businesses that need inventory management, or large teams that need advanced CRM and payroll features built in (add-on payroll is available but pricey)",
      verdict:
        "FreshBooks earns its reputation as the most freelancer-friendly accounting software. The invoicing is polished, time tracking is tightly integrated, and the UI stays simple even as you add accounting features. The per-client limits on lower plans can feel arbitrary, and Premium at $70/month is steep for solopreneurs—but for freelancers and agencies billing 10–50 clients, the Plus plan hits the sweet spot.",
      seoTitle: "FreshBooks Review: Pricing, Features & Plans",
      seoDescription:
        "FreshBooks review: invoicing and accounting software for freelancers. Lite from $23/month, 30-day free trial. Time tracking, expense management, and online payments.",
      lastReviewedAt: TODAY,
      pricingPlans: {
        deleteMany: {},
        create: [
          {
            name: "Lite",
            priceAmount: 23,
            currency: "USD",
            billingPeriod: "monthly",
            priceLabel: "$23/month",
            description:
              "Up to 5 billable clients. Unlimited invoices, estimates, expense tracking, time tracking, and online payments. Tax-time reports.",
            sortOrder: 0,
          },
          {
            name: "Plus",
            priceAmount: 43,
            currency: "USD",
            billingPeriod: "monthly",
            priceLabel: "$43/month",
            description:
              "Up to 50 billable clients. Everything in Lite plus proposals, client retainers, double-entry accounting, bank reconciliation, and accountant access.",
            sortOrder: 1,
          },
          {
            name: "Premium",
            priceAmount: 70,
            currency: "USD",
            billingPeriod: "monthly",
            priceLabel: "$70/month",
            description:
              "Unlimited clients. Everything in Plus plus project profitability, accounts payable, automatic bill capture, and custom email templates.",
            sortOrder: 2,
          },
          {
            name: "Select",
            priceAmount: null,
            currency: "USD",
            billingPeriod: null,
            priceLabel: "Custom pricing",
            description:
              "Unlimited clients + 2 team member seats included. Lower CC transaction fees, capped ACH fees, remove FreshBooks branding, dedicated phone support, and Easy Switch data migration.",
            sortOrder: 3,
          },
        ],
      },
    },
  });
  console.log("Done — FreshBooks updated.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
