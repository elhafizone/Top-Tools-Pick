import Link from "next/link";
import { RuledGrid } from "@/components/layout/RuledGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { prisma } from "@/lib/db/prisma";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("Stories", "Short, visual guides to better digital tools.", "/stories");
export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <section className="band">
        <div className="shell py-8 sm:py-12">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Stories" }]} />
          <div className="mt-8 max-w-3xl">
            <p className="eyebrow">Visual guides</p>
            <h1 className="section-heading mt-3">Stories for better work.</h1>
            <p className="lede mt-5">Short, visual guides to the tools and habits that make digital work feel lighter.</p>
          </div>
        </div>
      </section>

      <section className="shell py-12 sm:py-16">
        {stories.length ? (
          <RuledGrid columns="sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => (
              <Link key={story.id} href={`/stories/${story.slug}`} className="ruled-cell group flex flex-col justify-between sm:min-h-48">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent-deep)]">Story {String(index + 1).padStart(2, "0")}</span>
                <span className="mt-6 block sm:mt-10">
                  <span className="block max-w-xl text-xl font-bold tracking-[-0.025em] group-hover:text-[var(--accent-deep)]">{story.title}</span>
                  <span className="mt-2 block max-w-xl text-sm leading-6 text-[var(--muted)]">{story.description}</span>
                </span>
              </Link>
            ))}
          </RuledGrid>
        ) : (
          <div className="rounded-[var(--radius-surface)] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] p-8 text-[var(--muted)]">
            <p>No published stories yet.</p>
            <Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Explore tools</Link>
          </div>
        )}
      </section>
    </div>
  );
}
