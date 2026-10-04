/**
 * update-riverside.ts
 * Real content + pricing for Riverside.fm
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/update-riverside.ts
 */
import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();

const TODAY = new Date("2026-10-04");

async function main() {
  await prisma.product.update({
    where: { slug: "riverside" },
    data: {
      name: "Riverside",
      shortDescription:
        "Remote recording platform for podcasts and video interviews with studio-quality local recording, AI editing, and live streaming.",
      description:
        "Riverside is a browser-based recording platform built for podcasters, video creators, and marketers who need studio-quality audio and video from remote guests. Unlike Zoom or Google Meet, Riverside records each participant locally in up to 4K video and 48kHz audio, then syncs the tracks in the cloud—so bad internet connections don't degrade recording quality. The platform includes a text-based AI editor for trimming and repurposing content, magic clips for social media, AI transcription, captions, audio enhancement, and podcast hosting with distribution to Spotify, Apple Podcasts, YouTube, and more. The Grow plan adds full HD live streaming to unlimited destinations including YouTube, LinkedIn, and TikTok. The Webinar plan supports up to 100 registrants with Q&A, polls, and HubSpot lead capture. All paid plans include a 14-day free trial.",
      websiteUrl: "https://riverside.fm",
      pricingModel: PricingModel.SUBSCRIPTION,
      hasFreePlan: false,
      hasFreeTrial: true,
      keyFeatures: [
        "Local 4K video and 48kHz audio recording per participant, unaffected by internet quality",
        "Text-based AI editor for trimming, repurposing, and exporting clips",
        "Magic Clips: AI-generated short-form clips for social media",
        "Podcast hosting and one-click publishing to Spotify, Apple, YouTube, Instagram, and LinkedIn",
        "Full HD 1080p live streaming to unlimited destinations on Grow and higher plans",
        "Webinar tools with registration, Q&A, polls, and HubSpot CRM integration",
        "14-day free trial on all paid plans",
      ].join("\n"),
      bestFor:
        "Podcasters, content creators, and marketers who record remote interviews and need studio-quality audio/video without expensive studio equipment",
      notFor:
        "Teams who primarily need video conferencing (use Zoom/Meet instead), or solo creators who only need screen recording without guest tracks",
      verdict:
        "Riverside is the go-to tool for remote podcast and video recording because local recording quality is simply better than screen-capture solutions. The AI editing and clip tools save hours of post-production. At $24–$34/month billed annually, it's priced competitively for professional creators. Descript is a stronger choice if post-production editing is your primary need.",
      seoTitle: "Riverside Review: Pricing, Features & Plans",
      seoDescription:
        "Riverside review: 4K remote recording for podcasts and video with AI editing and live streaming. Pro plan from $24/month (billed annually), 14-day free trial.",
      lastReviewedAt: TODAY,
      pricingPlans: {
        deleteMany: {},
        create: [
          {
            name: "Pro",
            priceAmount: 24,
            currency: "USD",
            billingPeriod: "monthly (billed annually)",
            priceLabel: "$24/month (billed annually)",
            description: "4K video, unlimited recording, text-based editing, AI tools, podcast hosting, 1 studio, 15 hrs track downloads/month.",
            sortOrder: 0,
          },
          {
            name: "Grow",
            priceAmount: 34,
            currency: "USD",
            billingPeriod: "monthly (billed annually)",
            priceLabel: "$34/month (billed annually)",
            description: "Everything in Pro + live streaming to unlimited destinations, social scheduling, newsletter, video hosting, 2 studios.",
            sortOrder: 1,
          },
          {
            name: "Webinar",
            priceAmount: 79,
            currency: "USD",
            billingPeriod: "monthly (billed annually)",
            priceLabel: "$79/month (billed annually)",
            description: "Everything in Grow + webinars with up to 100 registrants, Q&A, polls, lead capture, HubSpot integration, 3 studios.",
            sortOrder: 2,
          },
          {
            name: "Business",
            priceAmount: null,
            currency: "USD",
            billingPeriod: null,
            priceLabel: "Custom pricing",
            description: "Up to 10,000 webinar registrants, unlimited studios, API access, SSO, SOC2 compliance, and dedicated CSM.",
            sortOrder: 3,
          },
        ],
      },
    },
  });
  console.log("Done — Riverside updated.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
