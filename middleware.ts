import { NextResponse, type NextRequest } from "next/server";
const adminCookieName = "toptoolspick_admin";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/api/admin")) return NextResponse.next();
  if (request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/api/admin/login") return NextResponse.next();
  if (!request.cookies.get(adminCookieName)?.value) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
