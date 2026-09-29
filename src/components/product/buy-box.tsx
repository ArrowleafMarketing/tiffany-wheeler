"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { BuyNowButton } from "@/components/cart/buy-now-button";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { Price } from "@/components/ui/price";
import { PDP_COPY } from "@/content/pdp";
import { track } from "@/lib/analytics";
import type { Image, Money } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { formatMoney, toNumber } from "@/lib/money";
import { CONTACT_EMAIL } from "@/lib/store-config";
import { OptionPicker } from "./option-picker";

/** One thing the buy box can add: a variant of this product, or (gift picker) of another product. */
export type BuyItem = {
  /** Unique key; the variant id. */
  key: string;
  productHandle: string;
  productTitle: string;
  /** Short product name for the sticky bar and the repeat row ("The Complete Set"). */
  name: string;
  variantId: string;
  variantTitle: string;
  /** Picker label ("Just the book"). */
  label: string;
  /** Gift-picker tile: shipping note under the price ("+ $5.99 shipping"). */
  note?: string;
  /** Gift-picker tile: pill on the tile's top edge ("Best value"). */
  tag?: string;
  price: Money;
  /** A real, sum-of-parts compare-at (always shown as "separately"). */
  compareAtPrice: Money | null;
  /** Ships free at this price (only set while the free-shipping claim is confirmed). */
  shipsFree?: boolean;
  /** This product's own site rating (never a borrowed one); for compact stars. */
  rating?: { value: number; count: number };
  available: boolean;
  requiresShipping: boolean;
  thumbnail?: Image;
  /** Gallery image to show when this item is selected. */
  imageIndex?: number;
};

export type BuyBoxConfig = {
  /** The page's product, for view_item. */
  productHandle: string;
  productTitle: string;
  items: BuyItem[];
  defaultKey: string;
  picker: null | {
    kind: "gift" | "format";
    legend: string;
    helper?: string;
  };
  /** Query param that preselects a format, e.g. ?format=pdf (legacy PDF URL). */
  preselectParam?: string;
};

type BuyBoxState = {
  config: BuyBoxConfig;
  current: BuyItem;
  select: (key: string) => void;
  quantity: number;
  setQuantity: (n: number) => void;
};

const BuyBoxContext = createContext<BuyBoxState | null>(null);

/** DOM ids / attributes shared with the sticky bar's observers. */
export const BUY_CTA_ID = "pdp-buy-cta";
export const PDP_END_ID = "pdp-end";
/** Every in-page Add to Cart row carries `data-buy-cta`; the sticky bar hides while any of them is on screen. */
export const BUY_CTA_SELECTOR = "[data-buy-cta]";

const noopSubscribe = () => () => {};

function matchPreselect(config: BuyBoxConfig, search: string): string | null {
  if (!config.preselectParam || !search) return null;
  const wanted = new URLSearchParams(search).get(config.preselectParam)?.trim().toLowerCase();
  if (!wanted) return null;
  const hit = config.items.find(
    (i) => i.variantTitle.toLowerCase().includes(wanted) || i.label.toLowerCase().includes(wanted),
  );
  return hit?.key ?? null;
}

/**
 * Holds the selection (variant or cross-product option) and quantity for the
 * gallery, buy box, repeat row and sticky bar. Server-rendered content can sit inside it.
 */
export function BuyBoxProvider({ config, children }: { config: BuyBoxConfig; children: ReactNode }) {
  // Read ?format=… after hydration without making the page dynamic.
  const search = useSyncExternalStore(
    noopSubscribe,
    () => window.location.search,
    () => "",
  );
  const [picked, setPicked] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const preselected = useMemo(() => matchPreselect(config, search), [config, search]);
  const selectedKey = picked ?? preselected ?? config.defaultKey;
  const current =
    config.items.find((i) => i.key === selectedKey) ??
    config.items.find((i) => i.key === config.defaultKey) ??
    config.items[0];

  // view_item once per mount; effects re-run when a hidden (Activity) route is re-shown.
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    const item = config.items.find((i) => i.key === config.defaultKey) ?? config.items[0];
    const price = toNumber(item.price);
    track("view_item", {
      value: price,
      items: [
        {
          item_id: config.productHandle,
          item_name: config.productTitle,
          item_variant: item.variantTitle,
          price,
          quantity: 1,
        },
      ],
    });
  }, [config]);

  const value = useMemo<BuyBoxState>(
    () => ({ config, current, select: setPicked, quantity, setQuantity }),
    [config, current, quantity],
  );

  return <BuyBoxContext.Provider value={value}>{children}</BuyBoxContext.Provider>;
}

export function useBuyBox(): BuyBoxState {
  const ctx = useContext(BuyBoxContext);
  if (!ctx) throw new Error("useBuyBox must be used inside <BuyBoxProvider>");
  return ctx;
}

/** For components (gallery) that also work outside a buy box. */
export function useOptionalBuyBox(): BuyBoxState | null {
  return useContext(BuyBoxContext);
}

/** Server-rendered content for items that ship, or for digital items. */
type Slot = {
  /** Directly under Add to Cart: the delivery line (§4.4). */
  delivery?: ReactNode;
  /** Under Buy Now: the trust row. */
  below?: ReactNode;
};

type Slots = { physical?: Slot; digital?: Slot };

/** Gift-picker tiles, shared by the buy box and the repeat row. */
export function BuyPicker({ name, className }: { name: string; className?: string }) {
  const { config, current, select } = useBuyBox();
  const { picker } = config;
  if (!picker) return null;
  return (
    <OptionPicker
      legend={picker.legend}
      name={name}
      layout={picker.kind === "gift" ? "tiles" : "grid"}
      helper={picker.helper}
      value={current.key}
      onChange={select}
      className={className}
      options={config.items.map((item) => ({
        value: item.key,
        label: item.label,
        note: item.note,
        tag: item.tag,
        shipsFree: picker.kind === "gift" ? item.shipsFree : undefined,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        disabled: !item.available,
      }))}
    />
  );
}

/**
 * Price, option picker, Add to Cart, the delivery line and Buy Now. On phones the
 * gift picker's tiles carry the prices, so the big price moves into the button
 * ("Add to Cart · $24.99") and the quantity stepper stays in the cart drawer:
 * that keeps the whole choice and the button on the first screen.
 */
export function BuyBox({ slots, className }: { slots?: Slots; className?: string }) {
  const { config, current, quantity, setQuantity } = useBuyBox();
  const { picker } = config;
  const unitPrice = toNumber(current.price);
  const atMax = quantity >= PDP_COPY.maxQuantity;
  const slot = current.requiresShipping ? slots?.physical : (slots?.digital ?? slots?.physical);
  const tilesCarryPrice = picker?.kind === "gift";

  return (
    <div className={cn("grid gap-3 sm:gap-5", className)}>
      <div className={cn(tilesCarryPrice && "max-sm:hidden")}>
        <Price
          price={current.price}
          compareAtPrice={current.compareAtPrice}
          compareAtLabel="if bought separately"
          size="xl"
          showSavings
        />
      </div>

      {picker ? <BuyPicker name={`${config.productHandle}-${picker.kind}`} /> : null}

      <div className="grid gap-3">
        <div id={BUY_CTA_ID} data-buy-cta="" className="flex gap-3">
          {current.available ? (
            // The drawer has its own stepper; on phones the button gets the full width.
            <div className="hidden shrink-0 sm:block">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={PDP_COPY.maxQuantity}
                label={`${PDP_COPY.quantityLabel} for ${current.productTitle}`}
                className="h-14"
              />
            </div>
          ) : null}
          <AddToCartButton
            key={current.key}
            variantId={current.variantId}
            productHandle={current.productHandle}
            productTitle={current.productTitle}
            variantTitle={current.variantTitle}
            price={unitPrice}
            quantity={quantity}
            available={current.available}
            size="lg"
            className="min-w-0 flex-1 px-4"
          >
            {PDP_COPY.addToCart}
            {tilesCarryPrice ? <span className="sm:hidden">· {formatMoney(current.price)}</span> : null}
          </AddToCartButton>
        </div>
        {atMax ? (
          <p className="text-sm text-muted">
            {PDP_COPY.maxQuantityNote}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Bulk order")}`}
              className="font-semibold text-periwinkle-text underline underline-offset-2"
            >
              {PDP_COPY.maxQuantityLink}
            </a>
          </p>
        ) : null}
        {slot?.delivery ? <div className="grid gap-1.5">{slot.delivery}</div> : null}
        {current.available ? (
          <BuyNowButton
            variantId={current.variantId}
            productHandle={current.productHandle}
            productTitle={current.productTitle}
            variantTitle={current.variantTitle}
            price={unitPrice}
            quantity={quantity}
            variant="outline"
            size="md"
            block
          >
            {PDP_COPY.buyNow}
          </BuyNowButton>
        ) : null}
      </div>

      {slot?.below ? <div className="grid gap-4">{slot.below}</div> : null}
    </div>
  );
}
