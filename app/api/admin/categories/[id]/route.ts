import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { recordAuditWithClient } from "@/lib/admin/audit";
import { parseWorkflowStatus, assertPublishable, assertTransition } from "@/lib/admin/workflow";
import { adminRedirect, adminErrorResponse, adminFormErrorResponse } from "@/lib/admin/response";
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = Object.fromEntries((await request.formData()).entries());
    const name = text(body.name), slug = text(body.slug), description = text(body.description);
    const status = parseWorkflowStatus(body.status);
    if (!status || !name || !slug || !description) return adminFormErrorResponse(request, `/admin/categories/${id}`, "Valid name, slug, description, and status are required.", 400);
    const result = await prisma.$transaction(async (tx) => {
      const previous = await tx.category.findUnique({ where: { id } });
      if (!previous) throw new Error("Category not found.");
      assertTransition(previous.status, status);
      if (status === "PUBLISHED") assertPublishable({ title: name, slug, description, seoTitle: text(body.seoTitle), seoDescription: text(body.seoDescription) });
      const category = await tx.category.update({ where: { id }, data: { name, slug, description, seoTitle: text(body.seoTitle) || null, seoDescription: text(body.seoDescription) || null, status } });
      await recordAuditWithClient(tx, previous.status !== status && status === "PUBLISHED" ? "PUBLISH" : previous.status === "PUBLISHED" && status === "DRAFT" ? "UNPUBLISH" : "UPDATE", "Category", id, { slug, status });
      return category;
    });
    return adminRedirect(`/admin/categories/${result.id}?saved=1`);
  } catch (error) { return adminErrorResponse(error, "Unable to update category.", request, `/admin/categories/${(await params).id}`); }
}
