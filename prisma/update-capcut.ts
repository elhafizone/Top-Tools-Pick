/**
 * update-capcut.ts
 * Real content + pricing for CapCut
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/update-capcut.ts
 */
import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();

const TODAY = new Date("2026-10-04");

async function main() {
  await prisma.product.update({
    where: { slug: "capcut" },
    data: {
      name: "CapCut",
      shortDescription:
        "Free AI-powered video editor for short-form content, with templates, auto-captions, background removal, and one-tap effects for TikTok, Instagram Reels, and YouTube Shorts.",
      description:
        "CapCut is a free video editing app by ByteDance (the company behind TikTok) designed for creators making short-form social media content. The mobile app has become one of the most-used editing tools globally, with over 1 billion downloads, due to its ease of use and extensive template library tuned to trending TikTok formats. Key features include auto-captions with multiple styles, AI background removal, speed ramp effects, keyframe animations, green screen, and a beat-sync tool that automatically cuts to music. The web and desktop versions extend the workflow to longer timelines. CapCut Pro removes the CapCut watermark, unlocks more templates, adds advanced AI features, and increases cloud storage. The free tier is genuinely powerful for most social content needs.",
      websiteUrl: "https://www.capcut.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "Auto-captions with multiple text styles and language detection",
        "AI background removal and green screen without chroma key setup",
        "Beat-sync: automatically cuts video to the beat of your background music",
        "1,000+ trending templates pre-optimized for TikTok, Reels, and Shorts",
        "Speed ramp and keyframe animation tools for cinematic effects",
        "Text-to-video and AI image generation (Pro)",
        "Available on iOS, Android, web browser, and desktop app",
      ].join("\n"),
      bestFor:
        "Social media creators, marketers, and individuals who create short-form video for TikTok, Instagram Reels, or YouTube Shorts and want powerful effects without a learning curve",
      notFor:
        "Professional video editors or filmmakers who need multi-track timelines, color grading workflows, or advanced audio mixing — Premiere Pro or DaVinci Resolve serve those needs better",
      verdict:
        "CapCut is the easiest path from raw footage to a polished short-form video. The template library stays current with trending formats, auto-captions are accurate, and the AI tools handle most of the tedious work. The free tier is enough for most creators; upgrade to Pro mainly to remove the watermark and access more AI generation features. The ByteDance ownership has raised privacy concerns in some markets worth considering.",
      seoTitle: "CapCut Review: Pricing, Features & Free Plan",
      seoDescription:
        "CapCut review: free AI video editor for TikTok, Reels, and Shorts. Auto-captions, templates, background removal, and beat-sync. Pro plan from $9.99/month.",
      lastReviewedAt: TODAY,
      pricingPlans: {
        deleteMany: {},
        create: [
          {
            name: "Free",
            priceAmount: 0,
            currency: "USD",
            billingPeriod: null,
            priceLabel: "Free",
            description:
              "All core editing features, 1,000+ templates, auto-captions, AI background removal, and beat-sync. Exports with CapCut watermark.",
            sortOrder: 0,
          },
          {
            name: "Pro",
            priceAmount: 9.99,
            currency: "USD",
            billingPeriod: "monthly",
            priceLabel: "$9.99/month (or ~$7.49/month billed annually)",
            description:
              "Remove CapCut watermark, unlock premium templates and effects, AI text-to-video and image generation, more cloud storage, and priority rendering.",
            sortOrder: 1,
          },
        ],
      },
    },
  });
  console.log("Done — CapCut updated.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
