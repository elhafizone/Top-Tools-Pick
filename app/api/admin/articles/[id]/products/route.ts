import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { recordAuditWithClient } from "@/lib/admin/audit";
import { adminErrorResponse } from "@/lib/admin/response";

type Incoming = { productId?: string; rank?: number; note?: string };

/**
 * Replace-all editor for the tools an article links to. Because article bodies are
 * plain text, this relation is the only way editorial content can link into the
 * commercial pages at all.
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
      typeof item.productId !== "string" ||
      !Number.isInteger(item.rank) ||
      (item.rank ?? 0) < 0 ||
      (item.note !== undefined && typeof item.note !== "string"));
    if (malformed) {
      return NextResponse.json({ error: "Each linked tool needs a product and a whole-number rank." }, { status: 400 });
    }

    const ids = items.map((item) => item.productId!);
    if (new Set(ids).size !== ids.length) {
      return NextResponse.json({ error: "The same tool is linked more than once." }, { status: 400 });
    }

    if (ids.length) {
      const found = await prisma.product.findMany({ where: { id: { in: ids } }, select: { id: true } });
      if (found.length !== ids.length) {
        return NextResponse.json({ error: "Every linked tool must exist." }, { status: 400 });
      }
    }

    await prisma.$transaction(async (tx) => {
      const article = await tx.article.findUnique({ where: { id }, select: { id: true } });
      if (!article) throw new Error("Article not found.");
      await tx.articleProductLink.deleteMany({ where: { articleId: id } });
      if (items.length) {
        await tx.articleProductLink.createMany({
          data: items.map((item) => ({
            articleId: id,
            productId: item.productId!,
            rank: item.rank!,
            note: item.note?.trim() || null,
          })),
        });
      }
      await recordAuditWithClient(tx, "REORDER", "ArticleProductLink", id, { itemCount: items.length, replaced: true });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminErrorResponse(error, "Unable to update linked tools.");
  }
}
