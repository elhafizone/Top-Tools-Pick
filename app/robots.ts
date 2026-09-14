import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/tools", "/categories", "/articles", "/comparisons", "/compare", "/best", "/stories"],
      // /go is the outbound redirect hop - never a destination, and never indexable.
      disallow: ["/admin", "/api/", "/go"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
