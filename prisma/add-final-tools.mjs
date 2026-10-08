import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const tools = [
  // Education & Courses (+3)
  { name:"Skillshare", slug:"skillshare", url:"https://www.skillshare.com", cat:"education-courses", short:"Creative skills learning platform.", desc:"An online learning community with thousands of classes in design, business, technology and creative arts.", pricing:"SUBSCRIPTION", rating:4.2, score:80, bestFor:"Creative professionals who want short, project-based classes in design, photography and business.", pros:"Affordable annual membership covering all classes; strong creative content.", cons:"No accredited certificates; quality varies by instructor.", free:false },
  { name:"MasterClass", slug:"masterclass", url:"https://www.masterclass.com", cat:"education-courses", short:"Learn from world-class experts.", desc:"An online learning platform where renowned experts teach their craft through cinematic video lessons.", pricing:"SUBSCRIPTION", rating:4.4, score:84, bestFor:"Learners who want inspiration and high-production storytelling from world-famous instructors.", pros:"Production quality is exceptional; unique access to top-tier instructors.", cons:"Lectures are passive; limited hands-on projects or certifications.", free:false },
  { name:"Duolingo", slug:"duolingo", url:"https://www.duolingo.com", cat:"education-courses", short:"Gamified language learning app.", desc:"The world's most-downloaded language learning app with gamified daily lessons across 40+ languages.", pricing:"FREEMIUM", rating:4.5, score:86, bestFor:"Beginners who want daily language practice through short, habit-forming exercises.", pros:"Free, gamified and engaging with a massive language selection.", cons:"Insufficient on its own for fluency; requires supplementary speaking practice.", free:true },

  // E-commerce (+3)
  { name:"ThriveCart", slug:"thrivecart", url:"https://thrivecart.com", cat:"e-commerce", short:"High-converting checkout pages.", desc:"A checkout platform and cart software for selling digital and physical products with upsells and affiliates.", pricing:"ONE_TIME", rating:4.4, score:85, bestFor:"Course creators and digital product sellers who want a one-time-fee checkout platform with high conversions.", pros:"Lifetime deal with no transaction fees; powerful upsell and affiliate management.", cons:"One-time cost is high; less polished than Stripe Checkout for developers.", free:false },
  { name:"Podia", slug:"podia", url:"https://www.podia.com", cat:"e-commerce", short:"Sell courses, memberships and downloads.", desc:"An all-in-one platform for selling digital products, online courses and memberships.", pricing:"FREEMIUM", rating:4.3, score:82, bestFor:"Creators who want a single platform to sell courses, downloads and memberships without multiple tools.", pros:"No transaction fees on paid plans; includes email marketing.", cons:"Design customisation is limited compared to dedicated course platforms.", free:true },
  { name:"Etsy", slug:"etsy", url:"https://www.etsy.com", cat:"e-commerce", short:"Marketplace for handmade and vintage.", desc:"A global marketplace for handmade, vintage and craft items connecting independent sellers with buyers.", pricing:"USAGE_BASED", rating:4.3, score:81, bestFor:"Independent creators of handmade, vintage or unique physical products looking for a ready-made audience.", pros:"Built-in audience of 90M+ buyers; low barrier to entry for new sellers.", cons:"Rising fees and increasing competition from mass-produced look-alikes.", free:true },

  // Design & Creative (+2)
  { name:"Framer", slug:"framer", url:"https://www.framer.com", cat:"design-creative", short:"Design and publish websites visually.", desc:"A visual web builder combining design-tool flexibility with production-ready publishing.", pricing:"FREEMIUM", rating:4.6, score:91, bestFor:"Designers and marketers who want to build and publish a real website directly from a design tool.", pros:"Design and publish in one tool; React components and CMS built in.", cons:"Less suited for complex, data-heavy web applications.", free:true },
  { name:"Rive", slug:"rive", url:"https://rive.app", cat:"design-creative", short:"Interactive motion graphics for apps.", desc:"An animation tool for creating interactive motion graphics that run natively in apps and websites.", pricing:"FREEMIUM", rating:4.6, score:91, bestFor:"Designers who want app-grade interactive animations that developers can implement without hand-coding.", pros:"Tiny file sizes and real-time interactivity beyond what Lottie can do.", cons:"Steeper learning curve than simpler animation tools.", free:true },

  // Website & Hosting (+2)
  { name:"Hostinger", slug:"hostinger", url:"https://www.hostinger.com", cat:"website-hosting", short:"Affordable web hosting for everyone.", desc:"A web hosting provider offering shared, WordPress, VPS and cloud hosting at competitive prices.", pricing:"SUBSCRIPTION", rating:4.3, score:83, bestFor:"Beginners and small businesses who need affordable, reliable hosting with a good control panel.", pros:"Very competitive pricing with good performance; hPanel is easy to navigate.", cons:"Renewal prices are higher than introductory rates.", free:false },
  { name:"DigitalOcean", slug:"digitalocean", url:"https://www.digitalocean.com", cat:"website-hosting", short:"Cloud infrastructure for developers.", desc:"A cloud provider offering simple, developer-friendly VPS (Droplets), managed databases and app hosting.", pricing:"USAGE_BASED", rating:4.6, score:91, bestFor:"Developers who want straightforward cloud infrastructure without the complexity of AWS or GCP.", pros:"Simple pricing, excellent documentation and a strong developer community.", cons:"Less feature-rich than AWS for enterprise workloads.", free:true },

  // Remote Work (+2)
  { name:"Tandem", slug:"tandem", url:"https://tandem.chat", cat:"remote-work", short:"Virtual office for remote teams.", desc:"A persistent virtual office app where remote teams can see who is available and jump into conversations instantly.", pricing:"SUBSCRIPTION", rating:4.1, score:76, bestFor:"Small remote teams who want spontaneous, office-like communication without scheduling every call.", pros:"Persistent presence gives remote work a more social, ambient feel.", cons:"Requires team adoption to be valuable; smaller user base than Slack.", free:false },
  { name:"Switchboard", slug:"switchboard", url:"https://switchboard.app", cat:"remote-work", short:"Collaborative canvas for async work.", desc:"A persistent room app for remote teams that keeps tools, tabs and documents open together for async collaboration.", pricing:"FREEMIUM", rating:4.2, score:79, bestFor:"Remote teams collaborating on shared documents and tools who want a shared, always-open workspace.", pros:"Persistent room state means no wasted time re-sharing context at the start of meetings.", cons:"Newer product with a smaller integration library.", free:true },
];

async function run() {
  const cats = await prisma.category.findMany({ select: { id: true, slug: true } });
  const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]));
  const existing = await prisma.product.findMany({ select: { slug: true } });
  const existingSlugs = new Set(existing.map(p => p.slug));

  let added = 0, skipped = 0;
  for (const t of tools) {
    if (existingSlugs.has(t.slug)) { skipped++; continue; }
    const catId = catMap[t.cat];
    if (!catId) { console.warn("Unknown category:", t.cat); continue; }
    await prisma.product.create({
      data: {
        name: t.name, slug: t.slug, shortDescription: t.short, description: t.desc,
        websiteUrl: t.url, categoryId: catId, pricingModel: t.pricing,
        rating: t.rating, editorialScore: t.score, featured: false,
        hasFreePlan: t.free, bestFor: t.bestFor, pros: t.pros, cons: t.cons,
        status: "PUBLISHED",
      },
    });
    added++;
  }
  console.log(`Done! Added: ${added}, Skipped: ${skipped}`);
  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
