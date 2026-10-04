import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Integrations listed as "Tool Name" separated by \n
// Only tools that actively promote integrations as a core part of their value
const integrations: Record<string, string> = {
  "1password": [
    "Slack", "Microsoft Teams", "Okta", "Azure Active Directory", "Duo Security",
    "Google Workspace", "GitHub", "Fastmail", "Yubikey",
  ].join("\n"),

  "ahrefs": [
    "Google Search Console", "Google Analytics", "Slack", "Looker Studio",
    "WordPress", "Zapier",
  ].join("\n"),

  "airtable": [
    "Slack", "Google Drive", "Google Calendar", "Jira", "Salesforce",
    "Asana", "Zapier", "Make", "Notion", "Zoom", "GitHub", "Typeform",
    "Stripe", "HubSpot", "Mailchimp",
  ].join("\n"),

  "asana": [
    "Slack", "Microsoft Teams", "Google Workspace", "Zoom", "GitHub",
    "Jira", "Salesforce", "Figma", "Zapier", "Adobe Creative Cloud",
    "Tableau", "Power BI", "Outlook", "Dropbox",
  ].join("\n"),

  "bigcommerce": [
    "Stripe", "PayPal", "Square", "Avalara", "ShipBob", "ShipStation",
    "Mailchimp", "Klaviyo", "Google Shopping", "Meta Ads",
    "Zapier", "QuickBooks", "NetSuite", "Amazon", "eBay",
  ].join("\n"),

  "canva": [
    "Google Drive", "Dropbox", "Slack", "Mailchimp", "HubSpot",
    "WordPress", "Shopify", "Meta Business Suite", "LinkedIn",
    "YouTube", "Google Photos", "OneDrive",
  ].join("\n"),

  "chatgpt": [
    "Zapier", "Make", "Notion", "Slack", "Microsoft Teams",
    "Google Drive", "HubSpot", "Salesforce", "GitHub", "DALL-E",
    "Browsing (Bing)", "Wolfram Alpha",
  ].join("\n"),

  "descript": [
    "YouTube", "Spotify for Podcasters", "Apple Podcasts", "Dropbox",
    "Google Drive", "Slack", "Zoom", "SquadCast", "Riverside",
  ].join("\n"),

  "figma": [
    "Slack", "Jira", "Asana", "Linear", "GitHub", "GitLab", "Notion",
    "Zeplin", "Storybook", "Lottie Files", "Maze", "UserTesting",
    "Microsoft Teams", "Google Drive",
  ].join("\n"),

  "framer": [
    "GitHub", "Figma", "Google Analytics", "Hotjar", "Intercom",
    "Mailchimp", "Zapier", "Airtable", "Lottie",
  ].join("\n"),

  "freshbooks": [
    "Stripe", "PayPal", "Shopify", "WooCommerce", "Squarespace",
    "G Suite", "Slack", "Asana", "Trello", "Gusto", "Bench",
    "HubSpot", "Zapier",
  ].join("\n"),

  "github": [
    "Slack", "Microsoft Teams", "Jira", "Linear", "Figma",
    "Vercel", "Netlify", "AWS", "Google Cloud", "Azure",
    "CircleCI", "Jenkins", "Dependabot", "Codecov", "SonarCloud",
    "Zapier",
  ].join("\n"),

  "kinsta": [
    "Cloudflare", "New Relic", "Datadog", "Slack", "GitHub",
    "Bitbucket", "GitLab", "WooCommerce", "WP Engine Migrate",
  ].join("\n"),

  "linear": [
    "GitHub", "GitLab", "Slack", "Figma", "Notion", "Sentry",
    "PagerDuty", "Zendesk", "Zapier", "Intercom", "Datadog",
  ].join("\n"),

  "loom": [
    "Slack", "Notion", "Jira", "Linear", "Asana", "GitHub",
    "Confluence", "HubSpot", "Salesforce", "Intercom",
    "Microsoft Teams", "Google Workspace",
  ].join("\n"),

  "mailchimp": [
    "Shopify", "WooCommerce", "Squarespace", "BigCommerce", "Magento",
    "Stripe", "PayPal", "Salesforce", "HubSpot", "Zapier",
    "WordPress", "Facebook", "Instagram", "Google Analytics",
    "Canva", "Eventbrite",
  ].join("\n"),

  "miro": [
    "Jira", "Asana", "Confluence", "Slack", "Microsoft Teams",
    "Zoom", "Google Workspace", "Figma", "Notion", "GitHub",
    "Salesforce", "Airtable", "Azure DevOps", "Trello",
  ].join("\n"),

  "notion": [
    "Slack", "GitHub", "Jira", "Asana", "Google Drive", "Figma",
    "Zapier", "Make", "Loom", "Miro", "Typeform", "Stripe",
    "HubSpot", "Salesforce", "Linear", "Airtable",
  ].join("\n"),

  "quickbooks": [
    "PayPal", "Stripe", "Square", "Shopify", "WooCommerce",
    "Bill.com", "Gusto", "TSheets", "HubSpot", "Salesforce",
    "Mailchimp", "Zapier", "Google Sheets", "Microsoft Excel",
  ].join("\n"),

  "riverside": [
    "Dropbox", "Google Drive", "Descript", "Zoom", "Slack",
    "Zapier", "YouTube", "Spotify for Podcasters",
  ].join("\n"),

  "semrush": [
    "Google Search Console", "Google Analytics", "Google Ads",
    "Looker Studio", "Trello", "Zapier", "WordPress", "Wix",
    "Semrush App Center", "Google Docs",
  ].join("\n"),

  "shopify": [
    "Stripe", "PayPal", "Meta Ads", "Google Shopping", "TikTok Shop",
    "Mailchimp", "Klaviyo", "Zendesk", "ShipStation", "ShipBob",
    "QuickBooks", "Xero", "Zapier", "Amazon", "eBay", "Walmart Marketplace",
    "Google Analytics", "Oberlo", "ReCharge",
  ].join("\n"),

  "slack": [
    "Google Workspace", "Microsoft 365", "GitHub", "GitLab", "Jira",
    "Asana", "Linear", "Notion", "Salesforce", "HubSpot", "Zoom",
    "PagerDuty", "Datadog", "Sentry", "Figma", "Dropbox",
    "Stripe", "Zapier", "AWS", "Trello",
  ].join("\n"),

  "twilio": [
    "Salesforce", "HubSpot", "Zendesk", "Shopify", "Stripe",
    "SendGrid", "Zapier", "AWS Lambda", "Google Cloud Functions",
    "Segment", "Facebook Messenger", "WhatsApp Business API",
  ].join("\n"),

  "vercel": [
    "GitHub", "GitLab", "Bitbucket", "Slack", "Datadog",
    "Sentry", "PlanetScale", "Supabase", "Upstash", "Sanity",
    "Contentful", "Algolia", "Stripe", "Auth0",
  ].join("\n"),

  "woocommerce": [
    "Stripe", "PayPal", "Square", "Mailchimp", "Klaviyo",
    "ShipStation", "DHL", "FedEx", "UPS", "QuickBooks",
    "Xero", "Google Analytics", "Facebook Pixel", "Zapier",
    "Yoast SEO", "Amazon", "eBay",
  ].join("\n"),

  "zoom": [
    "Slack", "Microsoft Teams", "Google Workspace", "Salesforce",
    "HubSpot", "Calendly", "Notion", "Asana", "Dropbox",
    "ServiceNow", "Zapier", "Okta", "Microsoft Outlook",
  ].join("\n"),
};

async function main() {
  let updated = 0;
  let skipped = 0;
  for (const [slug, integrationList] of Object.entries(integrations)) {
    try {
      const result = await prisma.product.updateMany({
        where: { slug },
        data: { integrations: integrationList },
      });
      if (result.count > 0) {
        console.log(`  ✓ ${slug}`);
        updated++;
      } else {
        console.log(`  ? ${slug} — not found`);
        skipped++;
      }
    } catch (e: unknown) {
      console.error(`  ✗ ${slug}: ${e instanceof Error ? e.message : String(e)}`);
      skipped++;
    }
  }
  console.log(`\nDone — ${updated} updated, ${skipped} skipped / no integrations`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
