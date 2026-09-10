import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { NewProductForm } from "@/components/admin/NewProductForm";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return <section><h1 className="text-3xl font-black">New product</h1><NewProductForm categories={categories} /><Link href="/admin/products" className="mt-6 inline-block text-sm underline">Back to products</Link></section>;
}
