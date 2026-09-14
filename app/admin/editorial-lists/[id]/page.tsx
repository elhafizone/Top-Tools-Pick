import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { allowedWorkflowStatuses } from "@/lib/admin/workflow";
import { AWARD_SLOTS } from "@/lib/awards";
import { RankedPicker } from "@/components/admin/RankedPicker";

export default async function EditEditorialListPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;

  const [list, categories, products] = await Promise.all([
    prisma.editorialList.findUnique({ where: { id }, include: { items: { include: { product: true }, orderBy: { rank: "asc" } } } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, status: true, category: { select: { name: true } } } }),
  ]);
  if (!list) notFound();

  const statuses = allowedWorkflowStatuses(list.status);

  return <section>
    <h1 className="text-3xl font-black">Edit {list.title}</h1>
    {query.saved === "1" && <p role="status" className="mt-4 text-sm font-semibold text-green-700">Editorial list updated successfully.</p>}
    {query.error && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">{query.error}</p>}

    <form action={`/api/admin/editorial-lists/${list.id}`} method="post" className="mt-6 grid max-w-2xl gap-4">
      <Field name="title" label="Title" value={list.title} />
      <Field name="slug" label="Slug" value={list.slug} />
      <Field name="description" label="Description" value={list.description} textarea />

      <label className="text-sm font-semibold">Category
        <select name="categoryId" defaultValue={list.categoryId ?? ""} className="mt-2 block w-full border border-slate-300 px-3 py-2">
          <option value="">— not bound to a category —</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <span className="mt-1 block text-xs font-normal text-slate-500">
          Binding a list to a category makes its award slots lead that category page.
        </span>
      </label>

      <label className="text-sm font-semibold">Status
        <select name="status" defaultValue={list.status} className="mt-2 block w-full border border-slate-300 px-3 py-2">
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </label>
      <Field name="seoTitle" label="SEO title" value={list.seoTitle ?? ""} required={false} />
      <Field name="seoDescription" label="SEO description" value={list.seoDescription ?? ""} textarea required={false} />
      <button className="w-fit bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Save list</button>
    </form>

    <section className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="text-xl font-black">Ranked items</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        Rank is the order below. An award slot is optional; when set, the item leads the bound
        category page. Awards are curated only — nothing is generated.
      </p>
      <RankedPicker
        endpoint={`/api/admin/editorial-lists/${list.id}/items`}
        options={products.map((product) => ({
          id: product.id,
          name: product.name,
          hint: `${product.category.name}${product.status === "PUBLISHED" ? "" : ` · ${product.status}`}`,
        }))}
        initial={list.items.map((item) => ({ id: item.productId, text: item.rationale ?? "", extra: item.award ?? "" }))}
        idField="productId"
        textField="rationale"
        textLabel="Why it ranks here"
        addLabel="Add a tool"
        emptyHint="No items yet. Add at least one tool to publish this list."
        extraSelect={{ field: "award", label: "Award slot (optional)", options: AWARD_SLOTS }}
      />
    </section>
  </section>;
}

function Field({ name, label, value, textarea, required = true }: { name: string; label: string; value: string; textarea?: boolean; required?: boolean }) {
  const props = { name, defaultValue: value, required, className: "mt-2 block w-full border border-slate-300 px-3 py-2" };
  return <label className="text-sm font-semibold">{label}{textarea ? <textarea {...props} rows={4} /> : <input {...props} />}</label>;
}
