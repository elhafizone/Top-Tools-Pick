import { PrismaClient, PricingModel } from "@prisma/client";
const prisma = new PrismaClient();
const TODAY = new Date("2026-10-04");
type Plan = { name: string; priceAmount?: number | null; currency?: string; billingPeriod?: string | null; priceLabel: string; description?: string; sortOrder: number; };
const updates = [
  {
    slug: "descript",
    plans: [
      { name: "Free", priceAmount: 0, currency: "USD", billingPeriod: null, priceLabel: "Free forever", description: "1 hour of transcription per month, 1 watermarked video export, 5GB storage, text-based editing, overdub (1 min), screen recording.", sortOrder: 0 },
      { name: "Hobbyist", priceAmount: 12, currency: "USD", billingPeriod: "monthly (billed annually)", priceLabel: "$12/month (billed annually)", description: "10 hours of transcription/month, unlimited watermark-free exports, AI features, 10GB storage, screen recording, 1 speaker per project.", sortOrder: 1 },
      { name: "Creator", priceAmount: 24, currency: "USD", billingPeriod: "monthly (billed annually)", priceLabel: "$24/month (billed annually)", description: "30 hours of transcription/month, 1TB storage, multi-track editing, Overdub voice cloning, podcast editing, remove filler words, and AI tools.", sortOrder: 2 },
      { name: "Business", priceAmount: 40, currency: "USD", billingPeriod: "per person/month (billed annually)", priceLabel: "$40/person/month (billed annually)", description: "Unlimited transcription, 1TB storage per person, team collaboration, advanced AI, custom Overdub voices, and priority support.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Descript",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/descript.png",
      shortDescription: "AI-powered podcast and video editing tool where you edit audio and video by editing text — automatically remove filler words, silences, and create clips.",
      description: "Descript is an AI-powered audio and video editing platform that takes a text-first approach: it automatically transcribes your recording and lets you edit the media by editing the transcript. Delete a word in the transcript and the corresponding audio/video is cut. This makes podcast editing accessible to non-technical creators and dramatically faster for experienced editors. Key AI features include Underlord (Descript's AI suite) for automatic filler word removal, silence trimming, background noise removal, eye contact correction (simulates looking at the camera), and AI green screen. Overdub lets you clone your own voice to fix mistakes by typing — if you mispronounce a word, type the correction and Descript regenerates it in your voice. The Screen Recorder captures screen, webcam, or both for tutorial creation. Descript also includes a publishing layer: create clips for social media with auto-captions, and publish directly to podcast hosting platforms or YouTube. It competes with traditional tools like Adobe Audition and Final Cut Pro for podcasters and video creators who prioritize ease of use over maximum technical control.",
      websiteUrl: "https://www.descript.com",
      pricingModel: PricingModel.FREEMIUM,
      hasFreePlan: true,
      hasFreeTrial: false,
      keyFeatures: [
        "Text-based editing: edit audio/video by editing the auto-generated transcript",
        "AI filler word removal (um, uh, like) and silence removal with one click",
        "Overdub: clone your voice to fix errors by typing corrections",
        "Eye contact correction: AI makes the speaker appear to look at the camera",
        "AI background noise removal and audio enhancement",
        "Screen recorder for tutorials with webcam overlay",
        "Auto-captions for social clips, direct publishing to podcast platforms and YouTube",
      ].join("\n"),
      bestFor: "Podcasters, YouTubers, and course creators who want to edit audio and video without learning a traditional timeline editor — especially useful for removing filler words and fixing verbal mistakes",
      notFor: "Professional video editors who need frame-accurate multi-track editing, color grading, or effects — Adobe Premiere Pro or DaVinci Resolve are more powerful for complex productions",
      verdict: "Descript is the most innovative editing tool for spoken-word content. Text-based editing alone saves hours per episode for podcasters. The Overdub voice cloning is genuinely impressive for fixing small mistakes. The Creator plan at $24/month is the right entry point for anyone producing regular podcast or video content. The main limitation is that complex video projects with multiple cameras or heavy effects still need a traditional editor.",
      seoTitle: "Descript Review: Pricing, Features & Plans",
      seoDescription: "Descript review: AI video and podcast editor with text-based editing and voice cloning. Free plan available, Creator from $24/month. Auto filler word removal and transcription.",
      lastReviewedAt: TODAY,
    },
  },
  {
    slug: "hostinger",
    plans: [
      { name: "Premium Shared", priceAmount: 2.99, currency: "USD", billingPeriod: "monthly (introductory)", priceLabel: "From $2.99/month (introductory price)", description: "100 websites, 100GB SSD storage, unlimited bandwidth, free SSL, free domain for 1 year, weekly backups, email hosting.", sortOrder: 0 },
      { name: "Business Shared", priceAmount: 3.99, currency: "USD", billingPeriod: "monthly (introductory)", priceLabel: "From $3.99/month (introductory price)", description: "100 websites, 200GB SSD, unlimited bandwidth, daily backups, free domain, enhanced performance, and priority support.", sortOrder: 1 },
      { name: "Cloud Startup", priceAmount: 9.99, currency: "USD", billingPeriod: "monthly (introductory)", priceLabel: "From $9.99/month (introductory price)", description: "Managed cloud hosting with 300 websites, 200GB NVMe SSD, 3GB RAM, daily backups, advanced CDN, and dedicated resources.", sortOrder: 2 },
      { name: "VPS", priceAmount: 4.99, currency: "USD", billingPeriod: "monthly", priceLabel: "From $4.99/month (VPS hosting)", description: "Full root access, unmanaged or with Kodee AI assistant, 1-8 vCPU, 4-32GB RAM, 20-400GB NVMe SSD, multiple OS options.", sortOrder: 3 },
    ] as Plan[],
    data: {
      name: "Hostinger",
      logoUrl: "https://cdn.jsdelivr.net/gh/elhafizone/Top-Tools-Pick@main/public/tool-logos/hostinger.png",
      shortDescription: "Budget-friendly web hosting with fast NVMe SSD servers, free domain and SSL, a custom hPanel control panel, and AI website builder — used by 3 million customers worldwide.",
      description: "Hostinger is one of the world's largest web hosting providers, serving over 3 million customers in 178 countries. It's best known for aggressively priced shared hosting plans that offer solid performance relative to cost, making it a top pick for first-time website owners, bloggers, and small businesses. The custom hPanel control panel is simpler and faster than the industry-standard cPanel, and it includes the Kodee AI assistant for help with hosting tasks. Hostinger's AI Website Builder can generate a complete website from a short description in minutes. Performance is backed by LiteSpeed web servers, NVMe SSD storage, and Cloudflare CDN integration. The WordPress-specific plans include auto-install, managed updates, and optimized caching. Shared hosting introductory prices are heavily discounted — prices renew higher (typically 2-3x) after the initial term, which is the most common complaint about the platform. Cloud and VPS plans are fairly priced with steady renewal rates. Hostinger also runs Niagahoster and 000webhost under the same parent company.",
      websiteUrl: "https://www.hostinger.com",
      pricingModel: PricingModel.SUBSCRIPTION,
      hasFreePlan: false,
      hasFreeTrial: false,
      keyFeatures: [
        "LiteSpeed web servers with NVMe SSD storage for fast page load times",
        "Custom hPanel control panel with Kodee AI assistant for hosting help",
        "AI Website Builder: generate a complete site from a text description",
        "Free domain for 1 year and free SSL on all plans",
        "WordPress-optimized hosting with auto-install, updates, and caching",
        "Daily or weekly automated backups depending on plan",
        "VPS hosting with full root access and multiple Linux OS options",
      ].join("\n"),
      bestFor: "Beginners, bloggers, and small business owners who want affordable, fast shared hosting with easy WordPress installation and a simple control panel",
      notFor: "High-traffic websites, e-commerce stores with demanding performance requirements, or developers who need root access and precise server control — VPS or dedicated hosting is more appropriate",
      verdict: "Hostinger offers the best price-to-performance ratio in the shared hosting market. At $3-4/month introductory price, it's genuinely fast for shared hosting. The main caveat is renewal pricing — lock in a 2-4 year term upfront to avoid the higher renewal rates. For developers wanting more control at a reasonable price, the $5/month VPS is a better long-term choice than shared hosting.",
      seoTitle: "Hostinger Review: Pricing, Features & Plans",
      seoDescription: "Hostinger review: affordable web hosting with NVMe SSD, free domain and SSL, AI website builder. Shared hosting from $2.99/month intro price. WordPress hosting included.",
      lastReviewedAt: TODAY,
    },
  },
];
async function main() {
  let updated = 0;
  for (const { slug, data, plans } of updates) {
    try {
      await prisma.product.update({ where: { slug }, data: { ...data, pricingPlans: { deleteMany: {}, create: plans } } });
      console.log(`  ✓ ${slug}`);
      updated++;
    } catch (e: unknown) {
      console.error(`  ✗ ${slug}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  console.log(`\nDone — ${updated}/${updates.length}`);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
