import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata("Tool categories | TopToolsPick", "Explore curated software and digital products by category.", "/categories");

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null, status: "PUBLISHED" },
    orderBy: { name: "asc" },
    include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
  });

  return <section className="shell py-20 sm:py-28">
    <header className="grid gap-8 border-b border-[var(--line)] pb-12 lg:grid-cols-[1fr_22rem] lg:items-end">
      <div><p className="eyebrow">The category index</p><h1 className="section-heading mt-5 max-w-4xl">Find your way into the tool ecosystem.</h1></div>
      <p className="leading-7 text-[var(--muted)]">Categories are editorial starting points: focused groups of published tools organized around how people work, create, and make decisions.</p>
    </header>
    {categories.length ? <div className="mt-12 grid border-t border-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => <Link key={category.id} href={`/categories/${category.slug}`} className={`group flex min-h-56 flex-col justify-between border-b border-[var(--line)] py-7 pr-6 sm:nth-[even]:border-l sm:nth-[even]:pl-6 lg:nth-[3n+2]:border-l lg:nth-[3n+2]:pl-6 lg:nth-[3n]:border-l lg:nth-[3n]:pl-6 ${index === 0 ? "bg-white sm:col-span-2 lg:col-span-1" : ""}`}>
        <div className="flex items-start justify-between gap-4"><span className="text-xs font-bold tracking-[0.16em] text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span><span className="text-xl text-[var(--accent)] transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span></div>
        <div><h2 className="text-2xl font-bold tracking-[-0.04em] group-hover:text-[var(--accent-deep)]">{category.name}</h2>{category.description && <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">{category.description}</p>}<p className="metadata mt-5">{category._count.products} published {category._count.products === 1 ? "tool" : "tools"}</p></div>
      </Link>)}
    </div> : <div className="mt-12 border border-dashed border-[var(--line)] bg-white p-8 text-[var(--muted)]"><p>No published categories yet.</p><Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Browse tools ↗</Link></div>}
  </section>;
}
