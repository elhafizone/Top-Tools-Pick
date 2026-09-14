import Link from "next/link";
import { Disclosure } from "@/components/affiliate/Disclosure";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata(
  "How we pick",
  "How TopToolsPick researches, ranks and monetises its recommendations — and what that means for you.",
  "/methodology",
);

/**
 * Editorial independence and monetisation, stated plainly.
 *
 * An affiliate site that recommends purchases has to say how it makes money and how
 * it ranks, both for readers and because search engines weigh it. The homepage links
 * here from its "How we pick" section.
 */
export default function MethodologyPage() {
  return (
    <article className="shell py-20 sm:py-28">
      <nav aria-label="Breadcrumb" className="breadcrumb flex flex-wrap items-center gap-x-2 gap-y-1">
        <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--ink)]">How we pick</span>
      </nav>

      <header className="mt-10 max-w-3xl border-b border-[var(--line)] pb-12">
        <p className="eyebrow">Editorial policy</p>
        <h1 className="section-heading mt-5">How we pick.</h1>
        <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
          We exist to help you choose a tool, not to move you towards whichever one pays most.
          Here is exactly how that works.
        </p>
      </header>

      <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <div className="max-w-2xl">
          <Section title="Nobody can buy a placement">
            Rankings and award slots are set by an editor and the reasoning is written next to each
            pick. A company cannot pay to appear, to rank higher, or to have a competitor removed.
            Where a commercial relationship exists, it is labelled.
          </Section>

          <Section title="Fit comes before features">
            A long feature list is not the same as a good decision. Every tool page leads with who
            the tool suits and who should look elsewhere, because the wrong tool is expensive no
            matter how capable it is. If a tool is not right for you, we would rather send you to
            one that is.
          </Section>

          <Section title="What we will not claim">
            We only state a free plan, a free trial or a price when it is recorded against that
            tool in our own data. If we have not verified it, the page simply does not mention it
            rather than guessing. Alternatives are written by hand, so the reason you see for
            choosing one is a reason someone actually stands behind.
          </Section>

          <Section title="How we make money">
            Some outbound links are affiliate links, which means we may earn a commission if you
            sign up. This never changes what you pay, and it never changes a ranking. Affiliate
            links carry a <code className="text-sm">sponsored</code> attribute and open in a new
            tab, and a tool with no commercial relationship gets exactly the same treatment as one
            that has one.
          </Section>

          <Section title="Keeping pages honest over time">
            Pricing and plans change. Tool pages record when they were last reviewed, and anything
            we have not re-checked does not pretend otherwise. If you spot something out of date,
            tell us and we will fix it.
          </Section>
        </div>

        <aside className="h-fit border-t border-[var(--ink)] pt-5 lg:sticky lg:top-24">
          <p className="eyebrow">Transparency</p>
          <div className="mt-4"><Disclosure /></div>
          <div className="mt-6 flex flex-col gap-2 border-t border-[var(--line)] pt-5 text-sm">
            <Link href="/best" className="editorial-link font-semibold text-[var(--ink)]">See a ranked shortlist ↗</Link>
            <Link href="/comparisons" className="editorial-link font-semibold text-[var(--ink)]">Read a comparison ↗</Link>
            <Link href="/tools" className="editorial-link font-semibold text-[var(--ink)]">Browse all tools ↗</Link>
          </div>
        </aside>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="text-2xl font-bold tracking-[-0.04em]">{title}</h2>
      <p className="article-content mt-4">{children}</p>
    </section>
  );
}
