import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { recordAudit } from "@/lib/admin/audit";
import { parseWorkflowStatus, assertPublishable, assertTransition, nextPublishedAt } from "@/lib/admin/workflow";
import { adminRedirect, adminErrorResponse, adminFormErrorResponse } from "@/lib/admin/response";

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = Object.fromEntries((await request.formData()).entries());
    const title = text(body.title);
    const slug = text(body.slug);
    const description = text(body.description);
    const status = parseWorkflowStatus(body.status);
    if (!status) return adminFormErrorResponse(request, `/admin/editorial-lists/${id}`, "Invalid workflow status.", 400);
    if (!title || !slug || !description) return adminFormErrorResponse(request, `/admin/editorial-lists/${id}`, "Title, slug, and description are required.", 400);
    const previous = await prisma.editorialList.findUnique({ where: { id }, select: { status: true, publishedAt: true } });
    if (!previous) return adminFormErrorResponse(request, `/admin/editorial-lists/${id}`, "Editorial list not found.", 404);
    assertTransition(previous.status, status);
    if (status === "PUBLISHED") assertPublishable({ title, slug, description, seoTitle: text(body.seoTitle), seoDescription: text(body.seoDescription) });
    // Binding a list to a category is what lets its award slots lead that category page.
    const categoryId = text(body.categoryId) || null;
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
      if (!category) return adminFormErrorResponse(request, `/admin/editorial-lists/${id}`, "Selected category does not exist.", 400);
    }
    await prisma.editorialList.update({ where: { id }, data: { title, slug, description, status, categoryId, publishedAt: nextPublishedAt(status, previous.publishedAt), seoTitle: text(body.seoTitle) || null, seoDescription: text(body.seoDescription) || null } });
    await recordAudit(previous?.status !== status && status === "PUBLISHED" ? "PUBLISH" : previous?.status === "PUBLISHED" && status !== "PUBLISHED" ? "UNPUBLISH" : "UPDATE", "EditorialList", id, { slug, status });
    return adminRedirect(`/admin/editorial-lists/${id}?saved=1`);
  } catch (error) {
    return adminErrorResponse(error, "Unable to update editorial list.", request, `/admin/editorial-lists/${(await params).id}`);
  }
}
