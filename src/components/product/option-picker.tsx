import { useId } from "react";
import { Price } from "@/components/ui/price";
import { SHIPPING_NOTES } from "@/content/pdp";
import type { Money } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { formatMoney, toNumber } from "@/lib/money";

export type PickerOption = {
  value: string;
  label: string;
  price: Money;
  compareAtPrice?: Money | null;
  /** Tiles: the third line when there's no compare-at ("+ $5.99 shipping"). */
  note?: string;
  /** Tiles: one pill on the tile's top edge ("Best value"). */
  tag?: string;
  /** Tiles: "Ships free" beside the price. */
  shipsFree?: boolean;
  disabled?: boolean;
};

type Props = {
  legend: string;
  /** Radio group name (unique per page). */
  name: string;
  options: PickerOption[];
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  /**
   * "tiles": two side-by-side offer tiles (gift picker): label, price, one note line.
   * "grid": side-by-side format choices (Printed / PDF).
   */
  layout?: "tiles" | "grid";
  className?: string;
};

const radioClass =
  "size-5 shrink-0 cursor-[inherit] appearance-none rounded-full border-2 border-field bg-paper transition-[border] checked:border-[6px] checked:border-forest";

/**
 * Radio cards with the price on every option. Native radios, so arrow keys,
 * labels and form semantics come for free. Used from the buy box island.
 */
export function OptionPicker({ legend, name, options, value, onChange, helper, layout = "grid", className }: Props) {
  const helperId = useId();
  const tiles = layout === "tiles";
  return (
    <fieldset className={cn("min-w-0", className)} aria-describedby={helper ? helperId : undefined}>
      {/* On phones the tile labels say it all; the legend stays for screen readers. */}
      <legend className={cn("mb-2 text-sm font-bold text-ink", tiles && "max-sm:sr-only")}>{legend}</legend>
      <div className={cn("grid grid-cols-2 gap-2", tiles && "gap-2.5 pt-2 sm:pt-1.5")}>
        {options.map((option) => {
          const radio = (
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
              className={radioClass}
            />
          );
          const label = <span className="font-semibold leading-tight text-ink">{option.label}</span>;
          const cardClass = cn(
            "relative flex cursor-pointer flex-col rounded-(--radius-btn) border-2 border-line bg-paper transition-colors",
            "hover:border-ink/25 has-checked:border-forest has-checked:bg-forest-light/50",
            "has-disabled:cursor-not-allowed has-disabled:opacity-55",
          );

          if (!tiles) {
            return (
              <label key={option.value} className={cn(cardClass, "min-h-12 gap-1 px-3.5 py-2.5")}>
                <span className="flex items-center gap-3">
                  {radio}
                  {label}
                </span>
                <span className="pl-8">
                  <Price price={option.price} compareAtPrice={option.compareAtPrice} size="sm" />
                </span>
              </label>
            );
          }

          const compareAt =
            option.compareAtPrice && toNumber(option.compareAtPrice) > toNumber(option.price)
              ? option.compareAtPrice
              : null;
          return (
            <label key={option.value} className={cn(cardClass, "gap-0.5 px-2.5 pb-2 pt-2.5 sm:px-3 sm:pb-2.5 sm:pt-3")}>
              {option.tag ? (
                <span className="absolute -top-2.5 right-2.5 whitespace-nowrap rounded-full bg-ember px-2 py-px text-xs font-bold uppercase leading-4 tracking-[0.06em] text-white">
                  {option.tag}
                </span>
              ) : null}
              <span className="flex items-center gap-2 max-sm:text-[0.9375rem]">
                {radio}
                {label}
              </span>
              <span className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 whitespace-nowrap">
                <span className="font-display text-lg font-semibold tabular-nums text-ink">
                  <span className="sr-only">Price </span>
                  {formatMoney(option.price)}
                </span>
                {option.shipsFree ? (
                  <span className="text-xs font-bold text-forest-dark">· {SHIPPING_NOTES.shipsFree}</span>
                ) : null}
              </span>
              {/* One note line on every tile, so both tiles are the same height. */}
              <span className="min-h-4 text-xs leading-4 text-muted">
                {compareAt ? (
                  <>
                    <s className="tabular-nums decoration-1">
                      <span className="sr-only">Price if bought separately </span>
                      {formatMoney(compareAt)}
                    </s>
                    <span aria-hidden> separately</span>
                  </>
                ) : (
                  option.note
                )}
              </span>
            </label>
          );
        })}
      </div>
      {helper ? (
        // Tiles on phones: the gallery swaps to the chosen photo, so the helper is
        // left to screen readers (it still describes the group) to keep the button on screen.
        <p id={helperId} className={cn("mt-2 text-sm leading-snug text-muted", tiles && "max-sm:sr-only")}>
          {helper}
        </p>
      ) : null}
    </fieldset>
  );
}
