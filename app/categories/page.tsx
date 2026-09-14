import Link from "next/link";
import { RuledGrid } from "@/components/layout/RuledGrid";
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

  return <section className="shell py-20 sm:py-28">
    <header className="grid gap-8 border-b border-[var(--line)] pb-12 lg:grid-cols-[1fr_22rem] lg:items-end">
      <div><p className="eyebrow">The category index</p><h1 className="section-heading mt-5 max-w-4xl">What are you trying to do?</h1></div>
      <p className="leading-7 text-[var(--muted)]">Each category is a decision, not a folder: a focused set of published tools you can rank, compare and choose between.</p>
    </header>
    {categories.length ? <RuledGrid className="mt-12" columns="sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => <Link key={category.id} href={`/categories/${category.slug}`} className={`ruled-cell group flex min-h-56 flex-col justify-between ${index === 0 ? "bg-white sm:col-span-2 lg:col-span-1" : ""} ${category._count.products === 0 ? "opacity-55" : ""}`}>
        <div className="flex items-start justify-between gap-4"><span className="text-xs font-bold tracking-[0.16em] text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span><span className="text-xl text-[var(--accent)] transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span></div>
        <div><h2 className="text-2xl font-bold tracking-[-0.04em] group-hover:text-[var(--accent-deep)]">{category.name}</h2>{category.description && <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">{category.description}</p>}<p className="metadata mt-5">{category._count.products} published {category._count.products === 1 ? "tool" : "tools"}</p></div>
      </Link>)}
    </RuledGrid> : <div className="mt-12 border border-dashed border-[var(--line)] bg-white p-8 text-[var(--muted)]"><p>No published categories yet.</p><Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Browse tools ↗</Link></div>}
  </section>;
}
