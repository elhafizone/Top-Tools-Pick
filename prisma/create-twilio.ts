/**
 * create-twilio.ts
 * Creates Twilio as a new product in the DB
 * Run: $env:DATABASE_URL="..." ; npx tsx prisma/create-twilio.ts
 */
import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();

const TODAY = new Date("2026-10-04");

async function main() {
  const category = await prisma.category.findUniqueOrThrow({
    where: { slug: "development-coding" },
  });

  const product = await prisma.product.create({
    data: {
      name: "Twilio",
      slug: "twilio",
      shortDescription:
        "Developer platform for programmable communications — SMS, voice, WhatsApp, email, and 2FA verification — with pay-as-you-go pricing and no monthly minimums.",
      description:
        "Twilio is a cloud communications platform that lets developers embed messaging, voice, video, and authentication into any application via REST APIs. Instead of building and maintaining telecom infrastructure, teams use Twilio's APIs to send SMS, make and receive calls, verify users with OTP, send WhatsApp messages, and deliver transactional email through SendGrid. Pricing is purely usage-based: you pay per message, per minute, or per verification with no monthly minimum or contracts, plus volume discounts as you scale. Twilio's platform supports 180+ countries and includes a drag-and-drop workflow builder (Studio), serverless functions, and AI conversation tools for contact centers. All products include a free trial with no credit card required — free credits let you test before committing.",
      websiteUrl: "https://www.twilio.com",
      logoUrl: "https://img.alternativeto.net/icons/140/jpeg/twilio_217881.png",
      pricingModel: PricingModel.USAGE_BASED,
      hasFreePlan: false,
      hasFreeTrial: true,
      keyFeatures: [
        "SMS API: send and receive messages in 180+ countries from $0.0083/message",
        "Voice API: embed phone calls at $0.0085/min to receive and $0.014/min to make",
        "WhatsApp Business API: send and receive messages from $0.005/message",
        "Verify API: phone number and email 2FA from $0.05/verification",
        "SendGrid Email API: transactional email — 100/day free, paid plans from $19.95/month",
        "Twilio Studio: visual drag-and-drop flow builder for multi-channel apps",
        "No monthly minimums, no contracts — pay only for what you use",
      ].join("\n"),
      bestFor:
        "Developers and engineering teams who need to embed SMS, voice, WhatsApp, or 2FA into their own product, and want reliable telecom infrastructure without managing carriers",
      notFor:
        "Non-technical users who want a pre-built messaging or call center UI without coding — Twilio requires API integration and developer resources",
      verdict:
        "Twilio set the standard for developer-first communications infrastructure, and it's still the most reliable choice for teams building custom messaging or verification flows. The per-use pricing is transparent, global coverage is excellent, and the API documentation is among the best in the industry. Costs can climb fast at scale — evaluate volume discounts early if SMS or voice is core to your product.",
      seoTitle: "Twilio Review: Pricing, APIs & Features",
      seoDescription:
        "Twilio review: programmable SMS, voice, WhatsApp, and 2FA APIs with pay-as-you-go pricing. SMS from $0.0083/message, no monthly minimum, free trial.",
      lastReviewedAt: TODAY,
      categoryId: category.id,
      status: "PUBLISHED",
      pricingPlans: {
        create: [
          {
            name: "SMS",
            priceAmount: null,
            currency: "USD",
            billingPeriod: null,
            priceLabel: "From $0.0083/message",
            description:
              "Send or receive SMS and MMS in 180+ countries. Volume discounts available. No monthly fee.",
            sortOrder: 0,
          },
          {
            name: "Voice",
            priceAmount: null,
            currency: "USD",
            billingPeriod: null,
            priceLabel: "From $0.0085/min (inbound) · $0.014/min (outbound)",
            description:
              "Embed phone calls into any app. Supports browser-based calling, PSTN, and SIP trunking.",
            sortOrder: 1,
          },
          {
            name: "Verify (2FA)",
            priceAmount: null,
            currency: "USD",
            billingPeriod: null,
            priceLabel: "$0.05/verification",
            description:
              "Phone number and email verification for sign-up and account security. Supports SMS, voice, and email OTP.",
            sortOrder: 2,
          },
          {
            name: "SendGrid Email",
            priceAmount: 19.95,
            currency: "USD",
            billingPeriod: "monthly",
            priceLabel: "Free up to 100 emails/day · From $19.95/month",
            description:
              "Transactional email API via SendGrid. Free forever for up to 100 emails/day; paid plans unlock higher volumes and analytics.",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  console.log(`Done — Twilio created (id: ${product.id})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
