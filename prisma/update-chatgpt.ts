/**
 * update-chatgpt.ts  — updates ChatGPT with real editorial content
 * Run: npx tsx prisma/update-chatgpt.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.product.update({
    where: { slug: "chatgpt" },
    data: {
      logoUrl: "/tool-logos/chatgpt.svg",

      description:
        "ChatGPT is a generative AI chatbot created by OpenAI and launched in November 2022. It is built on large language models (LLMs) — currently GPT-5 — enabling it to understand and generate human-like text, images, voice and code in a single conversation. It handles a wide range of tasks: answering questions, writing and editing, summarising long documents, generating code, creating visuals via DALL·E, and supporting productivity workflows like drafting emails and planning projects. Its versatility made it one of the fastest-growing consumer applications in history, with over 300 million weekly active users across web, mobile, desktop and Microsoft Copilot integrations. The free tier gives access to a capable baseline model; the Plus plan ($20/month) unlocks the full GPT-4o model, higher rate limits, image generation, and the ability to create and use custom GPTs from the GPT Store.",

      notFor:
        "Anyone who needs deterministic, citation-backed answers for high-stakes professional or medical decisions. ChatGPT can produce confident but incorrect information, and its answers are not always sourced or verifiable. It is also not the best choice for extended long-document analysis — Claude handles larger context windows better. For real-time news or research that needs cited sources, Perplexity is a more reliable option.",

      keyFeatures:
        "GPT-4o with text, image and voice input · DALL·E 3 image generation (Plus) · Custom GPTs and GPT Store · Code Interpreter for data analysis · Real-time web browsing · Projects with persistent memory · API access with broad third-party integrations · Thinking mode for complex reasoning tasks",

      verdict:
        "The most capable and best-integrated general-purpose AI assistant available. The free tier is genuinely useful for everyday tasks; the Plus plan is worth paying for if AI assistance is part of your daily workflow.",

      seoTitle:
        "ChatGPT Review 2025 — Honest Look at Pricing, Limits and Who It's For | TopToolsPick",

      seoDescription:
        "ChatGPT review: free vs Plus plan, what GPT-4o actually does well, where it falls short, and who should consider Claude or Perplexity instead.",

      lastReviewedAt: new Date("2025-09-01"),
      verified: true,
    },
  });

  console.log(`Updated: ${result.name} (${result.slug})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
