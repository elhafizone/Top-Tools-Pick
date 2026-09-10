"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Delete this product? This action cannot be undone.")) return;
    setError(null);
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${encodeURIComponent(productId)}`, { method: "DELETE", credentials: "same-origin" });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(typeof result?.error === "string" ? result.error : "Unable to delete product.");
        return;
      }
      router.push("/admin/products?deleted=1");
      router.refresh();
    } catch {
      setError("Unable to delete product. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return <div className="mt-10 border-t border-slate-200 pt-6"><button type="button" onClick={handleDelete} disabled={deleting} className="border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60">{deleting ? "Deleting..." : "Delete product"}</button>{error && <p role="alert" className="mt-3 text-sm font-medium text-red-700">{error}</p>}</div>;
}
