import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();
const TODAY = new Date("2026-10-04");
async function main() {
  await prisma.product.update({
    where: { slug: "asana" },
    data: {
      name: "Asana",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/asana.png",
      shortDescription: "Work management platform for teams to plan projects, assign tasks, track progress, and automate workflows — with AI-powered tools for prioritization and reporting.",
      description: "Asana is a cloud-based work management platform used by teams ranging from startups to Fortune 500 companies to organize projects, track tasks, and coordinate work across departments. The platform offers multiple views — list, board, timeline, calendar, and Gantt — so every team member sees work the way they prefer. Asana's automation engine lets you build rule-based workflows that assign tasks, update statuses, send notifications, and route intake forms without manual effort. The Advanced plan adds portfolio management for tracking multiple projects at once, goals that connect daily work to company-level objectives, and resource management for balancing team capacity. AI features (AI Teammates, AI Studio) are included across all paid plans with monthly credit allocations. Asana integrates with 300+ tools including Slack, Google Workspace, Microsoft 365, Salesforce, Zoom, and Jira.",
      websiteUrl: "https://asana.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "Multiple project views: list, board, timeline, calendar, and Gantt chart",
        "Unlimited automations for routing tasks, sending alerts, and updating statuses (Starter+)",
        "Portfolio management to track progress across multiple projects (Advanced+)",
        "Goals that connect team tasks to company-level objectives (Advanced+)",
        "Resource management to identify team capacity and rebalance workloads (Advanced+)",
        "AI Teammates and AI Studio for smart task prioritization and workflow automation",
        "300+ integrations including Slack, Google Workspace, Salesforce, Jira, and Zoom",
      ].join("\n"),
      bestFor: "Teams of 5–200 that run multiple concurrent projects and need a structured way to track ownership, deadlines, and cross-team dependencies without losing context",
      notFor: "Solo users or very small teams that only need simple to-do lists — the Personal plan covers basic needs but Asana's real value comes from team collaboration features",
      verdict: "Asana is one of the most polished project management tools available. The Starter plan at $10.99/user/month is well-priced for small teams that need automations and Gantt views. Advanced adds the portfolio and goals layer that growing teams need to connect execution to strategy. The free Personal plan is genuinely usable for individual work but limited to 2 users.",
      seoTitle: "Asana Review: Pricing, Features & Plans",
      seoDescription: "Asana review: work management platform for teams with task tracking, automations, and Gantt views. Free plan available, Starter from $10.99/user/month.",
      lastReviewedAt: TODAY,
      pricingPlans: {
        deleteMany: {},
        create: [
          { name: "Personal", priceAmount: 0, currency: "USD", billingPeriod: null, priceLabel: "Free forever", description: "Up to 2 users. Unlimited tasks and projects, list/board/calendar views, 100+ integrations.", sortOrder: 0 },
          { name: "Starter", priceAmount: 10.99, currency: "USD", billingPeriod: "per user/month (billed annually)", priceLabel: "$10.99/user/month (billed annually)", description: "Unlimited users. Timeline & Gantt, reporting dashboards, unlimited automations, forms, custom fields, unlimited free guests. AI included.", sortOrder: 1 },
          { name: "Advanced", priceAmount: 24.99, currency: "USD", billingPeriod: "per user/month (billed annually)", priceLabel: "$24.99/user/month (billed annually)", description: "Everything in Starter plus portfolios, goals, resource management, approvals & proofing, time tracking, and advanced form branching.", sortOrder: 2 },
          { name: "Enterprise", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "Custom pricing", description: "Advanced security, SAML SSO, data export, custom branding, dedicated success manager, and higher AI credit limits.", sortOrder: 3 },
        ],
      },
    },
  });
  console.log("Done — Asana updated.");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
