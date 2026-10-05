/**
 * Seeds 5 high-traffic comparison articles targeting popular "X vs Y" searches.
 * Run: node prisma/seed-comparison-articles.mjs
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const articles = [
  {
    slug: 'notion-vs-obsidian',
    title: 'Notion vs Obsidian: Which Note-Taking App Is Right for You?',
    excerpt: 'Notion and Obsidian both promise to organize your thinking, but they take completely different approaches. Here is how to pick the right one.',
    topic: 'comparisons',
    seoTitle: 'Notion vs Obsidian (2025): Full Comparison — Features, Price, Verdict',
    seoDescription: 'Notion vs Obsidian compared side by side. Features, pricing, offline access, and who each tool is really built for.',
    content: `Notion and Obsidian are two of the most talked-about note-taking tools in 2025, but they solve different problems. Choosing the wrong one wastes weeks of setup time.

## What Notion Does Well

Notion is a connected workspace. You get databases, kanban boards, wikis, and docs all in one place. Teams love it because everything is shareable, commentable, and linkable. The free plan is generous, and collaboration is built in from day one.

If you need to manage a project, track tasks, and write documentation in the same tool — Notion handles all of it.

**Best for:** Teams, content creators, project managers, anyone who works with others.

## What Obsidian Does Well

Obsidian is built around your local files. Everything you write is stored as plain Markdown on your own device — no cloud lock-in, no subscriptions required for core features, and no data leaving your machine.

Its killer feature is the graph view: a visual map of how your notes link to each other. Writers and researchers who build long-term knowledge bases swear by it.

**Best for:** Researchers, writers, students, privacy-conscious users, and anyone building a personal knowledge base (PKB).

## Head-to-Head Comparison

| Feature | Notion | Obsidian |
|---------|--------|----------|
| Price (free tier) | Generous | Free for personal use |
| Collaboration | Built-in | Plugin-based (Obsidian Sync paid) |
| Offline access | Limited | Full offline |
| Data ownership | Notion's servers | Your local files |
| Learning curve | Low | Medium |
| Databases | Yes | No (plugins only) |
| Mobile app | Yes | Yes |

## The Verdict

**Choose Notion** if you work with a team, need databases, or want everything in one place without technical setup.

**Choose Obsidian** if you are a solo user who values owning your data, needs full offline access, or is building a long-term knowledge base.

They are not really competing for the same user. Many people use both: Obsidian for personal thinking, Notion for team work.`,
    products: ['notion', 'obsidian'],
  },
  {
    slug: 'xero-vs-quickbooks',
    title: 'Xero vs QuickBooks: Which Accounting Software Should You Use?',
    excerpt: 'QuickBooks is the default choice for most small businesses, but Xero beats it on some key points. Here is an honest breakdown.',
    topic: 'comparisons',
    seoTitle: 'Xero vs QuickBooks (2025): Pricing, Features, and Who Should Use Which',
    seoDescription: 'Xero vs QuickBooks compared honestly. Pricing, user limits, payroll, invoicing, and the verdict for small businesses in 2025.',
    content: `QuickBooks has dominated small business accounting for decades. Xero has been quietly eating into that lead. If you are choosing between them today, the decision is closer than most people think.

## QuickBooks Online at a Glance

QuickBooks is the most widely used accounting software in the US. Your accountant almost certainly knows it. It covers invoicing, expense tracking, payroll, and reporting — and integrates with hundreds of apps.

The downside: plans limit the number of users, and the price climbs fast as your team grows. The Simple Start plan allows only one user.

**Best for:** US-based businesses, solopreneurs, companies with an existing QuickBooks accountant.

## Xero at a Glance

Xero's biggest advantage is simple: **unlimited users on every plan**. No per-seat charge. A small team of five costs the same as a team of twenty.

Xero is also stronger on bank reconciliation and multi-currency support, which matters for businesses that deal with international clients.

**Best for:** Growing teams, international businesses, businesses outside the US, companies switching away from per-user pricing.

## Side-by-Side

| Feature | Xero | QuickBooks |
|---------|------|-----------|
| Starting price | ~$15/mo | ~$30/mo |
| Users included | Unlimited | 1 on base plan |
| Payroll | Add-on | Built-in (US) |
| Multi-currency | Yes (higher plans) | Yes (Plus+) |
| Mobile app | Good | Very good |
| Accountant adoption (US) | Growing | Dominant |
| Inventory tracking | Basic | Better |

## The Verdict

**Choose QuickBooks** if you are US-based and your accountant already uses it. The ecosystem and local support are hard to beat.

**Choose Xero** if you have more than two users, operate internationally, or want to avoid the per-seat pricing trap. At team size, Xero is almost always cheaper.

If you are just starting out, try both free trials before committing. Switching accounting software later is painful.`,
    products: ['xero', 'quickbooks'],
  },
  {
    slug: 'slack-vs-microsoft-teams',
    title: 'Slack vs Microsoft Teams: Which Team Chat App Wins in 2025?',
    excerpt: 'Slack invented the modern team chat category. Microsoft Teams came later and now has more daily users. Which one should your team actually use?',
    topic: 'comparisons',
    seoTitle: 'Slack vs Microsoft Teams (2025): Features, Pricing, and the Real Difference',
    seoDescription: 'Slack vs Microsoft Teams: an honest comparison of features, pricing, integrations, and which one works better for different team types.',
    content: `Slack and Microsoft Teams are the two dominant team communication tools. Choosing between them mostly comes down to one question: what software does your team already use?

## Where Slack Wins

Slack was built for communication first. The interface is cleaner, the search is faster, and the third-party integration library (with over 2,400 apps) is unmatched. Slack threads, channels, and huddles feel intuitive in a way that Teams took years to match.

If your team is mostly using non-Microsoft tools — Google Workspace, Notion, Figma, GitHub — Slack fits more naturally.

**Best for:** Tech startups, product teams, companies on Google Workspace, teams with developers.

## Where Microsoft Teams Wins

Teams is bundled with Microsoft 365. If you already pay for Office, Teams costs you nothing extra. The integration with Word, Excel, SharePoint, and Outlook is seamless in a way Slack can never fully replicate.

Video meetings in Teams are also more polished than Slack's huddles, which matters for larger organizations.

**Best for:** Enterprises, companies on Microsoft 365, education, regulated industries already in the Microsoft ecosystem.

## Head-to-Head

| Feature | Slack | Microsoft Teams |
|---------|-------|----------------|
| Free tier | 90-day message history | Unlimited (with Microsoft account) |
| Video calls | Huddles (basic) | Full meeting suite |
| File storage | 5GB (free) | 10GB+ (with M365) |
| Third-party apps | 2,400+ | ~700 |
| Microsoft Office integration | Good | Native |
| Search | Excellent | Improving |
| Price (paid) | From $7.25/user/mo | Included in M365 |

## The Verdict

**Choose Slack** if your team is small-to-medium, values UX, and lives outside the Microsoft ecosystem.

**Choose Microsoft Teams** if your company already pays for Microsoft 365 — there is no reason to pay for Slack on top of it.

The honest truth: for most enterprise buyers, Teams wins on price alone. For startups and tech teams, Slack wins on experience.`,
    products: ['slack', 'microsoft-teams'],
  },
  {
    slug: 'hubspot-vs-salesforce',
    title: 'HubSpot vs Salesforce: Which CRM Is Right for Your Business?',
    excerpt: 'Salesforce is the enterprise CRM standard. HubSpot is what most growing businesses actually use. Here is how to decide between them.',
    topic: 'comparisons',
    seoTitle: 'HubSpot vs Salesforce (2025): CRM Comparison — Features, Price, and Verdict',
    seoDescription: 'HubSpot vs Salesforce compared. Which CRM fits your team size, budget, and sales process? An honest 2025 breakdown.',
    content: `HubSpot and Salesforce are both CRMs, but they target different stages of a business. Getting this choice wrong is expensive — switching CRMs is one of the most painful migrations a sales team can go through.

## HubSpot at a Glance

HubSpot started as a marketing tool and grew into a full CRM suite. The free tier is genuinely useful — contacts, deals, email tracking, and a basic pipeline at no cost.

The platform is designed to be adopted quickly. Most sales teams are productive in HubSpot within days. The marketing, sales, and service hubs integrate natively, so a deal moving from lead to customer stays in one system.

**Best for:** SMBs, startups, teams that want to get up and running fast, companies that need marketing and CRM in one place.

## Salesforce at a Glance

Salesforce is the world's largest CRM and the standard for enterprise sales. It can model almost any sales process, any industry, any complexity. If you can describe your workflow, Salesforce can probably be configured to handle it.

That power comes with cost: Salesforce requires dedicated admin time, implementation projects take months, and the pricing is steep without negotiation.

**Best for:** Enterprises, companies with complex sales processes, teams with dedicated CRM admins, businesses that need deep custom workflows.

## Side-by-Side

| Feature | HubSpot | Salesforce |
|---------|---------|-----------|
| Free tier | Yes (genuinely useful) | No |
| Setup time | Days | Months |
| Customization | Good | Exceptional |
| AI features | Breeze AI | Einstein AI |
| Reporting | Good | Advanced |
| Integrations | 1,000+ | 3,000+ |
| Starting price (paid) | $15/user/mo | $25/user/mo |
| Admin required | No | Usually yes |

## The Verdict

**Choose HubSpot** if you are under 200 employees, want to move fast, or need marketing and CRM in one tool without a large implementation budget.

**Choose Salesforce** if you have a dedicated RevOps team, complex enterprise sales cycles, or requirements that HubSpot's structure cannot flex to meet.

A common path: start on HubSpot, migrate to Salesforce when you hit its ceiling. Many companies never hit that ceiling.`,
    products: ['hubspot', 'salesforce'],
  },
  {
    slug: 'shopify-vs-woocommerce',
    title: 'Shopify vs WooCommerce: Which E-Commerce Platform Should You Use?',
    excerpt: 'Shopify is the easiest way to launch an online store. WooCommerce gives you more control. Which one wins for your situation?',
    topic: 'comparisons',
    seoTitle: 'Shopify vs WooCommerce (2025): Full Comparison for Online Store Owners',
    seoDescription: 'Shopify vs WooCommerce compared. Ease of use, pricing, control, scalability — and which platform suits your store best in 2025.',
    content: `Shopify and WooCommerce power a huge share of the world's online stores, but they represent fundamentally different philosophies about how software should work.

## Shopify at a Glance

Shopify is a hosted platform. You pay a monthly fee, Shopify handles servers, security, and updates, and you get a fully functional store without touching code. The setup experience is the best in the industry.

The tradeoff: Shopify charges a transaction fee (unless you use Shopify Payments) and limits customization at the deeper levels. You work within their system.

**Best for:** First-time store owners, dropshippers, brands that want to launch fast, businesses without technical teams.

## WooCommerce at a Glance

WooCommerce is a free WordPress plugin. You own everything — your data, your code, your hosting. Customization is unlimited because you control the underlying software.

The tradeoff: you are responsible for hosting, security, plugin compatibility, and updates. A broken plugin can take your store offline. You need either technical knowledge or a developer.

**Best for:** Existing WordPress users, developers, businesses that need deep customization, content-heavy stores where SEO matters most.

## Head-to-Head

| Feature | Shopify | WooCommerce |
|---------|---------|-------------|
| Monthly cost | From $29/mo | ~$10-30/mo (hosting) |
| Transaction fees | 0.5-2% (if not using Shopify Payments) | None (card processor fees only) |
| Setup difficulty | Very easy | Moderate |
| Hosting | Included | Self-managed |
| Customization | Good | Unlimited |
| Security | Managed | Your responsibility |
| SEO | Good | Excellent (WordPress) |
| Scalability | Excellent | Depends on hosting |

## The Verdict

**Choose Shopify** if you are starting out, want to focus on selling rather than managing software, and are willing to pay a premium for simplicity.

**Choose WooCommerce** if you already have a WordPress site, have technical support, need deep customization, or want to avoid transaction fees at scale.

At low volumes, both work fine. At high volumes, WooCommerce's zero transaction fees can save thousands per month — but only if you have the technical resources to manage it.`,
    products: ['shopify', 'woocommerce'],
  },
];

async function seedArticles() {
  let created = 0, skipped = 0;

  for (const a of articles) {
    const existing = await prisma.article.findUnique({ where: { slug: a.slug } });
    if (existing) { skipped++; continue; }

    // Get product IDs for linking
    const productIds = [];
    for (const slug of a.products) {
      const p = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
      if (p) productIds.push(p.id);
    }

    await prisma.article.create({
      data: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        topic: a.topic,
        seoTitle: a.seoTitle,
        seoDescription: a.seoDescription,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        author: 'TopToolsPick Editorial',
        productLinks: {
          create: productIds.map((id, i) => ({ productId: id, rank: i + 1 })),
        },
      },
    });

    created++;
    console.log(`✓ ${a.title}`);
  }

  console.log(`\nDone — created: ${created}, skipped: ${skipped}`);
}

seedArticles()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
