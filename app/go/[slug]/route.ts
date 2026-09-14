import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { resolveOutboundLink, withCampaign } from "@/lib/affiliate/links";

export const dynamic = "force-dynamic";

/**
 * Outbound redirect for every affiliate call-to-action on the site.
 *
 * Why route through here at all rather than linking straight to the merchant:
 *  - campaignKey can be appended in one place instead of being baked into stored URLs
 *  - the merchant URL can change without re-rendering or re-editing any page
 *  - it is the seam where click measurement can be added later without touching a
 *    single call site (no click is recorded today, by explicit decision)
 *
 * Deliberately no database write: a hiccup here would break every CTA on the site.
 * Disallowed in robots.txt, and every anchor still carries rel="nofollow sponsored".
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, status: "PUBLISHED", category: { status: "PUBLISHED" } },
    select: {
      websiteUrl: true,
      affiliatePrograms: {
        where: { status: "ACTIVE" },
        select: {
          status: true,
          disclosure: true,
          links: {
            where: { enabled: true },
            orderBy: { priority: "desc" },
            select: { id: true, url: true, region: true, enabled: true, priority: true, campaignKey: true },
          },
        },
      },
    },
  });

  // Unknown or unpublished tool, or no safe URL on file: send people somewhere useful
  // rather than showing an error for what is, to them, just a button that did nothing.
  if (!product) return redirectTo("/tools");

  const resolved = resolveOutboundLink(product);
  if (!resolved.url) return redirectTo(`/tools/${slug}`);

  const destination = withCampaign(resolved.url, resolved.campaignKey);

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: destination,
      // Never cache an outbound hop: the resolved link can change at any time.
      "Cache-Control": "no-store, max-age=0",
      "Referrer-Policy": "no-referrer",
    },
  });
}

/**
 * Relative Location on purpose. Behind Hostinger's proxy `request.url` is the internal
 * bind address, so an absolute redirect built from it points at an unreachable host -
 * the same problem already solved for admin redirects in lib/admin/response.ts.
 */
function redirectTo(path: string) {
  return new NextResponse(null, { status: 302, headers: { Location: path, "Cache-Control": "no-store" } });
}
