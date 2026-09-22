/**
 * update-notion.ts — real editorial content + pricing for Notion
 * Run: npx tsx prisma/update-notion.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SLUG = "notion";

const PLANS = [
  {
    name: "Free",
    priceAmount: 0,
    currency: "USD",
    billingPeriod: "monthly",
    priceLabel: "Free",
    description: "Unlimited pages and blocks for one person; basic databases, Notion Calendar, basic forms and sites; trial of Notion AI",
    sortOrder: 0,
  },
  {
    name: "Plus",
    priceAmount: 10,
    currency: "USD",
    billingPeriod: "per member/month (billed annually)",
    priceLabel: "$10 / member / month",
    description: "Everything in Free plus unlimited collaborative blocks, unlimited file uploads, unlimited charts, custom forms and sites, basic connections; $12/month billed monthly",
    sortOrder: 1,
  },
  {
    name: "Business",
    priceAmount: 20,
    currency: "USD",
    billingPeriod: "per member/month (billed annually)",
    priceLabel: "$20 / member / month",
    description: "Everything in Plus plus Notion Agent, AI Meeting Notes, Enterprise Search, SAML SSO, granular database permissions, private teamspaces, premium connections; $25/month billed monthly",
    sortOrder: 2,
  },
  {
    name: "Enterprise",
    priceAmount: null,
    currency: "USD",
    billingPeriod: null,
    priceLabel: "Contact for pricing",
    description: "Everything in Business plus SCIM provisioning, advanced security and audit logs, zero data retention with LLM providers, customer success manager, domain management, DLP/SIEM connections",
    sortOrder: 3,
  },
];

async function main() {
  const product = await prisma.product.findUnique({ where: { slug: SLUG }, select: { id: true } });
  if (!product) throw new Error(`Product "${SLUG}" not found`);

  await prisma.product.update({
    where: { slug: SLUG },
    data: {
      logoUrl: "/tool-logos/notion.svg",

      shortDescription:
        "Notion is an all-in-one workspace that combines notes, databases, wikis, tasks and calendars in a single app — flexible enough to replace half your productivity stack.",

      description:
        "Notion is a block-based productivity platform that lets you build any kind of workspace from a common set of building blocks: pages, databases, kanban boards, calendars, timelines and embeds. Every piece of content is a block that can be dragged, nested and linked, which means a simple meeting note can grow into a full project tracker or a company wiki without switching tools.\n\nTeams use Notion as a shared knowledge base, a project management tool, a CRM, a product roadmap or all of the above at once. Its flexibility is the main draw — and the main challenge. Unlike purpose-built tools like Asana or Linear, Notion requires upfront setup and an opinionated system to work well; without that, workspaces become messy quickly.\n\nNotion AI is now built into every plan as a trial, and unlocks as a paid add-on ($10 per member/month). It can draft pages, summarise long documents, auto-fill database properties and, in Business plans, run as an agent that handles repetitive tasks autonomously. The free plan is genuinely useful for individuals; Plus ($10/month per member) unlocks everything a small team needs.",

      notFor:
        "Teams that need a dedicated project management tool with advanced dependencies and time tracking — Linear, Asana or Jira are better suited\nUsers who want a fast, focused writing app — Notion's block interface adds friction compared to Obsidian or Bear\nOrganisations with strict offline requirements — Notion's offline mode is limited and unreliable\nPower users who need complex automation without code — native automation is basic compared to Airtable",

      keyFeatures:
        "Block-based editor — everything is a drag-and-drop block: text, image, embed, database, sub-page\nDatabases with multiple views: table, board, calendar, timeline, gallery and list\nRelational databases with rollup properties for cross-linked data\nNotion AI: drafting, summarisation, auto-fill and agent automation (paid add-on)\nTemplates gallery for team wikis, project trackers, CRMs and more\nCollaborative editing with comments, mentions and page history\nNotion Sites and Forms built directly from database pages\nSSO and advanced security controls on Business and Enterprise plans",

      verdict:
        "The most flexible all-in-one workspace available, and the right choice for teams that want one place for docs, databases and projects instead of three separate tools. The learning curve is real — Notion rewards teams that invest in setup — but once the structure is in place it scales from a personal notes app to a company-wide operating system. The free plan is excellent for individuals; Plus earns its cost for any team of two or more.",

      seoTitle:
        "Notion Review 2025 — Pricing, Features and Is It Worth It? | TopToolsPick",

      seoDescription:
        "Notion review: free vs Plus vs Business plans, who it is actually for, and when Obsidian, Linear or Confluence is a better fit.",

      lastReviewedAt: new Date("2025-09-01"),
      verified: true,
    },
  });

  await prisma.pricingPlan.deleteMany({ where: { productId: product.id } });
  for (const plan of PLANS) {
    await prisma.pricingPlan.create({ data: { ...plan, productId: product.id } });
  }

  console.log(`Done. Notion content and ${PLANS.length} pricing plans updated.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
