import type { MetadataRoute } from "next";

/**
 * /manifest.webmanifest — PWA manifest. Gives browsers (and Android
 * "Add to home screen") the site's name, colors and icons, and makes
 * the brand render correctly when the site is installed or bookmarked.
 *
 * Colors follow the Developer skin (night-indigo background, moonlight
 * brand) — the identity the favicon already carries.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Abdelhady Gabriel — Web Developer",
    short_name: "Abdelhady",
    description:
      "Fixed-price websites and booking systems for businesses in Egypt and the Gulf. Fast, bilingual (Arabic + English), built to rank on Google.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0e0d19",
    theme_color: "#818cf8",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
