import Link from "next/link";
import Image from "next/image";

const DECIDE = [
  { href: "/best", label: "Best picks" },
  { href: "/comparisons", label: "Comparisons" },
  { href: "/compare", label: "Compare tools" },
  { href: "/categories", label: "Categories" },
];

const EXPLORE = [
  { href: "/tools", label: "All tools" },
  { href: "/articles", label: "Guides & news" },
  { href: "/stories", label: "Stories" },
  { href: "/methodology", label: "How we pick" },
];

export function Footer() {
  return (
    <footer className="site-footer mt-24 border-t bg-[var(--ink)] text-white">
      <div className="shell grid gap-12 py-14 sm:py-16 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Image
            src="/ttp-footer-logo.webp"
            alt="Top Tools Pick"
            width={360}
            height={72}
            className="h-auto w-[9.5rem] object-contain"
          />
          <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--ink-muted)]">
            Independent research for the moment before you pay. Honest shortlists, real alternatives, no noise.
          </p>
          <p className="mt-5 max-w-sm text-xs leading-6 text-[#7e8696]">
            Some outbound links are affiliate links. They are labelled, they never change a ranking, and they never change your price.
          </p>
        </div>

        <FooterColumn title="Decide" links={DECIDE} />
        <FooterColumn title="Explore" links={EXPLORE} />
      </div>

      <div className="shell flex flex-col gap-2 border-t border-[var(--ink-line)] py-6 text-xs text-[#8991a1] sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} TopToolsPick</span>
        <span>Independent research for better software decisions.</span>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <nav aria-label={title}>
      <p className="eyebrow !text-[var(--ink-accent)]">{title}</p>
      <ul className="mt-5 flex flex-col gap-3 text-sm">
        {links.map((link) => (
          <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
        ))}
      </ul>
    </nav>
  );
}
