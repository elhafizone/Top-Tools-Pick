import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();
const TODAY = new Date("2026-10-04");
async function main() {
  await prisma.product.update({
    where: { slug: "kinsta" },
    data: {
      name: "Kinsta",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/kinsta.svg",
      shortDescription: "Premium managed WordPress hosting on Google Cloud infrastructure, with automatic scaling, built-in CDN, daily backups, and 24/7 expert support.",
      description: "Kinsta is a managed WordPress hosting provider that runs exclusively on Google Cloud Platform's premium tier network. Every site is isolated in its own Linux container with dedicated resources, meaning one site's traffic spike never affects another. Kinsta's infrastructure includes a built-in CDN powered by Cloudflare, automatic daily backups with 14-day retention, a built-in APM tool for performance monitoring, a fully managed Web Application Firewall, free SSL, and one-click staging environments. Support is available 24/7 via live chat in 8 languages, staffed by WordPress engineers — not generalists. Plans are based on the number of WordPress installs and monthly visit capacity, making it easy to right-size your hosting as your site grows. The first month on any Business plan is free.",
      websiteUrl: "https://kinsta.com",
      pricingModel: PricingModel.SUBSCRIPTION,
      hasFreePlan: false,
      hasFreeTrial: true,
      keyFeatures: [
        "Google Cloud Platform premium tier with isolated Linux containers per site",
        "Built-in Cloudflare CDN, WAF, and DDoS protection on all plans",
        "Automatic daily backups with 14-day retention and one-click restore",
        "One-click staging environments for safe testing before going live",
        "Built-in APM tool for identifying performance bottlenecks",
        "24/7 live chat support by WordPress engineers in 8 languages",
        "First month free on all Business plans",
      ].join("\n"),
      bestFor: "WordPress site owners and agencies who need enterprise-grade performance, security, and support without managing server infrastructure themselves",
      notFor: "Developers building non-WordPress applications, or budget-conscious site owners whose sites get low traffic — cheaper shared hosting handles those needs fine",
      verdict: "Kinsta is one of the best managed WordPress hosts available. The Google Cloud infrastructure is fast, the support is genuinely expert-level, and the included CDN and WAF remove the need for separate security plugins. At $35/month for a single site, it's priced for serious businesses — not hobby projects. If you're running a WooCommerce store or membership site, the performance improvement over budget hosting often pays for itself in conversion rate.",
      seoTitle: "Kinsta Review: Pricing, Features & Plans",
      seoDescription: "Kinsta review: managed WordPress hosting on Google Cloud. Launch plan from $35/month, first month free. Built-in CDN, daily backups, and 24/7 expert support.",
      lastReviewedAt: TODAY,
      pricingPlans: {
        deleteMany: {},
        create: [
          { name: "Launch", priceAmount: 35, currency: "USD", billingPeriod: "monthly", priceLabel: "$35/month (or $30/month billed annually)", description: "1 WordPress install, 75K visits/month, 15GB storage, 15GB bandwidth, 125GB CDN, 14-day backups. First month free.", sortOrder: 0 },
          { name: "Build", priceAmount: 69, currency: "USD", billingPeriod: "monthly", priceLabel: "$69/month (or $58/month billed annually)", description: "2 WordPress installs, 200K visits/month, 30GB storage, 40GB bandwidth, 250GB CDN.", sortOrder: 1 },
          { name: "Scale", priceAmount: 169, currency: "USD", billingPeriod: "monthly", priceLabel: "$169/month (or $141/month billed annually)", description: "10 WordPress installs, 650K visits/month, 50GB storage, 125GB bandwidth, 750GB CDN.", sortOrder: 2 },
          { name: "Agency", priceAmount: 340, currency: "USD", billingPeriod: "monthly", priceLabel: "From $340/month (or $284/month billed annually)", description: "Agency-exclusive benefits: hosting credits, agency directory listing, unbranded WordPress admin, account management.", sortOrder: 3 },
        ],
      },
    },
  });
  console.log("Done — Kinsta updated.");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
