import { ArrowRight, MapPin, Presentation, Store, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { bulkCopy as copy, type BulkCardIcon } from "@/content/home-bottom";
import { cn } from "@/lib/cn";

const icons: Record<BulkCardIcon, LucideIcon> = {
  family: Users,
  ward: Presentation,
  store: Store,
  find: MapPin,
};

/** Bulk orders and where to find it (§2.13). Retailers are listed as text only. */
export async function BulkAndStores() {
  return (
    <section aria-labelledby="bulk-title" className="bg-paper py-14 sm:py-20">
      <div className="container-page">
        {/* CONFIRM bulk discount (copy deck §5, item 4) */}
        <SectionHeading id="bulk-title" title={copy.title} subtitle={copy.subtitle} />

        <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {copy.cards.map((card) => {
            const Icon = icons[card.icon];
            const isFind = card.icon === "find";
            return (
              <li
                key={card.title}
                className={cn(
                  "flex flex-col rounded-(--radius-card) border border-line p-5 sm:p-6",
                  isFind ? "bg-cream-deep" : "bg-cream shadow-soft",
                )}
              >
                <span
                  aria-hidden
                  className="grid size-11 place-items-center rounded-full bg-periwinkle-light text-periwinkle-text"
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-xl font-semibold leading-snug">{card.title}</h3>
                {/* card 4: CONFIRM retailers still current (copy deck §2.13) */}
                <p className="mt-2 leading-relaxed text-body">{card.line}</p>
                {"link" in card && card.link ? (
                  <div className="mt-auto pt-3">
                    <Link
                      href={card.link.href}
                      prefetch={false}
                      className="inline-block py-2.5 font-semibold text-periwinkle-text underline-offset-4 hover:text-ink hover:underline"
                    >
                      {card.link.label}
                      <ArrowRight aria-hidden className="ml-1.5 inline size-4 align-[-0.15em]" />
                    </Link>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <p className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-body">
          <span>
            {copy.contactLead}{" "}
            {/* CONFIRM customer-service address (copy deck §5, item 32) */}
            <a
              href={`mailto:${copy.contactEmail}`}
              className="-my-3 inline-block py-3 font-semibold text-periwinkle-text underline underline-offset-2 hover:text-ink"
            >
              {copy.contactEmail}
            </a>
          </span>
          <Link
            href={copy.bulkLink.href}
            prefetch={false}
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:underline"
          >
            {copy.bulkLink.label}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </p>
      </div>
    </section>
  );
}
