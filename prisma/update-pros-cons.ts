import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Separator: \n  (toBullets splits on \n first, then ;)
const tools: Record<string, { pros: string; cons: string }> = {
  "1password": {
    pros: [
      "AES-256 encryption with zero-knowledge architecture — even 1Password can't see your vault",
      "Travel Mode hides sensitive vaults at border crossings with one tap",
      "Watchtower monitors for breached passwords, weak entries, and reused credentials",
      "Browser extension fills passwords, TOTP codes, and payment details in one click",
      "Supports passkeys, SSH keys, and secure document storage alongside passwords",
    ].join("\n"),
    cons: [
      "No free tier — requires a paid plan after the 14-day trial",
      "Sharing access with non-1Password users requires guest links or family/team plans",
      "Migrating a vault from another manager requires manual export and import steps",
    ].join("\n"),
  },

  "ahrefs": {
    pros: [
      "Industry-leading backlink index updated every 15–30 minutes with 35+ trillion known links",
      "Site Audit crawls and flags technical SEO issues with prioritized action steps",
      "Content Explorer finds top-performing content in any niche for gap and ideation research",
      "Keyword Explorer covers 10+ search engines including YouTube, Amazon, and Bing",
    ].join("\n"),
    cons: [
      "Starts at $129/month — prohibitive for solo freelancers and small teams",
      "Traffic data is estimated, not pulled from Google Analytics — treat it as directional",
      "Steep learning curve for SEO beginners without prior keyword research experience",
    ].join("\n"),
  },

  "airtable": {
    pros: [
      "Relational database power behind a familiar spreadsheet interface — no SQL required",
      "Multiple views (kanban, gallery, timeline, Gantt, calendar) from a single data source",
      "Automations trigger Slack messages, emails, and API calls on record changes without code",
      "Interface Designer builds custom dashboards and client portals on top of your base",
    ].join("\n"),
    cons: [
      "Record limits per base are hit faster than expected — 50,000 on Team, 125,000 on Business",
      "$20/seat/month scales up quickly for teams of 10 or more",
      "Advanced reporting requires third-party tools like Coefficient or custom API scripts",
    ].join("\n"),
  },

  "asana": {
    pros: [
      "Timeline and dependency views clearly map project milestones and blockers",
      "Workflow Builder automates repetitive handoffs and approval flows between teams",
      "Portfolio and workload views give managers a real-time picture of team capacity",
      "Integrates with Slack, Zoom, Google Workspace, Salesforce, and 200+ other tools",
    ].join("\n"),
    cons: [
      "Free plan is capped at 10 team members and lacks automations and timeline view",
      "Feels over-engineered for simple personal task management or small projects",
      "Advanced reporting and goals tracking require the Business plan at $24.99/user/month",
    ].join("\n"),
  },

  "bigcommerce": {
    pros: [
      "No transaction fees on any plan — keep all revenue regardless of payment processor",
      "Native multi-currency, multi-storefront, and international SEO capabilities built in",
      "Headless commerce architecture allows custom front-ends while BigCommerce handles the back end",
      "Robust built-in SEO tools including canonical URL control and structured data",
    ].join("\n"),
    cons: [
      "Narrower theme and app ecosystem than Shopify — fewer out-of-the-box design options",
      "No free plan — pricing starts at $39/month and increases based on annual sales volume",
      "Some features that come standard on Shopify require paid third-party apps on BigCommerce",
    ].join("\n"),
  },

  "bitwarden": {
    pros: [
      "Open-source codebase publicly audited by independent security firms — full transparency",
      "Free plan includes unlimited passwords across unlimited devices — truly unlimited",
      "Self-hosting option gives your organization complete control over vault data",
      "Business plans start at $3/user/month — the most affordable team password manager",
    ].join("\n"),
    cons: [
      "Interface is less polished than 1Password or Dashlane — functional but utilitarian",
      "Advanced 2FA options like YubiKey and Duo require the paid Personal plan ($10/year)",
      "Importing from other password managers can require format conversion and manual cleanup",
    ].join("\n"),
  },

  "canva": {
    pros: [
      "Drag-and-drop editor makes professional-looking designs accessible to non-designers",
      "Magic Studio AI generates images, writes copy, expands backgrounds, and removes objects",
      "250,000+ templates covering social media, presentations, print, and video formats",
      "Brand Kit keeps fonts, colors, and logos consistent across every design",
    ].join("\n"),
    cons: [
      "Template-heavy designs can produce a recognizable 'Canva look' that lacks originality",
      "High-resolution print exports (300 dpi, CMYK) require the Pro plan at $14.99/month",
      "Not suitable for complex vector illustration or precision layout work — use Adobe Illustrator for that",
    ].join("\n"),
  },

  "capcut": {
    pros: [
      "Auto-captions with high accuracy in 15+ languages added with a single tap",
      "AI background removal, motion tracking, and green screen effects are free with no watermark",
      "Templates for TikTok, Instagram Reels, and YouTube Shorts speed up content creation",
      "CapCut PC has a full timeline editor — not just a mobile-first tool",
    ].join("\n"),
    cons: [
      "Owned by ByteDance (TikTok parent) — raises data privacy concerns in some regions",
      "Desktop app lags behind the mobile version in AI feature availability",
      "Not designed for long-form professional video — lacks color grading and advanced audio mixing",
    ].join("\n"),
  },

  "chatgpt": {
    pros: [
      "Versatile across writing, coding, data analysis, research, and creative brainstorming",
      "GPT-4o handles text, images, voice, and file analysis in a single conversation",
      "Large ecosystem of custom GPTs and plugins extends capabilities for specific workflows",
      "Free tier provides access to GPT-4o mini for everyday tasks with no payment required",
    ].join("\n"),
    cons: [
      "Prone to confident hallucinations on facts, statistics, and citations — always verify outputs",
      "Context resets between conversations — no persistent memory across sessions by default",
      "Free tier is throttled to slower models during peak demand hours",
    ].join("\n"),
  },

  "claude": {
    pros: [
      "Handles very long documents — 200,000 token context window processes entire codebases or books",
      "Follows nuanced, multi-part instructions with high precision and low instruction drift",
      "Extended thinking mode works through complex problems step by step before answering",
      "Strong at legal, financial, and scientific analysis where careful reasoning matters most",
    ].join("\n"),
    cons: [
      "Image generation is not natively supported — text, code, and analysis only",
      "Fewer third-party integrations than ChatGPT's plugin ecosystem",
      "Knowledge cutoff means it can miss very recent events or newly released software versions",
    ].join("\n"),
  },

  "cloudways": {
    pros: [
      "Managed cloud hosting across 5 providers — AWS, Google Cloud, DigitalOcean, Vultr, and Linode",
      "ThunderstackCDN and Breeze caching plugin included free for WordPress performance",
      "One-click staging environments make safe pre-launch testing straightforward",
      "Faster server response times than comparable managed WordPress hosts at similar price points",
    ].join("\n"),
    cons: [
      "No built-in email hosting — requires a separate provider like Google Workspace or Zoho",
      "Pricing scales with server resources and can outpace shared hosting as traffic grows",
      "Not suited for complete beginners — some comfort with server concepts is expected",
    ].join("\n"),
  },

  "coursera": {
    pros: [
      "Professional Certificates from Google, IBM, Meta, and Amazon carry genuine hiring credibility",
      "Coursera Plus at $399/year gives unlimited access to 7,000+ courses and Specializations",
      "Free audit mode lets you evaluate course quality and content before paying",
      "Accredited online degrees from Duke, Michigan, and Johns Hopkins at a fraction of campus cost",
    ].join("\n"),
    cons: [
      "Graded assignments and completion certificates are locked behind paid enrollment",
      "Course quality varies widely — some content is outdated or shallower than advertised",
      "Instructor interaction is minimal for most courses — self-paced video content dominates",
    ].join("\n"),
  },

  "descript": {
    pros: [
      "Text-based editing cuts audio and video simply by deleting words from the transcript",
      "Overdub voice cloning fixes verbal mistakes by typing corrections — no re-recording needed",
      "AI removes filler words, silences, and background noise in one click",
      "Screen recorder and social clip maker are built in alongside the podcast editor",
    ].join("\n"),
    cons: [
      "Export rendering for long projects can be slower than traditional timeline editors",
      "Multi-camera editing and color grading still require a dedicated video editor like DaVinci Resolve",
      "Transcription accuracy drops noticeably with heavy accents or poor recording environments",
    ].join("\n"),
  },

  "elevenlabs": {
    pros: [
      "Most realistic AI voice synthesis available — consistently passes human-listener tests",
      "Voice Cloning creates a convincing personal voice from as little as one minute of audio",
      "Supports 29 languages with natural accent, pacing, and emotional inflection",
      "Studio product enables full audiobook production with chapter navigation and multi-voice casting",
    ].join("\n"),
    cons: [
      "Voice cloning raises serious ethical concerns — misuse for deepfakes is a real risk",
      "Commercial use of cloned voices requires the Creator plan ($22/month) or higher",
      "API character costs escalate quickly at production scale for large content volumes",
    ].join("\n"),
  },

  "figma": {
    pros: [
      "Real-time multiplayer editing keeps design and development working on the exact same file",
      "Dev Mode provides production-ready CSS, iOS, and Android code for every component",
      "Variables and component libraries create design systems that scale across large products",
      "FigJam handles workshops, retrospectives, and ideation alongside design in the same ecosystem",
    ].join("\n"),
    cons: [
      "Performance degrades significantly on very large files with hundreds of complex components",
      "Offline mode is limited — a stable internet connection is required for most work",
      "Organization plan at $45/editor/month is expensive for small teams on tight budgets",
    ].join("\n"),
  },

  "framer": {
    pros: [
      "Design-in-browser approach produces pixel-perfect responsive websites without writing HTML/CSS",
      "Built-in CMS handles blogs, portfolios, and dynamic content without a separate backend",
      "Animations and scroll interactions are configured visually — no JavaScript required",
      "One-click publish to a global CDN with automatic HTTPS and custom domain support",
    ].join("\n"),
    cons: [
      "Learning curve is steeper than Webflow or Squarespace for complete design beginners",
      "CMS content cannot be exported cleanly if you later want to migrate to another platform",
      "Limited third-party integrations compared to full CMS platforms like WordPress",
    ].join("\n"),
  },

  "freshbooks": {
    pros: [
      "Double-entry accounting built in without exposing accountant-level complexity to users",
      "Automated late payment reminders collect outstanding invoices with no manual follow-up",
      "Time tracking integrates directly into project billing for accurate client invoicing",
      "Mobile app captures receipts via photo and tracks mileage automatically",
    ].join("\n"),
    cons: [
      "Pricing is per client — costs scale as your active client list grows beyond the plan limit",
      "Inventory tracking and advanced payroll require third-party add-ons",
      "Reporting depth is shallower than QuickBooks for businesses with complex financial needs",
    ].join("\n"),
  },

  "github": {
    pros: [
      "Home to nearly every major open-source project — the largest developer community worldwide",
      "GitHub Actions automates CI/CD with 10,000+ reusable community-built actions",
      "GitHub Copilot AI suggests whole functions and tests directly inside VS Code and JetBrains",
      "Free tier includes unlimited public repositories and generous storage for private projects",
    ].join("\n"),
    cons: [
      "Actions compute minutes are limited on the free plan for private repositories",
      "Issue tracking is basic compared to Linear, Jira, or other dedicated project management tools",
      "Large binary files require Git LFS which counts against storage and bandwidth quotas",
    ].join("\n"),
  },

  "hostinger": {
    pros: [
      "Best price-to-performance ratio in shared hosting — NVMe SSD servers with real speed",
      "Custom hPanel control panel is simpler and faster to navigate than industry-standard cPanel",
      "Free domain for one year and free SSL certificate included on every plan",
      "AI Website Builder generates a complete site from a short description in minutes",
    ].join("\n"),
    cons: [
      "Introductory prices renew at 2–3× the initial rate after the first billing term ends",
      "Email hosting requires a separate add-on on Cloud plans — not included by default",
      "Phone support and priority response times are reserved for higher-tier plans",
    ].join("\n"),
  },

  "kinsta": {
    pros: [
      "Google Cloud Platform (C2/C3D machines) delivers consistently fast WordPress hosting",
      "MyKinsta dashboard has the cleanest and most intuitive UI in managed WordPress hosting",
      "Free daily backups, staging environment, and APM performance monitoring on all plans",
      "Edge caching served from 260+ Cloudflare locations reduces load times globally",
    ].join("\n"),
    cons: [
      "Starts at $35/month — three to five times more expensive than Cloudways or SiteGround",
      "Only WordPress and WooCommerce are supported — no Node.js, PHP frameworks, or static sites",
      "Monthly visit limits can be hit by traffic spikes, triggering overage charges without warning",
    ].join("\n"),
  },

  "linear": {
    pros: [
      "Sub-100ms interface — keyboard-driven navigation makes every action feel instant",
      "Git integration auto-moves issues through stages as branches are opened and merged",
      "Cycles give sprints structure without the overhead of traditional Scrum ceremonies",
      "Project updates and roadmaps give non-technical stakeholders clear, real-time visibility",
    ].join("\n"),
    cons: [
      "Designed specifically for software engineering teams — not suited for marketing or operations",
      "Free plan capped at 250 issues — fills quickly for any active team within weeks",
      "No native time tracking — requires integrations with Harvest, Toggl, or Clockify",
    ].join("\n"),
  },

  "loom": {
    pros: [
      "Record screen and camera simultaneously and get a shareable link before you finish recording",
      "AI summaries and searchable transcripts make long recordings skimmable in seconds",
      "Viewers can leave timestamped comments that turn async video into a two-way conversation",
      "Native apps for Mac, Windows, Chrome extension, iOS, and Android",
    ].join("\n"),
    cons: [
      "Free plan now limits storage to 25 videos at up to 5 minutes each",
      "Video quality is capped at 4K and is not suitable for professional broadcast production",
      "View analytics (who watched, at what timestamp) require the Business plan",
    ].join("\n"),
  },

  "mailchimp": {
    pros: [
      "All-in-one marketing platform — email, SMS, landing pages, and basic CRM in one subscription",
      "300+ integrations including Shopify, WooCommerce, Salesforce, and most major ecommerce platforms",
      "Predictive segmentation and AI-powered send-time optimization on paid plans",
      "Generous free tier covers up to 500 contacts and 1,000 emails per month",
    ].join("\n"),
    cons: [
      "Pricing scales steeply with list size — becomes one of the more expensive options past 5,000 contacts",
      "Email deliverability rates trail specialized tools like Klaviyo and ActiveCampaign",
      "Automation builder is less powerful and less visual than competing tools",
    ].join("\n"),
  },

  "miro": {
    pros: [
      "Infinite canvas with 2,500+ templates for workshops, roadmaps, retrospectives, and diagramming",
      "Real-time collaboration for distributed teams with built-in video calling and reactions",
      "AI Smart Drawing converts rough freehand sketches into clean, labeled diagrams automatically",
      "Deep integrations with Jira, Confluence, Asana, Slack, and Microsoft Teams",
    ].join("\n"),
    cons: [
      "Complex boards with many sticky notes and images can slow down in the browser",
      "Free plan is limited to 3 editable boards — restricts real usage to paid tiers",
      "Custom templates, SSO, and advanced admin controls require the Business plan or higher",
    ].join("\n"),
  },

  "nordvpn": {
    pros: [
      "6,300+ servers across 111 countries — the largest server network of any consumer VPN",
      "Double VPN and Onion Over VPN provide extra layers of anonymity for high-risk users",
      "Threat Protection blocks ads, trackers, and malware at the network level without a browser extension",
      "Independently audited no-logs policy and RAM-only servers that store no data between sessions",
    ].join("\n"),
    cons: [
      "Best pricing requires a 2-year commitment — month-to-month plans cost significantly more",
      "Connection speed varies — some servers are noticeably slower during peak hours",
      "10 simultaneous device connections is lower than Surfshark (unlimited) and some competitors",
    ].join("\n"),
  },

  "notion": {
    pros: [
      "All-in-one workspace combines notes, databases, wikis, and project tracking in a single tool",
      "Highly flexible block-based editor adapts to almost any content structure or workflow",
      "Notion AI drafts, summarizes, translates, and generates content inline within any page",
      "Free plan is generous for individuals — unlimited pages, blocks, and storage",
    ].join("\n"),
    cons: [
      "Load time slows significantly on large pages with many linked database views",
      "Offline mode is unreliable — most operations require an active internet connection",
      "The open-ended flexibility can lead to disorganized setups without intentional structure and conventions",
    ].join("\n"),
  },

  "perplexity": {
    pros: [
      "Every answer cites direct source links — outputs are verifiable rather than opaque",
      "Real-time web search keeps answers current beyond any model training cutoff date",
      "Pro Search performs multi-step research, synthesizing up to 10 sources per query",
      "Spaces allow organized research projects with custom instructions and shareable threads",
    ].join("\n"),
    cons: [
      "Free tier limited to 5 Pro searches per day — power users hit the ceiling quickly",
      "Cannot replace deep reasoning models for complex analysis or multi-step problem solving",
      "Source quality varies — the tool can surface low-quality or outdated content from the web",
    ].join("\n"),
  },

  "quickbooks": {
    pros: [
      "Bank and credit card feeds reconcile automatically with minimal manual entry",
      "Integrates with 750+ apps including PayPal, Square, Shopify, and most major US banks",
      "Payroll processing handles taxes, direct deposit, and W-2s as a built-in add-on",
      "Mobile app captures receipts by photo and tracks mileage automatically for self-employed users",
    ].join("\n"),
    cons: [
      "Prices have increased significantly over recent years — not the value proposition it once was",
      "The interface has become cluttered with upsell prompts and add-on suggestions",
      "Advanced reporting and class/location tracking require the Plus or Advanced plan",
    ].join("\n"),
  },

  "riverside": {
    pros: [
      "Records locally on each participant's device — audio and video quality is independent of internet speed",
      "Up to 4K video and 48kHz audio per track for broadcast-quality podcast and interview output",
      "AI Magic Clips automatically identifies the best moments for social media clips",
      "Separate audio and video tracks per participant give full post-production flexibility",
    ].join("\n"),
    cons: [
      "Free plan caps recording at 2 hours per month — insufficient for regular podcasters",
      "Livestreaming is not supported — Riverside is for recorded interviews only",
      "Guests must join via the Riverside web app or invite link — no traditional dial-in option",
    ].join("\n"),
  },

  "semrush": {
    pros: [
      "Most comprehensive competitor intelligence — tracks paid ads, organic rankings, content, and backlinks",
      "Position Tracking monitors daily keyword rankings with SERP feature and local tracking",
      "ContentShake AI creates SEO-optimized article drafts directly from keyword research data",
      "Domain Analytics gives a full traffic and strategy breakdown of any competitor's site",
    ].join("\n"),
    cons: [
      "Starts at $129.95/month — too expensive for most freelancers and early-stage businesses",
      "Backlink index is slightly smaller than Ahrefs' in terms of fresh link discovery speed",
      "Traffic and keyword data are estimates — useful for direction but not auditable accuracy",
    ].join("\n"),
  },

  "shopify": {
    pros: [
      "8,000+ apps in the Shopify App Store cover virtually every ecommerce use case",
      "Shopify Payments eliminates third-party payment processing fees on all plans",
      "POS hardware and software integrate online and retail in-person sales in one system",
      "Checkout conversion rates consistently outperform competing ecommerce platforms",
    ].join("\n"),
    cons: [
      "Third-party payment gateway fees (0.5–2%) apply if you don't use Shopify Payments",
      "Monthly costs grow quickly when stacking apps required for standard functionality",
      "Blog and content marketing capabilities lag behind dedicated CMS platforms like WordPress",
    ].join("\n"),
  },

  "slack": {
    pros: [
      "Channels and threads organize team communication far better than email chains",
      "2,600+ integrations make it the central hub for notifications from tools like GitHub, Jira, and PagerDuty",
      "Slack AI summarizes channels you missed and answers questions across your entire message history",
      "Slack Connect creates direct channels with external partners and clients without email",
    ].join("\n"),
    cons: [
      "Free plan caps searchable message history at 90 days — a serious compliance limitation",
      "Per-seat pricing scales expensively for large organizations as headcount grows",
      "Notification volume requires active management — can be as distracting as the email it replaces",
    ].join("\n"),
  },

  "teachable": {
    pros: [
      "Course builder requires no technical knowledge — upload content and publish the same day",
      "Native checkout handles coupons, order bumps, upsells, and installment payment plans",
      "Unlimited students with no revenue share on the Basic plan and above",
      "Completion certificates and quizzes are built in for structured learning outcomes",
    ].join("\n"),
    cons: [
      "Basic plan charges a 5% transaction fee — upgrading to Pro at $119/month removes it",
      "Email marketing automation is basic — no built-in drip sequences or segmentation",
      "Design customization is more restricted than Kajabi or Thinkific for branded course experiences",
    ].join("\n"),
  },

  "twilio": {
    pros: [
      "Single platform for SMS, WhatsApp, voice calls, email (via SendGrid), and video APIs",
      "Pay-as-you-go pricing with no minimum spend — scales from a side project to millions of users",
      "Verify API handles two-factor authentication and one-time passwords reliably at scale",
      "Documentation covers every major language with real code samples for immediate use",
    ].join("\n"),
    cons: [
      "Requires developer knowledge to implement — not a no-code or low-code tool",
      "SMS and call costs accumulate quickly at scale and can exceed carrier-direct rates",
      "Support response times on lower-tier accounts can be slow for production-critical issues",
    ].join("\n"),
  },

  "udemy": {
    pros: [
      "250,000+ courses covering every skill from programming and design to business and music",
      "Lifetime course access after purchase — content never expires regardless of platform changes",
      "Frequent sales bring most courses down to $10–15 — accessible price point",
      "Udemy Business provides curated learning paths with admin analytics for enterprise teams",
    ].join("\n"),
    cons: [
      "Course quality varies enormously — no consistent editorial standard or accreditation",
      "Instructor incentives favor quantity over maintenance — content can go stale quickly",
      "Certificates carry significantly less weight than accredited institutional credentials for hiring",
    ].join("\n"),
  },

  "vercel": {
    pros: [
      "Zero-config deployments with automatic preview URLs for every pull request and branch",
      "Edge Network serves content from 100+ global regions at minimal latency",
      "Web Analytics, Speed Insights, and Core Web Vitals monitoring built into the dashboard",
      "Maintained by the same team as Next.js — deepest possible framework integration",
    ].join("\n"),
    cons: [
      "Bandwidth and serverless function execution costs can spike unexpectedly on high-traffic sites",
      "Hobby plan bandwidth limits are strict — production apps quickly need a paid plan",
      "Enterprise SLAs and support require custom pricing negotiation with no self-serve path",
    ].join("\n"),
  },

  "wave": {
    pros: [
      "Accounting, invoicing, and receipt scanning are completely free with no limits or time cap",
      "Double-entry accounting with bank reconciliation and standard financial reports built in",
      "Payroll processing available for US and Canadian small businesses as a paid add-on",
      "No client limits and no transaction count caps on the free accounting tier",
    ].join("\n"),
    cons: [
      "Payroll and payment processing carry transaction fees — these are how Wave earns revenue",
      "Inventory management and project time tracking require third-party integrations",
      "Free tier support is community forums only — live support requires a paid subscription",
    ].join("\n"),
  },

  "woocommerce": {
    pros: [
      "Free and open-source plugin that runs on WordPress — you own every line of code and all your data",
      "59,000+ WordPress plugins extend WooCommerce with no platform lock-in",
      "Large global developer community and extensive documentation for custom builds",
      "No per-transaction fees at the platform level — your payment processor is your only fee",
    ].join("\n"),
    cons: [
      "Hosting, security updates, backups, and performance tuning are entirely your responsibility",
      "Performance at scale requires dedicated WordPress hosting with proper caching configuration",
      "Plugin conflicts can break checkout — staging environments and careful update management are essential",
    ].join("\n"),
  },

  "zoom": {
    pros: [
      "Industry-standard video call quality with reliable performance on low-bandwidth connections",
      "Breakout rooms, polls, whiteboards, and webinar features cover every meeting format",
      "AI Companion transcribes meetings, summarizes action items, and composes follow-up emails",
      "Zoom Phone and Zoom Rooms extend the platform into full enterprise unified communications",
    ].join("\n"),
    cons: [
      "Free plan caps meetings at 40 minutes for groups of three or more",
      "Security history — past 'Zoombombing' incidents required policy and encryption changes",
      "Feature sprawl and frequent UI changes make the app feel complex for simple video calls",
    ].join("\n"),
  },
};

async function main() {
  let updated = 0;
  let skipped = 0;
  for (const [slug, { pros, cons }] of Object.entries(tools)) {
    try {
      const result = await prisma.product.updateMany({
        where: { slug },
        data: { pros, cons },
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
