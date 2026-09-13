import { PrismaClient, PricingModel } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  ["AI Tools", "ai-tools", "Discover practical AI tools for work and creativity."],
  ["Website & Hosting", "website-hosting", "Reliable platforms for launching online."],
  ["Marketing & SEO", "marketing-seo", "Tools that help teams grow and measure demand."],
  ["Design & Creative", "design-creative", "Creative software and resources for modern teams."],
  ["Business & Productivity", "business-productivity", "Build better systems and get more done."],
  ["Development & Coding", "development-coding", "Tools for developers and technical teams."],
  ["E-commerce", "e-commerce", "Platforms and services for online commerce."],
  ["Education & Courses", "education-courses", "Learn valuable skills from trusted platforms."],
  ["Video & Audio", "video-audio", "Create, edit and publish better media."],
  ["Finance & Business Services", "finance-business-services", "Services for confident business decisions."],
  ["Cybersecurity & Privacy", "cybersecurity-privacy", "Protect your work, data and identity."],
  ["Remote Work", "remote-work", "Collaboration tools for distributed teams."],
] as const;

const tags = [
  ["Collaboration", "collaboration"],
  ["Creator tools", "creator-tools"],
  ["SEO", "seo"],
  ["Developer tools", "developer-tools"],
  ["AI", "ai"],
  ["Design", "design"],
  ["Video", "video"],
  ["Analytics", "analytics"],
] as const;

const useCases = [
  ["Team collaboration", "team-collaboration"],
  ["Content creation", "content-creation"],
  ["Web development", "web-development"],
  ["Research", "research"],
  ["Marketing analytics", "marketing-analytics"],
  ["Video editing", "video-editing"],
] as const;

const audiences = [
  ["Startups", "startups"],
  ["Creators", "creators"],
  ["Developers", "developers"],
  ["Marketers", "marketers"],
  ["Enterprise teams", "enterprise-teams"],
] as const;

const platforms = [
  ["Web", "web"],
  ["macOS", "macos"],
  ["Windows", "windows"],
  ["iOS", "ios"],
  ["Android", "android"],
  ["Linux", "linux"],
] as const;

/**
 * Placeholder catalogue. Every category carries at least two tools so the comparison
 * builder at /compare has something to line up. Copy is intentionally generic and
 * verifiable at a glance - replace it with real editorial through /admin.
 */
const products = [
  // AI Tools
  {
    name: "ChatGPT", slug: "chatgpt", websiteUrl: "https://chatgpt.com", category: "ai-tools",
    description: "A general-purpose AI assistant for writing, analysis and everyday questions.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.7, editorialScore: 94, featured: true,
    bestFor: "Broad, everyday assistance across writing, summarising and analysis.",
    pros: "Wide general capability, a large ecosystem of integrations, and a usable free tier.",
    cons: "Output still needs review for factual work, and the best models sit behind the paid plan.",
    entryPlan: "Free plan available", tags: ["ai"], useCases: ["research", "content-creation"], audiences: ["creators", "startups"], platforms: ["web", "ios", "android"],
  },
  {
    name: "Claude", slug: "claude", websiteUrl: "https://claude.ai", category: "ai-tools",
    description: "An AI assistant built for long documents, careful reasoning and writing.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.7, editorialScore: 93, featured: true,
    bestFor: "Long-form reading and writing where tone and nuance matter.",
    pros: "Handles very long inputs well and keeps a consistent, readable writing voice.",
    cons: "Fewer third-party integrations than the largest incumbents.",
    entryPlan: "Free plan available", tags: ["ai"], useCases: ["research", "content-creation"], audiences: ["creators", "enterprise-teams"], platforms: ["web", "macos", "ios", "android"],
  },
  {
    name: "Perplexity", slug: "perplexity", websiteUrl: "https://www.perplexity.ai", category: "ai-tools",
    description: "An answer engine that cites its sources as you research.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.4, editorialScore: 88, featured: false,
    bestFor: "Research questions where you want to check the sources behind an answer.",
    pros: "Inline citations make verification fast, and the free tier is genuinely usable.",
    cons: "Less suited to long-form drafting than a general assistant.",
    entryPlan: "Free plan available", tags: ["ai", "analytics"], useCases: ["research"], audiences: ["marketers", "startups"], platforms: ["web", "ios", "android"],
  },
  {
    name: "ElevenLabs", slug: "elevenlabs", websiteUrl: "https://elevenlabs.io", category: "ai-tools",
    description: "Natural AI voice generation for creators and product teams.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.5, editorialScore: 89, featured: false,
    bestFor: "Adding narration or synthetic voice without booking a studio.",
    pros: "Strong voice quality across languages, with a straightforward API.",
    cons: "Usage-based costs climb quickly at production volume.",
    entryPlan: "Free plan available", tags: ["ai", "creator-tools"], useCases: ["content-creation"], audiences: ["creators"], platforms: ["web"],
  },

  // Business & Productivity
  {
    name: "Notion", slug: "notion", websiteUrl: "https://www.notion.so", category: "business-productivity",
    description: "A flexible workspace for notes, docs and team knowledge.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.6, editorialScore: 92, featured: true,
    bestFor: "Teams that want documents, wikis and light databases in one place.",
    pros: "Very flexible structure and a large template ecosystem.",
    cons: "That flexibility needs conventions, or workspaces drift into clutter.",
    entryPlan: "Free plan available", tags: ["collaboration"], useCases: ["team-collaboration"], audiences: ["startups"], platforms: ["web", "macos", "windows", "ios", "android"],
  },
  {
    name: "Airtable", slug: "airtable", websiteUrl: "https://www.airtable.com", category: "business-productivity",
    description: "A spreadsheet-database hybrid for structured team workflows.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.4, editorialScore: 86, featured: false,
    bestFor: "Structured, record-based work that a spreadsheet has outgrown.",
    pros: "Strong relational structure with views and automations built in.",
    cons: "Per-seat pricing and record limits become the constraint as teams grow.",
    entryPlan: "Free plan available", tags: ["collaboration", "analytics"], useCases: ["team-collaboration"], audiences: ["startups", "enterprise-teams"], platforms: ["web", "ios", "android"],
  },
  {
    name: "Asana", slug: "asana", websiteUrl: "https://asana.com", category: "business-productivity",
    description: "Project and task management for cross-functional teams.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.3, editorialScore: 84, featured: false,
    bestFor: "Coordinating multi-step projects across several teams.",
    pros: "Clear task ownership, dependencies and timeline views.",
    cons: "Reporting and automation features are gated to higher tiers.",
    entryPlan: "Free plan available", tags: ["collaboration"], useCases: ["team-collaboration"], audiences: ["enterprise-teams"], platforms: ["web", "macos", "windows", "ios", "android"],
  },
  {
    name: "Slack", slug: "slack", websiteUrl: "https://slack.com", category: "business-productivity",
    description: "Channel-based messaging and integrations for teams.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.4, editorialScore: 85, featured: false,
    bestFor: "Day-to-day team communication with a deep integration ecosystem.",
    pros: "Excellent search, a huge app directory and reliable clients on every platform.",
    cons: "The free plan limits message history, and channel sprawl needs active management.",
    entryPlan: "Free plan available", tags: ["collaboration"], useCases: ["team-collaboration"], audiences: ["startups", "enterprise-teams"], platforms: ["web", "macos", "windows", "linux", "ios", "android"],
  },

  // Design & Creative
  {
    name: "Figma", slug: "figma", websiteUrl: "https://www.figma.com", category: "design-creative",
    description: "Collaborative design and prototyping for modern product teams.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.8, editorialScore: 95, featured: false,
    bestFor: "Product design work that several people edit and review together.",
    pros: "Real-time collaboration, strong component systems and a broad plugin ecosystem.",
    cons: "Editor seats are priced per person, which adds up for larger teams.",
    entryPlan: "Free plan available", tags: ["design", "collaboration"], useCases: ["team-collaboration"], audiences: ["developers", "creators"], platforms: ["web", "macos", "windows"],
  },
  {
    name: "Canva", slug: "canva", websiteUrl: "https://www.canva.com", category: "design-creative",
    description: "Template-driven design for social, documents and presentations.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.5, editorialScore: 87, featured: false,
    bestFor: "Non-designers producing on-brand assets quickly.",
    pros: "Very low learning curve with a large template and stock library.",
    cons: "Less precise than a dedicated design tool for detailed interface work.",
    entryPlan: "Free plan available", tags: ["design", "creator-tools"], useCases: ["content-creation"], audiences: ["marketers", "creators"], platforms: ["web", "macos", "windows", "ios", "android"],
  },
  {
    name: "Framer", slug: "framer", websiteUrl: "https://www.framer.com", category: "design-creative",
    description: "Design and publish production websites from a visual canvas.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.3, editorialScore: 83, featured: false,
    bestFor: "Designers shipping a marketing site without a separate build step.",
    pros: "Design and publishing live in one tool, with good animation controls.",
    cons: "Less suited to sites that need heavy custom backend logic.",
    entryPlan: "Free plan available", tags: ["design"], useCases: ["web-development", "content-creation"], audiences: ["creators", "startups"], platforms: ["web", "macos"],
  },

  // Development & Coding
  {
    name: "Vercel", slug: "vercel", websiteUrl: "https://vercel.com", category: "development-coding",
    description: "The frontend cloud for shipping fast, scalable web experiences.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.6, editorialScore: 91, featured: false,
    bestFor: "Deploying frontend applications with minimal infrastructure work.",
    pros: "Preview deployments per branch and a very short path from commit to live.",
    cons: "Bandwidth and function usage can get expensive at scale.",
    entryPlan: "Free plan available", tags: ["developer-tools"], useCases: ["web-development"], audiences: ["developers"], platforms: ["web"],
  },
  {
    name: "GitHub", slug: "github", websiteUrl: "https://github.com", category: "development-coding",
    description: "Code hosting, review and automation for software teams.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.7, editorialScore: 93, featured: false,
    bestFor: "Hosting repositories and running CI alongside code review.",
    pros: "The default home for open source, with Actions built into the same workflow.",
    cons: "Actions minutes and advanced security features are billed separately.",
    entryPlan: "Free plan available", tags: ["developer-tools", "collaboration"], useCases: ["web-development", "team-collaboration"], audiences: ["developers"], platforms: ["web", "macos", "windows", "linux"],
  },
  {
    name: "Linear", slug: "linear", websiteUrl: "https://linear.app", category: "development-coding",
    description: "Issue tracking and planning built for software teams.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.6, editorialScore: 90, featured: false,
    bestFor: "Engineering teams that want fast, opinionated issue tracking.",
    pros: "Exceptionally fast interface with keyboard-first navigation.",
    cons: "Deliberately opinionated, so it flexes less than general project tools.",
    entryPlan: "Free plan available", tags: ["developer-tools", "collaboration"], useCases: ["team-collaboration"], audiences: ["developers", "startups"], platforms: ["web", "macos", "windows"],
  },

  // Marketing & SEO
  {
    name: "Ahrefs", slug: "ahrefs", websiteUrl: "https://ahrefs.com", category: "marketing-seo",
    description: "An SEO toolkit for research, content and growth.",
    pricingModel: PricingModel.SUBSCRIPTION, rating: 4.6, editorialScore: 90, featured: false,
    bestFor: "Backlink and keyword research backed by a large index.",
    pros: "Strong link data and a clear, fast interface.",
    cons: "No free tier, and credit limits apply on lower plans.",
    entryPlan: "Paid plans only", tags: ["seo", "analytics"], useCases: ["marketing-analytics", "research"], audiences: ["marketers"], platforms: ["web"],
  },
  {
    name: "Semrush", slug: "semrush", websiteUrl: "https://www.semrush.com", category: "marketing-seo",
    description: "A broad marketing suite spanning SEO, ads and content research.",
    pricingModel: PricingModel.SUBSCRIPTION, rating: 4.4, editorialScore: 86, featured: false,
    bestFor: "Teams that want SEO, paid search and content tooling in one subscription.",
    pros: "Very wide feature coverage across marketing channels.",
    cons: "The breadth makes it harder to learn, and seats are charged separately.",
    entryPlan: "Limited free account, paid plans for full access", tags: ["seo", "analytics"], useCases: ["marketing-analytics"], audiences: ["marketers", "enterprise-teams"], platforms: ["web"],
  },
  {
    name: "Mailchimp", slug: "mailchimp", websiteUrl: "https://mailchimp.com", category: "marketing-seo",
    description: "Email marketing and automation for growing audiences.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.1, editorialScore: 80, featured: false,
    bestFor: "Running newsletters and basic lifecycle email without a developer.",
    pros: "Approachable editor with automation and reporting built in.",
    cons: "Costs scale with contact count, including unsubscribed contacts on some plans.",
    entryPlan: "Free plan available", tags: ["analytics"], useCases: ["marketing-analytics", "content-creation"], audiences: ["marketers", "startups"], platforms: ["web", "ios", "android"],
  },

  // Video & Audio
  {
    name: "Descript", slug: "descript", websiteUrl: "https://www.descript.com", category: "video-audio",
    description: "Edit video and podcasts by editing text.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.5, editorialScore: 88, featured: false,
    bestFor: "Podcast and talking-head editing driven by the transcript.",
    pros: "Transcript-based editing removes the slowest step in most content pipelines.",
    cons: "Less capable than a timeline editor for complex visual work.",
    entryPlan: "Free plan available", tags: ["video", "creator-tools"], useCases: ["video-editing", "content-creation"], audiences: ["creators"], platforms: ["web", "macos", "windows"],
  },
  {
    name: "CapCut", slug: "capcut", websiteUrl: "https://www.capcut.com", category: "video-audio",
    description: "Fast short-form video editing for social platforms.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.3, editorialScore: 82, featured: false,
    bestFor: "Turning raw clips into short-form social video quickly.",
    pros: "Generous free tier with templates, captions and effects ready to go.",
    cons: "Oriented to social formats rather than long-form production.",
    entryPlan: "Free plan available", tags: ["video", "creator-tools"], useCases: ["video-editing"], audiences: ["creators"], platforms: ["web", "macos", "windows", "ios", "android"],
  },
  {
    name: "Riverside", slug: "riverside", websiteUrl: "https://riverside.fm", category: "video-audio",
    description: "Remote recording that captures each guest locally in high quality.",
    pricingModel: PricingModel.FREEMIUM, rating: 4.2, editorialScore: 81, featured: false,
    bestFor: "Remote interviews where recording quality must survive a bad connection.",
    pros: "Local per-participant recording avoids call-quality artefacts.",
    cons: "Uploads take time after long sessions, and editing tools are lighter than dedicated editors.",
    entryPlan: "Free plan available", tags: ["video", "creator-tools"], useCases: ["video-editing", "content-creation"], audiences: ["creators"], platforms: ["web", "macos", "windows"],
  },
] as const;

const articles = [
  {
    title: "What to look for in an AI tool before you adopt it",
    slug: "what-to-look-for-in-an-ai-tool",
    excerpt: "A practical way to assess usefulness, control, and fit before adding another AI tool to your workflow.",
    content: "The best AI tool is not always the one with the longest feature list. Start with the task you want to improve, then look for clear controls, reliable output, and a workflow that your team can understand.\n\nA short trial is useful when it answers a specific question. Can the tool save time without adding review work? Does it handle your data responsibly? Does it fit the tools you already use? These questions usually reveal more than a broad promise.",
  },
  {
    title: "A calmer way to choose productivity software",
    slug: "a-calmer-way-to-choose-productivity-software",
    excerpt: "Good productivity software should make the next action clearer, not add another layer of maintenance.",
    content: "When every idea becomes a new app, the work of managing tools can become the work itself. A better starting point is to define the few moments that need support: capturing ideas, planning work, sharing context, or reviewing progress.\n\nChoose the simplest product that handles those moments well. Consistent use matters more than a long list of features, and a small system that stays visible is often more valuable than a perfect one that nobody opens.",
  },
  {
    title: "The useful technology trend is quieter software",
    slug: "the-useful-technology-trend-is-quieter-software",
    excerpt: "The most valuable digital products are becoming easier to understand, more focused, and less demanding of attention.",
    content: "Useful technology does not need to compete for attention. More products are being judged by how clearly they fit into an existing routine, how easy they are to leave, and how much control they give back to the people using them.\n\nThat shift is good news for anyone choosing software. Look for products that explain themselves, respect focus, and make their value apparent through everyday use rather than constant notifications.",
  },
] as const;

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.article.deleteMany();
  await prisma.storyPage.deleteMany();
  await prisma.story.deleteMany();
  await prisma.editorialListItem.deleteMany();
  await prisma.editorialList.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productUseCase.deleteMany();
  await prisma.productAudience.deleteMany();
  await prisma.productPlatform.deleteMany();
  await prisma.affiliateLink.deleteMany();
  await prisma.affiliateProgram.deleteMany();
  await prisma.pricingPlan.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.useCase.deleteMany();
  await prisma.audience.deleteMany();
  await prisma.platform.deleteMany();
  await prisma.category.deleteMany();

  const categoryIds = new Map<string, string>();
  for (const [name, slug, description] of categories) {
    const category = await prisma.category.create({ data: { name, slug, description } });
    categoryIds.set(slug, category.id);
  }

  const idsBySlug = async <T extends { id: string; slug: string }>(rows: T[]) => new Map(rows.map((row) => [row.slug, row.id]));
  const tagIds = await idsBySlug(await Promise.all(tags.map(([name, slug]) => prisma.tag.create({ data: { name, slug } }))));
  const useCaseIds = await idsBySlug(await Promise.all(useCases.map(([name, slug]) => prisma.useCase.create({ data: { name, slug } }))));
  const audienceIds = await idsBySlug(await Promise.all(audiences.map(([name, slug]) => prisma.audience.create({ data: { name, slug } }))));
  const platformIds = await idsBySlug(await Promise.all(platforms.map(([name, slug]) => prisma.platform.create({ data: { name, slug } }))));

  const productIds = new Map<string, string>();
  for (const item of products) {
    const isFreemium = item.pricingModel === PricingModel.FREEMIUM;
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        shortDescription: item.description,
        description: `${item.description} This is placeholder editorial copy for the TopToolsPick directory and should be replaced with a first-hand review.`,
        websiteUrl: item.websiteUrl,
        categoryId: categoryIds.get(item.category)!,
        pricingModel: item.pricingModel,
        hasFreePlan: isFreemium,
        hasFreeTrial: !isFreemium,
        rating: item.rating,
        editorialScore: item.editorialScore,
        featured: item.featured,
        verified: false,
        pros: item.pros,
        cons: item.cons,
        bestFor: item.bestFor,
        affiliatePrograms: {
          create: {
            name: "Placeholder affiliate listing",
            network: "Unverified placeholder data",
            status: "PENDING_VERIFICATION",
            disclosure: "Affiliate availability and commercial terms require verification before publication.",
            links: { create: { label: "Visit website", url: item.websiteUrl, region: "global", enabled: false } },
          },
        },
        pricingPlans: {
          create: {
            name: isFreemium ? "Free tier" : "Standard",
            priceLabel: item.entryPlan,
            currency: "USD",
            billingPeriod: isFreemium ? null : "monthly",
          },
        },
        tags: { create: item.tags.map((slug) => ({ tagId: tagIds.get(slug)! })) },
        useCases: { create: item.useCases.map((slug) => ({ useCaseId: useCaseIds.get(slug)! })) },
        audiences: { create: item.audiences.map((slug) => ({ audienceId: audienceIds.get(slug)! })) },
        platforms: { create: item.platforms.map((slug) => ({ platformId: platformIds.get(slug)! })) },
      },
    });
    productIds.set(item.slug, product.id);
    await prisma.review.create({
      data: { productId: product.id, title: "Placeholder editorial note", body: "Placeholder review copy. Replace this with a first-hand editorial assessment before relying on it.", score: 5, author: "TopToolsPick editorial team", published: true },
    });
  }

  await prisma.editorialList.create({
    data: {
      slug: "ai-tools",
      title: "Best AI tools to explore",
      description: "A placeholder editorial shortlist of AI tools, ranked for practical exploration and ongoing research.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      seoTitle: "Best AI tools | TopToolsPick",
      seoDescription: "A curated shortlist of AI tools worth exploring.",
      items: {
        create: [
          { productId: productIds.get("claude")!, rank: 1, rationale: "Handles long documents without losing the thread, which is where most assistants struggle." },
          { productId: productIds.get("chatgpt")!, rank: 2, rationale: "The broadest general capability and the widest integration ecosystem." },
          { productId: productIds.get("perplexity")!, rank: 3, rationale: "Inline citations make it the fastest way to check where an answer came from." },
        ],
      },
    },
  });

  for (const [index, article] of articles.entries()) {
    await prisma.article.create({
      data: { ...article, status: "PUBLISHED", publishedAt: new Date(Date.now() - index * 86_400_000), author: null, source: null },
    });
  }

  await prisma.story.create({
    data: {
      slug: "development-story-draft",
      title: "Development story draft",
      description: "A draft record for validating the Web Story publishing architecture.",
      status: "DRAFT",
      pages: { create: [{ sortOrder: 1, text: "Add verified media before publishing this story." }] },
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
