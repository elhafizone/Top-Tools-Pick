import { GoogleGenAI, Type } from "@google/genai";
import { prisma } from "@/lib/db/prisma";
import { recordSystemAudit } from "@/lib/admin/audit";

const GEMINI_MODEL = "gemini-3.8-flash";
const JUDGMENT_ENTITY_TYPE = "ProductAlternativeJudgment";

type CandidateContext = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  pricingModel: string;
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  bestFor: string | null;
  keyFeatures: string[];
};

export type JudgeResult =
  | { status: "created"; productSlug: string; alternativeSlug: string; reason: string }
  | { status: "no-match"; productSlug: string; reason: string }
  | { status: "no-candidates"; productSlug: string }
  | { status: "exhausted" }
  | { status: "quota-exhausted" };

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Up to `limit` published products with no accepted alternative yet AND no prior
 * "no good match" judgment recorded (via AuditLog, since judgments aren't a stored
 * relation - this is the only table generic enough to hold them without a migration).
 */
async function pickCandidateProducts(limit: number) {
  const [existingAlternatives, pastJudgments] = await Promise.all([
    prisma.productAlternative.findMany({ select: { productId: true } }),
    prisma.auditLog.findMany({ where: { entityType: JUDGMENT_ENTITY_TYPE }, select: { entityId: true } }),
  ]);
  const excluded = new Set([...existingAlternatives.map((r) => r.productId), ...pastJudgments.map((r) => r.entityId)]);

  return prisma.product.findMany({
    where: { status: "PUBLISHED", id: { notIn: [...excluded] } },
    select: {
      id: true, slug: true, name: true, shortDescription: true, description: true,
      categoryId: true, pricingModel: true, hasFreePlan: true, hasFreeTrial: true,
      bestFor: true, notFor: true, keyFeatures: true, pros: true, cons: true, verdict: true,
      editorialScore: true,
    },
    take: limit,
    orderBy: { editorialScore: "desc" },
  });
}

async function fetchCandidatePeers(product: { id: string; categoryId: string }, take = 5): Promise<CandidateContext[]> {
  const peers = await prisma.product.findMany({
    where: { status: "PUBLISHED", categoryId: product.categoryId, id: { not: product.id } },
    select: { id: true, slug: true, name: true, shortDescription: true, pricingModel: true, hasFreePlan: true, hasFreeTrial: true, bestFor: true, keyFeatures: true },
    orderBy: { editorialScore: "desc" },
    take,
  });
  return peers.map((p) => ({ ...p, keyFeatures: parseJsonArray(p.keyFeatures) }));
}

const GEMINI_SCHEMA = {
  type: Type.OBJECT,
  required: ["hasMatch"],
  properties: {
    hasMatch: { type: Type.BOOLEAN },
    alternativeSlug: { type: Type.STRING },
    reason: { type: Type.STRING },
    noMatchReason: { type: Type.STRING },
  },
};

const SYSTEM_PROMPT = `You curate a software directory's "Alternatives" feature. Judge whether any of the given candidates is a GENUINE alternative to the product - something a buyer evaluating the product would realistically also consider, because it serves the same core job (not just the same broad category). A video-calling tool and a whiteboard tool are not alternatives even if both are tagged "remote work". An e-signature tool and a personal to-do app are never alternatives. Use only the facts given - never invent a claim. If no candidate is a genuine substitute, say so honestly rather than forcing a weak match. Call emit_judgment exactly once.`;

async function callGemini(prompt: string): Promise<{ hasMatch: boolean; alternativeSlug?: string; reason?: string; noMatchReason?: string }> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { systemInstruction: SYSTEM_PROMPT, responseMimeType: "application/json", responseSchema: GEMINI_SCHEMA },
  });
  if (!response.text) throw new Error("Gemini did not return a judgment.");
  return JSON.parse(response.text);
}

/** Judges up to `count` products (default 15, leaving quota headroom for article generation on the same key/day). */
export async function judgeNextAlternatives(count = 15): Promise<JudgeResult[]> {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");
  const products = await pickCandidateProducts(count);
  if (products.length === 0) return [{ status: "exhausted" }];

  const results: JudgeResult[] = [];
  let quotaExhausted = false;
  for (const product of products) {
    const peers = await fetchCandidatePeers(product);
    if (peers.length === 0) {
      await recordSystemAudit("UPDATE", JUDGMENT_ENTITY_TYPE, product.id, { result: "no-candidates" });
      results.push({ status: "no-candidates", productSlug: product.slug });
      continue;
    }

    const prompt = [
      `Product: ${JSON.stringify({ name: product.name, shortDescription: product.shortDescription, description: product.description, pricingModel: product.pricingModel, hasFreePlan: product.hasFreePlan, hasFreeTrial: product.hasFreeTrial, bestFor: product.bestFor, notFor: product.notFor, keyFeatures: parseJsonArray(product.keyFeatures), pros: parseJsonArray(product.pros), cons: parseJsonArray(product.cons), verdict: product.verdict })}`,
      `Candidates (same category, pick at most one slug from this list):\n${JSON.stringify(peers, null, 2)}`,
    ].join("\n\n");

    let judgment;
    try {
      judgment = await callGemini(prompt);
    } catch (error) {
      const message = error instanceof Error ? error.message : "model error";
      // Daily quota exhaustion won't clear within this run - stop instead of burning
      // through the rest of the batch on calls that will fail identically.
      if (message.includes("RESOURCE_EXHAUSTED") || message.includes("\"code\":429")) { quotaExhausted = true; break; }
      results.push({ status: "no-match", productSlug: product.slug, reason: message });
      continue;
    }

    if (judgment.hasMatch && judgment.alternativeSlug && judgment.reason) {
      const alt = peers.find((p) => p.slug === judgment.alternativeSlug);
      if (alt) {
        await prisma.productAlternative.create({
          data: { productId: product.id, alternativeId: alt.id, rank: 1, reason: judgment.reason.slice(0, 200) },
        });
        await recordSystemAudit("CREATE", "ProductAlternative", product.id, { alternativeSlug: alt.slug, source: "ai-judge" });
        results.push({ status: "created", productSlug: product.slug, alternativeSlug: alt.slug, reason: judgment.reason });
        continue;
      }
    }

    await recordSystemAudit("UPDATE", JUDGMENT_ENTITY_TYPE, product.id, { result: "no-match", reason: judgment.noMatchReason ?? null });
    results.push({ status: "no-match", productSlug: product.slug, reason: judgment.noMatchReason ?? "no genuine match among candidates" });
  }

  if (quotaExhausted && results.length === 0) return [{ status: "quota-exhausted" }];
  return results;
}
