import type { InfoSectionCopy } from "@/content/info";
import { InfoBlocks } from "./info-blocks";
import { InfoSection } from "./info-section";

type Props = {
  sections: readonly InfoSectionCopy[];
  /** Label for the "On this page" contents list; omit to hide it. */
  tocLabel?: string;
};

/**
 * A policy document (privacy, terms, accessibility, returns): an optional
 * contents list, then each section as an h2 with its prose blocks.
 */
export function LegalDocument({ sections, tocLabel }: Props) {
  return (
    <div>
      {tocLabel && sections.length > 3 ? (
        <nav
          aria-label={tocLabel}
          className="mb-10 rounded-(--radius-card) border border-line bg-paper p-5 shadow-soft sm:p-6"
        >
          <p className="text-sm font-bold uppercase tracking-[0.06em] text-muted">{tocLabel}</p>
          <ol className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex min-h-11 items-center font-medium text-periwinkle-text underline-offset-4 hover:text-ink hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="space-y-10 sm:space-y-12">
        {sections.map((section) => (
          <InfoSection key={section.id} id={section.id} title={section.title}>
            <InfoBlocks blocks={section.blocks} />
          </InfoSection>
        ))}
      </div>
    </div>
  );
}
