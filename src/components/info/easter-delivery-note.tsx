import { ArrowRight, CalendarHeart } from "lucide-react";
import Link from "next/link";
import { shippingCopy } from "@/content/info";
import { cn } from "@/lib/cn";
import { formatSeasonDate, getCurrentSeason, type Season } from "@/lib/season";
import { easterPlan } from "./delivery-dates";

const copy = shippingCopy.easter;
const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 font-semibold text-periwinkle-text underline-offset-4 hover:text-ink hover:underline";

type Props = {
  /** Defaults to the current season. */
  season?: Season;
  className?: string;
};

/** The Easter hardcover cutoff (season.easter, from src/lib/delivery.ts) and the PDF fallback. */
export async function EasterDeliveryNote({ season: seasonProp, className }: Props) {
  const season = seasonProp ?? (await getCurrentSeason());
  const plan = easterPlan(season);
  const palmSunday = formatSeasonDate(plan.palmSunday);

  const line =
    plan.phase === "open"
      ? copy.open(formatSeasonDate(plan.orderBy, { weekday: true }), palmSunday)
      : plan.phase === "pdf"
        ? copy.passed(palmSunday)
        : copy.holyWeek;

  return (
    <div className={cn("rounded-(--radius-card) border border-line bg-paper p-5 shadow-soft sm:p-6", className)}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.06em] text-muted">
        {copy.dateLabel(plan.year, formatSeasonDate(plan.easter))}
      </p>
      <p className="flex gap-3 text-base leading-relaxed text-ink sm:text-[1.0625rem]">
        <CalendarHeart aria-hidden className="mt-1 size-5 shrink-0 text-olive" />
        <span className="font-semibold">{line}</span>
      </p>
      {plan.phase === "open" ? <p className="mt-3 text-base leading-relaxed text-body">{copy.guide}</p> : null}
      <div className="mt-3 flex flex-wrap gap-x-6">
        <Link href={plan.phase === "open" ? copy.bookLink.href : copy.pdfLink.href} className={linkClass}>
          {plan.phase === "open" ? copy.bookLink.label : copy.pdfLink.label}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </div>
  );
}
