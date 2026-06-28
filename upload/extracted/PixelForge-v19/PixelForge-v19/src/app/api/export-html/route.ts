/**
 * PixelForge v19 — Download Improved Page
 * Returns the current iframe HTML as a downloadable .html file.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.html) {
    return NextResponse.json({ error: "Missing html" }, { status: 400 });
  }
  const html: string = body.html;
  const filename = body.filename || "pixelforge-improved.html";
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
