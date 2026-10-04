/**
 * update-framer-zoom.ts
 * Real content + pricing for Framer and Zoom
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/update-framer-zoom.ts
 */
import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();

const TODAY = new Date("2026-10-04");

type Plan = { name: string; priceAmount?: number | null; currency?: string; billingPeriod?: string | null; priceLabel: string; description?: string; sortOrder: number; };

const updates = [
  {
    slug: "framer",
    plans: [
      { name: "Free", priceAmount: 0, currency: "USD", billingPeriod: null, priceLabel: "Free", description: "Framer subdomain only, 500 AI credits to try, 1 GB bandwidth. Perfect for exploring or non-commercial projects.", sortOrder: 0 },
      { name: "Basic", priceAmount: 10, currency: "USD", billingPeriod: "monthly (billed annually)", priceLabel: "$10/month (billed annually)", description: "Custom domain, 1,000 AI credits/month, 2 CMS collections, 50 GB bandwidth. For personal sites and portfolios.", sortOrder: 1 },
      { name: "Pro", priceAmount: 30, currency: "USD", billingPeriod: "monthly (billed annually)", priceLabel: "$30/month (billed annually)", description: "10 CMS collections, 100 GB bandwidth, staging environment, branching with previews, A/B testing add-on. For agencies and growing teams.", sortOrder: 2 },
      { name: "Enterprise", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "Custom pricing", description: "Custom limits, dedicated support, annual billing, SSO, and advanced security. For large teams.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Framer",
      shortDescription: "Visual website builder and design tool that publishes production-ready sites directly from design, with CMS, AI agents, and no-code interactions.",
      description: "Framer is a website builder that bridges the gap between design tools and production web development. Designers build visually in Framer's canvas—adding interactions, animations, and responsive layouts—and publish directly to a global CDN without writing code. Framer includes a CMS for content-driven sites, an AI agent for generating pages from prompts, staging environments for safe previewing, and A/B testing (Pro add-on). The pricing model is per site, not per workspace—you pay one plan per site, and additional editors cost $20/month. For agencies, Framer's Expert program gives free editor access on client projects. Framer competes with Webflow as a no-code site builder but is more design-native and better for portfolio and marketing sites.",
      websiteUrl: "https://www.framer.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "Visual canvas with design-to-publish workflow — no code required",
        "AI agents for generating pages, layouts, and copy from text prompts",
        "Built-in CMS with collections, filtering, and content editor roles",
        "Staging environment and branching for safe preview before publishing (Pro)",
        "A/B testing and conversion analytics with the Convert add-on",
        "Global CDN with 300+ edge locations on Pro and Enterprise",
        "Per-site pricing: one plan per site, editors billed separately at $20/month",
      ].join("\n"),
      bestFor: "Designers and agencies building marketing sites, portfolios, and landing pages who want design-native tooling with direct publishing to production",
      notFor: "Teams that need complex web apps, e-commerce with shopping carts, or heavy backend integrations — Webflow or a custom Next.js stack handles those better",
      verdict: "Framer is the best tool for designers who want to go from concept to live site without handing off to a developer. The AI agents have made rapid prototyping even faster. At $10–$30/month per site, it's well-priced for agencies that can absorb that cost per client. The per-editor pricing and per-site model adds up for large teams managing many sites.",
      seoTitle: "Framer Review: Pricing, Features & Plans",
      seoDescription: "Framer review: visual website builder that publishes design to production. Free plan available, Basic from $10/month. AI agents, CMS, staging, and A/B testing.",
      lastReviewedAt: TODAY,
    },
  },
  {
    slug: "zoom",
    plans: [
      { name: "Basic", priceAmount: 0, currency: "USD", billingPeriod: null, priceLabel: "Free", description: "40-minute group meetings, 100 participants, limited AI features (3 meeting summaries/month), team chat, VoIP calling.", sortOrder: 0 },
      { name: "Pro", priceAmount: 16.99, currency: "USD", billingPeriod: "per user/month (billed monthly)", priceLabel: "$16.99/user/month (or $14.16 billed annually)", description: "30-hour meetings, 100 participants, unlimited AI meeting summaries, 10 GB cloud storage, Zoom Mail and Calendar.", sortOrder: 1 },
      { name: "Business", priceAmount: 21.99, currency: "USD", billingPeriod: "per user/month (billed monthly)", priceLabel: "$21.99/user/month (or $18.33 billed annually)", description: "300 participants, unlimited whiteboards, SSO, managed domains, archival and DLP APIs, custom Mail domain.", sortOrder: 2 },
      { name: "Enterprise", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "Custom pricing", description: "1,000 participants, full PBX phone system, 500-attendee webinars, Zoom Rooms, workspace reservations, unlimited cloud storage.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Zoom",
      shortDescription: "Video conferencing and collaboration platform with meetings, chat, phone, webinars, and AI-powered meeting summaries.",
      description: "Zoom is the dominant video conferencing platform for businesses, known for its reliability and ease of use. The core product, Zoom Meetings, supports HD video with up to 1,000 participants, screen sharing, breakout rooms, virtual backgrounds, and real-time transcription. The Zoom Workplace suite includes AI Companion for automated meeting summaries, Zoom Mail and Calendar, Zoom Phone (cloud PBX), Team Chat, Whiteboard, and AI productivity tools for documents. The free Basic plan allows unlimited 1:1 meetings but caps group meetings at 40 minutes—enough for personal use but a common reason to upgrade. Pro adds unlimited meeting duration and removes the cap, making it suitable for freelancers and small teams. Zoom integrates natively with Microsoft 365, Google Workspace, Salesforce, Slack, and 1,500+ apps.",
      websiteUrl: "https://zoom.us",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: true,
      keyFeatures: [
        "HD video meetings with up to 1,000 participants and 30-hour duration on paid plans",
        "AI Companion: automated meeting summaries, AI note-taking, and in-meeting questions",
        "Zoom Phone: cloud PBX with voicemail, call recording, and auto-attendant (Enterprise)",
        "Team Chat with persistent history, file sharing, and 1,500+ app integrations",
        "Zoom Whiteboard: digital canvas for brainstorming and collaboration",
        "Webinars with up to 500 attendees and registration management (Enterprise add-on)",
        "Free plan allows unlimited 1:1 meetings with no time limit",
      ].join("\n"),
      bestFor: "Teams that need reliable video meetings with AI-powered summaries and a growing suite of workplace tools built around the video infrastructure they already use",
      notFor: "Teams that primarily need advanced project management, document collaboration, or need a full Microsoft Teams or Google Workspace alternative — Zoom is meeting-first",
      verdict: "Zoom's dominance is earned: the meeting quality is consistently reliable, the AI Companion summaries save real time in back-to-back meetings, and the free plan is genuinely useful for small use cases. The 40-minute cap on free group meetings is the intended upgrade trigger. At $14–$18/user/month annually, it competes directly with Microsoft Teams and Google Meet, but wins on standalone reliability.",
      seoTitle: "Zoom Review: Pricing, Features & Plans",
      seoDescription: "Zoom review: video conferencing with AI meeting summaries. Free plan with 40-minute meetings, Pro from $14.16/user/month (billed annually).",
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
