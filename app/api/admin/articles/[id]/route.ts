import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { recordAudit } from "@/lib/admin/audit";
import { parseWorkflowStatus, assertPublishable, assertTransition, nextPublishedAt } from "@/lib/admin/workflow";
import { adminRedirect, adminErrorResponse, adminFormErrorResponse } from "@/lib/admin/response";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = Object.fromEntries((await request.formData()).entries());
    const title = String(body.title ?? "").trim(), slug = String(body.slug ?? "").trim(), content = String(body.content ?? "").trim();
    const status = parseWorkflowStatus(body.status);
    if (!status || !title || !slug || !content) return adminFormErrorResponse(request, `/admin/articles/${id}`, "Title, slug, content, and a valid status are required.", 400);
    const previous = await prisma.article.findUnique({ where: { id } });
    if (!previous) return adminFormErrorResponse(request, `/admin/articles/${id}`, "Article not found.", 404);
    assertTransition(previous.status, status);
    const seoTitle = String(body.seoTitle ?? "").trim(), seoDescription = String(body.seoDescription ?? "").trim();
    if (status === "PUBLISHED") assertPublishable({ title, slug, description: content, seoTitle, seoDescription });
    await prisma.article.update({ where: { id }, data: { title, slug, excerpt: String(body.excerpt ?? "").trim() || null, content, author: String(body.author ?? "").trim() || null, source: String(body.source ?? "").trim() || null, featuredImage: String(body.featuredImage ?? "").trim() || null, canonicalUrl: String(body.canonicalUrl ?? "").trim() || null, seoTitle: seoTitle || null, seoDescription: seoDescription || null, status, publishedAt: nextPublishedAt(status, previous.publishedAt) } });
    await recordAudit(previous.status !== status && status === "PUBLISHED" ? "PUBLISH" : previous.status === "PUBLISHED" && status === "DRAFT" ? "UNPUBLISH" : "UPDATE", "Article", id, { status });
    return adminRedirect("/admin/articles");
  } catch (error) { return adminErrorResponse(error, "Unable to update article.", request, `/admin/articles/${(await params).id}`); }
}
