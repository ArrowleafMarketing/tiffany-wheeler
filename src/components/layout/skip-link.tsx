import { HEADER } from "@/content/site";

/** First focusable element on every page; targets each page's <main id="main">. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-(--radius-btn) bg-forest font-semibold text-white shadow-lift focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-3"
    >
      {HEADER.skipLink}
    </a>
  );
}
