import type { Metadata } from "next";
import { categoryToolsLabel } from "@/lib/text";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toptoolspick.com";
export const siteName = "TopToolsPick";

type BuildOptions = {
  /**
   * Use the title exactly as given, bypassing the root layout's "%s | TopToolsPick"
   * template. Required for titles that come from a CMS seoTitle column, because some
   * stored values already end in "| TopToolsPick" and would otherwise be doubled.
   */
  absolute?: boolean;
  robots?: Metadata["robots"];
  canonicalOverride?: string | null;
};

export function buildMetadata(title: string, description: string, path = "/", options: BuildOptions = {}): Metadata {
  const canonical = options.canonicalOverride ?? new URL(path, siteUrl).toString();
  return {
    title: options.absolute ? { absolute: title } : title,
    description,
    alternates: { canonical },
    // openGraph.title is not templated by Next, so it carries siteName separately
    // rather than repeating the suffix inside the title string.
    openGraph: {
      title, description, url: canonical, siteName, type: "website",
      images: [{ url: new URL("/ttp-logo.webp", siteUrl).toString(), width: 800, height: 600, alt: siteName }],
    },
    twitter: { card: "summary_large_image", title, description, images: [new URL("/ttp-logo.webp", siteUrl).toString()] },
    ...(options.robots ? { robots: options.robots } : {}),
  };
}

const YEAR = new Date().getFullYear();

export const productMetadata = (name: string, description: string, slug: string) =>
  buildMetadata(`${name} Review ${YEAR} — Pricing, Features & Alternatives`, description, `/tools/${slug}`);
export const categoryMetadata = (name: string, description: string, slug: string) =>
  buildMetadata(categoryToolsLabel(name), description, `/categories/${slug}`);
export const storyMetadata = (title: string, description: string, slug: string) => buildMetadata(title, description, `/stories/${slug}`);
export const editorialListMetadata = (title: string, description: string, slug: string) => buildMetadata(title, description, `/best/${slug}`);

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data) };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: new URL(item.path, siteUrl).toString() })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: new URL("/ttp-logo.webp", siteUrl).toString(),
    description: "Independent research and ranked shortlists for people choosing software and digital tools.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/tools?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function itemListJsonLd(name: string, items: Array<{ name: string; path: string }>, description?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    ...(description ? { description } : {}),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: new URL(item.path, siteUrl).toString(),
    })),
  };
}

type OfferSource = { priceAmount: unknown; currency: string | null };

/**
 * SoftwareApplication markup for a tool page.
 *
 * `offers` is emitted only when a plan carries both a numeric price and a currency -
 * a price label like "Free trial available" is not an offer. No `aggregateRating`:
 * the only rating source is the site's own editorial score, which Google does not
 * treat as an independent user rating (self-serving review markup).
 */
export function softwareApplicationJsonLd(product: {
  name: string;
  shortDescription: string;
  websiteUrl: string;
  category: { name: string };
  pricingPlans: OfferSource[];
}) {
  const offers = product.pricingPlans
    .filter((plan) => plan.priceAmount !== null && plan.priceAmount !== undefined && plan.currency)
    .map((plan) => ({
      "@type": "Offer",
      price: Number(plan.priceAmount),
      priceCurrency: plan.currency,
    }));

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.shortDescription,
    url: product.websiteUrl,
    applicationCategory: product.category.name,
    ...(offers.length ? { offers } : {}),
  };
}
