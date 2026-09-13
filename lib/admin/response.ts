import { NextResponse } from "next/server";

/**
 * Relative Location on purpose. Behind Hostinger's proxy `request.url` inside a route
 * handler is the internal bind address (http://0.0.0.0:3000), so `NextResponse.redirect`
 * sent browsers to an unreachable host. RFC 7231 permits a relative Location and every
 * browser resolves it against the current origin, which is what we want here.
 */
export function adminRedirect(path: string, status: 303 | 307 = 303) {
  return new NextResponse(null, { status, headers: { Location: path } });
}

/** Prisma P2002 = unique constraint violation, almost always a duplicate slug in this admin. */
function uniqueConstraintMessage(error: unknown) {
  if (typeof error !== "object" || error === null || !("code" in error) || (error as { code?: unknown }).code !== "P2002") return null;
  const target = (error as { meta?: { target?: unknown } }).meta?.target;
  const fields = Array.isArray(target) ? target.filter((value): value is string => typeof value === "string") : [];
  return fields.length ? `That ${fields.join(" + ")} is already in use.` : "That value is already in use.";
}

export function adminFormErrorResponse(request: Request, redirectPath: string, message: string, status: number) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return adminRedirect(`${redirectPath}?error=${encodeURIComponent(message)}`);
  }
  return NextResponse.json({ error: message }, { status });
}

export function adminErrorResponse(error: unknown, fallback: string, request?: Request, redirectPath?: string) {
  const duplicate = uniqueConstraintMessage(error);
  if (duplicate) {
    if (request && redirectPath && !request.headers.get("content-type")?.includes("application/json")) {
      return adminRedirect(`${redirectPath}?error=${encodeURIComponent(duplicate)}`);
    }
    return NextResponse.json({ error: duplicate }, { status: 409 });
  }
  const rawMessage = error instanceof Error ? error.message : "";
  const message = rawMessage === "Unauthorized" ||
    rawMessage.endsWith(" not found.") ||
    rawMessage.startsWith("Invalid publication transition:") ||
    rawMessage.startsWith("Published content requires") ||
    rawMessage.startsWith("Published stories require")
    ? rawMessage
    : fallback;
  if (request && redirectPath && !request.headers.get("content-type")?.includes("application/json")) {
    return adminRedirect(`${redirectPath}?error=${encodeURIComponent(message === "Unauthorized" ? fallback : message)}`);
  }
  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message.endsWith(" not found.")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (
      error.message.startsWith("Invalid publication transition:") ||
      error.message.startsWith("Published content requires") ||
      error.message.startsWith("Published stories require")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
  return NextResponse.json({ error: fallback }, { status: 500 });
}
