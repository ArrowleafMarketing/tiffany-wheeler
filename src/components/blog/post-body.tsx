import { SITE_URL } from "@/lib/store-config";

const siteHost = new URL(SITE_URL).host;

/**
 * Light touch-ups to the HTML from Shopify's editor: images load lazily and,
 * when they're on Shopify's CDN, at a sensible width instead of the original
 * upload; links to other sites open in a new tab.
 */
function prepare(html: string): string {
  return html
    .replace(/<img\b([^>]*)>/gi, (_, attrs: string) => {
      let next = attrs.replace(/\ssrc="(https:\/\/cdn\.shopify\.com\/[^"]+)"/i, (m, src: string) => {
        if (/[?&]width=/.test(src)) return m;
        return ` src="${src}${src.includes("?") ? "&amp;" : "?"}width=1400"`;
      });
      if (!/\sloading=/i.test(next)) next += ' loading="lazy"';
      if (!/\sdecoding=/i.test(next)) next += ' decoding="async"';
      return `<img${next}>`;
    })
    .replace(/<a\b([^>]*\shref="https?:\/\/([^/"]+)[^"]*"[^>]*)>/gi, (whole, attrs: string, host: string) => {
      if (host === siteHost || host === `www.${siteHost}` || /\starget=/i.test(attrs)) return whole;
      return `<a${attrs} target="_blank" rel="noopener noreferrer">`;
    });
}

/** A post's body, styled by `.blog-prose` (globals.css) to match the site's type. */
export function PostBody({ html }: { html: string }) {
  return <div className="blog-prose" dangerouslySetInnerHTML={{ __html: prepare(html) }} />;
}
