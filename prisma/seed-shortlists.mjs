/**
 * Seeds 10 editorial shortlists based on Google Trends search volume data.
 * Run: node prisma/seed-shortlists.mjs
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper: get product id by slug, warn if missing
async function pid(slug) {
  const p = await prisma.product.findUnique({ where: { slug }, select: { id: true, name: true } });
  if (!p) console.warn(`  ⚠ product not found: ${slug}`);
  return p ? { id: p.id, name: p.name } : null;
}

// Helper: create or skip a shortlist
async function createList({ slug, title, description, seoTitle, seoDescription, categorySlug, items }) {
  const existing = await prisma.editorialList.findUnique({ where: { slug } });
  if (existing) { console.log(`↩ skip existing: ${slug}`); return; }

  let categoryId = null;
  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug }, select: { id: true } });
    if (cat) categoryId = cat.id;
  }

  const list = await prisma.editorialList.create({
    data: {
      slug,
      title,
      description,
      seoTitle,
      seoDescription,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      categoryId,
    },
  });

  let rank = 1;
  for (const item of items) {
    const product = await pid(item.slug);
    if (!product) continue;
    await prisma.editorialListItem.create({
      data: {
        listId: list.id,
        productId: product.id,
        rank,
        award: item.award ?? null,
        rationale: item.rationale ?? null,
      },
    });
    console.log(`  #${rank} ${product.name} ${item.award ? '— ' + item.award : ''}`);
    rank++;
  }
  console.log(`✓ Created: ${title} (${rank - 1} items)\n`);
}

// ─────────────────────────────────────────────
// 1. Best Accounting Software (avg: 46 — highest)
// ─────────────────────────────────────────────
await createList({
  slug: 'best-accounting-software',
  title: 'Best Accounting Software',
  description: 'The accounting tools that actually save time — ranked by features, pricing transparency, and how well they scale from freelancer to growing business.',
  seoTitle: 'Best Accounting Software in 2026 | TopToolsPick',
  seoDescription: 'We ranked the best accounting software by features, pricing, and ease of use. Includes QuickBooks, Xero, FreshBooks, Wave, and Gusto.',
  categorySlug: 'finance-business-services',
  items: [
    { slug: 'quickbooks', award: 'Best overall', rationale: 'QuickBooks remains the gold standard for small-to-mid-size businesses. Its ecosystem of accountants, integrations, and features is unmatched — though the pricing reflects that dominance.' },
    { slug: 'xero', award: 'Best for growing teams', rationale: 'Xero shines when multiple people need access. Unlimited user seats on every plan make it the smart pick for businesses where the finance team is expanding.' },
    { slug: 'freshbooks', award: 'Best for freelancers', rationale: 'FreshBooks strips away the complexity that freelancers never need and keeps invoicing, time tracking, and expense logging genuinely simple.' },
    { slug: 'gusto', award: 'Best for payroll + accounting', rationale: 'If payroll is your main pain point, Gusto handles it better than any pure accounting tool. The HR and benefits layer makes it a serious all-in-one for teams under 50.' },
    { slug: 'wave', award: 'Best free option', rationale: 'Wave is fully free for invoicing and accounting, with no artificial limits on clients or invoices. The catch is that support and advanced reporting cost extra.' },
  ],
});

// ─────────────────────────────────────────────
// 2. Best SEO Tools (avg: 34)
// ─────────────────────────────────────────────
await createList({
  slug: 'best-seo-tools',
  title: 'Best SEO Tools',
  description: 'From keyword research to rank tracking and site audits — these are the tools professional SEOs and marketers actually rely on, ranked by depth, accuracy, and value.',
  seoTitle: 'Best SEO Tools in 2026 | TopToolsPick',
  seoDescription: 'The top SEO tools ranked: Ahrefs vs Semrush vs Google Analytics and more. Find the right tool for keyword research, audits, and rank tracking.',
  categorySlug: 'marketing-seo',
  items: [
    { slug: 'ahrefs', award: 'Best overall', rationale: "Ahrefs has the industry's most trusted backlink index and a keyword database that genuinely covers the long tail. If you can only afford one SEO tool, this is it." },
    { slug: 'semrush', award: 'Best for agencies', rationale: 'Semrush covers more ground than almost any competitor — keyword research, site audit, position tracking, social, and PPC data — making it the all-in-one choice for agencies managing multiple clients.' },
    { slug: 'google-analytics', award: 'Best free option', rationale: 'GA4 is free, deeply integrated with Google Ads, and the only tool that shows you real user behaviour on your site. The learning curve is steep but the data is unmatched at the price point.' },
    { slug: 'hotjar', award: 'Best for on-page insights', rationale: 'Hotjar answers the question SEO data cannot: why users leave. Heatmaps and session recordings make it indispensable for CRO work alongside your keyword tool.' },
    { slug: 'looker-studio', award: 'Best for reporting', rationale: 'Looker Studio (formerly Data Studio) turns your GA4 and Search Console data into polished client-ready dashboards. Free, flexible, and better than most paid reporting tools.' },
    { slug: 'amplitude', award: 'Best for product analytics', rationale: 'Amplitude goes deeper on user behaviour than traditional SEO tools — if you run a SaaS and care as much about retention as rankings, it fills a gap nothing else covers.' },
  ],
});

// ─────────────────────────────────────────────
// 3. Best Password Managers (avg: 33)
// ─────────────────────────────────────────────
await createList({
  slug: 'best-password-managers',
  title: 'Best Password Managers',
  description: 'Weak passwords are still the leading cause of breaches. These tools keep credentials safe, organised, and accessible — ranked by security, usability, and value.',
  seoTitle: 'Best Password Managers in 2026 | TopToolsPick',
  seoDescription: 'We compared the best password managers including 1Password, Bitwarden, NordVPN, and more. See which one fits your security needs.',
  categorySlug: 'cybersecurity-privacy',
  items: [
    { slug: '1password', award: 'Best overall', rationale: '1Password sets the standard for polish and cross-device usability. The Watchtower feature proactively flags compromised, reused, and weak passwords — and the family and teams plans are genuinely well-priced.' },
    { slug: 'bitwarden', award: 'Best free option', rationale: 'Bitwarden is open-source, audited, and free for individuals with no meaningful feature restrictions. The self-hosting option makes it the top pick for security-conscious power users.' },
    { slug: 'nordvpn', award: 'Best for privacy bundles', rationale: 'NordVPN bundles a password manager (NordPass) with its VPN subscription, making it the practical choice if you want both tools under one subscription and one bill.' },
    { slug: 'okta', award: 'Best for enterprise SSO', rationale: 'Okta is less a password manager and more an identity platform — but for organisations that need centralised authentication, SSO, and lifecycle management, it is the enterprise default.' },
    { slug: 'auth0', award: 'Best for developers', rationale: 'Auth0 handles authentication so developers do not have to build it. If you are shipping a product and need secure login flows without reinventing the wheel, Auth0 is the fastest credible path.' },
  ],
});

// ─────────────────────────────────────────────
// 4. Best Web Hosting (avg: 29)
// ─────────────────────────────────────────────
await createList({
  slug: 'best-web-hosting',
  title: 'Best Web Hosting',
  description: 'The hosting platforms worth paying for — ranked by speed, reliability, developer experience, and what you actually get for the price.',
  seoTitle: 'Best Web Hosting in 2026 | TopToolsPick',
  seoDescription: 'Compare the best web hosting providers: Kinsta, Hostinger, Cloudways, Netlify, and more. Find the right host for your speed and budget.',
  categorySlug: 'website-hosting',
  items: [
    { slug: 'kinsta', award: 'Best overall', rationale: 'Kinsta sits on Google Cloud and delivers consistently fast load times with a dashboard that makes WordPress management intuitive. Premium-priced, but the performance and support justify it.' },
    { slug: 'cloudways', award: 'Best managed cloud hosting', rationale: 'Cloudways lets you run on AWS, Google Cloud, or DigitalOcean without managing the server yourself. The flexibility and price-to-performance ratio beat most managed hosting competitors.' },
    { slug: 'hostinger', award: 'Best value', rationale: 'Hostinger offers genuinely fast shared hosting at prices that undercut most competitors without cutting corners on uptime. The best starting point for new sites on a budget.' },
    { slug: 'netlify', award: 'Best for frontend developers', rationale: 'Netlify made deploying static sites and JAMstack applications trivially easy. Git-push deployments, preview URLs, and edge functions make it the developer default for modern frontend projects.' },
    { slug: 'vercel', award: 'Best for Next.js', rationale: 'Vercel built Next.js, and it shows — deployments are instant, edge network performance is top-tier, and the DX is unmatched. The free tier is generous enough for most personal and small commercial projects.' },
    { slug: 'squarespace', award: 'Best for creative businesses', rationale: 'Squarespace templates are the best-looking out of the box of any builder. If aesthetics matter and you do not want to touch code, Squarespace is worth the premium over Wix.' },
    { slug: 'wordpress', award: 'Best for content sites', rationale: 'WordPress powers 43% of the web for good reason — the plugin and theme ecosystem is incomparable. Self-hosted WordPress paired with a decent host gives you total ownership and flexibility.' },
  ],
});

// ─────────────────────────────────────────────
// 5. Best Automation Tools (avg: 28)
// ─────────────────────────────────────────────
await createList({
  slug: 'best-automation-tools',
  title: 'Best Workflow Automation Tools',
  description: 'The tools that connect your apps and eliminate repetitive work — ranked by ease of setup, integration breadth, and how far you can push them without writing code.',
  seoTitle: 'Best Workflow Automation Tools in 2026 | TopToolsPick',
  seoDescription: 'Compare Zapier vs Make and other top automation tools. Find the best no-code workflow automation platform for your team.',
  categorySlug: 'business-productivity',
  items: [
    { slug: 'zapier', award: 'Best overall', rationale: 'Zapier connects 6,000+ apps and is the easiest to set up of any automation platform. The no-code interface means non-technical teams can build real workflows in minutes, not hours.' },
    { slug: 'make', award: 'Best for complex workflows', rationale: 'Make (formerly Integromat) handles multi-step, branching logic and data transformations that would be painful in Zapier. Significantly cheaper at higher operation volumes and better for technical users.' },
    { slug: 'airtable', award: 'Best database automation', rationale: "Airtable's built-in automations are underrated — if your data already lives there, triggering actions from record changes is faster than routing through a separate tool like Zapier." },
    { slug: 'monday-com', award: 'Best for team workflows', rationale: "Monday's automation recipes are designed for operations teams, not developers. If your automations are mostly about moving tasks, updating statuses, and notifying people, it handles it natively." },
    { slug: 'github', award: 'Best for developer automation', rationale: 'GitHub Actions makes CI/CD, deployment, and code quality automation accessible without leaving your repository. For engineering teams, it replaces many third-party tools in a single platform.' },
  ],
});

// ─────────────────────────────────────────────
// 6. Best Project Management Tools (avg: 23)
// ─────────────────────────────────────────────
await createList({
  slug: 'best-project-management-tools',
  title: 'Best Project Management Tools',
  description: 'The tools that keep work organised and teams aligned — ranked by flexibility, collaboration features, and how well they adapt as your team grows.',
  seoTitle: 'Best Project Management Tools in 2026 | TopToolsPick',
  seoDescription: 'We ranked the best project management tools: Notion, Asana, ClickUp, Monday.com, Jira, and more. Find the right tool for your team size and workflow.',
  categorySlug: 'business-productivity',
  items: [
    { slug: 'notion', award: 'Best overall', rationale: 'Notion replaces four or five tools at once — docs, wikis, databases, tasks, and project tracking all in one workspace. The flexibility is unmatched, though it takes time to configure for your workflow.' },
    { slug: 'asana', award: 'Best for structured teams', rationale: 'Asana brings clarity to large, cross-functional projects. Timeline views, dependency tracking, and workload management make it the go-to for teams that run planned, phased projects.' },
    { slug: 'linear', award: 'Best for engineering teams', rationale: 'Linear is built for software teams and it shows — cycle planning, GitHub sync, and a keyboard-first design make it the fastest project tool for engineers who live in their editor.' },
    { slug: 'clickup', award: 'Best all-in-one', rationale: "ClickUp packs more features than almost any competitor. If you want one tool to handle tasks, docs, goals, time tracking, and chat — and you're willing to invest setup time — nothing covers more ground." },
    { slug: 'monday-com', award: 'Best for visual planning', rationale: "Monday.com's visual boards and custom automations make it the easiest tool to adopt across non-technical teams. Operations, marketing, and HR teams tend to stick with it once they start." },
    { slug: 'jira', award: 'Best for agile development', rationale: 'Jira is the default for engineering teams running Scrum or Kanban at scale. The depth of its sprint planning, reporting, and Atlassian integrations is unmatched — even if the UI intimidates newcomers.' },
    { slug: 'trello', award: 'Best for simple task tracking', rationale: 'Trello is the fastest way to get a team tracking tasks without any training. Kanban boards, Power-Ups, and a free tier that covers most small teams make it the no-fuss default.' },
    { slug: 'airtable', award: 'Best for data-driven projects', rationale: 'When your project is really a structured dataset — a content calendar, a product roadmap, a launch tracker — Airtable handles it better than any traditional task manager.' },
  ],
});

// ─────────────────────────────────────────────
// 7. Best CRM Software (avg: 16)
// ─────────────────────────────────────────────
await createList({
  slug: 'best-crm-software',
  title: 'Best CRM Software',
  description: 'The CRM tools that actually help close deals and retain customers — ranked by pipeline management, automation depth, and how well they scale with your sales team.',
  seoTitle: 'Best CRM Software in 2026 | TopToolsPick',
  seoDescription: 'Compare the best CRM software: HubSpot, Salesforce, Intercom, Zendesk, and Freshdesk. Find the right CRM for your team size and sales process.',
  categorySlug: 'business-productivity',
  items: [
    { slug: 'hubspot', award: 'Best overall', rationale: "HubSpot's free CRM is the best starting point for most companies — and the paid tiers scale into a full marketing and sales platform. The all-in-one pitch is real here in a way it isn't for most competitors." },
    { slug: 'salesforce', award: 'Best for enterprise', rationale: 'Salesforce is the enterprise standard for good reason: near-infinite customisation, a massive partner ecosystem, and the ability to model even the most complex B2B sales processes. Requires dedicated admin time to get right.' },
    { slug: 'intercom', award: 'Best for SaaS companies', rationale: 'Intercom combines customer messaging, support, and product tours in one platform. For SaaS companies that want to engage users across the entire lifecycle — from trial to renewal — it covers more than a traditional CRM.' },
    { slug: 'zendesk', award: 'Best for support-led CRM', rationale: "Zendesk's strength is customer support, but its CRM layer ties ticket history to contact records cleanly. Teams where support is the primary customer relationship get more from Zendesk than a sales-first tool." },
    { slug: 'freshdesk', award: 'Best value for support teams', rationale: 'Freshdesk delivers solid ticketing, automation, and reporting at a price well below Zendesk. For growing support teams that need structure without enterprise overhead, it is the practical choice.' },
  ],
});

// ─────────────────────────────────────────────
// 8. Best Email Marketing Tools (avg: 15)
// ─────────────────────────────────────────────
await createList({
  slug: 'best-email-marketing-tools',
  title: 'Best Email Marketing Tools',
  description: 'Email still delivers the highest ROI of any digital channel. These are the platforms that earn it — ranked by deliverability, automation depth, and value at scale.',
  seoTitle: 'Best Email Marketing Tools in 2026 | TopToolsPick',
  seoDescription: 'Compare the best email marketing platforms: Klaviyo, Mailchimp, HubSpot, Marketo, and SendGrid. Find the right tool for your list size and goals.',
  categorySlug: 'marketing-seo',
  items: [
    { slug: 'klaviyo', award: 'Best for e-commerce', rationale: 'Klaviyo is purpose-built for e-commerce and the depth of its Shopify and WooCommerce integrations shows. Segmentation based on purchase history, browse behaviour, and predictive analytics makes it the top pick for online stores.' },
    { slug: 'hubspot', award: 'Best all-in-one', rationale: "HubSpot email marketing is strongest when you're already using HubSpot CRM — the contact data flows directly into segmentation and personalisation, removing a whole category of integration headaches." },
    { slug: 'mailchimp', award: 'Best for getting started', rationale: "Mailchimp's free tier and drag-and-drop editor remain the easiest on-ramp to email marketing. For lists under 500, it is hard to justify paying anything else — and the brand recognition among non-technical founders is unmatched." },
    { slug: 'sendgrid', award: 'Best for transactional email', rationale: 'SendGrid is the infrastructure choice — high-volume transactional emails (receipts, alerts, notifications) delivered reliably at scale. Less suitable for marketing campaigns, unbeatable for product email.' },
    { slug: 'marketo', award: 'Best for B2B marketing automation', rationale: 'Marketo is overkill for most companies but earns its place in enterprise B2B stacks. Lead scoring, multi-touch attribution, and deep Salesforce integration make it the choice when marketing ops complexity is real.' },
  ],
});

// ─────────────────────────────────────────────
// 9. Best HR Software (avg: 15)
// ─────────────────────────────────────────────
await createList({
  slug: 'best-hr-software',
  title: 'Best HR Software',
  description: 'HR tools that handle the admin so your people team can focus on people — ranked by onboarding, payroll, compliance, and how well they scale beyond 50 employees.',
  seoTitle: 'Best HR Software in 2026 | TopToolsPick',
  seoDescription: 'Compare the best HR software: Gusto, BambooHR, Workday, and more. Find the right HR platform for your team size and compliance needs.',
  categorySlug: 'business-productivity',
  items: [
    { slug: 'gusto', award: 'Best for small teams', rationale: 'Gusto handles payroll, benefits, and basic HR for teams under 50 in one clean interface. The automated tax filings alone save most small businesses hours each month.' },
    { slug: 'bamboohr', award: 'Best overall', rationale: 'BambooHR hits the sweet spot between depth and usability for mid-size companies. Onboarding workflows, performance reviews, and people analytics are all genuinely useful — not just checkboxes.' },
    { slug: 'workday', award: 'Best for enterprise', rationale: 'Workday is the enterprise HCM default for companies with complex org structures, global payroll, and compliance requirements. Significant implementation time and cost, but the depth is real.' },
    { slug: 'salesforce', award: 'Best for HR + CRM integration', rationale: "Salesforce isn't an HR tool natively, but its platform has become the backbone of many enterprise HR tech stacks via Service Cloud and Slack — particularly for companies already standardised on Salesforce." },
  ],
});

// ─────────────────────────────────────────────
// 10. Best E-commerce Platforms (avg: 7 but high buyer intent)
// ─────────────────────────────────────────────
await createList({
  slug: 'best-ecommerce-platforms',
  title: 'Best E-commerce Platforms',
  description: 'The platforms that power online stores — ranked by ease of setup, transaction fees, scalability, and how much they get out of your way when business grows.',
  seoTitle: 'Best E-commerce Platforms in 2026 | TopToolsPick',
  seoDescription: 'We compared Shopify, WooCommerce, and BigCommerce to help you pick the right e-commerce platform for your store size and budget.',
  categorySlug: 'e-commerce',
  items: [
    { slug: 'shopify', award: 'Best overall', rationale: 'Shopify is the default for new e-commerce businesses for a reason: fast setup, a massive app store, and Shopify Payments removing the need for a third-party gateway. The platform scales from side project to enterprise (Shopify Plus).' },
    { slug: 'woocommerce', award: 'Best for WordPress sites', rationale: "WooCommerce is free and gives you total ownership of your store data. If your site is already on WordPress, it is the most natural extension — and with the right hosting, it matches Shopify on performance." },
    { slug: 'bigcommerce', award: 'Best for scaling stores', rationale: "BigCommerce charges no transaction fees and imposes no artificial limits on SKUs or staff accounts. For stores with complex catalogues or high order volumes, it's more cost-effective than Shopify at scale." },
  ],
});

console.log('All shortlists seeded successfully.');
await prisma.$disconnect();
