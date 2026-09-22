import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(
  "Privacy Policy",
  "How TopToolsPick collects, uses and protects the information you share with us.",
  "/privacy",
);

const LAST_UPDATED = "September 2025";

export default function PrivacyPage() {
  return (
    <article className="shell py-12 sm:py-16">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Privacy Policy" }]} />

      <header className="mt-10 max-w-3xl border-b border-[var(--line)] pb-10">
        <p className="eyebrow">Legal</p>
        <h1 className="section-heading mt-3">Privacy Policy</h1>
        <p className="lede mt-5">
          We collect as little as we can and keep what we do collect only as long as we need it.
          This page explains what that means in practice.
        </p>
        <p className="mt-4 text-sm text-[var(--muted)]">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="mt-14 max-w-2xl">
        <Section title="Who we are">
          TopToolsPick (<strong>toptoolspick.com</strong>) is an independent editorial site that
          researches and ranks software tools to help people make better purchasing decisions.
          References to &quot;we&quot;, &quot;us&quot; and &quot;our&quot; in this policy refer to
          TopToolsPick and its operators.
        </Section>

        <Section title="What we collect — and what we don't">
          <p>
            We do <strong>not</strong> require you to create an account, and we do not ask for your
            name, email address or payment details during normal browsing.
          </p>
          <p className="mt-4">
            Like almost every website, our hosting infrastructure records standard server logs when
            you visit a page. These logs may include your IP address, the page you requested, your
            browser type and the referring URL. They are used solely to keep the site running and to
            diagnose technical problems. They are not sold, shared with advertisers or used for
            profiling.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            TopToolsPick does not use tracking cookies, advertising cookies or any third-party
            analytics cookies. We do not run a cookie banner because there is nothing to consent to
            beyond essential session behaviour.
          </p>
          <p className="mt-4">
            If you navigate from this site to a merchant through an affiliate link, that merchant
            may set their own cookies on your device. Those cookies are governed by the merchant's
            own privacy policy, not ours.
          </p>
        </Section>

        <Section title="Affiliate links and click data">
          <p>
            Some links on this site are affiliate links that route through{" "}
            <code className="text-sm">/go/[tool-name]</code> before redirecting to the merchant.
            This hop exists so we can update destination URLs in one place and append campaign
            identifiers required by affiliate networks.
          </p>
          <p className="mt-4">
            We do not store a record of individual clicks against identifiable visitors. The
            campaign key appended to affiliate URLs identifies the source page to the merchant, not
            you personally.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>
            Tool pages link out to the websites of third-party software companies. Once you leave
            this site, their privacy policies apply. We have no control over, and accept no
            responsibility for, the privacy practices of those sites.
          </p>
        </Section>

        <Section title="Data retention">
          Server logs are retained for a limited period for operational and security purposes and
          are then deleted automatically. We do not build long-term logs of visitor behaviour.
        </Section>

        <Section title="Your rights">
          Because we do not hold personal data about you beyond server logs, there is usually
          nothing to request, correct or delete. If you believe we hold data about you and wish to
          enquire, contact us at the address below.
        </Section>

        <Section title="Changes to this policy">
          We may update this policy when the site adds new features. The &quot;last updated&quot;
          date at the top of this page will change when we do. Continued use of the site after a
          change constitutes acceptance of the revised policy.
        </Section>

        <Section title="Contact">
          Questions about this policy can be sent to{" "}
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
