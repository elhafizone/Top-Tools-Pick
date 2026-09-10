import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminCookieName = "toptoolspick_admin";

function getConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !password || !secret) throw new Error("Admin authentication is not configured.");
  return { username, password, secret };
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function verifyAdminCredentials(username: string, password: string) {
  const config = getConfig();
  return username === config.username && password === config.password;
}

export function createAdminSession(username: string) {
  const { secret } = getConfig();
  const value = `${username}.${sign(username, secret)}`;
  return { name: adminCookieName, value };
}

export function isValidAdminSession(value?: string) {
  if (!value) return false;
  const [username, signature] = value.split(".");
  if (!username || !signature) return false;
  try {
    const expected = sign(username, getConfig().secret);
    return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) && username === getConfig().username;
  } catch {
    return false;
  }
}

export function getAdminUsername(value?: string) {
  if (!isValidAdminSession(value)) return null;
  return value?.split(".")[0] ?? null;
}

export async function requireAdmin() {
  const session = (await cookies()).get(adminCookieName)?.value;
  if (!isValidAdminSession(session)) throw new Error("Unauthorized");
}
