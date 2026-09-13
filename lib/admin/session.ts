import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const adminCookieName = "toptoolspick_admin";

export function getAdminConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !password || !secret) throw new Error("Admin authentication is not configured.");
  return { username, password, secret };
}

export function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

/** Constant-time equality for two arbitrary-length strings. */
export function safeEqual(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

/** Sessions are `<username>.<hmac>`; the username itself may contain dots. */
function splitSession(value: string) {
  const separator = value.lastIndexOf(".");
  if (separator <= 0 || separator === value.length - 1) return null;
  return { username: value.slice(0, separator), signature: value.slice(separator + 1) };
}

export function createAdminSession(username: string) {
  const { secret } = getAdminConfig();
  return { name: adminCookieName, value: `${username}.${sign(username, secret)}` };
}

export function isValidAdminSession(value?: string) {
  if (!value) return false;
  const parts = splitSession(value);
  if (!parts) return false;
  try {
    const config = getAdminConfig();
    return safeEqual(parts.signature, sign(parts.username, config.secret)) && safeEqual(parts.username, config.username);
  } catch {
    return false;
  }
}

export function getAdminUsername(value?: string) {
  if (!isValidAdminSession(value)) return null;
  return splitSession(value!)?.username ?? null;
}
