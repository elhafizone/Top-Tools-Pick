import { recordSystemAudit } from "@/lib/admin/audit";
import { prisma } from "@/lib/db/prisma";

export interface FacebookPostParams {
  message: string;
  link?: string;
}

export interface FacebookPostResult {
  success: boolean;
  postId?: string;
  error?: string;
  skipped?: boolean;
}

/**
 * Direct first-party Meta Graph API client for Facebook Page publishing.
 * Strictly first-party: direct HTTP call to graph.facebook.com.
 * No Buffer, Zapier, Make, or any other third-party intermediary.
 */
export async function postToFacebookPage(params: FacebookPostParams): Promise<FacebookPostResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID || "61596248311349";
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!accessToken) {
    return {
      success: false,
      skipped: true,
      error: "FACEBOOK_PAGE_ACCESS_TOKEN is not configured in environment variables.",
    };
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    const formData = new URLSearchParams();
    formData.append("message", params.message);
    if (params.link) {
      formData.append("link", params.link);
    }
    formData.append("access_token", accessToken);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMsg = data.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error("[Facebook Auto-Publish] Graph API error:", data.error || data);
      return {
        success: false,
        error: errorMsg,
      };
    }

    const postId = String(data.id);

    // Record system audit log for full visibility in /admin/audit-log
    await recordSystemAudit("PUBLISH", "FacebookPost", postId, {
      messagePreview: params.message.slice(0, 120),
      link: params.link,
      pageId,
    }).catch(() => {});

    return {
      success: true,
      postId,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Network error";
    console.error("[Facebook Auto-Publish] Network error:", error);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Formats and publishes an article to Facebook Page.
 */
export async function publishArticleToFacebook(article: {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  topic?: string | null;
}): Promise<FacebookPostResult> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://toptoolspick.com";
  const link = `${baseUrl}/articles/${article.slug}`;

  const cleanExcerpt = article.excerpt ? `\n\n${article.excerpt}` : "";
  const topicTag = article.topic ? `#${article.topic.replace(/[^a-zA-Z0-9]/g, "")} ` : "";

  const message = `⚡ New on Top Tools Pick:\n\n${article.title}${cleanExcerpt}\n\n👉 Read the complete breakdown, pricing details & alternatives here:\n${link}\n\n#TopToolsPick #SoftwareReview #SaaS #TechStack ${topicTag}#BusinessSoftware`.trim();

  const result = await postToFacebookPage({ message, link });

  if (result.success && article.id) {
    // Record that this article has been shared to Facebook
    await recordSystemAudit("UPDATE", "ArticleSocialShare", article.id, {
      platform: "facebook",
      postId: result.postId,
      slug: article.slug,
    }).catch(() => {});
  }

  return result;
}

/**
 * Finds the next eligible published article that hasn't been posted to Facebook yet,
 * or the latest published article as fallback.
 */
export async function findNextArticleToPost(): Promise<{ id: string; title: string; slug: string; excerpt: string | null; topic: string | null } | null> {
  // Query recent published articles
  const publishedArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 30,
    select: { id: true, title: true, slug: true, excerpt: true, topic: true },
  });

  if (publishedArticles.length === 0) return null;

  // Find IDs already posted according to AuditLog
  const alreadyPostedLogs = await prisma.auditLog.findMany({
    where: {
      entityType: "ArticleSocialShare",
      action: "UPDATE",
    },
    select: { entityId: true },
  });

  const postedIds = new Set(alreadyPostedLogs.map((l) => l.entityId));

  // Pick the oldest unposted from recent articles, or latest as fallback
  const unposted = publishedArticles.find((a) => !postedIds.has(a.id));
  return unposted || publishedArticles[0];
}
