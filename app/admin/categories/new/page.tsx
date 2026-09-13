import { requireAdmin } from "@/lib/admin/auth";
import { FormError } from "@/components/admin/FormError";

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "slug", label: "Slug", required: true },
  { name: "description", label: "Description", required: true, textarea: true },
  { name: "seoTitle", label: "SEO title" },
  { name: "seoDescription", label: "SEO description", textarea: true },
] as const;

export default async function NewCategoryPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const { error } = await searchParams;
  const className = "mt-2 block w-full border border-slate-300 px-3 py-2";
  return <section><h1 className="text-3xl font-black">New category</h1><FormError message={error} /><form action="/api/admin/categories" method="post" className="mt-6 grid max-w-2xl gap-4">{fields.map((field) => <label key={field.name} className="text-sm font-semibold">{field.label}{"textarea" in field && field.textarea ? <textarea name={field.name} required={"required" in field && field.required} rows={4} className={className} /> : <input name={field.name} required={"required" in field && field.required} className={className} />}</label>)}<button className="w-fit bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Create category</button></form></section>;
}
