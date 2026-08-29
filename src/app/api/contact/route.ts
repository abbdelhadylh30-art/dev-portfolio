import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { notifyContactEmail } from "@/lib/notify-email";

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

  // Email notification FIRST — server-side transport is Resend (used only
  // when RESEND_API_KEY is configured). When it isn't, the CLIENT delivers
  // via FormSubmit from the visitor's browser (see contact-form.tsx) after
  // this route has validated + rate-limited the submission.
  const notify = await notifyContactEmail({
    name,
    email,
    subject,
    projectType,
    body,
  });
  if (notify.provider !== "none" && !notify.ok) {
    console.warn(
      "[api/contact] email notification failed:",
      notify.provider,
      notify.detail
    );
  }

  // Then best-effort persistence for the local admin inbox (sandbox/dev).
  let persisted = false;
  let id: string | undefined;
  let createdAt: string | undefined;
  try {
    const message = await db.message.create({
      data: { name, email, subject: subject ?? "", projectType, body },
      select: { id: true, createdAt: true },
    });
    persisted = true;
    id = message.id;
    createdAt = message.createdAt.toISOString();
  } catch (err) {
    // Serverless deployments (e.g. Vercel) have no writable SQLite volume.
    // Fine — the email notification above is the production channel.
    console.warn("[api/contact] message not persisted (no writable db)", err);
  }

  // The message reached the owner if it was emailed OR persisted. Only
  // steer the visitor to WhatsApp when BOTH channels failed.
  const delivered = notify.ok || persisted;

  return NextResponse.json(
    {
      ok: true,
      persisted,
      emailed: notify.ok,
      ...(delivered ? {} : { fallback: "whatsapp" }),
      ...(id ? { id } : {}),
      ...(createdAt ? { createdAt } : {}),
    },
    { status: 201 }
  );
}

export async function GET() {
  // Lightweight health check — does not expose stored messages.
  return NextResponse.json({ ok: true, endpoint: "contact", method: "POST" });
}
