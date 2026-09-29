import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { InfoLink } from "@/content/info";

type Props = {
  links: readonly InfoLink[];
  /** Accessible name for the list's nav landmark. */
  label: string;
  className?: string;
};

/** A stack of tappable help links (title + one line), e.g. "Quick answers" on /contact. */
export function InfoLinkList({ links, label, className }: Props) {
  return (
    <nav aria-label={label} className={className}>
      <ul className="divide-y divide-line overflow-hidden rounded-(--radius-card) border border-line bg-paper shadow-soft">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex min-h-14 items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-cream/70 sm:px-5"
            >
              <span>
                <span className="block font-semibold text-ink group-hover:text-periwinkle-text">{link.label}</span>
                {link.line ? <span className="mt-0.5 block text-sm text-muted">{link.line}</span> : null}
              </span>
              <ChevronRight aria-hidden className="size-5 shrink-0 text-periwinkle-text" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
