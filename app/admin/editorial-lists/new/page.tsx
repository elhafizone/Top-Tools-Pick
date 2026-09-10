import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";

export default async function NewEditorialListPage() {
  await requireAdmin();
  return <section><h1 className="text-3xl font-black">New editorial list</h1><form action="/api/admin/editorial-lists" method="post" className="mt-6 grid max-w-2xl gap-4"><Field name="title" label="Title" /><Field name="slug" label="Slug" /><Field name="description" label="Description" textarea /><Field name="seoTitle" label="SEO title" /><Field name="seoDescription" label="SEO description" textarea /><button className="w-fit bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Create draft</button></form><Link href="/admin/editorial-lists" className="mt-6 inline-block text-sm underline">Back to lists</Link></section>;
}
function Field({ name, label, textarea }: { name: string; label: string; textarea?: boolean }) { return <label className="text-sm font-semibold">{label}{textarea ? <textarea name={name} required rows={4} className="mt-2 block w-full border border-slate-300 px-3 py-2" /> : <input name={name} required className="mt-2 block w-full border border-slate-300 px-3 py-2" />}</label>; }
