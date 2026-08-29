import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  /**
   * The /api/og image route reads its fonts from `public/fonts/` at runtime.
   * On serverless (Vercel) those files only exist inside the function bundle
   * when explicitly traced — declare them so the OG card renders without
   * falling back to the (slow) Google Fonts CDN.
   */
  outputFileTracingIncludes: {
    "/api/og": ["./public/fonts/**/*"],
  },
};

export default nextConfig;
