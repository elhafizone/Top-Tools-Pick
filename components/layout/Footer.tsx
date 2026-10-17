import Link from "next/link";
import Image from "next/image";
import { socialLinks } from "@/lib/seo";

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

const LEGAL = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
];

export function Footer() {
  return (
    <footer className="site-footer mt-24 border-t bg-[var(--ink)] text-white">
      <div className="shell grid gap-12 py-14 sm:py-16 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Image
            src="/ttp-footer-logo.svg"
            alt="Top Tools Pick"
            width={360}
            height={72}
            className="h-auto w-[9.5rem] object-contain"
          />
          <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--ink-muted)]">
            Independent research for the moment before you pay. Honest shortlists, real alternatives, no noise.
          </p>
          <ul className="mt-6 flex items-center gap-3" aria-label="Social media">
            <li>
              <a
                href={socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TopToolsPick on X"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ink-line)] text-[#c4cad6] transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TopToolsPick on LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ink-line)] text-[#c4cad6] transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        <FooterColumn title="Decide" links={DECIDE} />
        <FooterColumn title="Explore" links={EXPLORE} />
        <FooterColumn title="Company" links={LEGAL} />
      </div>

      <div className="shell flex flex-col gap-2 border-t border-[var(--ink-line)] py-6 text-xs text-[#8991a1] sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} TopToolsPick</span>
        <nav aria-label="Legal links" className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/affiliate-disclosure" className="hover:text-white transition-colors">Affiliate disclosure</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>
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
