import Link from "next/link";
import {
  Download,
  Gift,
  Mail,
  MessageCircleQuestionMark,
  Package,
  PenLine,
  Printer,
  ShieldCheck,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";
import {
  fill,
  trustGiftNote,
  trustItems,
  trustItemsDigital,
  type TrustItem,
  type TrustItemId,
} from "@/content/home-top";
import { getProduct } from "@/lib/commerce";
import { cn } from "@/lib/cn";
import { CLAIMS, HANDLES } from "@/lib/store-config";

const icons: Record<TrustItemId, LucideIcon> = {
  shipping: Truck,
  "ships-from": Package,
  reviews: Star,
  signed: PenLine,
  guarantee: ShieldCheck,
  "gift-note": Gift,
  instant: Download,
  print: Printer,
  email: Mail,
  help: MessageCircleQuestionMark,
};

/** Where an item links when the copy doesn't set its own href. */
const defaultHrefs: Partial<Record<TrustItemId, string>> = {
  guarantee: "/returns",
};

/**
 * Items that make a claim Tiffany hasn't confirmed yet are never shown
 * (CLAIMS in store-config): no signed-copy promise until the cart can take the
 * request, no guarantee or free-shipping line until they're signed off.
 */
function claimAllowed(id: TrustItemId): boolean {
  if (id === "signed") return CLAIMS.signedCopies;
  if (id === "guarantee") return CLAIMS.moneyBackGuarantee;
  if (id === "shipping") return CLAIMS.freeShipping;
  return true;
}

type Props = {
  /** 'band': the homepage row under the hero (all items). 'inline': compact rows under a buy button. */
  variant?: "band" | "inline";
  /** Exactly these items, in this order (e.g. the buy box's shipping · guarantee · ships-from · gift note). */
  ids?: readonly TrustItemId[];
  /** Maximum number of items. Defaults to all for 'band' and 4 for 'inline'. */
  limit?: number;
  /** Use the digital-product row (copy deck §3.0a) instead of §1.4. */
  digital?: boolean;
  /**
   * Leave out the "{count} five-star reviews" item. Those are Nephite Christmas
   * reviews, so pass false on products that don't include it (e.g. Easter Journey).
   */
  showReviews?: boolean;
  className?: string;
};

/** The reviews item with its count filled from the Nephite Christmas catalog rating (never Amazon). */
async function reviewsItem(item: TrustItem): Promise<TrustItem | null> {
  const nc = await getProduct(HANDLES.nephiteChristmas);
  const site = nc?.ratings.find((r) => r.source === "site" && r.count > 0);
  // "five-star" is only true while the site average is a perfect 5.
  if (!site || site.value < 5) return null;
  const text = fill(item.text, { count: site.count });
  // Any sub-line that still has an unfilled token (e.g. an Amazon count) is dropped.
  const sub = item.sub && !/\{\w+\}/.test(item.sub) ? item.sub : undefined;
  return { ...item, text, sub };
}

async function resolveItems({ ids, digital, showReviews }: Pick<Props, "ids" | "digital" | "showReviews">) {
  const pool = digital && !ids ? trustItemsDigital : [...trustItems, trustGiftNote, ...trustItemsDigital];
  const byId = new Map<TrustItemId, TrustItem>();
  for (const item of pool) if (!byId.has(item.id)) byId.set(item.id, item);
  const order = ids ?? (digital ? trustItemsDigital : trustItems).map((i) => i.id);

  const items: TrustItem[] = [];
  for (const id of order) {
    const item = byId.get(id);
    if (!item || !claimAllowed(id)) continue;
    if (id === "reviews") {
      if (!showReviews) continue;
      const filled = await reviewsItem(item);
      if (filled) items.push(filled);
      continue;
    }
    items.push({ ...item, href: item.href ?? defaultHrefs[id] });
  }
  return items;
}

/** Store promises (shipping, guarantee, ships-from, gift note…), as a band or a compact buy-box row. */
export async function TrustStrip({
  variant = "band",
  ids,
  limit,
  digital = false,
  showReviews = true,
  className,
}: Props) {
  const all = await resolveItems({ ids, digital, showReviews });
  const items = all.slice(0, limit ?? (variant === "inline" && !ids ? 4 : all.length));
  if (items.length === 0) return null;

  if (variant === "inline") {
    return (
      <ul className={cn("grid grid-cols-2 gap-x-4 gap-y-3", className)}>
        {items.map((item) => {
          const Icon = icons[item.id];
          return (
            <li key={item.id} className="flex items-start gap-2.5">
              <Icon aria-hidden className="mt-0.5 size-[1.125rem] shrink-0 text-forest" strokeWidth={1.75} />
              <span className="min-w-0 text-sm leading-snug">
                <ItemText item={item} className="font-semibold text-ink" />
                {item.sub ? <span className="mt-0.5 block text-xs text-muted">{item.sub}</span> : null}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  const odd = items.length % 2 === 1;
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6",
        items.length >= 5 ? "md:grid-cols-3 lg:grid-cols-5" : "md:grid-cols-4",
        className,
      )}
    >
      {items.map((item, i) => {
        const Icon = icons[item.id];
        const lastOdd = odd && i === items.length - 1;
        return (
          <li
            key={item.id}
            className={cn("flex items-start gap-3", lastOdd && "col-span-2 md:col-span-1")}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-light text-forest">
              <Icon aria-hidden className="size-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 pt-0.5 text-sm leading-snug">
              <ItemText item={item} className="font-semibold text-ink" />
              {item.sub ? <span className="mt-1 block text-[0.8125rem] text-muted">{item.sub}</span> : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function ItemText({ item, className }: { item: TrustItem; className?: string }) {
  if (!item.href) return <span className={cn("block", className)}>{item.text}</span>;
  return (
    <Link
      href={item.href}
      className={cn(
        "block underline decoration-periwinkle/50 underline-offset-4 hover:decoration-periwinkle",
        className,
      )}
    >
      {item.text}
    </Link>
  );
}
