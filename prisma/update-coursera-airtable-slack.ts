import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();
const TODAY = new Date("2026-10-04");
type Plan = { name: string; priceAmount?: number | null; currency?: string; billingPeriod?: string | null; priceLabel: string; description?: string; sortOrder: number; };
const updates = [
  {
    slug: "coursera",
    plans: [
      { name: "Free", priceAmount: 0, currency: "USD", billingPeriod: null, priceLabel: "Free (audit mode)", description: "Audit most courses for free — watch videos and access course materials without certificates or graded assignments.", sortOrder: 0 },
      { name: "Coursera Plus", priceAmount: 59, currency: "USD", billingPeriod: "monthly", priceLabel: "$59/month (or $399/year)", description: "Unlimited access to 7,000+ courses, certificates, and Specializations. Includes Professional Certificates from Google, IBM, Meta, and others.", sortOrder: 1 },
      { name: "Individual Degrees", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "$9,000–$25,000 total (online degrees)", description: "Accredited bachelor's and master's degrees in CS, data science, business, and public health from top universities. Eligible for financial aid.", sortOrder: 2 },
      { name: "Coursera for Business", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "Custom pricing (from $400/user/year)", description: "Teams and organizations get access to all content, admin analytics dashboard, curated learning paths, and skill gap analysis.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Coursera",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/coursera.png",
      shortDescription: "Online learning platform with 7,000+ courses, certificates, and degrees from 325+ universities including Google, IBM, Meta, Stanford, and Yale.",
      description: "Coursera is the world's largest online learning platform by revenue, offering courses, Specializations, Professional Certificates, and accredited degrees from 325+ leading universities and companies. Individual courses are taught by professors from institutions like Stanford, Yale, Duke, and Johns Hopkins, as well as industry experts from Google, IBM, Meta, Amazon, and Salesforce. The platform's most popular offerings are Professional Certificates — multi-course programs designed to prepare learners for entry-level jobs in data analytics, UX design, cybersecurity, project management, and programming. Google's suite of Professional Certificates alone has enrolled over 1 million learners. Coursera Plus ($399/year) gives unlimited access to 90% of the content including all certificates and Specializations, making it the best value if you plan to take more than 2-3 courses per year. Most courses can be audited for free, but completing graded assignments and earning certificates requires paid enrollment.",
      websiteUrl: "https://www.coursera.org",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "7,000+ courses from 325+ universities including Stanford, Yale, and Johns Hopkins",
        "Professional Certificates from Google, IBM, Meta, Amazon, and Salesforce",
        "Accredited online bachelor's and master's degrees in CS, data science, and business",
        "Hands-on projects, graded assignments, and peer-reviewed work",
        "Coursera Plus: unlimited access to most content for $399/year",
        "Mobile app for offline learning on iOS and Android",
        "LinkedIn-shareable certificates and degree transcripts",
      ].join("\n"),
      bestFor: "Professionals looking to upskill or pivot careers, and students who want accredited online certificates from recognized universities or tech companies like Google and IBM",
      notFor: "Learners who need highly interactive or live instruction — Coursera is primarily self-paced video content; bootcamps or live tutoring platforms are better for hands-on mentorship",
      verdict: "Coursera is the best platform for structured, credential-backed online learning from universities and major tech companies. Coursera Plus at $399/year is excellent value if you plan to take multiple courses — individual courses often cost $49-79 each. The free audit mode lets you evaluate course quality before paying. For career changers, Google's Professional Certificates offer solid ROI at the Plus subscription price.",
      seoTitle: "Coursera Review: Pricing, Features & Plans",
      seoDescription: "Coursera review: online learning platform with 7,000+ courses from 325+ universities. Free audit mode available, Coursera Plus from $59/month. Certificates and degrees.",
      lastReviewedAt: TODAY,
    },
  },
  {
    slug: "airtable",
    plans: [
      { name: "Free", priceAmount: 0, currency: "USD", billingPeriod: null, priceLabel: "Free forever", description: "Unlimited bases, 1,000 records per base, 1GB storage per base, 2-week revision history, 5 editors. Grid, gallery, kanban, calendar, form views.", sortOrder: 0 },
      { name: "Team", priceAmount: 20, currency: "USD", billingPeriod: "per seat/month (billed annually)", priceLabel: "$20/seat/month (billed annually)", description: "50,000 records per base, 20GB storage, 6-month revision history, unlimited editors, automations (25,000 runs/month), custom branded forms.", sortOrder: 1 },
      { name: "Business", priceAmount: 45, currency: "USD", billingPeriod: "per seat/month (billed annually)", priceLabel: "$45/seat/month (billed annually)", description: "125,000 records per base, 100GB storage, 1-year revision history, SAML SSO, premium integrations (Salesforce, Jira), 100,000 automation runs/month.", sortOrder: 2 },
      { name: "Enterprise Scale", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "Custom pricing", description: "500,000+ records, unlimited storage, advanced admin controls, audit logs, data residency, and enterprise-grade security.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Airtable",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/airtable.svg",
      shortDescription: "Flexible database-spreadsheet hybrid that lets teams build custom apps, content calendars, project trackers, and CRMs — no coding required.",
      description: "Airtable is a low-code platform that combines a spreadsheet's familiarity with a relational database's power. Each base is a collection of tables that can link to each other, store attachments, and display in multiple views: grid, kanban, gallery, calendar, form, Gantt, or timeline. Teams use Airtable to manage editorial calendars, track product launches, run marketing campaigns, manage vendor relationships, and build lightweight CRMs — all without writing code. The Interface Designer lets you build custom dashboards and forms on top of your data, and the automation engine can send Slack messages, update records, create tasks, or call APIs when conditions are met. Airtable integrates with 150+ tools including Slack, Google Calendar, Jira, Salesforce, Zapier, and Make. AI features (Airtable AI) can generate text, categorize records, extract data from attachments, and summarize fields. The platform has expanded from a standalone tool into an app-building platform for teams that need more structure than a spreadsheet but less development overhead than custom software.",
      websiteUrl: "https://airtable.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "Relational database with linked records, rollups, lookups, and formula fields",
        "Multiple views: grid, kanban, gallery, calendar, form, Gantt, and timeline",
        "Interface Designer: build custom dashboards and portals without code",
        "Automations: trigger actions (Slack messages, API calls, emails) on record changes",
        "Airtable AI: generate text, categorize records, and summarize attachments (Team+)",
        "150+ integrations including Slack, Google Calendar, Jira, and Salesforce",
        "Shared forms for collecting external submissions directly into your base",
      ].join("\n"),
      bestFor: "Operations, marketing, and product teams that need a flexible, no-code database to manage workflows, content pipelines, or project tracking with a custom structure",
      notFor: "Teams that need a traditional relational database with complex SQL queries and strict schemas — PostgreSQL or MySQL are better for technical applications with large data volumes",
      verdict: "Airtable is the most flexible no-code database available. The free plan works well for small teams and personal projects. The Team plan at $20/seat/month is reasonable for teams that need automation and more records. The main limitation is record caps — at 50,000 records per base on Team, you'll hit limits faster than expected on large datasets. For high-volume operational data, consider a purpose-built database.",
      seoTitle: "Airtable Review: Pricing, Features & Plans",
      seoDescription: "Airtable review: flexible database-spreadsheet hybrid for content calendars, project tracking, and custom apps. Free plan available, Team from $20/seat/month.",
      lastReviewedAt: TODAY,
    },
  },
  {
    slug: "slack",
    plans: [
      { name: "Free", priceAmount: 0, currency: "USD", billingPeriod: null, priceLabel: "Free forever", description: "90-day message history, 1:1 audio/video calls, 10 app integrations, unlimited channels and users.", sortOrder: 0 },
      { name: "Pro", priceAmount: 7.25, currency: "USD", billingPeriod: "per person/month (billed annually)", priceLabel: "$7.25/person/month (billed annually)", description: "Unlimited message history, unlimited app integrations, group audio/video calls, Slack Connect channels for external partners.", sortOrder: 1 },
      { name: "Business+", priceAmount: 12.50, currency: "USD", billingPeriod: "per person/month (billed annually)", priceLabel: "$12.50/person/month (billed annually)", description: "Everything in Pro plus SAML SSO, user provisioning, compliance exports, Data Loss Prevention (DLP) integrations, and 24/7 support.", sortOrder: 2 },
      { name: "Enterprise Grid", priceAmount: null, currency: "USD", billingPeriod: null, priceLabel: "Custom pricing", description: "Unlimited workspaces under one organization, enterprise key management, eDiscovery, advanced admin controls, and dedicated CSM.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Slack",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/slack.svg",
      shortDescription: "Team messaging platform with organized channels, threads, and 2,600+ integrations — the central hub for workplace communication for millions of teams.",
      description: "Slack is the most widely adopted team messaging platform, used by over 32.3 million daily active users and more than 750,000 organizations. It organizes communication into channels — public or private spaces for specific teams, projects, or topics — keeping conversations searchable and organized instead of buried in inboxes. Threads allow in-depth discussion within a channel without cluttering the main feed. Slack Connect lets teams communicate with external partners, clients, or vendors directly inside Slack. The platform integrates with 2,600+ apps including GitHub, Jira, Google Drive, Zoom, Salesforce, and PagerDuty, centralizing notifications and workflows in one place. Slack AI (on paid plans) can summarize channels you've missed, find answers across your message history, and generate recaps of threads. The free plan's 90-day message history limit is a significant constraint for teams that need compliance or historical search. Salesforce acquired Slack in 2021 and has been integrating Slack deeply into the Salesforce Customer 360 platform.",
      websiteUrl: "https://slack.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "Channels: organized spaces for teams, projects, and topics with full search history",
        "Threads: in-depth discussion within any message without cluttering the main channel",
        "Slack Connect: collaborate in shared channels with external partners and clients",
        "Slack AI: summarize missed channels, search conversations, and generate recaps",
        "2,600+ integrations including GitHub, Jira, Google Drive, Zoom, and Salesforce",
        "Workflow Builder: automate routine tasks and approvals without code",
        "Clips: record and share short audio or video messages in channels",
      ].join("\n"),
      bestFor: "Teams of all sizes that want to move internal communication from email to organized channels, with tight integrations into their existing tools like GitHub, Jira, and Google Workspace",
      notFor: "Very small teams (under 5) with simple communication needs — the free plan is limited to 90 days of history, and Microsoft Teams may be included with an existing Microsoft 365 subscription at no extra cost",
      verdict: "Slack set the standard for team messaging and still leads on integrations and UX polish. The Pro plan at $7.25/person/month is reasonably priced for the productivity gain over email. The 90-day history limit on the free plan makes it unsuitable for any team that needs compliance or wants to search older discussions. Teams already in the Microsoft ecosystem should evaluate whether Teams meets their needs before adding a separate Slack subscription.",
      seoTitle: "Slack Review: Pricing, Features & Plans",
      seoDescription: "Slack review: team messaging platform with channels, threads, and 2,600+ integrations. Free plan available (90-day history), Pro from $7.25/person/month.",
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
