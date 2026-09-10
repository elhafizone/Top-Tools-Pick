import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { recordAudit } from "@/lib/admin/audit";
import { adminErrorResponse } from "@/lib/admin/response";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = Object.fromEntries((await request.formData()).entries());
    const priority = Number(body.priority);
    if (body.enabled !== "true" && body.enabled !== "false") return NextResponse.json({ error: "Enabled must be true or false." }, { status: 400 });
    const region = typeof body.region === "string" && body.region.trim() ? body.region.trim() : null;
    if (!Number.isInteger(priority) || priority < 0 || priority > 1000) return NextResponse.json({ error: "Priority must be an integer from 0 to 1000." }, { status: 400 });
    const existing = await prisma.affiliateLink.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: "Affiliate link not found." }, { status: 404 });
    const link = await prisma.affiliateLink.update({ where: { id }, data: { enabled: body.enabled === "true", priority, region } });
    await recordAudit("UPDATE", "AffiliateLink", link.id, { enabled: link.enabled, priority: link.priority, region: link.region });
    return NextResponse.redirect(new URL("/admin/affiliate-links?saved=1", request.url));
  } catch (error) {
    return adminErrorResponse(error, "Unable to update affiliate link.");
  }
}
