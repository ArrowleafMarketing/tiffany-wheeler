import { CalendarCheck, Clock, Download, Truck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { DELIVERY_COPY } from "@/content/pdp";
import type { Holiday } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { addDaysIso, estimateDelivery, formatMonthDay, type IsoDate } from "@/lib/delivery";
import { getCurrentSeason, type Season } from "@/lib/season";
import { CLAIMS, HANDLES, SHIPS_FROM, productPath } from "@/lib/store-config";

// "Arrives …" line under Add to Cart (copy deck §4.4). Every promise has a basis
// (FTC Mail Order Rule): the window and every deadline come from src/lib/delivery.ts
// (business-day calendar + store-config handling/transit times), never from here.

/** Print-on-demand production time; null until Tiffany confirms it (§5, item 29). */
const MADE_TO_ORDER_BUSINESS_DAYS: number | null = null; // CONFIRM

/**
 * "in time for Christmas" / "before Palm Sunday" only read as news close to the
 * deadline; before this many days out the line stays the plain window.
 */
const HOLIDAY_PUSH_DAYS = 30;

type Icon = "truck" | "download" | "clock" | "calendar";
type Line = { icon: Icon; content: ReactNode };

/** "Sep 25–Oct 1", or "Oct 2–8" within one month. */
function formatWindow(earliest: IsoDate, latest: IsoDate): string {
  if (earliest === latest) return formatMonthDay(latest);
  const sameMonth = earliest.slice(0, 7) === latest.slice(0, 7);
  return `${formatMonthDay(earliest)}–${sameMonth ? Number(latest.slice(8, 10)) : formatMonthDay(latest)}`;
}

function PdfLink({ children }: { children: ReactNode }) {
  return (
    <Link
      href={productPath(HANDLES.ncPdf)}
      className="font-semibold text-periwinkle-text underline decoration-periwinkle/40 underline-offset-2 hover:decoration-periwinkle"
    >
      {children}
    </Link>
  );
}

const strong = (text: string) => <strong className="font-semibold text-ink">{text}</strong>;

type Options = {
  requiresShipping: boolean;
  madeToOrder?: boolean;
  holiday?: Holiday;
  /** The item includes the Nephite Christmas book, so its instant PDF is a real alternative. */
  pdfAlternative?: boolean;
};

/** Which §4.4 lines apply (one or two). */
export function deliveryLines(
  season: Season,
  { requiresShipping, madeToOrder, holiday, pdfAlternative }: Options,
): Line[] {
  if (!requiresShipping) return [{ icon: "download", content: DELIVERY_COPY.digital }];

  if (madeToOrder) {
    if (MADE_TO_ORDER_BUSINESS_DAYS === null) return [{ icon: "clock", content: DELIVERY_COPY.madeToOrder }];
    const { earliest, latest } = estimateDelivery(season.today, MADE_TO_ORDER_BUSINESS_DAYS);
    return [
      {
        icon: "clock",
        content: <>Made to order · {strong(DELIVERY_COPY.arrives(formatWindow(earliest, latest)))}</>,
      },
    ];
  }

  const { earliest, latest } = estimateDelivery(season.today);
  const window = strong(DELIVERY_COPY.arrives(formatWindow(earliest, latest)));
  const normal: Line = {
    icon: "truck",
    content: (
      <>
        {window} · {DELIVERY_COPY.shipsFrom(SHIPS_FROM)}
      </>
    ),
  };

  // Christmas wording only for Christmas products and the set (not Easter items), and vice versa.
  const forChristmas = holiday !== "easter";
  const forEaster = holiday !== "christmas";
  const { christmas, easter } = season;

  if (season.mode === "christmas" && forChristmas) {
    const christmasEve = addDaysIso(christmas.christmas, -1);
    const lines: Line[] = [];
    // "in time for Christmas" only when the worst-case arrival really is before Christmas Eve ends.
    const close = season.today >= addDaysIso(christmas.standardOrderBy, -HOLIDAY_PUSH_DAYS);
    if (close && latest <= christmasEve) {
      lines.push({
        icon: "truck",
        content: (
          <>
            {window}, {DELIVERY_COPY.inTimeForChristmas}
          </>
        ),
      });
    } else {
      lines.push(normal);
    }
    lines.push({
      icon: "calendar",
      content: DELIVERY_COPY.christmasOrderBy(formatMonthDay(christmas.standardOrderBy)),
    });
    return lines;
  }

  // After the last Christmas cutoff: the real window, flagged as possibly after
  // Christmas (for every item, so an Easter book never reads as a Christmas promise).
  if (season.mode === "christmas-last-minute") {
    const priorityOpen =
      forChristmas &&
      CLAIMS.priorityShipping &&
      christmas.priorityOrderBy !== null &&
      season.today <= christmas.priorityOrderBy;
    if (priorityOpen) {
      return [
        {
          icon: "clock",
          content: pdfAlternative ? (
            <>
              {DELIVERY_COPY.priority}, or <PdfLink>{DELIVERY_COPY.priorityPdf}</PdfLink>.
            </>
          ) : (
            `${DELIVERY_COPY.priority}.`
          ),
        },
      ];
    }
    return [
      {
        icon: "clock",
        content: (
          <>
            {strong(DELIVERY_COPY.afterCutoff(formatWindow(earliest, latest)))}
            {pdfAlternative && forChristmas ? (
              <>
                {" "}
                {DELIVERY_COPY.needItSooner} <PdfLink>{DELIVERY_COPY.pdfLink}</PdfLink>
              </>
            ) : null}
          </>
        ),
      },
    ];
  }

  if (season.mode === "easter" && season.orderBy && forEaster) {
    // "before Palm Sunday" only near the cutoff, and only when the worst case
    // arrives by the Saturday before it.
    const close = season.today >= addDaysIso(easter.orderBy, -HOLIDAY_PUSH_DAYS);
    if (close && latest <= addDaysIso(easter.palmSunday, -1)) {
      return [
        {
          icon: "calendar",
          content: (
            <>
              {window}, {DELIVERY_COPY.beforePalmSunday}
            </>
          ),
        },
      ];
    }
  }

  return [normal];
}

const icons = { truck: Truck, download: Download, clock: Clock, calendar: CalendarCheck };

/**
 * "Arrives Sep 25–Oct 1 · Ships from Idaho" (copy deck §4.4), placed directly
 * under Add to Cart, plus the Christmas order-by date for Christmas items in
 * christmas mode. `holiday` keeps Christmas/Easter deadline wording off products
 * for the other holiday.
 */
export async function DeliveryPromise({
  className,
  ...options
}: Options & { className?: string }) {
  const season = await getCurrentSeason();
  const lines = deliveryLines(season, options);
  return (
    <ul className={cn("grid gap-1.5 text-sm leading-snug text-body", className)}>
      {lines.map((line, i) => {
        const Icon = icons[line.icon];
        return (
          <li key={i} className="flex items-start gap-2">
            <Icon aria-hidden className="mt-px size-4 shrink-0 text-forest" />
            <span>{line.content}</span>
          </li>
        );
      })}
    </ul>
  );
}
