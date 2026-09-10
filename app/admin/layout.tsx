import { cookies } from "next/headers";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { adminCookieName, getAdminUsername } from "@/lib/admin/auth";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = (await cookies()).get(adminCookieName)?.value;
  const isAuthenticated = Boolean(getAdminUsername(session));

  if (!isAuthenticated) return children;

  return <div className="min-h-screen bg-[#f8f9fb]"><div className="mx-auto max-w-7xl px-5 py-8 sm:py-10"><div className="mb-8 flex items-center justify-between gap-4"><Logo /><form action="/api/admin/logout" method="post"><button className="text-sm font-semibold text-[#68707d] hover:text-[#2180F8]">Sign out</button></form></div><nav className="mb-10 flex flex-wrap gap-x-5 gap-y-3 border-b border-[#e3e7ee] pb-4 text-sm font-semibold text-[#68707d]"><Link className="hover:text-[#2180F8]" href="/admin">Dashboard</Link><Link className="hover:text-[#2180F8]" href="/admin/products">Products</Link><Link className="hover:text-[#2180F8]" href="/admin/editorial-lists">Editorial Lists</Link><Link className="hover:text-[#2180F8]" href="/admin/comparisons">Comparisons</Link><Link className="hover:text-[#2180F8]" href="/admin/stories">Stories</Link><Link className="hover:text-[#2180F8]" href="/admin/articles">Articles</Link><Link className="hover:text-[#2180F8]" href="/admin/affiliate-links">Affiliate Links</Link><Link className="hover:text-[#2180F8]" href="/admin/categories">Categories</Link><Link className="hover:text-[#2180F8]" href="/admin/audit-log">Audit Log</Link></nav>{children}</div></div>;
}
