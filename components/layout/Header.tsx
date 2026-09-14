"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";

/**
 * Four destinations, ordered by decision intent: pick a tool, narrow by need,
 * read a ranked shortlist, compare finalists. "News" lives in the footer - it is
 * supporting content and should not compete with the commercial pages here.
 *
 * The search field is a plain GET form so it works without JavaScript and the
 * results page stays server-rendered and crawlable.
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
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header sticky top-0 z-40 border-b">
      <div className="shell flex min-h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label="Top Tools Pick home" className="shrink-0"><Logo /></Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav-link" aria-current={isActive(link.href) ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <form method="get" action="/tools" role="search" className="hidden lg:block">
            <label htmlFor="header-search" className="sr-only">Search tools</label>
            <input
              id="header-search"
              type="search"
              name="q"
              placeholder="What do you need a tool for?"
              className="h-10 w-60 rounded-[var(--radius-control)] border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            />
          </form>
          <details ref={menuRef} className="relative lg:hidden">
            <summary aria-label="Open navigation" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-[#dfe3ea] bg-white text-[#000000]"><span className="sr-only">Open navigation</span><span aria-hidden="true">☰</span></summary>
            <nav aria-label="Mobile navigation" className="absolute right-0 top-14 flex w-64 flex-col gap-1 rounded-xl border border-[#e4e7ed] bg-white p-2 text-sm font-semibold shadow-[0_12px_30px_rgba(20,25,45,.1)]">
              <form method="get" action="/tools" role="search" className="p-1 pb-2">
                <label htmlFor="mobile-search" className="sr-only">Search tools</label>
                <input
                  id="mobile-search"
                  type="search"
                  name="q"
                  placeholder="What do you need a tool for?"
                  className="h-11 w-full rounded-[var(--radius-control)] border border-[var(--line)] bg-white px-3.5 text-sm font-medium text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
                />
              </form>
              {/* onClick as well as the route effect: tapping the link for the page you
                  are already on does not change the pathname, so the effect never fires. */}
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeMenu} aria-current={isActive(link.href) ? "page" : undefined} className="rounded-xl px-3 py-2.5 hover:bg-[#eaf3ff] aria-[current=page]:bg-[#eaf3ff] aria-[current=page]:text-[#155fca]">
                  {link.label}
                </Link>
              ))}
              <Link href="/articles" onClick={closeMenu} className="rounded-xl px-3 py-2.5 hover:bg-[#eaf3ff]">Guides</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
