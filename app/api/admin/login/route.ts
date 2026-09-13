import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminCredentials } from "@/lib/admin/auth";

/**
 * Only same-origin, path-absolute targets are accepted. Backslashes are rejected
 * because WHATWG URL normalises them to "/", so "/\evil.com" would resolve off-site.
 */
function safeNextPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/admin";
  return value;
}

export async function POST(request: Request) {
  // 303 throughout: a login POST must be followed by a GET, never a body replay.
  try {
    const form = await request.formData();
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");
    const next = String(form.get("next") ?? "/admin");

    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), { status: 303 });
    }

    const response = NextResponse.redirect(new URL(safeNextPath(next), request.url), { status: 303 });
    const session = createAdminSession(username);
    response.cookies.set(session.name, session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch {
    // getAdminConfig() throws when the ADMIN_* env vars are missing on the server.
    return NextResponse.redirect(new URL("/admin/login?error=unavailable", request.url), { status: 303 });
  }
}
