import { lpBarCopy } from "@/content/lp";
import { getProduct } from "@/lib/commerce";
import { formatMonthDay } from "@/lib/delivery";
import { toNumber } from "@/lib/money";
import { getCurrentSeason, type Season } from "@/lib/season";
import { CLAIMS, FREE_SHIPPING_THRESHOLD, HANDLES } from "@/lib/store-config";

/** The one deadline that's true today (every date from season.christmas / src/lib/delivery.ts). */
function deadline(season: Season): string {
  const { today, christmas } = season;
  if (season.mode !== "christmas-last-minute") return lpBarCopy.orderBy(formatMonthDay(christmas.standardOrderBy));
  if (CLAIMS.priorityShipping && christmas.priorityOrderBy && today <= christmas.priorityOrderBy) {
    return lpBarCopy.priorityBy(formatMonthDay(christmas.priorityOrderBy));
  }
  return lpBarCopy.afterCutoff;
}

/**
 * Landing-page bar above the minimal header: one fixed message, no rotation
 * and no link (the page has one job). "Order by Dec 15 for Christmas · The set
 * ships free", with the free-shipping half only while that claim is confirmed
 * and the set's catalog price really clears the threshold.
 */
export async function LpDeadlineBar() {
  const [season, set] = await Promise.all([getCurrentSeason(), getProduct(HANDLES.completeSet)]);
  const setPrice = set?.variants.find((v) => v.availableForSale)?.price;
  const setShipsFree = CLAIMS.freeShipping && setPrice !== undefined && toNumber(setPrice) >= FREE_SHIPPING_THRESHOLD;
  const text = [deadline(season), setShipsFree ? lpBarCopy.setShipsFree : null].filter(Boolean).join(" · ");

  return (
    <aside aria-label={lpBarCopy.label} className="bg-night text-gold">
      <p className="container-page py-2 text-center text-[0.8125rem] font-semibold leading-5 sm:text-sm">{text}</p>
    </aside>
  );
}
