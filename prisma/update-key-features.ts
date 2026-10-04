import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Format: "Short Title: one-sentence explanation"
// The tool page splits on the first ": " — title is bold, explanation is muted below it.
const features: Record<string, string> = {
  "1password": [
    "AES-256 zero-knowledge vault: Your data is encrypted locally before it ever reaches 1Password servers — even the company cannot decrypt it",
    "Watchtower breach alerts: Monitors your vault against known data breaches and flags weak, reused, or compromised passwords automatically",
    "Travel Mode: Hide sensitive vaults with one tap before border crossings, then restore them instantly when you arrive safely",
    "Browser extension autofill: Fills passwords, TOTP codes, credit cards, and addresses across all major browsers in a single keystroke",
    "Passkey and SSH key storage: Stores modern passkeys and SSH private keys alongside traditional passwords in one secure place",
    "Family and team sharing: Share individual logins or entire vaults with family members or teammates without revealing the underlying password",
  ].join("\n"),

  "ahrefs": [
    "Site Explorer: Analyzes any domain's organic traffic, paid keywords, backlink profile, and top pages in one view",
    "Keywords Explorer: Shows search volume, keyword difficulty, and click data for 10+ search engines including YouTube and Amazon",
    "Site Audit: Crawls your website and flags technical SEO issues — broken links, slow pages, missing tags — with prioritized fixes",
    "Backlink index: One of the fastest-updating backlink indexes in the industry, with 35+ trillion known links refreshed every 15–30 minutes",
    "Content Explorer: Finds the best-performing content in any niche, ranked by organic traffic, backlinks, and social shares",
    "Rank Tracker: Monitors daily keyword ranking changes across desktop and mobile with SERP feature visibility",
  ].join("\n"),

  "airtable": [
    "Relational databases: Link records across tables just like a real database — without writing a single line of SQL",
    "Multiple views: Switch the same data between grid, kanban, gallery, calendar, Gantt, and timeline views instantly",
    "Interface Designer: Build custom dashboards, forms, and client portals on top of your data without code",
    "Automations: Trigger Slack messages, emails, and API calls automatically when records are created or updated",
    "Airtable AI: Categorize records, generate text, and summarize attachments using AI directly inside your base",
    "150+ integrations: Connects natively with Slack, Jira, Salesforce, Zapier, and Make for seamless workflow automation",
  ].join("\n"),

  "asana": [
    "Timeline view: Visualize project schedules, task dependencies, and milestones on a drag-and-drop Gantt chart",
    "Workflow Builder: Automate approval flows, handoffs, and notifications between team members without manual follow-up",
    "Portfolio management: Track the status, workload, and progress of multiple projects in one executive dashboard",
    "Goal tracking: Connect team goals directly to the work that drives them and track progress in real time",
    "Workload view: See exactly how many tasks each person has so you can redistribute before deadlines are missed",
    "200+ integrations: Connects with Slack, Microsoft Teams, Google Workspace, Zoom, Salesforce, Figma, and more",
  ].join("\n"),

  "bigcommerce": [
    "No transaction fees: Keep 100% of every sale regardless of which payment gateway you use — unlike Shopify",
    "Multi-storefront: Run multiple storefronts for different brands, regions, or B2B vs. B2C from one admin panel",
    "Headless commerce: Use BigCommerce as a headless back end while building any custom front end you want",
    "Built-in B2B features: Price lists, customer groups, quote management, and purchase order support come standard",
    "Native SEO tools: Canonical URL control, structured data, micro-data, and sitemap generation are all built in",
    "Multi-currency checkout: Accept payments in 100+ currencies with automatic conversion and localized pricing",
  ].join("\n"),

  "bitwarden": [
    "Open-source codebase: Every line of code is publicly available and has been independently audited by security firms",
    "Unlimited free tier: Store unlimited passwords across unlimited devices at zero cost — the most generous free plan available",
    "Self-hosting option: Deploy Bitwarden on your own server for complete organizational control over vault data",
    "End-to-end encryption: AES-256 encryption happens locally on your device — Bitwarden cannot access your vault",
    "Secure sharing: Send encrypted passwords, notes, or files to anyone via Bitwarden Send with expiry controls",
    "Hardware key 2FA: Supports YubiKey, FIDO2, and Duo for strong second-factor authentication on paid plans",
  ].join("\n"),

  "canva": [
    "Drag-and-drop editor: Create professional designs for social media, presentations, print, and video without design skills",
    "Magic Studio AI: Generate images, write copy, remove backgrounds, expand photos, and translate text using AI",
    "250,000+ templates: Ready-to-use designs for every format — posts, stories, slides, logos, flyers, and more",
    "Brand Kit: Store your brand colors, fonts, and logo in one place so every design stays on-brand automatically",
    "Team collaboration: Design together in real time, leave comments, and share editable templates with your team",
    "Multi-format export: Download in PNG, JPG, PDF, MP4, GIF, or SVG — with print-ready options on Pro",
  ].join("\n"),

  "capcut": [
    "Auto-captions: Generates accurate subtitles in 15+ languages with customizable fonts, colors, and animations",
    "AI background removal: Removes backgrounds from video in real time without a green screen",
    "One-tap effects: Apply trending filters, transitions, and motion effects from a library updated weekly",
    "Social media templates: Pre-sized templates for TikTok, Instagram Reels, YouTube Shorts, and Stories",
    "Voice effects and cloning: Change your voice in real time or clone it for AI-generated voiceovers",
    "CapCut PC editor: Full-featured desktop timeline editor with multi-track support and keyframe animation",
  ].join("\n"),

  "chatgpt": [
    "GPT-4o multimodal: Understands and responds to text, images, documents, and voice in the same conversation",
    "Custom GPTs: Build and share specialized AI assistants with custom instructions, tools, and knowledge bases",
    "Code interpreter: Writes, runs, and debugs code in a sandboxed environment — analyzes data and creates charts",
    "Web browsing: Searches the internet in real time to answer questions with up-to-date information",
    "DALL-E image generation: Creates and edits images from text descriptions directly inside the chat interface",
    "Voice mode: Have natural spoken conversations with multiple voice options and real-time interruption support",
  ].join("\n"),

  "claude": [
    "200K token context: Processes entire books, large codebases, or lengthy documents in a single conversation",
    "Extended thinking: Reasons through complex problems step by step before answering, reducing errors on hard tasks",
    "Instruction following: Handles nuanced, multi-part instructions with high precision across long conversations",
    "Artifacts: Creates standalone apps, code, and documents in a side panel you can iterate on interactively",
    "Computer use: Operates a computer by seeing the screen and controlling mouse and keyboard like a human",
    "Projects: Maintains persistent context, files, and instructions across sessions for ongoing work",
  ].join("\n"),

  "cloudways": [
    "5-provider choice: Deploy on DigitalOcean, Linode, Vultr, AWS, or Google Cloud from one dashboard",
    "Managed stack: PHP, MySQL, Nginx, Redis, Varnish, and Memcached pre-configured and kept up to date",
    "One-click staging: Clone any live site to a staging environment, test changes, and push with one click",
    "ThunderstackCDN: Integrated CDN included free with every plan for faster global asset delivery",
    "Breeze caching plugin: Free WordPress caching plugin built specifically for Cloudways servers",
    "Automated backups: Daily backups stored for up to 4 weeks with one-click restore to any point",
  ].join("\n"),

  "coursera": [
    "University-backed certificates: Earn verified certificates from Stanford, Yale, Duke, Google, IBM, and Meta",
    "Coursera Plus subscription: Access 7,000+ courses, Specializations, and Professional Certificates for $399/year",
    "Free audit mode: Watch course videos and access materials for free without a certificate",
    "Accredited online degrees: Earn a fully accredited bachelor's or master's degree online from a partner university",
    "Hands-on projects: Graded assignments, peer-reviewed projects, and real-world capstone work in every Specialization",
    "Mobile offline learning: Download course content for offline viewing on the iOS and Android apps",
  ].join("\n"),

  "descript": [
    "Text-based editing: Edit audio and video by editing the auto-generated transcript — delete a word, cut the clip",
    "Overdub voice cloning: Fix verbal mistakes by typing the correction — Descript re-generates it in your voice",
    "AI filler word removal: Removes 'um', 'uh', and 'like' with one click across the entire recording",
    "Eye contact correction: AI repositions your eyes to look directly at the camera even if you were reading notes",
    "Screen recorder: Records screen, webcam, or both simultaneously for tutorials and product demos",
    "Social clip creation: Auto-generates short clips with captions from long recordings for TikTok and Reels",
  ].join("\n"),

  "elevenlabs": [
    "Hyper-realistic voice synthesis: Produces AI speech that consistently passes human-listener tests across 29 languages",
    "Instant Voice Cloning: Clones any voice from as little as one minute of audio with high emotional accuracy",
    "Voice Library: Access 3,000+ community-created voices and publish your own for passive income",
    "ElevenLabs Studio: Full audiobook production environment with chapter navigation and multi-voice casting",
    "Real-time voice changer: Transform your voice live during calls, streams, or recordings",
    "Audio Native: Automatically converts any article or page into a listenable audio experience with one embed",
  ].join("\n"),

  "figma": [
    "Real-time collaboration: Multiple designers edit the same file simultaneously with cursor presence and live changes",
    "Dev Mode: Gives developers inspect access with production-ready CSS, iOS, and Android code for every layer",
    "Variables and tokens: Define reusable design tokens for color, spacing, and typography across your entire system",
    "Auto layout: Frames that resize intelligently based on content — perfect for responsive component design",
    "FigJam whiteboard: Collaborative FigJam boards for workshops, retrospectives, and ideation — linked to design files",
    "Component libraries: Publish shared component libraries that teams can subscribe to and sync automatically",
  ].join("\n"),

  "framer": [
    "Design-to-website: Design visually in Framer and publish a fully responsive site — no HTML or CSS required",
    "CMS for dynamic content: Built-in CMS handles blogs, portfolios, and product pages with flexible field types",
    "Visual animations: Configure scroll triggers, hover effects, and page transitions without writing JavaScript",
    "Component system: Build reusable interactive components with states and variants that work in production",
    "Figma import: Import Figma designs directly and convert frames to interactive Framer components",
    "SEO and analytics: Built-in sitemap, meta tags, and analytics — with custom code support for GA and GTM",
  ].join("\n"),

  "freshbooks": [
    "Professional invoicing: Create branded invoices in seconds, send them via email, and accept online payments",
    "Automated late reminders: Sends customizable payment reminders automatically so you don't have to chase clients",
    "Time tracking: Log hours directly against projects and convert them to invoice line items with one click",
    "Expense management: Snap photos of receipts with the mobile app and they're categorized automatically",
    "Double-entry accounting: Full accounting reports — P&L, balance sheet, and trial balance — built for small business",
    "Client portal: Clients can view invoices, make payments, and see project updates in a branded portal",
  ].join("\n"),

  "github": [
    "Pull requests and code review: Structured review workflow with inline comments, suggested changes, and approval gates",
    "GitHub Actions: Automate CI/CD, testing, and deployment with 10,000+ community-built reusable actions",
    "GitHub Copilot: AI pair programmer that suggests code completions, functions, and tests as you type",
    "Projects (kanban): Built-in project boards and roadmap views linked directly to issues and pull requests",
    "GitHub Packages: Host private npm, Docker, Maven, and NuGet packages alongside your source code",
    "Security scanning: Dependabot automatically opens PRs to fix vulnerable dependencies as patches are released",
  ].join("\n"),

  "hostinger": [
    "NVMe SSD hosting: LiteSpeed web servers with NVMe SSD storage deliver page loads that beat most shared hosts",
    "Custom hPanel: Simplified control panel built from scratch — faster and cleaner than standard cPanel",
    "AI Website Builder: Describe your business in a sentence and get a complete website generated in under a minute",
    "Free domain + SSL: Every plan includes a free domain for the first year and an SSL certificate at no extra cost",
    "WordPress optimization: Auto-install, managed updates, and LiteSpeed cache tuned specifically for WordPress",
    "Weekly or daily backups: Automated backups stored off-site with one-click restore for every plan tier",
  ].join("\n"),

  "kinsta": [
    "Google Cloud C2/C3D machines: Premium compute instances with faster CPUs and lower latency than standard cloud VMs",
    "Edge caching: Content served from 260+ Cloudflare edge locations — faster loading for visitors worldwide",
    "MyKinsta dashboard: The most intuitive managed WordPress dashboard in the industry with APM and log viewer",
    "Free staging environment: Clone production to staging, test changes safely, and push live with one click",
    "Daily automatic backups: Stored for 14–30 days depending on plan, with on-demand and downloadable backups",
    "Built-in APM tool: Application Performance Monitoring pinpoints slow database queries and PHP bottlenecks",
  ].join("\n"),

  "linear": [
    "Sub-100ms interface: Keyboard-driven with instant navigation — every action happens without a loading spinner",
    "Git integration: Issues auto-move through workflow stages as branches are created, reviewed, and merged",
    "Cycles: Time-boxed sprints that give engineering teams structure without heavyweight Scrum ceremony",
    "Project roadmaps: High-level timelines and progress summaries that non-engineers can actually read",
    "Slack notifications: Smart notifications surface only the issue updates that actually need your attention",
    "Triage mode: Dedicated view for processing new issues so your active backlog stays clean and prioritized",
  ].join("\n"),

  "loom": [
    "Instant share link: Recording finishes and a shareable link is ready before you close the app — zero upload wait",
    "AI summary and transcript: Searchable transcript and auto-generated summary appear immediately after recording",
    "Timestamped comments: Viewers react and comment on specific moments — async video becomes a conversation",
    "Screen and camera recording: Capture screen, webcam, or both in up to 4K with automatic background blur",
    "Video trimming and chapters: Trim silence, cut mistakes, and add chapter markers directly inside Loom",
    "Team workspace: Organize videos in shared folders with viewer analytics and access permissions",
  ].join("\n"),

  "mailchimp": [
    "Email campaigns: Drag-and-drop email builder with 100+ templates and A/B testing for subject lines and content",
    "Marketing CRM: Contact profiles, audience segmentation, and behavioral targeting in one place",
    "SMS marketing: Send transactional and promotional SMS messages alongside email from the same platform",
    "Landing pages: Build hosted landing pages and pop-ups to grow your email list without a separate tool",
    "Predictive segmentation: AI identifies your most likely-to-buy customers and optimizes send time automatically",
    "300+ integrations: Connects with Shopify, WooCommerce, Salesforce, Canva, Eventbrite, and most major tools",
  ].join("\n"),

  "miro": [
    "Infinite canvas: Unlimited whiteboard space for workshops, roadmaps, retrospectives, and architecture diagrams",
    "2,500+ templates: Ready-made boards for every use case — sprint planning, customer journey, org chart, and more",
    "AI Smart Drawing: Converts rough freehand sketches into clean, labeled shapes and diagrams automatically",
    "Real-time collaboration: Multiple participants on the same board simultaneously with built-in video calling",
    "Sticky notes and voting: Run structured workshops with dot voting, timer, and facilitation tools built in",
    "Jira and Confluence sync: Two-way sync with Atlassian tools — create Jira tickets directly from Miro boards",
  ].join("\n"),

  "nordvpn": [
    "6,300+ global servers: Servers in 111 countries — the largest network of any consumer VPN service",
    "Double VPN: Routes traffic through two servers consecutively for an extra layer of anonymity",
    "Threat Protection Pro: Blocks malware, trackers, and intrusive ads at the network level without a browser extension",
    "Meshnet: Create a private encrypted network between your own devices or trusted contacts for secure file sharing",
    "RAM-only servers: All servers run entirely in memory — rebooting wipes all data, making logs impossible",
    "Audited no-logs policy: Independently verified by PricewaterhouseCoopers — the company stores nothing about your activity",
  ].join("\n"),

  "notion": [
    "Block-based editor: Every piece of content is a block — text, image, table, embed, database — that you can rearrange freely",
    "Linked databases: Relate tables to each other, roll up values, and filter linked data across multiple pages",
    "Notion AI: Draft, summarize, translate, and generate content inline within any page or database",
    "Wikis and docs: Build a structured company knowledge base with nested pages, templates, and version history",
    "Project tracking: Kanban boards, timeline views, and task databases with custom properties and filters",
    "1,000+ integrations: Connects with Slack, GitHub, Jira, Figma, Zapier, Loom, and most productivity tools",
  ].join("\n"),

  "perplexity": [
    "Real-time web search: Searches the live internet for every query — answers are never limited by a training cutoff",
    "Cited sources: Every answer links directly to its sources so you can verify claims and read further",
    "Pro Search: Multi-step research mode that synthesizes up to 10 sources and asks clarifying questions",
    "Spaces: Organize multi-session research projects with custom AI instructions and shared thread history",
    "Focus modes: Route searches specifically to Reddit, YouTube, academic papers, or news sources",
    "Image and file upload: Analyze images, PDFs, and spreadsheets alongside web search in the same query",
  ].join("\n"),

  "quickbooks": [
    "Bank reconciliation: Connects to your bank and automatically matches imported transactions to records",
    "750+ integrations: Connects with PayPal, Square, Shopify, WooCommerce, and most major US financial services",
    "Invoicing and payments: Send professional invoices and accept credit cards, ACH, and Apple Pay online",
    "Payroll add-on: Runs US payroll with automated tax calculations, direct deposit, and W-2 generation",
    "Mobile receipt capture: Photograph receipts with the mobile app and they're categorized and matched automatically",
    "Cash flow planner: Forecasts your cash position 90 days out based on your actual income and expense data",
  ].join("\n"),

  "riverside": [
    "Local recording: Each participant records directly on their own device — internet speed never affects audio or video quality",
    "Up to 4K video: Records each participant at up to 4K 60fps with a separate lossless audio track per person",
    "AI Magic Clips: Automatically identifies the most engaging moments and creates ready-to-share social clips",
    "Live call quality: Participants hear each other in compressed audio while full quality records locally in parallel",
    "Progressive upload: Files upload to the cloud in the background during recording so nothing is lost on disconnect",
    "Text-based editor: Trim recordings and create highlight clips using the auto-generated transcript",
  ].join("\n"),

  "semrush": [
    "Domain Analytics: Full breakdown of any domain's organic traffic, paid keywords, and competitive landscape",
    "Position Tracking: Daily keyword rank monitoring with SERP feature tracking and local search support",
    "Backlink audit: Identifies toxic backlinks pointing to your site and generates a disavow file automatically",
    "ContentShake AI: Generates SEO-optimized article drafts based on keyword research and competitor content",
    "Social media toolkit: Schedules posts, tracks mentions, and benchmarks social performance against competitors",
    "Advertising research: Reverse-engineers any competitor's Google Ads copy, budgets, and landing pages",
  ].join("\n"),

  "shopify": [
    "Unified commerce: Sell online, in store, on social, and on marketplaces — all managed in one admin",
    "8,000+ apps: The largest ecommerce app ecosystem — extend any part of your store without custom development",
    "Shopify Payments: Built-in payment processing with no third-party transaction fees and instant payouts",
    "Checkout optimization: One-page checkout with Shop Pay that consistently delivers industry-leading conversion rates",
    "Shopify Markets: Manages international currencies, languages, duties, and tax compliance automatically",
    "POS hardware: Synchronized point-of-sale system for retail locations with real-time inventory across channels",
  ].join("\n"),

  "slack": [
    "Channels: Organized spaces for specific teams, projects, or topics with full searchable message history",
    "Threads: In-depth discussion within any message without cluttering the main channel feed",
    "Slack Connect: Shared channels with external partners, clients, and vendors — no more email chains",
    "Slack AI: Summarizes channels you missed, searches across all history, and recaps threads on demand",
    "2,600+ integrations: Central hub for notifications and workflows from GitHub, Jira, PagerDuty, Zoom, and more",
    "Workflow Builder: Automate routine requests — approvals, stand-ups, and onboarding — without writing code",
  ].join("\n"),

  "teachable": [
    "Course builder: Upload videos, PDFs, audio, and text to build a structured course with no technical skills",
    "Flexible pricing: Charge one-time, subscription, payment plan, or bundle — with coupons and order bumps",
    "Custom checkout: Branded checkout page with upsell offers and installment payment options built in",
    "Completion certificates: Automatically issue branded PDF certificates when students finish a course",
    "Quizzes and drip content: Add assessments and schedule content release by enrollment date or student progress",
    "Affiliate program: Set custom commission rates and let students and partners promote your courses for you",
  ].join("\n"),

  "twilio": [
    "SMS API: Send and receive text messages programmatically in 180+ countries with a single API",
    "Voice API: Make, receive, and control phone calls with text-to-speech, call recording, and IVR support",
    "WhatsApp Business API: Send templated and session messages via WhatsApp at scale through Twilio's gateway",
    "Verify API: One-time password and two-factor authentication service with phone number validation built in",
    "SendGrid Email: Reliable transactional and marketing email delivery via Twilio's SendGrid platform",
    "Conversations: Multi-channel messaging (SMS, WhatsApp, Chat) with a unified API and agent handoff",
  ].join("\n"),

  "udemy": [
    "250,000+ courses: The widest course catalog available — programming, design, marketing, music, and beyond",
    "Lifetime access: Purchase once and access the course forever — no subscription expiry",
    "Offline mobile learning: Download courses on the iOS and Android app and watch without an internet connection",
    "Certificate of completion: Shareable PDF certificate generated automatically when you finish a course",
    "Udemy Business: Curated enterprise library with admin analytics, learning paths, and SSO support",
    "Regular sales: Most courses are discounted to $10–15 during frequent promotions — low barrier to entry",
  ].join("\n"),

  "vercel": [
    "Zero-config deployments: Push to GitHub and your app is live in under 30 seconds with automatic HTTPS",
    "Preview deployments: Every pull request gets its own live preview URL — share with stakeholders before merging",
    "Edge Network: Serves assets from 100+ global regions for minimal latency regardless of visitor location",
    "Serverless and Edge Functions: Run backend logic at the edge — no server management, automatic scaling to zero",
    "Web Analytics: Privacy-friendly traffic analytics built into the dashboard — no extra tracking script needed",
    "Next.js first-class support: Maintained by the Next.js team — every framework feature works the day it ships",
  ].join("\n"),

  "wave": [
    "Free accounting: Full double-entry accounting with bank reconciliation and financial reports at no cost",
    "Professional invoicing: Create and send unlimited branded invoices and accept online payments for free",
    "Receipt scanning: Photograph receipts in the mobile app and Wave categorizes and records them automatically",
    "Bank connections: Connects to thousands of financial institutions for automatic transaction import",
    "Financial reports: Profit and loss, balance sheet, and cash flow statements generated in real time",
    "Payroll (paid add-on): Run US and Canadian payroll with direct deposit and automated tax calculations",
  ].join("\n"),

  "woocommerce": [
    "Open-source freedom: Free plugin on WordPress — own your store, data, and code with no platform lock-in",
    "59,000+ plugins: Extend WooCommerce with any plugin in the WordPress ecosystem for any use case",
    "Product flexibility: Sell physical, digital, variable, subscription, or grouped products with no restrictions",
    "Payment gateway choice: Works with Stripe, PayPal, Square, and hundreds of regional payment providers",
    "SEO advantage: Runs on WordPress — the most SEO-friendly CMS in the world with full content control",
    "Headless ready: Use WooCommerce as a headless back end with REST API and GraphQL support",
  ].join("\n"),

  "zoom": [
    "HD video meetings: Reliable 1080p video for up to 1,000 participants with consistent quality on low bandwidth",
    "Breakout rooms: Split meetings into smaller groups automatically or manually for workshops and team discussions",
    "Zoom AI Companion: Transcribes meetings, summarizes action items, and drafts follow-up emails automatically",
    "Zoom Webinars: Host large-scale webinars with registration, Q&A, polls, and panelist management",
    "Zoom Phone: Cloud phone system integrated into the same app — replace your business phone with Zoom",
    "Zoom Rooms: Conference room hardware and software that syncs with calendar, one-touch to join, and auto-framing",
  ].join("\n"),
};

async function main() {
  let updated = 0;
  let skipped = 0;
  for (const [slug, keyFeatures] of Object.entries(features)) {
    try {
      const result = await prisma.product.updateMany({
        where: { slug },
        data: { keyFeatures },
      });
      if (result.count > 0) {
        console.log(`  ✓ ${slug}`);
        updated++;
      } else {
        console.log(`  ? ${slug} — not found`);
        skipped++;
      }
    } catch (e: unknown) {
      console.error(`  ✗ ${slug}: ${e instanceof Error ? e.message : String(e)}`);
      skipped++;
    }
  }
  console.log(`\nDone — ${updated} updated, ${skipped} skipped`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
