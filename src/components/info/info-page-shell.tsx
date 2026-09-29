import type { ReactNode } from "react";
import dove from "@/assets/images/art/dove.webp";
import { Img } from "@/components/ui/img";
import { fromStatic } from "@/lib/images";

const doveImage = fromStatic(dove, "");

type Props = {
  /** Page H1. Required unless `hero` replaces the header band. */
  title?: string;
  /** Small hand-lettered line above the H1. */
  eyebrow?: string;
  intro?: ReactNode;
  /** A small line under the intro, e.g. "Last updated September 22, 2026". */
  meta?: ReactNode;
  /** Buttons or links under the intro. */
  actions?: ReactNode;
  /** Replaces the default header band (it must render the page's single h1). */
  hero?: ReactNode;
  /** 'prose' (default): children sit in a readable column. 'bands': children are full-width section bands. */
  layout?: "prose" | "bands";
  /** Background of the band right under the header, so the wave blends into it (default cream). */
  next?: "cream" | "paper" | "night";
  children: ReactNode;
};

/**
 * Consistent frame for the info pages (about, shipping, returns, policies…):
 * the `main` landmark, a cream header band with the one h1, and a readable
 * content column. Server Component; no client JS.
 */
const waveTone = { cream: "text-cream", paper: "text-paper", night: "text-night" } as const;

export function InfoPageShell({
  title,
  eyebrow,
  intro,
  meta,
  actions,
  hero,
  layout = "prose",
  next = "cream",
  children,
}: Props) {
  return (
    <main id="main" className="flex-1 bg-cream">
      {hero ?? (
        <header className="relative overflow-hidden bg-cream-deep">
          <Img
            image={doveImage}
            alt=""
            sizes="144px"
            className="pointer-events-none absolute right-[7%] top-1/2 hidden h-auto w-36 -translate-y-1/2 opacity-80 lg:block"
          />
          <div className="container-page relative pb-14 pt-10 sm:pb-20 sm:pt-14 lg:pt-16">
            <div className="mx-auto max-w-3xl">
              {eyebrow ? (
                <p className="mb-2 font-hand text-xl leading-none text-periwinkle-text sm:text-2xl">{eyebrow}</p>
              ) : null}
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.015em] sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              {intro ? <div className="mt-4 text-lg leading-relaxed text-body sm:text-xl">{intro}</div> : null}
              {meta ? <p className="mt-4 text-sm text-muted">{meta}</p> : null}
              {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
            </div>
          </div>
          {/* soft wave into the page */}
          <svg
            aria-hidden
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
            className={`absolute inset-x-0 -bottom-px h-5 w-full sm:h-7 ${waveTone[next]}`}
            fill="currentColor"
          >
            <path d="M0 40V24C240 4 480 2 720 18s480 22 720 2v20z" />
          </svg>
        </header>
      )}
      {layout === "bands" ? (
        children
      ) : (
        <div className="container-page py-10 sm:py-14">
          <div className="mx-auto max-w-3xl">{children}</div>
        </div>
      )}
    </main>
  );
}
