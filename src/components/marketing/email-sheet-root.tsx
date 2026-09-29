import { Suspense } from "react";
import { Img } from "@/components/ui/img";
import { emailCaptureCopy } from "@/content/home-bottom";
import { fromStatic } from "@/lib/images";
import { EmailSheet, type EmailSheetCopy } from "./email-sheet";

const { sheet, section } = emailCaptureCopy;

const copy: EmailSheetCopy = {
  ...sheet,
  finePrint: section.finePrint,
  privacyLabel: section.privacyLabel,
  privacyHref: section.privacyHref,
};

// Two of the four pages, fanned like a little stack of printables.
const [front, back] = [section.printables[0], section.printables[2]].map((p) => fromStatic(p.src, ""));

/**
 * Store-wide email bottom sheet (mounted once in the (store) layout). The copy
 * and the two preview pages are prepared here; EmailSheet decides when (and
 * whether) to show them. Suspense: EmailSheet reads the pathname, which isn't
 * known during prerendering for dynamic routes without static params.
 */
export function EmailSheetRoot() {
  const visual = (
    <div className="relative aspect-[772/1000] w-full">
      <div className="absolute inset-0 translate-x-2 rotate-6 overflow-hidden rounded-[3px] bg-white p-0.5 shadow-soft ring-1 ring-black/10">
        <Img image={back} alt="" sizes="80px" quality={75} className="h-auto w-full" />
      </div>
      <div className="absolute inset-0 -rotate-3 overflow-hidden rounded-[3px] bg-white p-0.5 shadow-lift ring-1 ring-black/10">
        <Img image={front} alt="" sizes="80px" quality={75} className="h-auto w-full" />
      </div>
    </div>
  );
  return (
    <Suspense fallback={null}>
      <EmailSheet copy={copy} visual={visual} />
    </Suspense>
  );
}
