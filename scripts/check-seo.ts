// On-demand Search Console summary - no /admin/seo page needed. Run this whenever
// asked how the site is doing in search; it needs no Hostinger env vars, only the
// GOOGLE_SEARCH_CONSOLE_* ones in .env.local.
// Run: npx tsx --env-file=.env.local scripts/check-seo.ts
import { getSearchConsoleSummary, isSearchConsoleConfigured } from "../lib/gsc";

async function main() {
  if (!isSearchConsoleConfigured()) {
    console.log("Search Console is not configured - set GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL, " +
      "GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY and GOOGLE_SEARCH_CONSOLE_SITE_URL in .env.local. " +
      "See docs/seo/article-automation-setup.md.");
    return;
  }

  const { totals, topQueries, topPages } = await getSearchConsoleSummary();

  console.log("Google Search Console - last 28 days\n");
  console.log(`Clicks:       ${totals.clicks}`);
  console.log(`Impressions:  ${totals.impressions}`);
  console.log(`Avg. CTR:     ${(totals.ctr * 100).toFixed(2)}%`);
  console.log(`Avg. position: ${totals.position.toFixed(1)}`);

  console.log("\nTop queries:");
  for (const row of topQueries) console.log(`  ${row.clicks.toString().padStart(5)} clicks  ${row.keys[0]}`);

  console.log("\nTop pages:");
  for (const row of topPages) console.log(`  ${row.clicks.toString().padStart(5)} clicks  ${row.keys[0]}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
