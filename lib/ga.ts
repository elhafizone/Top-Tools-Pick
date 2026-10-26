import { JWT } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"];

export function isAnalyticsConfigured() {
  return Boolean(
    process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL &&
    process.env.GOOGLE_ANALYTICS_PRIVATE_KEY &&
    process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
  );
}

function getClient() {
  const email = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL;
  const key = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY;
  if (!email || !key) return null;
  // Env vars store literal "\n" - the real key needs real newlines.
  return new JWT({ email, key: key.replace(/\\n/g, "\n"), scopes: SCOPES });
}

type ReportRow = { dimensionValues: Array<{ value: string }>; metricValues: Array<{ value: string }> };

async function runReport(body: Record<string, unknown>): Promise<ReportRow[]> {
  const client = getClient();
  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
  if (!client || !propertyId) return [];
  const response = await client.request<{ rows?: ReportRow[] }>({
    url: `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    method: "POST",
    data: body,
  });
  return response.data.rows ?? [];
}

/** Last 28 days of GA4 data: totals, top pages by views, top traffic sources. */
export async function getAnalyticsSummary() {
  const dateRanges = [{ startDate: "28daysAgo", endDate: "today" }];

  const [totalsRows, pageRows, sourceRows] = await Promise.all([
    runReport({ dateRanges, metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }, { name: "averageSessionDuration" }] }),
    runReport({ dateRanges, dimensions: [{ name: "pagePath" }], metrics: [{ name: "screenPageViews" }], orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }], limit: "10" }),
    runReport({ dateRanges, dimensions: [{ name: "sessionDefaultChannelGroup" }], metrics: [{ name: "sessions" }], orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: "10" }),
  ]);

  const totals = totalsRows[0]?.metricValues ?? [];
  return {
    totals: {
      activeUsers: Number(totals[0]?.value ?? 0),
      sessions: Number(totals[1]?.value ?? 0),
      pageViews: Number(totals[2]?.value ?? 0),
      avgSessionSeconds: Number(totals[3]?.value ?? 0),
    },
    topPages: pageRows.map((row) => ({ path: row.dimensionValues[0]?.value ?? "", views: Number(row.metricValues[0]?.value ?? 0) })),
    topChannels: sourceRows.map((row) => ({ channel: row.dimensionValues[0]?.value ?? "", sessions: Number(row.metricValues[0]?.value ?? 0) })),
  };
}
