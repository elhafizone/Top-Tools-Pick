import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FacetPage } from "@/components/product/FacetPage";
import { getFacet, getProductsByPlatform } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** Below this many tools the page is too thin to index - same gate as /tools/[slug]/alternatives. */
const MIN_INDEXABLE = 3;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const facet = await getFacet("platform", slug);
  if (!facet) notFound();

  const products = await getProductsByPlatform(slug);

  return (
    <FacetPage
      kicker="By platform"
      heading={`Best tools available on ${facet.name}`}
      intro={`Published tools with a ${facet.name} client or interface, ranked by editorial score.`}
      basePath="/tools/platform"
      facetName={facet.name}
      facetSlug={facet.slug}
      products={products}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const facet = await getFacet("platform", slug);
  if (!facet) return { title: "Not found" };

  const products = await getProductsByPlatform(slug);
  return buildMetadata(
    `Best tools on ${facet.name}`,
    `Published tools with a ${facet.name} client or interface, ranked by editorial score.`,
    `/tools/platform/${slug}`,
    products.length >= MIN_INDEXABLE ? {} : { robots: { index: false, follow: true } },
  );
}
