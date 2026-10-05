// Batch 5: Okta, SendGrid
import { PrismaClient, PricingModel, PublicationStatus } from '@prisma/client'

const prisma = new PrismaClient()
const CDN = 'https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos'

const tools = [
  {
    name: 'Okta',
    slug: 'okta',
    categoryId: 'cmtzal7wz000ahl6c1sd1raaq', // cyber
    websiteUrl: 'https://www.okta.com',
    logoUrl: `${CDN}/okta.svg`,
    pricingModel: PricingModel.SUBSCRIPTION,
    hasFreePlan: false,
    hasFreeTrial: true,
    rating: 4.5,
    editorialScore: 83,
    shortDescription: 'Enterprise identity and access management platform — the leading SSO and MFA solution for securing workforce and customer identity at scale.',
    description: `Okta is the leading enterprise identity and access management (IAM) platform, used by over 17,000 organizations to secure employee and customer access to applications. It provides Single Sign-On (SSO), Multi-Factor Authentication (MFA), lifecycle management, and API access management from a centralized cloud-native platform.

The Workforce Identity Cloud secures employee access: SSO enables users to sign in once and access all their apps (SaaS, on-premises, custom) from a single dashboard. Adaptive MFA adds step-up authentication based on risk signals — location, device, network, and behavior — prompting for additional factors only when risk is elevated. Lifecycle Management automates provisioning and deprovisioning: when a new employee is hired, Okta automatically creates accounts in Salesforce, Slack, GitHub, and every other connected app based on group membership. When they leave, all access is revoked in seconds.

The Customer Identity Cloud (powered by Auth0, which Okta acquired) handles customer-facing authentication — social login, passwordless, and B2B federation.

Okta integrates with 7,000+ applications through its Application Network (OAN), providing pre-built SAML and OIDC connectors that enable SSO with most enterprise SaaS applications out of the box.

Pricing starts at $2/user/month for SSO only. MFA and lifecycle management are separate products with separate per-user pricing, making Okta's total cost per user significant for full deployments.`,
    pros: `7,000+ pre-built application integrations in the OAN — SSO with nearly any SaaS app without custom development
Lifecycle management automatically provisions and deprovisions access across all connected apps — critical for onboarding and offboarding compliance
Adaptive MFA uses contextual risk signals (location, device, behavior) to minimize friction while maintaining security
Industry-leading uptime and security track record — enterprise SLAs with 99.99% availability guarantee`,
    cons: `Pricing is complex and adds up quickly — SSO, MFA, and lifecycle management are separate SKUs with separate per-user costs
Implementation complexity requires dedicated IAM expertise — most enterprise deployments need a partner or dedicated admin team
Pricing is per-user across all products, making it expensive for large organizations compared to bundled alternatives like Microsoft Entra`,
    bestFor: 'Mid-market and enterprise organizations that need centralized identity management across a complex SaaS application portfolio — especially those requiring compliance with SOC 2, HIPAA, or ISO 27001 that mandate centralized access controls and audit logs',
    notFor: 'Small teams (under 50 users) where Auth0 or Supabase Auth provide adequate SSO at lower cost; organizations already on Microsoft 365 where Microsoft Entra (formerly Azure AD) is bundled and covers most needs',
    keyFeatures: `Single Sign-On: One login for all apps — SAML, OIDC, and legacy protocols with 7,000+ pre-built integrations
Adaptive MFA: Context-aware multi-factor authentication — only prompts when risk is elevated based on device, location, and behavior
Lifecycle Management: Automated provisioning and deprovisioning across all connected applications based on HR system data
Universal Directory: Central user store with custom attributes, group management, and attribute mapping
API Access Management: OAuth 2.0 authorization server for securing APIs and microservices
Workflows: No-code automation for identity events — onboarding checklists, access requests, and compliance workflows`,
    integrations: `Salesforce\nSlack\nMicrosoft 365\nGoogle Workspace\nZoom\nGitHub\nJira\nServiceNow\nWorkday\nSAP\nAWS\nAzure\nActive Directory\nZapier`,
    verdict: 'Okta is the right choice for enterprises that need centralized identity management with a mature governance, compliance, and audit trail. The 7,000+ pre-built integrations make it the fastest path to enterprise SSO across a complex app portfolio. For smaller organizations, the total per-user cost of SSO + MFA + lifecycle management can be significant — Microsoft Entra (bundled with Microsoft 365) or Auth0 are worth evaluating.',
    seoTitle: 'Okta: Pricing, Plans & Identity Management Features | TopToolsPick',
    seoDescription: 'Okta enterprise SSO and MFA from $2/user/month. See lifecycle management, adaptive MFA, and how Okta compares to Microsoft Entra and Auth0.',
  },
  {
    name: 'SendGrid',
    slug: 'sendgrid',
    categoryId: 'cmtzal7h30002hl6ccnboa82i', // marketing
    websiteUrl: 'https://sendgrid.com',
    logoUrl: `${CDN}/sendgrid.svg`,
    pricingModel: PricingModel.FREEMIUM,
    hasFreePlan: true,
    hasFreeTrial: false,
    rating: 4.2,
    editorialScore: 79,
    shortDescription: 'Email delivery API and marketing platform from Twilio — the most widely used infrastructure for transactional email at scale.',
    description: `SendGrid (now part of Twilio) is the leading email delivery platform, used by over 80,000 companies to send transactional emails (order confirmations, password resets, notifications) and marketing campaigns. It provides both an Email API for developer-driven transactional email and an Email Marketing tool for newsletter and campaign management.

The Email API is SendGrid's core product — a RESTful API and SMTP relay that handles email delivery at scale. Developers integrate it via SDK or SMTP to send transactional emails from their applications. SendGrid manages deliverability infrastructure: IP warming, reputation management, bounce handling, unsubscribe tracking, and compliance with email authentication protocols (SPF, DKIM, DMARC).

Email deliverability is SendGrid's primary value proposition: its dedicated IP addresses, domain authentication setup, and real-time analytics help emails reach inboxes rather than spam folders. Deliverability insights identify which emails are being filtered, by which mailbox providers, and why.

Email Marketing provides a drag-and-drop email builder, contact list management, segmentation, and automated campaign sending — similar to Mailchimp but aimed at companies already using SendGrid for transactional email who want to consolidate to one platform.

The free plan provides 100 emails/day indefinitely. Essentials ($19.95/month) provides 50,000 emails/month. Pro ($89.95/month) provides dedicated IP and advanced analytics. Twilio bundling makes SendGrid the natural choice for companies already using Twilio for SMS.`,
    pros: `Industry-leading email deliverability infrastructure — IP reputation management, domain authentication, and real-time analytics
Free plan (100 emails/day) is indefinite — useful for development and low-volume applications
REST API and SMTP relay make integration straightforward from any programming language or framework
Twilio ecosystem integration — consolidate SMS and email communications under one platform and contract`,
    cons: `Pricing scales steeply with volume — Pro with dedicated IP is $89.95/month before you reach significant volume
Email Marketing tool lags behind Mailchimp and Klaviyo in template design, automation, and segmentation features
Customer support quality has declined after the Twilio acquisition — response times are slow and documentation is inconsistent`,
    bestFor: 'Developers and product teams that need reliable transactional email delivery (order confirmations, password resets, notifications) at scale — especially those already using Twilio for other communications',
    notFor: 'Teams looking for a full-featured email marketing platform for newsletters and campaigns (Mailchimp or Klaviyo offer better UX for marketers); very high volume senders where Amazon SES is significantly cheaper per email',
    keyFeatures: `Email API: RESTful API and SMTP relay for sending transactional email from any application with SDKs in 7 languages
Deliverability Insights: Real-time analytics on delivery rates, open rates, bounce rates, and spam reports by mailbox provider
Domain Authentication: SPF, DKIM, and DMARC setup wizard that reduces spam filtering and improves sender reputation
Email Marketing: Drag-and-drop email builder, contact management, segmentation, and campaign automation
IP Warm-up: Automated IP warm-up schedule for new dedicated IPs — gradually builds sender reputation
Webhooks: Real-time event notifications for delivery, open, click, bounce, and unsubscribe events`,
    integrations: `Twilio\nSalesforce\nHubSpot\nShopify\nWooCommerce\nZapier\nMake\nWordPress\nMagento\nSegment\nStripe\nNetlify\nVercel`,
    verdict: 'SendGrid is the most widely used transactional email API for a reason — reliable deliverability, straightforward API, and a free tier make it the default choice for application developers. The email marketing product is adequate but not exceptional compared to dedicated platforms. For high-volume senders, Amazon SES is much cheaper per email. For teams already on Twilio, SendGrid is the obvious choice for email integration.',
    seoTitle: 'SendGrid: Pricing, Plans & Email API Features | TopToolsPick',
    seoDescription: 'SendGrid email API is free for 100 emails/day. Essentials from $19.95/month. See transactional email, deliverability, and how it compares to Mailchimp.',
  },
]

async function main() {
  for (const tool of tools) {
    const existing = await prisma.product.findUnique({ where: { slug: tool.slug } })
    if (existing) { console.log(`⏭  ${tool.name} already exists`); continue }
    await prisma.product.create({
      data: { ...tool, status: PublicationStatus.PUBLISHED }
    })
    console.log(`✓ Added ${tool.name}`)
  }
  console.log('\nBatch 5 complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
