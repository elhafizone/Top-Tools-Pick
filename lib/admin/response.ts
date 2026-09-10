import { NextResponse } from "next/server";

export function adminFormErrorResponse(request: Request, redirectPath: string, message: string, status: number) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.redirect(new URL(`${redirectPath}?error=${encodeURIComponent(message)}`, request.url));
  }
  return NextResponse.json({ error: message }, { status });
}

export function adminErrorResponse(error: unknown, fallback: string, request?: Request, redirectPath?: string) {
  const rawMessage = error instanceof Error ? error.message : "";
  const message = rawMessage === "Unauthorized" ||
    rawMessage.endsWith(" not found.") ||
    rawMessage.startsWith("Invalid publication transition:") ||
    rawMessage.startsWith("Published content requires") ||
    rawMessage.startsWith("Published stories require")
    ? rawMessage
    : fallback;
  if (request && redirectPath && !request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.redirect(new URL(`${redirectPath}?error=${encodeURIComponent(message === "Unauthorized" ? fallback : message)}`, request.url));
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
