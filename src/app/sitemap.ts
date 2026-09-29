import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/commerce";
import { HANDLES, SITE_URL, productPath } from "@/lib/store-config";

type Entry = MetadataRoute.Sitemap[number];

// Static marketing and policy routes. /checkout, /dev and /api are excluded
// (and disallowed in robots.ts). No lastModified: under Cache Components a
// `new Date()` here would stop the prerender, and a fake date helps no one.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/shop", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/shipping", priority: 0.6, changeFrequency: "monthly" },
  { path: "/freebies", priority: 0.6, changeFrequency: "monthly" },
  { path: "/bulk-orders", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/returns", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/accessibility", priority: 0.2, changeFrequency: "yearly" },
];

const LEAD_PRODUCTS = new Set<string>([HANDLES.nephiteChristmas, HANDLES.easterJourney, HANDLES.completeSet]);

const absolute = (path: string) => new URL(path, SITE_URL).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const images = new Map(products.map((p) => [p.handle, p.images[0]?.url]));

  const pages: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absolute(path),
    changeFrequency,
    priority,
  }));

  // Every configured handle, whether or not the catalog returned it.
  const productPages: MetadataRoute.Sitemap = Object.values(HANDLES).map((handle) => {
    const image = images.get(handle);
    return {
      url: absolute(productPath(handle)),
      changeFrequency: "weekly",
      priority: LEAD_PRODUCTS.has(handle) ? 0.9 : 0.7,
      ...(image ? { images: [absolute(image)] } : {}),
    };
  });

  return [...pages, ...productPages];
}
