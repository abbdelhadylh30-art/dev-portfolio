import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const maxDuration = 180;

const AUDIT_PROMPT = `You are a content strategy analyst. The user has uploaded screenshots of a prospect's social media posts (Instagram, LinkedIn, Twitter/X, etc.). Your job is to audit the prospect's content and produce a structured analysis.

This audit is for a salesperson who is deciding whether to pitch this prospect and how to approach them. The analysis should surface:
- What the prospect's content strategy actually is
- What's working in their content
- What's missing or broken
- What gaps the salesperson's services could fill
- The prospect's brand voice (so the salesperson can mirror it)

## What to analyze

### 1. Content themes
What topics do they post about? Categorize their content into 3-5 themes (e.g., "educational tips," "behind-the-scenes," "product showcases," "personal stories," "promotional"). Estimate the percentage split.

### 2. Visual style
Describe the visual aesthetic: colors, photography style, design quality, consistency. Is it polished or raw? Professional or amateur? Branded or generic?

### 3. Posting strategy
- What content formats do they use? (carousel, single image, video/reel, text post, Stories)
- Do they have a consistent posting pattern or is it sporadic?
- Any visible content series or recurring formats?

### 4. Engagement patterns
- Comment volume visible (low/medium/high)
- Do they reply to comments? How? (warmly, formally, selectively, not at all)
- Any negative comments or complaints visible?
- User-generated content / tags from customers?

### 5. Brand voice
- Tone (formal/casual/playful/serious/inspirational/educational)
- Language register (MSA Arabic / dialect / English / mixed)
- Signature phrases or vocabulary they use repeatedly
- How they address their audience (habibi, friends, colleagues, etc.)

### 6. Gaps and opportunities
This is the most important section for the salesperson. Identify:
- What's missing from their content that competitors likely have?
- What operational pain points are visible in their content? (overwhelm, slow replies, no booking system, etc.)
- What digital presence gaps are visible? (no website link, no booking, no reviews)
- What services could a web tools builder offer them based on these gaps?

### 7. Sales approach recommendation
Based on everything above, recommend:
- Should the salesperson pitch this prospect? (yes/no/maybe + why)
- What angle should the pitch take?
- What's the prospect's likely pain point?
- What's the prospect's likely DiSC style (rough guess from content)?
- What language/register should the salesperson use in their first message?

## Critical rules

- ONLY report what you can LITERALLY SEE in the screenshots. Do NOT invent metrics, follower counts, or engagement rates unless visible.
- Quote actual caption text where possible — put quotes in "quotes".
- If you see Arabic text, transcribe accurately and translate in parentheses.
- Be honest about what you can't determine from the screenshots.
- The salesperson will use this to decide whether and how to pitch. Your job is honest analysis, not flattery.
- Do NOT recommend services that aren't relevant to what you see. If the prospect already has a great website and booking system, say so — don't invent gaps.

## Output

Return ONLY a valid JSON object with this exact schema. No prose, no markdown fences.

{
  "audit_confidence": "<high | medium | low>",
  "content_themes": [
    { "theme": "<name>", "estimated_percentage": "<number>", "example_post": "<one sentence describing a post in this theme>" }
  ],
  "visual_style": {
    "description": "<one paragraph>",
    "polish_level": "<polished | semi-polished | raw>",
    "consistency": "<consistent | inconsistent>",
    "colors_or_design_notes": "<one sentence>"
  },
  "posting_strategy": {
    "formats_used": ["<carousel>", "<single image>", "<reel/video>", "<text>", ...],
    "pattern": "<consistent | sporadic | campaign-based>",
    "recurring_series": ["<series 1 name>", ...]
  },
  "engagement_patterns": {
    "comment_volume": "<low | medium | high | cannot_determine>",
    "reply_behavior": "<one sentence>",
    "negative_comments_visible": "<yes | no>",
    "user_generated_content": "<yes | no | cannot_determine>"
  },
  "brand_voice": {
    "tone": "<one or two words>",
    "language_register": "<MSA | dialect | english | mixed>",
    "signature_phrases": ["<phrase 1>", "<phrase 2>"],
    "audience_address": "<how they address the audience>"
  },
  "gaps_and_opportunities": {
    "missing_content": ["<gap 1>", "<gap 2>"],
    "operational_pain_points": ["<pain 1>", "<pain 2>"],
    "digital_presence_gaps": ["<gap 1>", "<gap 2>"],
    "services_to_pitch": ["<service 1>", "<service 2>"]
  },
  "sales_recommendation": {
    "should_pitch": "<yes | no | maybe>",
    "why": "<one sentence>",
    "pitch_angle": "<one sentence>",
    "likely_pain_point": "<one sentence>",
    "rough_disc_style": "<D | i | S | C | Di | iS | SC | etc.>",
    "recommended_register": "<one sentence on tone/language for first message>"
  },
  "what_i_could_not_determine": ["<list of things not visible in screenshots>"]
}`;

interface ImageInput {
  dataUrl: string;
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { images?: ImageInput[] };

    if (!body.images || !Array.isArray(body.images) || body.images.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    if (body.images.length > 12) {
      return NextResponse.json({ error: "Maximum 12 images allowed" }, { status: 400 });
    }

    const zai = await ZAI.create();

    const content: Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }> = [
      { type: "text", text: AUDIT_PROMPT },
      {
        type: "text",
        text: `\n\nI am providing ${body.images.length} screenshot(s) of a prospect's social media posts. Audit the content per the schema above.\n\nScreenshot order:`,
      },
    ];

    for (const img of body.images) {
      content.push({ type: "text", text: `--- ${img.name} ---` });
      content.push({ type: "image_url", image_url: { url: img.dataUrl } });
    }

    const response = await zai.chat.completions.createVision({
      messages: [{ role: "user", content }],
      thinking: { type: "disabled" },
    });

    const content_text = response.choices?.[0]?.message?.content ?? "";
    if (!content_text) {
      return NextResponse.json({ error: "VLM returned empty response" }, { status: 502 });
    }

    let stripped = content_text.trim();
    if (stripped.startsWith("```")) {
      stripped = stripped
        .split("\n")
        .filter((l) => !l.trim().startsWith("```"))
        .join("\n")
        .trim();
    }

    let extracted: Record<string, unknown>;
    try {
      extracted = JSON.parse(stripped);
    } catch {
      const start = stripped.indexOf("{");
      const end = stripped.lastIndexOf("}");
      if (start >= 0 && end > start) {
        extracted = JSON.parse(stripped.slice(start, end + 1));
      } else {
        return NextResponse.json(
          { error: "Could not parse VLM response as JSON", raw: stripped.slice(0, 500) },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      images_analyzed: body.images.length,
      audit: extracted,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[prospect-content-audit] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
