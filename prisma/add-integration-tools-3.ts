// Batch 3: Google Drive, Google Workspace, Make, Squarespace, Xero, Gusto, Typeform
import { PrismaClient, PricingModel, PublicationStatus } from '@prisma/client'

const prisma = new PrismaClient()
const CDN = 'https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos'

const CATEGORIES = {
  business: 'cmtzal7l10004hl6cad0e0vx3',
  dev: 'cmtzal7n20005hl6czrtj6745',
  finance: 'cmtzal7uz0009hl6csu95c0i5',
  marketing: 'cmtzal7h30002hl6ccnboa82i',
  hosting: 'cmtzal7f20001hl6c164evlap',
}

const tools = [
  {
    name: 'Google Drive',
    slug: 'google-drive',
    categoryId: CATEGORIES.business,
    websiteUrl: 'https://drive.google.com',
    logoUrl: `${CDN}/google-drive.svg`,
    pricingModel: PricingModel.FREEMIUM,
    hasFreePlan: true,
    hasFreeTrial: false,
    rating: 4.6,
    editorialScore: 88,
    shortDescription: 'Google\'s cloud storage and collaboration platform with 15GB free — the backbone of the Google Workspace ecosystem.',
    description: `Google Drive is Google's cloud storage and collaboration platform, offering 15GB of free storage shared across Drive, Gmail, and Google Photos for every Google account. It is the foundation of the Google Workspace ecosystem, providing the storage layer for Docs, Sheets, Slides, and Forms.

Files stored in Google Drive sync across devices via the desktop app and are accessible via web browser anywhere. Sharing is flexible: view-only links, comment-only links, editor access, or restricted to specific Google accounts. Version history lets users restore any previous version of a file.

Google Workspace (formerly G Suite) integrates Drive tightly with collaborative editing: multiple users can edit a Docs, Sheets, or Slides file simultaneously with real-time cursors and comments. This replaced the email-attachment workflow for many organizations. Shared drives (previously Team Drives) enable team-level file storage with centralized ownership separate from individual accounts.

Google One is the consumer paid storage tier: 100GB for $1.99/month, 200GB for $2.99/month, 2TB for $9.99/month. Google Workspace Business plans include additional Drive storage (from 30GB/user on Starter to 5TB/user on Business Plus) with admin controls, audit logs, and DLP.

The 15GB free tier is the most generous among major cloud storage providers (Dropbox gives 2GB, OneDrive gives 5GB), making Google Drive the default personal cloud storage for most internet users.`,
    pros: `15GB free tier is the most generous in cloud storage — enough for years of personal file storage and email
Real-time collaborative editing with Docs, Sheets, and Slides eliminates the need to email file attachments
Universal browser access — view and edit files on any device without installing apps
Deep integration with Gmail, Calendar, Meet, and all Google Workspace apps`,
    cons: `15GB is shared with Gmail and Google Photos — heavy Gmail users may hit limits faster than expected
Google Workspace pricing at scale becomes comparable to Microsoft 365, which offers more per-seat storage
Offline access requires the Chrome extension and deliberate setup — not as seamless as Dropbox`,
    bestFor: 'Individuals and teams using Google Workspace — Docs, Sheets, Slides, and Gmail — who want a unified file storage layer with real-time collaboration and generous free storage',
    notFor: 'Teams deeply embedded in Microsoft 365 who need SharePoint-style file governance and OneDrive integration; creative professionals who need version history for large binary files (Dropbox handles this better)',
    keyFeatures: `15GB Free Storage: Shared across Drive, Gmail, and Google Photos — upgrade via Google One as needed
Collaborative Editing: Real-time co-editing in Docs, Sheets, Slides, and Forms with version history
Shared Drives: Team-owned folders with centralized file ownership — files persist when members leave
AI Search: Find files by content, not just filename — Drive searches inside PDFs, Docs, and images
Drive for Desktop: Sync any Drive content to your local machine for offline access
Google Workspace Integration: Seamless connection to Gmail, Calendar, Meet, Chat, and all Google apps`,
    integrations: `Gmail\nGoogle Docs\nGoogle Sheets\nGoogle Slides\nSlack\nZoom\nNotion\nAirtable\nZapier\nDropbox\nFigma\nCanva\nSalesforce\nHubSpot`,
    verdict: 'Google Drive is the right choice for anyone in the Google Workspace ecosystem. The 15GB free tier makes it the default personal cloud storage for most people. For teams, the decision comes down to whether you\'re more Microsoft-centric (OneDrive/SharePoint) or Google-centric — both ecosystems are mature, and switching costs are high once you pick one.',
    seoTitle: 'Google Drive: Pricing, Storage Plans & Features | TopToolsPick',
    seoDescription: 'Google Drive offers 15GB free storage. Google One from $1.99/month. See Drive features, Workspace integration, and how it compares to Dropbox and OneDrive.',
  },
  {
    name: 'Google Workspace',
    slug: 'google-workspace',
    categoryId: CATEGORIES.business,
    websiteUrl: 'https://workspace.google.com',
    logoUrl: `${CDN}/google-workspace.svg`,
    pricingModel: PricingModel.SUBSCRIPTION,
    hasFreePlan: false,
    hasFreeTrial: true,
    rating: 4.6,
    editorialScore: 88,
    shortDescription: 'Google\'s integrated suite of productivity tools — Gmail, Docs, Sheets, Meet, and Drive — for businesses of all sizes.',
    description: `Google Workspace (formerly G Suite) is Google's cloud-based productivity and collaboration suite, bundling Gmail, Calendar, Drive, Docs, Sheets, Slides, Meet, Chat, Forms, and Sites under a single subscription. Over 9 million businesses and 3 billion users (counting consumer Gmail) rely on Google Workspace for core work communication and document collaboration.

The suite's central advantage is tight integration: a Calendar invite in Gmail creates a Meet video link automatically; Docs, Sheets, and Slides files live in Drive with real-time collaborative editing; Chat and Spaces keep team communication connected to files and tasks. This cohesion reduces the tool-switching that fragments work across separate apps.

Gmail for Business provides custom domain email (name@yourcompany.com) with the Gmail interface, 99.9% uptime SLA, and admin controls. The admin console manages users, devices, security policies, and app access for the entire organization from one dashboard.

Google Workspace AI features (Duet AI, now rebranded as Gemini for Workspace) add draft generation in Gmail, formula suggestions in Sheets, slide generation in Slides, meeting summaries in Meet, and an AI assistant across apps — available as an add-on.

Business Starter is $6/user/month (30GB storage/user). Business Standard is $12/user/month (2TB/user) and adds recording for Meet, noise cancellation, and attendance tracking. Business Plus is $18/user/month (5TB/user) with enhanced security and eDiscovery.`,
    pros: `Tight integration across Gmail, Calendar, Drive, Docs, Meet, and Chat — everything connects natively
Real-time collaborative editing is best-in-class — no more emailed attachments, automatic version history
15GB free personal storage becomes paid per-user storage on Workspace plans — generous and scalable
Easier admin setup and maintenance than Microsoft 365 for most small business IT configurations`,
    cons: `Business Starter\'s 30GB/user storage is low for media-heavy teams — Business Standard (2TB) is the practical entry point
Requires a Google account ecosystem — harder to adopt for organizations with Windows/Active Directory infrastructure
Microsoft Office compatibility is imperfect — complex Excel formulas and PowerPoint animations can break in Sheets/Slides`,
    bestFor: 'SMBs and teams that want a fully integrated, cloud-native productivity suite with excellent collaboration, simple admin, and the Gmail interface for business email',
    notFor: 'Organizations with heavy Microsoft Office dependencies (complex Excel macros, PowerPoint templates) or with Azure Active Directory infrastructure — Microsoft 365 is a better fit',
    keyFeatures: `Gmail for Business: Custom domain email with the Gmail interface, shared inboxes, and 99.9% uptime SLA
Google Meet: Video conferencing for up to 500 participants with recording, noise cancellation, and live captions
Collaborative Docs/Sheets/Slides: Real-time co-editing with version history, comments, and suggestions
Admin Console: Centralized user management, device management, security policies, and app controls
Google Chat and Spaces: Team messaging and dedicated work spaces with file sharing and task integration
Gemini AI: AI writing in Gmail and Docs, formula suggestions in Sheets, and meeting summaries in Meet`,
    integrations: `Slack\nZoom\nSalesforce\nHubSpot\nZapier\nAsana\nMiro\nDropbox\nDocuSign\nLucidchart\nMonday.com\nNotionLinear\nFreshdesk`,
    verdict: 'Google Workspace is the right productivity suite for teams that prioritize cloud-native collaboration, simple IT administration, and tight integration across email, docs, and meetings. The $12/user/month Business Standard plan is the practical starting point. If your team relies heavily on Microsoft Office features or has Windows-centric infrastructure, Microsoft 365 will have less friction.',
    seoTitle: 'Google Workspace: Pricing, Plans & Suite Features | TopToolsPick',
    seoDescription: 'Google Workspace (Gmail, Docs, Drive, Meet) starts at $6/user/month. Business Standard from $12. See all plans, features, and how it compares to Microsoft 365.',
  },
  {
    name: 'Make',
    slug: 'make',
    categoryId: CATEGORIES.business,
    websiteUrl: 'https://www.make.com',
    logoUrl: `${CDN}/make.svg`,
    pricingModel: PricingModel.FREEMIUM,
    hasFreePlan: true,
    hasFreeTrial: false,
    rating: 4.6,
    editorialScore: 85,
    shortDescription: 'Visual automation platform (formerly Integromat) connecting 1,700+ apps — a more powerful and affordable alternative to Zapier for complex workflows.',
    description: `Make (formerly Integromat before rebranding in 2022) is a visual workflow automation platform that lets teams connect apps and automate processes through a drag-and-drop canvas interface. Where Zapier uses a linear list-based flow builder, Make uses a visual flowchart — modules (app connections) connect to each other visually, making complex workflows with branches, loops, filters, and error handling much easier to build and understand.

Make supports 1,700+ app integrations and is particularly strong for technical users who want fine-grained control: HTTP/JSON/XML modules for any REST API, data transformation with built-in functions, iterators for processing arrays, aggregators for combining data, routers for conditional branching, and error handlers for fallback logic.

Pricing is operations-based (not task-based like Zapier): the free plan provides 1,000 operations/month and 2 active scenarios. Core ($9/month) provides 10,000 operations. Pro ($16/month) provides 10,000 operations with faster execution (1-minute minimum intervals vs 5-minute on Core) and priority support. Make operations tend to go much further than Zapier tasks — a multi-step workflow counts as one task in Zapier but may use multiple operations in Make, depending on data volume.

For complex, high-volume automations — particularly API integrations, data transformation workflows, or ETL processes — Make typically costs 60-70% less than Zapier and provides significantly more control.`,
    pros: `Visual flowchart interface makes complex workflows with branches, loops, and error handlers far easier to build than Zapier\'s list model
Significantly cheaper than Zapier for equivalent complexity — $9/month for 10,000 operations vs Zapier\'s $49/month for similar capability
HTTP module connects to any REST API without waiting for an official integration
Operations-based pricing (vs task-based) is more efficient for multi-step workflows`,
    cons: `Steeper learning curve than Zapier — the visual canvas is more powerful but less approachable for non-technical users
1,700 integrations vs Zapier\'s 7,000 — some niche apps exist only in Zapier\'s catalog
Slower execution on free/Core plans (15-minute minimum interval) — real-time automation requires Pro or higher`,
    bestFor: 'Technical users, developers, and small agencies that need powerful multi-step workflow automation at lower cost than Zapier — especially for API integrations, data processing, and complex conditional logic',
    notFor: 'Non-technical users who want to set up simple two-step automations quickly — Zapier\'s UX is more approachable; teams that need obscure app integrations not in Make\'s 1,700-app catalog',
    keyFeatures: `Visual Canvas: Build workflows as a visual flowchart with modules, connections, and routing — see the full flow at once
1,700+ Integrations: Connect SaaS apps, databases, REST APIs, SOAP services, and custom webhooks
HTTP Module: Connect to any REST API directly — no official integration required
Data Transformation: Built-in functions, iterators, aggregators, and JSON/XML parsing for complex data manipulation
Error Handling: Configure fallback actions when a module fails — retry, ignore, or route to alternative flows
Scheduling: Run scenarios on any interval from 15 minutes (free) to every minute (Pro+) or via webhook triggers`,
    integrations: `Zapier\nSlack\nAirtable\nNotion\nHubSpot\nSalesforce\nShopify\nStripe\nGmail\nGoogle Sheets\nTrello\nAsana\nMailchimp\nTypeform\nGitHub`,
    verdict: 'Make is the right automation platform for technical users who find Zapier too expensive or too limited. The visual canvas is genuinely more powerful for complex workflows, and the operations-based pricing is significantly cheaper for high-volume use. The tradeoff is a steeper learning curve and a smaller app catalog. For simple automation by non-technical users, Zapier remains more approachable.',
    seoTitle: 'Make: Pricing, Plans & Automation Features | TopToolsPick',
    seoDescription: 'Make (formerly Integromat) is free for 1,000 operations/month. Core from $9/month. See how Make compares to Zapier and n8n for workflow automation.',
  },
  {
    name: 'Squarespace',
    slug: 'squarespace',
    categoryId: CATEGORIES.hosting,
    websiteUrl: 'https://www.squarespace.com',
    logoUrl: `${CDN}/squarespace.svg`,
    pricingModel: PricingModel.SUBSCRIPTION,
    hasFreePlan: false,
    hasFreeTrial: true,
    rating: 4.4,
    editorialScore: 80,
    shortDescription: 'Design-led website builder with templates, e-commerce, and blogging — the top choice for creators and small businesses who prioritize aesthetics.',
    description: `Squarespace is the leading design-focused website builder, known for its high-quality templates and polished aesthetic. Over 4 million websites are built on Squarespace, spanning portfolios, blogs, service businesses, e-commerce stores, and event pages.

The Squarespace editor uses a section-based model: pages are built by stacking sections (hero, gallery, text, pricing table, contact form) from a library of pre-designed layouts. Within sections, content blocks (text, image, button, code) can be arranged in a grid. This gives non-designers professional-looking results with minimal effort — which is Squarespace's core value proposition.

Squarespace templates are industry-leading in visual quality, designed for photography, fashion, restaurants, fitness studios, and creative portfolios where aesthetics matter. Fluid Engine (the current editor) allows more flexible layouts than the older editor system.

Commerce features include product listings, inventory management, Stripe/PayPal payments, shipping calculations, abandoned cart recovery, and subscription products. These are included in Business and Commerce plans. Email campaigns and scheduling tools (Acuity Scheduling for appointments) are sold as add-ons or included in higher tiers.

Plans: Personal ($16/month), Business ($23/month), Commerce Basic ($28/month), Commerce Advanced ($52/month). All require annual billing for these prices; month-to-month is 25-30% more.`,
    pros: `Best-in-class template quality — Squarespace templates consistently look more professional than Wix or WordPress themes out of the box
Section-based page building requires zero design skill to produce polished results
All-in-one: hosting, domain, SSL, email, analytics, and e-commerce in one monthly subscription
Excellent mobile preview — templates are designed mobile-first with automatic optimization`,
    cons: `Less flexible customization than Webflow or WordPress — you\'re constrained by the template and section system
E-commerce features lag behind Shopify for serious stores — limited apps and no headless commerce option
Squarespace SEO tools are adequate but not as powerful as dedicated WordPress SEO plugins like Yoast
No free plan — 14-day trial only, then paid from $16/month`,
    bestFor: 'Creatives, photographers, service businesses, restaurants, and small retailers who want a professionally designed website without technical complexity — and who don\'t need deep e-commerce customization',
    notFor: 'High-volume e-commerce stores (Shopify handles inventory, apps, and fulfillment better); businesses that need advanced custom functionality or integrations (WordPress with plugins is more flexible); teams that want maximum pricing flexibility',
    keyFeatures: `Design Templates: Award-winning templates for portfolios, restaurants, retail, fitness, and more — designed for non-designers
Fluid Engine: Section-based drag-and-drop editor with flexible grid layouts and full-screen sections
E-commerce: Product listings, digital downloads, subscriptions, Stripe/PayPal integration, and shipping calculations
Squarespace Email Campaigns: Built-in email marketing tied to your website contact list
Acuity Scheduling: Appointment booking and scheduling tool integrated with the Squarespace CMS
SEO Tools: Automatic sitemaps, clean URLs, meta descriptions, and structured data markup`,
    integrations: `Stripe\nPayPal\nMailchimp\nZapier\nGoogle Analytics\nFacebook Pixel\nShipStation\nUPS\nFedEx\nDHL\nGoogle Workspace\nXero`,
    verdict: 'Squarespace is the best choice for small businesses and creatives who want a beautiful, all-in-one website without technical management. The design quality is genuinely higher than Wix, and the editor is more approachable than Webflow. The main limitations are e-commerce depth and customization — growing stores will hit Squarespace\'s ceiling and need to migrate to Shopify.',
    seoTitle: 'Squarespace: Pricing, Plans & Website Builder Features | TopToolsPick',
    seoDescription: 'Squarespace website builder starts at $16/month. 14-day free trial. See templates, e-commerce features, and how it compares to Wix and WordPress.',
  },
  {
    name: 'Xero',
    slug: 'xero',
    categoryId: CATEGORIES.finance,
    websiteUrl: 'https://www.xero.com',
    logoUrl: `${CDN}/xero.svg`,
    pricingModel: PricingModel.SUBSCRIPTION,
    hasFreePlan: false,
    hasFreeTrial: true,
    rating: 4.4,
    editorialScore: 83,
    shortDescription: 'Cloud accounting software for small businesses — a modern, user-friendly alternative to QuickBooks with strong international capabilities.',
    description: `Xero is a cloud-based accounting platform designed for small and medium businesses, with 3.95 million subscribers globally. Founded in New Zealand in 2006, Xero built a reputation as the cleaner, more intuitive alternative to QuickBooks — particularly for non-accountants who need to manage their own books.

Core features include bank reconciliation (automatic transaction matching), invoicing (professional templates with online payment links via Stripe, GoCardless, or PayPal), expense claims, payroll (in supported countries), and financial reporting (P&L, balance sheet, cash flow statement). The Xero App Store provides 1,000+ integrations for inventory, CRM, payroll, time tracking, and industry-specific tools.

Xero's multi-currency support is stronger than QuickBooks Online — it handles 160+ currencies with automatic exchange rate updates, making it popular with businesses that invoice internationally. The Projects module tracks time and expenses against client projects for service-based businesses.

Plans: Starter ($29/month, 20 invoices and 5 bills/month), Standard ($46/month, unlimited), Premium ($69/month, adds multi-currency). All plans include unlimited users — a significant advantage over QuickBooks' per-seat pricing.

Accountants and bookkeepers who work with Xero clients benefit from the advisor console that provides a centralized view of all client accounts, making it a common recommendation from accounting firms.`,
    pros: `Unlimited users on all plans — no per-seat pricing unlike QuickBooks, which becomes expensive with a bookkeeper or multiple staff
Cleaner, more intuitive interface than QuickBooks Online — non-accountants can navigate it without training
Strong multi-currency support (160+ currencies) for businesses with international clients
1,000+ app integrations cover inventory (DEAR, TradeGecko), time tracking (TSheets), and CRM (Salesforce)`,
    cons: `Starter plan\'s 20 invoices/month limit forces early upgrades — Standard ($46/month) is the practical minimum for active businesses
Payroll is available only in the US, UK, Australia, and New Zealand — other countries need a third-party integration
US market is less mature than QuickBooks — fewer US-specific integrations and less accountant familiarity in the US`,
    bestFor: 'Small businesses and freelancers outside the US (UK, Australia, New Zealand especially) that want clean cloud accounting with unlimited users and strong international currency support',
    notFor: 'US-based businesses with a large accountant ecosystem (QuickBooks is the US standard with more accountants familiar with it); businesses that need complex inventory management built-in',
    keyFeatures: `Bank Reconciliation: Automatic transaction matching from connected bank feeds — reconcile in minutes, not hours
Invoicing: Professional invoice templates with online payment links (Stripe, GoCardless, PayPal) and automatic reminders
Expense Claims: Employee expense submissions, approvals, and reimbursements with receipt capture
Multi-Currency: 160+ currencies with automatic exchange rates — invoice and receive payments in any currency
Financial Reports: P&L, balance sheet, aged receivables, and cash flow statements with live data
Xero Projects: Track time and expenses against client projects with budget vs. actual reporting`,
    integrations: `Shopify\nWooCommerce\nStripe\nPayPal\nSquarespace\nBigCommerce\nQuickBooks\nGusto\nDEAR Inventory\nHubSpot\nSalesforce\nZapier\nSlack`,
    verdict: 'Xero is the best accounting software for small businesses outside the US, particularly in the UK, Australia, and New Zealand where it\'s the market leader. The unlimited users model is a genuine pricing advantage over QuickBooks. For US-based businesses, QuickBooks Online has a deeper accountant ecosystem and more US-specific integrations — but Xero is worth evaluating if you invoice internationally or want a cleaner interface.',
    seoTitle: 'Xero: Pricing, Plans & Accounting Features | TopToolsPick',
    seoDescription: 'Xero accounting software starts at $29/month. Unlimited users on all plans. See how Xero compares to QuickBooks and FreshBooks.',
  },
  {
    name: 'Gusto',
    slug: 'gusto',
    categoryId: CATEGORIES.finance,
    websiteUrl: 'https://gusto.com',
    logoUrl: `${CDN}/gusto.svg`,
    pricingModel: PricingModel.SUBSCRIPTION,
    hasFreePlan: false,
    hasFreeTrial: false,
    rating: 4.5,
    editorialScore: 84,
    shortDescription: 'Payroll, benefits, and HR platform built for small businesses — the most popular payroll software for US companies with 1-200 employees.',
    description: `Gusto is the leading payroll, benefits, and HR platform for small and medium-sized US businesses, serving over 300,000 companies. It simplifies payroll processing, automates tax filings, manages employee benefits (health insurance, 401k, HSA/FSA), and handles onboarding — all in one place.

Gusto's payroll is automated: connect bank accounts, set pay schedules, and Gusto calculates taxes, deductions, and net pay. Federal, state, and local taxes are automatically filed and paid. Year-end W-2s and 1099s are generated and filed automatically. Direct deposit is standard.

The benefits management is a standout feature: Gusto acts as a licensed insurance broker, allowing small businesses to offer ACA-compliant health insurance through major carriers (Aetna, Cigna, United Healthcare) at rates typically only available to larger companies. 401k administration, FSA/HSA, commuter benefits, and life insurance can also be managed through Gusto.

The HR module handles offer letters, onboarding checklists, time-off management, org charts, performance reviews, and employee document storage. Gusto's HRIS (HR information system) is sufficient for most companies under 100 employees.

Pricing: Simple ($40/month + $6/employee for basic payroll). Plus ($80/month + $12/employee for full HR). Premium (custom pricing for 25+ employees). The per-employee fee makes Gusto competitive for small headcounts but expensive for larger teams.`,
    pros: `Full-service automated payroll with automatic federal/state/local tax filing — hands-off compliance for small business owners
Licensed insurance broker: helps small businesses get health insurance without a broker, including ACA-compliant plans
Year-end W-2 and 1099 filing is automatic — no separate service needed
Clean, well-designed interface that non-HR people can navigate without training`,
    cons: `US-only — no international payroll or contractor payments outside the US
Per-employee pricing ($6-12/employee) becomes expensive for larger teams — ADP or Paychex are more cost-effective at 50+ employees
Benefits availability varies by state — health insurance options may be limited depending on location`,
    bestFor: 'US-based small businesses with 1-50 employees that want automated payroll with tax filing, benefits administration, and basic HR in one place — especially those offering health insurance for the first time',
    notFor: 'Companies outside the US; teams with 50+ employees where ADP, Paychex, or Rippling offer better per-employee pricing; companies that need complex HR features like performance management at scale',
    keyFeatures: `Automated Payroll: Calculate pay, deductions, and taxes; process direct deposit; file all taxes automatically
Benefits Administration: Health insurance, dental, vision, 401k, HSA/FSA, and life insurance in one dashboard
Onboarding: Digital offer letters, new hire paperwork, e-signatures, and first-day checklists
Time Tracking: Employee time tracking synced directly into payroll for automatic calculation
Contractor Payments: Pay international contractors (1099) via Gusto with automatic 1099 filing
HR Tools: Org chart, time-off management, employee directory, performance reviews, and document storage`,
    integrations: `QuickBooks\nXero\nFreshBooks\nSlack\nAsana\nBambooHR\nDeel\nZapier\nShopify\nWhen I Work\nHomebase\nRippling\nADP`,
    verdict: 'Gusto is the best payroll software for US small businesses. The automatic tax filing alone saves meaningful hours each quarter and eliminates compliance risk. The benefits administration makes it possible for small businesses to offer competitive health insurance without a dedicated HR person. The per-employee pricing is competitive up to about 50 employees — above that, evaluate Rippling or ADP for better rates.',
    seoTitle: 'Gusto: Pricing, Plans & Payroll Features | TopToolsPick',
    seoDescription: 'Gusto payroll starts at $40/month + $6/employee. Includes automatic tax filing, benefits, and HR tools. The top payroll choice for US small businesses.',
  },
  {
    name: 'Typeform',
    slug: 'typeform',
    categoryId: CATEGORIES.business,
    websiteUrl: 'https://www.typeform.com',
    logoUrl: `${CDN}/typeform.svg`,
    pricingModel: PricingModel.FREEMIUM,
    hasFreePlan: true,
    hasFreeTrial: false,
    rating: 4.5,
    editorialScore: 82,
    shortDescription: 'Conversational form and survey builder with beautiful design — the highest-converting form tool for lead generation and research.',
    description: `Typeform is a form and survey platform distinguished by its conversational, one-question-at-a-time interface. Instead of presenting a traditional form with multiple fields on screen at once, Typeform asks one question at a time — like a conversation — which research shows increases completion rates by 3-4x compared to traditional forms.

The form builder supports text, multiple choice, rating scales, file uploads, payment fields (Stripe), and logic jumps (conditional routing based on answers). Branching logic enables personalized paths — respondents see different questions based on previous answers, creating more relevant survey experiences.

Typeform integrates with 300+ apps including Slack, HubSpot, Salesforce, Airtable, Google Sheets, and Zapier. Results can be automatically pushed to CRMs, project management tools, and data analysis platforms without manual export.

VideoAsk (Typeform's video survey tool) enables asynchronous video forms where respondents answer via video, text, or audio — used for recruiting screeners, user research, and client testimonials.

The free plan allows 10 responses/month on up to 3 forms. Basic ($25/month) gives 100 responses and unlimited forms. Plus ($50/month) gives 1,000 responses. Business ($83/month) gives 10,000 responses and adds team features and priority support.`,
    pros: `Conversational one-question format measurably increases form completion rates vs traditional multi-field forms
Beautiful design and animations out of the box — forms look professional without any design work
Logic jumps create personalized question paths based on previous answers
300+ integrations automatically push results to CRM, spreadsheets, and project management tools`,
    cons: `Response limits on all plans — 10 responses/month free, 100 on Basic ($25/month), which is limiting for high-traffic use cases
More expensive per response than Google Forms (which is free with unlimited responses) for simple surveys
Not suited for long, complex surveys where respondents want to see all questions and navigate non-linearly`,
    bestFor: 'Marketing teams, researchers, and growth teams that want high-converting lead gen forms, customer satisfaction surveys, and onboarding questionnaires where completion rate matters',
    notFor: 'Internal surveys with many questions where respondents prefer seeing the full form; high-volume data collection where Google Forms or Tally are significantly cheaper per response',
    keyFeatures: `Conversational Interface: One question at a time with smooth animations — 3-4x higher completion rates than traditional forms
Logic Jumps: Conditional branching routes respondents to different questions based on their answers
Calculations: Perform math on numeric responses — calculate scores, prices, or custom metrics within the form
Payment Integration: Accept Stripe payments within a form for product purchases or event registrations
VideoAsk: Async video forms where respondents answer via video, audio, or text — for recruiting and research
Result Analysis: Built-in charts and response summaries with filter, export, and Zapier/HubSpot integration`,
    integrations: `HubSpot\nSalesforce\nAirtable\nGoogle Sheets\nSlack\nMailchimp\nZapier\nNotion\nIntercom\nStripe\nMondaycom\nAsana\nTrello`,
    verdict: 'Typeform is worth the premium for any use case where completion rate is the metric that matters — lead generation, user research, and customer surveys. The beautiful UX converts at meaningfully higher rates than Google Forms. The response-based pricing limits it to moderate volume use cases — for high-volume surveys, Google Forms is free and perfectly functional.',
    seoTitle: 'Typeform: Pricing, Plans & Form Builder Features | TopToolsPick',
    seoDescription: 'Typeform is free for 10 responses/month. Basic from $25/month. See conversational form features, logic jumps, and how it compares to Google Forms.',
  },
]

async function main() {
  for (const tool of tools) {
    const existing = await prisma.product.findUnique({ where: { slug: tool.slug } })
    if (existing) { console.log(`⏭  ${tool.name} already exists`); continue }
    await prisma.product.create({
      data: { ...tool, status: PublicationStatus.PUBLISHED }
    })
    console.log(`✓ Added ${tool.name}`)
  }
  console.log('\nBatch 3 complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
