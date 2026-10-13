const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "America/Denver" });

/** "October 6, 2026", in Tiffany's time zone. */
export function formatPostDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** Post page URL. */
export const postPath = (handle: string) => `/blog/${handle}`;
