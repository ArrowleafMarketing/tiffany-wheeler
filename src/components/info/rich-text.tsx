import Link from "next/link";
import type { ReactNode } from "react";

/** Link style for prose on light backgrounds. */
export const proseLinkClass =
  "font-semibold text-periwinkle-text underline decoration-periwinkle/40 underline-offset-2 transition-colors hover:text-ink hover:decoration-ink";

// [label](href) | **bold** | bare email address
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function renderLink(label: string, href: string, key: number): ReactNode {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link key={key} href={href} className={proseLinkClass}>
        {label}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a
      key={key}
      href={href}
      className={proseLinkClass}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

/**
 * Renders a copy string with the tiny inline markup used in src/content/info.ts:
 * `[label](href)` links (internal ones use next/link), `**bold**`, and bare
 * email addresses as mailto links. Everything else is plain text.
 */
export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(TOKEN)) {
    const [whole, label, href, bold, email] = match;
    const index = match.index ?? 0;
    if (index > last) out.push(text.slice(last, index));
    if (label && href) out.push(renderLink(label, href, key++));
    else if (bold) {
      out.push(
        <strong key={key++} className="font-semibold text-ink">
          {bold}
        </strong>,
      );
    } else if (email) out.push(renderLink(email, `mailto:${email}`, key++));
    last = index + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
