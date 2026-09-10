import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { allowedWorkflowStatuses } from "@/lib/admin/workflow";

export default async function EditEditorialListPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const list = await prisma.editorialList.findUnique({ where: { id }, include: { items: { include: { product: true }, orderBy: { rank: "asc" } } } });
  if (!list) notFound();
  const statuses = allowedWorkflowStatuses(list.status);
  return <section><h1 className="text-3xl font-black">Edit {list.title}</h1>{query.saved === "1" && <p role="status" className="mt-4 text-sm font-semibold text-green-700">Editorial list updated successfully.</p>}{query.error && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">{query.error}</p>}<form action={`/api/admin/editorial-lists/${list.id}`} method="post" className="mt-6 grid max-w-2xl gap-4"><Field name="title" label="Title" value={list.title} /><Field name="slug" label="Slug" value={list.slug} /><Field name="description" label="Description" value={list.description} textarea /><label className="text-sm font-semibold">Status<select name="status" defaultValue={list.status} className="mt-2 block w-full border border-slate-300 px-3 py-2">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><Field name="seoTitle" label="SEO title" value={list.seoTitle ?? ""} /><Field name="seoDescription" label="SEO description" value={list.seoDescription ?? ""} textarea /><button className="w-fit bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Save list</button></form><h2 className="mt-10 text-xl font-bold">Current items</h2><div className="mt-3 divide-y border-y border-slate-200">{list.items.map((item) => <div key={item.id} className="flex justify-between py-3 text-sm"><span>{item.rank}. {item.product.name}</span><span className="text-slate-500">{item.rationale ?? "No rationale"}</span></div>)}</div></section>;
}

function Field({ name, label, value, textarea }: { name: string; label: string; value: string; textarea?: boolean }) { return <label className="text-sm font-semibold">{label}{textarea ? <textarea name={name} defaultValue={value} required rows={4} className="mt-2 block w-full border border-slate-300 px-3 py-2" /> : <input name={name} defaultValue={value} required className="mt-2 block w-full border border-slate-300 px-3 py-2" />}</label>; }
