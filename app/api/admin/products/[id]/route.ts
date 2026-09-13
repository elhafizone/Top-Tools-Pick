import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { recordAudit } from "@/lib/admin/audit";
import { parseWorkflowStatus, assertPublishable, assertTransition } from "@/lib/admin/workflow";
import { adminRedirect } from "@/lib/admin/response";

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

function errorResponse(request: Request, id: string, message: string, status: number) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return adminRedirect(`/admin/products/${id}?error=${encodeURIComponent(message)}`);
  }
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = request.headers.get("content-type")?.includes("application/json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
    // Never silently coerce an unknown status to DRAFT - that used to un-archive
    // archived products whenever the edit form was saved without a status change.
    const status = parseWorkflowStatus(body.status);
    if (!status) return errorResponse(request, id, "Select a valid workflow status.", 400);
    const data = {
      name: text(body.name),
      slug: text(body.slug),
      shortDescription: text(body.shortDescription),
      description: text(body.description),
      websiteUrl: text(body.websiteUrl),
      status,
      seoTitle: text(body.seoTitle) || null,
      seoDescription: text(body.seoDescription) || null,
      pros: text(body.pros) || null,
      cons: text(body.cons) || null,
      bestFor: text(body.bestFor) || null,
    } as const;
    if (!data.name || !data.slug || !data.shortDescription || !data.description || !data.websiteUrl) return errorResponse(request, id, "Required product fields are missing.", 400);
    // The public tool page parses this with new URL(); a schemeless value would crash it.
    if (!isHttpUrl(data.websiteUrl)) return errorResponse(request, id, "Website URL must be a full http(s) URL.", 400);
    const previous = await prisma.product.findUnique({ where: { id }, select: { status: true } });
    if (!previous) return errorResponse(request, id, "Product not found.", 404);
    assertTransition(previous.status, data.status);
    if (data.status === "PUBLISHED") assertPublishable({ title: data.name, slug: data.slug, description: data.description, seoTitle: data.seoTitle, seoDescription: data.seoDescription });
    await prisma.product.update({ where: { id }, data });
    await recordAudit(previous?.status !== data.status && data.status === "PUBLISHED" ? "PUBLISH" : previous?.status === "PUBLISHED" && data.status !== "PUBLISHED" ? "UNPUBLISH" : "UPDATE", "Product", id, { slug: data.slug, status: data.status });
    if (!request.headers.get("content-type")?.includes("application/json")) return adminRedirect(`/admin/products/${id}?saved=1`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof Error && (error.message.startsWith("Invalid publication transition:") || error.message.startsWith("Published content requires"))) {
      return errorResponse(request, (await params).id, error.message, 400);
    }
    return NextResponse.json({ error: "Unable to update product." }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return PATCH(request, context);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, slug: true, _count: { select: { editorialItems: true } } },
    });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    if (product._count.editorialItems) {
      return NextResponse.json({ error: "This product is used by an editorial list and cannot be deleted yet." }, { status: 409 });
    }
    await prisma.product.delete({ where: { id } });
    await recordAudit("DELETE", "Product", id, { slug: product.slug });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Unable to delete product." }, { status: 500 });
  }
}
