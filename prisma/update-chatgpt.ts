/**
 * update-chatgpt.ts — updates ChatGPT with real, SEO-optimised editorial content
 * Run: npx tsx prisma/update-chatgpt.ts
 *
 * Separator rules (enforced by toBullets in lib/text.ts):
 *  - keyFeatures / notFor / bestFor → newlines (\n) create bullet-list items
 *  - Single paragraph → no separator needed
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.product.update({
    where: { slug: "chatgpt" },
    data: {
      logoUrl: "/tool-logos/chatgpt.svg",

      // Displayed as the lede (above fold) AND used in SoftwareApplication JSON-LD
      shortDescription:
        "ChatGPT is OpenAI's AI assistant — the most widely used general-purpose AI tool in the world, capable of writing, coding, image generation and real-time web search in one place.",

      // Displayed in the "What to know about ChatGPT" editorial section
      description:
        "ChatGPT is a generative AI chatbot created by OpenAI and launched in November 2022. It is built on large language models (LLMs) — currently GPT-4o — enabling it to understand and generate human-like text, images, voice and code across a single conversation.\n\nIt handles a wide range of tasks: answering questions, writing and editing long-form content, summarising documents, generating code, creating visuals via DALL·E 3, and supporting productivity workflows like drafting emails, planning projects and analysing data. Its versatility has made it one of the fastest-growing consumer applications in history, with over 300 million weekly active users across web, mobile, desktop and Microsoft Copilot integrations.\n\nThe free tier gives access to a capable baseline model with limited message allowances. The Plus plan ($20/month) unlocks the full GPT-4o model, higher rate limits, image generation, real-time web browsing and access to the GPT Store — a library of purpose-built custom GPTs for specific tasks. The Pro plan ($200/month) is aimed at heavy professional users who need maximum throughput and early access to the latest models including o1 Pro.",

      // Parsed into "Look elsewhere if" bullet list (newlines = separate bullets)
      notFor:
        "Anyone who needs deterministic, citation-backed answers for high-stakes professional or medical decisions — ChatGPT can produce confident but factually incorrect information\nUsers who need real-time sourced research with visible citations — Perplexity is better suited for that\nExtended analysis of very long documents — Claude's larger context window handles that better\nUsers who prioritise data privacy above all else — all input is processed on OpenAI's servers",

      // Parsed into key features grid (newlines = separate feature rows)
      keyFeatures:
        "GPT-4o with text, image and voice input (all plans)\nDALL·E 3 image generation (Plus and above)\nReal-time web browsing with cited sources\nCustom GPTs and GPT Store with 3 million+ GPTs\nCode Interpreter for data analysis and visualisation\nProjects with persistent memory across conversations\nAdvanced reasoning models (o1, o3) for complex problems\nBroadest API ecosystem — 10,000+ third-party integrations",

      // Editorial one-paragraph verdict (shown in the highlighted verdict panel)
      verdict:
        "The most capable and best-integrated general-purpose AI assistant available today. The free tier is genuinely useful for everyday tasks; the Plus plan earns its $20/month if AI assistance is part of your daily workflow. The GPT Store, image generation and real-time search together make it the only AI tool most people will ever need — with the caveat that you must treat its output as a confident first draft that still needs verification.",

      // SEO: used as <title> (absolute — no "| TopToolsPick" appended)
      seoTitle:
        "ChatGPT Review 2025 — Free vs Plus, Pricing and Honest Verdict | TopToolsPick",

      // SEO: used as <meta name="description"> and OG description (≤ 160 chars)
      seoDescription:
        "ChatGPT review: what the free plan actually includes, whether Plus is worth $20/month, and when Claude or Perplexity is a better choice.",

      lastReviewedAt: new Date("2025-09-01"),
      verified: true,
    },
  });

  console.log(`Updated: ${result.name} (${result.slug})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
