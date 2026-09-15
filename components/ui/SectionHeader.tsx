import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: string;
  /** One sentence of context. Optional - most sections do not need one. */
  intro?: string;
  href?: string;
  linkLabel?: string;
  /** `h2` everywhere except the top of a page, where the section heading is the `h1`. */
  as?: "h1" | "h2";
  id?: string;
  /** Inverted type for the dark editorial bands. */
  tone?: "default" | "ink";
  className?: string;
};

/**
 * The one section header on the site.
 *
 * Eyebrow, headline and an optional "see everything" link were hand-built in eight
 * places with eight slightly different spacings; this is that pattern extracted so a
 * change to section rhythm happens once.
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  href,
  linkLabel,
  as: Heading = "h2",
  id,
  tone = "default",
  className = "",
}: Props) {
  const isInk = tone === "ink";

  return (
    <div className={`flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8 ${isInk ? "border-[var(--ink-line)]" : "border-[var(--line)]"} ${className}`}>
      <div className="min-w-0">
        {eyebrow && <p className={`eyebrow ${isInk ? "!text-[var(--ink-accent)]" : ""}`}>{eyebrow}</p>}
        <Heading id={id} className={`section-heading ${eyebrow ? "mt-3" : ""}`}>{title}</Heading>
        {intro && <p className={`lede mt-4 max-w-2xl ${isInk ? "!text-[var(--ink-muted)]" : ""}`}>{intro}</p>}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className={`group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold ${isInk ? "text-[var(--ink-accent)] hover:text-white" : "text-[var(--accent-deep)] hover:text-[var(--ink)]"}`}
        >
          {linkLabel}
          <span aria-hidden="true" className="hover-shift">&#8594;</span>
        </Link>
      )}
    </div>
  );
}
