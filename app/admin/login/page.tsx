import { buildMetadata } from "@/lib/seo";
import { Logo } from "@/components/brand/Logo";

export const metadata = buildMetadata("Admin login", "Protected content management login.");

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  return <main className="mx-auto max-w-md px-5 py-20"><Logo /><h1 className="mt-10 text-3xl font-black">Admin login</h1><p className="mt-3 text-sm text-slate-600">Use the server-configured administrator credentials.</p>{params.error && <p className="mt-4 text-sm text-red-700">{params.error === "unavailable" ? "Admin sign-in is not configured on this server." : "Invalid credentials."}</p>}<form action="/api/admin/login" method="post" className="mt-8 space-y-4"><input type="hidden" name="next" value={params.next ?? "/admin"} /><label className="block text-sm font-semibold">Username<input required name="username" className="mt-2 block w-full border border-slate-300 px-3 py-2" /></label><label className="block text-sm font-semibold">Password<input required type="password" name="password" className="mt-2 block w-full border border-slate-300 px-3 py-2" /></label><button className="bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Sign in</button></form></main>;
}
