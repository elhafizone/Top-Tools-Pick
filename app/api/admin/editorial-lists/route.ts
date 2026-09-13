import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { recordAudit } from "@/lib/admin/audit";
import { adminErrorResponse, adminFormErrorResponse } from "@/lib/admin/response";

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = request.headers.get("content-type")?.includes("application/json") ? await request.json() : Object.fromEntries((await request.formData()).entries());
    const title = text(body.title);
    const slug = text(body.slug);
    const description = text(body.description);
    if (!title || !slug || !description) return adminFormErrorResponse(request, "/admin/editorial-lists/new", "Title, slug, and description are required.", 400);
    const list = await prisma.editorialList.create({ data: { title, slug, description, status: "DRAFT", seoTitle: text(body.seoTitle) || null, seoDescription: text(body.seoDescription) || null } });
    await recordAudit("CREATE", "EditorialList", list.id, { slug: list.slug });
    return request.headers.get("content-type")?.includes("application/json") ? NextResponse.json({ id: list.id }, { status: 201 }) : NextResponse.redirect(new URL(`/admin/editorial-lists/${list.id}`, request.url), { status: 303 });
  } catch (error) {
    return adminErrorResponse(error, "Unable to create editorial list.", request, "/admin/editorial-lists/new");
  }
}
