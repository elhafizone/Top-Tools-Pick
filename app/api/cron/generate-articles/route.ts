import { NextResponse } from "next/server";
import { generateOneArticle } from "@/lib/articles/generate";

export const dynamic = "force-dynamic";

/**
 * Hit by an external scheduler (Hostinger's hPanel Cron Jobs - there is no cron
 * runtime inside this Node app itself). No admin cookie exists in that context, so
 * this checks a shared secret instead of requireAdmin().
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
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requested = Number(new URL(request.url).searchParams.get("count")) || 1;
  const count = Math.min(Math.max(requested, 1), 3);

  const results = [];
  for (let i = 0; i < count; i++) {
    try {
      results.push(await generateOneArticle({}));
    } catch (error) {
      results.push({ status: "error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  }
  return NextResponse.json({ generated: results });
}
