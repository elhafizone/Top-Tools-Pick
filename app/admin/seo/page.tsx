import { requireAdmin } from "@/lib/admin/auth";
import { getSearchConsoleSummary, isSearchConsoleConfigured } from "@/lib/gsc";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  await requireAdmin();

  if (!isSearchConsoleConfigured()) {
    return (
      <section>
        <h1 className="text-3xl font-black">SEO performance</h1>
        <div className="mt-6 border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-semibold">Google Search Console is not connected yet.</p>
          <p className="mt-2 leading-6">
            Set <code>GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL</code>, <code>GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY</code> and{" "}
            <code>GOOGLE_SEARCH_CONSOLE_SITE_URL</code> in the environment, then add that service account as a
            restricted user on the Search Console property. See{" "}
            <code>docs/seo/article-automation-setup.md</code> for the exact steps.
          </p>
        </div>
      </section>
    );
  }

  const { totals, topQueries, topPages } = await getSearchConsoleSummary();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const tiles = [
    { label: "Clicks (28d)", value: totals.clicks.toLocaleString() },
    { label: "Impressions (28d)", value: totals.impressions.toLocaleString() },
    { label: "Avg. CTR", value: `${(totals.ctr * 100).toFixed(1)}%` },
    { label: "Avg. position", value: totals.position.toFixed(1) },
  ];

  return (
    <section>
      <p className="text-sm font-bold uppercase tracking-widest text-[#2180F8]">Google Search Console</p>
      <h1 className="mt-2 text-3xl font-black">SEO performance</h1>
      <p className="mt-2 text-sm text-slate-500">Last 28 days.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{tile.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-black">Top queries</h2>
          <div className="mt-3 divide-y border-y border-slate-200 text-sm">
            {topQueries.length === 0 ? (
              <p className="py-4 text-slate-500">No data yet.</p>
            ) : (
              topQueries.map((row) => (
                <div key={row.keys.join()} className="flex justify-between gap-4 py-2">
                  <span>{row.keys[0]}</span>
                  <span className="font-semibold">{row.clicks.toLocaleString()} clicks</span>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-black">Top pages</h2>
          <div className="mt-3 divide-y border-y border-slate-200 text-sm">
            {topPages.length === 0 ? (
              <p className="py-4 text-slate-500">No data yet.</p>
            ) : (
              topPages.map((row) => (
                <div key={row.keys.join()} className="flex justify-between gap-4 py-2">
                  <span className="truncate">{row.keys[0]?.replace(siteUrl, "") || "/"}</span>
                  <span className="font-semibold">{row.clicks.toLocaleString()} clicks</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
