import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();
const TODAY = new Date("2026-10-04");
type Plan = { name: string; priceAmount?: number | null; currency?: string; billingPeriod?: string | null; priceLabel: string; description?: string; sortOrder: number; };
const updates = [
  {
    slug: "loom",
    plans: [
      { name: "Starter", priceAmount: 0, currency: "USD", billingPeriod: null, priceLabel: "Free", description: "Up to 25 videos per person, 5-minute recording limit, 720p quality, transcriptions in 50+ languages, comments and reactions.", sortOrder: 0 },
      { name: "Business", priceAmount: 18, currency: "USD", billingPeriod: "per user/month", priceLabel: "$18/user/month", description: "Unlimited videos, unlimited recording time, 4K quality, basic editing, remove Loom branding, upload and download videos.", sortOrder: 1 },
      { name: "Business + AI", priceAmount: 24, currency: "USD", billingPeriod: "per user/month", priceLabel: "$24/user/month", description: "Everything in Business plus auto-video enhancement, filler word removal, silence removal, AI summaries, video-to-text automation, auto meeting recaps.", sortOrder: 2 },
      { name: "Enterprise", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "Custom pricing", description: "Advanced security (SSO, SCIM), Salesforce integration, 99.95% uptime SLA, EBA compliance, downloadable user insights.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Loom",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/loom.png",
      shortDescription: "Async video messaging tool for recording screen, camera, or both — share instant video updates instead of meetings, with AI transcription and editing.",
      description: "Loom is an async video communication tool that lets you record your screen, webcam, or both simultaneously, then instantly share the recording via a link. It's used by teams to replace unnecessary meetings with quick video updates: walk through a design, explain a bug, give feedback on a document, or onboard a new hire — all without scheduling. Loom videos are stored in the cloud, auto-transcribed in 50+ languages, and viewable directly in the browser with comment and emoji reaction threads. The Business + AI plan adds AI-powered editing: automatic filler word removal, silence trimming, video summaries, and meeting recap emails. Loom was acquired by Atlassian in 2023 and integrates with Slack, Notion, Jira, Confluence, GitHub, and more.",
      websiteUrl: "https://www.loom.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "Record screen, webcam, or both simultaneously — share instantly via link",
        "Auto-transcription in 50+ languages with closed captions",
        "In-video comments, emoji reactions, and @mentions for async feedback",
        "AI filler word removal, silence trimming, and auto-summaries (Business + AI)",
        "Auto meeting recap emails and notes after recorded meetings",
        "Browser, desktop app, iOS, Android, and Chrome extension",
        "Integrates with Slack, Notion, Jira, Confluence, GitHub, and 50+ tools",
      ].join("\n"),
      bestFor: "Remote and distributed teams that want to reduce meetings by sharing quick video updates for feedback, walkthroughs, and async collaboration",
      notFor: "Teams that need real-time video conferencing — Loom is async-only; use Zoom or Google Meet for live meetings",
      verdict: "Loom is the best tool for async video communication. A 2-minute Loom often replaces a 30-minute meeting for tasks like design feedback, bug reports, and onboarding. The free plan is capped at 25 videos and 5 minutes per recording — enough to try it, but most teams outgrow it quickly. At $18/user/month, Business is reasonably priced for the productivity gain.",
      seoTitle: "Loom Review: Pricing, Features & Plans",
      seoDescription: "Loom review: async video messaging for screen recording and sharing. Free plan available, Business from $18/user/month. AI transcription, editing, and meeting recaps.",
      lastReviewedAt: TODAY,
    },
  },
  {
    slug: "canva",
    plans: [
      { name: "Free", priceAmount: 0, currency: "USD", billingPeriod: null, priceLabel: "Free", description: "1.6M+ templates, 4.7M+ stock assets, unlimited designs, export as PDF/JPG/PNG, basic AI tools.", sortOrder: 0 },
      { name: "Pro", priceAmount: 14.99, currency: "USD", billingPeriod: "monthly", priceLabel: "$14.99/month (or $119.99/year)", description: "141M+ premium assets, 3.6M+ templates, background remover, Brand Kit, Magic Studio AI tools, resize designs, 1TB storage.", sortOrder: 1 },
      { name: "Business", priceAmount: 30, currency: "USD", billingPeriod: "per user/month", priceLabel: "$30/user/month (or $300/user/year)", description: "Everything in Pro plus team brand controls, unlimited Brand Kits, advanced AI allowance, approval workflows, and priority support.", sortOrder: 2 },
      { name: "Enterprise", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "Custom pricing", description: "Centralized admin controls, SSO, advanced security, dedicated customer success manager, and customized onboarding.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Canva",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/canva.svg",
      shortDescription: "AI-powered graphic design platform with 3.6M+ templates for social media, presentations, documents, and print — no design experience required.",
      description: "Canva is the world's most popular online design tool, used by over 220 million people to create social media graphics, presentations, posters, videos, PDFs, and more. The drag-and-drop editor requires no design background, and the template library covers virtually every use case. The free plan is genuinely powerful for individuals; the Pro plan ($14.99/month) unlocks a massive premium asset library, background removal, Brand Kit for consistent branding, and Magic Studio — Canva's suite of AI tools for generating images, writing copy, translating text, and expanding designs. Canva has steadily expanded into presentations (Canva Presentations), video editing, websites, and document creation, making it a broad creative suite rather than just an image tool. Canva for Education gives most premium features free to K-12 schools.",
      websiteUrl: "https://www.canva.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: true,
      keyFeatures: [
        "3.6M+ templates for social media, presentations, documents, posters, and print",
        "141M+ premium photos, videos, graphics, and audio assets on Pro",
        "Magic Studio AI: text-to-image, background remover, image expander, AI writing",
        "Brand Kit for storing logos, colors, and fonts for consistent team branding",
        "Canva Presentations: interactive slideshows with animations and presenter mode",
        "Video editor with transitions, captions, and multi-track timeline",
        "One-click resize to adapt designs across different platforms and formats",
      ].join("\n"),
      bestFor: "Non-designers, marketers, and small teams that need to produce professional-looking visual content quickly without hiring a graphic designer or learning complex tools",
      notFor: "Professional designers who need pixel-perfect control, CMYK print workflows, or advanced vector editing — Adobe Illustrator or Affinity Designer are better fits",
      verdict: "Canva is the easiest way for non-designers to produce polished graphics. The free plan handles most individual needs; Pro unlocks the premium asset library and AI tools that save real time. For teams, the Business plan's brand controls and collaboration features justify the per-seat cost. Canva won't replace professional design tools, but for 90% of everyday business design work, it's faster and good enough.",
      seoTitle: "Canva Review: Pricing, Features & Free Plan",
      seoDescription: "Canva review: AI-powered design platform with 3.6M+ templates. Free plan available, Pro from $14.99/month. Social media, presentations, and print design.",
      lastReviewedAt: TODAY,
    },
  },
  {
    slug: "quickbooks",
    plans: [
      { name: "Simple Start", priceAmount: 38, currency: "USD", billingPeriod: "monthly", priceLabel: "$38/month", description: "1 user, income & expense tracking, invoicing, automated bookkeeping, tax deduction maximizer, basic reports. 30-day free trial.", sortOrder: 0 },
      { name: "Essentials", priceAmount: 85, currency: "USD", billingPeriod: "monthly", priceLabel: "$85/month", description: "3 users, everything in Simple Start plus bill management, time tracking, bulk invoicing, and third-party data integrations.", sortOrder: 1 },
      { name: "Plus", priceAmount: 140, currency: "USD", billingPeriod: "monthly", priceLabel: "$140/month", description: "5 users, everything in Essentials plus project profitability, inventory tracking, budgeting, and class/location tracking.", sortOrder: 2 },
      { name: "Advanced", priceAmount: 340, currency: "USD", billingPeriod: "monthly", priceLabel: "$340/month", description: "25 users, everything in Plus plus custom permissions, workflow automation, premium support, advanced reporting, and Excel sync.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "QuickBooks",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/quickbooks.png",
      shortDescription: "The leading small business accounting software with invoicing, expense tracking, payroll, inventory, and tax preparation — used by 7 million businesses.",
      description: "QuickBooks Online is the most widely used accounting software for small and mid-sized businesses, with over 7 million subscribers. It covers the full accounting workflow: track income and expenses, create invoices, manage bills, run payroll (add-on), reconcile bank accounts, track inventory, manage projects, and generate the financial reports needed for tax preparation. The platform connects to 750+ banking institutions for automatic transaction import, and integrates with 750+ third-party apps including Shopify, Square, Stripe, PayPal, HubSpot, and Gusto. Intuit Intelligence (AI assistant) handles automated bookkeeping tasks, categorizes expenses, surfaces profit & loss insights, and estimates quarterly taxes. QuickBooks is auditor-friendly and generates all standard financial statements (P&L, balance sheet, cash flow) that accountants and lenders expect.",
      websiteUrl: "https://quickbooks.intuit.com",
      pricingModel: PricingModel.SUBSCRIPTION,
      hasFreePlan: false,
      hasFreeTrial: true,
      keyFeatures: [
        "Automatic bank transaction import and categorization from 750+ institutions",
        "Invoicing, bill management, and automated payment reminders",
        "Payroll processing with automatic tax calculations (paid add-on)",
        "Inventory tracking with low-stock alerts and COGS reporting (Plus+)",
        "Project profitability tracking to see cost vs. revenue per project (Plus+)",
        "AI-powered expense categorization, tax deduction finder, and quarterly estimates",
        "750+ integrations including Shopify, Stripe, PayPal, Gusto, and HubSpot",
      ].join("\n"),
      bestFor: "Small and mid-sized businesses that need full-featured double-entry accounting with payroll, inventory, and the financial reports banks and accountants require",
      notFor: "Freelancers or solopreneurs who only need basic invoicing — FreshBooks or Wave handle those simpler needs at a lower cost",
      verdict: "QuickBooks Online is the industry standard for a reason: it's the most feature-complete small business accounting platform available, and most accountants know it inside out. Simple Start at $38/month is expensive for basic needs, but the Plus plan's inventory and project tracking justify the cost for product-based or project-based businesses. Pricing is steep with no volume discounts — evaluate FreshBooks or Xero if the per-month cost is a concern.",
      seoTitle: "QuickBooks Review: Pricing, Features & Plans",
      seoDescription: "QuickBooks Online review: accounting software for small businesses with invoicing, payroll, inventory, and tax prep. Simple Start from $38/month, 30-day free trial.",
      lastReviewedAt: TODAY,
    },
  },
];
async function main() {
  let updated = 0;
  for (const { slug, data, plans } of updates) {
    try {
      await prisma.product.update({ where: { slug }, data: { ...data, pricingPlans: { deleteMany: {}, create: plans } } });
      console.log(`  ✓ ${slug}`);
      updated++;
    } catch (e: unknown) {
      console.error(`  ✗ ${slug}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  console.log(`\nDone — ${updated}/${updates.length}`);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
