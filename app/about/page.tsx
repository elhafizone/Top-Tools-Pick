import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(
  "About TopToolsPick",
  "What we are, why we built it, and how we think about the moment before you pay for software.",
  "/about",
);

export default function AboutPage() {
  return (
    <article className="shell py-12 sm:py-16">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />

      <header className="mt-10 max-w-3xl border-b border-[var(--line)] pb-10">
        <p className="eyebrow">About us</p>
        <h1 className="section-heading mt-3">Independent research.<br />Honest shortlists.</h1>
        <p className="lede mt-5">
          TopToolsPick exists for the moment before you pay. When you have found a tool that looks
          right and are about to commit — we want to be the place you check first.
        </p>
      </header>

      <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <div className="max-w-2xl">
          <Section title="Why we built this">
            Choosing software is surprisingly hard. The vendor&apos;s own website shows the best
            possible version of the tool. Review platforms aggregate thousands of opinions that
            often tell you very little about whether a specific tool is right for your specific
            situation. Sponsored content pretends to be editorial.
          </Section>

          <Section title="What we actually do">
            <p>
              We research tools, write ranked shortlists, and build comparisons. Every page tries to
              answer the same question: <em>is this the right tool for you, or is something else a
              better fit?</em>
            </p>
            <p className="mt-4">
              We are honest about what a tool is not good at. We lead with who a tool suits and —
              just as importantly — who should look elsewhere. We never add a limitation just to
              look balanced, and we never hide one because a vendor has an affiliate deal with us.
            </p>
          </Section>

          <Section title="The model">
            <p>
              The site is free to use. We earn money through affiliate commissions when you click
              through to a tool and sign up. This is a straightforward deal: we write honestly, you
              trust the recommendation, the vendor pays us for the introduction.
            </p>
            <p className="mt-4">
              The deal only works if the recommendation is trustworthy. A ranking that could be
              bought would destroy the thing it is selling. So rankings cannot be bought. You can
              read exactly how that works on our{" "}
              <Link href="/methodology" className="editorial-link">methodology page</Link>.
            </p>
          </Section>

          <Section title="Coverage">
            We focus on software and digital services: AI tools, marketing platforms, developer
            tools, e-commerce, productivity, design, security and more. We do not review physical
            products. We add categories when we can do the research properly — a thin page is worse
            than no page.
          </Section>

          <Section title="Get in touch">
            <p>
              Found something out of date? Spotted a tool we should cover? Have a question about how
              we reached a verdict?
            </p>
            <p className="mt-4">
              Email us at{" "}
              <a href="mailto:hello@toptoolspick.com" className="editorial-link">
                hello@toptoolspick.com
              </a>
              . We read everything.
            </p>
          </Section>
        </div>

        <aside className="h-fit border-t border-[var(--ink)] pt-5 lg:sticky lg:top-24">
          <p className="eyebrow">Quick links</p>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <Link href="/methodology" className="editorial-link font-semibold text-[var(--ink)]">
              How we pick tools ↗
            </Link>
            <Link href="/affiliate-disclosure" className="editorial-link font-semibold text-[var(--ink)]">
              Affiliate disclosure ↗
            </Link>
            <Link href="/best" className="editorial-link font-semibold text-[var(--ink)]">
              See our shortlists ↗
            </Link>
            <Link href="/comparisons" className="editorial-link font-semibold text-[var(--ink)]">
              Read comparisons ↗
            </Link>
            <Link href="/contact" className="editorial-link font-semibold text-[var(--ink)]">
              Contact us ↗
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="sub-heading">{title}</h2>
      <div className="article-content mt-4">{children}</div>
    </section>
  );
}
