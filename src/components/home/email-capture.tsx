import Link from "next/link";
import dove from "@/assets/images/art/dove.webp";
import { Img } from "@/components/ui/img";
import { emailCaptureCopy } from "@/content/home-bottom";
import { cn } from "@/lib/cn";
import { fromStatic } from "@/lib/images";
import { EmailCaptureForm } from "./email-capture-form";

type Props = {
  /** "section": homepage lead-magnet band (§2.11). "compact": single-line footer signup (§1.5). */
  variant?: "section" | "compact";
  className?: string;
  /** Compact only: light text and a translucent field for dark backgrounds. The section is always on night blue. */
  inverted?: boolean;
  /** Compact only: show the "Free printables + holiday shipping reminders" line (default true). */
  showHeading?: boolean;
  /** Signup source for analytics and the list (defaults: "home" / "footer"). */
  source?: string;
  /** Compact only: id of the visible heading, which also names the form (one compact signup per page). */
  titleId?: string;
};

const { section, compact } = emailCaptureCopy;
const printables = section.printables.map((p) => fromStatic(p.src, ""));
const tilts = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3"];

/** Email capture: the Family Activity Pack section, or the compact footer signup. */
export function EmailCapture({
  variant = "section",
  className,
  inverted,
  showHeading = true,
  source,
  titleId = "email-signup-title",
}: Props) {
  if (variant === "compact") {
    return (
      <div className={className}>
        {/* A real heading (styled as before), and it names the form. */}
        {showHeading ? (
          <h2
            id={titleId}
            className={cn("mb-3 font-display text-lg font-semibold leading-snug", inverted ? "text-white" : "text-ink")}
          >
            {compact.title}
          </h2>
        ) : null}
        <EmailCaptureForm
          variant="compact"
          inverted={inverted}
          source={source ?? "footer"}
          labelledBy={showHeading ? titleId : undefined}
          labels={{
            inputLabel: compact.inputLabel,
            placeholder: compact.placeholder,
            button: compact.button,
            formLabel: showHeading ? undefined : compact.title,
          }}
        />
      </div>
    );
  }

  return (
    <section
      id="free-activity-pack"
      aria-labelledby="free-activity-pack-title"
      className={cn("relative scroll-mt-20 overflow-hidden bg-night py-12 text-white sm:py-20", className)}
    >
      {/* soft glow behind the pages */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 size-[36rem] -translate-y-1/2 rounded-full bg-night-light/70 blur-3xl"
      />
      <Img
        image={fromStatic(dove, "")}
        alt=""
        sizes="112px"
        className="pointer-events-none absolute right-[6%] top-10 hidden h-auto w-28 opacity-90 lg:block"
      />

      <div className="container-page relative grid items-center gap-8 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-8">
        <div className="lg:col-start-2 lg:self-end">
          <p className="mb-2 font-hand text-xl leading-none text-gold sm:text-2xl">{section.eyebrow}</p>
          <h2
            id="free-activity-pack-title"
            className="text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-white sm:text-4xl"
          >
            {section.title}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{section.subtitle}</p>
        </div>

        {/* The four printables. One accessible image for the group. */}
        <div
          role="img"
          aria-label={section.visualAlt}
          className="mx-auto grid w-full max-w-md grid-cols-4 gap-3 sm:max-w-lg sm:gap-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-w-md lg:grid-cols-2 lg:gap-8"
        >
          {printables.map((image, i) => (
            <div key={section.printables[i].label} className={cn("flex flex-col items-center", tilts[i])}>
              <div className="w-full overflow-hidden rounded-[4px] bg-white p-0.5 shadow-lift ring-1 ring-black/10 sm:p-1">
                <Img image={image} alt="" sizes="(min-width: 1024px) 200px, (min-width: 640px) 110px, 22vw" quality={75} className="h-auto w-full" />
              </div>
              <span aria-hidden className="mt-2 text-center text-[0.7rem] font-semibold leading-tight text-white/75 sm:text-xs">
                {section.printables[i].label}
              </span>
            </div>
          ))}
        </div>

        <div className="lg:col-start-2 lg:self-start">
          <EmailCaptureForm
            variant="section"
            inverted
            source={source ?? "home"}
            labelledBy="free-activity-pack-title"
            labels={{ inputLabel: section.inputLabel, placeholder: section.placeholder, button: section.button }}
            successFollowUp={section.successFollowUp}
            successCta={section.successCta}
            className="max-w-xl"
          />
          <p className="mt-4 max-w-xl text-xs leading-relaxed text-white/70 sm:text-sm">
            {section.finePrint}{" "}
            <Link
              href={section.privacyHref}
              prefetch={false}
              className="font-semibold text-white underline underline-offset-2 hover:text-gold"
            >
              {section.privacyLabel}
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
