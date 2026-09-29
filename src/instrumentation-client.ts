// Runs before hydration. Captures first-touch ad attribution into a cookie so
// the cart can attach it to the order (read by src/lib/cart/cookies.ts), without
// reading searchParams in pages (which would make them dynamic).

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];
const COOKIE = "tw_attr";

try {
  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const key of KEYS) {
    const value = params.get(key);
    if (value) found[key] = value.slice(0, 200);
  }
  const hasCookie = document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`));
  if (Object.keys(found).length > 0 && !hasCookie) {
    found.landing_page = window.location.pathname;
    const value = encodeURIComponent(JSON.stringify(found));
    document.cookie = `${COOKIE}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }
} catch {
  // Never block the page on attribution.
}
