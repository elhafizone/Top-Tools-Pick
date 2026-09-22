/**
 * update-claude.ts — real editorial content + pricing for Claude (Anthropic)
 * Run: npx tsx prisma/update-claude.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SLUG = "claude";

const PLANS = [
  {
    name: "Free",
    priceAmount: 0,
    currency: "USD",
    billingPeriod: "monthly",
    priceLabel: "Free",
    description: "Chat on web, mobile and desktop; web search; memory; Artifacts; Sonnet and Haiku models; up to 5 Projects",
    sortOrder: 0,
  },
  {
    name: "Pro",
    priceAmount: 20,
    currency: "USD",
    billingPeriod: "monthly",
    priceLabel: "$20 / month (or $17 billed annually)",
    description: "Everything in Free plus more usage, Opus model, Claude Code, Projects (unlimited), Claude Design/Slides/Docs, Claude Science, Microsoft 365 integration",
    sortOrder: 1,
  },
  {
    name: "Max 5×",
    priceAmount: 100,
    currency: "USD",
    billingPeriod: "monthly",
    priceLabel: "$100 / month",
    description: "Everything in Pro plus 5× more usage per 5-hour session, higher output limits, early access to new features, priority access at high traffic",
    sortOrder: 2,
  },
  {
    name: "Max 20×",
    priceAmount: 200,
    currency: "USD",
    billingPeriod: "monthly",
    priceLabel: "From $200 / month",
    description: "Everything in Pro plus 20× more usage per 5-hour session — for power users who work with Claude throughout the day",
    sortOrder: 3,
  },
  {
    name: "Enterprise",
    priceAmount: null,
    currency: "USD",
    billingPeriod: null,
    priceLabel: "Contact for pricing",
    description: "SSO, SCIM, audit logs, HIPAA-ready offering, custom data retention, admin controls, central billing and dedicated support",
    sortOrder: 4,
  },
];

async function main() {
  const product = await prisma.product.findUnique({ where: { slug: SLUG }, select: { id: true } });
  if (!product) throw new Error(`Product "${SLUG}" not found`);

  // 1. Update product content
  await prisma.product.update({
    where: { slug: SLUG },
    data: {
      logoUrl: "https://logo.clearbit.com/anthropic.com",

      shortDescription:
        "Claude is Anthropic's AI assistant — built for careful reasoning, long documents and professional writing, with a 1M-token context window and a strong emphasis on accuracy over confidence.",

      description:
        "Claude is the AI assistant built by Anthropic, a safety-focused AI company. It is designed with a strong emphasis on careful reasoning, accuracy and helpfulness — and it is notably more likely than competitors to acknowledge uncertainty rather than produce a confident but incorrect answer.\n\nClaude's biggest practical differentiator is its context window: up to 1 million tokens on the latest models, which means it can read and reason across entire books, legal contracts, large codebases or full research papers in a single session. This makes it particularly strong for document analysis, long-form writing and extended coding sessions where context needs to be held across a large body of material.\n\nThe free plan gives access to Sonnet and Haiku models with daily usage limits. The Pro plan ($20/month, or $17 billed annually) unlocks Opus — the most capable model — along with Claude Code for agentic coding, Projects for organising conversations and documents, and integrations with Microsoft 365. The Max plans ($100–$200/month) are built for users who work with Claude throughout the day and need significantly higher usage limits without interruption.",

      notFor:
        "Users who need a large plugin ecosystem or broad third-party integrations — ChatGPT's GPT Store has far wider coverage\nAnyone who primarily needs image generation — Claude has no native image creation capability\nUsers who want real-time news or citation-heavy research — Perplexity is better suited for web-grounded answers\nBudget-conscious users who need unlimited usage — the free plan has strict daily limits, and the Max plans are expensive",

      keyFeatures:
        "Up to 1M token context window — reads entire books, codebases or contracts in one session\nOpus, Sonnet and Haiku models for different speed and capability trade-offs\nClaude Code for agentic software development (Pro+)\nProjects with persistent memory and document storage\nArtifacts — live previews of code, documents and visualisations\nClaude Science for scientific research tasks (Pro+)\nMicrosoft 365 and Chrome integrations (Pro+)\nConstitutional AI training — stronger guardrails on confabulation than most competitors",

      verdict:
        "The best AI assistant for long documents, nuanced writing and professional tasks where accuracy matters more than breadth. If you regularly work with large files or need an AI that admits what it does not know, Claude is the more reliable choice over ChatGPT for those use cases. The free plan is genuinely useful; Pro earns its cost for anyone who uses AI as a daily work tool.",

      seoTitle:
        "Claude AI Review 2025 — Pricing, Context Window and vs ChatGPT | TopToolsPick",

      seoDescription:
        "Claude review: free vs Pro vs Max plans, the 1M-token context window, how it compares with ChatGPT, and who should choose it for their workflow.",

      lastReviewedAt: new Date("2025-09-01"),
      verified: true,
    },
  });

  // 2. Replace pricing plans
  await prisma.pricingPlan.deleteMany({ where: { productId: product.id } });
  for (const plan of PLANS) {
    await prisma.pricingPlan.create({ data: { ...plan, productId: product.id } });
  }

  console.log(`Done. Claude content and ${PLANS.length} pricing plans updated.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
