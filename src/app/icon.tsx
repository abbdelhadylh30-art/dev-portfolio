import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * /favicon (32×32) — the "AG" monogram on the dark Developer-skin
 * charcoal with the emerald brand mark. Served at /icon and wired into
 * <head> automatically by the App Router file convention.
 *
 * Uses the same bundled-font strategy as /api/og (public/fonts/inter-bold.ttf,
 * no runtime network dependency).
 */
export default async function Icon() {
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
          borderRadius: 7,
          border: "1px solid rgba(52, 211, 153, 0.35)",
          color: "#34d399",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 0.5,
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
