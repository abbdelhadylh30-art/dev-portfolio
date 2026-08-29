import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized, NOINDEX_HEADERS } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/contact/messages/[id]
 * Permanently removes a stored contact message.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: NOINDEX_HEADERS }
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Missing id" },
      { status: 400, headers: NOINDEX_HEADERS }
    );
  }

  try {
    await db.message.delete({ where: { id } });
    return NextResponse.json({ ok: true, id }, { headers: NOINDEX_HEADERS });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Message not found or already deleted" },
      { status: 404, headers: NOINDEX_HEADERS }
    );
  }
}
