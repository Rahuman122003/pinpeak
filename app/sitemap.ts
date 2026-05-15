import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://pinpeak.app";
  return [
    { url: SITE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];
}
