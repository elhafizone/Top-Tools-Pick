import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";

export default async function EditorialListsAdminPage() {
  await requireAdmin();
  const lists = await prisma.editorialList.findMany({ include: { _count: { select: { items: true } } }, orderBy: { updatedAt: "desc" } });
  return <section><div className="flex items-center justify-between"><h1 className="text-3xl font-black">Editorial Lists</h1><Link href="/admin/editorial-lists/new" className="bg-slate-950 px-4 py-2 text-sm font-semibold text-white">New list</Link></div><div className="mt-6 divide-y border-y border-slate-200">{lists.length === 0 ? <p className="py-8 text-sm text-slate-500">No editorial lists yet. Create one to curate products.</p> : lists.map((list) => <Link key={list.id} href={`/admin/editorial-lists/${list.id}`} className="flex justify-between py-4"><span><strong>{list.title}</strong><span className="ml-3 text-sm text-slate-500">{list._count.items} items</span></span><span className="text-xs uppercase text-slate-500">{list.status}</span></Link>)}</div></section>;
}
