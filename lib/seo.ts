import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toptoolspick.com";

export function buildMetadata(title: string, description: string, path = "/"): Metadata {
  const canonical = new URL(path, siteUrl).toString();
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: "TopToolsPick", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const productMetadata = (name: string, description: string, slug: string) => buildMetadata(`${name} review | TopToolsPick`, description, `/tools/${slug}`);
export const categoryMetadata = (name: string, description: string, slug: string) => buildMetadata(`${name} tools | TopToolsPick`, description, `/categories/${slug}`);
export const comparisonMetadata = (title: string, description: string, slug: string) => buildMetadata(`${title} | TopToolsPick`, description, `/compare/${slug}`);
export const storyMetadata = (title: string, description: string, slug: string) => buildMetadata(`${title} | TopToolsPick`, description, `/stories/${slug}`);
export const editorialListMetadata = (title: string, description: string, slug: string) => buildMetadata(`${title} | TopToolsPick`, description, `/best/${slug}`);

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
