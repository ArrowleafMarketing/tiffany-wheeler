// The one source for every shipping date the site shows: "Get it by" lines,
// order-by deadlines, the announcement bar, /shipping, FAQ answers and hero
// copy. Everything is derived from a business-day calendar (weekends and US
// federal holidays skipped) plus the handling/transit times in store-config, so
// each promise has a basis (FTC Mail Order Rule) and nothing drifts.
//
// Dates are plain "yyyy-mm-dd" strings in Tiffany's time zone (Mountain).

import {
  CLAIMS,
  HANDLING_BUSINESS_DAYS,
  LOCAL_PICKUP_THROUGH,
  PRIORITY_TRANSIT_BUSINESS_DAYS,
  SIGNED_EXTRA_BUSINESS_DAYS,
  TRANSIT_BUSINESS_DAYS,
} from "@/lib/store-config";

export type IsoDate = string;

type Ymd = { y: number; m: number; d: number };

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = ({ y, m, d }: Ymd): IsoDate => `${y}-${pad(m)}-${pad(d)}`;
const fromIso = (iso: IsoDate): Ymd => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
};
const toUtc = ({ y, m, d }: Ymd) => new Date(Date.UTC(y, m - 1, d));
const fromUtc = (t: Date): Ymd => ({ y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() });
const weekday = (x: Ymd) => toUtc(x).getUTCDay();

export function isoOf(y: number, m: number, d: number): IsoDate {
  return toIso({ y, m, d });
}

export function addDaysIso(iso: IsoDate, days: number): IsoDate {
  const x = fromIso(iso);
  return toIso(fromUtc(new Date(Date.UTC(x.y, x.m - 1, x.d + days))));
}

// ── Calendar ────────────────────────────────────────────────────────────────

/** Gregorian Easter Sunday (anonymous algorithm). */
export function easterSunday(year: number): IsoDate {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return isoOf(year, month, day);
}

/** The next Easter Sunday on or after `today`. */
export function nextEaster(today: IsoDate): IsoDate {
  const year = Number(today.slice(0, 4));
  const thisYear = easterSunday(year);
  return thisYear >= today ? thisYear : easterSunday(year + 1);
}

/** The nth (1-based) weekday of a month; n = -1 for the last one. */
function nthWeekday(y: number, m: number, dow: number, n: number): Ymd {
  if (n > 0) {
    const first = weekday({ y, m, d: 1 });
    return { y, m, d: 1 + ((dow - first + 7) % 7) + (n - 1) * 7 };
  }
  const last = fromUtc(new Date(Date.UTC(y, m, 0)));
  return { y, m, d: last.d - ((weekday(last) - dow + 7) % 7) };
}

/** Fixed-date holidays move to Friday/Monday when they fall on a weekend. */
function observed(x: Ymd): Ymd {
  const dow = weekday(x);
  if (dow === 6) return fromUtc(new Date(Date.UTC(x.y, x.m - 1, x.d - 1)));
  if (dow === 0) return fromUtc(new Date(Date.UTC(x.y, x.m - 1, x.d + 1)));
  return x;
}

const holidayCache = new Map<number, Set<IsoDate>>();

/** US federal holidays (no USPS delivery). */
function federalHolidays(y: number): Set<IsoDate> {
  let set = holidayCache.get(y);
  if (!set) {
    set = new Set(
      [
        observed({ y, m: 1, d: 1 }),
        nthWeekday(y, 1, 1, 3), // MLK Day
        nthWeekday(y, 2, 1, 3), // Presidents Day
        nthWeekday(y, 5, 1, -1), // Memorial Day
        observed({ y, m: 6, d: 19 }),
        observed({ y, m: 7, d: 4 }),
        nthWeekday(y, 9, 1, 1), // Labor Day
        nthWeekday(y, 10, 1, 2), // Columbus Day
        observed({ y, m: 11, d: 11 }),
        nthWeekday(y, 11, 4, 4), // Thanksgiving
        observed({ y, m: 12, d: 25 }),
        observed({ y: y + 1, m: 1, d: 1 }), // can fall on Dec 31
      ].map(toIso),
    );
    holidayCache.set(y, set);
  }
  return set;
}

export function isBusinessDay(iso: IsoDate): boolean {
  const x = fromIso(iso);
  const dow = weekday(x);
  return dow !== 0 && dow !== 6 && !federalHolidays(x.y).has(iso);
}

/** `n` business days after `from` (n = 0 returns `from`). */
export function addBusinessDays(from: IsoDate, n: number): IsoDate {
  let day = from;
  let left = n;
  while (left > 0) {
    day = addDaysIso(day, 1);
    if (isBusinessDay(day)) left -= 1;
  }
  return day;
}

/** `n` business days before `from`. */
export function subtractBusinessDays(from: IsoDate, n: number): IsoDate {
  let day = from;
  let left = n;
  while (left > 0) {
    day = addDaysIso(day, -1);
    if (isBusinessDay(day)) left -= 1;
  }
  return day;
}

/** First business day strictly after `iso`. */
export function nextBusinessDay(iso: IsoDate): IsoDate {
  return addBusinessDays(iso, 1);
}

/** Latest order date whose worst-case arrival (order + `businessDays`) is on or before `deadline`. */
export function latestOrderDate(deadline: IsoDate, businessDays: number): IsoDate {
  let day = deadline;
  // Walk back until the estimate fits; bounded by a few weeks.
  for (let i = 0; i < 60; i += 1) {
    if (addBusinessDays(day, businessDays) <= deadline) return day;
    day = addDaysIso(day, -1);
  }
  return day;
}

// ── Estimates ───────────────────────────────────────────────────────────────

const STANDARD_WORST = HANDLING_BUSINESS_DAYS.max + TRANSIT_BUSINESS_DAYS.max;
const STANDARD_BEST = HANDLING_BUSINESS_DAYS.min + TRANSIT_BUSINESS_DAYS.min;

/** Delivery window for a standard-shipping order placed today. */
export function estimateDelivery(today: IsoDate, extraBusinessDays = 0): { earliest: IsoDate; latest: IsoDate } {
  return {
    earliest: addBusinessDays(today, STANDARD_BEST + extraBusinessDays),
    latest: addBusinessDays(today, STANDARD_WORST + extraBusinessDays),
  };
}

// ── Holiday plans ───────────────────────────────────────────────────────────

export type ChristmasDates = {
  year: number;
  christmas: IsoDate;
  /** Last day to order hardcovers with standard shipping for delivery by Christmas Eve. */
  standardOrderBy: IsoDate;
  /** Signed copies need a little longer; null when signed copies aren't offered. */
  signedOrderBy: IsoDate | null;
  /** Priority shipping cutoff; null unless Priority is offered at checkout. */
  priorityOrderBy: IsoDate | null;
  /** Orders placed after the last cutoff ship on this business day (after Christmas). */
  resumeShipping: IsoDate;
  /** Boise local pickup runs through this day; null when pickup isn't offered. */
  pickupThrough: IsoDate | null;
};

export function christmasDates(year: number): ChristmasDates {
  const christmas = isoOf(year, 12, 25);
  const christmasEve = isoOf(year, 12, 24);
  const standardOrderBy = latestOrderDate(christmasEve, STANDARD_WORST);
  return {
    year,
    christmas,
    standardOrderBy,
    signedOrderBy: CLAIMS.signedCopies ? subtractBusinessDays(standardOrderBy, SIGNED_EXTRA_BUSINESS_DAYS) : null,
    priorityOrderBy: CLAIMS.priorityShipping
      ? latestOrderDate(christmasEve, HANDLING_BUSINESS_DAYS.max + PRIORITY_TRANSIT_BUSINESS_DAYS)
      : null,
    resumeShipping: nextBusinessDay(christmas),
    pickupThrough: CLAIMS.localPickup ? `${year}-${LOCAL_PICKUP_THROUGH}` : null,
  };
}

export type EasterDates = {
  year: number;
  easter: IsoDate;
  palmSunday: IsoDate;
  /** Last day to order hardcovers so they arrive before Palm Sunday (the 8-day journey starts then). */
  orderBy: IsoDate;
};

export function easterDates(year: number): EasterDates {
  const easter = easterSunday(year);
  const palmSunday = addDaysIso(easter, -7);
  return {
    year,
    easter,
    palmSunday,
    orderBy: latestOrderDate(addDaysIso(palmSunday, -1), STANDARD_WORST),
  };
}

// ── Formatting (UTC-based so server and client agree) ──────────────────────

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { ...opts, timeZone: "UTC" });
const longFmt = fmt({ month: "long", day: "numeric" });
const longWeekdayFmt = fmt({ weekday: "long", month: "long", day: "numeric" });
const shortFmt = fmt({ weekday: "short", month: "short", day: "numeric" });
const monthDayShortFmt = fmt({ month: "short", day: "numeric" });

/** "December 15" (or "Tuesday, December 15" with weekday). */
export function formatDate(iso: IsoDate, opts: { weekday?: boolean } = {}): string {
  return (opts.weekday ? longWeekdayFmt : longFmt).format(toUtc(fromIso(iso)));
}

/** "Tue, Dec 15" */
export function formatShortDate(iso: IsoDate): string {
  return shortFmt.format(toUtc(fromIso(iso)));
}

/** "Dec 15" */
export function formatMonthDay(iso: IsoDate): string {
  return monthDayShortFmt.format(toUtc(fromIso(iso)));
}

/** "March 28, 2027" */
export function formatLongDate(iso: IsoDate): string {
  return `${formatDate(iso)}, ${iso.slice(0, 4)}`;
}

/** Palm Sunday to Easter: "March 21–28, 2027" or "March 29–April 5, 2026". */
export function formatHolyWeek(easter: IsoDate): string {
  const palm = addDaysIso(easter, -7);
  const sameMonth = palm.slice(5, 7) === easter.slice(5, 7);
  return `${formatDate(palm)}–${sameMonth ? Number(easter.slice(8, 10)) : formatDate(easter)}, ${easter.slice(0, 4)}`;
}
