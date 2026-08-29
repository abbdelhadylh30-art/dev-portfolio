/**
 * Tiny, dependency-free Markdown → HTML renderer.
 *
 * Scope is intentionally limited: it supports the subset of Markdown we
 * actually use in the "Now" section admin editor — headings (## / ###),
 * bold, italic, inline code, unordered lists (- or *), ordered lists
 * (1.), blockquotes (>), links [text](url), horizontal rules (---),
 * and paragraphs. Escapes HTML first so the input is safe to render
 * via dangerouslySetInnerHTML.
 *
 * This is NOT a fully-spec-compliant Markdown parser — it's a focused,
 * predictable, ~80-line renderer tuned for admin-authored portfolio
 * content.
 */

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderInline(input: string): string {
  let out = escapeHtml(input);
  // Inline code: `code`
  out = out.replace(/`([^`]+)`/g, (_, code) => {
    return `<code class="md-inline-code">${code}</code>`;
  });
  // Bold: **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic: *text* (but not ** which is bold)
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  // Links: [text](url)
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer noopener" class="md-link">$1</a>'
  );
  return out;
}

export function renderMarkdown(md: string): string {
  if (!md.trim()) return "";

  const lines = escapeHtml(md).split(/\r?\n/);
  const out: string[] = [];
  let i = 0;
  // After escapeHtml, original markdown chars like * and # are still intact
  // (they're not HTML-special), so we can match against the escaped text.

  let inUl = false;
  let inOl = false;
  let inQuote = false;

  const closeLists = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };
  const closeQuote = () => {
    if (inQuote) {
      out.push("</blockquote>");
      inQuote = false;
    }
  };

  // Helper: re-render inline using the raw (un-escaped) text. Since we
  // already escaped the lines, we need to render inline against the
  // escaped line — but escapeInline re-escapes inside the renderer too.
  // Simpler: revert escaping on this line, then call renderInline.
  // Because escapeHtml is idempotent on already-escaped text (it doesn't
  // double-escape &amp; back to &amp;amp;... actually it DOES), we use
  // the original text for inline rendering and let renderInline escape
  // appropriately. So we keep an "unescaped" copy via a parallel array.
  // To keep the implementation simple, we work with the escaped line
  // and just un-escape ampersands so renderInline's escapeHtml re-escapes
  // them back cleanly. Inline tags like <strong> need to remain escaped
  // (no < > in body text).

  // For inline rendering we need the *un-escaped* source — so we
  // re-derive it by reversing the most common escapeHtml mappings.
  // This is safe for our admin-authored content (no user input).
  const unescape = (s: string) =>
    s
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&");

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // Horizontal rule (---)
    if (/^---+$/.test(trimmed)) {
      closeLists();
      closeQuote();
      out.push('<hr class="md-rule" />');
      i++;
      continue;
    }

    // Heading
    const h = trimmed.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      closeLists();
      closeQuote();
      const level = h[1].length;
      const text = renderInline(unescape(h[2]));
      out.push(
        `<h${level} class="md-h md-h${level}">${text}</h${level}>`
      );
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("&gt;") || raw.trimStart().startsWith(">")) {
      // After escape, ">" becomes "&gt;". Allow either form.
      const content = trimmed.replace(/^&gt;\s?/, "").replace(/^>\s?/, "");
      if (!inQuote) {
        closeLists();
        inQuote = true;
        out.push('<blockquote class="md-quote">');
      }
      out.push(`<p>${renderInline(unescape(content))}</p>`);
      i++;
      continue;
    } else if (inQuote) {
      closeQuote();
    }

    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      if (!inUl) {
        closeQuote();
        inUl = true;
        out.push('<ul class="md-ul">');
      }
      const item = trimmed.replace(/^[-*]\s+/, "");
      out.push(`<li>${renderInline(unescape(item))}</li>`);
      i++;
      continue;
    } else if (inUl) {
      closeLists();
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      if (!inOl) {
        closeQuote();
        inOl = true;
        out.push('<ol class="md-ol">');
      }
      const item = trimmed.replace(/^\d+\.\s+/, "");
      out.push(`<li>${renderInline(unescape(item))}</li>`);
      i++;
      continue;
    } else if (inOl) {
      closeLists();
    }

    // Blank line
    if (trimmed === "") {
      closeLists();
      closeQuote();
      i++;
      continue;
    }

    // Paragraph (accumulate consecutive non-blank lines)
    closeLists();
    closeQuote();
    const para = [trimmed];
    let j = i + 1;
    while (
      j < lines.length &&
      lines[j].trim() !== "" &&
      !/^(#{2,3})\s+/.test(lines[j].trim()) &&
      !/^[-*]\s+/.test(lines[j].trim()) &&
      !/^\d+\.\s+/.test(lines[j].trim()) &&
      !/^---+$/.test(lines[j].trim()) &&
      !lines[j].trim().startsWith(">")
    ) {
      para.push(lines[j].trim());
      j++;
    }
    out.push(`<p class="md-p">${renderInline(unescape(para.join(" ")))}</p>`);
    i = j;
  }

  closeLists();
  closeQuote();
  return out.join("\n");
}
