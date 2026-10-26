// On-demand Search Console + Analytics summary - no admin dashboard needed. Run
// this whenever asked how the site is doing; it needs no Hostinger env vars, only
// the GOOGLE_SEARCH_CONSOLE_* / GOOGLE_ANALYTICS_* ones in .env.local.
// Run: npx tsx --env-file=.env.local scripts/check-seo.ts
import { getSearchConsoleSummary, isSearchConsoleConfigured } from "../lib/gsc";
import { getAnalyticsSummary, isAnalyticsConfigured } from "../lib/ga";

async function printSearchConsole() {
  if (!isSearchConsoleConfigured()) {
    console.log("Search Console is not configured - set GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL, " +
      "GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY and GOOGLE_SEARCH_CONSOLE_SITE_URL in .env.local. " +
      "See docs/seo/article-automation-setup.md.");
    return;
  }

  const { totals, topQueries, topPages } = await getSearchConsoleSummary();

  console.log("=== Google Search Console - last 28 days ===\n");
  console.log(`Clicks:        ${totals.clicks}`);
  console.log(`Impressions:   ${totals.impressions}`);
  console.log(`Avg. CTR:      ${(totals.ctr * 100).toFixed(2)}%`);
  console.log(`Avg. position: ${totals.position.toFixed(1)}`);

  console.log("\nTop queries:");
  for (const row of topQueries) console.log(`  ${row.clicks.toString().padStart(5)} clicks  ${row.keys[0]}`);

  console.log("\nTop pages:");
  for (const row of topPages) console.log(`  ${row.clicks.toString().padStart(5)} clicks  ${row.keys[0]}`);
}

async function printAnalytics() {
  if (!isAnalyticsConfigured()) {
    console.log("Google Analytics is not configured - set GOOGLE_ANALYTICS_CLIENT_EMAIL, " +
      "GOOGLE_ANALYTICS_PRIVATE_KEY and GOOGLE_ANALYTICS_PROPERTY_ID in .env.local. " +
      "See docs/seo/article-automation-setup.md.");
    return;
  }

  const { totals, topPages, topChannels } = await getAnalyticsSummary();

  console.log("=== Google Analytics (GA4) - last 28 days ===\n");
  console.log(`Active users:      ${totals.activeUsers}`);
  console.log(`Sessions:          ${totals.sessions}`);
  console.log(`Page views:        ${totals.pageViews}`);
  console.log(`Avg. session:      ${Math.round(totals.avgSessionSeconds)}s`);

  console.log("\nTop pages (by views):");
  for (const row of topPages) console.log(`  ${row.views.toString().padStart(5)} views   ${row.path}`);

  console.log("\nTop channels (by sessions):");
  for (const row of topChannels) console.log(`  ${row.sessions.toString().padStart(5)} sessions ${row.channel}`);
}

async function main() {
  await printSearchConsole();
  console.log("\n");
  await printAnalytics();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
