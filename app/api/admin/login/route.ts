import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminCredentials } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/admin");
  if (!verifyAdminCredentials(username, password)) return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url));
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
  const response = NextResponse.redirect(new URL(safeNext, request.url));
  const session = createAdminSession(username);
  response.cookies.set(session.name, session.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
