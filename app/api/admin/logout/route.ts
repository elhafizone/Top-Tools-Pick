import { adminCookieName } from "@/lib/admin/auth";
import { adminRedirect } from "@/lib/admin/response";

export async function POST() {
  const response = adminRedirect("/admin/login");
  response.cookies.set(adminCookieName, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
