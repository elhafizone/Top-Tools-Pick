import Link from "next/link";
import { RuledGrid } from "@/components/layout/RuledGrid";
import { prisma } from "@/lib/db/prisma";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("Stories | TopToolsPick", "Short, visual guides to better digital tools.", "/stories");
export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });
  return <section className="shell py-20 sm:py-28"><header className="max-w-3xl"><p className="eyebrow">Visual guides</p><h1 className="section-heading mt-5">Stories for better work.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Immersive, visual guides to the tools and habits that make digital work feel lighter.</p></header>{stories.length ? <RuledGrid className="mt-12" columns="sm:grid-cols-2 lg:grid-cols-3">{stories.map((story, index) => <Link key={story.id} href={`/stories/${story.slug}`} className={`ruled-cell group ${index === 0 ? "bg-[var(--ink)] text-white sm:col-span-2 lg:col-span-2" : ""}`}><span className={`text-xs font-bold uppercase tracking-[0.14em] ${index === 0 ? "text-[#7eb8ff]" : "text-[var(--accent)]"}`}>Story 0{index + 1}</span><h2 className={`mt-16 max-w-xl text-2xl font-bold tracking-[-0.04em] group-hover:text-[#7eb8ff] ${index === 0 ? "sm:text-4xl" : ""}`}>{story.title}</h2><p className={`mt-3 max-w-xl text-sm leading-6 ${index === 0 ? "text-[#cbd0da]" : "text-[var(--muted)]"}`}>{story.description}</p><span className={`mt-7 block text-sm font-semibold ${index === 0 ? "text-[#7eb8ff]" : "text-[var(--ink)]"}`}>Open story ↗</span></Link>)}</RuledGrid> : <div className="mt-12 border border-dashed border-[var(--line)] p-8 text-[var(--muted)]"><p>No published stories yet.</p><Link href="/tools" className="editorial-link mt-4 inline-block text-sm font-semibold text-[var(--ink)]">Explore tools ↗</Link></div>}</section>;
}
