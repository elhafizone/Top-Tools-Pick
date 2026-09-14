import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { recordAudit } from "@/lib/admin/audit";
import { adminRedirect, adminErrorResponse, adminFormErrorResponse } from "@/lib/admin/response";
import { isSafeHttpUrl } from "@/lib/affiliate/links";

/**
 * Create an affiliate link.
 *
 * This endpoint did not exist: the admin could toggle enabled/priority/region but had
 * no way to enter a URL at all, so no product could ever have a real affiliate link
 * and every CTA on the site fell back to the plain websiteUrl.
 */
export async function POST(request: Request) {
  const redirectPath = "/admin/affiliate-links";
  try {
    await requireAdmin();
    const body = Object.fromEntries((await request.formData()).entries());
    const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

    const programId = text(body.programId);
    const label = text(body.label);
    const url = text(body.url);
    const region = text(body.region) || null;
    const campaignKey = text(body.campaignKey) || null;
    const priority = Number(body.priority ?? 0);

    if (!programId || !label || !url) {
      return adminFormErrorResponse(request, redirectPath, "Program, label and URL are all required.", 400);
    }
    // The public CTA parses this with new URL(); a schemeless value would never render.
    if (!isSafeHttpUrl(url)) {
      return adminFormErrorResponse(request, redirectPath, "Affiliate URL must be a full http(s) URL.", 400);
    }
    if (!Number.isInteger(priority) || priority < 0 || priority > 1000) {
      return adminFormErrorResponse(request, redirectPath, "Priority must be a whole number from 0 to 1000.", 400);
    }

    const program = await prisma.affiliateProgram.findUnique({ where: { id: programId }, select: { id: true } });
    if (!program) return adminFormErrorResponse(request, redirectPath, "Affiliate program not found.", 404);

    const link = await prisma.affiliateLink.create({
      data: { programId, label, url, region, campaignKey, priority, enabled: body.enabled === "true" },
    });
    await recordAudit("CREATE", "AffiliateLink", link.id, { programId, url, enabled: link.enabled });

    return adminRedirect(`${redirectPath}?saved=1`);
  } catch (error) {
    return adminErrorResponse(error, "Unable to create affiliate link.", request, redirectPath);
  }
}
