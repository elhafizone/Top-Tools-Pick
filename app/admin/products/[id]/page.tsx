import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";

import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string; saved?: string; error?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  const query = await searchParams;
  const statusOptions = product.status === "DRAFT" ? ["DRAFT", "REVIEW"] : product.status === "REVIEW" ? ["REVIEW", "PUBLISHED", "DRAFT"] : ["PUBLISHED", "DRAFT"];
  return <section><h1 className="text-3xl font-black">Edit {product.name}</h1>{query.created === "1" && <p role="status" className="mt-4 text-sm font-semibold text-green-700">Product created successfully.</p>}{query.saved === "1" && <p role="status" className="mt-4 text-sm font-semibold text-green-700">Product updated successfully.</p>}{query.error && <p role="alert" className="mt-4 max-w-2xl text-sm font-semibold text-red-700">{query.error}</p>}<form action={`/api/admin/products/${product.id}`} method="post" className="mt-6 grid max-w-2xl gap-4"><input type="hidden" name="_method" value="PATCH" /><Field name="name" label="Name" value={product.name} required /><Field name="slug" label="Slug" value={product.slug} required /><Field name="shortDescription" label="Short description" value={product.shortDescription} required /><Field name="description" label="Description" value={product.description} required textarea /><Field name="websiteUrl" label="Website URL" value={product.websiteUrl} required /><label className="text-sm font-semibold">Workflow status<select name="status" defaultValue={product.status} className="mt-2 block w-full border border-slate-300 px-3 py-2">{statusOptions.map((status) => <option key={status}>{status}</option>)}{product.status === "ARCHIVED" && <option>ARCHIVED</option>}</select><span className="mt-2 block text-xs font-normal text-slate-500">{product.status === "DRAFT" ? "Submit this draft for review before publishing." : product.status === "REVIEW" ? "This product is ready for editorial approval and publishing." : "Published products can be returned to draft."}</span></label><Field name="seoTitle" label="SEO title" value={product.seoTitle ?? ""} /><Field name="seoDescription" label="SEO description" value={product.seoDescription ?? ""} textarea /><Field name="pros" label="Pros" value={product.pros ?? ""} textarea /><Field name="cons" label="Cons" value={product.cons ?? ""} textarea /><Field name="bestFor" label="Best for" value={product.bestFor ?? ""} /><button className="w-fit bg-slate-950 px-5 py-3 text-sm font-semibold text-white">{product.status === "DRAFT" ? "Save / submit for review" : product.status === "REVIEW" ? "Save workflow changes" : "Save changes"}</button></form><DeleteProductButton productId={product.id} /></section>;
}

function Field({ name, label, value, required, textarea }: { name: string; label: string; value: string; required?: boolean; textarea?: boolean }) {
  const props = { name, required, defaultValue: value, className: "mt-2 block w-full border border-slate-300 px-3 py-2" };
  return <label className="text-sm font-semibold">{label}{textarea ? <textarea {...props} rows={4} /> : <input {...props} />}</label>;
}
