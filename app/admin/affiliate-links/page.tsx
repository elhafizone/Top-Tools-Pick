import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { FormError } from "@/components/admin/FormError";

export const dynamic = "force-dynamic";

export default async function AffiliateLinksAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const query = await searchParams;
  const programs = await prisma.affiliateProgram.findMany({
    include: { product: { select: { name: true, slug: true } }, links: { orderBy: { priority: "desc" } } },
    orderBy: { product: { name: "asc" } },
  });

  const activeLinks = programs.filter((p) => p.status === "ACTIVE").flatMap((p) => p.links).filter((l) => l.enabled).length;

  return <section>
    <h1 className="text-3xl font-black">Affiliate links</h1>
    <p className="mt-3 max-w-3xl text-slate-600">
      A call-to-action only becomes an affiliate link when the programme is <strong>ACTIVE</strong> and
      the link is <strong>enabled</strong>. Otherwise the button falls back to the product&rsquo;s plain
      website URL, which earns nothing.
    </p>
    <p className="mt-3 text-sm font-semibold">
      {activeLinks === 0
        ? <span className="text-red-700">No live affiliate links yet — every CTA on the site currently falls back to the plain website URL.</span>
        : <span className="text-green-700">{activeLinks} live affiliate {activeLinks === 1 ? "link" : "links"}.</span>}
    </p>

    {query.saved === "1" && <p role="status" className="mt-4 text-sm font-semibold text-green-700">Saved.</p>}
    <FormError message={query.error} />

    <div className="mt-8 flex flex-col gap-10">
      {programs.map((program) => (
        <article key={program.id} className="border border-slate-200 p-5">
          <header className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">{program.product.name}</h2>
              <p className="text-sm text-slate-500">/tools/{program.product.slug} · {program.name}</p>
            </div>
            <span className={`text-xs font-bold uppercase ${program.status === "ACTIVE" ? "text-green-700" : "text-slate-500"}`}>{program.status}</span>
          </header>

          <form action={`/api/admin/affiliate-programs/${program.id}`} method="post" className="mt-5 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Status
              <select name="status" defaultValue={program.status} className="mt-1 block w-full border border-slate-300 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900">
                <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Network
              <input name="network" defaultValue={program.network ?? ""} className="mt-1 block w-full border border-slate-300 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900" />
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:col-span-2">Disclosure shown on the tool page
              <input name="disclosure" defaultValue={program.disclosure ?? ""} className="mt-1 block w-full border border-slate-300 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900" />
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:col-span-2">Internal notes
              <input name="notes" defaultValue={program.notes ?? ""} className="mt-1 block w-full border border-slate-300 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900" />
            </label>
            <button className="w-fit bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Save programme</button>
          </form>

          <h3 className="mt-7 text-sm font-bold uppercase tracking-wider text-slate-500">Links</h3>
          {program.links.length === 0 && <p className="mt-2 text-sm text-slate-500">No links yet.</p>}
          <div className="mt-2 flex flex-col gap-3">
            {program.links.map((link) => (
              <form key={link.id} action={`/api/admin/affiliate-links/${link.id}`} method="post" className="grid gap-2 border border-slate-200 p-3 sm:grid-cols-[1fr_2fr_auto_auto_auto_auto]">
                <input name="label" defaultValue={link.label} placeholder="Label" className="border border-slate-300 px-2 py-1 text-sm" />
                <input name="url" defaultValue={link.url} placeholder="https://…" className="border border-slate-300 px-2 py-1 text-sm" />
                <input name="region" defaultValue={link.region ?? ""} placeholder="Region" className="w-24 border border-slate-300 px-2 py-1 text-sm" />
                <input name="campaignKey" defaultValue={link.campaignKey ?? ""} placeholder="Campaign" className="w-28 border border-slate-300 px-2 py-1 text-sm" />
                <input name="priority" type="number" min="0" max="1000" defaultValue={link.priority} className="w-20 border border-slate-300 px-2 py-1 text-sm" />
                <span className="flex gap-2">
                  <select name="enabled" defaultValue={String(link.enabled)} className="border border-slate-300 px-2 py-1 text-sm">
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                  <button className="bg-slate-950 px-3 py-1 text-sm text-white">Save</button>
                </span>
              </form>
            ))}
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-slate-700">Add a link</summary>
            <form action="/api/admin/affiliate-links" method="post" className="mt-3 grid gap-2 border border-slate-200 p-3 sm:grid-cols-[1fr_2fr_auto_auto_auto_auto]">
              <input type="hidden" name="programId" value={program.id} />
              <input name="label" placeholder="Label" required className="border border-slate-300 px-2 py-1 text-sm" />
              <input name="url" placeholder="https://…" required className="border border-slate-300 px-2 py-1 text-sm" />
              <input name="region" placeholder="Region" className="w-24 border border-slate-300 px-2 py-1 text-sm" />
              <input name="campaignKey" placeholder="Campaign" className="w-28 border border-slate-300 px-2 py-1 text-sm" />
              <input name="priority" type="number" min="0" max="1000" defaultValue={0} className="w-20 border border-slate-300 px-2 py-1 text-sm" />
              <span className="flex gap-2">
                <select name="enabled" defaultValue="true" className="border border-slate-300 px-2 py-1 text-sm">
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                <button className="bg-slate-950 px-3 py-1 text-sm text-white">Create</button>
              </span>
            </form>
          </details>
        </article>
      ))}
    </div>
  </section>;
}
