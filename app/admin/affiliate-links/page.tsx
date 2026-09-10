import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";

export default async function AffiliateLinksAdminPage() {
  await requireAdmin();
  const programs = await prisma.affiliateProgram.findMany({ include: { product: true, links: true }, orderBy: { product: { name: "asc" } } });
  return <section><h1 className="text-3xl font-black">Affiliate Links</h1><p className="mt-3 text-slate-600">Only explicitly enabled links from ACTIVE programs can be resolved as affiliate CTAs.</p><div className="mt-6 divide-y border-y border-slate-200">{programs.flatMap((program) => program.links.map((link) => <div key={link.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><strong>{program.product.name}</strong><p className="text-sm text-slate-500">{link.label} · {link.region ?? "global"}</p></div><form action={`/api/admin/affiliate-links/${link.id}`} method="post" className="flex items-center gap-2 text-xs"><input name="region" defaultValue={link.region ?? ""} placeholder="Region" className="w-20 border px-2 py-1" /><input name="priority" type="number" min="0" max="1000" defaultValue={link.priority} className="w-16 border px-2 py-1" /><select name="enabled" defaultValue={String(link.enabled)} className="border px-2 py-1"><option value="true">Enabled</option><option value="false">Disabled</option></select><button className="bg-slate-950 px-3 py-1 text-white">Save</button></form><span className="text-xs uppercase text-slate-500">{program.status}</span></div>))}</div></section>;
}
