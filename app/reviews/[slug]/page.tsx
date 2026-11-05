import { permanentRedirect, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ReviewsRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Direct product match (reviews/slug -> tools/slug)
  const product = await prisma.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { slug: true },
  });
  if (product) permanentRedirect(`/tools/${product.slug}`);

  // 2. Direct article match
  const article = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { slug: true },
  });
  if (article) permanentRedirect(`/articles/${article.slug}`);

  // 3. Fuzzy product match
  const productFuzzy = await prisma.product.findFirst({
    where: { slug: { contains: slug }, status: "PUBLISHED" },
    select: { slug: true },
  });
  if (productFuzzy) permanentRedirect(`/tools/${productFuzzy.slug}`);

  redirect("/tools");
}
