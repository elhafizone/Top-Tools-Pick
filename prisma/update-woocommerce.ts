/**
 * update-woocommerce.ts
 * Real content + pricing for WooCommerce
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/update-woocommerce.ts
 */
import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();

const TODAY = new Date("2026-10-04");

async function main() {
  await prisma.product.update({
    where: { slug: "woocommerce" },
    data: {
      name: "WooCommerce",
      shortDescription:
        "Free open-source e-commerce plugin for WordPress that turns any site into a full-featured online store, with a large marketplace of free and paid extensions.",
      description:
        "WooCommerce is the most widely used e-commerce platform in the world, powering over 30% of online stores. It's a free, open-source WordPress plugin that adds a complete store to any WordPress site: product listings, cart, checkout, payment gateways, shipping, and order management. Because it runs on WordPress, you own your data and can customize anything. The core plugin is free and handles most store needs, but the real cost comes from extensions (individual products from $0–$299/year), a WordPress hosting plan, and a payment gateway (Stripe, PayPal, or the built-in WooPayments). WooPayments, the native solution by WooCommerce, charges no monthly fee but takes a standard card processing fee (2.9% + $0.30 for US transactions). Total monthly costs depend heavily on your hosting, chosen extensions, and transaction volume.",
      websiteUrl: "https://woocommerce.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "Free core plugin with unlimited products, orders, and customers",
        "WooPayments: built-in Stripe-powered payment processing with no monthly fee",
        "Extensive extension marketplace: subscriptions, memberships, bookings, bundles, and more",
        "Full ownership of your store data — hosted on your own WordPress site",
        "REST API and webhook support for custom integrations",
        "Global shipping rate management with carrier integrations (UPS, FedEx, USPS)",
        "Official mobile app for managing orders and inventory on the go",
      ].join("\n"),
      bestFor:
        "Developers and store owners who already use WordPress and want full control over their store code and data, or who need the specific combination of WordPress content and e-commerce in one installation",
      notFor:
        "Non-technical users who want a managed SaaS storefront without WordPress setup and maintenance, or merchants who prefer an all-in-one hosted platform like Shopify",
      verdict:
        "WooCommerce is the best e-commerce choice if you're already in the WordPress ecosystem or need maximum flexibility and data ownership. The free core plugin is genuinely powerful. But the total cost of ownership—including hosting, extensions, and ongoing WordPress maintenance—often equals or exceeds Shopify's all-in fees. If you want a store without WordPress complexity, Shopify or BigCommerce are easier to run.",
      seoTitle: "WooCommerce Review: Pricing, Features & Extensions",
      seoDescription:
        "WooCommerce review: free open-source e-commerce plugin for WordPress. Core plugin is free; extensions from $0. Owns your data, full flexibility, WooPayments included.",
      lastReviewedAt: TODAY,
      pricingPlans: {
        deleteMany: {},
        create: [
          {
            name: "Core Plugin",
            priceAmount: 0,
            currency: "USD",
            billingPeriod: null,
            priceLabel: "Free (open source)",
            description:
              "Full e-commerce functionality: unlimited products, cart, checkout, order management, shipping, and WooPayments (2.9% + $0.30/transaction). Requires WordPress hosting.",
            sortOrder: 0,
          },
          {
            name: "Extensions",
            priceAmount: null,
            currency: "USD",
            billingPeriod: null,
            priceLabel: "Varies ($0–$299/year per extension)",
            description:
              "Optional extensions from WooCommerce.com and third parties: subscriptions, memberships, bookings, product bundles, shipping calculators, and 800+ more. Many are free.",
            sortOrder: 1,
          },
        ],
      },
    },
  });
  console.log("Done — WooCommerce updated.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
