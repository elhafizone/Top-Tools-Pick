import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(
  "Affiliate Disclosure",
  "How TopToolsPick earns money through affiliate relationships — and how that never changes a ranking.",
  "/affiliate-disclosure",
);

const LAST_UPDATED = "September 2025";

export default function AffiliateDisclosurePage() {
  return (
    <article className="shell py-12 sm:py-16">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Affiliate Disclosure" }]} />

      <header className="mt-10 max-w-3xl border-b border-[var(--line)] pb-10">
        <p className="eyebrow">Transparency</p>
        <h1 className="section-heading mt-3">Affiliate Disclosure</h1>
        <p className="lede mt-5">
          Some links on this site earn us a commission. Here is exactly what that means —
          and more importantly, what it does not mean.
        </p>
        <p className="mt-4 text-sm text-[var(--muted)]">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="mt-14 max-w-2xl">
        <Section title="The short version">
          <p>
            This site is reader-supported. When you click an affiliate link and make a purchase, we
            may earn a commission from the software vendor. <strong>This never changes the price you
            pay</strong>, and <strong>it never changes a tool&apos;s ranking</strong>.
          </p>
          <p className="mt-4">
            We are required by law — specifically the FTC&apos;s guidelines on endorsements and
            testimonials — to be transparent about these relationships. We are happy to be: we
            believe honest disclosure is good for readers and for the long-term credibility of this
            site.
          </p>
        </Section>

        <Section title="How affiliate links work on this site">
          <p>
            Outbound links to tools we cover route through{" "}
            <code className="text-sm">toptoolspick.com/go/[tool-slug]</code> before redirecting to
            the vendor&apos;s site. This gives us one place to update destination URLs, and it lets
            affiliate networks attribute the referral correctly.
          </p>
          <p className="mt-4">
            Every affiliate link carries <code className="text-sm">rel=&quot;nofollow sponsored&quot;</code>{" "}
            in its HTML, the standard machine-readable declaration for commercial links.
          </p>
        </Section>

        <Section title="What affiliate relationships do not change">
          <ul className="mt-4 flex flex-col gap-3 text-[var(--body)]">
            <li className="flex gap-3">
              <span className="mt-0.5 text-[var(--ink-accent)]">✓</span>
              <span>
                <strong>Rankings.</strong> Award slots and shortlist positions are set by an editor
                based on fit, capability and value. A company cannot pay to appear in a list, to
                rank higher or to have a competitor removed.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-[var(--ink-accent)]">✓</span>
              <span>
                <strong>Coverage.</strong> We cover tools because they are relevant to our readers,
                not because they have an affiliate programme. Many tools we review either have no
                programme at all, or their programme is not yet active on our side.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-[var(--ink-accent)]">✓</span>
              <span>
                <strong>Editorial tone.</strong> We write about limitations honestly. If a tool has
                a better-funded affiliate programme than a competing tool, that competing tool still
                gets exactly the same treatment in our reviews and comparisons.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-[var(--ink-accent)]">✓</span>
              <span>
                <strong>Your price.</strong> Affiliate commissions are paid by vendors, not by
                buyers. You pay the same price whether you arrive through this site or navigate to
                the vendor directly.
              </span>
            </li>
          </ul>
        </Section>

        <Section title="How to tell if a link is an affiliate link">
          <p>
            All outbound calls-to-action on tool pages (buttons labelled &quot;Start free trial&quot;,
            &quot;Get started free&quot;, &quot;Visit [tool]&quot;) go through our redirect path and
            may be affiliate links. Plain text links within article bodies and comparison prose are
            not.
          </p>
          <p className="mt-4">
            If you want to visit a tool without going through an affiliate link, you can always type
            the tool&apos;s domain directly into your browser. We list the vendor URL on every tool
            page.
          </p>
        </Section>

        <Section title="Questions">
          If you have questions about a specific commercial relationship or about our editorial
          independence, email us at{" "}
          <a href="mailto:hello@toptoolspick.com" className="editorial-link">
            hello@toptoolspick.com
          </a>
          . We will answer honestly.
        </Section>
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
