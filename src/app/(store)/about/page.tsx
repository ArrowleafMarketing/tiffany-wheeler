import { ArrowRight, Award, ExternalLink, Quote } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageShell } from "@/components/info/info-page-shell";
import { proseLinkClass } from "@/components/info/rich-text";
import { ChurchDisclaimer } from "@/components/layout/church-disclaimer";
import { Logo } from "@/components/layout/logo";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Img } from "@/components/ui/img";
import { SectionHeading } from "@/components/ui/section-heading";
import { aboutCopy as copy } from "@/content/info";
import { getProducts } from "@/lib/commerce";
import { fromStatic } from "@/lib/images";
import { getCurrentSeason } from "@/lib/season";
import { HANDLES, SITE_URL, SOCIAL } from "@/lib/store-config";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: "/about" },
};

const heroPhoto = fromStatic(copy.hero.photo.src, copy.hero.photo.alt);
const portrait = fromStatic(copy.story.photo.src, copy.story.photo.alt);
const ncArt = fromStatic(copy.books.nephiteChristmas.image.src, copy.books.nephiteChristmas.image.alt);
const ejArt = fromStatic(copy.books.easterJourney.image.src, copy.books.easterJourney.image.alt);
const kelley = fromStatic(copy.illustrator.photo.src, copy.illustrator.photo.alt);

const paragraphs = "space-y-5 text-base leading-relaxed text-body sm:text-lg";
const arrowLink =
  "inline-flex min-h-11 items-center gap-1.5 font-semibold text-periwinkle-text underline-offset-4 hover:text-ink hover:underline";

export default async function AboutPage() {
  const season = await getCurrentSeason();
  const order =
    season.featured === "easter"
      ? [HANDLES.easterJourney, HANDLES.nephiteChristmas, HANDLES.completeSet]
      : [HANDLES.nephiteChristmas, HANDLES.easterJourney, HANDLES.completeSet];
  const found = await getProducts({ handles: order });
  const books = order.flatMap((handle) => found.filter((p) => p.handle === handle));

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: copy.person.name,
    jobTitle: copy.person.jobTitle,
    homeLocation: { "@type": "Place", name: copy.person.homeLocation },
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}${portrait.url}`,
    sameAs: [SOCIAL.instagram, SOCIAL.facebook],
  };

  return (
    <InfoPageShell layout="bands" hero={<Hero />}>
      {/* ── My story ─────────────────────────────────────────────────────── */}
      <section id="story" aria-labelledby="story-title" className="scroll-mt-20 bg-cream py-14 sm:py-20">
        <div className="container-page">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
            <div className="max-w-2xl">
              <h2 id="story-title" className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] sm:text-4xl">
                {copy.story.title}
              </h2>
              <div className={`mt-5 ${paragraphs}`}>
                {copy.story.family.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
            <figure className="mx-auto w-56 rotate-2 sm:w-64 lg:mt-16 lg:w-full">
              <div className="rounded-lg bg-paper p-2.5 pb-3 shadow-lift ring-1 ring-line">
                <div className="aspect-[500/652] overflow-hidden rounded-sm">
                  <Img
                    image={portrait}
                    sizes="(min-width: 1024px) 272px, 256px"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </figure>
          </div>

          {/* The butterfly */}
          <figure className="mx-auto mt-12 max-w-4xl rounded-(--radius-card) border border-line bg-paper p-6 shadow-soft sm:mt-16 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
              <div className="shrink-0 sm:w-44">
                <p className="font-hand text-xl leading-tight text-periwinkle-text sm:text-2xl">
                  {copy.story.butterfly.eyebrow}
                </p>
                <Logo alt="" className="mt-3 h-12 sm:h-14" />
              </div>
              <div>
                <blockquote className="relative">
                  <Quote aria-hidden className="absolute -left-1 -top-2 size-7 text-periwinkle/30 sm:-left-3" />
                  <p className="pl-7 font-display text-2xl font-semibold leading-snug text-ink sm:text-[1.75rem]">
                    “{copy.story.butterfly.quote}”
                  </p>
                </blockquote>
                <figcaption className="mt-5 text-base leading-relaxed text-body sm:text-lg">
                  {copy.story.butterfly.paragraph}
                </figcaption>
              </div>
            </div>
          </figure>

          <div className={`mx-auto mt-12 max-w-2xl sm:mt-16 lg:max-w-3xl ${paragraphs}`}>
            {copy.story.today.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enjoy the Journey ────────────────────────────────────────────── */}
      <section aria-labelledby="mantra-title" className="bg-butter py-14 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-hand text-2xl leading-none text-periwinkle-text">{copy.story.mantra.label}</p>
            <h2
              id="mantra-title"
              className="mt-2 text-4xl font-semibold leading-[1.05] tracking-[-0.015em] sm:text-5xl"
            >
              {copy.story.mantra.phrase}
            </h2>
            <div className={`mt-6 text-left sm:text-center ${paragraphs} text-ink/85`}>
              {copy.story.mantra.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <p className="mt-5 font-hand text-3xl leading-none text-ink">{copy.story.mantra.signature}</p>
            <p className="mx-auto mt-8 inline-flex items-start gap-2 text-left text-sm font-medium text-ink/80">
              <Award aria-hidden className="mt-0.5 size-4 shrink-0 text-periwinkle-text" />
              {/* CONFIRM she wants this used (copy deck §5, item 17) */}
              {copy.story.credential}
            </p>
          </div>
        </div>
      </section>

      {/* ── The stories behind the books ─────────────────────────────────── */}
      <section aria-labelledby="books-story-title" className="bg-paper py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading id="books-story-title" title={copy.books.title} />

          <div className="mx-auto mt-10 grid max-w-5xl items-center gap-8 sm:mt-14 md:grid-cols-2 md:gap-12">
            <div className="overflow-hidden rounded-(--radius-card) bg-night shadow-lift">
              <Img
                image={ncArt}
                sizes="(min-width: 1024px) 480px, (min-width: 768px) 45vw, 92vw"
                className="h-auto w-full"
              />
            </div>
            <div>
              <p className="font-hand text-xl leading-none text-periwinkle-text sm:text-2xl">
                {copy.books.nephiteChristmas.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-semibold leading-[1.15] sm:text-3xl">
                {copy.books.nephiteChristmas.title}
              </h3>
              <div className={`mt-4 ${paragraphs}`}>
                {copy.books.nephiteChristmas.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <Link href={copy.books.nephiteChristmas.link.href} className={`mt-3 ${arrowLink}`}>
                {copy.books.nephiteChristmas.link.label}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-8 sm:mt-20 md:grid-cols-2 md:gap-12">
            <div className="md:order-2">
              <div className="overflow-hidden rounded-(--radius-card) shadow-lift md:sticky md:top-24">
                <Img
                  image={ejArt}
                  sizes="(min-width: 1024px) 480px, (min-width: 768px) 45vw, 92vw"
                  className="h-auto w-full"
                />
              </div>
            </div>
            <div className="md:order-1">
              <p className="font-hand text-xl leading-none text-periwinkle-text sm:text-2xl">
                {copy.books.easterJourney.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-semibold leading-[1.15] sm:text-3xl">
                {copy.books.easterJourney.title}
              </h3>
              <div className={`mt-4 ${paragraphs}`}>
                {copy.books.easterJourney.paragraphs.slice(0, 4).map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              {/* Attributed so readers don't take it for the faith leader in the next paragraph. */}
              <figure className="my-6 border-l-4 border-sunrise pl-5">
                <blockquote>
                  <p className="font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
                    “{copy.books.easterJourney.quote}”
                  </p>
                </blockquote>
                <figcaption className="mt-2 font-hand text-2xl leading-none text-periwinkle-text">
                  — {copy.books.easterJourney.quoteBy}
                </figcaption>
              </figure>
              <div className={paragraphs}>
                {copy.books.easterJourney.paragraphs.slice(4).map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <Link href={copy.books.easterJourney.link.href} className={`mt-3 ${arrowLink}`}>
                {copy.books.easterJourney.link.label}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>

          <ChurchDisclaimer className="mx-auto mt-14 max-w-2xl text-center text-sm text-muted" />
        </div>
      </section>

      {/* ── Kelley Hicken ────────────────────────────────────────────────── */}
      <section
        id={copy.illustrator.id}
        aria-labelledby="illustrator-title"
        className="scroll-mt-20 bg-cream-deep py-14 sm:py-20"
      >
        <div className="container-page">
          <div className="mx-auto grid max-w-4xl items-start gap-8 sm:grid-cols-[12rem_1fr] sm:gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
            <div className="mx-auto w-44 sm:mx-0 sm:w-full">
              <div className="aspect-[600/723] overflow-hidden rounded-(--radius-card) shadow-lift ring-4 ring-paper">
                <Img
                  image={kelley}
                  sizes="(min-width: 1024px) 240px, (min-width: 640px) 192px, 176px"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="font-hand text-xl leading-none text-periwinkle-text sm:text-2xl">
                {copy.illustrator.eyebrow}
              </p>
              <h2
                id="illustrator-title"
                className="mt-2 text-3xl font-semibold leading-[1.1] tracking-[-0.01em] sm:text-4xl"
              >
                {copy.illustrator.title}
              </h2>
              <div className={`mt-5 ${paragraphs}`}>
                {copy.illustrator.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <a
                href={copy.illustrator.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 ${arrowLink}`}
              >
                {copy.illustrator.link.label}
                <ExternalLink aria-hidden className="size-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── The books ────────────────────────────────────────────────────── */}
      <section id={copy.shop.id} aria-labelledby="about-books-title" className="scroll-mt-20 bg-cream py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading
            id="about-books-title"
            eyebrow={copy.shop.eyebrow}
            title={copy.shop.title}
            subtitle={copy.shop.subtitle}
          />
          <ul className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((product) => (
              <li key={product.handle}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-base text-body">
            {copy.contact.line}{" "}
            <Link href={copy.contact.link.href} className={proseLinkClass}>
              {copy.contact.link.label}
            </Link>
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
    </InfoPageShell>
  );
}

/** Photo hero: Tiffany on the right of the banner photo, copy on the left (stacked on phones). */
function Hero() {
  return (
    <header className="relative overflow-hidden bg-paper">
      <div className="relative aspect-[5/4] sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
        <Img
          image={heroPhoto}
          preload
          sizes="100vw"
          className="h-full w-full object-cover object-[78%_30%] lg:object-[85%_center]"
        />
        {/* Fade the photo into the copy column on wide screens, and into the page on phones. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper to-transparent lg:inset-0 lg:h-auto lg:bg-gradient-to-r lg:from-paper lg:from-35% lg:via-paper/80 lg:via-45% lg:to-transparent lg:to-58%"
        />
      </div>
      <div className="container-page relative pb-12 pt-2 sm:pb-14 lg:py-28 xl:py-32">
        {/* At lg the copy stays inside the solid part of the fade, clear of the photo (WCAG 1.4.3). */}
        <div className="max-w-xl lg:max-w-[min(36rem,40vw)]">
          <p className="mb-2 font-hand text-2xl leading-none text-periwinkle-text">{copy.hero.eyebrow}</p>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.015em] sm:text-5xl lg:text-6xl">
            {copy.hero.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-body sm:text-xl">{copy.hero.intro}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href={copy.hero.cta.href} size="lg">
              {copy.hero.cta.label}
            </ButtonLink>
            <Link href={`#${copy.illustrator.id}`} className={arrowLink}>
              {copy.illustrator.title}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
