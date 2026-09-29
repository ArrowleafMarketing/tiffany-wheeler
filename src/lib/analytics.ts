// One tracking entry point for the whole storefront. Today it pushes to
// window.dataLayer (and logs in development). When pixel IDs are configured
// (Meta 1232618954522587, GA4 G-WP1LN2QBSK, Klaviyo), each destination is
// wired here — components never call fbq/gtag directly.
//
// Checkout and purchase events are fired by Shopify's own apps on the hosted
// checkout; don't fire begin_checkout to Meta from here once that's live, or
// it double-counts (see docs/discovery/shopify-headless.md §8).

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity: number;
};

export type AnalyticsEvent =
  | "view_item"
  | "select_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout"
  | "generate_lead"
  | "video_play";

export type AnalyticsParams = {
  value?: number;
  currency?: "USD";
  items?: AnalyticsItem[];
  [key: string]: unknown;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    const payload = { currency: "USD" as const, ...params };
    window.dataLayer ??= [];
    window.dataLayer.push({ event, ...payload });
    if (process.env.NODE_ENV !== "production") {
      console.debug("[track]", event, payload);
    }
  } catch {
    // Tracking must never break the page.
  }
}
