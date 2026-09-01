import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * /apple-icon (180×180) — home-screen / bookmark icon, same "AG"
 * monogram language as the 32×32 favicon but with more breathing room
 * and a subtle emerald glow so it reads well at large sizes and on
 * iOS rounded-corner masking.
 */
export default async function AppleIcon() {
  let fonts: { name: string; data: ArrayBuffer; weight: 700; style: "normal" }[] = [];
  try {
    const buf = await readFile(
      path.join(process.cwd(), "public", "fonts", "inter-bold.ttf"),
    );
    fonts = [
      {
        name: "Inter",
        data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
        weight: 700,
        style: "normal",
      },
    ];
  } catch {
    // Font unavailable — Satori falls back to its built-in renderer.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d1411 0%, #0a0e0c 100%)",
          borderRadius: 40,
          border: "3px solid rgba(52, 211, 153, 0.35)",
          boxShadow: "0 0 60px rgba(16, 185, 129, 0.25)",
          color: "#34d399",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: 2,
          fontFamily: "Inter",
        }}
      >
        AG
      </div>
    ),
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    },
  );
}
