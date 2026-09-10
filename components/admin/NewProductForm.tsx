"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

export function NewProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: new FormData(event.currentTarget),
        credentials: "same-origin",
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(typeof result?.error === "string" ? result.error : "Unable to create product.");
        return;
      }

      if (!result?.id || typeof result.id !== "string") {
        setError("Product was created, but its edit page could not be opened.");
        return;
      }

      router.push(`/admin/products/${encodeURIComponent(result.id)}?created=1`);
    } catch {
      setError("Unable to create product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return <form onSubmit={submit} className="mt-6 grid max-w-2xl gap-4">
    <Field name="name" label="Name" required />
    <Field name="slug" label="Slug" required />
    <Field name="shortDescription" label="Short description" required />
    <Field name="description" label="Description" required textarea />
    <Field name="websiteUrl" label="Website URL" required />
    <label className="text-sm font-semibold">Category<select name="categoryId" required className="mt-2 block w-full border border-slate-300 px-3 py-2">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
    <Field name="seoTitle" label="SEO title" />
    <Field name="seoDescription" label="SEO description" textarea />
    <Field name="pros" label="Pros" textarea />
    <Field name="cons" label="Cons" textarea />
    <Field name="bestFor" label="Best for" />
    {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
    <button disabled={submitting} className="w-fit bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Creating..." : "Create draft"}</button>
  </form>;
}

function Field({ name, label, required, textarea }: { name: string; label: string; required?: boolean; textarea?: boolean }) {
  const props = { name, required, className: "mt-2 block w-full border border-slate-300 px-3 py-2" };
  return <label className="text-sm font-semibold">{label}{textarea ? <textarea {...props} rows={4} /> : <input {...props} />}</label>;
}
