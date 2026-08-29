import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdminAuthorized, NOINDEX_HEADERS } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/contact/messages[?limit=50]
 * Returns all stored contact messages, newest first.
 * Requires `Authorization: Bearer <PORTFOLIO_ADMIN_TOKEN>`.
 */
export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: NOINDEX_HEADERS }
    );
  }

  const url = new URL(request.url);
  const limit = Math.min(
    Math.max(1, Number(url.searchParams.get("limit") ?? "100") || 100),
    500
  );

  const messages = await db.message.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      projectType: true,
      body: true,
      read: true,
      createdAt: true,
    },
  });

  const unread = messages.filter((m) => !m.read).length;
  return NextResponse.json({
    ok: true,
    count: messages.length,
    unread,
    messages,
  }, { headers: NOINDEX_HEADERS });
}

const PatchSchema = z.object({
  id: z.string().min(1),
  read: z.boolean(),
});

/**
 * PATCH /api/contact/messages
 * Body: { id: string, read: boolean }
 * Toggles the read state of a stored message.
 */
export async function PATCH(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: NOINDEX_HEADERS }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400, headers: NOINDEX_HEADERS }
    );
  }

  const parsed = PatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 422, headers: NOINDEX_HEADERS }
    );
  }

  const updated = await db.message.update({
    where: { id: parsed.data.id },
    data: { read: parsed.data.read },
    select: { id: true, read: true },
  });

  return NextResponse.json({ ok: true, message: updated }, { headers: NOINDEX_HEADERS });
}
