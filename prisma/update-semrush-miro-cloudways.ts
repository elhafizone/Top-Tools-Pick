import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();
const TODAY = new Date("2026-10-04");
type Plan = { name: string; priceAmount?: number | null; currency?: string; billingPeriod?: string | null; priceLabel: string; description?: string; sortOrder: number; };
const updates = [
  {
    slug: "semrush",
    plans: [
      { name: "Pro", priceAmount: 129.95, currency: "USD", billingPeriod: "monthly", priceLabel: "$129.95/month (or $108.33/month billed annually)", description: "5 projects, 500 keywords to track, 10K results per report. Full SEO toolkit: site audit, keyword research, backlink analytics, competitor analysis.", sortOrder: 0 },
      { name: "Guru", priceAmount: 249.95, currency: "USD", billingPeriod: "monthly", priceLabel: "$249.95/month (or $208.33/month billed annually)", description: "15 projects, 1,500 keywords to track, 30K results per report. Everything in Pro plus historical data, multi-location & device tracking, content marketing platform.", sortOrder: 1 },
      { name: "Business", priceAmount: 499.95, currency: "USD", billingPeriod: "monthly", priceLabel: "$499.95/month (or $416.66/month billed annually)", description: "40 projects, 5,000 keywords to track, 50K results per report. Everything in Guru plus API access, extended limits, and Google Data Studio integration.", sortOrder: 2 },
    ] as Plan[],
    data: {
      name: "Semrush",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/semrush.png",
      shortDescription: "All-in-one digital marketing platform with 55+ tools for SEO, PPC, content marketing, social media, and competitor research — used by 10 million marketers.",
      description: "Semrush is the most comprehensive digital marketing toolkit available, combining over 55 tools for SEO, paid advertising, content marketing, social media, and competitive intelligence into a single platform. The SEO suite covers keyword research, on-page optimization, technical site audits, backlink analysis, rank tracking, and local SEO. The competitive intelligence tools let you see any competitor's top organic keywords, estimated traffic, display ads, backlink sources, and PLA campaigns. The content marketing toolkit helps you find topic ideas with high engagement potential, optimize articles for specific keywords, and track brand mentions. Semrush's keyword database is one of the largest available, with over 25 billion keywords across 140+ countries. The platform integrates with Google Analytics, Google Search Console, and Google Data Studio for unified reporting. Adobe announced an acquisition of Semrush for $1.9 billion in November 2025.",
      websiteUrl: "https://www.semrush.com",
      pricingModel: PricingModel.SUBSCRIPTION,
      hasFreePlan: false,
      hasFreeTrial: true,
      keyFeatures: [
        "Keyword research with 25B+ keywords across 140+ countries and intent analysis",
        "Technical site audit that checks 140+ on-page and technical SEO issues",
        "Backlink analysis: 43 trillion backlinks tracked, toxic link detection, gap analysis",
        "Competitor traffic analytics: see any domain's top keywords, ad spend, and traffic sources",
        "Rank tracking for desktop and mobile with daily updates and SERP feature tracking",
        "Content marketing platform: topic research, SEO writing assistant, and content audit",
        "55+ tools in one platform covering SEO, PPC, social media, and brand monitoring",
      ].join("\n"),
      bestFor: "SEO professionals, digital marketing agencies, and in-house marketing teams that need a single platform for keyword research, competitor intelligence, and site auditing",
      notFor: "Beginners or small businesses with minimal SEO needs — at $130/month, it's overkill if you only need basic keyword tracking; Ubersuggest or Google Search Console are cheaper alternatives",
      verdict: "Semrush is the gold standard for SEO and competitive intelligence. No other platform matches its combination of keyword database size, backlink data, and competitor research depth. The Pro plan is expensive at $130/month but justified for anyone doing serious SEO work. The 7-day free trial gives enough time to evaluate whether the data quality is worth the cost for your specific use case.",
      seoTitle: "Semrush Review: Pricing, Features & Plans",
      seoDescription: "Semrush review: all-in-one SEO and digital marketing platform with 55+ tools. Pro plan from $129.95/month, 7-day free trial. Keyword research, competitor analysis, site audit.",
      lastReviewedAt: TODAY,
    },
  },
  {
    slug: "miro",
    plans: [
      { name: "Free", priceAmount: 0, currency: "USD", billingPeriod: null, priceLabel: "Free forever", description: "3 editable boards, unlimited team members, 2,500+ templates, basic integrations, 1GB storage.", sortOrder: 0 },
      { name: "Starter", priceAmount: 10, currency: "USD", billingPeriod: "per member/month (billed annually)", priceLabel: "$10/member/month (billed annually)", description: "Unlimited boards, custom templates, Jira & Confluence integrations, unlimited visitors, video chat, board presentation mode.", sortOrder: 1 },
      { name: "Business", priceAmount: 20, currency: "USD", billingPeriod: "per member/month (billed annually)", priceLabel: "$20/member/month (billed annually)", description: "Everything in Starter plus SAML SSO, private boards and workspaces, advanced templates, Salesforce and Azure DevOps integrations.", sortOrder: 2 },
      { name: "Enterprise", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "Custom pricing", description: "Unlimited workspaces, advanced security (domain control, data residency), custom data retention, analytics, and dedicated CSM.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Miro",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/miro.png",
      shortDescription: "Infinite canvas online whiteboard for visual collaboration — brainstorming, planning, diagramming, and workshops with 2,500+ templates and 150+ integrations.",
      description: "Miro is the leading online collaborative whiteboard platform, used by over 90 million users across 250,000+ organizations. Its infinite canvas supports sticky notes, mind maps, flowcharts, wireframes, Kanban boards, journey maps, and virtually any visual framework. Teams use Miro for remote brainstorming, sprint planning, retrospectives, product roadmapping, and async design reviews. The 2,500+ template library covers popular frameworks like user story mapping, Design Thinking, OKR planning, and business model canvas. Miro integrates with 150+ tools including Jira, Confluence, Figma, Slack, Google Workspace, Microsoft Teams, and Zoom, embedding boards directly into existing workflows. The AI features (Miro Assist) can generate mind maps, summarize boards, create sticky notes from ideas, and build diagrams from text descriptions. Miro scales from a simple whiteboard for 2 people to a company-wide visual workspace.",
      websiteUrl: "https://miro.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "Infinite canvas for sticky notes, mind maps, flowcharts, wireframes, and Kanban boards",
        "2,500+ templates for brainstorming, retrospectives, sprint planning, and product roadmaps",
        "Real-time collaboration with live cursors, video chat, and commenting",
        "Miro Assist AI: generate mind maps, diagrams, and summaries from text prompts",
        "Smart Diagramming: auto-generate diagrams from existing content or descriptions",
        "150+ integrations including Jira, Figma, Slack, Google Workspace, and Microsoft Teams",
        "Presentation mode for walking stakeholders through boards live",
      ].join("\n"),
      bestFor: "Product, design, and engineering teams that need a shared visual workspace for planning, brainstorming, and async collaboration across distributed offices",
      notFor: "Teams that only need document-based collaboration — Google Docs or Notion are lighter-weight options if you rarely use visual frameworks or whiteboard-style planning",
      verdict: "Miro has become the default visual workspace for product and design teams. The free plan with 3 editable boards is enough for individuals and small teams to try it. At $10/user/month the Starter plan is fairly priced for teams that run regular workshops or use visual planning frameworks. The main limitation is cost at scale — a 20-person team on Business costs $400/month.",
      seoTitle: "Miro Review: Pricing, Features & Plans",
      seoDescription: "Miro review: online collaborative whiteboard with infinite canvas and 2,500+ templates. Free plan available, Starter from $10/member/month. Brainstorming, planning, diagramming.",
      lastReviewedAt: TODAY,
    },
  },
  {
    slug: "cloudways",
    plans: [
      { name: "DO 1GB", priceAmount: 14, currency: "USD", billingPeriod: "monthly", priceLabel: "From $14/month (DigitalOcean 1GB)", description: "1GB RAM, 1 vCPU, 25GB SSD, 1TB bandwidth. Managed hosting on DigitalOcean with free SSL, CDN, backups, and staging.", sortOrder: 0 },
      { name: "DO 2GB", priceAmount: 28, currency: "USD", billingPeriod: "monthly", priceLabel: "$28/month (DigitalOcean 2GB)", description: "2GB RAM, 1 vCPU, 50GB SSD, 2TB bandwidth. Good for small to medium traffic WordPress or WooCommerce stores.", sortOrder: 1 },
      { name: "Vultr 4GB", priceAmount: 50, currency: "USD", billingPeriod: "monthly", priceLabel: "$50/month (Vultr High Frequency 4GB)", description: "4GB RAM, 3 vCPU, 128GB NVMe SSD, 4TB bandwidth. NVMe storage for significantly faster I/O performance.", sortOrder: 2 },
      { name: "AWS / GCP", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "From $80+/month (AWS/Google Cloud)", description: "Enterprise-grade infrastructure on AWS or Google Cloud. Higher cost but maximum reliability, global regions, and compliance options.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Cloudways",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/cloudways.png",
      shortDescription: "Managed cloud hosting platform that runs WordPress, WooCommerce, and PHP apps on DigitalOcean, Vultr, AWS, or Google Cloud — without managing servers directly.",
      description: "Cloudways is a managed cloud hosting platform that sits between a raw VPS and a fully managed host like Kinsta. You choose your cloud provider (DigitalOcean, Vultr, Linode, AWS, or Google Cloud) and server size, and Cloudways handles the server setup, security hardening, automatic OS updates, PHP configuration, and deployment stack (Nginx + Apache + Varnish + Redis + Memcached). The platform supports WordPress, WooCommerce, Laravel, Magento, Drupal, and any PHP application. Every server gets a free CDN (Cloudflare Enterprise) add-on, automated backups, free SSL, and one-click staging environments. The pay-per-hour billing model means you only pay for what you actually use — spinning up a server for a 3-hour project costs almost nothing. Cloudways uses a flat-rate management fee on top of the actual cloud provider cost, which makes it significantly cheaper than Kinsta or WP Engine at comparable performance.",
      websiteUrl: "https://www.cloudways.com",
      pricingModel: PricingModel.SUBSCRIPTION,
      hasFreePlan: false,
      hasFreeTrial: true,
      keyFeatures: [
        "Choose your cloud provider: DigitalOcean, Vultr, AWS, GCP, or Linode",
        "Managed LEMP stack (Nginx + MySQL + PHP + Redis + Varnish + Memcached) on every server",
        "Cloudflare Enterprise CDN add-on for fast global delivery and DDoS protection",
        "Automated backups with one-click restore and offsite backup to remote storage",
        "One-click staging environments for testing changes before going live",
        "Pay-per-hour billing — spin up and shut down servers any time",
        "24/7 support with managed migration service for moving existing sites",
      ].join("\n"),
      bestFor: "Developers and agencies that want the performance and flexibility of cloud hosting (DigitalOcean, AWS, GCP) without managing server configuration, security, or the underlying infrastructure",
      notFor: "Complete beginners who need a simple control panel and pre-configured WordPress — Bluehost or SiteGround are simpler; teams needing guaranteed zero-maintenance managed WordPress should look at Kinsta",
      verdict: "Cloudways hits the sweet spot between raw VPS complexity and over-priced managed hosting. At $14/month for a DigitalOcean 1GB server, you get managed infrastructure that rivals hosts charging 3-4x more. The 3-day free trial (no credit card) is enough to benchmark performance. Main tradeoff: you need some technical comfort — Cloudways still expects you to manage your application, not just the server.",
      seoTitle: "Cloudways Review: Pricing, Features & Plans",
      seoDescription: "Cloudways review: managed cloud hosting on DigitalOcean, AWS, and Google Cloud. Plans from $14/month, 3-day free trial. WordPress, WooCommerce, and PHP app hosting.",
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
