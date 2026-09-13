import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { recordAuditWithClient } from "@/lib/admin/audit";
import { adminErrorResponse, adminFormErrorResponse } from "@/lib/admin/response";
export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = Object.fromEntries((await request.formData()).entries());
    const title = String(body.title ?? "").trim(), slug = String(body.slug ?? "").trim(), description = String(body.description ?? "").trim();
    if (!title || !slug || !description) return adminFormErrorResponse(request, "/admin/stories/new", "Title, slug and description are required.", 400);
    await prisma.$transaction(async (tx) => {
      const story = await tx.story.create({ data: { title, slug, description, posterImage: String(body.posterImage ?? "").trim() || null, seoTitle: String(body.seoTitle ?? "").trim() || null, seoDescription: String(body.seoDescription ?? "").trim() || null, status: "DRAFT", pages: { create: { sortOrder: 1, text: description, mediaUrl: String(body.mediaUrl ?? "").trim() || null } } } });
      await recordAuditWithClient(tx, "CREATE", "Story", story.id, { slug });
    });
    return NextResponse.redirect(new URL("/admin/stories", request.url), { status: 303 });
  } catch (error) { return adminErrorResponse(error, "Unable to create story.", request, "/admin/stories/new"); }
}
