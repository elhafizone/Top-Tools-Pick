/**
 * update-batch-2.ts
 * Real content + pricing for: 1password, ahrefs, linear, bitwarden
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/update-batch-2.ts
 */
import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();

const TODAY = new Date("2026-09-22");

type Plan = {
  name: string;
  priceAmount?: number | null;
  currency?: string;
  billingPeriod?: string;
  priceLabel: string;
  description?: string;
};

type ProductData = {
  slug: string;
  name: string;
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

const products: ProductData[] = [
  {
    slug: "1password",
    name: "1Password",
    shortDescription:
      "Password manager with end-to-end encryption, Watchtower breach alerts, and cross-device autofill.",
    description:
      "1Password is a commercial password manager trusted by over 200,000 businesses and millions of individuals. It stores passwords, passkeys, credit cards, secure notes, and SSH keys in an end-to-end encrypted vault. The Watchtower feature alerts you to compromised websites, weak passwords, and data breaches. 1Password works across macOS, Windows, Linux, iOS, and Android, and integrates with Chrome, Firefox, Edge, Brave, and Safari. For teams, it adds SSO integration with Okta and Entra ID, role-based vault sharing, and developer tools for SSH key signing and CLI workflows. Business accounts include a free Families plan for every team member.",
    websiteUrl: "https://1password.com",
    logoUrl: "/tool-logos/1password.avif",
    pricingModel: PricingModel.SUBSCRIPTION,
    hasFreePlan: false,
    hasFreeTrial: true,
    keyFeatures: [
      "End-to-end encrypted vault for passwords, passkeys, and secure notes",
      "Watchtower breach monitoring for compromised accounts and weak passwords",
      "Cross-platform autofill on Mac, Windows, Linux, iOS, and Android",
      "Passkey support for passwordless login on supported sites",
      "Secure sharing with anyone, even non-1Password users",
      "Business SSO integration with Okta, Entra ID, OneLogin, and Duo",
      "Developer tools: SSH key signing, Git commit signing, CLI, and SDKs",
    ].join("\n"),
    bestFor:
      "Individuals and teams who want a polished, commercially supported password manager with strong business SSO and developer tools",
    notFor:
      "Users who need a completely free long-term plan or prefer open-source software with self-hosting options",
    verdict:
      "1Password sets the standard for commercial password managers. Watchtower security alerts, a clean UI, and deep business integrations make it the go-to choice for teams that need more than a basic vault—though Bitwarden is a better fit if you want free or open-source.",
    seoTitle: "1Password Review: Pricing, Features & Plans",
    seoDescription:
      "1Password review: end-to-end encrypted vault, Watchtower breach alerts, and cross-platform autofill. Individual plans from $2.99/month with a 14-day free trial.",
    plans: [
      {
        name: "Individual",
        priceAmount: 2.99,
        currency: "USD",
        billingPeriod: "monthly (billed annually)",
        priceLabel: "$2.99/month (billed annually)",
        description: "For one person. Passwords, passkeys, Watchtower alerts, autofill, and 1 GB storage.",
      },
      {
        name: "Families",
        priceAmount: 4.49,
        currency: "USD",
        billingPeriod: "monthly (billed annually)",
        priceLabel: "$4.49/month (billed annually)",
        description: "Up to 5 family members. Shared vaults, individual private vaults, and admin controls.",
      },
      {
        name: "Teams Starter Pack",
        priceAmount: 24.95,
        currency: "USD",
        billingPeriod: "monthly (billed annually)",
        priceLabel: "$24.95/month flat (up to 10 members)",
        description: "Flat-rate plan for small teams. Role-based permissions, SSO, and shared vaults.",
      },
      {
        name: "Business",
        priceAmount: 8.99,
        currency: "USD",
        billingPeriod: "per user/month (billed annually)",
        priceLabel: "$8.99/user/month (billed annually)",
        description: "Per-seat plan for growing teams. Okta/Entra ID SSO, Watchtower, audit logs, and developer tools.",
      },
      {
        name: "Enterprise",
        priceAmount: null,
        currency: "USD",
        billingPeriod: "custom",
        priceLabel: "Custom pricing",
        description: "Custom contracts, dedicated support, and advanced compliance features.",
      },
    ],
  },
  {
    slug: "ahrefs",
    name: "Ahrefs",
    shortDescription:
      "Professional SEO toolset for keyword research, backlink analysis, site auditing, and rank tracking.",
    description:
      "Ahrefs is an all-in-one SEO platform powered by one of the internet's largest web crawlers. Its backlink index covers over 10 trillion links across the web. The core toolset includes Keywords Explorer with data for 170+ countries, Site Explorer for organic traffic and backlink analysis of any domain, Site Audit for technical SEO crawling, Rank Tracker for weekly position monitoring, and Content Explorer for finding high-performing content by topic. Ahrefs Free is a permanent free tier that gives verified site owners limited access to Site Explorer and Site Audit without a credit card. Paid plans start at $129/month for small businesses and scale to enterprise contracts for large agencies.",
    websiteUrl: "https://ahrefs.com",
    logoUrl: "/tool-logos/ahrefs.avif",
    pricingModel: PricingModel.FREEMIUM,
    hasFreePlan: true,
    hasFreeTrial: false,
    keyFeatures: [
      "Site Explorer with organic traffic estimates, backlink analysis, and ranking pages for any domain",
      "Keywords Explorer with 10+ billion keywords across 170+ countries",
      "Site Audit for technical SEO with monthly crawl credits",
      "Rank Tracker for weekly keyword position monitoring",
      "Content Explorer to find top-performing content by topic for link building",
      "Ahrefs Free permanent plan for verified site owners",
      "API and MCP server access on all paid plans",
    ].join("\n"),
    bestFor:
      "SEO professionals, agencies, and in-house marketing teams who need deep backlink analysis and keyword research at scale",
    notFor:
      "Beginners who only need a basic rank tracker, or content marketers who do not need deep technical SEO data",
    verdict:
      "Ahrefs is one of the two dominant professional SEO platforms. Its backlink database and crawler are best-in-class, and Keywords Explorer is among the most accurate keyword research tools available. The $129/month starting price is steep for solo bloggers, but for agencies and serious SEOs the data quality justifies the cost.",
    seoTitle: "Ahrefs Review: Pricing, Features & Plans",
    seoDescription:
      "Ahrefs review: professional SEO toolset with industry-leading backlink analysis, keyword research, and site audit. Plans from $129/month.",
    plans: [
      {
        name: "Ahrefs Free",
        priceAmount: 0,
        currency: "USD",
        billingPeriod: null,
        priceLabel: "Free (verified site owners only)",
        description: "Limited Site Explorer and Site Audit access for verified site owners. No credit card required.",
      },
      {
        name: "Lite",
        priceAmount: 129,
        currency: "USD",
        billingPeriod: "monthly (billed annually)",
        priceLabel: "$129/month (billed annually)",
        description: "5 projects, 750 tracked keywords, 6 months of historical data. Best for small businesses.",
      },
      {
        name: "Standard",
        priceAmount: 249,
        currency: "USD",
        billingPeriod: "monthly (billed annually)",
        priceLabel: "$249/month (billed annually)",
        description: "20 projects, 2,000 tracked keywords, 2 years of historical data. Includes Content Explorer.",
      },
      {
        name: "Advanced",
        priceAmount: 449,
        currency: "USD",
        billingPeriod: "monthly (billed annually)",
        priceLabel: "$449/month (billed annually)",
        description: "50 projects, 5,000 tracked keywords, 5 years of historical data. For lean in-house teams.",
      },
      {
        name: "Enterprise",
        priceAmount: 1499,
        currency: "USD",
        billingPeriod: "monthly (billed annually)",
        priceLabel: "From $1,499/month (annual commitment)",
        description: "Uncapped API access, SSO, custom limits, and dedicated account management.",
      },
    ],
  },
  {
    slug: "linear",
    name: "Linear",
    shortDescription:
      "Keyboard-first issue tracker and project management tool built for speed and software engineering teams.",
    description:
      "Linear is an issue tracker and project management platform designed for software teams who value speed and clarity. It loads near-instantly, uses keyboard-first shortcuts, and syncs in real time. Linear organizes work into issues, cycles (time-boxed sprints), projects, and roadmap initiatives that span teams. The free plan supports unlimited members with 2 teams and 250 issues—enough for early-stage startups. The Business plan adds private teams, guest access, Triage Intelligence for AI-assisted issue routing, and Linear Insights for workload analytics. Linear integrates with GitHub, GitLab, Figma, Slack, Zendesk, and dozens more tools. Linear Agent can automatically triage, assign, and update issues.",
    websiteUrl: "https://linear.app",
    logoUrl: "/tool-logos/linear.avif",
    pricingModel: PricingModel.FREEMIUM,
    hasFreePlan: true,
    hasFreeTrial: false,
    keyFeatures: [
      "Keyboard-first, near-instant UI with real-time sync and offline support",
      "Issues, cycles (sprints), projects, and cross-team initiatives in one workspace",
      "Linear Agent and Triage Intelligence for AI-assisted issue routing",
      "GitHub and GitLab integration with automatic branch creation and PR linking",
      "Linear Insights for team velocity, workload, and cycle time analytics",
      "Slack and email intake for turning conversations into tracked issues",
      "Free plan with unlimited members for early-stage teams",
    ].join("\n"),
    bestFor:
      "Software engineering teams who want a fast, focused issue tracker with strong GitHub integration and minimal project management overhead",
    notFor:
      "Non-technical teams, project managers running waterfall workflows, or teams needing heavy resource management and time-tracking built in",
    verdict:
      "Linear has earned its reputation as the issue tracker software teams actually enjoy using. The speed and keyboard shortcuts alone make it worth trying; the cycle and roadmap features make it a complete PM platform for engineering. Asana and Jira handle more complex cross-functional work, but for pure engineering velocity Linear wins.",
    seoTitle: "Linear Review: Pricing, Features & Plans",
    seoDescription:
      "Linear review: keyboard-first issue tracking for software teams with free unlimited members. Basic plan from $10/user per month.",
    plans: [
      {
        name: "Free",
        priceAmount: 0,
        currency: "USD",
        billingPeriod: null,
        priceLabel: "Free forever",
        description: "Unlimited members, 2 teams, 250 issues, and core issue tracking features.",
      },
      {
        name: "Basic",
        priceAmount: 10,
        currency: "USD",
        billingPeriod: "per user/month (billed annually)",
        priceLabel: "$10/user/month (billed annually)",
        description: "Unlimited issues and file uploads, 5 teams, and admin roles.",
      },
      {
        name: "Business",
        priceAmount: 16,
        currency: "USD",
        billingPeriod: "per user/month (billed annually)",
        priceLabel: "$16/user/month (billed annually)",
        description: "Unlimited teams, private teams, guest access, Triage Intelligence, Linear Insights, and Loops.",
      },
      {
        name: "Enterprise",
        priceAmount: null,
        currency: "USD",
        billingPeriod: "annual",
        priceLabel: "Custom pricing",
        description: "SAML/SCIM, granular admin controls, enterprise-grade security, and priority support.",
      },
    ],
  },
  {
    slug: "bitwarden",
    name: "Bitwarden",
    shortDescription:
      "Open-source password manager with AES-256 encryption, unlimited free tier, and optional self-hosting.",
    description:
      "Bitwarden is an open-source password manager that encrypts passwords, notes, credit cards, and identities with AES-256-CBC end-to-end encryption. Unlike most competitors, Bitwarden publishes all source code publicly and allows self-hosting on your own servers. The free tier offers unlimited passwords across unlimited devices—a rare combination in the industry. Bitwarden Send enables encrypted direct sharing of files and text with anyone. The Premium plan adds an integrated TOTP authenticator for two-factor code generation, vault health reports, emergency access for trusted contacts, and file attachments for $1.65/month. The Families plan covers six people for under $4/month. Regular third-party audits verify the security of the codebase.",
    websiteUrl: "https://bitwarden.com",
    logoUrl: "/tool-logos/bitwarden.svg",
    pricingModel: PricingModel.FREEMIUM,
    hasFreePlan: true,
    hasFreeTrial: false,
    keyFeatures: [
      "AES-256 end-to-end encrypted vault for passwords, notes, and identities",
      "Free unlimited passwords on unlimited devices, no paid tier required",
      "Open-source code with public security audits and option to self-host",
      "Integrated TOTP authenticator in Premium for two-factor code generation",
      "Bitwarden Send for encrypted direct file and text sharing",
      "Vault health reports for weak, reused, and compromised passwords",
      "Emergency access to grant trusted contacts entry to your vault",
    ].join("\n"),
    bestFor:
      "Privacy-conscious users who want open-source security, self-hosting, or the most generous free password manager available",
    notFor:
      "Teams needing polished enterprise SSO out of the box or a more refined UI comparable to 1Password",
    verdict:
      "Bitwarden is the strongest case for paying nothing—or very little. The free plan is genuinely full-featured, the source code is audited and public, and self-hosting is straightforward. Premium features like TOTP and vault health reports cost just $20/year, making it hard to beat on value.",
    seoTitle: "Bitwarden Review: Pricing, Features & Free Plan",
    seoDescription:
      "Bitwarden review: open-source AES-256 encrypted password manager with unlimited free passwords on all devices. Premium from $1.65/month.",
    plans: [
      {
        name: "Free",
        priceAmount: 0,
        currency: "USD",
        billingPeriod: null,
        priceLabel: "Free forever",
        description: "Unlimited passwords, unlimited devices, secure notes, and two-step login.",
      },
      {
        name: "Premium",
        priceAmount: 1.65,
        currency: "USD",
        billingPeriod: "monthly (billed annually at $19.80)",
        priceLabel: "$1.65/month (billed annually at $19.80/year)",
        description: "Integrated TOTP authenticator, vault health reports, emergency access, and 5 GB file attachments.",
      },
      {
        name: "Families",
        priceAmount: 3.99,
        currency: "USD",
        billingPeriod: "monthly (billed annually at $47.88)",
        priceLabel: "$3.99/month (up to 6 users, billed annually)",
        description: "Six Premium accounts with unlimited vault sharing and organization storage.",
      },
    ],
  },
];

async function main() {
  let updated = 0;
  let failed = 0;

  for (const product of products) {
    const { slug, plans, ...data } = product;
    try {
      await prisma.product.update({
        where: { slug },
        data: {
          ...data,
          lastReviewedAt: TODAY,
          pricingPlans: {
            deleteMany: {},
            create: plans.map((p, i) => ({ ...p, sortOrder: i })),
          },
        },
      });
      console.log(`  ✓ ${product.name.padEnd(14)} (${plans.length} plans)`);
      updated++;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`  ✗ ${product.name}: ${msg}`);
      failed++;
    }
  }

  console.log(`\nDone — updated ${updated} / ${products.length} products.${failed ? ` ${failed} failed.` : ""}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
