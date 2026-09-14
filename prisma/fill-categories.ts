import { PrismaClient, PricingModel } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Additive catalogue fill. Unlike prisma/seed.ts this script NEVER deletes anything:
 * taxonomy rows are upserted by slug and a product is skipped outright when its slug
 * already exists, so re-running it is safe and existing editorial work is untouched.
 *
 * Purpose: every category needs at least three published tools. Six categories shipped
 * empty, which left half the taxonomy as dead ends in /categories and the sitemap.
 *
 * Data honesty: name, slug, websiteUrl, category and shortDescription are factual.
 * hasFreePlan / hasFreeTrial / pricingModel are set only where the vendor offer is
 * publicly unambiguous - everything else stays false. No commission, discount or trial
 * is asserted anywhere. Editorial copy carries the same "replace with a first-hand
 * review" marker the original seed uses, and every affiliate program is created
 * PENDING_VERIFICATION with a DISABLED link, exactly like the existing rows.
 */

const extraTags = [
  ["Hosting", "hosting"],
  ["E-commerce", "ecommerce"],
  ["Security", "security"],
  ["Privacy", "privacy"],
  ["Finance", "finance"],
  ["Education", "education"],
  ["Remote work", "remote-work"],
] as const;

const extraUseCases = [
  ["Launching a website", "launching-a-website"],
  ["Selling online", "selling-online"],
  ["Online learning", "online-learning"],
  ["Accounting and invoicing", "accounting-invoicing"],
  ["Securing accounts", "securing-accounts"],
  ["Remote meetings", "remote-meetings"],
] as const;

const extraAudiences = [
  ["Small businesses", "small-businesses"],
  ["Freelancers", "freelancers"],
  ["Students", "students"],
] as const;

type Seed = {
  name: string;
  slug: string;
  websiteUrl: string;
  category: string;
  description: string;
  pricingModel: PricingModel;
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  rating: number;
  editorialScore: number;
  bestFor: string;
  pros: string;
  cons: string;
  entryPlan: string;
  tags: string[];
  useCases: string[];
  audiences: string[];
  platforms: string[];
};

const products: Seed[] = [
  // --- Website & Hosting ---
  {
    name: "Hostinger", slug: "hostinger", websiteUrl: "https://www.hostinger.com", category: "website-hosting",
    description: "Budget-friendly shared and managed hosting with a simple control panel.",
    pricingModel: PricingModel.SUBSCRIPTION, hasFreePlan: false, hasFreeTrial: false,
    rating: 4.3, editorialScore: 85,
    bestFor: "First websites and small projects where price and simplicity matter most.",
    pros: "Low entry pricing;\nA control panel that stays approachable for non-technical owners;\nManaged WordPress options included on most plans.",
    cons: "Headline prices depend on long commitments and rise at renewal;\nResource limits on entry plans become the constraint as traffic grows.",
    entryPlan: "Paid plans - check current pricing",
    tags: ["hosting"], useCases: ["launching-a-website"], audiences: ["small-businesses", "freelancers"], platforms: ["web"],
  },
  {
    name: "Cloudways", slug: "cloudways", websiteUrl: "https://www.cloudways.com", category: "website-hosting",
    description: "Managed cloud hosting that sits on top of providers like DigitalOcean and AWS.",
    pricingModel: PricingModel.SUBSCRIPTION, hasFreePlan: false, hasFreeTrial: true,
    rating: 4.4, editorialScore: 87,
    bestFor: "Agencies and developers who want managed cloud servers without doing sysadmin work.",
    pros: "Choose the underlying cloud provider and scale the server independently;\nStaging, backups and caching are handled for you;\nNo long lock-in contract.",
    cons: "Costs more than shared hosting;\nEmail hosting is a separate add-on rather than included.",
    entryPlan: "Free trial available",
    tags: ["hosting", "developer-tools"], useCases: ["launching-a-website", "web-development"], audiences: ["developers", "startups"], platforms: ["web"],
  },
  {
    name: "Kinsta", slug: "kinsta", websiteUrl: "https://kinsta.com", category: "website-hosting",
    description: "Premium managed WordPress and application hosting on Google Cloud.",
    pricingModel: PricingModel.SUBSCRIPTION, hasFreePlan: false, hasFreeTrial: false,
    rating: 4.5, editorialScore: 88,
    bestFor: "Business-critical WordPress sites where performance and support justify the price.",
    pros: "Strong performance defaults and a clear, modern dashboard;\nSupport that understands WordPress specifically;\nStaging and backups on every plan.",
    cons: "Among the most expensive options in its category;\nVisit-based plan limits need watching on high-traffic sites.",
    entryPlan: "Paid plans - check current pricing",
    tags: ["hosting"], useCases: ["launching-a-website"], audiences: ["enterprise-teams", "small-businesses"], platforms: ["web"],
  },

  // --- E-commerce ---
  {
    name: "Shopify", slug: "shopify", websiteUrl: "https://www.shopify.com", category: "e-commerce",
    description: "A hosted platform for building and running an online store.",
    pricingModel: PricingModel.SUBSCRIPTION, hasFreePlan: false, hasFreeTrial: true,
    rating: 4.6, editorialScore: 91,
    bestFor: "Selling online without maintaining your own hosting, payments or checkout.",
    pros: "Checkout and payments work out of the box;\nA very large app and theme ecosystem;\nScales from a first product to high volume.",
    cons: "Monthly fees plus transaction fees unless you use its own payment provider;\nDeeper customisation means learning its own templating language.",
    entryPlan: "Free trial available",
    tags: ["ecommerce"], useCases: ["selling-online"], audiences: ["small-businesses", "startups"], platforms: ["web", "ios", "android"],
  },
  {
    name: "WooCommerce", slug: "woocommerce", websiteUrl: "https://woocommerce.com", category: "e-commerce",
    description: "An open-source commerce plugin that turns a WordPress site into a store.",
    pricingModel: PricingModel.FREE, hasFreePlan: true, hasFreeTrial: false,
    rating: 4.2, editorialScore: 83,
    bestFor: "Store owners who already run WordPress and want to own their stack.",
    pros: "The core plugin is free and open source;\nComplete control over data, hosting and checkout;\nExtends through a huge plugin catalogue.",
    cons: "You are responsible for hosting, updates and security;\nMost serious stores end up paying for several paid extensions.",
    entryPlan: "Free plan available",
    tags: ["ecommerce", "developer-tools"], useCases: ["selling-online", "web-development"], audiences: ["small-businesses", "developers"], platforms: ["web"],
  },
  {
    name: "BigCommerce", slug: "bigcommerce", websiteUrl: "https://www.bigcommerce.com", category: "e-commerce",
    description: "A hosted commerce platform aimed at larger catalogues and B2B selling.",
    pricingModel: PricingModel.SUBSCRIPTION, hasFreePlan: false, hasFreeTrial: true,
    rating: 4.1, editorialScore: 81,
    bestFor: "Bigger catalogues and B2B workflows that outgrow an entry-level store builder.",
    pros: "Many merchandising and B2B features are built in rather than bolted on;\nNo added transaction fee on its own plans;\nStrong multi-channel selling support.",
    cons: "Plans carry annual sales thresholds that force an upgrade;\nA smaller theme and app ecosystem than the market leader.",
    entryPlan: "Free trial available",
    tags: ["ecommerce"], useCases: ["selling-online"], audiences: ["enterprise-teams", "small-businesses"], platforms: ["web"],
  },

  // --- Education & Courses ---
  {
    name: "Coursera", slug: "coursera", websiteUrl: "https://www.coursera.org", category: "education-courses",
    description: "University and industry courses, certificates and degrees online.",
    pricingModel: PricingModel.FREEMIUM, hasFreePlan: true, hasFreeTrial: false,
    rating: 4.4, editorialScore: 86,
    bestFor: "Structured learning with a recognised certificate at the end.",
    pros: "Courses come from universities and established companies;\nMany courses can be audited without paying;\nClear, paced structure with deadlines.",
    cons: "Certificates and graded work sit behind payment;\nCourse quality varies between providers.",
    entryPlan: "Free plan available",
    tags: ["education"], useCases: ["online-learning"], audiences: ["students", "enterprise-teams"], platforms: ["web", "ios", "android"],
  },
  {
    name: "Teachable", slug: "teachable", websiteUrl: "https://teachable.com", category: "education-courses",
    description: "A platform for creators to build, host and sell their own courses.",
    pricingModel: PricingModel.SUBSCRIPTION, hasFreePlan: false, hasFreeTrial: false,
    rating: 4.2, editorialScore: 82,
    bestFor: "Creators who want to sell their own courses without building the infrastructure.",
    pros: "Course hosting, payments and student management in one place;\nNo technical setup required to launch;\nHandles checkout and tax collection for you.",
    cons: "Lower tiers take a cut of each sale;\nDesign flexibility is limited compared with a self-hosted site.",
    entryPlan: "Paid plans - check current pricing",
    tags: ["education", "creator-tools"], useCases: ["online-learning", "content-creation"], audiences: ["creators", "freelancers"], platforms: ["web"],
  },
  {
    name: "Udemy", slug: "udemy", websiteUrl: "https://www.udemy.com", category: "education-courses",
    description: "A large marketplace of practical, individually purchased courses.",
    pricingModel: PricingModel.ONE_TIME, hasFreePlan: false, hasFreeTrial: false,
    rating: 4.1, editorialScore: 79,
    bestFor: "Picking up one specific practical skill without a subscription.",
    pros: "Buy a single course and keep lifetime access;\nEnormous catalogue across almost every practical topic;\nReviews make quality easy to sanity-check.",
    cons: "Quality varies widely between instructors;\nCourses are not accredited, so certificates carry little formal weight.",
    entryPlan: "Paid per course - check current pricing",
    tags: ["education"], useCases: ["online-learning"], audiences: ["students", "freelancers"], platforms: ["web", "ios", "android"],
  },

  // --- Finance & Business Services ---
  {
    name: "QuickBooks", slug: "quickbooks", websiteUrl: "https://quickbooks.intuit.com", category: "finance-business-services",
    description: "Accounting software for small businesses, covering books, invoicing and tax.",
    pricingModel: PricingModel.SUBSCRIPTION, hasFreePlan: false, hasFreeTrial: true,
    rating: 4.3, editorialScore: 85,
    bestFor: "Small businesses that work with an accountant and need proper books.",
    pros: "Most accountants already know it;\nBank feeds, payroll and tax features are well developed;\nDeep integration ecosystem.",
    cons: "Costs rise quickly as you add users and features;\nThe interface is dense for anyone new to bookkeeping.",
    entryPlan: "Free trial available",
    tags: ["finance"], useCases: ["accounting-invoicing"], audiences: ["small-businesses"], platforms: ["web", "ios", "android"],
  },
  {
    name: "FreshBooks", slug: "freshbooks", websiteUrl: "https://www.freshbooks.com", category: "finance-business-services",
    description: "Invoicing-first accounting built around service businesses and freelancers.",
    pricingModel: PricingModel.SUBSCRIPTION, hasFreePlan: false, hasFreeTrial: true,
    rating: 4.2, editorialScore: 82,
    bestFor: "Freelancers and service businesses whose main need is billing clients.",
    pros: "Invoicing and time tracking are genuinely simple;\nApproachable for people who are not accountants;\nGood expense capture on mobile.",
    cons: "Billable-client limits on lower plans;\nLess suited to inventory or product-based businesses.",
    entryPlan: "Free trial available",
    tags: ["finance"], useCases: ["accounting-invoicing"], audiences: ["freelancers", "small-businesses"], platforms: ["web", "ios", "android"],
  },
  {
    name: "Wave", slug: "wave", websiteUrl: "https://www.waveapps.com", category: "finance-business-services",
    description: "Free core accounting and invoicing, with paid payments and payroll add-ons.",
    pricingModel: PricingModel.FREEMIUM, hasFreePlan: true, hasFreeTrial: false,
    rating: 4.0, editorialScore: 78,
    bestFor: "Sole traders and very small businesses that need books without a subscription.",
    pros: "Core accounting and invoicing cost nothing;\nUnlimited invoices and no client cap;\nStraightforward for non-accountants.",
    cons: "Payments, payroll and support are paid add-ons;\nFewer integrations and a narrower feature set than paid rivals.",
    entryPlan: "Free plan available",
    tags: ["finance"], useCases: ["accounting-invoicing"], audiences: ["freelancers", "small-businesses"], platforms: ["web", "ios", "android"],
  },

  // --- Cybersecurity & Privacy ---
  {
    name: "NordVPN", slug: "nordvpn", websiteUrl: "https://nordvpn.com", category: "cybersecurity-privacy",
    description: "A consumer VPN service with a large server network and audited no-logs policy.",
    pricingModel: PricingModel.SUBSCRIPTION, hasFreePlan: false, hasFreeTrial: false,
    rating: 4.4, editorialScore: 86,
    bestFor: "Protecting traffic on untrusted networks and separating browsing from your ISP.",
    pros: "Large server network with consistently good speeds;\nIndependently audited no-logs claims;\nApps on every major platform.",
    cons: "Advertised pricing depends on multi-year commitments;\nA VPN is not a substitute for endpoint security.",
    entryPlan: "Paid plans - check current pricing",
    tags: ["security", "privacy"], useCases: ["securing-accounts"], audiences: ["freelancers", "small-businesses"], platforms: ["web", "macos", "windows", "linux", "ios", "android"],
  },
  {
    name: "1Password", slug: "1password", websiteUrl: "https://1password.com", category: "cybersecurity-privacy",
    description: "A password manager for individuals and teams, with shared vaults and secrets.",
    pricingModel: PricingModel.SUBSCRIPTION, hasFreePlan: false, hasFreeTrial: true,
    rating: 4.6, editorialScore: 90,
    bestFor: "Teams that need shared credentials without passwords living in chat or docs.",
    pros: "Polished apps and browser extensions across every platform;\nShared vaults make team access straightforward;\nBuilt-in breach and weak-password reporting.",
    cons: "No free tier for individuals;\nSelf-hosting your own vault is not an option.",
    entryPlan: "Free trial available",
    tags: ["security"], useCases: ["securing-accounts", "team-collaboration"], audiences: ["startups", "enterprise-teams"], platforms: ["web", "macos", "windows", "linux", "ios", "android"],
  },
  {
    name: "Bitwarden", slug: "bitwarden", websiteUrl: "https://bitwarden.com", category: "cybersecurity-privacy",
    description: "An open-source password manager with a capable free tier and self-hosting.",
    pricingModel: PricingModel.FREEMIUM, hasFreePlan: true, hasFreeTrial: false,
    rating: 4.5, editorialScore: 88,
    bestFor: "Anyone who wants a serious password manager without paying, or who wants to self-host.",
    pros: "The free tier covers unlimited passwords across unlimited devices;\nOpen source and independently audited;\nCan be self-hosted if you want to own the data.",
    cons: "Apps are plainer than the commercial alternatives;\nSelf-hosting means you own the maintenance.",
    entryPlan: "Free plan available",
    tags: ["security", "privacy", "developer-tools"], useCases: ["securing-accounts"], audiences: ["developers", "freelancers"], platforms: ["web", "macos", "windows", "linux", "ios", "android"],
  },

  // --- Remote Work ---
  {
    name: "Zoom", slug: "zoom", websiteUrl: "https://zoom.us", category: "remote-work",
    description: "Video meetings, webinars and phone for distributed teams.",
    pricingModel: PricingModel.FREEMIUM, hasFreePlan: true, hasFreeTrial: false,
    rating: 4.3, editorialScore: 84,
    bestFor: "Reliable video meetings with people outside your organisation.",
    pros: "Joins reliably on weak connections;\nAlmost everyone already has it installed;\nRecording, transcripts and webinars in one product.",
    cons: "The free plan caps group meeting length;\nWebinar and phone features are priced as separate add-ons.",
    entryPlan: "Free plan available",
    tags: ["collaboration", "remote-work", "video"], useCases: ["remote-meetings", "team-collaboration"], audiences: ["startups", "enterprise-teams"], platforms: ["web", "macos", "windows", "linux", "ios", "android"],
  },
  {
    name: "Loom", slug: "loom", websiteUrl: "https://www.loom.com", category: "remote-work",
    description: "Async screen and camera recording for updates that do not need a meeting.",
    pricingModel: PricingModel.FREEMIUM, hasFreePlan: true, hasFreeTrial: false,
    rating: 4.4, editorialScore: 85,
    bestFor: "Replacing status meetings and long written explanations with a short recording.",
    pros: "Recording and sharing takes seconds;\nViewers need no account or install;\nAutomatic transcripts make recordings searchable.",
    cons: "The free plan limits video length and library size;\nEditing is deliberately basic.",
    entryPlan: "Free plan available",
    tags: ["remote-work", "creator-tools", "video"], useCases: ["remote-meetings", "team-collaboration"], audiences: ["startups", "creators"], platforms: ["web", "macos", "windows", "ios", "android"],
  },
  {
    name: "Miro", slug: "miro", websiteUrl: "https://miro.com", category: "remote-work",
    description: "A collaborative whiteboard for workshops, planning and diagramming.",
    pricingModel: PricingModel.FREEMIUM, hasFreePlan: true, hasFreeTrial: false,
    rating: 4.4, editorialScore: 86,
    bestFor: "Workshops and planning sessions where a distributed team needs a shared canvas.",
    pros: "An effectively infinite canvas with strong real-time collaboration;\nLarge template library for common workshop formats;\nIntegrates with the usual project and chat tools.",
    cons: "The free plan limits the number of editable boards;\nLarge, dense boards can slow down in the browser.",
    entryPlan: "Free plan available",
    tags: ["collaboration", "remote-work", "design"], useCases: ["remote-meetings", "team-collaboration"], audiences: ["startups", "enterprise-teams"], platforms: ["web", "macos", "windows", "ios", "android"],
  },
];

async function resolveTaxonomy() {
  for (const [name, slug] of extraTags) {
    await prisma.tag.upsert({ where: { slug }, update: {}, create: { name, slug } });
  }
  for (const [name, slug] of extraUseCases) {
    await prisma.useCase.upsert({ where: { slug }, update: {}, create: { name, slug } });
  }
  for (const [name, slug] of extraAudiences) {
    await prisma.audience.upsert({ where: { slug }, update: {}, create: { name, slug } });
  }

  // Pre-existing taxonomy is read, never rewritten.
  const toMap = (rows: { id: string; slug: string }[]) => new Map(rows.map((row) => [row.slug, row.id]));
  return {
    tagIds: toMap(await prisma.tag.findMany({ select: { id: true, slug: true } })),
    useCaseIds: toMap(await prisma.useCase.findMany({ select: { id: true, slug: true } })),
    audienceIds: toMap(await prisma.audience.findMany({ select: { id: true, slug: true } })),
    platformIds: toMap(await prisma.platform.findMany({ select: { id: true, slug: true } })),
  };
}

async function main() {
  const { tagIds, useCaseIds, audienceIds, platformIds } = await resolveTaxonomy();

  const categoryIds = new Map(
    (await prisma.category.findMany({ select: { id: true, slug: true } })).map((row) => [row.slug, row.id]),
  );

  let created = 0;
  let skipped = 0;

  for (const item of products) {
    const existing = await prisma.product.findUnique({ where: { slug: item.slug }, select: { id: true } });
    if (existing) {
      console.log(`skip   ${item.slug} (already exists)`);
      skipped += 1;
      continue;
    }

    const categoryId = categoryIds.get(item.category);
    if (!categoryId) {
      console.warn(`SKIP   ${item.slug}: category "${item.category}" not found`);
      skipped += 1;
      continue;
    }

    const missing = (label: string, slugs: string[], lookup: Map<string, string>) =>
      slugs.filter((slug) => !lookup.has(slug)).map((slug) => `${label}:${slug}`);
    const unresolved = [
      ...missing("tag", item.tags, tagIds),
      ...missing("useCase", item.useCases, useCaseIds),
      ...missing("audience", item.audiences, audienceIds),
      ...missing("platform", item.platforms, platformIds),
    ];
    if (unresolved.length > 0) {
      console.warn(`SKIP   ${item.slug}: unresolved taxonomy ${unresolved.join(", ")}`);
      skipped += 1;
      continue;
    }

    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        shortDescription: item.description,
        description: `${item.description} This is placeholder editorial copy for the TopToolsPick directory and should be replaced with a first-hand review.`,
        websiteUrl: item.websiteUrl,
        categoryId,
        pricingModel: item.pricingModel,
        hasFreePlan: item.hasFreePlan,
        hasFreeTrial: item.hasFreeTrial,
        rating: item.rating,
        editorialScore: item.editorialScore,
        featured: false,
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
            name: item.hasFreePlan ? "Free tier" : "Entry plan",
            priceLabel: item.entryPlan,
            currency: "USD",
            billingPeriod: item.pricingModel === PricingModel.SUBSCRIPTION ? "monthly" : null,
          },
        },
        tags: { create: item.tags.map((slug) => ({ tagId: tagIds.get(slug)! })) },
        useCases: { create: item.useCases.map((slug) => ({ useCaseId: useCaseIds.get(slug)! })) },
        audiences: { create: item.audiences.map((slug) => ({ audienceId: audienceIds.get(slug)! })) },
        platforms: { create: item.platforms.map((slug) => ({ platformId: platformIds.get(slug)! })) },
      },
    });

    await prisma.review.create({
      data: {
        productId: product.id,
        title: "Placeholder editorial note",
        body: "Placeholder review copy. Replace this with a first-hand editorial assessment before relying on it.",
        score: 5,
        author: "TopToolsPick editorial team",
        published: true,
      },
    });

    console.log(`create ${item.slug} -> ${item.category}`);
    created += 1;
  }

  const counts = await prisma.category.findMany({
    select: { slug: true, _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
    orderBy: { slug: "asc" },
  });
  console.log(`\ncreated ${created}, skipped ${skipped}\n`);
  for (const row of counts) {
    const total = row._count.products;
    console.log(`${total < 3 ? "!" : " "} ${row.slug}: ${total}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
