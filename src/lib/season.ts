import { cacheLife, cacheTag } from "next/cache";
import type { Holiday } from "@/lib/commerce/types";
import {
  christmasDates,
  easterDates,
  formatDate,
  isoOf,
  nextEaster,
  type ChristmasDates,
  type EasterDates,
  type IsoDate,
} from "@/lib/delivery";

/**
 * Season modes drive which book leads the homepage, the announcement bar and
 * shipping-deadline messaging. Dates are evaluated in Tiffany's time zone, and
 * every cutoff comes from src/lib/delivery.ts.
 *
 *   christmas              Sep 15 – the standard Christmas order-by date
 *   christmas-last-minute  the day after – Dec 24 (push PDFs; hardcovers ship after Christmas)
 *   after-christmas        Dec 25 – Jan 4 (tradition for next year, tease Easter)
 *   easter                 Jan 5 – Easter Sunday
 *   off-season             Easter Monday – Sep 14 (evergreen, both books)
 */
export type SeasonMode =
  | "christmas"
  | "christmas-last-minute"
  | "after-christmas"
  | "easter"
  | "off-season";

export type Season = {
  mode: SeasonMode;
  /** Which book leads the page. */
  featured: Holiday;
  /** Next holiday we're selling toward, and its date. */
  holiday: Holiday;
  holidayDate: IsoDate;
  /** Last day to order hardcovers for standard delivery before that holiday; null once passed. */
  orderBy: IsoDate | null;
  /** Today in Mountain Time. */
  today: IsoDate;
  /** The Christmas being sold toward (this year's until Dec 24, then next year's). */
  christmas: ChristmasDates;
  /** The next Easter on or after today. */
  easter: EasterDates;
};

const TIME_ZONE = "America/Boise";

function todayIn(now: Date): IsoDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return isoOf(get("year"), get("month"), get("day"));
}

export function getSeason(now: Date): Season {
  const today = todayIn(now);
  const year = Number(today.slice(0, 4));
  const monthDay = today.slice(5);

  const christmas = christmasDates(monthDay >= "12-25" ? year + 1 : year);
  const easter = easterDates(Number(nextEaster(today).slice(0, 4)));
  const base = { today, christmas, easter };

  // Dec 25 – Jan 4: after Christmas; Easter is next.
  if (monthDay >= "12-25" || monthDay <= "01-04") {
    return {
      ...base,
      mode: "after-christmas",
      featured: "easter",
      holiday: "easter",
      holidayDate: easter.easter,
      orderBy: easter.orderBy,
    };
  }
  // Jan 5 – Easter Sunday.
  if (today <= easter.easter && easter.year === year) {
    return {
      ...base,
      mode: "easter",
      featured: "easter",
      holiday: "easter",
      holidayDate: easter.easter,
      orderBy: today <= easter.orderBy ? easter.orderBy : null,
    };
  }
  // Sep 15 – Dec 24.
  if (monthDay >= "09-15") {
    const beforeCutoff = today <= christmas.standardOrderBy;
    return {
      ...base,
      mode: beforeCutoff ? "christmas" : "christmas-last-minute",
      featured: "christmas",
      holiday: "christmas",
      holidayDate: christmas.christmas,
      orderBy: beforeCutoff ? christmas.standardOrderBy : null,
    };
  }
  // Easter Monday – Sep 14.
  return {
    ...base,
    mode: "off-season",
    featured: "christmas",
    holiday: "christmas",
    holidayDate: christmas.christmas,
    orderBy: christmas.standardOrderBy,
  };
}

/**
 * Season for right now, cached into the static shell with the short "season"
 * profile (next.config.ts) and tagged so the daily cron at /api/revalidate/season
 * can roll every page over at midnight Mountain Time. Set
 * SEASON_PREVIEW_DATE=yyyy-mm-dd to preview another date locally.
 */
export async function getCurrentSeason(): Promise<Season> {
  "use cache";
  cacheLife("season");
  cacheTag("season");
  const preview = process.env.SEASON_PREVIEW_DATE;
  const now = preview ? new Date(`${preview}T12:00:00-07:00`) : new Date();
  return getSeason(now);
}

/** "December 15" (or "Tuesday, December 15"). Alias of formatDate in src/lib/delivery.ts. */
export function formatSeasonDate(isoDate: IsoDate, opts: { weekday?: boolean } = {}): string {
  return formatDate(isoDate, opts);
}
