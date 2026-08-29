import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const PROJECT_TYPES = [
  "New site",
  "Redesign",
  "Web app",
  "Free audit",
  "Other",
] as const;

const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(160),
  subject: z
    .string()
    .trim()
    .max(200, "Subject is too long")
    .optional()
    .or(z.literal("")),
  projectType: z
    .enum(PROJECT_TYPES)
    .optional()
    .default("Other"),
  body: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long (max 5000 characters)"),
  // Honeypot: must be empty. Bots tend to fill every field.
  website: z.string().max(0, "Spam detected").optional().default(""),
});

export async function POST(request: Request) {
  // Rate limit: 3 submissions per IP per 60s.
  const ip = getClientIp(request);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many messages. Please try again in ${rl.retryAfter}s.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfter) },
      }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const { name, email, subject, projectType, body } = parsed.data;

  try {
    const message = await db.message.create({
      data: { name, email, subject: subject ?? "", projectType, body },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json(
      { ok: true, persisted: true, id: message.id, createdAt: message.createdAt },
      { status: 201 }
    );
  } catch (err) {
    // Serverless deployments (e.g. Vercel) have no writable SQLite volume:
    // the message can't be persisted. Degrade gracefully — tell the client
    // it was received but unpersisted so the UI can steer the visitor to
    // WhatsApp (the primary "fastest reply" channel) instead of failing.
    console.error("[api/contact] failed to persist message", err);
    return NextResponse.json(
      {
        ok: true,
        persisted: false,
        fallback: "whatsapp",
      },
      { status: 201 }
    );
  }
}

export async function GET() {
  // Lightweight health check — does not expose stored messages.
  return NextResponse.json({ ok: true, endpoint: "contact", method: "POST" });
}
