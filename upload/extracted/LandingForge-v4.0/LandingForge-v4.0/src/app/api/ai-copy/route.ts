/**
 * LandingForge v4.0 — AI Copy Suggestions
 * ----------------------------------------
 * Generates short copy suggestions (headline, subhead, button label,
 * testimonial, FAQ answer, etc.) using z-ai-web-dev-sdk.
 *
 * Server-side only — the SDK must not run in the browser.
 */

import { NextRequest, NextResponse } from "next/server";

// Lazily import the SDK so we don't crash if it's not configured.
async function callSDK(prompt: string): Promise<string> {
  try {
    const mod = await import("z-ai-web-dev-sdk").catch(() => null);
    if (!mod) throw new Error("AI SDK not installed");
    // The SDK exports a default class or function — handle both
    const ZAI = (mod as any).default ?? (mod as any).ZAI;
    if (!ZAI) throw new Error("AI SDK export not found");
    const zai = await ZAI.create();
    const res = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a senior conversion copywriter. Output ONE concise marketing line. No quotes, no preamble, no explanation. Just the copy.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 120,
    });
    const text = res.choices?.[0]?.message?.content?.trim() ?? "";
    return text.replace(/^["'`]|["'`]$/g, "");
  } catch (e: any) {
    throw e;
  }
}

const FALLBACKS: Record<string, (ctx: any) => string> = {
  headline: (c) => `Build, ship, and grow — without the busywork`,
  subhead: (c) =>
    `The all-in-one platform that turns your team's ideas into shipped products. Set up in minutes, scale with confidence.`,
  eyebrow: (c) => `NEW • Now in beta`,
  title: (c) => `Everything you need to win`,
  subtitle: (c) =>
    `Powerful primitives that compose into any workflow you can imagine.`,
  quote: (c) =>
    `Within two weeks we'd replaced three tools and cut our reporting time in half. It just works.`,
  question: (c) => `How does pricing work as my team grows?`,
  answer: (c) =>
    `Pricing scales with usage. You can upgrade, downgrade, or cancel at any time — changes are prorated to the day.`,
  default: (c) => `Start free. Upgrade when you grow.`,
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { field, label, current, context } = body as {
    field: string;
    label: string;
    current: string;
    context?: { siteName?: string; fieldType?: string };
  };

  // Build a tight prompt
  const siteName = context?.siteName ?? "your product";
  const fieldType = context?.fieldType ?? "text";
  const isLong = fieldType === "textarea";

  const promptBits: string[] = [];
  if (field === "headline" || /headline/i.test(label)) {
    promptBits.push(
      `Write a punchy landing page headline for ${siteName}. Max 9 words.`
    );
  } else if (field === "subhead" || /subhead|subtitle/i.test(label)) {
    promptBits.push(
      `Write a one-sentence subhead for ${siteName} that supports the headline. Max 22 words.`
    );
  } else if (field === "eyebrow" || /eyebrow|kicker/i.test(label)) {
    promptBits.push(
      `Write a 2-4 word uppercase eyebrow label for a hero section of ${siteName}. Example: "NEW • v2.0".`
    );
  } else if (field === "title") {
    promptBits.push(`Write a 4-6 word section title for ${siteName}.`);
  } else if (field === "quote") {
    promptBits.push(
      `Write a 1-2 sentence customer testimonial quote for ${siteName}. Should sound authentic and specific.`
    );
  } else if (field === "question") {
    promptBits.push(
      `Write a FAQ question about ${siteName}. Should be specific and answerable in 2-3 sentences.`
    );
  } else if (field === "answer") {
    promptBits.push(
      `Write a 2-3 sentence answer to: "${current || `a question about ${siteName}`}". Friendly, specific, no fluff.`
    );
  } else if (field === "description") {
    promptBits.push(
      `Write a ${isLong ? "2-sentence" : "1-sentence"} description for a feature of ${siteName}.`
    );
  } else {
    promptBits.push(
      `Write marketing copy for the field "${label}" of ${siteName}. ${isLong ? "1-2 sentences." : "Max 8 words."}`
    );
  }
  if (current && current.trim().length > 0) {
    promptBits.push(`Current version (improve it): "${current}"`);
  }
  const prompt = promptBits.join("\n");

  try {
    const text = await callSDK(prompt);
    if (text && text.length > 0) {
      return NextResponse.json({ text });
    }
    throw new Error("Empty response");
  } catch (e: any) {
    // Fallback to a canned line so the UI keeps working
    const fallbackFn = FALLBACKS[field] ?? FALLBACKS.default;
    return NextResponse.json({
      text: fallbackFn(context ?? {}),
      warning: "AI service unavailable — showing a suggested template instead.",
    });
  }
}
