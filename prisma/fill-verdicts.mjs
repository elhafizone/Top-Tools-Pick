// Generates verdict + keyFeatures for published tools missing them
// Builds content from existing DB fields — no external API needed
// Run with: node prisma/fill-verdicts.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Key features per tool slug — curated list
const FEATURES = {
  'activecampaign': ['Email marketing automation','Lead scoring and CRM','Conditional logic workflows','Site tracking and tagging','Predictive sending'],
  'adobe-illustrator': ['Vector path editing','Typography tools','Artboard management','Adobe Creative Cloud sync','Print and export profiles'],
  'adobe-photoshop': ['Layer-based photo editing','Content-aware fill','Camera RAW processing','Smart objects','Neural AI filters'],
  'adobe-premiere-pro': ['Multi-track timeline','Color grading suite','Audio mixing tools','Dynamic Link with After Effects','LUT and preset management'],
  'adobe-xd': ['Component states and variants','Prototype flows and animations','Design tokens','Creative Cloud Libraries','Developer handoff specs'],
  'affinity-designer': ['Dual vector and raster modes','One-time purchase licence','Non-destructive effects','Symbol reuse','Export personas'],
  'around': ['Floating circular video bubbles','Noise suppression','Screen sharing','Status indicators','Lightweight background blur'],
  'basecamp': ['Message boards','To-do lists with assignments','Campfire group chat','Automatic check-ins','Flat per-team pricing'],
  'beautiful-ai': ['Smart auto-layout slides','AI design assistant','Branded templates','Presenter view','Real-time collaboration'],
  'blender': ['3D modelling and sculpting','Cycles and EEVEE renderers','Rigging and animation','Physics simulations','Python scripting API'],
  'brevo': ['Email campaigns','SMS marketing','Marketing automation','Transactional email API','CRM and pipeline'],
  'brex': ['Corporate credit cards','Expense management','Rewards on business spend','Bill pay','Accounting integrations'],
  'buffer': ['Social post scheduling','Analytics per post','Link in bio page','Content calendar','Team collaboration'],
  'buzzsprout': ['Podcast hosting and distribution','Episode analytics','Automatic transcription','Magic Mastering audio','Podcast website'],
  'buzzsumo': ['Content performance analysis','Influencer discovery','Trending content alerts','Competitor monitoring','Backlink tracking'],
  'cleanfeed': ['Studio-quality remote audio','Low-latency recording','Multi-guest sessions','ISDN-quality codecs','Browser-based, no install'],
  'cloudflare-zero-trust': ['ZTNA application access','Browser isolation','DNS filtering','Device posture checks','Identity provider integration'],
  'coda': ['Documents with embedded databases','Formula engine','Automations and buttons','Pre-built Packs integrations','Publish as web apps'],
  'convertkit': ['Email sequences','Visual automation builder','Paid newsletters','Subscriber tagging','Creator-focused landing pages'],
  'coolify': ['Self-hosted Heroku alternative','One-click app deployments','Docker Compose support','Automatic SSL','Git-based deployments'],
  'copy-ai': ['Long-form content generation','Ad copy templates','Blog wizard','Brand voice settings','Bulk content workflows'],
  'cursor': ['AI code editor built on VS Code','Tab autocomplete','Codebase-aware chat','Command-K inline edits','Import VS Code extensions'],
  'dall-e-3': ['Photorealistic image generation','Natural-language prompts','ChatGPT integration','Inpainting edits','Consistent style iterations'],
  'davinci-resolve': ['Professional colour grading','Fairlight audio editing','Fusion visual effects','Collaborative editing','Free professional tier'],
  'deel': ['Global payroll in 150+ countries','Contractor compliance','Employer of Record','Benefits management','Automated tax documents'],
  'digitalocean': ['Droplet virtual machines','Managed Kubernetes','App Platform PaaS','Managed databases','Spaces object storage'],
  'discord': ['Voice, video and text channels','Server roles and permissions','Thread-based conversations','Bot and webhook support','Screen sharing'],
  'divvy': ['Corporate spend management','Virtual and physical cards','Real-time budget tracking','Reimbursement workflows','Accounting sync'],
  'duolingo': ['Gamified daily lessons','Adaptive learning algorithm','Streak and XP system','Speaking and listening exercises','40+ languages'],
  'epidemic-sound': ['Royalty-free music library','Sound effects collection','Track stems for editing','Sync licence coverage','Mood-based search'],
  'etsy': ['Handmade and vintage marketplace','Global buyer audience','Pattern for personal websites','Shop analytics','Ads platform'],
  'expensify': ['Receipt scanning via SmartScan','Automatic expense reports','Corporate card reconciliation','Approval workflows','Accounting integrations'],
  'figma-figjam': ['Online whiteboard','Sticky notes and shapes','FigJam AI diagrams','Voting and timer widgets','Figma file embedding'],
  'final-cut-pro': ['Magnetic timeline editing','Optimized for Apple Silicon','ProRes workflow','Multicam sync','Object tracking'],
  'fly-io': ['Deploy from Docker containers','Global edge placement','Autoscaling machines','Persistent volumes','WireGuard private networking'],
  'gather': ['Virtual office spaces','Proximity-based video chat','Custom pixel-art maps','Screen sharing','Interactive objects'],
  'gemini': ['Multimodal AI reasoning','Google Workspace integration','Advanced code generation','Deep Research mode','Long context window'],
  'google-analytics-4': ['Event-based tracking','Funnel exploration reports','Predictive audience metrics','BigQuery export','Cross-device attribution'],
  'google-meet': ['HD video conferencing','Live captions and translation','Google Calendar integration','Host controls','Noise cancellation'],
  'gumroad': ['Digital product sales','Pay-what-you-want pricing','Subscription memberships','Affiliate programmes','Creator analytics'],
  'help-scout': ['Shared email inbox','Customer profiles','Saved replies','Beacon live chat','Reporting and CSAT'],
  'hootsuite': ['Multi-platform scheduling','Social inbox monitoring','Team assignment workflows','Content calendar','Paid ads integration'],
  'invision': ['Clickable prototype builder','Design handoff specs','Comment collaboration','Freehand whiteboard','Version history'],
  'jasper': ['Long-form AI writing','Brand voice training','Campaign workflow templates','Browser extension','SEO integration'],
  'kajabi': ['Online course builder','Email marketing','Community features','Landing pages','Affiliate management'],
  'lark': ['Video meetings','Collaborative docs','Team chat','Task management','OKR tracking'],
  'lark-suite': ['Integrated workspace suite','Video conferencing','Collaborative Docs and Sheets','Approval workflows','OKR management'],
  'lattice': ['Performance reviews','Goal and OKR tracking','Engagement surveys','1-on-1 meeting tools','Compensation management'],
  'lemonsqueezy': ['Digital product checkout','Subscription billing','Tax and VAT handling','Affiliate system','Developer API'],
  'linkedin-learning': ['Professional skill courses','Certificate programmes','LinkedIn profile integration','Team learning paths','Offline viewing'],
  'masterclass': ['Lessons from world experts','Cinematic video production','Workbooks and supplemental content','Multi-device access','Annual subscription'],
  'midjourney': ['Photorealistic image generation','Style-transfer prompting','Variation and upscale commands','Community feed','Discord-based workflow'],
  'mixpanel': ['Event-based product analytics','Funnel and retention reports','A/B test analysis','Cohort breakdowns','Real-time data'],
  'neon': ['Serverless Postgres','Branch-per-PR database','Scale to zero','Instant branching','Autoscaling compute'],
  'notion-ai': ['AI writing assistant in Notion','Summarise and rewrite','Auto-fill database properties','Q&A across your workspace','Translate content'],
  'notion-calendar': ['Calendar linked to Notion databases','Meeting notes auto-attached','Drag-and-drop scheduling','Google Calendar sync','Timeline view'],
  'otter-ai': ['Live meeting transcription','Speaker identification','Action item extraction','Otter Pilot meeting bot','Searchable transcripts'],
  'paddle': ['Merchant of Record billing','Global tax and VAT compliance','Subscription management','Checkout optimisation','Dunning management'],
  'perplexity-ai': ['Real-time web search answers','Cited sources for every answer','Pro deep-dive mode','File upload analysis','Collections for research'],
  'planetscale': ['Serverless MySQL database','Non-blocking schema changes','Database branching','Query insights','Global edge replication'],
  'plausible-analytics': ['Cookie-free web analytics','GDPR-compliant by default','Lightweight tracking script','Custom goal events','Email digest reports'],
  'pluralsight': ['Tech skill paths','Hands-on labs','Skill assessment IQ','Author-created courses','Team learning analytics'],
  'podia': ['Course and download sales','Email marketing built-in','Community space','Webinar hosting','Affiliate programme'],
  'postman': ['API request builder','Automated test collections','Mock server creation','API documentation','Team workspace sharing'],
  'printful': ['Print-on-demand fulfilment','Shopify and Etsy integration','Custom packaging options','White-label shipping','No minimum orders'],
  'procreate': ['Raster illustration on iPad','Pressure-sensitive brush engine','Animation assist','Time-lapse recording','One-time purchase'],
  'protonmail': ['End-to-end encrypted email','Zero-knowledge architecture','Custom domain support','Proton Drive integration','Anonymous sign-up'],
  'railway': ['Git-connected deployments','One-click service templates','Managed databases','Environment variables','Usage-based billing'],
  'ramp': ['Corporate cards with cashback','Automated expense reporting','Vendor management','Duplicate spend detection','Accounting sync'],
  'render': ['Static site hosting','Web services and cron jobs','Managed Postgres and Redis','Auto-deploy from Git','Preview environments'],
  'resend': ['Transactional email API','React email templates','Email logs and analytics','Webhooks','Custom domain sending'],
  'retool': ['Drag-and-drop internal tools','Database query builder','REST and GraphQL connectors','Role-based permissions','Git-backed source'],
  'rippling': ['Unified HR, IT and Finance','Global payroll','Device management','Benefits administration','App provisioning'],
  'rive': ['Interactive animation editor','State machine logic','Runtime for any platform','Figma import','Designer-developer handoff'],
  'runway': ['AI video generation','Green screen via AI','Frame interpolation','Motion tracking','Video-to-video style transfer'],
  'sketch': ['Mac-only vector design','Symbol libraries','Smart layout','Prototype flows','Developer inspect'],
  'skillshare': ['Creative and business courses','Project-based learning','Class communities','Offline access','Teacher revenue sharing'],
  'spline': ['Browser-based 3D design','Interactive state animations','Physics and gravity','React and Webflow embed','Collaboration tools'],
  'spotify-for-podcasters': ['Podcast hosting and distribution','Episode analytics','Listener Q&A','Video podcast support','Spotify ad marketplace'],
  'stability-ai': ['Open-source image models','API access to Stable Diffusion','Image and video generation','Fine-tuning capabilities','Developer-first platform'],
  'streamyard': ['Browser-based live streaming','Multi-destination broadcast','Guest invite by link','Lower-third overlays','Branded backgrounds'],
  'suno': ['AI music generation','Lyrics and melody from text','Multiple genre and style options','Song extensions','Public and private tracks'],
  'surfer-seo': ['Content editor with NLP scoring','SERP analyser','Keyword research','Internal linking suggestions','Content planner'],
  'switchboard': ['Persistent virtual rooms','Embedded apps and files','Video calls within rooms','Async video messages','Team spaces'],
  'synthesia': ['AI avatar video creation','100+ languages and accents','Script-to-video in minutes','Custom avatar training','Screen recorder'],
  'tailscale': ['WireGuard mesh VPN','Zero-config device access','SSH relay','Subnet routing','SSO and identity integration'],
  'tandem': ['Virtual co-working presence','One-click audio calls','Screen sharing','Camera rooms','Quiet and focus mode'],
  'thinkific': ['Course and community builder','No transaction fees','Custom branded domain','Drip content scheduling','Student progress tracking'],
  'thrivecart': ['One-time purchase checkout','Bump offers and upsells','Affiliate management','Subscription billing','No monthly fees'],
  'tome': ['AI narrative presentation builder','Story mode layout','Embeds and live data','Brand themes','One-click sharing'],
  'upstash': ['Serverless Redis','Serverless Kafka','Global edge replication','REST API for Redis','Usage-based pricing'],
  'webex': ['Enterprise video conferencing','Noise removal AI','Webinars and events','Persistent team spaces','Desk phone integration'],
  'webflow': ['Visual CMS website builder','No-code animations','E-commerce built-in','Hosting included','Clean HTML/CSS export'],
  'wordpress-com': ['Managed WordPress hosting','Jetpack security tools','WooCommerce e-commerce','Subdomain or custom domain','One-click staging'],
  'wordtune': ['AI rewriting and rephrasing','Tone adjustment','Sentence expansion and shortening','Spices (facts and quotes)','Browser extension'],
};

function buildVerdict(tool) {
  const pricing = {
    FREE: 'free to use',
    FREEMIUM: 'free to start with paid upgrades',
    SUBSCRIPTION: 'subscription-based',
    ONE_TIME: 'a one-time purchase',
  }[tool.pricingModel] ?? 'paid';

  const bestFor = tool.bestFor ?? `teams needing ${tool.shortDescription.toLowerCase()}`;
  const pros = tool.pros ?? '';
  const cons = tool.cons ?? '';

  return `${tool.name} is the right choice for ${bestFor.toLowerCase().replace(/\.$/, '')}. ${pros.trim().replace(/\.$/, '')}, making it one of the stronger options in its category. The main limitation to weigh: ${cons.toLowerCase().replace(/\.$/, '')}. It is ${pricing}, so factor that into your evaluation.`;
}

async function main() {
  const tools = await prisma.product.findMany({
    where: { status: 'PUBLISHED', verdict: null },
    select: { id: true, slug: true, name: true, shortDescription: true, description: true, pros: true, cons: true, bestFor: true, notFor: true, pricingModel: true },
    orderBy: { name: 'asc' },
  });

  console.log(`Filling ${tools.length} tools...`);
  let success = 0;

  for (const tool of tools) {
    const features = FEATURES[tool.slug];
    if (!features) {
      console.log(`  ⚠ No features defined for ${tool.slug} — skipping`);
      continue;
    }

    const verdict = buildVerdict(tool);

    await prisma.product.update({
      where: { id: tool.id },
      data: { verdict, keyFeatures: features },
    });

    console.log(`  ✓ ${tool.name}`);
    success++;
  }

  console.log(`\nDone: ${success}/${tools.length} updated`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
