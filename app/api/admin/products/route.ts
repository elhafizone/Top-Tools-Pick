import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { recordAudit } from "@/lib/admin/audit";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = request.headers.get("content-type")?.includes("application/json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
    const name = text(body.name);
    const slug = text(body.slug);
    const shortDescription = text(body.shortDescription);
    const description = text(body.description);
    const websiteUrl = text(body.websiteUrl);
    const categoryId = text(body.categoryId);
    if (!name || !slug || !shortDescription || !description || !websiteUrl || !categoryId) return NextResponse.json({ error: "Required product fields are missing." }, { status: 400 });
    const product = await prisma.product.create({ data: { name, slug, shortDescription, description, websiteUrl, categoryId, status: "DRAFT", pricingModel: "CUSTOM", seoTitle: text(body.seoTitle) || null, seoDescription: text(body.seoDescription) || null, pros: text(body.pros) || null, cons: text(body.cons) || null, bestFor: text(body.bestFor) || null } });
    await recordAudit("CREATE", "Product", product.id, { slug: product.slug });
    return NextResponse.json({ id: product.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Unable to create product." }, { status: 500 });
  }
}
