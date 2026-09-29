import { FOOTER } from "@/content/site";

const KEEP_TOGETHER = "Latter-day";

/**
 * The required Church disclaimer (copy deck §1.5). “Latter-day” is kept on one
 * line: a non-breaking hyphen (U+2011) isn't in Figtree or Fraunces and would
 * render in a fallback font, so the word is wrapped in a nowrap span instead.
 */
export function ChurchDisclaimer({ className }: { className?: string }) {
  const [before, ...rest] = FOOTER.disclaimer.split(KEEP_TOGETHER);
  return (
    <p className={className}>
      {before}
      {rest.length > 0 ? <span className="whitespace-nowrap">{KEEP_TOGETHER}</span> : null}
      {rest.join(KEEP_TOGETHER)}
    </p>
  );
}
