import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI, Type } from "@google/genai";
import { prisma } from "@/lib/db/prisma";
import { recordSystemAudit } from "@/lib/admin/audit";

// Gemini is tried first because it has a genuinely free tier (Google AI Studio,
// no card required) that comfortably covers one article a day. Anthropic is the
// fallback for anyone who already has API credits there.
const GEMINI_MODEL = "gemini-3.8-flash";
const ANTHROPIC_MODEL = "claude-sonnet-5-5";
const MIN_WORDS = 400;

type GeneratedArticle = {
  title: string;
  slug: string;
  topic: "guides" | "comparisons";
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
  tools: Array<{ slug: string; rank: number; note: string }>;
  sources: Array<{ url: string; checkedAt: string }>;
};

type ProductContext = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  websiteUrl: string;
  categoryName: string;
  pricingModel: string;
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  pricingPlans: Array<{ name: string; priceLabel: string }>;
  pros: string[];
  cons: string[];
  bestFor: string | null;
  notFor: string | null;
  keyFeatures: string[];
  verdict: string | null;
};

type Topic =
  | { kind: "guide"; product: ProductContext; related?: ProductContext }
  | { kind: "comparison"; a: ProductContext; b: ProductContext };

export type GenerateResult =
  | { status: "created"; slug: string; published: boolean }
  | { status: "skipped"; errors: string[] };

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function toProductContext(product: {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  websiteUrl: string;
  category: { name: string };
  pricingModel: string;
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  pricingPlans: Array<{ name: string; priceLabel: string }>;
  pros: string | null;
  cons: string | null;
  bestFor: string | null;
  notFor: string | null;
  keyFeatures: string | null;
  verdict: string | null;
}): ProductContext {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    websiteUrl: product.websiteUrl,
    categoryName: product.category.name,
    pricingModel: product.pricingModel,
    hasFreePlan: product.hasFreePlan,
    hasFreeTrial: product.hasFreeTrial,
    pricingPlans: product.pricingPlans.map((plan) => ({ name: plan.name, priceLabel: plan.priceLabel })),
    pros: parseJsonArray(product.pros),
    cons: parseJsonArray(product.cons),
    bestFor: product.bestFor,
    notFor: product.notFor,
    keyFeatures: parseJsonArray(product.keyFeatures),
    verdict: product.verdict,
  };
}

async function fetchProductContext(productId: string): Promise<ProductContext | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true, pricingPlans: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product || product.status !== "PUBLISHED") return null;
  return toProductContext(product);
}

/**
 * Picks the next thing worth writing about, in priority order:
 *   1. A curated `ProductAlternative` pair ("comparisons" topic) with no article yet -
 *      this only ever compares pairs an editor already vouched for, never an invented
 *      head-to-head.
 *   2. A published product with no dedicated "guides" article yet.
 * Returns null once every published product and curated pair already has coverage.
 */
export async function pickNextTopic(): Promise<Topic | null> {
  const comparisonArticles = await prisma.article.findMany({
    where: { topic: "comparisons" },
    include: { productLinks: { select: { productId: true } } },
  });
  const coveredPairs = new Set(
    comparisonArticles.map((article) => article.productLinks.map((link) => link.productId).sort().join("|")),
  );

  const alternativeRows = await prisma.productAlternative.findMany({
    where: { product: { status: "PUBLISHED" }, alternative: { status: "PUBLISHED" } },
    select: { productId: true, alternativeId: true },
  });
  const seenPairs = new Set<string>();
  const candidatePairs: Array<[string, string]> = [];
  for (const row of alternativeRows) {
    const pair = [row.productId, row.alternativeId].sort() as [string, string];
    const key = pair.join("|");
    if (seenPairs.has(key) || coveredPairs.has(key)) continue;
    seenPairs.add(key);
    candidatePairs.push(pair);
  }

  if (candidatePairs.length > 0) {
    const [idA, idB] = candidatePairs[Math.floor(Math.random() * candidatePairs.length)];
    const [a, b] = await Promise.all([fetchProductContext(idA), fetchProductContext(idB)]);
    if (a && b) return { kind: "comparison", a, b };
  }

  const guideArticles = await prisma.article.findMany({
    where: { topic: "guides" },
    include: { productLinks: { where: { rank: 1 }, select: { productId: true } } },
  });
  const coveredProductIds = new Set(guideArticles.flatMap((article) => article.productLinks.map((link) => link.productId)));

  const candidateProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED", id: { notIn: [...coveredProductIds] } },
    select: { id: true },
    take: 100,
  });
  if (candidateProducts.length === 0) return null;

  const chosen = candidateProducts[Math.floor(Math.random() * candidateProducts.length)];
  const product = await fetchProductContext(chosen.id);
  if (!product) return null;

  const relatedPair = await prisma.productAlternative.findFirst({
    where: { productId: chosen.id, alternative: { status: "PUBLISHED" } },
    select: { alternativeId: true },
  });
  const related = relatedPair ? ((await fetchProductContext(relatedPair.alternativeId)) ?? undefined) : undefined;

  return { kind: "guide", product, related };
}

const SYSTEM_PROMPT = `You write editorial content for TopToolsPick, a software discovery and comparison website. You must call the emit_article tool exactly once with the finished article.

Rules you must never break:
- Only state facts given in the CONTEXT JSON you are given. Never invent a price, limit, feature, or claim that is not present in it. If the context does not give a specific number, describe plans by the names/labels given instead of making up a number.
- The "content" field is Markdown. Its first paragraph must start with the exact bold lead-in "**Quick answer:**" followed by a one-to-two sentence answer.
- Structure the body with "## " (level-2) Markdown headings.
- End "content" with a "## Sources" heading followed by a short list citing the official product website(s) given in the context.
- The only Markdown links allowed anywhere in "content" are of the exact form [text](/tools/SLUG), where SLUG is one of the allowed slugs you are given. Never link to /articles/... or to any external URL from inside the body text.
- Target 650-900 words in "content".
- "excerpt": a plain one-sentence summary, 200 characters or fewer, no Markdown.
- "seoTitle": 60 characters or fewer.
- "seoDescription": between 120 and 155 characters.
- "slug": lowercase, hyphen-separated, derived from "title".
- Tone: plain and specific. No hype, no superlatives you cannot back with the given facts, no fabricated user quotes or statistics.`;

function buildPrompt(topic: Topic): { user: string; allowedSlugs: Set<string> } {
  if (topic.kind === "guide") {
    const allowedSlugs = new Set([topic.product.slug, ...(topic.related ? [topic.related.slug] : [])]);
    const toolsHint = topic.related
      ? `"tools": [{ "slug": "${topic.product.slug}", "rank": 1, "note": "..." }, { "slug": "${topic.related.slug}", "rank": 2, "note": "..." }]`
      : `"tools": [{ "slug": "${topic.product.slug}", "rank": 1, "note": "..." }]`;
    const user = [
      `Write a "guides" topic article about ${topic.product.name} - a practical buyer's guide drawn only from the context below (pricing plans, pros/cons, who it is and is not for).`,
      `Allowed /tools/ slugs: ${[...allowedSlugs].join(", ")}.`,
      `CONTEXT:\n${JSON.stringify({ product: topic.product, relatedProduct: topic.related ?? null }, null, 2)}`,
      `Set "topic" to "guides". Set ${toolsHint}. Set "sources" to include at least the product's own websiteUrl with "checkedAt" set to today's date (${new Date().toISOString().slice(0, 10)}).`,
    ].join("\n\n");
    return { user, allowedSlugs };
  }

  const allowedSlugs = new Set([topic.a.slug, topic.b.slug]);
  const user = [
    `Write a "comparisons" topic article comparing ${topic.a.name} and ${topic.b.name} - a neutral head-to-head drawn only from the context below, ending with a clear verdict on who each tool suits.`,
    `Allowed /tools/ slugs: ${[...allowedSlugs].join(", ")}.`,
    `CONTEXT:\n${JSON.stringify({ productA: topic.a, productB: topic.b }, null, 2)}`,
    `Set "topic" to "comparisons". Set "tools" to [{ "slug": "${topic.a.slug}", "rank": 1, "note": "..." }, { "slug": "${topic.b.slug}", "rank": 2, "note": "..." }]. Set "sources" to include both products' websiteUrl with "checkedAt" set to today's date (${new Date().toISOString().slice(0, 10)}).`,
  ].join("\n\n");
  return { user, allowedSlugs };
}

const ARTICLE_FIELDS = {
  required: ["title", "slug", "topic", "excerpt", "seoTitle", "seoDescription", "content", "tools", "sources"],
  toolItem: { required: ["slug", "rank", "note"] },
  sourceItem: { required: ["url", "checkedAt"] },
};

const EMIT_ARTICLE_TOOL = {
  name: "emit_article",
  description: "Return the finished article as structured fields. Call this exactly once.",
  input_schema: {
    type: "object" as const,
    required: ARTICLE_FIELDS.required,
    properties: {
      title: { type: "string" },
      slug: { type: "string" },
      topic: { type: "string", enum: ["guides", "comparisons"] },
      excerpt: { type: "string" },
      seoTitle: { type: "string" },
      seoDescription: { type: "string" },
      content: { type: "string" },
      tools: {
        type: "array",
        items: {
          type: "object",
          required: ARTICLE_FIELDS.toolItem.required,
          properties: {
            slug: { type: "string" },
            rank: { type: "integer" },
            note: { type: "string" },
          },
        },
      },
      sources: {
        type: "array",
        items: {
          type: "object",
          required: ARTICLE_FIELDS.sourceItem.required,
          properties: {
            url: { type: "string" },
            checkedAt: { type: "string" },
          },
        },
      },
    },
  },
};

const GEMINI_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: ARTICLE_FIELDS.required,
  properties: {
    title: { type: Type.STRING },
    slug: { type: Type.STRING },
    topic: { type: Type.STRING, format: "enum", enum: ["guides", "comparisons"] },
    excerpt: { type: Type.STRING },
    seoTitle: { type: Type.STRING },
    seoDescription: { type: Type.STRING },
    content: { type: Type.STRING },
    tools: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ARTICLE_FIELDS.toolItem.required,
        properties: {
          slug: { type: Type.STRING },
          rank: { type: Type.INTEGER },
          note: { type: Type.STRING },
        },
      },
    },
    sources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ARTICLE_FIELDS.sourceItem.required,
        properties: {
          url: { type: Type.STRING },
          checkedAt: { type: Type.STRING },
        },
      },
    },
  },
};

async function callGemini(prompt: string): Promise<GeneratedArticle> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: GEMINI_RESPONSE_SCHEMA,
    },
  });
  if (!response.text) throw new Error("Gemini did not return a structured article.");
  return JSON.parse(response.text) as GeneratedArticle;
}

async function callAnthropic(prompt: string): Promise<GeneratedArticle> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    tools: [EMIT_ARTICLE_TOOL],
    tool_choice: { type: "tool", name: "emit_article" },
    messages: [{ role: "user", content: prompt }],
  });
  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") throw new Error("Model did not return a structured article.");
  return toolUse.input as GeneratedArticle;
}

/** Gemini first - it has a free tier that comfortably covers this volume. Falls back to Anthropic. */
async function callModel(user: string, feedback?: string): Promise<GeneratedArticle> {
  const prompt = feedback
    ? `${user}\n\nYour previous attempt failed validation for these reasons:\n${feedback}\nFix every issue and try again.`
    : user;

  if (process.env.GEMINI_API_KEY) return callGemini(prompt);
  if (process.env.ANTHROPIC_API_KEY) return callAnthropic(prompt);
  throw new Error("No model configured - set GEMINI_API_KEY (free, recommended) or ANTHROPIC_API_KEY.");
}

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

/** Mirrors the validation contract in scripts/import-article-batch.mjs - keep both in sync. */
export function validateArticle(
  article: GeneratedArticle,
  existingSlugs: Set<string>,
  productSlugs: Set<string>,
  allowedSlugs: Set<string>,
): string[] {
  const errors: string[] = [];
  if (!article.slug) errors.push("missing slug");
  else if (existingSlugs.has(article.slug)) errors.push(`slug already exists: ${article.slug}`);
  if (countWords(article.content ?? "") < MIN_WORDS) errors.push(`content only ${countWords(article.content ?? "")} words`);
  if (!article.seoTitle || article.seoTitle.length > 60) errors.push(`seoTitle length ${article.seoTitle?.length}`);
  if (!article.seoDescription || article.seoDescription.length < 120 || article.seoDescription.length > 155) {
    errors.push(`seoDescription length ${article.seoDescription?.length}`);
  }
  if (!article.excerpt || article.excerpt.length > 200) errors.push("excerpt missing or > 200 chars");
  if (!/^## /m.test(article.content ?? "") || !/\*\*Quick answer:\*\*/.test(article.content ?? "")) {
    errors.push("needs a Quick answer lead-in and H2 sections");
  }
  if (!/## Sources/.test(article.content ?? "") || !(article.sources?.length >= 1)) {
    errors.push("needs a Sources section and sources[]");
  }
  for (const tool of article.tools ?? []) {
    if (!productSlugs.has(tool.slug)) errors.push(`unknown product: ${tool.slug}`);
  }
  for (const match of (article.content ?? "").matchAll(/\]\((\/[^)\s]+)\)/g)) {
    const found = match[1].match(/^\/(tools|articles)\/([^/#?]+)/);
    if (!found) {
      errors.push(`unexpected internal link: ${match[1]}`);
      continue;
    }
    const [, kind, slug] = found;
    if (kind === "articles") {
      errors.push(`must not link to /articles/: ${match[1]}`);
      continue;
    }
    if (!allowedSlugs.has(slug)) errors.push(`link to a slug outside the allowed set: ${match[1]}`);
  }
  return errors;
}

/**
 * A real, licensed photo rather than an AI-generated one - cheaper (Unsplash's free
 * developer tier needs no card) and fits the site's "no fabricated content" standard
 * better than an invented image would. Returns null quietly if UNSPLASH_ACCESS_KEY is
 * unset or the request fails - a missing featured image is never worth failing over.
 */
async function fetchFeaturedImage(query: string): Promise<{ url: string; credit: string } | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { results?: Array<{ urls: { regular: string }; user: { name: string; links: { html: string } } }> };
    const photo = data.results?.[0];
    if (!photo) return null;
    return { url: photo.urls.regular, credit: `Photo by [${photo.user.name}](${photo.user.links.html}) on [Unsplash](https://unsplash.com/)` };
  } catch {
    return null;
  }
}

/** Generates, validates (one retry on failure) and writes one article. Never overwrites an existing slug. */
export async function generateOneArticle(options: { publish?: boolean } = {}): Promise<GenerateResult> {
  const topic = await pickNextTopic();
  if (!topic) {
    return { status: "skipped", errors: ["No eligible topic left - every published product and curated alternative pair already has an article."] };
  }

  const [existingArticles, productRows] = await Promise.all([
    prisma.article.findMany({ select: { slug: true } }),
    prisma.product.findMany({ where: { status: "PUBLISHED" }, select: { id: true, slug: true } }),
  ]);
  const existingSlugs = new Set(existingArticles.map((a) => a.slug));
  const productSlugToId = new Map(productRows.map((p) => [p.slug, p.id]));
  const productSlugs = new Set(productSlugToId.keys());

  const { user, allowedSlugs } = buildPrompt(topic);

  let article = await callModel(user);
  let errors = validateArticle(article, existingSlugs, productSlugs, allowedSlugs);
  if (errors.length) {
    article = await callModel(user, errors.join("; "));
    errors = validateArticle(article, existingSlugs, productSlugs, allowedSlugs);
  }
  if (errors.length) return { status: "skipped", errors };

  const imageQuery = topic.kind === "guide" ? topic.product.name : `${topic.a.name} vs ${topic.b.name}`;
  const image = await fetchFeaturedImage(imageQuery);
  const content = image ? `${article.content}\n\n*${image.credit}*` : article.content;

  const shouldPublish = options.publish ?? process.env.ARTICLE_AUTO_PUBLISH === "true";
  const created = await prisma.article.create({
    data: {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content,
      featuredImage: image?.url ?? null,
      topic: article.topic,
      author: "TopToolsPick Editorial (AI draft)",
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      status: shouldPublish ? "PUBLISHED" : "DRAFT",
      publishedAt: shouldPublish ? new Date() : null,
      productLinks: {
        create: article.tools
          .filter((tool) => productSlugToId.has(tool.slug))
          .map((tool) => ({ productId: productSlugToId.get(tool.slug)!, rank: tool.rank, note: tool.note })),
      },
    },
  });

  await recordSystemAudit(shouldPublish ? "PUBLISH" : "CREATE", "Article", created.id, { slug: created.slug, source: "ai-generator" });
  return { status: "created", slug: created.slug, published: shouldPublish };
}
