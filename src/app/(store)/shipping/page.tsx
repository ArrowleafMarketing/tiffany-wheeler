import { Download, Package, Truck, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { ChristmasDeliveryTable } from "@/components/info/christmas-delivery-table";
import { christmasPlan } from "@/components/info/delivery-dates";
import { EasterDeliveryNote } from "@/components/info/easter-delivery-note";
import { InfoBlocks } from "@/components/info/info-blocks";
import { InfoSection } from "@/components/info/info-section";
import { InfoPageShell } from "@/components/info/info-page-shell";
import { shippingCopy as copy, type ShippingIcon } from "@/content/info";
import { formatSeasonDate, getCurrentSeason, type Season } from "@/lib/season";
import { CLAIMS } from "@/lib/store-config";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: "/shipping" },
};

const icons: Record<ShippingIcon, LucideIcon> = { truck: Truck, package: Package, download: Download };

type SectionKey = "christmas" | "easter" | "rates" | "timing" | "pickup" | "madeToOrder" | "gifts" | "problems";

/** The holiday people are ordering for comes first. Pickup only while it's offered (CLAIMS.localPickup). */
function sectionOrder(season: Season): SectionKey[] {
  const rest: SectionKey[] = ["madeToOrder", "gifts", "problems"];
  const pickup: SectionKey[] = CLAIMS.localPickup ? ["pickup"] : [];
  if (season.mode === "christmas" || season.mode === "christmas-last-minute") {
    return ["christmas", "rates", "timing", ...pickup, "easter", ...rest];
  }
  if (season.mode === "easter" || season.mode === "after-christmas") {
    return ["easter", "rates", "timing", ...pickup, "christmas", ...rest];
  }
  return ["rates", "timing", ...pickup, "christmas", "easter", ...rest];
}

const jumpFor: Partial<Record<SectionKey, string>> = {
  christmas: "#christmas-delivery",
  easter: "#easter-delivery",
  rates: "#rates",
  pickup: "#pickup",
};

export default async function ShippingPage() {
  const season = await getCurrentSeason();
  const plan = christmasPlan(season);
  const order = sectionOrder(season);

  const sections: Record<SectionKey, ReactNode> = {
    christmas: (
      <InfoSection id={copy.christmas.id} eyebrow={copy.christmas.eyebrow} title={copy.christmas.title}>
        <p className="mb-4 text-base leading-relaxed text-body sm:text-[1.0625rem]">{copy.christmas.intro}</p>
        <ChristmasDeliveryTable season={season} />
      </InfoSection>
    ),
    easter: (
      <InfoSection id={copy.easter.id} eyebrow={copy.easter.eyebrow} title={copy.easter.title}>
        <EasterDeliveryNote season={season} />
      </InfoSection>
    ),
    rates: (
      <InfoSection id={copy.rates.id} title={copy.rates.title}>
        <div className="overflow-hidden rounded-(--radius-card) border border-line bg-paper shadow-soft">
          <table className="w-full border-collapse text-left">
            <thead className="border-b border-line bg-cream-deep/60">
              <tr className="text-xs font-bold uppercase tracking-[0.06em] text-muted">
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  {copy.rates.colOrder}
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold sm:px-5">
                  {copy.rates.colCost}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {copy.rates.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="px-4 py-3.5 font-semibold text-ink sm:px-5">
                    {row.label}
                  </th>
                  <td className="px-4 py-3.5 text-right font-display text-lg font-semibold text-ink tabular-nums sm:px-5">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <InfoBlocks blocks={[{ list: copy.rates.notes }]} className="mt-5" />
      </InfoSection>
    ),
    timing: (
      <InfoSection id={copy.timing.id} title={copy.timing.title}>
        <InfoBlocks blocks={copy.timing.blocks} />
      </InfoSection>
    ),
    pickup: (
      <InfoSection id={copy.pickup.id} eyebrow={copy.pickup.eyebrow} title={copy.pickup.title}>
        <InfoBlocks
          blocks={
            plan.pickupThrough
              ? [...copy.pickup.blocks, copy.pickup.christmas(formatSeasonDate(plan.pickupThrough, { weekday: true }))]
              : copy.pickup.blocks
          }
        />
      </InfoSection>
    ),
    madeToOrder: (
      <InfoSection id={copy.madeToOrder.id} title={copy.madeToOrder.title}>
        <InfoBlocks blocks={copy.madeToOrder.blocks} />
      </InfoSection>
    ),
    gifts: (
      <InfoSection id={copy.gifts.id} title={copy.gifts.title}>
        <InfoBlocks blocks={copy.gifts.blocks} />
      </InfoSection>
    ),
    problems: (
      <InfoSection id={copy.problems.id} title={copy.problems.title}>
        <InfoBlocks blocks={copy.problems.blocks} />
      </InfoSection>
    ),
  };

  const jumps = order.flatMap((key) => {
    const href = jumpFor[key];
    const link = copy.jumpLinks.find((l) => l.href === href);
    return link ? [link] : [];
  });

  return (
    <InfoPageShell eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro}>
      <ul className="grid gap-3 sm:grid-cols-3">
        {copy.highlights.map((item) => {
          const Icon = icons[item.icon];
          return (
            <li key={item.title} className="flex items-start gap-3 rounded-(--radius-card) border border-line bg-paper p-4 shadow-soft sm:block">
              <Icon aria-hidden className="mt-0.5 size-6 shrink-0 text-forest sm:mt-0" />
              <div className="sm:mt-2">
                <p className="font-semibold leading-snug text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-snug text-muted">{item.line}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <nav aria-label={copy.jumpLabel} className="mt-8">
        <ul className="flex flex-wrap gap-2">
          {jumps.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink transition-colors hover:border-periwinkle hover:text-periwinkle-text"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-12 space-y-14 sm:space-y-16">
        {order.map((key) => (
          <Fragment key={key}>{sections[key]}</Fragment>
        ))}
      </div>
    </InfoPageShell>
  );
}
