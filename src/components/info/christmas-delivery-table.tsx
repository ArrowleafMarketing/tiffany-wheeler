import { CalendarCheck, Download, MapPin, PenLine, Timer, Truck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { christmasTableCopy as copy } from "@/content/info";
import { cn } from "@/lib/cn";
import { formatSeasonDate, getCurrentSeason, type Season } from "@/lib/season";
import { addDaysIso, christmasPlan, formatShortDate, type ChristmasRowId } from "./delivery-dates";

const icons: Record<ChristmasRowId, LucideIcon> = {
  signed: PenLine,
  standard: Truck,
  priority: Timer,
  pickup: MapPin,
  digital: Download,
};

const long = (iso: string) => formatSeasonDate(iso, { weekday: true });

type Props = {
  /** Defaults to the current season. Pass one to preview another date. */
  season?: Season;
  className?: string;
};

/**
 * Christmas order-by table for /shipping#christmas-delivery: standard shipping
 * and instant PDFs, plus signed copies, Priority and Boise pickup only while
 * those are offered (CLAIMS). Passed rows are marked, a status line covers
 * today, and the USPS reference dates are the basis. Server Component; every
 * date comes from season.christmas (src/lib/delivery.ts).
 */
export async function ChristmasDeliveryTable({ season: seasonProp, className }: Props) {
  const season = seasonProp ?? (await getCurrentSeason());
  const plan = christmasPlan(season);

  const status =
    plan.phase === "standard"
      ? copy.status.standard(long(plan.standardBy), addDaysIso(season.today, 14) >= plan.standardBy)
      : plan.phase === "priority" && plan.priorityBy
        ? copy.status.priority(long(plan.priorityBy))
        : plan.phase === "last-minute"
          ? copy.status.lastMinute()
          : copy.status.planning(plan.year);
  const pushPdf = plan.phase === "priority" || plan.phase === "last-minute";

  return (
    <div className={cn("space-y-4", className)}>
      <p className="flex gap-3 rounded-(--radius-card) bg-night p-4 text-white shadow-soft sm:p-5">
        <CalendarCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-gold" />
        <span className="leading-relaxed">
          {status}
          {pushPdf ? (
            <>
              {" "}
              <Link
                href={copy.pdfLink.href}
                className="font-semibold text-gold underline underline-offset-2 hover:text-white"
              >
                {copy.pdfLink.label}
              </Link>
            </>
          ) : null}
        </span>
      </p>

      <div className="overflow-hidden rounded-(--radius-card) border border-line bg-paper shadow-soft">
        <table className="w-full border-collapse text-left">
          <caption className="border-b border-line bg-cream-deep/60 px-4 py-3 text-left font-display text-lg font-semibold text-ink sm:px-5">
            {copy.caption(plan.year)}
          </caption>
          <thead className="border-b border-line">
            <tr className="text-xs font-bold uppercase tracking-[0.06em] text-muted">
              <th scope="col" className="px-4 pb-2 pt-3 font-bold sm:px-5">
                {copy.colMethod}
              </th>
              <th scope="col" className="px-4 pb-2 pt-3 text-right font-bold sm:px-5">
                {copy.colDate}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {plan.rows.map((row) => {
              const Icon = icons[row.id];
              const { name, line } = copy.rows[row.id];
              return (
                <tr key={row.id} className={cn(row.passed && "bg-cream/70")}>
                  <th scope="row" className="px-4 py-4 align-top font-normal sm:px-5">
                    <span className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className={cn(
                          "hidden size-9 shrink-0 place-items-center rounded-full sm:grid",
                          row.passed ? "bg-cream-deep text-muted" : "bg-periwinkle-light text-periwinkle-text",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span>
                        <span className={cn("block font-semibold", row.passed ? "text-muted" : "text-ink")}>
                          {name}
                        </span>
                        <span className="mt-0.5 block text-sm leading-snug text-muted">{line}</span>
                      </span>
                    </span>
                  </th>
                  <td className="px-4 py-4 text-right align-top sm:px-5">
                    {row.id === "pickup" ? (
                      <span className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                        {copy.through}
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        "block whitespace-nowrap font-display text-base font-semibold tabular-nums sm:text-lg",
                        row.passed ? "text-muted line-through decoration-1" : "text-ink",
                      )}
                    >
                      {row.date ? formatShortDate(row.date) : copy.rows.digital.date}
                    </span>
                    {row.passed ? (
                      <span className="mt-1 inline-block rounded-full bg-cream-deep px-2 py-0.5 text-xs font-bold text-muted">
                        {copy.passed}
                      </span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 text-sm leading-relaxed">
        {plan.phase !== "planning" ? (
          <p className="text-body">{copy.afterCutoff(formatSeasonDate(plan.lastCutoff))}</p>
        ) : null}
        {plan.usps ? (
          <p className="text-muted">
            {copy.usps(
              {
                groundAdvantage: formatSeasonDate(plan.usps.groundAdvantage),
                priority: plan.usps.priority ? formatSeasonDate(plan.usps.priority) : null,
                priorityExpress: plan.usps.priorityExpress ? formatSeasonDate(plan.usps.priorityExpress) : null,
              },
              plan.usps.oursAreEarlier,
            )}
          </p>
        ) : null}
        <p className="font-semibold text-ink">{copy.disclaimer}</p>
      </div>
    </div>
  );
}
