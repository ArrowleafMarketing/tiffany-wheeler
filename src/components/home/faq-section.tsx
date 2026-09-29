import { SectionHeading } from "@/components/ui/section-heading";
import { homeFaqs, type FaqItem } from "@/content/faq";
import { faqSectionCopy } from "@/content/home-bottom";
import { getCurrentSeason } from "@/lib/season";
import { FaqList } from "./faq-list";

type Props = {
  /** Defaults to the season's six homepage questions (homeFaqs). */
  items?: readonly FaqItem[];
};

/** Homepage FAQ (§2.14), anchored at #faq, with FAQPage JSON-LD. */
export async function FaqSection({ items }: Props = {}) {
  const faqs = items ?? homeFaqs(await getCurrentSeason());
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 bg-cream-deep py-14 sm:py-20">
      <div className="container-page">
        <SectionHeading id="faq-title" title={faqSectionCopy.title} />
        <FaqList items={faqs} jsonLd className="mx-auto mt-8 max-w-3xl sm:mt-10" />
      </div>
    </section>
  );
}
