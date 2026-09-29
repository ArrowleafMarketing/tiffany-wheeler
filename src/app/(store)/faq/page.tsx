import { MessageCircleQuestionMark } from "lucide-react";
import type { Metadata } from "next";
import { FaqList } from "@/components/home/faq-list";
import { InfoLinkList } from "@/components/info/info-link-list";
import { InfoPageShell } from "@/components/info/info-page-shell";
import { RichText } from "@/components/info/rich-text";
import { ButtonLink } from "@/components/ui/button";
import { allFaqs } from "@/content/faq";
import { faqPageCopy as copy } from "@/content/info";
import { getCurrentSeason } from "@/lib/season";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = allFaqs(await getCurrentSeason());
  return (
    <InfoPageShell eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro}>
      {/* FAQPage JSON-LD is rendered once, here, with the same text. */}
      <FaqList items={faqs} jsonLd />

      <section
        aria-labelledby="faq-more-title"
        className="mt-10 rounded-(--radius-card) bg-periwinkle-light p-5 sm:mt-14 sm:p-7"
      >
        <h2 id="faq-more-title" className="flex items-center gap-2 text-2xl font-semibold">
          <MessageCircleQuestionMark aria-hidden className="size-6 text-periwinkle-text" />
          {copy.more.title}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-body sm:text-lg">
          <RichText text={copy.more.line} />
        </p>
        <ButtonLink href={copy.more.cta.href} variant="outline" className="mt-4">
          {copy.more.cta.label}
        </ButtonLink>
      </section>

      <InfoLinkList links={copy.related} label={copy.relatedLabel} className="mt-8" />
    </InfoPageShell>
  );
}
