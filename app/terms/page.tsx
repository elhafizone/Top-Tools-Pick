import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(
  "Terms of Use",
  "The terms that govern your use of TopToolsPick — what we offer, what we don't, and what is expected.",
  "/terms",
);

const LAST_UPDATED = "September 2025";

export default function TermsPage() {
  return (
    <article className="shell py-12 sm:py-16">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Terms of Use" }]} />

      <header className="mt-10 max-w-3xl border-b border-[var(--line)] pb-10">
        <p className="eyebrow">Legal</p>
        <h1 className="section-heading mt-3">Terms of Use</h1>
        <p className="lede mt-5">
          These terms govern your use of TopToolsPick. By using the site you agree to them.
          They are written in plain language — no legal jargon where plain words will do.
        </p>
        <p className="mt-4 text-sm text-[var(--muted)]">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="mt-14 max-w-2xl">
        <Section title="What TopToolsPick is">
          TopToolsPick is an independent editorial site. We research software tools and publish
          ranked shortlists, comparisons and reviews to help people make better purchasing
          decisions. We are not a software vendor, reseller or broker. We do not provide advice
          in a professional, legal, financial or technical capacity.
        </Section>

        <Section title="Accuracy of content">
          <p>
            We make reasonable efforts to keep tool reviews, pricing information and feature
            details accurate. Software changes quickly, and we cannot guarantee that every detail
            on every page reflects the current state of a product at the moment you read it.
          </p>
          <p className="mt-4">
            Pages record when they were last reviewed. Rely on the information as a starting
            point, not as a substitute for reading the vendor&apos;s own documentation before
            committing to a purchase.
          </p>
        </Section>

        <Section title="Affiliate relationships">
          Some outbound links are affiliate links. If you click one and make a purchase, we may
          receive a commission from the vendor. This commission is paid by the vendor and does not
          increase the price you pay. Affiliate links are labelled and carry a{" "}
          <code className="text-sm">rel=&quot;nofollow sponsored&quot;</code> attribute. Commercial
          relationships do not influence rankings or editorial coverage. See our{" "}
          <a href="/affiliate-disclosure" className="editorial-link">full affiliate disclosure</a>{" "}
          for details.
        </Section>

        <Section title="Intellectual property">
          <p>
            All editorial content on this site — text, rankings, comparisons, scores — is the
            property of TopToolsPick. You may quote short passages with attribution and a link back
            to the source page, but you may not reproduce substantial portions, scrape the site for
            commercial use or republish content without written permission.
          </p>
          <p className="mt-4">
            Product names, logos and trademarks belong to their respective owners and are used here
            for identification purposes only. Their appearance does not imply endorsement of or by
            TopToolsPick.
          </p>
        </Section>

        <Section title="External links">
          This site links to third-party websites, including the vendors of tools we review. We
          are not responsible for the content, privacy practices or terms of those sites. A link
          is not an endorsement beyond the review context in which it appears.
        </Section>

        <Section title="Limitation of liability">
          TopToolsPick is provided on an &quot;as is&quot; basis without warranties of any kind. We
          are not liable for any loss — direct, indirect or consequential — arising from your use
          of this site or from decisions made based on its content. This includes, but is not
          limited to, losses arising from purchasing a tool you found here.
        </Section>

        <Section title="Acceptable use">
          You may not use this site in any way that is unlawful, that harms others, or that
          interferes with the site&apos;s operation. Automated scraping for commercial purposes,
          attempting to access the admin interface, or submitting false information through any
          contact channel is prohibited.
        </Section>

        <Section title="Changes to these terms">
          We may update these terms as the site evolves. The &quot;last updated&quot; date will
          change when we do. Continued use of the site after a change constitutes acceptance of the
          updated terms.
        </Section>

        <Section title="Governing law">
          These terms are governed by the laws of the jurisdiction in which TopToolsPick operates.
          Any disputes shall be resolved in the courts of that jurisdiction.
        </Section>

        <Section title="Contact">
          Questions about these terms can be sent to{" "}
          <a href="mailto:hello@toptoolspick.com" className="editorial-link">
            hello@toptoolspick.com
          </a>
          .
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
