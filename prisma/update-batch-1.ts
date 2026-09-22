/**
 * update-batch-1.ts — bulk update ElevenLabs, Perplexity, Figma, GitHub, Shopify, Vercel
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/update-batch-1.ts
 */
import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();

type Plan = {
  name: string;
  priceAmount: number | null;
  currency: string | null;
  billingPeriod: string | null;
  priceLabel: string;
  description?: string;
};

type ProductData = {
  slug: string;
  shortDescription: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  pricingModel: PricingModel;
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  keyFeatures: string;
  notFor: string;
  bestFor: string;
  verdict: string;
  seoTitle: string;
  seoDescription: string;
  plans: Plan[];
};

const TOOLS: ProductData[] = [
  {
    slug: "elevenlabs",
    websiteUrl: "https://elevenlabs.io",
    logoUrl: "/tool-logos/elevenlabs.avif",
    pricingModel: "FREEMIUM",
    hasFreePlan: true,
    hasFreeTrial: false,
    shortDescription:
      "ElevenLabs is an AI voice generation platform that converts text into natural, expressive speech and clones voices for use in podcasts, voiceovers, audiobooks, and conversational AI applications.",
    description:
      "ElevenLabs pioneered high-fidelity AI voice synthesis and has become the go-to platform for professional audio content. Its text-to-speech engine produces speech that is difficult to distinguish from a real human voice, supporting over 32 languages and hundreds of voices including clones of custom voices.\n\nThe platform serves three main audiences: content creators who need affordable, high-quality voiceovers; developers building voice-enabled products through the API; and enterprise teams producing multilingual audio at scale. Its voice cloning feature lets you upload a short audio sample and generate a consistent voice for all future content.\n\nKey use cases include narrating YouTube videos and podcasts, dubbing video content into other languages, generating character voices for games, building phone-based AI agents, and producing audiobooks. The credit-based pricing model means costs scale with usage, which works well for creators but can add up quickly for high-volume workflows.",
    keyFeatures:
      "Text-to-speech in 32+ languages with natural prosody\nVoice cloning from a short audio sample (as little as 1 minute)\nProjects editor for narrating long-form documents\nDubbing tool that translates and re-voices video content\nConversational AI Voice Agent builder\nSoundFX and audio isolation tools\nEnterprise API with low-latency streaming",
    notFor:
      "Teams that need full audio production software (editing, mixing, mastering)\nUsers who need completely offline speech synthesis\nStartups that require a free tier above 10,000 characters per month\nOrganizations with strict data-sovereignty requirements — audio is processed on ElevenLabs servers",
    bestFor:
      "YouTubers and podcasters who need fast, professional voiceovers\nDevelopers building voice-enabled apps or IVR systems\nContent teams dubbing video into multiple languages\nAudiobook publishers producing titles at scale\nBrands that want a consistent branded voice across all content",
    verdict:
      "ElevenLabs produces the most natural-sounding AI voices currently available and has the widest language coverage of any cloud TTS service. The free tier is usable but limited; serious use starts at the Starter plan. Voice cloning quality is excellent even from short samples, making it practical for creators who want a consistent voice without recording every script themselves. Latency on the streaming API is fast enough for real-time applications, which makes it a strong choice for voice agent builders.",
    seoTitle:
      "ElevenLabs Review — Pricing, Voice Cloning Plans and Who It's For | TopToolsPick",
    seoDescription:
      "ElevenLabs review: free vs Starter vs Creator vs Pro plans, voice cloning, 32-language TTS, and which plan fits your content or development workflow.",
    plans: [
      { name: "Free", priceAmount: 0, currency: "USD", billingPeriod: "month", priceLabel: "Free", description: "10,000 characters/month, standard voices" },
      { name: "Starter", priceAmount: 6, currency: "USD", billingPeriod: "month", priceLabel: "$6/month", description: "30,000 characters/month, voice cloning" },
      { name: "Creator", priceAmount: 22, currency: "USD", billingPeriod: "month", priceLabel: "$22/month", description: "100,000 characters/month, professional voices" },
      { name: "Pro", priceAmount: 99, currency: "USD", billingPeriod: "month", priceLabel: "$99/month", description: "500,000 characters/month, usage analytics" },
      { name: "Scale", priceAmount: 299, currency: "USD", billingPeriod: "month", priceLabel: "$299/month", description: "2,000,000 characters/month" },
      { name: "Business", priceAmount: 990, currency: "USD", billingPeriod: "month", priceLabel: "$990/month", description: "10,000,000 characters/month, dedicated support" },
      { name: "Enterprise", priceAmount: null, currency: null, billingPeriod: null, priceLabel: "Custom", description: "Unlimited, custom SLA, on-premise options" },
    ],
  },
  {
    slug: "perplexity",
    websiteUrl: "https://www.perplexity.ai",
    logoUrl: "/tool-logos/perplexity.svg",
    pricingModel: "FREEMIUM",
    hasFreePlan: true,
    hasFreeTrial: false,
    shortDescription:
      "Perplexity is an AI-powered search engine that answers questions conversationally with cited, real-time web sources — giving you direct answers instead of a list of links to sift through.",
    description:
      "Perplexity combines the retrieval of a traditional search engine with the reasoning of a large language model. When you ask a question, it queries the web, summarizes the most relevant sources, and presents a concise, citable answer. Every claim links to its source, so you can verify the information or read the full article.\n\nThe product is built for people who want to understand a topic quickly rather than wade through multiple web pages. It handles research questions, technical comparisons, current events, and follow-up questions well. A conversational history lets you drill deeper into any answer without re-stating context.\n\nThe free plan covers unlimited searches but limits you to five AI-powered Pro searches per day — searches that draw on more capable models and can handle image uploads, file analysis, and complex multi-step reasoning. The Pro plan removes that cap and gives access to models including GPT-4o, Claude, and Gemini.",
    keyFeatures:
      "Real-time web search integrated into every AI response\nEvery answer cites its sources with clickable links\nFocus modes for academic papers, Reddit threads, YouTube, and code\nConversational follow-up questions within the same thread\nFile and image analysis in Pro searches\nChoice of AI models (GPT-4o, Claude, Gemini) on the Pro plan\nPerplexity Pages for publishing long-form research documents",
    notFor:
      "Workflows that need text generation, creative writing, or code assistance\nUsers who need total privacy — queries are sent to Perplexity's servers and underlying model providers\nHigh-frequency research pipelines that need an API at scale\nAnyone satisfied with traditional web search and comfortable reading multiple sources",
    bestFor:
      "Researchers who need quick, sourced answers to complex questions\nJournalists and analysts monitoring current events\nStudents doing literature reviews or topic research\nProfessionals fact-checking claims before presentations\nAnyone who wants a smarter alternative to traditional keyword search",
    verdict:
      "Perplexity is the clearest demonstration of what AI-augmented search can look like. It is most valuable when a question requires synthesizing information from multiple sources or when you want a starting point for deeper research. The citation model is its strongest differentiator — you can trust answers more because the sources are right there. Free users get surprisingly broad access; the Pro plan is worth it if you regularly hit the daily Pro search limit.",
    seoTitle:
      "Perplexity AI Review — Pricing, Pro Plan and What It's For | TopToolsPick",
    seoDescription:
      "Perplexity review: free vs Pro plan at $20/month, cited AI search, model choices, and when it beats traditional search for researchers and professionals.",
    plans: [
      { name: "Free", priceAmount: 0, currency: "USD", billingPeriod: "month", priceLabel: "Free", description: "Unlimited searches, 5 Pro searches/day" },
      { name: "Pro", priceAmount: 20, currency: "USD", billingPeriod: "month", priceLabel: "$20/month", description: "Unlimited Pro searches, GPT-4o/Claude/Gemini access, file uploads" },
    ],
  },
  {
    slug: "figma",
    websiteUrl: "https://www.figma.com",
    logoUrl: "/tool-logos/figma.svg",
    pricingModel: "FREEMIUM",
    hasFreePlan: true,
    hasFreeTrial: false,
    shortDescription:
      "Figma is a browser-based interface design tool for building UI mockups, interactive prototypes, and design systems collaboratively in real time.",
    description:
      "Figma is the standard tool for product and interface design teams. It runs entirely in the browser, which means designers and developers work from the same file at the same time without version-conflict headaches. Files are always up to date and shareable with a link.\n\nIts component system lets teams build and maintain a shared design library. Components defined in one file can be used across an entire product. When you update a component, every instance updates automatically — a single source of truth that prevents the drift between design and production that plagues teams using file-based tools.\n\nBeyond static designs, Figma supports interactive prototyping, design tokens via variables, and developer handoff with inspect mode. Dev Mode (available from the Professional plan up) shows exact CSS, spacing values, and asset downloads directly inside the design file — reducing back-and-forth between designers and engineers. FigJam, included with paid plans, adds a whiteboard for brainstorming and workshops.",
    keyFeatures:
      "Real-time multiplayer editing for entire design teams\nShared component libraries with auto-propagating updates\nInteractive prototyping with transitions and overlays\nVariables and design tokens for systematic theming\nDev Mode for developer handoff with CSS values and spacing\nAuto Layout for responsive component design\nFigJam whiteboard for workshops and diagramming\nPlugin ecosystem with hundreds of integrations",
    notFor:
      "Heavy raster image editing — use Photoshop for photo manipulation\nPrint design and complex document layout — use InDesign\nUsers who need a fully offline tool with no cloud dependency\nSolo freelancers who only need basic mockups and prefer a local tool\nLinux users who prefer a native desktop application",
    bestFor:
      "Product design teams building UI across web and mobile\nDesign-to-development teams that need fast, accurate handoff\nDesign system maintainers who need a single source of truth\nUX researchers building testable prototypes\nFreelancers who collaborate with clients on live files",
    verdict:
      "Figma is the dominant tool for collaborative interface design for good reason: its real-time collaboration and component system genuinely reduce coordination overhead for teams. The free plan is generous enough for solo projects; the Professional plan makes sense the moment you start collaborating regularly. Dev Mode is the biggest reason to upgrade beyond the Starter plan if your team has a front-end engineer who uses Figma daily.",
    seoTitle:
      "Figma Review — Pricing, Plans and Who Should Use It | TopToolsPick",
    seoDescription:
      "Figma review: free Starter vs Professional $15/editor vs Organization $45 — when to upgrade, what Dev Mode adds, and which plan fits your design team.",
    plans: [
      { name: "Starter", priceAmount: 0, currency: "USD", billingPeriod: "month", priceLabel: "Free", description: "3 Figma files, 3 FigJam files, unlimited collaborators" },
      { name: "Professional", priceAmount: 15, currency: "USD", billingPeriod: "month", priceLabel: "$15/editor/month", description: "Unlimited files, shared libraries, Dev Mode, version history" },
      { name: "Organization", priceAmount: 45, currency: "USD", billingPeriod: "month", priceLabel: "$45/editor/month", description: "Org-wide design systems, SSO, centralized admin" },
      { name: "Enterprise", priceAmount: 75, currency: "USD", billingPeriod: "month", priceLabel: "$75/editor/month", description: "Advanced security, dedicated support, custom contracts" },
    ],
  },
  {
    slug: "github",
    websiteUrl: "https://github.com",
    logoUrl: "/tool-logos/github.svg",
    pricingModel: "FREEMIUM",
    hasFreePlan: true,
    hasFreeTrial: false,
    shortDescription:
      "GitHub is a cloud-based Git hosting platform where developers store code, track issues, review pull requests, and run automated workflows through GitHub Actions.",
    description:
      "GitHub is where the majority of open-source and private software development happens. It provides hosted Git repositories, pull request workflows, issue tracking, project boards, and CI/CD automation in one platform. Most developer tooling — IDEs, deployment pipelines, code scanners — integrates with GitHub out of the box.\n\nThe free plan includes unlimited public and private repositories for individuals and supports basic collaboration for small teams. The Team plan unlocks protected branches, required reviewers, GitHub Actions minutes beyond the free tier, and more granular permission controls — the features most growing teams need as soon as they take code quality seriously.\n\nGitHub Actions is one of the platform's most powerful features: a YAML-based CI/CD system that runs tests, builds, and deployments on every push or pull request. Combined with GitHub Copilot (a separate subscription), it forms a development platform rather than just a repository host.",
    keyFeatures:
      "Git repository hosting with unlimited public and private repos\nPull request and code review workflow with inline comments\nGitHub Actions for CI/CD automation\nIssue tracking, project boards, and milestones\nGitHub Pages for static site hosting from any repo\nDependabot for automated dependency updates and security alerts\nCodespaces for cloud-based development environments\nGitHub Packages for hosting npm, Docker, and other artifacts",
    notFor:
      "Teams that require full on-premises hosting without a cloud option\nUsers who strongly prefer open-source infrastructure for their Git hosting (consider Gitea or Forgejo)\nSmall teams that do not need CI/CD and find Actions configuration overhead high for simple projects\nOrganizations with strict data-residency requirements that GitHub's cloud cannot meet",
    bestFor:
      "Open-source project maintainers who want the widest contributor reach\nSoftware development teams that want collaboration, CI, and hosting in one place\nDevelopers building APIs or libraries that others will integrate\nStartups that want professional development workflows without infrastructure overhead\nAnyone learning Git who wants tutorials, community, and visibility for their projects",
    verdict:
      "GitHub's network effects are its defining advantage: nearly every developer has an account, and most public packages are hosted there. The free plan is surprisingly complete for individuals and open-source work. Teams hit its limits quickly — protected branches and required reviewers are basic quality-control features that only appear on the Team plan. GitHub Actions is well-designed and the minutes allocation on paid plans is enough for most teams without additional cost.",
    seoTitle:
      "GitHub Review — Pricing, Plans and Who It's For | TopToolsPick",
    seoDescription:
      "GitHub review: free vs Team $4/user/month vs Enterprise $21/user — what each plan unlocks, when GitHub Actions matters, and who needs to upgrade.",
    plans: [
      { name: "Free", priceAmount: 0, currency: "USD", billingPeriod: "month", priceLabel: "Free", description: "Unlimited repos, 2,000 Actions minutes/month, basic collaboration" },
      { name: "Team", priceAmount: 4, currency: "USD", billingPeriod: "month", priceLabel: "$4/user/month", description: "Protected branches, required reviewers, 3,000 Actions minutes/month" },
      { name: "Enterprise", priceAmount: 21, currency: "USD", billingPeriod: "month", priceLabel: "$21/user/month", description: "Advanced security, SAML SSO, enterprise support, 50,000 Actions minutes" },
    ],
  },
  {
    slug: "shopify",
    websiteUrl: "https://www.shopify.com",
    logoUrl: "/tool-logos/shopify.svg",
    pricingModel: "SUBSCRIPTION",
    hasFreePlan: false,
    hasFreeTrial: true,
    shortDescription:
      "Shopify is an all-in-one e-commerce platform for building and running an online store, handling payments, inventory, shipping, and marketing from a single dashboard.",
    description:
      "Shopify handles every layer of an e-commerce operation: storefront design, product management, payment processing, fulfillment, and marketing. You do not need to manage servers, buy payment processing contracts separately, or stitch together disparate services — the platform handles all of it, with thousands of third-party apps available for specialized needs.\n\nThe storefront editor uses a theme system where everything is customizable through a no-code interface or with code access for developers. Shopify Payments eliminates third-party transaction fees; using an external payment gateway adds a 0.5–2% surcharge depending on the plan. All plans include unlimited products, abandoned cart recovery, discount codes, and basic analytics.\n\nShopify Plus, which starts at $2,300/month, is a different product aimed at enterprise retailers — it adds custom checkout scripts, dedicated support, and multi-storefront management. For most growing brands, the middle plans (Shopify $105/month or Advanced $399/month) are the relevant ceiling.",
    keyFeatures:
      "Drag-and-drop storefront builder with hundreds of themes\nBuilt-in payment processing via Shopify Payments (2.4–2.9% + 30¢)\nMulti-channel selling across Facebook, Instagram, TikTok, Amazon, and POS\nShopify Shipping with negotiated carrier rates\nAbandoned cart recovery emails on all plans\nInventory tracking across multiple locations\nApp store with 8,000+ integrations\nShopify Analytics dashboard and custom reports on higher plans",
    notFor:
      "Sellers who want zero transaction fees on external payment gateways without upgrading plans\nDevelopers who need full open-source control over the checkout experience\nBusinesses with very complex B2B pricing structures on lower-tier plans\nSellers who primarily offer digital downloads at scale — additional apps required\nStores that need multi-currency pricing without using Shopify Payments",
    bestFor:
      "Consumer brands launching a direct-to-consumer online store\nRetailers who sell both online and in-person and want unified inventory\nDrop-shipping businesses that need supplier integrations\nSmall to mid-sized businesses who want a managed platform over a self-hosted one\nMerchants already using Shopify POS who want consistent online-offline reporting",
    verdict:
      "Shopify is the most complete hosted e-commerce platform for direct-to-consumer brands. Its biggest trade-off is cost: transaction fees add up quickly on the Basic plan if you process significant volume. The Shopify plan at $105/month pays for itself once you are doing enough volume that the lower transaction rate and better shipping discounts offset the plan cost. For anyone launching a consumer product business, Shopify is the default recommendation.",
    seoTitle:
      "Shopify Review — Pricing, Plans and Transaction Fees Explained | TopToolsPick",
    seoDescription:
      "Shopify review: Basic $39 vs Shopify $105 vs Advanced $399 — transaction fees compared, when to upgrade, and which plan fits your sales volume.",
    plans: [
      { name: "Starter", priceAmount: 5, currency: "USD", billingPeriod: "month", priceLabel: "$5/month", description: "Sell via links and social media, no online store" },
      { name: "Basic", priceAmount: 39, currency: "USD", billingPeriod: "month", priceLabel: "$39/month", description: "Full online store, 2% transaction fee with external gateways" },
      { name: "Shopify", priceAmount: 105, currency: "USD", billingPeriod: "month", priceLabel: "$105/month", description: "5 staff accounts, 1% transaction fee, professional reports" },
      { name: "Advanced", priceAmount: 399, currency: "USD", billingPeriod: "month", priceLabel: "$399/month", description: "15 staff accounts, 0.5% transaction fee, advanced reporting" },
      { name: "Plus", priceAmount: 2300, currency: "USD", billingPeriod: "month", priceLabel: "$2,300/month", description: "Enterprise features, custom checkout, multi-store management" },
    ],
  },
  {
    slug: "vercel",
    websiteUrl: "https://vercel.com",
    logoUrl: "/tool-logos/vercel.avif",
    pricingModel: "FREEMIUM",
    hasFreePlan: true,
    hasFreeTrial: false,
    shortDescription:
      "Vercel is a frontend cloud platform for deploying web applications with zero configuration, instant preview URLs, edge caching, and built-in CI/CD via Git integration.",
    description:
      "Vercel is the deployment platform built by the Next.js team and optimized for it, though it supports any frontend framework. The core value proposition is a zero-configuration deployment workflow: connect a Git repository, and every push to any branch produces a live preview URL. Merging to main deploys to production automatically.\n\nIt handles CDN distribution, edge caching, serverless functions, and environment management without any infrastructure setup. For Next.js projects in particular, Vercel's platform understands the framework deeply — it automatically splits code, caches server-rendered pages at the edge, and routes serverless function invocations through the most efficient region.\n\nThe Hobby plan is free and suitable for personal projects and experimentation. The Pro plan at $20/user/month is the step most production apps take when they need custom domains without Vercel branding, higher bandwidth limits, team collaboration, and analytics.",
    keyFeatures:
      "Git-connected deployments with automatic preview URLs for every branch\nGlobal Edge Network with 100+ CDN locations\nServerless functions and Edge Functions with low cold-start latency\nVercel Analytics for real user performance monitoring\nEnvironment variable management across production, preview, and development\nFramework-aware build optimization for Next.js, SvelteKit, Nuxt, Astro, and more\nInstant rollbacks to any previous deployment\nDDoS protection and automatic HTTPS on all deployments",
    notFor:
      "Applications that need persistent servers or long-running WebSocket connections\nBackend-heavy apps without a clear frontend layer\nTeams with very high traffic volumes where Vercel's pricing becomes expensive\nThe Hobby free plan is limited to personal non-commercial projects\nUsers who want full infrastructure control and prefer self-managed servers",
    bestFor:
      "Next.js developers who want zero-config deployments with deep framework integration\nFrontend teams that want instant preview URLs for every pull request\nStartups iterating quickly who do not want to manage infrastructure\nAgencies deploying many client sites on a single plan\nDevelopers building edge-native applications that need global low latency",
    verdict:
      "Vercel's developer experience is genuinely the best in the serverless deployment market. The Git integration, preview deployments, and Next.js optimization are hard to beat for teams already using that stack. The Hobby plan is free but limited to personal non-commercial projects, making the $20/month Pro plan the right starting point for any production application. Pricing becomes a concern at high traffic levels — at that point, teams typically weigh Vercel's operational simplicity against the cost of managing their own infrastructure.",
    seoTitle:
      "Vercel Review — Pricing, Plans and Who It's For | TopToolsPick",
    seoDescription:
      "Vercel review: free Hobby vs Pro $20/user/month vs Enterprise — what each plan includes, Next.js optimization, and when the cost justifies itself.",
    plans: [
      { name: "Hobby", priceAmount: 0, currency: "USD", billingPeriod: "month", priceLabel: "Free", description: "Personal non-commercial projects, 100GB bandwidth/month" },
      { name: "Pro", priceAmount: 20, currency: "USD", billingPeriod: "month", priceLabel: "$20/user/month", description: "Production apps, 1TB bandwidth, team collaboration, analytics" },
      { name: "Enterprise", priceAmount: null, currency: null, billingPeriod: null, priceLabel: "Custom", description: "Custom SLA, dedicated support, advanced security" },
    ],
  },
];

async function main() {
  let updated = 0;
  for (const tool of TOOLS) {
    const { slug, plans, ...productData } = tool;
    const product = await prisma.product.findUnique({ where: { slug }, select: { id: true, name: true } });
    if (!product) {
      console.log(`  SKIP  "${slug}" — not found`);
      continue;
    }
    await prisma.product.update({
      where: { slug },
      data: {
        ...productData,
        pricingPlans: {
          deleteMany: {},
          create: plans.map((p, i) => ({ ...p, sortOrder: i })),
        },
      },
    });
    console.log(`  OK    ${product.name} (${plans.length} plans)`);
    updated++;
  }
  console.log(`\nDone — updated ${updated} / ${TOOLS.length} products.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
