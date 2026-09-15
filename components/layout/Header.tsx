"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { SearchForm } from "@/components/search/SearchForm";

/**
 * Five destinations, ordered by decision intent: pick a tool, narrow by need, read a
 * ranked shortlist, compare finalists, read the reasoning. "News" lives in the footer -
 * it is supporting content and should not compete with the commercial pages here.
 *
 * Search sits in the bar itself rather than behind an icon, because the site's premise
 * is that people arrive with a job to do and not a tool name. It is a plain GET form,
 * so it works without JavaScript and results stay server-rendered and crawlable.
 */
export function Header() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = useCallback(() => {
    const menu = menuRef.current;
    if (menu?.open) menu.open = false;
  }, []);

  /**
   * A <details> panel has no idea the route changed. Next.js navigates on the client
   * without reloading the document, so tapping a link used to leave the menu open
   * over the page it had just navigated to.
   */
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  /** An overlay that can only be dismissed by its own toggle traps people on mobile. */
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const menu = menuRef.current;
      if (menu?.open && !menu.contains(event.target as Node)) closeMenu();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu]);

  const links = [
    { href: "/tools", label: "Tools" },
    { href: "/categories", label: "Categories" },
    { href: "/best", label: "Best picks" },
    { href: "/comparisons", label: "Comparisons" },
    { href: "/articles", label: "Guides" },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header sticky top-0 z-40 border-b">
      <div className="shell flex min-h-[4.25rem] items-center gap-5 lg:gap-8">
        <Link href="/" aria-label="Top Tools Pick home" className="shrink-0"><Logo /></Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm lg:flex xl:gap-7">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav-link whitespace-nowrap" aria-current={isActive(link.href) ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden w-44 lg:block xl:w-56">
            <SearchForm id="header-search" label="Search tools" placeholder="Search tools" size="sm" />
          </div>
          <Link href="/compare" className="hidden shrink-0 text-sm font-semibold text-[var(--accent-deep)] hover:text-[var(--ink)] lg:inline-flex">
            Compare tools
          </Link>

          <details ref={menuRef} className="relative lg:hidden">
            <summary
              aria-label="Open navigation and search"
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] [&::-webkit-details-marker]:hidden"
            >
              <span className="sr-only">Open navigation and search</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              </svg>
            </summary>
            <nav
              aria-label="Mobile navigation"
              className="panel absolute right-0 top-full mt-2 flex w-[min(19rem,calc(100vw-2rem))] flex-col gap-1 p-3 text-sm font-semibold shadow-[var(--shadow-md)]"
            >
              <div className="pb-2">
                <SearchForm id="mobile-search" label="Search tools" placeholder="What do you need a tool for?" />
              </div>
              {/* onClick as well as the route effect: tapping the link for the page you
                  are already on does not change the pathname, so the effect never fires. */}
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className="rounded-[var(--radius-control)] px-3 py-2.5 hover:bg-[var(--accent-soft)] aria-[current=page]:bg-[var(--accent-soft)] aria-[current=page]:text-[var(--accent-deep)]"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/compare" onClick={closeMenu} className="button-primary mt-2">Compare tools</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
