import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { recordAuditWithClient } from "@/lib/admin/audit";
import { adminErrorResponse } from "@/lib/admin/response";

type Incoming = { alternativeId?: string; rank?: number; reason?: string };

/**
 * Replace-all editor for a product's curated alternatives, mirroring the shape of
 * /api/admin/editorial-lists/[id]/items.
 *
 * An empty array is valid and clears the list - the public section simply hides,
 * which is the intended behaviour for curated-only alternatives.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json() as { items?: Incoming[] };
    const items = body.items;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Items must be an array." }, { status: 400 });
    }

    const malformed = items.some((item) =>
      typeof item.alternativeId !== "string" ||
      !Number.isInteger(item.rank) ||
      (item.rank ?? 0) < 0 ||
      (item.reason !== undefined && typeof item.reason !== "string"));
    if (malformed) {
      return NextResponse.json({ error: "Each alternative needs a product and a whole-number rank." }, { status: 400 });
    }

    const ids = items.map((item) => item.alternativeId!);
    // Prisma cannot express CHECK (productId <> alternativeId), so reject it here.
    if (ids.includes(id)) {
      return NextResponse.json({ error: "A tool cannot be an alternative to itself." }, { status: 400 });
    }
    if (new Set(ids).size !== ids.length) {
      return NextResponse.json({ error: "The same alternative is listed more than once." }, { status: 400 });
    }

    if (ids.length) {
      const found = await prisma.product.findMany({ where: { id: { in: ids } }, select: { id: true } });
      if (found.length !== ids.length) {
        return NextResponse.json({ error: "Every alternative must be an existing tool." }, { status: 400 });
      }
    }

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id }, select: { id: true } });
      if (!product) throw new Error("Product not found.");
      await tx.productAlternative.deleteMany({ where: { productId: id } });
      if (items.length) {
        await tx.productAlternative.createMany({
          data: items.map((item) => ({
            productId: id,
            alternativeId: item.alternativeId!,
            rank: item.rank!,
            reason: item.reason?.trim() || null,
          })),
        });
      }
      await recordAuditWithClient(tx, "REORDER", "ProductAlternative", id, { itemCount: items.length, replaced: true });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminErrorResponse(error, "Unable to update alternatives.");
  }
}
