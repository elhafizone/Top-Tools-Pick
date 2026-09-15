import Link from "next/link";
import { RuledGrid } from "@/components/layout/RuledGrid";
import { SearchForm } from "@/components/search/SearchForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { prisma } from "@/lib/db/prisma";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata("Tool categories", "Pick the job you are trying to do, then compare the tools that do it.", "/categories");

export default async function CategoriesPage() {
  const rows = await prisma.category.findMany({
    where: { parentId: null, status: "PUBLISHED" },
    orderBy: { name: "asc" },
    include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
  });
  // Categories with nothing published are dead ends. Keep them listed so the taxonomy
  // stays honest, but never let them outrank a category someone can actually use.
  const categories = [...rows].sort((a, b) => Number(b._count.products > 0) - Number(a._count.products > 0));

  return (
    <div>
      <section className="band">
        <div className="shell py-8 sm:py-12">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Categories" }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow">The category index</p>
              <h1 className="section-heading mt-3 max-w-3xl">What are you trying to do?</h1>
              <p className="lede mt-5 max-w-2xl">
                Each category is a decision, not a folder: a focused set of published tools you can rank, compare and choose between.
              </p>
            </div>
            <SearchForm
              id="categories-search"
              label="Search tools"
              placeholder="Or search by what you need"
              submitLabel="Search"
            />
          </div>
        </div>
      </section>

      <section className="shell py-12 sm:py-16">
        {categories.length ? (
          <RuledGrid columns="sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className={`ruled-cell group flex flex-col justify-between sm:min-h-48 ${category._count.products === 0 ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                    {category._count.products} published {category._count.products === 1 ? "tool" : "tools"}
                  </span>
                  <span className="text-[var(--accent)] hover-shift" aria-hidden="true">&#8594;</span>
                </div>
                <div className="mt-6 sm:mt-10">
                  <h2 className="text-xl font-bold tracking-[-0.025em] group-hover:text-[var(--accent-deep)]">{category.name}</h2>
                  {category.description && <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">{category.description}</p>}
                </div>
              </Link>
            ))}
          </RuledGrid>
        ) : (
          <div className="rounded-[var(--radius-surface)] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] p-8 text-[var(--muted)]">
            <p>No published categories yet.</p>
            <Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Browse tools</Link>
          </div>
        )}
      </section>
    </div>
  );
}
