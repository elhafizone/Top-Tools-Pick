"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

export function Header() {
  const pathname = usePathname();
  const links = [
    { href: "/tools", label: "Explore" },
    { href: "/categories", label: "Categories" },
    { href: "/best/ai-tools", label: "Best picks" },
    { href: "/compare", label: "Compare" },
    { href: "/articles", label: "News" },
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
          <details className="relative lg:hidden">
            <summary aria-label="Open navigation" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-[#dfe3ea] bg-white text-[#000000]"><span className="sr-only">Open navigation</span><span aria-hidden="true">☰</span></summary>
            <nav aria-label="Mobile navigation" className="absolute right-0 top-14 flex w-52 flex-col gap-1 rounded-xl border border-[#e4e7ed] bg-white p-2 text-sm font-semibold shadow-[0_12px_30px_rgba(20,25,45,.1)]">
              {links.map((link) => (
                <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className="rounded-xl px-3 py-2.5 hover:bg-[#eaf3ff] aria-[current=page]:bg-[#eaf3ff] aria-[current=page]:text-[#155fca]">
                  {link.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
