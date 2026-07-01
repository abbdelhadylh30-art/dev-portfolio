import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import type { UserServices } from "@/lib/lead-profiler-types";

export const runtime = "nodejs";
export const maxDuration = 120;

const EXTRACTION_PROMPT = `You are reading a web page that the user claims is their portfolio, previous work, or business website.

Your job: extract what they actually sell and their real track record — to fill a user_services object for a lead-profiling tool. The tool uses this object as the ONLY source of honest social proof, so you must be strict about what you include.

## What to extract

1. **primary** — What is their primary service? One sentence. Be specific: "Custom web tools — landing pages, dashboards, functional apps" not just "websites".
2. **secondary** — Any secondary service line? (e.g., "Legal translation", "Content writing"). Empty string if none.
3. **past_work_examples** — A list of 3-8 specific, verifiable past work items. Each item should be ONE line, concrete, and include: what was built/done + for what kind of client + location if mentioned. Example: "Booking dashboard for a Riyadh dental clinic". Only include items that are LITERALLY on the page — do NOT invent or extrapolate. If the page lists case studies, portfolio items, client logos, or specific projects, extract those. If the page is vague ("we've helped many clients"), return an empty list.
4. **track_record** — One sentence summarizing years of experience, number of clients, or notable outcomes — ONLY if explicitly stated on the page. If the page says "10 years of experience" or "500+ clients", include that. If the page is vague, return: "Track record not specified on portfolio page — user should fill in manually."
5. **service_depth** — One sentence on what makes their work different, based on the page's own positioning. If the page says "we build real functional tools, not just landing pages", extract that. If the page is generic agency-speak, return: "Service depth not clearly differentiated on portfolio page."

## Critical rules

- ONLY extract what is LITERALLY on the page. Do NOT invent numbers, client names, or projects.
- If the page is a personal blog, social media profile, or non-portfolio page, still extract what you can but note it in track_record.
- If the page fails to load or is empty, return empty fields.
- past_work_examples MUST be concrete and verifiable. Vague entries like "various web projects" are forbidden — return empty list instead.
- The user will review and edit this before it's used. Your job is honest extraction, not marketing copy.

## Output

Return ONLY a valid JSON object with this exact schema. No prose, no markdown fences.

{
  "primary": "<one sentence>",
  "secondary": "<one sentence or empty string>",
  "past_work_examples": ["<concrete item 1>", "<concrete item 2>", ...],
  "track_record": "<one sentence>",
  "service_depth": "<one sentence>",
  "extraction_notes": "<one sentence on what you found — e.g. 'Extracted 5 case studies from portfolio page' or 'Page is a generic agency homepage with no specific case studies'>"
}`;

export async function POST(req: NextRequest) {
  try {
    const { url } = (await req.json()) as { url?: string };

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "URL must use http or https" }, { status: 400 });
    }

    // Fetch the page content
    const zai = await ZAI.create();
    const pageResult = await zai.functions.invoke("page_reader", { url: parsedUrl.href });

    if (!pageResult?.data?.html) {
      return NextResponse.json(
        { error: "Could not fetch page content. The page may be behind authentication, require JavaScript, or be blocking scrapers." },
        { status: 502 },
      );
    }

    const pageTitle = pageResult.data.title || "";
    const pageHtml = pageResult.data.html;

    // Convert HTML to plain text for the LLM
    const plainText = pageHtml
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 15000); // Cap at 15k chars to avoid token overflow

    // Use LLM to extract structured user_services
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: EXTRACTION_PROMPT },
        {
          role: "user",
          content: `URL: ${parsedUrl.href}\nPage title: ${pageTitle}\n\nPage content:\n${plainText}`,
        },
      ],
      thinking: { type: "disabled" },
    });

    const content = completion.choices?.[0]?.message?.content ?? "";
    if (!content) {
      return NextResponse.json({ error: "LLM returned empty response" }, { status: 502 });
    }

    // Parse the JSON (defensively strip code fences)
    let stripped = content.trim();
    if (stripped.startsWith("```")) {
      stripped = stripped
        .split("\n")
        .filter((l) => !l.trim().startsWith("```"))
        .join("\n")
        .trim();
    }

    let extracted: Partial<UserServices> & { extraction_notes?: string };
    try {
      extracted = JSON.parse(stripped);
    } catch {
      const start = stripped.indexOf("{");
      const end = stripped.lastIndexOf("}");
      if (start >= 0 && end > start) {
        extracted = JSON.parse(stripped.slice(start, end + 1));
      } else {
        return NextResponse.json(
          { error: "Could not parse LLM response as JSON", raw: stripped.slice(0, 500) },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      url: parsedUrl.href,
      page_title: pageTitle,
      extracted,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[read-portfolio] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
