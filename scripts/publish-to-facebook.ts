// Publishes the latest or specified article directly to the Facebook Page via Meta Graph API.
// Strictly first-party: no Buffer, Zapier, Make, or third-party service required.
//
// Usage:
//   npx tsx --env-file=.env.local scripts/publish-to-facebook.ts [--slug=<article-slug>] [--test]
import { findNextArticleToPost, publishArticleToFacebook, postToFacebookPage } from "../lib/social/facebook";
import { prisma } from "../lib/db/prisma";

const isTest = process.argv.includes("--test");
const slugArg = process.argv.find((arg) => arg.startsWith("--slug="));
const customSlug = slugArg ? slugArg.split("=")[1] : null;

async function main() {
  console.log("🔍 Checking Facebook credentials...");
  const pageId = process.env.FACEBOOK_PAGE_ID || "61596248311349";
  const hasToken = Boolean(process.env.FACEBOOK_PAGE_ACCESS_TOKEN);

  console.log(`- Page ID: ${pageId}`);
  console.log(`- Page Access Token configured: ${hasToken ? "YES" : "NO (missing in env)"}`);

  if (isTest) {
    console.log("\n🧪 Running in TEST mode (posting a quick test ping)...");
    const result = await postToFacebookPage({
      message: `⚡ Top Tools Pick System Verification (${new Date().toISOString()})\n\nFirst-party automation test: verified connection directly via Meta Graph API.`,
      link: "https://toptoolspick.com",
    });
    console.log("Result:", result);
    return;
  }

  let article;
  if (customSlug) {
    article = await prisma.article.findUnique({
      where: { slug: customSlug },
      select: { id: true, title: true, slug: true, excerpt: true, topic: true },
    });
    if (!article) {
      console.error(`❌ Article with slug "${customSlug}" not found.`);
      process.exitCode = 1;
      return;
    }
  } else {
    article = await findNextArticleToPost();
    if (!article) {
      console.log("ℹ️ No published articles found to post.");
      return;
    }
  }

  console.log(`\n📰 Publishing article: "${article.title}" (/articles/${article.slug})...`);
  const result = await publishArticleToFacebook(article);

  if (result.success) {
    console.log(`✅ Successfully published to Facebook! Post ID: ${result.postId}`);
  } else if (result.skipped) {
    console.log(`⚠️ Skipped: ${result.error}`);
  } else {
    console.error(`❌ Failed: ${result.error}`);
    process.exitCode = 1;
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
