import { permanentRedirect, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function VsRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Direct article match (e.g. claude-code-vs-github-copilot-which-should-you-pay-for)
  const article = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { slug: true },
  });
  if (article) permanentRedirect(`/articles/${article.slug}`);

  // 2. Fuzzy match article
  const articleFuzzy = await prisma.article.findFirst({
    where: { slug: { contains: slug }, status: "PUBLISHED" },
    select: { slug: true },
  });
  if (articleFuzzy) permanentRedirect(`/articles/${articleFuzzy.slug}`);

  // 3. Fallback to /comparisons
  redirect("/comparisons");
}
