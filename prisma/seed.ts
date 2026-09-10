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

const products = [
  { name: "Notion", slug: "notion", websiteUrl: "https://www.notion.so", description: "A flexible workspace for notes, docs and team knowledge.", category: "business-productivity", pricingModel: PricingModel.FREEMIUM },
  { name: "ElevenLabs", slug: "elevenlabs", websiteUrl: "https://elevenlabs.io", description: "Natural AI voice generation for creators and product teams.", category: "ai-tools", pricingModel: PricingModel.FREEMIUM },
  { name: "Figma", slug: "figma", websiteUrl: "https://www.figma.com", description: "Collaborative design and prototyping for modern product teams.", category: "design-creative", pricingModel: PricingModel.FREEMIUM },
  { name: "Ahrefs", slug: "ahrefs", websiteUrl: "https://ahrefs.com", description: "An SEO toolkit for research, content and growth.", category: "marketing-seo", pricingModel: PricingModel.SUBSCRIPTION },
  { name: "Vercel", slug: "vercel", websiteUrl: "https://vercel.com", description: "The frontend cloud for shipping fast, scalable web experiences.", category: "development-coding", pricingModel: PricingModel.FREEMIUM },
  { name: "Descript", slug: "descript", websiteUrl: "https://www.descript.com", description: "Edit video and podcasts by editing text.", category: "video-audio", pricingModel: PricingModel.FREEMIUM },
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
  await prisma.storyPage.deleteMany();
  await prisma.story.deleteMany();
  await prisma.editorialListItem.deleteMany();
  await prisma.editorialList.deleteMany();
  await prisma.comparison.deleteMany();
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

  const tags = await Promise.all(["collaboration", "creator-tools", "seo", "developer-tools"].map((name) => prisma.tag.create({ data: { name, slug: name } })));
  const useCases = await Promise.all(["team-collaboration", "content-creation", "web-development"].map((name) => prisma.useCase.create({ data: { name: name.replaceAll("-", " "), slug: name } })));
  const audiences = await Promise.all(["startups", "creators", "developers"].map((name) => prisma.audience.create({ data: { name: name[0].toUpperCase() + name.slice(1), slug: name } })));
  const platforms = await Promise.all(["web", "macos", "windows"].map((name) => prisma.platform.create({ data: { name: name.toUpperCase(), slug: name } })));

  const createdProducts = [];
  for (const [index, item] of products.entries()) {
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        shortDescription: item.description,
        description: `${item.description} This development listing is editorially curated for the TopToolsPick directory.`,
        websiteUrl: item.websiteUrl,
        categoryId: categoryIds.get(item.category)!,
        pricingModel: item.pricingModel,
        hasFreePlan: item.pricingModel === PricingModel.FREEMIUM,
        hasFreeTrial: item.pricingModel === PricingModel.SUBSCRIPTION,
        rating: 4.6,
        editorialScore: 92 - index,
        featured: index < 3,
        verified: false,
        pros: null,
        cons: null,
        bestFor: null,
        affiliatePrograms: {
          create: {
            name: "Development affiliate listing",
            network: "Unverified development data",
            status: "PENDING_VERIFICATION",
            disclosure: "Affiliate availability and commercial terms require verification before publication.",
            links: { create: { label: "Visit website", url: item.websiteUrl, region: "global", enabled: false } },
          },
        },
        pricingPlans: {
          create: {
            name: item.pricingModel === PricingModel.FREEMIUM ? "Free tier" : "Standard",
            priceLabel: item.pricingModel === PricingModel.FREEMIUM ? "Free plan available" : "See current plans",
            currency: "USD",
            billingPeriod: item.pricingModel === PricingModel.SUBSCRIPTION ? "monthly" : null,
          },
        },
        tags: { create: [{ tagId: tags[index % tags.length].id }] },
        useCases: { create: [{ useCaseId: useCases[index % useCases.length].id }] },
        audiences: { create: [{ audienceId: audiences[index % audiences.length].id }] },
        platforms: { create: [{ platformId: platforms[index % platforms.length].id }] },
      },
    });
    createdProducts.push(product);
    await prisma.review.create({
      data: { productId: product.id, title: "Development editorial note", body: "A development-only editorial note for testing the review architecture.", score: 5, author: "TopToolsPick editorial team", published: true },
    });
  }

  await prisma.comparison.create({
    data: {
      slug: "notion-vs-figma",
      title: "Notion vs Figma",
      productAId: createdProducts[0].id,
      productBId: createdProducts[2].id,
      verdict: "These products solve different problems: Notion is a flexible knowledge workspace, while Figma is focused on collaborative product design.",
    },
  });
  await prisma.editorialList.create({
    data: {
      slug: "ai-tools",
      title: "Best AI tools to explore",
      description: "A development editorial shortlist of AI tools, ranked for practical exploration and ongoing research.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      seoTitle: "Best AI tools | TopToolsPick",
      seoDescription: "A curated development shortlist of AI tools worth exploring.",
      items: {
        create: [
          { productId: createdProducts[1].id, rank: 1, rationale: "Included as a development example for the AI tools editorial workflow." },
        ],
      },
    },
  });
  for (const [index, article] of articles.entries()) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: { ...article, status: "PUBLISHED", publishedAt: new Date(Date.now() - index * 86_400_000), author: null, source: null },
      create: { ...article, status: "PUBLISHED", publishedAt: new Date(Date.now() - index * 86_400_000), author: null, source: null },
    });
  }
  await prisma.story.create({
    data: {
      slug: "development-story-draft",
      title: "Development story draft",
      description: "A draft record for validating the Web Story publishing architecture.",
      status: "DRAFT",
      pages: { create: [{ sortOrder: 0, text: "Add verified media before publishing this story." }] },
    },
  });
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
