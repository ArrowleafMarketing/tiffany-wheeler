import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static shell + 'use cache' (Partial Prerendering). Pages ship from the CDN;
  // per-visitor pieces (cart) load on the client.
  cacheComponents: true,
  cacheLife: {
    // Season/delivery dates: short enough that pages roll over soon after
    // midnight MT; the daily cron (/api/revalidate/season) makes it exact.
    season: { stale: 300, revalidate: 900, expire: 3600 },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85, 90],
    // 512 fills the gap between 384 and 640 (small covers on 3x phones).
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 512],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" },
    ],
  },
  experimental: {
    // Paid-social visitors arrive with a cold cache: inline the (small) Tailwind
    // CSS to save a render-blocking round trip.
    inlineCss: true,
  },
  async redirects() {
    // Legacy WooCommerce URLs -> new routes. Specific URLs first, then renamed
    // handles, then the catch-all for slugs that stayed the same.
    const renamed: Record<string, string> = {
      "nephite-christmas-easter-journey-book-bundle": "complete-set",
      "nephite-christmas-coloring-and-activity-book": "nephite-christmas-coloring-activity-book",
      "nephite-christmas-pdf-download": "nephite-christmas-pdf",
      "easter-journey-pdf-download": "easter-journey-pdf",
      "nephite-christmas-digital-bundle-pdf-download": "nephite-christmas-digital-bundle",
      "the-promised-messiah-an-easter-journey-puzzle-of-the-savior": "easter-journey-puzzle",
      "he-spoke-my-name-8-x-10-canvas-print": "he-spoke-my-name-canvas",
    };
    return [
      {
        source: "/product/nephite-christmas-coloring-and-activity-book-pdf-download",
        destination: "/products/nephite-christmas-coloring-activity-book?format=pdf",
        permanent: true,
      },
      // Wholesale products (retailers with old links) -> the wholesale inquiry.
      { source: "/product/:slug(.*wholesale.*)", destination: "/bulk-orders#wholesale", permanent: true },
      ...Object.entries(renamed).map(([from, to]) => ({
        source: `/product/${from}`,
        destination: `/products/${to}`,
        permanent: true,
      })),
      { source: "/product/:slug", destination: "/products/:slug", permanent: true },
      { source: "/about-the-author", destination: "/about", permanent: true },
      { source: "/contact-the-author", destination: "/contact", permanent: true },
      { source: "/home/freebies", destination: "/freebies", permanent: true },
      { source: "/refund_returns", destination: "/returns", permanent: true },
      { source: "/product-category/:path*", destination: "/shop", permanent: true },
      { source: "/product-tag/:path*", destination: "/shop", permanent: true },
      { source: "/nephite-christmas", destination: "/products/nephite-christmas", permanent: true },
      { source: "/the-nephite-christmas-collection", destination: "/products/nephite-christmas", permanent: true },
      { source: "/easter-journey", destination: "/products/easter-journey", permanent: true },
      { source: "/cart", destination: "/shop", permanent: false },
    ];
  },
};

export default nextConfig;
