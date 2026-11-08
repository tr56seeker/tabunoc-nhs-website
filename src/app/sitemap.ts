import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteMetadata";

const routes = [
  { path: "/", priority: 1 },
  { path: "/organization", priority: 0.7 },
  { path: "/learner-population", priority: 0.6 },
  { path: "/evacuation-map", priority: 0.5 },
  { path: "/citizen-charter", priority: 0.5 },
  { path: "/enrollment", priority: 0.8 },
  { path: "/shs-offerings", priority: 0.7 },
  { path: "/alumni", priority: 0.5 },
  { path: "/memos", priority: 0.6 },
  { path: "/school-calendar", priority: 0.6 },
  { path: "/faq", priority: 0.6 },
  { path: "/install", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    priority,
  }));
}
