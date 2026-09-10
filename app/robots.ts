import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: ["/", "/tools", "/categories", "/articles", "/compare", "/best", "/stories"], disallow: ["/admin", "/api/", "/*?*"] }, sitemap: `${siteUrl}/sitemap.xml` };
}
