import type { Prisma } from "@prisma/client";

type ProductWithAffiliatePrograms = {
  websiteUrl: string;
  affiliatePrograms: Array<{
    status: string;
    links: Array<{ url: string; region: string | null; enabled: boolean; priority: number }>;
  }>;
};

const isSafeHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export function getBestAffiliateLink(product: ProductWithAffiliatePrograms, region?: string) {
  const candidates = product.affiliatePrograms
    .filter((program) => program.status === "ACTIVE")
    .flatMap((program) => program.links)
    .filter((link) => link.enabled && isSafeHttpUrl(link.url));
  const regional = region ? candidates.filter((link) => link.region?.toLowerCase() === region.toLowerCase()) : [];
  const global = candidates.filter((link) => !link.region || link.region.toLowerCase() === "global");
  const pool = regional.length ? regional : global.length ? global : candidates;
  const selected = pool.sort((a, b) => b.priority - a.priority)[0];
  return selected?.url ?? product.websiteUrl;
}

export type AffiliateProductContext = Prisma.ProductGetPayload<{
  include: {
    affiliatePrograms: { include: { links: true } };
  };
}>;
