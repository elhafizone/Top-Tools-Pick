type AffiliateLinkShape = {
  id?: string;
  url: string;
  region: string | null;
  enabled: boolean;
  priority: number;
  campaignKey?: string | null;
  label?: string;
};

type ProductWithAffiliatePrograms = {
  websiteUrl: string;
  affiliatePrograms: Array<{
    status: string;
    disclosure?: string | null;
    links: AffiliateLinkShape[];
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

/**
 * Appends the stored campaign key as a query parameter.
 *
 * This is the only place campaignKey stops being dead data. It never overwrites a key
 * the merchant URL already carries, and returns the URL untouched if it cannot be
 * parsed - a tracking parameter is never worth breaking an outbound link for.
 */
export function withCampaign(url: string, campaignKey?: string | null, param = "utm_campaign") {
  const key = campaignKey?.trim();
  if (!key) return url;
  try {
    const parsed = new URL(url);
    if (parsed.searchParams.has(param)) return url;
    parsed.searchParams.set(param, key);
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Picks the best outbound link and everything the caller needs to render it honestly.
 *
 * Selection order: a region match, then global/unscoped links, then anything enabled -
 * highest priority wins. Falls back to the product's own website URL, which is why a
 * tool with no affiliate programme still gets a working button.
 */
export function resolveOutboundLink(product: ProductWithAffiliatePrograms, region?: string) {
  const activePrograms = product.affiliatePrograms.filter((program) => program.status === "ACTIVE");
  const candidates = activePrograms
    .flatMap((program) => program.links.map((link) => ({ link, program })))
    .filter((entry) => entry.link.enabled && isSafeHttpUrl(entry.link.url));

  const regional = region
    ? candidates.filter((entry) => entry.link.region?.toLowerCase() === region.toLowerCase())
    : [];
  const global = candidates.filter((entry) => !entry.link.region || entry.link.region.toLowerCase() === "global");
  const pool = regional.length ? regional : global.length ? global : candidates;
  // Copy before sorting: sorting in place mutated the caller's array.
  const selected = [...pool].sort((a, b) => b.link.priority - a.link.priority)[0];

  if (selected) {
    return {
      url: selected.link.url,
      isAffiliate: true,
      linkId: selected.link.id ?? null,
      campaignKey: selected.link.campaignKey ?? null,
      disclosure: selected.program.disclosure ?? null,
    };
  }

  // The websiteUrl fallback is validated too, so a malformed value never becomes an href.
  const fallback = isSafeHttpUrl(product.websiteUrl) ? product.websiteUrl : null;
  return { url: fallback, isAffiliate: false, linkId: null, campaignKey: null, disclosure: null };
}

/** Back-compat wrapper: existing call sites only ever wanted the URL. */
export function getBestAffiliateLink(product: ProductWithAffiliatePrograms, region?: string) {
  return resolveOutboundLink(product, region).url;
}
