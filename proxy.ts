import { NextResponse, type NextRequest } from "next/server";
import { adminCookieName, isValidAdminSession } from "@/lib/admin/session";

const isPublicAdminPath = (pathname: string) => pathname === "/admin/login" || pathname === "/api/admin/login";

// Named `proxy` (not `middleware`) deliberately: in Next 16 middleware.ts still runs on the
// Edge runtime, where node:crypto is unavailable and the HMAC check below would fail.
// proxy.ts runs on Node.js.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (isPublicAdminPath(pathname)) return NextResponse.next();

  const session = request.cookies.get(adminCookieName)?.value;
  if (isValidAdminSession(session)) return NextResponse.next();

  // API callers get a machine-readable 401 rather than an HTML login page.
  if (pathname.startsWith("/api/admin")) {
    const unauthorized = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session) unauthorized.cookies.delete(adminCookieName);
    return unauthorized;
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  // 303 so a form POST that hits an expired session is replayed as a GET
  // instead of re-submitting its body (credentials included) to the login page.
  const response = NextResponse.redirect(loginUrl, { status: 303 });
  // Clear the invalid cookie, otherwise the user is stuck in a redirect/error loop.
  if (session) response.cookies.delete(adminCookieName);
  return response;
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
