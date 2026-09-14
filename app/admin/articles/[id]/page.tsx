import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { allowedWorkflowStatuses } from "@/lib/admin/workflow";
import { ARTICLE_TOPICS } from "@/lib/articles";
import { RankedPicker } from "@/components/admin/RankedPicker";

export default async function EditArticlePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  const [linked, products] = await Promise.all([
    prisma.articleProductLink.findMany({
      where: { articleId: id },
      orderBy: { rank: "asc" },
      select: { productId: true, note: true },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, status: true, category: { select: { name: true } } },
    }),
  ]);

  const statuses = allowedWorkflowStatuses(article.status);

  return <section>
    <h1 className="text-3xl font-black">Edit article</h1>
    {query.saved === "1" && <p role="status" className="mt-4 text-sm font-semibold text-green-700">Article updated successfully.</p>}
    {query.error && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">{query.error}</p>}

    <form action={`/api/admin/articles/${id}`} method="post" className="mt-6 grid max-w-3xl gap-4">
      <Field name="title" label="Title" value={article.title} required />
      <Field name="slug" label="Slug" value={article.slug} required />

      <label className="text-sm font-semibold">Topic
        <select name="topic" defaultValue={article.topic ?? ""} className="mt-2 block w-full border border-slate-300 px-3 py-2">
          <option value="">— none —</option>
          {ARTICLE_TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
        </select>
        <span className="mt-1 block text-xs font-normal text-slate-500">
          Set <strong>comparisons</strong> to list this article on /comparisons. That page is indexable,
          unlike the /compare builder, so head-to-head content belongs here.
        </span>
      </label>

      <Field name="excerpt" label="Excerpt" value={article.excerpt ?? ""} textarea />
      <Field name="content" label="Content" value={article.content} textarea rows={12} required hint="Plain text. Separate paragraphs with a blank line. Inline links are not supported - use Linked tools below." />
      <Field name="author" label="Author" value={article.author ?? ""} />
      <Field name="source" label="Source" value={article.source ?? ""} />
      <Field name="featuredImage" label="Featured image URL" value={article.featuredImage ?? ""} />
      <Field name="canonicalUrl" label="Canonical URL" value={article.canonicalUrl ?? ""} />
      <Field name="seoTitle" label="SEO title" value={article.seoTitle ?? ""} />
      <Field name="seoDescription" label="SEO description" value={article.seoDescription ?? ""} />

      <label className="text-sm font-semibold">Workflow status
        <select name="status" defaultValue={article.status} className="mt-2 block w-full border border-slate-300 px-3 py-2">
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>

      <button className="w-fit bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Save</button>
    </form>

    <section className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="text-xl font-black">Linked tools</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        Article bodies are plain text, so this is the only way an article links into the tool pages.
        Each linked tool appears in a &ldquo;Tools mentioned&rdquo; rail with its own call-to-action.
        For a comparison article, list the tools being compared.
      </p>
      <RankedPicker
        endpoint={`/api/admin/articles/${id}/products`}
        options={products.map((product) => ({
          id: product.id,
          name: product.name,
          hint: `${product.category.name}${product.status === "PUBLISHED" ? "" : ` · ${product.status}`}`,
        }))}
        initial={linked.map((row) => ({ id: row.productId, text: row.note ?? "" }))}
        idField="productId"
        textField="note"
        textLabel="Note (optional - defaults to the tool's short description)"
        addLabel="Link a tool"
        emptyHint="No tools linked yet. The rail stays hidden until you link at least one."
      />
    </section>
  </section>;
}

function Field({ name, label, value, required, textarea, rows, hint }: { name: string; label: string; value: string; required?: boolean; textarea?: boolean; rows?: number; hint?: string }) {
  const props = { name, required, defaultValue: value, className: "mt-2 block w-full border border-slate-300 px-3 py-2" };
  return <label className="text-sm font-semibold">
    {label}
    {textarea ? <textarea {...props} rows={rows ?? 4} /> : <input {...props} />}
    {hint && <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>}
  </label>;
}
