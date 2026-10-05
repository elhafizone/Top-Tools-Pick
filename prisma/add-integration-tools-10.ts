// Batch 10: BigQuery, Snowflake, Looker Studio, Tableau, Facebook Ads, TikTok, Shopify
import { PrismaClient, PricingModel, PublicationStatus } from '@prisma/client'

const prisma = new PrismaClient()
const CDN = 'https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos'

const CATEGORIES = {
  business: 'cmtzal7l10004hl6cad0e0vx3',
  marketing: 'cmtzal7h30002hl6ccnboa82i',
  dev: 'cmtzal7n20005hl6czrtj6745',
}

const tools = [
  {
    name: 'BigQuery',
    slug: 'bigquery',
    categoryId: CATEGORIES.dev,
    websiteUrl: 'https://cloud.google.com/bigquery',
    logoUrl: `${CDN}/bigquery.svg`,
    pricingModel: PricingModel.USAGE_BASED,
    hasFreePlan: true,
    hasFreeTrial: false,
    rating: 4.5,
    editorialScore: 84,
    shortDescription: 'Google Cloud\'s serverless data warehouse — run SQL analytics on petabyte-scale datasets without managing infrastructure, with a generous free tier.',
    description: `BigQuery is Google Cloud's serverless, highly scalable data warehouse for running SQL analytics on large datasets. It separates compute from storage, meaning you don't provision servers — you write SQL queries, and BigQuery automatically scales compute to execute them. This serverless model makes BigQuery one of the simplest and most cost-effective options for organizations moving from on-premise data warehouses to the cloud.

BigQuery can query terabytes of data in seconds and petabytes in minutes using Google's Dremel query execution engine. It supports standard SQL and integrates natively with the broader Google Cloud and Google Workspace ecosystem — Google Sheets, Looker Studio, Dataflow, Vertex AI, and Cloud Composer.

BigQuery ML enables training and running machine learning models directly in BigQuery using SQL — no data movement to a separate ML platform required. Supported models include linear regression, logistic regression, k-means clustering, time series forecasting, and import of TensorFlow and XGBoost models.

BigQuery Omni extends BigQuery to run queries on data in AWS S3 and Azure Blob Storage without moving data — multi-cloud analytics from a single BigQuery interface.

Pricing: $0 for the first 10GB of storage and 1TB of queries per month. Storage costs $0.02/GB/month. On-demand query pricing: $5 per TB of data scanned. Flat-rate pricing (reservations) is available for predictable workloads. BigQuery is significantly cheaper than Redshift and Snowflake for variable, bursty query workloads.`,
    pros: `Serverless architecture — no cluster management, no sizing decisions, automatic scaling; focus on SQL not infrastructure
Generous free tier (10GB storage, 1TB queries/month) lets teams start without any cost
$5/TB on-demand pricing is competitive for variable workloads — pay only for queries you run
Native integration with Google Workspace (Sheets, Looker Studio), Vertex AI, and Dataflow creates a complete data platform`,
    cons: `Cost can escalate quickly for complex queries scanning large datasets — query optimization requires understanding of partitioning and clustering
Vendor lock-in to Google Cloud ecosystem — migrating away from BigQuery requires significant data movement
Less mature SQL features than Snowflake for complex data engineering use cases — some advanced features require workarounds
On-demand pricing model can make costs unpredictable for teams not monitoring query costs carefully`,
    bestFor: 'Data teams and analytics engineers on Google Cloud building data warehouses; organizations already in the Google Workspace ecosystem wanting native Sheets and Looker Studio integration; teams with variable query workloads where on-demand pricing is cheaper than provisioned alternatives',
    notFor: 'AWS-centric organizations where Redshift integrates more naturally with the existing stack; teams requiring the most mature SQL capabilities and data sharing features (Snowflake is ahead here); very small datasets where simpler databases (PostgreSQL, MySQL) are more cost-effective',
    keyFeatures: `Serverless SQL: Query petabytes of data in seconds with no infrastructure to manage — automatic scaling from zero
BigQuery ML: Train and run ML models directly in BigQuery with SQL — no data movement to separate ML infrastructure
Streaming Inserts: Load real-time data into BigQuery for near-real-time analytics — seconds-level data freshness
BigQuery Omni: Query data in AWS S3 and Azure Blob Storage from BigQuery — multi-cloud analytics without data movement
Partitioning and Clustering: Optimize query cost and performance by organizing tables by date or high-cardinality columns
Google Workspace Integration: Query BigQuery from Google Sheets; visualize in Looker Studio without data export`,
    integrations: `Google Sheets\nLooker Studio\nTableau\nDataflow\nVertex AI\nAmplitude\nSegment\ndbt\nAirflow\nFivetran\nStitch\nRedshift\nSnowflake\nPower BI`,
    verdict: 'BigQuery is one of the best data warehouses for teams on Google Cloud. The serverless model, generous free tier, and native Google Workspace integration make it the easiest path to a modern analytics stack for Google Cloud users. For AWS teams, Redshift Serverless provides a comparable serverless experience. Snowflake is the best choice for multi-cloud teams or those who need the most mature data sharing and marketplace features. For variable workloads, BigQuery\'s on-demand pricing often beats Snowflake\'s credit-based model.',
    seoTitle: 'BigQuery: Pricing, Plans & Data Warehouse Features | TopToolsPick',
    seoDescription: 'BigQuery is free for 1TB queries/month. On-demand from $5/TB scanned. See serverless SQL, BigQuery ML, and how BigQuery compares to Snowflake.',
  },
  {
    name: 'Snowflake',
    slug: 'snowflake',
    categoryId: CATEGORIES.dev,
    websiteUrl: 'https://www.snowflake.com',
    logoUrl: `${CDN}/snowflake.svg`,
    pricingModel: PricingModel.USAGE_BASED,
    hasFreePlan: false,
    hasFreeTrial: true,
    rating: 4.5,
    editorialScore: 85,
    shortDescription: 'The leading multi-cloud data platform — runs on AWS, GCP, and Azure with industry-leading data sharing, marketplace, and data engineering capabilities.',
    description: `Snowflake is a cloud data platform that runs on AWS, GCP, and Azure — the first truly multi-cloud data warehouse. Used by over 9,000 enterprises, Snowflake has become the dominant independent data warehouse platform, known for its performance, data sharing capabilities, and rich ecosystem.

Snowflake's architecture separates storage (S3/GCS/Azure Blob), compute (virtual warehouses — clusters of compute resources), and cloud services (query optimization, metadata, access control). Virtual warehouses can be independently scaled up or down and suspended when not in use — you only pay for compute while it's running. Storage costs $23/TB/month.

Snowflake's data sharing is its most distinctive feature: organizations can share live data with external parties (customers, partners, vendors) without copying data — the recipient queries your data in real-time. Snowflake Marketplace hosts data products that organizations can license and query directly — financial data, weather data, location data, demographic data.

Snowflake supports multiple workloads: data warehousing (structured data analytics), data lake (semi-structured data in JSON, Parquet, Avro), data engineering (ETL pipelines, tasks, streams), data applications (Snowpark for Python/Java/Scala), and ML (Snowflake ML Functions, Cortex AI).

Pricing is credit-based: each virtual warehouse size consumes credits per hour (XS = 1 credit/hour, S = 2, M = 4, L = 8, up to 6XL). Credits cost $2-3.70 depending on the cloud and edition. Standard, Business Critical, and Enterprise editions add features at higher per-credit cost. 30-day free trial with $400 in credits.`,
    pros: `True multi-cloud support (AWS, GCP, Azure) with cross-cloud data sharing — works anywhere, shares anywhere
Data sharing without copying — share live data with partners and customers with zero ETL or data movement
Snowflake Marketplace provides licensed third-party data directly queryable in your Snowflake environment
Most mature data engineering capabilities — streams, tasks, dynamic tables, and Snowpark for Python/Java/Scala`,
    cons: `More expensive than BigQuery for variable workloads — credit-based pricing can be hard to predict without query monitoring
No true serverless mode — virtual warehouses must be started and sized; auto-suspend reduces cost but adds latency for first queries
Credit consumption on idle warehouses if auto-suspend is not configured correctly
Complex pricing model (editions, credits, cloud regions) makes cost estimation difficult before actual usage`,
    bestFor: 'Data teams requiring multi-cloud flexibility, data sharing with external parties, or the most mature data engineering capabilities; enterprises building data products that customers query directly via Snowflake Marketplace; organizations with mixed workloads (warehousing + data lake + ML)',
    notFor: 'Teams with simple BI queries who can use BigQuery at lower cost on Google Cloud; organizations starting their data journey where BigQuery\'s serverless simplicity is easier to operate; AWS-only teams with primarily warehousing needs where Redshift Serverless is comparable at lower cost',
    keyFeatures: `Multi-Cloud: Runs on AWS, Azure, and GCP — choose your cloud or span multiple clouds with cross-region replication
Data Sharing: Share live data with external parties without copying — recipients query your data in real-time
Snowflake Marketplace: Browse and license commercial data products — financial, weather, location, and demographic datasets
Virtual Warehouses: Independent compute clusters that can be resized and suspended — pay only for active compute
Snowpark: Run Python, Java, and Scala code inside Snowflake — data transformation and ML without moving data out
Time Travel: Query data as it existed at any point in the past 90 days — recover from accidental changes`,
    integrations: `dbt\nFivetran\nAirflow\nBigQuery\nTableau\nLooker\nPower BI\nSigma\nSegment\nAmplitude\nSalesforce\nAWS\nGoogle Cloud\nAzure`,
    verdict: 'Snowflake is the best data warehouse for organizations that need multi-cloud flexibility, data sharing with external partners, or the most mature data engineering capabilities. The credit-based pricing and more complex operational model mean BigQuery is simpler and often cheaper for Google Cloud teams. For AWS teams, Redshift Serverless is worth comparing. Snowflake\'s Marketplace and data sharing capabilities are genuinely differentiated — no other warehouse makes it this easy to share and monetize data.',
    seoTitle: 'Snowflake: Pricing, Plans & Data Warehouse Features | TopToolsPick',
    seoDescription: 'Snowflake data platform pricing from $2/credit. 30-day free trial. See data sharing, Marketplace, Snowpark, and how Snowflake compares to BigQuery.',
  },
  {
    name: 'Looker Studio',
    slug: 'looker-studio',
    categoryId: CATEGORIES.marketing,
    websiteUrl: 'https://lookerstudio.google.com',
    logoUrl: `${CDN}/looker-studio.svg`,
    pricingModel: PricingModel.FREE,
    hasFreePlan: true,
    hasFreeTrial: false,
    rating: 4.3,
    editorialScore: 79,
    shortDescription: 'Google\'s free business intelligence and data visualization tool — connect to Google Analytics, Sheets, BigQuery, and 800+ data sources to build shareable dashboards.',
    description: `Looker Studio (formerly Google Data Studio) is Google's free business intelligence and data visualization platform. It connects to Google's own data sources (Analytics, Ads, Search Console, Sheets, BigQuery) as well as 800+ third-party connectors, and creates shareable interactive dashboards and reports.

The core use case is marketing and business reporting: pull data from Google Analytics 4, Google Ads, Search Console, and YouTube into a single dashboard for comprehensive digital marketing reporting. Marketers, analysts, and agency teams use Looker Studio to create client-facing dashboards that update automatically without manual data exports.

Data connectors: Google services (Analytics, Ads, Search Console, Sheets, BigQuery, YouTube, Merchant Center) are free native connectors. Third-party connectors (Facebook Ads, Salesforce, LinkedIn Ads, HubSpot, and 800+ others) are provided by community or commercial connector partners — most are free, some charge subscription fees.

Charts and visualizations: time series, bar charts, pie charts, scatter plots, geo maps, heat maps, pivot tables, scorecards, and tables. Charts can be filtered interactively with date range controls, dropdown selectors, and search filters.

Sharing: reports can be shared with view or edit access (like Google Docs), embedded on websites, or downloaded as PDF. Reports update automatically as underlying data sources refresh.

Looker Studio is completely free. Looker Studio Pro ($9/user/month) adds team workspaces, content management, and enhanced collaboration.`,
    pros: `Completely free — no cost to create or share dashboards with any number of viewers
Native Google ecosystem connectors (Analytics, Ads, BigQuery, Sheets) are seamlessly integrated with no configuration
Easy to learn for non-technical users — drag-and-drop dashboard builder with no SQL required for basic reports
Reports are shareable with edit or view access and embeddable on websites`,
    cons: `Performance can be slow for complex reports with many data sources or large datasets
Third-party connectors (beyond Google's own) often require paid commercial connector services
Less powerful for complex data modeling compared to Tableau or Power BI — limited calculated fields and no relationship modeling
Free tier lacks team workspaces and content management — sharing reports individually becomes unwieldy at scale`,
    bestFor: 'Marketing teams and agencies building reports from Google Analytics, Ads, and Search Console; businesses that need free shareable dashboards from Google data sources; teams already in Google Workspace who want zero-cost BI without learning SQL',
    notFor: 'Enterprise BI requiring complex data modeling, self-service analytics, and row-level security — Tableau, Power BI, or Looker are more capable; teams with primarily non-Google data sources where Power BI or Metabase are better fits',
    keyFeatures: `Google Data Connectors: Native connectors to GA4, Google Ads, Search Console, Sheets, BigQuery, and YouTube at no cost
Drag-and-Drop Builder: Create dashboards without SQL or code — charts, tables, filters, and date controls
Interactive Filters: Viewers can filter reports by date range, dimension, or custom controls — self-service exploration
Calculated Fields: Create custom metrics and dimensions with formula expressions — basic data transformation without SQL
Sharing and Embedding: Share with specific people, embed in websites, or create publicly accessible reports
Automated Refresh: Data updates automatically based on the source refresh schedule — no manual report updates`,
    integrations: `Google Analytics\nGoogle Ads\nBigQuery\nGoogle Sheets\nFacebook Ads\nHubSpot\nSalesforce\nMailchimp\nShopify\nTableau\nSegment\nYouTube\nSearch Console\nMeta Ads`,
    verdict: 'Looker Studio is the best free BI tool for teams primarily using Google\'s ecosystem. The free native Google connectors and easy sharing make it the default choice for marketing teams doing Google Analytics and Ads reporting. For complex data modeling and enterprise self-service analytics, Tableau and Power BI are more capable. Metabase is a better open-source alternative for SQL-based analytics. The free plan is genuinely useful; Looker Studio Pro is worth the $9/user/month for teams managing many reports.',
    seoTitle: 'Looker Studio: Features, Connectors & BI Guide | TopToolsPick',
    seoDescription: 'Looker Studio is free to use. Pro from $9/user/month. See Google data connectors, dashboard building, and how Looker Studio compares to Tableau.',
  },
  {
    name: 'Facebook Ads',
    slug: 'facebook-ads',
    categoryId: CATEGORIES.marketing,
    websiteUrl: 'https://www.facebook.com/business/ads',
    logoUrl: `${CDN}/facebook-ads.svg`,
    pricingModel: PricingModel.USAGE_BASED,
    hasFreePlan: false,
    hasFreeTrial: false,
    rating: 4.2,
    editorialScore: 79,
    shortDescription: 'Meta\'s advertising platform for Facebook and Instagram — the largest social media ad network with detailed demographic and interest targeting for consumer and B2C brands.',
    description: `Facebook Ads (now Meta Ads) is Meta's advertising platform that serves ads across Facebook, Instagram, Messenger, and the Meta Audience Network (partner apps and websites). With over 3.2 billion monthly active users across Meta's platforms, it's the largest social media advertising network and a core channel for consumer and B2C brands.

Meta Ads Manager is the unified interface for creating, managing, and analyzing campaigns across all Meta platforms. Ad campaigns are organized in three levels: Campaign (objective), Ad Set (targeting, budget, schedule), and Ad (creative). This structure allows testing multiple audiences and creatives within one campaign budget.

Meta's targeting capabilities are based on the largest behavioral dataset in digital advertising: demographic (age, gender, location), interest (based on Facebook activity and pages liked), behavioral (purchase behavior, device usage, travel patterns), and custom audiences (website visitors via Meta Pixel, email list uploads, customer value-based lookalikes). This targeting depth is unmatched in social advertising.

Ad formats: Image, Video, Carousel (multiple images/videos with individual links), Collection (immersive mobile shopping experience), Stories (full-screen vertical), Reels (short video), and Instant Experience (full-screen mobile canvas). Catalog ads dynamically show products to users who visited your website — a powerful retargeting format for e-commerce.

Advantage+ Shopping Campaigns use AI to optimize ad delivery, creative, audience, and placement — Meta's automated campaign type for e-commerce that often outperforms manual campaigns.

No minimum spend. Meta charges by impression (CPM) or click (CPC). Typical CPMs range from $5-20 depending on audience and objective.`,
    pros: `Largest social media advertising network — reach 3.2 billion users across Facebook, Instagram, Messenger, and Audience Network
Demographic and interest targeting depth is unmatched — behavioral data from Facebook activity enables very precise audience definition
Dynamic catalog ads and Advantage+ Shopping enable highly automated, performance-optimized e-commerce campaigns
Cross-platform campaign management — Facebook, Instagram, and Audience Network ads managed in one interface`,
    cons: `iOS 14.5 App Tracking Transparency severely impacted attribution accuracy — conversion reporting is less reliable than pre-2021
Privacy changes and increasing competition have increased CPMs — advertising costs have risen significantly in recent years
Ad account bans for policy violations can happen with limited recourse — strict and sometimes opaque content policies
Organic reach on Facebook has declined to near-zero for pages — organic and paid strategies are now almost completely separate`,
    bestFor: 'Consumer and B2C brands targeting broad audiences by demographics and interests — especially e-commerce brands using dynamic catalog ads and retargeting; brands with strong visual creative (images and video) selling directly to consumers; any business combining Facebook and Instagram advertising through a single platform',
    notFor: 'B2B companies targeting business buyers by job title and company (LinkedIn is more effective); brands primarily targeting users in countries where Meta platforms are blocked or have low penetration; businesses without the creative resources to produce engaging visual ad content',
    keyFeatures: `Campaign Manager: Three-tier campaign structure (Campaign, Ad Set, Ad) for organized testing of objectives, audiences, and creatives
Custom Audiences: Upload customer email lists, target website visitors (via Meta Pixel), or app users — retarget known audiences
Lookalike Audiences: Find new users similar to your best customers — Meta\'s ML identifies shared characteristics
Catalog Ads: Dynamically show product ads to users who viewed products on your website — automated retargeting for e-commerce
Advantage+ Shopping: AI-automated campaign optimization across audience, creative, placement, and budget allocation
Meta Pixel: JavaScript snippet tracking website conversions — connects ad impressions to website actions for attribution`,
    integrations: `Instagram\nShopify\nWooCommerce\nGoogle Analytics\nSegment\nHubSpot\nSalesforce\nKlaviyo\nMailchimp\nZapier\nGoogle Ads\nMeta Business Suite\nTikTok Ads\nSupermetrics`,
    verdict: 'Meta Ads remains a critical channel for consumer brands despite increasing CPMs and attribution challenges from iOS privacy changes. The demographic targeting depth and cross-platform reach (Facebook + Instagram in one buy) are unmatched in social advertising. Dynamic catalog ads and retargeting remain high-ROI for e-commerce. For B2B companies, LinkedIn delivers better qualified leads despite higher CPCs. TikTok Ads is an increasingly capable alternative for brands targeting younger audiences. Any consumer brand not running Meta Ads is likely missing a significant growth channel.',
    seoTitle: 'Facebook Ads: Pricing, Targeting & Campaign Features | TopToolsPick',
    seoDescription: 'Meta Ads has no minimum spend. CPMs typically $5-20. See targeting, catalog ads, Advantage+, and how Facebook Ads compares to Google Ads.',
  },
  {
    name: 'Shopify',
    slug: 'shopify',
    categoryId: CATEGORIES.business,
    websiteUrl: 'https://www.shopify.com',
    logoUrl: `${CDN}/shopify.svg`,
    pricingModel: PricingModel.SUBSCRIPTION,
    hasFreePlan: false,
    hasFreeTrial: true,
    rating: 4.6,
    editorialScore: 87,
    shortDescription: 'The world\'s leading e-commerce platform — powers over 1.7 million stores with everything needed to sell online: storefront, payments, shipping, inventory, and marketing.',
    description: `Shopify is the world's leading e-commerce platform, powering over 1.7 million businesses across 175 countries including Allbirds, Gymshark, and Heinz. It provides everything needed to sell products online — a customizable storefront, payment processing, inventory management, shipping and fulfillment, and marketing tools — in an integrated platform without requiring technical expertise.

The Shopify storefront uses a theme system: choose from 100+ free and paid themes, customize with the visual editor, and launch a professional online store without coding. Shopify's Liquid templating language and Storefront API enable custom development for teams with technical resources.

Shopify Payments is the built-in payment processor — when used instead of third-party processors, Shopify waives its transaction fee (2%, 1%, or 0.5% depending on plan). Shopify supports 100+ payment gateways internationally.

The Shopify App Store provides 8,000+ apps for capabilities beyond the core platform — subscription billing, loyalty programs, reviews, advanced analytics, marketing automation, and fulfillment services.

Shopify Plus is the enterprise offering for high-volume brands — unlimited staff accounts, 50 storefronts, Shopify Scripts for custom checkout experiences, and dedicated support. Most Shopify Plus merchants are brands doing $1M-$500M+ in annual revenue.

Basic plan ($29/month): 2 staff, basic reports. Shopify ($79/month): 5 staff, standard reports. Advanced ($299/month): 15 staff, advanced reporting. Shopify Plus ($2,300/month): enterprise features.`,
    pros: `Easiest path to a professional online store — launch in hours without technical expertise
8,000+ App Store integrations cover virtually any e-commerce use case beyond the core platform
Shopify Payments eliminates third-party payment processing setup and reduces transaction fees
Shopify Plus scales to enterprise — the same platform serves a startup and a $500M DTC brand`,
    cons: `Transaction fees on non-Shopify Payments (2%, 1%, 0.5%) add up for high-volume merchants using third-party processors
Monthly subscription + app costs can be expensive for small stores — 3-5 essential apps add $50-200/month beyond the plan
Less flexible than self-hosted WooCommerce for deep customization — some checkout and storefront limitations without Shopify Plus
Shopify Plus is expensive ($2,300/month) for the additional enterprise features vs. Advanced plan`,
    bestFor: 'Consumer brands launching or growing direct-to-consumer (DTC) e-commerce businesses; any company that wants a professional online store without technical infrastructure management; high-growth DTC brands that will eventually scale to Shopify Plus',
    notFor: 'Very large enterprises with complex B2B or marketplace requirements where Magento or custom solutions are needed; businesses selling purely digital products where platforms like Gumroad or Paddle are simpler; businesses that need full ownership of the checkout experience without Shopify Plus',
    keyFeatures: `Storefront: 100+ themes with visual editor — professional online store without coding; Liquid templating for custom development
Shopify Payments: Built-in payment processing with no transaction fee — accept credit cards, Shop Pay, Apple Pay, Google Pay
Inventory Management: Multi-location inventory tracking, stock alerts, and purchase orders — manage products across stores and warehouses
Shopify POS: Point-of-sale system for physical retail — unify online and in-person inventory and customer data
App Store: 8,000+ apps for subscriptions, loyalty, reviews, shipping, and marketing — extend the platform for any use case
Shopify Analytics: Revenue, conversion, customer lifetime value, and cohort reports — built-in e-commerce analytics`,
    integrations: `Meta Ads\nGoogle Ads\nGoogle Analytics\nKlaviyo\nMailchimp\nRecharge\nYotpo\nGorgias\nShipBob\nAmazon\nTikTok\nPinterest\nZapier\nQuickBooks`,
    verdict: 'Shopify is the best e-commerce platform for most DTC brands — the combination of ease of use, scalability, and ecosystem is unmatched. WooCommerce is the best alternative for teams that want full ownership and deep WordPress integration. BigCommerce is worth evaluating for merchants who want the enterprise features without Shopify\'s transaction fees. For pure digital products, simpler platforms exist. For physical product e-commerce at any scale, Shopify is the default choice.',
    seoTitle: 'Shopify: Pricing, Plans & E-commerce Features | TopToolsPick',
    seoDescription: 'Shopify starts at $29/month. Shopify Plus from $2,300/month. See payments, App Store, POS, and how Shopify compares to WooCommerce.',
  },
]

async function main() {
  for (const tool of tools) {
    const existing = await prisma.product.findUnique({ where: { slug: tool.slug } })
    if (existing) { console.log(`⏭  ${tool.name} already exists`); continue }
    await prisma.product.create({ data: { ...tool, status: PublicationStatus.PUBLISHED } })
    console.log(`✓ Added ${tool.name}`)
  }
  console.log('\nBatch 10 complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
