import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { recordAudit } from "@/lib/admin/audit";
import { adminRedirect, adminErrorResponse, adminFormErrorResponse } from "@/lib/admin/response";
import { isSafeHttpUrl } from "@/lib/affiliate/links";

const REDIRECT = "/admin/affiliate-links";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = Object.fromEntries((await request.formData()).entries());
    const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

    if (body.enabled !== "true" && body.enabled !== "false") {
      return adminFormErrorResponse(request, REDIRECT, "Enabled must be true or false.", 400);
    }
    const priority = Number(body.priority);
    if (!Number.isInteger(priority) || priority < 0 || priority > 1000) {
      return adminFormErrorResponse(request, REDIRECT, "Priority must be a whole number from 0 to 1000.", 400);
    }

    const existing = await prisma.affiliateLink.findUnique({ where: { id }, select: { id: true, label: true, url: true } });
    if (!existing) return adminFormErrorResponse(request, REDIRECT, "Affiliate link not found.", 404);

    // label / url / campaignKey were previously uneditable, which made a stored link
    // impossible to correct without direct database access.
    const label = text(body.label) || existing.label;
    const url = text(body.url) || existing.url;
    if (!isSafeHttpUrl(url)) {
      return adminFormErrorResponse(request, REDIRECT, "Affiliate URL must be a full http(s) URL.", 400);
    }

    const link = await prisma.affiliateLink.update({
      where: { id },
      data: {
        label,
        url,
        region: text(body.region) || null,
        campaignKey: text(body.campaignKey) || null,
        priority,
        enabled: body.enabled === "true",
      },
    });
    await recordAudit("UPDATE", "AffiliateLink", link.id, { enabled: link.enabled, priority: link.priority, region: link.region, url: link.url });

    return adminRedirect(`${REDIRECT}?saved=1`);
  } catch (error) {
    return adminErrorResponse(error, "Unable to update affiliate link.", request, REDIRECT);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const existing = await prisma.affiliateLink.findUnique({ where: { id }, select: { id: true, url: true } });
    if (!existing) return NextResponse.json({ error: "Affiliate link not found." }, { status: 404 });
    await prisma.affiliateLink.delete({ where: { id } });
    await recordAudit("DELETE", "AffiliateLink", id, { url: existing.url });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminErrorResponse(error, "Unable to delete affiliate link.");
  }
}
