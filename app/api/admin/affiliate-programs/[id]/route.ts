import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { recordAudit } from "@/lib/admin/audit";
import { adminRedirect, adminErrorResponse, adminFormErrorResponse } from "@/lib/admin/response";

const REDIRECT = "/admin/affiliate-links";
const STATUSES = new Set(["ACTIVE", "PENDING_VERIFICATION", "INACTIVE"]);

/**
 * Edit an affiliate programme.
 *
 * Link resolution only ever considers programmes with status ACTIVE, and nothing in
 * the admin could set that - so even a correct affiliate URL stayed invisible on the
 * public site. This is the other half of unblocking monetisation.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = Object.fromEntries((await request.formData()).entries());
    const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

    const status = text(body.status).toUpperCase();
    if (!STATUSES.has(status)) {
      return adminFormErrorResponse(request, REDIRECT, "Select a valid programme status.", 400);
    }

    const existing = await prisma.affiliateProgram.findUnique({ where: { id }, select: { id: true, status: true } });
    if (!existing) return adminFormErrorResponse(request, REDIRECT, "Affiliate program not found.", 404);

    const program = await prisma.affiliateProgram.update({
      where: { id },
      data: {
        status: status as "ACTIVE" | "PENDING_VERIFICATION" | "INACTIVE",
        network: text(body.network) || null,
        // Rendered on the tool page beneath the generic site-wide disclosure.
        disclosure: text(body.disclosure) || null,
        notes: text(body.notes) || null,
        ...(status === "ACTIVE" && existing.status !== "ACTIVE" ? { verifiedAt: new Date() } : {}),
        lastCheckedAt: new Date(),
      },
    });
    await recordAudit("UPDATE", "AffiliateProgram", program.id, { status: program.status, network: program.network });

    return adminRedirect(`${REDIRECT}?saved=1`);
  } catch (error) {
    return adminErrorResponse(error, "Unable to update affiliate program.", request, REDIRECT);
  }
}
