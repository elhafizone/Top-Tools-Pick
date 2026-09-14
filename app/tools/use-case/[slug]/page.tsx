import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FacetPage } from "@/components/product/FacetPage";
import { getFacet, getProductsByUseCase } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** Below this many tools the page is too thin to index - same gate as /tools/[slug]/alternatives. */
const MIN_INDEXABLE = 3;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const facet = await getFacet("use-case", slug);
  if (!facet) notFound();

  const products = await getProductsByUseCase(slug);

  return (
    <FacetPage
      kicker="By use case"
      heading={`Best tools for ${facet.name}`}
      intro={`Every published tool we list for ${facet.name}, ranked by editorial score.`}
      basePath="/tools/use-case"
      facetName={facet.name}
      facetSlug={facet.slug}
      products={products}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const facet = await getFacet("use-case", slug);
  if (!facet) return { title: "Not found" };

  const products = await getProductsByUseCase(slug);
  return buildMetadata(
    `Best tools for ${facet.name}`,
    `Every published tool we list for ${facet.name}, ranked by editorial score.`,
    `/tools/use-case/${slug}`,
    products.length >= MIN_INDEXABLE ? {} : { robots: { index: false, follow: true } },
  );
}
