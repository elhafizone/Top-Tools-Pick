import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();
const TODAY = new Date("2026-10-04");
async function main() {
  await prisma.product.update({
    where: { slug: "nordvpn" },
    data: {
      name: "NordVPN",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/nordvpn.png",
      shortDescription: "Fast and secure VPN with 6,800+ servers in 111 countries, threat protection, double VPN, and a strict no-logs policy audited by independent firms.",
      description: "NordVPN is one of the most widely used VPN services, offering a combination of speed, security, and a large server network. It uses AES-256 encryption with NordLynx (WireGuard) by default for the fastest connections, while also supporting OpenVPN and IKEv2. Key security features include a kill switch, DNS leak protection, double VPN (traffic routed through two servers), Onion over VPN, and Threat Protection — a built-in tool that blocks malware, trackers, and intrusive ads without activating the VPN. NordVPN has undergone multiple independent no-logs audits by PwC and Deloitte, confirming it doesn't store user activity. One subscription covers up to 10 devices simultaneously across Windows, Mac, iOS, Android, Linux, and browser extensions. The Plus plan adds a password manager (NordPass) and data breach scanner; Ultimate adds 1TB encrypted cloud storage (NordLocker).",
      websiteUrl: "https://nordvpn.com",
      pricingModel: PricingModel.SUBSCRIPTION,
      hasFreePlan: false,
      hasFreeTrial: true,
      keyFeatures: [
        "6,800+ servers in 111 countries with NordLynx (WireGuard) for fast connections",
        "Threat Protection: blocks malware, trackers, and ads without turning on the VPN",
        "Double VPN and Onion over VPN for maximum anonymity",
        "Kill switch and DNS leak protection on all apps",
        "No-logs policy audited by PwC and Deloitte",
        "Up to 10 simultaneous device connections per account",
        "Meshnet: create a private encrypted network between your own devices",
      ].join("\n"),
      bestFor: "Privacy-conscious users, remote workers, and travelers who need reliable encryption, fast streaming performance, and verified no-logs assurance",
      notFor: "Users in countries with heavy VPN restrictions (China, Russia) where NordVPN may not work reliably without obfuscated servers, or those who need a completely free option",
      verdict: "NordVPN consistently ranks among the top VPNs for a reason: the server network is large, speeds are fast, and the no-logs policy has been independently verified multiple times. Threat Protection adds real value beyond basic VPN functionality. The 2-year plan brings the price to around $3/month, making it competitive. If you already use 1Password, the Plus plan's NordPass password manager is redundant — stick with Basic.",
      seoTitle: "NordVPN Review: Pricing, Features & Plans",
      seoDescription: "NordVPN review: fast VPN with 6,800+ servers, threat protection, and verified no-logs policy. Basic from $3.09/month (2-year plan), 30-day money-back guarantee.",
      lastReviewedAt: TODAY,
      pricingPlans: {
        deleteMany: {},
        create: [
          { name: "Basic", priceAmount: 3.09, currency: "USD", billingPeriod: "monthly (billed every 2 years)", priceLabel: "From $3.09/month (2-year plan)", description: "VPN on 10 devices, Threat Protection Lite, kill switch, 6,800+ servers in 111 countries, 30-day money-back guarantee.", sortOrder: 0 },
          { name: "Plus", priceAmount: 4.49, currency: "USD", billingPeriod: "monthly (billed every 2 years)", priceLabel: "From $4.49/month (2-year plan)", description: "Everything in Basic plus full Threat Protection (malware/ad blocker), NordPass password manager, and data breach scanner.", sortOrder: 1 },
          { name: "Ultimate", priceAmount: 6.39, currency: "USD", billingPeriod: "monthly (billed every 2 years)", priceLabel: "From $6.39/month (2-year plan)", description: "Everything in Plus plus 1TB NordLocker encrypted cloud storage.", sortOrder: 2 },
        ],
      },
    },
  });
  console.log("Done — NordVPN updated.");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
