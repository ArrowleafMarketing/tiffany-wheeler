import doveSrc from "@/assets/images/art/dove.webp";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { BookCover } from "@/components/product/book-cover";
import { ButtonLink, type ButtonVariant } from "@/components/ui/button";
import { Img, fromStatic } from "@/components/ui/img";
import { Stars } from "@/components/ui/stars";
import {
  DEFAULT_SET_LINE,
  fill,
  heroCopy,
  heroPriorityCopy,
  heroRating,
  heroSetLine,
  type HeroAction,
  type HeroCopy,
  type HeroSetLinePart,
} from "@/content/home-top";
import { getProduct } from "@/lib/commerce";
import { dealSticker } from "@/lib/commerce/compare-at-rule";
import type { Money, Product, Variant } from "@/lib/commerce/types";
import { cn } from "@/lib/cn";
import { formatMoney, toNumber } from "@/lib/money";
import { formatDate, formatHolyWeek, formatLongDate, nextEaster } from "@/lib/delivery";
import { getCurrentSeason, type Season } from "@/lib/season";
import { CLAIMS, FREE_SHIPPING_THRESHOLD, HANDLES } from "@/lib/store-config";

const dove = fromStatic(doveSrc, "");

// ── Season date helpers (also used by FeaturedBooksSection) ──────────────────

// Re-exported for FeaturedBooksSection; the implementations live in src/lib/delivery.ts.
export { formatHolyWeek, formatLongDate, nextEaster };

/**
 * The hero copy for a season. Dec 16–17 gets its own variant, but only when
 * Priority shipping is really offered at checkout (CLAIMS.priorityShipping);
 * otherwise the last-minute (PDF-first) hero runs from the day after the
 * standard cutoff.
 */
export function selectHeroCopy(season: Season): HeroCopy {
  const priorityBy = season.christmas.priorityOrderBy;
  if (season.mode === "christmas-last-minute" && CLAIMS.priorityShipping && priorityBy && season.today <= priorityBy) {
    return heroPriorityCopy;
  }
  return heroCopy[season.mode];
}

/** Values for the `{tokens}` in hero copy. */
function heroTokens(season: Season): Record<string, string> {
  const easterIso = season.holiday === "easter" ? season.holidayDate : nextEaster(season.today);
  const priorityBy = season.christmas.priorityOrderBy;
  return {
    easterDate: formatDate(easterIso),
    holyWeek: formatHolyWeek(easterIso),
    resumeShipping: formatDate(season.christmas.resumeShipping, { weekday: true }),
    ...(priorityBy ? { priorityBy: formatDate(priorityBy, { weekday: true }) } : {}),
  };
}

/** A real deal on the button's price, from the price rule (compare-at-rule.ts). */
type Deal = { was: Money; sticker: string; reason: "sale" | "bundle" };

type Resolved =
  | { kind: "add"; label: string; product: Product; tone: ButtonVariant; deal: Deal | null }
  | { kind: "link"; label: string; href: string; deal: Deal | null };

function resolve(action: HeroAction, products: Map<string, Product>, primary: boolean): Resolved | null {
  const priced = action.priceOf ? products.get(action.priceOf) : undefined;
  const pv = priced?.variants.find((v) => v.availableForSale) ?? priced?.variants[0];
  const label = pv ? `${action.label} — ${formatMoney(pv.price)}` : action.label;
  const sticker = pv ? dealSticker(pv.price, pv.compareAtPrice, pv.compareAtReason) : null;
  const deal: Deal | null =
    pv?.compareAtPrice && sticker ? { was: pv.compareAtPrice, sticker, reason: pv.compareAtReason ?? "sale" } : null;
  if (action.add) {
    const product = products.get(action.add);
    if (!product) return null;
    // The set is the "best value" (ember) action; any other purchase is the green primary.
    const tone: ButtonVariant = !primary ? "outline" : action.add === HANDLES.completeSet ? "accent" : "primary";
    return { kind: "add", label, product, tone, deal };
  }
  return action.href ? { kind: "link", label, href: action.href, deal } : null;
}

function HeroButton({ action, className, describedBy }: { action: Resolved; className?: string; describedBy?: string }) {
  // A little shorter on short phone screens so both buttons stay on the first screen,
  // and narrower padding under 360px so "Christmas + Easter Set — $49.99" stays on one line.
  // Under 380px the padding and text tighten so a price plus its struck old price stay on one line.
  const common = cn("w-full short:max-sm:h-12 max-[379px]:px-3.5 max-[379px]:text-[0.9375rem]", className);
  // Same deal display as every other price (Price, compare-at-rule.ts): the old
  // price struck and lighter inside the button, and the sticker on its corner.
  const label = (
    <>
      {action.label}
      {action.deal ? (
        <s className="ml-1.5 text-[0.85em] font-medium tabular-nums opacity-70 decoration-1 max-[339px]:hidden">
          <span className="sr-only">{action.deal.reason === "bundle" ? ", if bought separately " : ", regular price "}</span>
          {formatMoney(action.deal.was)}
        </s>
      ) : null}
    </>
  );
  const sticker = action.deal ? (
    <span
      aria-hidden
      className="pointer-events-none absolute -top-2.5 right-3 z-10 -rotate-3 whitespace-nowrap rounded-md bg-ember px-1.5 py-0.5 text-xs font-bold uppercase leading-tight tracking-[0.06em] text-white shadow-[0_1px_2px_rgb(120_40_10/0.35)]"
    >
      {action.deal.sticker}
    </span>
  ) : null;
  if (action.kind === "link") {
    return (
      <span className="relative block sm:inline-block">
        <ButtonLink href={action.href} variant="outline" size="lg" className={common}>
          {label}
        </ButtonLink>
        {sticker}
      </span>
    );
  }
  const variant = action.product.variants.find((v) => v.availableForSale) ?? action.product.variants[0];
  return (
    <span className="relative block sm:inline-block">
      <AddToCartButton
        variantId={variant.id}
        productHandle={action.product.handle}
        productTitle={action.product.title}
        variantTitle={variant.title}
        price={toNumber(variant.price)}
        available={variant.availableForSale}
        variant={action.tone}
        size="lg"
        className={common}
        describedBy={describedBy}
      >
        {label}
      </AddToCartButton>
      {sticker}
    </span>
  );
}

/** The set line's id: the hero renders once, and only one of its two actions adds the set. */
const SET_NOTE_ID = "hero-set-note";

/** A hero button, with the set's line tight under it (and read with it) when it adds the Complete Set. */
function HeroOption({ action, note }: { action: Resolved; note: string | null }) {
  if (!note) return <HeroButton action={action} />;
  return (
    <div className="flex flex-col gap-1.5">
      <HeroButton action={action} describedBy={SET_NOTE_ID} />
      <p id={SET_NOTE_ID} className="text-[0.8125rem] font-medium leading-tight text-ink sm:pl-1">
        {note}
      </p>
    </div>
  );
}

/**
 * "One for His birth, one for His Resurrection · Ships free". Each part only
 * renders while it's true: ships free needs CLAIMS.freeShipping and a set price
 * over the threshold, savings needs a compare-at above the price.
 */
function setLineText(parts: readonly HeroSetLinePart[], variant: Variant): string | null {
  const price = toNumber(variant.price);
  const compareAt = variant.compareAtPrice ? toNumber(variant.compareAtPrice) : 0;
  const text = parts.flatMap((part) => {
    if (part === "shipsFree") {
      const free = CLAIMS.freeShipping && variant.requiresShipping && price >= FREE_SHIPPING_THRESHOLD;
      return free ? [heroSetLine.shipsFree] : [];
    }
    if (part === "savings") {
      return compareAt > price ? [fill(heroSetLine.savings, { savings: formatMoney(compareAt - price) })] : [];
    }
    return [heroSetLine.why];
  });
  return text.length ? text.join(" · ") : null;
}

/**
 * Homepage hero and ad landing view (copy deck §2.1, §2.15). The lead book's
 * cover is the page's only preloaded image.
 *
 * The DOM follows the phone layout (books, rating, lead-in, H1, lede, buttons),
 * so reading and focus order match what's on screen; from lg the books move to
 * the right column and the text order stays the same.
 */
export async function HeroSection({ season: override }: { season?: Season } = {}) {
  const season = override ?? (await getCurrentSeason());
  const copy = selectHeroCopy(season);
  const easterLeads = season.featured === "easter";

  const handles = new Set<string>([HANDLES.nephiteChristmas, HANDLES.easterJourney, HANDLES.completeSet]);
  for (const a of [copy.primary, copy.secondary]) {
    if (a.add) handles.add(a.add);
    if (a.priceOf) handles.add(a.priceOf);
  }
  const loaded = await Promise.all([...handles].map((h) => getProduct(h)));
  const products = new Map(loaded.filter((p): p is Product => p !== null).map((p) => [p.handle, p]));
  const nc = products.get(HANDLES.nephiteChristmas);
  const ej = products.get(HANDLES.easterJourney);
  const set = products.get(HANDLES.completeSet);
  if (!nc || !ej) return null;

  const primary = resolve(copy.primary, products, true);
  const secondary = resolve(copy.secondary, products, false);

  const tokens = heroTokens(season);
  const text = (s: string) => fill(s, tokens);

  const setVariant = set?.variants.find((v) => v.availableForSale) ?? set?.variants[0];
  const setLine = setVariant ? setLineText(copy.setLine ?? DEFAULT_SET_LINE, setVariant) : null;
  const noteFor = (action: HeroAction) => (action.add === HANDLES.completeSet ? setLine : null);

  // Nephite Christmas reviews only; never shown next to an Easter Journey offer.
  const site = easterLeads ? undefined : nc.ratings.find((r) => r.source === "site" && r.count > 0);

  const front = easterLeads ? ej : nc;
  const back = easterLeads ? nc : ej;

  return (
    // Exactly one screen: the viewport (svh, so browser toolbars count) minus the
    // announcement bar and header. Everything in the hero sizes itself to fit, so
    // the whole offer is visible on arrival and the trust band starts at the fold.
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[calc(100svh-var(--site-chrome))] flex-col justify-center overflow-hidden bg-hero lg:min-h-[min(calc(100svh-var(--site-chrome)),60rem)]"
    >
      <HeroBackdrop easter={easterLeads} />

      <div className="container-page grid w-full items-center gap-2.5 py-3 short:max-sm:gap-1.5 short:max-sm:py-2 sm:gap-6 sm:py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:py-10 short:lg:py-6">
        {/* Books: above the headline on phones, the right-hand column from lg. Sized by screen height, so very short screens keep the buttons in view. */}
        <div className="lg:col-start-2 lg:row-start-1">
          <div
            role="img"
            aria-label={copy.imageAlt}
            className="hero-settle relative mx-auto aspect-[2.15/1] w-[min(100%,24rem,48svh)] shorter:max-lg:w-[min(100%,24rem,42svh,66vw)] sm:aspect-[2/1] sm:w-[min(100%,30rem,48svh)] lg:aspect-[1/0.92] lg:w-[min(100%,calc((100svh-var(--site-chrome)-5rem)/0.92))]"
          >
            <HeroSparkles easter={easterLeads} />
            {/* soft ground shadow */}
            <div
              aria-hidden
              className={cn(
                "absolute bottom-[-3%] h-[9%] rounded-[50%] bg-ink/25 blur-xl",
                easterLeads ? "left-[18%] right-[6%]" : "left-[6%] right-[14%]",
              )}
            />
            <div
              className={cn(
                "absolute",
                easterLeads
                  ? "left-[4%] top-[5%] w-[46%] -rotate-6 lg:left-0 lg:top-[6%] lg:w-[58%]"
                  : "right-[6%] top-[3%] w-[33%] rotate-[7deg] lg:right-[1%] lg:top-[4%] lg:w-[44%]",
              )}
            >
              <BookCover
                cover={{ ...back.images[0], alt: "" }}
                sizes={easterLeads ? "(min-width: 1024px) 290px, (min-width: 640px) 220px, 46vw" : "(min-width: 1024px) 220px, (min-width: 640px) 160px, 33vw"}
              />
            </div>
            <div
              className={cn(
                "absolute",
                easterLeads
                  ? "bottom-[2%] right-[16%] w-[38%] rotate-[1.5deg] lg:bottom-[4%] lg:right-[4%] lg:w-[60%]"
                  : "bottom-[2%] left-[10%] w-[56%] -rotate-[1.5deg] lg:bottom-[8%] lg:left-0 lg:w-[78%]",
              )}
            >
              <BookCover
                cover={{ ...front.images[0], alt: "" }}
                sizes={easterLeads ? "(min-width: 1024px) 300px, (min-width: 640px) 185px, 38vw" : "(min-width: 1024px) 390px, (min-width: 640px) 270px, 56vw"}
                preload
              />
            </div>
            <div
              aria-hidden
              className={cn(
                "absolute hidden w-[17%] lg:block",
                easterLeads ? "right-[2%] top-[-2%] -scale-x-100 rotate-[8deg]" : "left-[4%] top-[1%] -rotate-[8deg]",
              )}
            >
              <Img image={dove} alt="" sizes="96px" quality={75} className="h-auto w-full drop-shadow-[0_6px_10px_rgb(40_30_80/0.18)]" />
            </div>
          </div>
        </div>

        {/* Copy: proof first, then what it is, then the choice. The trust band right below carries the store promises. */}
        <div className="flex flex-col text-center sm:text-left lg:col-start-1 lg:row-start-1 lg:max-w-[38rem] lg:translate-x-6 xl:translate-x-16">
          {site ? (
            <p className="hero-in -mb-1 flex flex-wrap items-center justify-center gap-x-2 text-sm text-body sm:justify-start">
              <Stars value={site.value} size={17} />
              <a
                href={heroRating.reviewsHref}
                className="relative inline-flex min-h-11 items-center font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
              >
                {fill(heroRating.named, { count: site.count, title: nc.shortTitle ?? nc.title })}
              </a>
            </p>
          ) : null}
          {/* Eyebrows only run in the Easter modes, over the sunrise wash: a shade darker on phones keeps 4.5:1. */}
          {copy.eyebrow ? (
            <p className="hero-in font-hand text-[1.15rem] leading-[1.1] text-periwinkle-text max-sm:text-night-light short:max-sm:text-[1.05rem] sm:text-[1.6rem] short:lg:text-[1.35rem]">
              {text(copy.eyebrow)}
            </p>
          ) : null}
          {/* Phones: grows with screen height, capped by the column width (1rem gutters) so "in the Book of Mormon." (about 10.8em) stays on one line. */}
          <h1
            id="hero-heading"
            className={cn(
              "hero-in [--hero-step:1] text-[min(clamp(1.5rem,3.8svh,2rem),calc((100vw-2rem)/11))] font-semibold leading-[1.08] tracking-[-0.015em] sm:text-[clamp(2rem,6svh,3rem)] sm:leading-[1.05] lg:text-[clamp(2.4rem,5.8svh,3.35rem)]",
              copy.eyebrow && "mt-1.5 sm:mt-3",
            )}
          >
            {text(copy.title)}
          </h1>
          {copy.lede ? (
            <p className="hero-in [--hero-step:2] mt-2 text-[0.9375rem] font-medium leading-snug text-ink max-[359px]:text-[0.8125rem] sm:mt-3 sm:text-lg lg:mt-4">
              {text(copy.lede)}
            </p>
          ) : null}

          {/* The sticky mobile bar appears once this group scrolls away (HomeStickyBar). */}
          <div
            data-sticky-anchor
            className="hero-in [--hero-step:3] mt-3.5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-start lg:mt-7"
          >
            {primary ? <HeroOption action={primary} note={noteFor(copy.primary)} /> : null}
            {secondary ? <HeroOption action={secondary} note={noteFor(copy.secondary)} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Watercolor-like wash behind the books, painted with gradients (no image, so the cover stays the LCP). */
function HeroBackdrop({ easter }: { easter: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className={cn(
          "absolute left-1/2 top-[-6rem] h-[30rem] w-[44rem] -translate-x-1/2 lg:left-auto lg:right-[-14rem] lg:top-1/2 lg:h-[52rem] lg:w-[64rem] lg:-translate-y-1/2 lg:translate-x-0",
          easter
            ? "bg-radial from-sunrise from-15% via-sunrise/45 via-45% to-transparent to-70%"
            : "bg-radial from-periwinkle/30 from-10% via-periwinkle/12 via-45% to-transparent to-70%",
        )}
      />
      <div
        className={cn(
          "absolute left-1/2 top-0 h-[14rem] w-[22rem] -translate-x-1/2 lg:left-auto lg:right-[8%] lg:top-[18%] lg:h-[26rem] lg:w-[34rem] lg:translate-x-0",
          easter
            ? "bg-radial from-butter/90 from-10% to-transparent to-70%"
            : "bg-radial from-gold/45 from-5% via-gold/15 via-35% to-transparent to-70%",
        )}
      />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-hero" />
    </div>
  );
}

/** A handful of small four-point stars around the books (decorative; they twinkle unless motion is reduced). */
function HeroSparkles({ easter }: { easter: boolean }) {
  const sparkles: { x: string; y: string; size: number; tone: string; delay: string; lgOnly?: boolean }[] = easter
    ? [
        { x: "8%", y: "80%", size: 14, tone: "text-gold", delay: "0s" },
        { x: "90%", y: "8%", size: 12, tone: "text-olive/60", delay: "1.2s", lgOnly: true },
        { x: "2%", y: "40%", size: 10, tone: "text-gold", delay: "2.1s", lgOnly: true },
      ]
    : [
        { x: "2%", y: "58%", size: 14, tone: "text-gold", delay: "0s" },
        { x: "46%", y: "0%", size: 11, tone: "text-periwinkle", delay: "1.4s" },
        { x: "95%", y: "70%", size: 13, tone: "text-gold", delay: "0.7s" },
        { x: "36%", y: "10%", size: 18, tone: "text-gold", delay: "2.2s", lgOnly: true },
        { x: "88%", y: "92%", size: 10, tone: "text-periwinkle", delay: "1.8s", lgOnly: true },
        { x: "4%", y: "92%", size: 9, tone: "text-periwinkle", delay: "3s", lgOnly: true },
      ];
  return (
    <>
      {sparkles.map((s) => (
        <svg
          key={`${s.x}-${s.y}`}
          aria-hidden
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          className={cn(
            "absolute fill-current [animation-duration:3.6s] motion-safe:animate-pulse",
            s.tone,
            s.lgOnly && "hidden lg:block",
          )}
          style={{ left: s.x, top: s.y, animationDelay: s.delay }}
        >
          <path d="M12 0c.6 7.2 4.8 11.4 12 12-7.2.6-11.4 4.8-12 12-.6-7.2-4.8-11.4-12-12C7.2 11.4 11.4 7.2 12 0Z" />
        </svg>
      ))}
    </>
  );
}
