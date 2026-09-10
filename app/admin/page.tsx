import { requireAdmin } from "@/lib/admin/auth";
import Link from "next/link";

export default async function AdminDashboard() {
  await requireAdmin();
  const sections = [["Products", "/admin/products"], ["Editorial Lists", "/admin/editorial-lists"], ["Comparisons", "/admin/comparisons"], ["Stories", "/admin/stories"], ["Articles", "/admin/articles"], ["Affiliate Links", "/admin/affiliate-links"], ["Categories", "/admin/categories"]] as const;
  return <section><p className="text-sm font-bold uppercase tracking-widest text-[#2180F8]">Protected workspace</p><h1 className="mt-2 text-4xl font-black">Content management</h1><p className="mt-4 max-w-2xl text-slate-600">Manage editorial records without exposing mutations to public routes. New content remains draft until explicitly published.</p><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sections.map(([label, href]) => <Link href={href} key={href} className="border border-slate-200 bg-white p-5 transition hover:border-[#2180F8]"><h2 className="font-bold">{label}</h2><p className="mt-2 text-sm text-slate-500">Open {label.toLowerCase()} management.</p></Link>)}</div></section>;
}
