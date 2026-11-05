import { permanentRedirect, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function PricingRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Check if there is an article with this exact slug
  const article = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { slug: true },
  });
  if (article) permanentRedirect(`/articles/${article.slug}`);

  // 2. Check if there is a product with this exact slug
  const product = await prisma.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { slug: true },
  });
  if (product) permanentRedirect(`/tools/${product.slug}`);

  // 3. Fuzzy match article (e.g. "deepseek" matching "deepseek-api-pricing-explained")
  const articleFuzzy = await prisma.article.findFirst({
    where: { slug: { contains: slug }, status: "PUBLISHED" },
    select: { slug: true },
  });
  if (articleFuzzy) permanentRedirect(`/articles/${articleFuzzy.slug}`);

  // 4. Fuzzy match product
  const productFuzzy = await prisma.product.findFirst({
    where: { slug: { contains: slug }, status: "PUBLISHED" },
    select: { slug: true },
  });
  if (productFuzzy) permanentRedirect(`/tools/${productFuzzy.slug}`);

  redirect("/tools");
}
