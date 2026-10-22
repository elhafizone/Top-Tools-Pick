import { JWT } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];

export type SearchAnalyticsRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

export function isSearchConsoleConfigured() {
  return Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL &&
    process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY &&
    process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL,
  );
}

function getClient() {
  const email = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY;
  if (!email || !key) return null;
  // Env vars store literal "\n" - the real key needs real newlines.
  return new JWT({ email, key: key.replace(/\\n/g, "\n"), scopes: SCOPES });
}

async function query(dimensions: string[], rowLimit: number): Promise<SearchAnalyticsRow[]> {
  const client = getClient();
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
  if (!client || !siteUrl) return [];

  const end = new Date();
  const start = new Date(end.getTime() - 28 * 24 * 60 * 60 * 1000);
  const response = await client.request<{ rows?: SearchAnalyticsRow[] }>({
    url: `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    method: "POST",
    data: {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      dimensions,
      rowLimit,
    },
  });
  return response.data.rows ?? [];
}

/** Last 28 days of Google Search Console data for the admin SEO dashboard. */
export async function getSearchConsoleSummary() {
  const [totals, topQueries, topPages] = await Promise.all([
    query([], 1),
    query(["query"], 10),
    query(["page"], 10),
  ]);
  return {
    totals: totals[0] ?? { keys: [], clicks: 0, impressions: 0, ctr: 0, position: 0 },
    topQueries,
    topPages,
  };
}
