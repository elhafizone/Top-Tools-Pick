import { NextResponse } from "next/server";
import { findNextArticleToPost, publishArticleToFacebook } from "@/lib/social/facebook";

export const dynamic = "force-dynamic";

/**
 * Triggered by an external scheduler (e.g., Hostinger's hPanel Cron Jobs).
 * Uses CRON_SECRET shared secret instead of session cookie.
 */
function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const query = new URL(request.url).searchParams.get("secret");
  return bearer === secret || query === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const article = await findNextArticleToPost();

    if (!article) {
      return NextResponse.json({
        status: "skipped",
        message: "No published articles available to post.",
      });
    }

    const result = await publishArticleToFacebook(article);

    if (result.skipped) {
      return NextResponse.json({
        status: "skipped",
        message: result.error,
        article: { slug: article.slug, title: article.title },
      });
    }

    if (!result.success) {
      return NextResponse.json(
        {
          status: "error",
          error: result.error,
          article: { slug: article.slug, title: article.title },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "published",
      postId: result.postId,
      article: {
        slug: article.slug,
        title: article.title,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
