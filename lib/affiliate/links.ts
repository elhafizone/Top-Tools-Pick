type ProductWithAffiliatePrograms = {
  websiteUrl: string;
  affiliatePrograms: Array<{
    status: string;
    links: Array<{ url: string; region: string | null; enabled: boolean; priority: number }>;
  }>;
};

export const isSafeHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

/** Display hostname for an arbitrary stored URL. Returns null instead of throwing on malformed input. */
export function safeHostname(value: string) {
  try {
    const host = new URL(value).hostname;
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return null;
  }
}

export function getBestAffiliateLink(product: ProductWithAffiliatePrograms, region?: string) {
  const candidates = product.affiliatePrograms
    .filter((program) => program.status === "ACTIVE")
    .flatMap((program) => program.links)
    .filter((link) => link.enabled && isSafeHttpUrl(link.url));
  const regional = region ? candidates.filter((link) => link.region?.toLowerCase() === region.toLowerCase()) : [];
  const global = candidates.filter((link) => !link.region || link.region.toLowerCase() === "global");
  const pool = regional.length ? regional : global.length ? global : candidates;
  const selected = pool.sort((a, b) => b.priority - a.priority)[0];
  // The websiteUrl fallback is validated too, so a malformed value never becomes an href.
  return selected?.url ?? (isSafeHttpUrl(product.websiteUrl) ? product.websiteUrl : null);
}
