import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { recordAuditWithClient } from "@/lib/admin/audit";
import { parseWorkflowStatus, assertPublishable, assertTransition } from "@/lib/admin/workflow";
import { adminErrorResponse, adminFormErrorResponse } from "@/lib/admin/response";
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = Object.fromEntries((await request.formData()).entries());
    const title = text(body.title), slug = text(body.slug), verdict = text(body.verdict), productAId = text(body.productAId), productBId = text(body.productBId);
    const status = parseWorkflowStatus(body.status);
    if (!status || !title || !slug || !verdict || !productAId || !productBId || productAId === productBId) return adminFormErrorResponse(request, `/admin/comparisons/${id}`, "Valid distinct products, title, slug, verdict, and status are required.", 400);
    const result = await prisma.$transaction(async (tx) => {
      const previous = await tx.comparison.findUnique({ where: { id } });
      if (!previous) throw new Error("Comparison not found.");
      assertTransition(previous.status, status);
      const products = await tx.product.findMany({ where: { id: { in: [productAId, productBId] } }, select: { id: true, status: true } });
      if (products.length !== 2 || products.some((product) => product.status !== "PUBLISHED") && status === "PUBLISHED") throw new Error("Published comparisons require two published products.");
      if (status === "PUBLISHED") assertPublishable({ title, slug, description: verdict, seoTitle: text(body.seoTitle), seoDescription: text(body.seoDescription) });
      const comparison = await tx.comparison.update({ where: { id }, data: { title, slug, verdict, description: text(body.description) || null, productAId, productBId, seoTitle: text(body.seoTitle) || null, seoDescription: text(body.seoDescription) || null, status } });
      await recordAuditWithClient(tx, previous.status !== status && status === "PUBLISHED" ? "PUBLISH" : previous.status === "PUBLISHED" && status === "DRAFT" ? "UNPUBLISH" : "UPDATE", "Comparison", id, { slug, status, productAId, productBId });
      return comparison;
    });
    return NextResponse.redirect(new URL(`/admin/comparisons/${result.id}?saved=1`, request.url), { status: 303 });
  } catch (error) { return adminErrorResponse(error, "Unable to update comparison.", request, `/admin/comparisons/${(await params).id}`); }
}
