/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { breadcrumbJsonLd, jsonLd, storyMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

const safeMediaUrl = (value: string | null) => {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" ? url.toString() : null; } catch { return null; }
};

const safeCtaUrl = (value: string | null) => {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null; } catch { return null; }
};

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await prisma.story.findFirst({ where: { slug, status: "PUBLISHED" }, include: { pages: { orderBy: { sortOrder: "asc" } } } });
  if (!story) notFound();
  const breadcrumbs = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Stories", path: "/stories" }, { name: story.title, path: `/stories/${story.slug}` }]);
  return <article className="shell py-20 sm:py-28">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1"><Link href="/" className="hover:text-[var(--ink)]">Home</Link><span aria-hidden="true">/</span><Link href="/stories" className="hover:text-[var(--ink)]">Stories</Link><span aria-hidden="true">/</span><span className="text-[var(--ink)]">{story.title}</span></nav>
    <header className="mt-14 max-w-4xl border-b border-[var(--line)] pb-12"><p className="eyebrow">Visual story</p><h1 className="section-heading mt-5">{story.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{story.description}</p>{story.publishedAt && <time className="metadata mt-6 block" dateTime={story.publishedAt.toISOString()}>{new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(story.publishedAt)}</time>}</header>
    <div className="mx-auto mt-12 max-w-4xl space-y-12">{story.pages.map((page) => { const media = safeMediaUrl(page.mediaUrl); const cta = safeCtaUrl(page.ctaUrl); return <section key={page.id} className="grid gap-7 border-b border-[var(--line)] pb-12 md:grid-cols-[minmax(12rem,20rem)_1fr] md:items-center">{media ? <div className="overflow-hidden bg-[var(--blue-wash)]"><img src={media} alt={page.text} loading="lazy" className="aspect-[9/16] max-h-[32rem] w-full object-cover" /></div> : <div className="flex aspect-[9/16] max-h-[32rem] items-end bg-[var(--blue-wash)] p-6 text-sm font-semibold text-[var(--accent-deep)]">Visual story page</div>}<div><p className="eyebrow">Page {page.sortOrder}</p><p className="mt-4 max-w-xl text-2xl font-bold leading-tight tracking-[-0.04em]">{page.text}</p>{cta && page.ctaLabel && <a href={cta} target="_blank" rel="nofollow sponsored noopener noreferrer" className="button-secondary mt-7">{page.ctaLabel} ↗</a>}</div></section>; })}</div>
  </article>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await prisma.story.findFirst({ where: { slug, status: "PUBLISHED" }, select: { title: true, description: true } });
  return story ? storyMetadata(story.title, story.description, slug) : storyMetadata("Story not found", "The requested story could not be found.", slug);
}
