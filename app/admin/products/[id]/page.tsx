import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { allowedWorkflowStatuses } from "@/lib/admin/workflow";

import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { RankedPicker } from "@/components/admin/RankedPicker";

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string; saved?: string; error?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  const query = await searchParams;

  const [alternatives, candidates] = await Promise.all([
    prisma.productAlternative.findMany({
      where: { productId: id },
      orderBy: { rank: "asc" },
      select: { alternativeId: true, reason: true },
    }),
    // Any other product can be an alternative - cross-category is often the honest answer.
    prisma.product.findMany({
      where: { id: { not: id } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, status: true, category: { select: { name: true } } },
    }),
  ]);

  // Single source of truth for transitions; hand-rolling this list previously let an
  // ARCHIVED product be saved straight back to DRAFT without an explicit choice.
  const statusOptions = allowedWorkflowStatuses(product.status);
  const defaultStatus = statusOptions[0];

  const lastReviewed = product.lastReviewedAt ? product.lastReviewedAt.toISOString().slice(0, 10) : "";

  return <section>
    <h1 className="text-3xl font-black">Edit {product.name}</h1>
    {query.created === "1" && <p role="status" className="mt-4 text-sm font-semibold text-green-700">Product created successfully.</p>}
    {query.saved === "1" && <p role="status" className="mt-4 text-sm font-semibold text-green-700">Product updated successfully.</p>}
    {query.error && <p role="alert" className="mt-4 max-w-2xl text-sm font-semibold text-red-700">{query.error}</p>}

    <form action={`/api/admin/products/${product.id}`} method="post" className="mt-6 grid max-w-2xl gap-4">
      <Field name="name" label="Name" value={product.name} required />
      <Field name="slug" label="Slug" value={product.slug} required />
      <Field name="shortDescription" label="Short description" value={product.shortDescription} required />
      <Field name="description" label="Description" value={product.description} required textarea />
      <Field name="websiteUrl" label="Website URL" value={product.websiteUrl} required />
      <label className="text-sm font-semibold">Workflow status
        <select name="status" defaultValue={defaultStatus} className="mt-2 block w-full border border-slate-300 px-3 py-2">
          {statusOptions.map((status) => <option key={status}>{status}</option>)}
        </select>
        <span className="mt-2 block text-xs font-normal text-slate-500">{product.status === "DRAFT" ? "Submit this draft for review before publishing." : product.status === "REVIEW" ? "This product is ready for editorial approval and publishing." : product.status === "ARCHIVED" ? "This product is archived. Saving restores it to draft." : "Published products can be returned to draft."}</span>
      </label>
      <Field name="seoTitle" label="SEO title" value={product.seoTitle ?? ""} />
      <Field name="seoDescription" label="SEO description" value={product.seoDescription ?? ""} textarea />

      <fieldset className="grid gap-4 border border-slate-200 p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-slate-500">Decision content</legend>
        <Field name="bestFor" label="Best for (who should choose it)" value={product.bestFor ?? ""} textarea hint="One point per line, or separate with semicolons." />
        <Field name="notFor" label="Not for (who should look elsewhere)" value={product.notFor ?? ""} textarea hint="The most trust-building field on the page. One point per line." />
        <Field name="keyFeatures" label="Key features" value={product.keyFeatures ?? ""} textarea hint="One feature per line." />
        <Field name="pros" label="Pros" value={product.pros ?? ""} textarea hint="One point per line." />
        <Field name="cons" label="Cons" value={product.cons ?? ""} textarea hint="One point per line." />
        <Field name="verdict" label="Editorial verdict" value={product.verdict ?? ""} textarea hint="Shown above the final call-to-action. Leave blank to hide the section." />
        <label className="text-sm font-semibold">Last reviewed
          <input type="date" name="lastReviewedAt" defaultValue={lastReviewed} className="mt-2 block w-full border border-slate-300 px-3 py-2" />
          <span className="mt-1 block text-xs font-normal text-slate-500">Set when you actually re-check the tool. Shown to readers as a freshness signal.</span>
        </label>
      </fieldset>

      <button className="w-fit bg-slate-950 px-5 py-3 text-sm font-semibold text-white">{product.status === "DRAFT" ? "Save / submit for review" : product.status === "REVIEW" ? "Save workflow changes" : "Save changes"}</button>
    </form>

    <section className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="text-xl font-black">Alternatives</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        Curated only - nothing is auto-generated. Give each alternative a reason (&ldquo;better free plan&rdquo;,
        &ldquo;better for small teams&rdquo;); without one the reader just sees a name. Leave this empty and the
        section is hidden on the public page.
      </p>
      <RankedPicker
        endpoint={`/api/admin/products/${product.id}/alternatives`}
        options={candidates.map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          hint: `${candidate.category.name}${candidate.status === "PUBLISHED" ? "" : ` · ${candidate.status}`}`,
        }))}
        initial={alternatives.map((row) => ({ id: row.alternativeId, text: row.reason ?? "" }))}
        idField="alternativeId"
        textField="reason"
        textLabel="Why pick this instead?"
        addLabel="Add an alternative"
        emptyHint="No alternatives yet. The Alternatives section stays hidden until you add at least one."
      />
    </section>

    <DeleteProductButton productId={product.id} />
  </section>;
}

function Field({ name, label, value, required, textarea, hint }: { name: string; label: string; value: string; required?: boolean; textarea?: boolean; hint?: string }) {
  const props = { name, required, defaultValue: value, className: "mt-2 block w-full border border-slate-300 px-3 py-2" };
  return <label className="text-sm font-semibold">
    {label}
    {textarea ? <textarea {...props} rows={4} /> : <input {...props} />}
    {hint && <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>}
  </label>;
}
