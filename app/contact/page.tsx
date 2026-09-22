import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(
  "Contact",
  "Get in touch with the TopToolsPick editorial team — corrections, suggestions, partnership enquiries.",
  "/contact",
);

const REASONS = [
  {
    emoji: "🔍",
    title: "Something is out of date",
    body: "Pricing changed, a feature was removed, or a tool shut down. Tell us what you found and we will update the page.",
  },
  {
    emoji: "📋",
    title: "A tool we should cover",
    body: "If you think a tool belongs in a category we cover and we have missed it, we want to know.",
  },
  {
    emoji: "✏️",
    title: "A factual correction",
    body: "Got a specific error wrong? Tell us exactly what is incorrect and what the right information is.",
  },
  {
    emoji: "🤝",
    title: "Affiliate programme enquiries",
    body: "We list tools independently first. If you are a vendor and want to discuss a commercial relationship after coverage, email us.",
  },
];

export default function ContactPage() {
  return (
    <article className="shell py-12 sm:py-16">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />

      <header className="mt-10 max-w-3xl border-b border-[var(--line)] pb-10">
        <p className="eyebrow">Get in touch</p>
        <h1 className="section-heading mt-3">Contact</h1>
        <p className="lede mt-5">
          We are a small editorial team. We read every message and respond to most of them.
          Here is what to send us.
        </p>
      </header>

      <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <div className="max-w-2xl">
          <section>
            <h2 className="sub-heading">What to send us</h2>
            <ul className="mt-8 flex flex-col gap-8">
              {REASONS.map((reason) => (
                <li key={reason.title} className="flex gap-4">
                  <span className="mt-0.5 text-2xl leading-none">{reason.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-[var(--ink)]">{reason.title}</h3>
                    <p className="mt-1.5 text-[var(--body)]">{reason.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="sub-heading">Email us</h2>
            <p className="article-content mt-4">
              Send your message to{" "}
              <a href="mailto:hello@toptoolspick.com" className="editorial-link font-semibold">
                hello@toptoolspick.com
              </a>
              . Include a link to the specific page you are writing about where relevant — it
              helps us get to the right place faster.
            </p>
          </section>

          <section className="mt-14 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-6">
            <p className="eyebrow">Response times</p>
            <p className="mt-3 text-sm text-[var(--body)]">
              Factual corrections and data errors usually get a response within a few business days.
              Partnership and commercial enquiries are reviewed less frequently. We do not respond to
              mass-submitted PR pitches or link-insertion requests.
            </p>
          </section>
        </div>

        <aside className="h-fit border-t border-[var(--ink)] pt-5 lg:sticky lg:top-24">
          <p className="eyebrow">Other pages</p>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <a href="/about" className="editorial-link font-semibold text-[var(--ink)]">About TopToolsPick ↗</a>
            <a href="/methodology" className="editorial-link font-semibold text-[var(--ink)]">How we pick ↗</a>
            <a href="/affiliate-disclosure" className="editorial-link font-semibold text-[var(--ink)]">Affiliate disclosure ↗</a>
            <a href="/privacy" className="editorial-link font-semibold text-[var(--ink)]">Privacy policy ↗</a>
            <a href="/terms" className="editorial-link font-semibold text-[var(--ink)]">Terms of use ↗</a>
          </div>
        </aside>
      </div>
    </article>
  );
}
