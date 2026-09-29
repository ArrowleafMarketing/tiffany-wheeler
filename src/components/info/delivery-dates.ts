// Thin adapter over src/lib/delivery.ts for the /shipping page. Every date
// comes from season.christmas / season.easter (one business-day calendar, so
// each promise has a basis under the FTC Mail Order Rule). This file only
// decides which rows are offered (CLAIMS), which have passed, and which phase
// the status line is in. Pure functions of a Season.

import { USPS_HOLIDAY_SHIP_BY } from "@/content/info";
import { addBusinessDays, addDaysIso, formatShortDate, type IsoDate } from "@/lib/delivery";
import type { Season } from "@/lib/season";
import { HANDLING_BUSINESS_DAYS } from "@/lib/store-config";

export { addDaysIso, formatShortDate };

export type ChristmasRowId = "signed" | "standard" | "priority" | "pickup" | "digital";

export type ChristmasRow = {
  id: ChristmasRowId;
  /** Order-by (or "through") date; null for instant downloads. */
  date: IsoDate | null;
  passed: boolean;
};

export type UspsReference = {
  groundAdvantage: IsoDate;
  /** Only when Priority is offered at checkout. */
  priority: IsoDate | null;
  priorityExpress: IsoDate | null;
  /** True when each of our order-by dates, plus packing time, ships on or before USPS's date. */
  oursAreEarlier: boolean;
};

export type ChristmasPlan = {
  /** The Christmas these dates are for. */
  year: number;
  rows: ChristmasRow[];
  standardBy: IsoDate;
  /** Null unless Priority is offered (CLAIMS.priorityShipping). */
  priorityBy: IsoDate | null;
  /** Hardcover orders placed after the last cutoff ship on this business day. */
  resumeShipping: IsoDate;
  /** The last cutoff for delivery by Christmas (Priority when offered, otherwise standard). */
  lastCutoff: IsoDate;
  /** Null unless local pickup is offered (CLAIMS.localPickup). */
  pickupThrough: IsoDate | null;
  usps: UspsReference | null;
  /**
   * standard / priority / last-minute: we're selling toward this Christmas and
   * that's the fastest option still open. planning: Christmas is out of season.
   */
  phase: "standard" | "priority" | "last-minute" | "planning";
};

export function christmasPlan(season: Season): ChristmasPlan {
  const { year, standardOrderBy, signedOrderBy, priorityOrderBy, resumeShipping, pickupThrough } = season.christmas;
  const passed = (date: IsoDate) => season.today > date;

  const rows: ChristmasRow[] = [];
  if (signedOrderBy) rows.push({ id: "signed", date: signedOrderBy, passed: passed(signedOrderBy) });
  rows.push({ id: "standard", date: standardOrderBy, passed: passed(standardOrderBy) });
  if (priorityOrderBy) rows.push({ id: "priority", date: priorityOrderBy, passed: passed(priorityOrderBy) });
  if (pickupThrough) rows.push({ id: "pickup", date: pickupThrough, passed: passed(pickupThrough) });
  rows.push({ id: "digital", date: null, passed: passed(`${year}-12-24`) });

  const selling = season.mode === "christmas" || season.mode === "christmas-last-minute";
  const phase: ChristmasPlan["phase"] = !selling
    ? "planning"
    : !passed(standardOrderBy)
      ? "standard"
      : priorityOrderBy && !passed(priorityOrderBy)
        ? "priority"
        : "last-minute";

  const reference = USPS_HOLIDAY_SHIP_BY[year];
  const shipsBy = (orderBy: IsoDate) => addBusinessDays(orderBy, HANDLING_BUSINESS_DAYS.max);
  const usps: UspsReference | null = reference
    ? {
        groundAdvantage: reference.groundAdvantage,
        priority: priorityOrderBy ? reference.priority : null,
        priorityExpress: priorityOrderBy ? reference.priorityExpress : null,
        oursAreEarlier:
          shipsBy(standardOrderBy) <= reference.groundAdvantage &&
          (!priorityOrderBy || shipsBy(priorityOrderBy) <= reference.priority),
      }
    : null;

  return {
    year,
    rows,
    standardBy: standardOrderBy,
    priorityBy: priorityOrderBy,
    resumeShipping,
    lastCutoff: priorityOrderBy ?? standardOrderBy,
    pickupThrough,
    usps,
    phase,
  };
}

export type EasterPlan = {
  year: number;
  easter: IsoDate;
  palmSunday: IsoDate;
  /** Hardcover order-by so the book arrives before Palm Sunday. */
  orderBy: IsoDate;
  /** open: hardcover still arrives in time. pdf: past the cutoff, before Palm Sunday. holy-week: Palm Sunday has passed. */
  phase: "open" | "pdf" | "holy-week";
};

/** The next Easter on or after today, with its hardcover cutoff (season.easter). */
export function easterPlan(season: Season): EasterPlan {
  const { year, easter, palmSunday, orderBy } = season.easter;
  const phase = season.today <= orderBy ? "open" : season.today <= palmSunday ? "pdf" : "holy-week";
  return { year, easter, palmSunday, orderBy, phase };
}
