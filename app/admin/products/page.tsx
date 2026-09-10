import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  await requireAdmin();
  const query = await searchParams;
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } });
  return <section><div className="flex items-center justify-between"><h1 className="text-3xl font-black">Products</h1><Link href="/admin/products/new" className="bg-slate-950 px-4 py-2 text-sm font-semibold text-white">New product</Link></div>{query.deleted === "1" && <p role="status" className="mt-4 text-sm font-semibold text-green-700">Product deleted successfully.</p>}<div className="mt-6 divide-y border-y border-slate-200">{products.length === 0 ? <p className="py-8 text-sm text-slate-500">No products yet. Create your first product to get started.</p> : products.map((product) => <Link key={product.id} href={`/admin/products/${product.id}`} className="flex items-center justify-between gap-4 py-4"><span><strong>{product.name}</strong><span className="ml-3 text-sm text-slate-500">{product.category.name}</span></span><span className="text-xs uppercase text-slate-500">{product.status}</span></Link>)}</div></section>;
}
