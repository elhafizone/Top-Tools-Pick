import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { recordAuditWithClient } from "@/lib/admin/audit";
import { parseWorkflowStatus, assertPublishable, assertTransition, nextPublishedAt } from "@/lib/admin/workflow";
import { adminErrorResponse, adminFormErrorResponse } from "@/lib/admin/response";
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = Object.fromEntries((await request.formData()).entries());
    const title = text(body.title), slug = text(body.slug), description = text(body.description), posterImage = text(body.posterImage), mediaUrl = text(body.mediaUrl);
    const status = parseWorkflowStatus(body.status);
    if (!status || !title || !slug || !description) return adminFormErrorResponse(request, `/admin/stories/${id}`, "Title, slug, description, and status are required.", 400);
    const result = await prisma.$transaction(async (tx) => {
      const previous = await tx.story.findUnique({ where: { id }, include: { pages: true } });
      if (!previous) throw new Error("Story not found.");
      assertTransition(previous.status, status);
      if (status === "PUBLISHED") {
        assertPublishable({ title, slug, description, seoTitle: text(body.seoTitle), seoDescription: text(body.seoDescription) });
        if (!posterImage || !mediaUrl) throw new Error("Published stories require a poster image and page media.");
        if (!previous.pages.length) throw new Error("Published stories require at least one page.");
      }
      const story = await tx.story.update({ where: { id }, data: { title, slug, description, posterImage, seoTitle: text(body.seoTitle) || null, seoDescription: text(body.seoDescription) || null, status, publishedAt: nextPublishedAt(status, previous.publishedAt) } });
      const firstPage = previous.pages.sort((a, b) => a.sortOrder - b.sortOrder)[0];
      if (firstPage) await tx.storyPage.update({ where: { id: firstPage.id }, data: { text: text(body.pageText) || description, mediaUrl } });
      await recordAuditWithClient(tx, previous.status !== status && status === "PUBLISHED" ? "PUBLISH" : previous.status === "PUBLISHED" && status === "DRAFT" ? "UNPUBLISH" : "UPDATE", "Story", id, { slug, status, pageCount: previous.pages.length });
      return story;
    });
    return NextResponse.redirect(new URL(`/admin/stories/${result.id}?saved=1`, request.url), { status: 303 });
  } catch (error) { return adminErrorResponse(error, "Unable to update story.", request, `/admin/stories/${(await params).id}`); }
}
