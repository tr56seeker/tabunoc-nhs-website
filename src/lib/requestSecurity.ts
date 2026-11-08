import { NextResponse } from "next/server";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function rejectCrossSiteMutation(request: Request) {
  if (SAFE_METHODS.has(request.method.toUpperCase())) {
    return null;
  }

  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return null;
  }

  try {
    const requestUrl = new URL(request.url);
    const allowedOrigins = new Set([requestUrl.origin]);
    const forwardedHost = request.headers
      .get("x-forwarded-host")
      ?.split(",")[0]
      .trim();
    const requestHost = forwardedHost || request.headers.get("host");
    const forwardedProtocol = request.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      .trim();

    if (requestHost) {
      allowedOrigins.add(
        `${forwardedProtocol || requestUrl.protocol.replace(":", "")}://${requestHost}`,
      );
    }

    if (!allowedOrigins.has(new URL(origin).origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

export function rejectInvalidJsonRequest(request: Request, maxBytes = 8_192) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  if (!contentType.startsWith("application/json")) {
    return NextResponse.json(
      { error: "This request must use JSON." },
      { status: 415 },
    );
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return NextResponse.json(
      { error: "The request is too large." },
      { status: 413 },
    );
  }

  return null;
}
