/**
 * update-udemy-mailchimp.ts
 * Real content + pricing for Udemy and Mailchimp
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/update-udemy-mailchimp.ts
 */
import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();

const TODAY = new Date("2026-10-04");

type Plan = {
  name: string;
  priceAmount?: number | null;
  currency?: string;
  billingPeriod?: string | null;
  priceLabel: string;
  description?: string;
  sortOrder: number;
};

type ProductUpdate = {
  slug: string;
  data: Parameters<typeof prisma.product.update>[0]["data"];
  plans: Plan[];
};

const updates: ProductUpdate[] = [
  {
    slug: "udemy",
    plans: [
      {
        name: "Individual Courses",
        priceAmount: null,
        currency: "USD",
        billingPeriod: null,
        priceLabel: "From $9.99 per course (frequent sales)",
        description: "Buy courses individually. Prices vary; most courses go on sale for $10–$20.",
        sortOrder: 0,
      },
      {
        name: "Personal Plan",
        priceAmount: 16.58,
        currency: "USD",
        billingPeriod: "monthly (billed annually at $199/year)",
        priceLabel: "$16.58/month (billed annually)",
        description: "Unlimited access to 28,000+ top courses, certification prep, AI coding exercises, and goal-focused recommendations.",
        sortOrder: 1,
      },
      {
        name: "Team Plan",
        priceAmount: 30,
        currency: "USD",
        billingPeriod: "per user/month (billed annually)",
        priceLabel: "~$30/user/month (billed annually)",
        description: "For 2–50 people. Includes 28,000+ courses, analytics, adoption reports, and 15-language international collection.",
        sortOrder: 2,
      },
      {
        name: "Enterprise Plan",
        priceAmount: null,
        currency: "USD",
        billingPeriod: null,
        priceLabel: "Custom pricing",
        description: "For 20+ people. Adds 30,000+ courses, advanced analytics, dedicated customer success, and customizable content.",
        sortOrder: 3,
      },
    ],
    data: {
      name: "Udemy",
      shortDescription:
        "Online learning marketplace with 250,000+ courses on technology, business, design, and personal development, taught by independent instructors.",
      description:
        "Udemy is the world's largest online course marketplace, hosting over 250,000 courses from independent instructors across programming, data science, design, business, marketing, and personal development. Learners can purchase individual courses outright—typically $10–$20 during frequent sales—or subscribe to the Personal Plan for unlimited access to 28,000+ curated top courses at $16.58/month billed annually. Courses include lifetime access, certificates of completion, and instructor Q&A. Udemy Business offers team and enterprise plans with analytics, learning paths, and an international course collection in 15 languages. The platform hosts over 70 million students and 230,000 instructors worldwide.",
      websiteUrl: "https://www.udemy.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "250,000+ courses across technology, business, design, and personal development",
        "Buy individual courses with lifetime access—no subscription required",
        "Personal Plan for unlimited access to 28,000+ top courses at a flat monthly rate",
        "Certificates of completion for every course",
        "AI-powered coding exercises and goal-focused course recommendations",
        "Udemy Business team plans with analytics, learning paths, and 15-language content",
        "Free courses available across all categories",
      ].join("\n"),
      bestFor:
        "Self-directed learners who want to pick up specific technical or business skills at their own pace, and businesses that need scalable employee training",
      notFor:
        "Learners who need accredited degrees or structured academic programs, or those who prefer live instructor-led cohort courses",
      verdict:
        "Udemy's marketplace model gives you an enormous breadth of courses at a low per-course cost—especially during sales. The Personal Plan is best if you plan to take several courses per year. Quality varies by instructor, so check ratings and reviews before buying, but the top-rated courses rival paid bootcamp content at a fraction of the price.",
      seoTitle: "Udemy Review: Pricing, Courses & Personal Plan",
      seoDescription:
        "Udemy review: 250,000+ online courses from $9.99 per course or $16.58/month with the Personal Plan. Best for self-paced learning in tech, business, and design.",
      lastReviewedAt: TODAY,
    },
  },
  {
    slug: "mailchimp",
    plans: [
      {
        name: "Free",
        priceAmount: 0,
        currency: "USD",
        billingPeriod: null,
        priceLabel: "Free (up to 500 contacts)",
        description: "Up to 500 contacts, 500 emails/month, 1 seat, limited templates, email support for first 30 days only.",
        sortOrder: 0,
      },
      {
        name: "Essentials",
        priceAmount: 13,
        currency: "USD",
        billingPeriod: "monthly",
        priceLabel: "From $13/month (500 contacts)",
        description: "Up to 3 seats, 3 audiences, pre-built templates, email scheduling, remove Mailchimp branding, 24/7 email & chat support.",
        sortOrder: 1,
      },
      {
        name: "Standard",
        priceAmount: 20,
        currency: "USD",
        billingPeriod: "monthly",
        priceLabel: "From $20/month (500 contacts)",
        description: "Up to 5 seats, automations (up to 200 flows), generative AI, custom reports, dynamic content, and 1 onboarding session.",
        sortOrder: 2,
      },
      {
        name: "Premium",
        priceAmount: 350,
        currency: "USD",
        billingPeriod: "monthly",
        priceLabel: "From $350/month (500 contacts)",
        description: "Unlimited seats and audiences, phone & priority support, 4 onboarding sessions, and advanced segmentation.",
        sortOrder: 3,
      },
    ],
    data: {
      name: "Mailchimp",
      shortDescription:
        "Email marketing and automation platform for small businesses, with a free plan for up to 500 contacts and advanced segmentation on paid tiers.",
      description:
        "Mailchimp is one of the most widely used email marketing platforms, serving over 12 million businesses. It offers a drag-and-drop email builder, audience segmentation, automation flows, A/B testing, landing pages, and detailed campaign analytics. The free plan covers up to 500 contacts and 500 emails per month—enough for early-stage businesses getting started with email marketing. Paid plans unlock more contacts, seats, and automation steps: Essentials removes Mailchimp branding and adds scheduling; Standard adds up to 200 automation flows, generative AI writing, and custom reports; Premium is for larger teams needing unlimited audiences and phone support. Mailchimp is now part of Intuit.",
      websiteUrl: "https://mailchimp.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "Drag-and-drop email builder with 100+ pre-built templates",
        "Free plan for up to 500 contacts and 500 emails per month",
        "Marketing automation flows for welcome sequences, abandoned cart, and re-engagement",
        "Audience segmentation by behavior, purchase history, and custom tags",
        "A/B and multivariate testing for subject lines and content",
        "Landing pages, signup forms, and pop-ups included on all plans",
        "300+ integrations including Shopify, WooCommerce, Salesforce, and Zapier",
      ].join("\n"),
      bestFor:
        "Small businesses and e-commerce stores that want an all-in-one email marketing platform with a generous free tier and beginner-friendly automation",
      notFor:
        "High-volume senders or enterprises that need advanced CRM features, SMS at scale, or lower per-contact pricing than Mailchimp offers at larger lists",
      verdict:
        "Mailchimp's free plan is one of the most generous entry points in email marketing. The platform is easy to learn, the template library is strong, and the automation builder covers most small business needs. Pricing scales steeply with list size, which pushes larger senders toward alternatives like Klaviyo or ActiveCampaign—but for businesses under 2,500 contacts, Mailchimp is hard to beat for ease of use.",
      seoTitle: "Mailchimp Review: Pricing, Features & Free Plan",
      seoDescription:
        "Mailchimp review: email marketing with a free plan for 500 contacts and 500 emails/month. Paid plans from $13/month with automation, segmentation, and A/B testing.",
      lastReviewedAt: TODAY,
    },
  },
];

async function main() {
  let updated = 0;
  for (const { slug, data, plans } of updates) {
    try {
      await prisma.product.update({
        where: { slug },
        data: {
          ...data,
          pricingPlans: {
            deleteMany: {},
            create: plans,
          },
        },
      });
      console.log(`  ✓ ${slug}`);
      updated++;
    } catch (e: unknown) {
      console.error(`  ✗ ${slug}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  console.log(`\nDone — updated ${updated} / ${updates.length} products.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
