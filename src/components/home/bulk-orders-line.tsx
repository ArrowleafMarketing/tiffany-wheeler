import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { bulkCopy as copy } from "@/content/home-bottom";

/**
 * The one-line version of §2.13 for the Christmas homepage: the bulk, ward and
 * wholesale details live on /bulk-orders (BulkAndStores still renders the full
 * cards where there's room for them).
 */
export function BulkOrdersLine() {
  return (
    <aside aria-label={copy.bulkLink.label} className="border-t border-line bg-cream-deep">
      <p className="container-page flex flex-wrap items-center justify-center gap-x-3 py-4 text-center text-body">
        <span>{copy.lineLead}</span>
        <Link
          href={copy.bulkLink.href}
          prefetch={false}
          className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
        >
          {copy.bulkLink.label}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </p>
    </aside>
  );
}
