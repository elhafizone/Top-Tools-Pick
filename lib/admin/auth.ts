import { cookies } from "next/headers";
import { adminCookieName, getAdminConfig, isValidAdminSession, safeEqual } from "@/lib/admin/session";

export { adminCookieName, createAdminSession, getAdminUsername, isValidAdminSession } from "@/lib/admin/session";

export function verifyAdminCredentials(username: string, password: string) {
  const config = getAdminConfig();
  // Both comparisons always run so the response time does not reveal which one failed.
  const usernameMatches = safeEqual(username, config.username);
  const passwordMatches = safeEqual(password, config.password);
  return usernameMatches && passwordMatches;
}

export async function requireAdmin() {
  const session = (await cookies()).get(adminCookieName)?.value;
  if (!isValidAdminSession(session)) throw new Error("Unauthorized");
}
