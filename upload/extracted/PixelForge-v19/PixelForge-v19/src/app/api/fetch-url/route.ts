/**
 * PixelForge v19 — Server-side URL fetch (CORS-safe proxy)
 *
 * Live mode in the original v19 just opened the URL in the iframe directly
 * (works for same-origin only). Fetch mode pulled HTML via a server-side
 * proxy. Here we expose both:
 *   - live: client opens iframe with the URL directly (will be CORS-blocked for many sites)
 *   - fetch: client calls /api/fetch-url?url=... and we proxy server-side
 *
 * The proxy strips script tags and event handlers for safety.
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "Only http/https URLs allowed" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(parsed.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PixelForge/19.0; +https://github.com/pixelforge)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return NextResponse.json(
        { error: `Fetch failed: ${res.status} ${res.statusText}` },
        { status: 502 }
      );
    }
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return NextResponse.json(
        { error: `URL did not return HTML (got ${contentType || "unknown"})` },
        { status: 415 }
      );
    }
    const raw = await res.text();
    const sanitized = sanitize(raw);
    return NextResponse.json({
      url: parsed.toString(),
      finalUrl: res.url || parsed.toString(),
      html: sanitized,
      size: sanitized.length,
    });
  } catch (e: any) {
    if (e?.name === "AbortError") {
      return NextResponse.json({ error: "Fetch timed out (>12s)" }, { status: 504 });
    }
    return NextResponse.json(
      { error: `Fetch failed: ${e?.message ?? "unknown error"}` },
      { status: 502 }
    );
  }
}

function sanitize(html: string): string {
  // Strip <script> tags entirely
  let out = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  // Remove on* event handlers
  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // Replace javascript: URLs with #
  out = out.replace(/(href|src)\s*=\s*("javascript:[^"]*"|'javascript:[^']*')/gi, '$1="#"');
  // Strip <iframe> (we already sandbox, but defense in depth)
  // Keep iframes — they may be embedded content
  return out;
}
