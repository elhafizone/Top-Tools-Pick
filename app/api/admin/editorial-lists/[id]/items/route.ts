import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { recordAuditWithClient } from "@/lib/admin/audit";
import { adminErrorResponse } from "@/lib/admin/response";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json() as { items?: Array<{ productId?: string; rank?: number; rationale?: string; award?: string }> };
    const items = body.items;
    if (!Array.isArray(items)) return NextResponse.json({ error: "Items must be an array." }, { status: 400 });
    if (!items.length || items.some((item) => typeof item.productId !== "string" || !Number.isInteger(item.rank) || (item.rank ?? 0) < 1 || (item.rationale !== undefined && typeof item.rationale !== "string"))) return NextResponse.json({ error: "Items require unique products and positive integer ranks." }, { status: 400 });
    const ranks = new Set(items.map((item) => item.rank));
    const products = await prisma.product.findMany({ where: { id: { in: items.map((item) => item.productId!) } }, select: { id: true } });
    if (products.length !== items.length || ranks.size !== items.length) return NextResponse.json({ error: "Every product must exist and ranks must be unique." }, { status: 400 });
    await prisma.$transaction(async (tx) => {
      const list = await tx.editorialList.findUnique({ where: { id }, select: { id: true } });
      if (!list) throw new Error("Editorial list not found.");
      await tx.editorialListItem.deleteMany({ where: { listId: id } });
      await tx.editorialListItem.createMany({ data: items.map((item) => ({ listId: id, productId: item.productId!, rank: item.rank!, rationale: item.rationale?.trim() || null, award: item.award?.trim() || null })) });
      await recordAuditWithClient(tx, "REORDER", "EditorialList", id, { itemCount: items.length, replaced: true });
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminErrorResponse(error, "Unable to update editorial list items.");
  }
}
