import type { Money } from "@/lib/commerce/types";

export function money(amount: number): Money {
  return { amount: amount.toFixed(2), currencyCode: "USD" };
}

export function toNumber(value: Money | number): number {
  return typeof value === "number" ? value : Number(value.amount);
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** "$24.99". Pass `{ trim: true }` to render whole amounts as "$45". */
export function formatMoney(value: Money | number, opts: { trim?: boolean } = {}): string {
  const n = toNumber(value);
  if (opts.trim && Number.isInteger(n)) return `$${n}`;
  return usd.format(n);
}

/** Whole-percent savings of `price` against `compareAt`, or null when not a real discount. */
export function percentOff(price: Money, compareAt: Money | null): number | null {
  if (!compareAt) return null;
  const p = toNumber(price);
  const c = toNumber(compareAt);
  if (c <= p) return null;
  return Math.round(((c - p) / c) * 100);
}
