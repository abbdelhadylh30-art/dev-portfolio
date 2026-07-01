/**
 * PixelForge v19 — AI Copy Suggestions
 * Generates headline / CTA / subhead / FAQ / testimonial copy via z-ai-web-dev-sdk.
 * Server-side only.
 */

import { NextRequest, NextResponse } from "next/server";

const TYPE_PROMPTS: Record<string, string> = {
  headline: "Write a punchy landing page headline (max 9 words). Lead with a specific, measurable benefit.",
  subhead: "Write a one-sentence landing page subhead that supports the headline (max 22 words).",
  cta: "Write a concise call-to-action button label (2-5 action words). Examples: 'Start Free', 'Get Yours Now'.",
  eyebrow: "Write a 2-4 word uppercase eyebrow/kicker label for a hero section. Example: 'NEW • v2.0'.",
  testimonial: "Write a 1-2 sentence customer testimonial quote for a SaaS landing page. Should sound authentic and specific.",
  faq_question: "Write a FAQ question about a SaaS product. Should be specific and answerable in 2-3 sentences.",
  faq_answer: "Write a 2-3 sentence answer to: '%s'. Friendly, specific, no fluff.",
  value_prop: "Write a value proposition statement (1-2 sentences) that emphasizes measurable outcomes.",
  button: "Write a short button label (2-4 words) that prompts an action.",
};

const FALLBACKS: Record<string, string> = {
  headline: "Build Better Landing Pages 3x Faster with PixelForge",
  subhead: "Audit any page in seconds. Get actionable fixes. Ship a higher-converting page today.",
  cta: "Start Free",
  eyebrow: "NEW • v4.0",
  testimonial: "PixelForge caught 17 issues we'd missed for months. Our conversion rate jumped 22% in two weeks.",
  faq_question: "How does PixelForge's scoring work?",
  faq_answer: "PixelForge analyzes your page across 5 categories (SEO, Content, Accessibility, Structure, Performance) using 30+ rules based on Google Lighthouse and WCAG guidelines. Each category is weighted to total 120 points, scaled to a 0-100 score.",
  value_prop: "Cut your audit time from hours to seconds. PixelForge finds every issue, prioritizes by impact, and gives you one-click fixes.",
  button: "Get Started",
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { type, current, context } = body as {
    type: string;
    current?: string;
    context?: { siteName?: string; field?: string };
  };

  const typeKey = type in TYPE_PROMPTS ? type : "headline";
  let prompt = TYPE_PROMPTS[typeKey];
  if (typeKey === "faq_answer" && current) {
    prompt = prompt.replace("%s", current);
  }
  const siteName = context?.siteName || "your product";
  prompt += `\n\nContext: This is for ${siteName}.`;
  if (current && typeKey !== "faq_answer") {
    prompt += `\nCurrent version (improve it): "${current}"`;
  }
  prompt += "\n\nOutput ONLY the copy. No quotes, no preamble, no explanation.";

  try {
    const mod = await import("z-ai-web-dev-sdk").catch(() => null);
    if (!mod) throw new Error("AI SDK not installed");
    const ZAI = (mod as any).default ?? (mod as any).ZAI;
    if (!ZAI) throw new Error("AI SDK export not found");
    const zai = await ZAI.create();
    const res = await zai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a senior conversion copywriter. Output ONE concise marketing line. No quotes, no preamble." },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 150,
    });
    const text = (res.choices?.[0]?.message?.content || "").trim().replace(/^["'`]|["'`]$/g, "");
    if (text) {
      return NextResponse.json({ text });
    }
    throw new Error("Empty AI response");
  } catch (e: any) {
    return NextResponse.json({
      text: FALLBACKS[typeKey] || FALLBACKS.headline,
      warning: "AI service unavailable — showing a curated fallback. Try again later.",
    });
  }
}
