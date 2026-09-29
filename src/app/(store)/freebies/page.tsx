import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmailCaptureForm } from "@/components/home/email-capture-form";
import { InfoPageShell } from "@/components/info/info-page-shell";
import { ProductCard } from "@/components/product/product-card";
import { Img } from "@/components/ui/img";
import { SectionHeading } from "@/components/ui/section-heading";
import { emailCaptureCopy } from "@/content/home-bottom";
import { freebiesCopy as copy } from "@/content/info";
import { getProducts } from "@/lib/commerce";
import { cn } from "@/lib/cn";
import { fromStatic } from "@/lib/images";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: "/freebies" },
};

// Form labels and fine print are shared with the homepage signup, so both
// promise the same thing.
const signup = emailCaptureCopy.section;
const pages = copy.inside.items.map((item) => ({ ...item, image: fromStatic(item.image, "") }));
const tilts = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3"];

export default async function FreebiesPage() {
  const found = await getProducts({ handles: [...copy.more.handles] });
  const more = copy.more.handles.flatMap((handle) => found.filter((p) => p.handle === handle));

  return (
    <InfoPageShell layout="bands" hero={<Hero />}>
      <section aria-labelledby="pack-inside-title" className="bg-cream py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading id="pack-inside-title" title={copy.inside.title} subtitle={copy.inside.subtitle} />
          <ul className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pages.map((item) => (
              <li
                key={item.label}
                className="flex flex-col rounded-(--radius-card) border border-line bg-paper p-4 shadow-soft"
              >
                <div className="mx-auto w-40 overflow-hidden rounded-[4px] bg-white p-1 shadow-soft ring-1 ring-black/10 sm:w-full">
                  <Img
                    image={item.image}
                    alt={`Preview of the ${item.label} printable`}
                    sizes="(min-width: 1024px) 200px, (min-width: 640px) 40vw, 160px"
                    className="h-auto w-full"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug">{item.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-body">{item.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="pack-ideas-title" className="bg-paper py-14 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl">
            <h2 id="pack-ideas-title" className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] sm:text-4xl">
              {copy.ideas.title}
            </h2>
            <ul className="mt-6 space-y-3 text-base leading-relaxed text-body sm:text-lg">
              {copy.ideas.items.map((idea) => (
                <li key={idea} className="flex gap-3">
                  <Check aria-hidden className="mt-1 size-5 shrink-0 text-forest" strokeWidth={2.5} />
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {more.length > 0 ? (
        <section aria-labelledby="pack-more-title" className="bg-cream-deep py-14 sm:py-20">
          <div className="container-page">
            <SectionHeading id="pack-more-title" title={copy.more.title} subtitle={copy.more.subtitle} />
            <ul className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((product) => (
                <li key={product.handle}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </InfoPageShell>
  );
}

/**
 * The page's one action on the first screen: heading, the four pages and the
 * email field together on night blue (no second hero repeating the pitch).
 */
function Hero() {
  return (
    <header className="relative overflow-hidden bg-night text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 size-[36rem] -translate-y-1/2 rounded-full bg-night-light/70 blur-3xl"
      />
      <div className="container-page relative grid items-center gap-6 pb-10 pt-6 sm:gap-8 sm:pb-14 sm:pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-16">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="mb-2 font-hand text-xl leading-none text-gold sm:text-2xl">{copy.eyebrow}</p>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.015em] text-white sm:text-5xl lg:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/85 sm:mt-4 sm:text-lg">{copy.intro}</p>
        </div>

        {/* The four printables, one accessible image for the group. */}
        <div
          role="img"
          aria-label={copy.previewsAlt}
          className="mx-auto grid w-full max-w-sm grid-cols-4 gap-3 sm:max-w-md sm:gap-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-sm lg:grid-cols-2 lg:gap-7"
        >
          {pages.map((item, i) => (
            <div key={item.label} className={cn("flex flex-col items-center", tilts[i])}>
              <div className="w-full overflow-hidden rounded-[3px] bg-white p-0.5 shadow-lift ring-1 ring-black/10 sm:p-1">
                <Img
                  image={item.image}
                  sizes="(min-width: 1024px) 176px, (min-width: 640px) 104px, 20vw"
                  eager
                  className="h-auto w-full"
                />
              </div>
              <span aria-hidden className="mt-1.5 text-center text-[0.6875rem] font-semibold leading-tight text-white/75 sm:text-xs">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <EmailCaptureForm
            variant="section"
            inverted
            source="freebies"
            labels={{ inputLabel: signup.inputLabel, placeholder: signup.placeholder, button: signup.button }}
            successFollowUp={signup.successFollowUp}
            successCta={signup.successCta}
            className="max-w-xl"
          />
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 sm:text-sm">
            {signup.finePrint}{" "}
            <Link href={signup.privacyHref} className="font-semibold text-white underline underline-offset-2 hover:text-gold">
              {signup.privacyLabel}
            </Link>
            .
          </p>
        </div>
      </div>
    </header>
  );
}
