import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/info/contact-form";
import { InfoLinkList } from "@/components/info/info-link-list";
import { InfoPageShell } from "@/components/info/info-page-shell";
import { CONTACT_TOPICS, contactCopy as copy, contactFormCopy } from "@/content/info";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <InfoPageShell eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} layout="bands">
      <div className="container-page py-10 sm:py-14">
        <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-10 lg:gap-y-6">
          {/* Email first on phones: it's the quickest way to reach us. */}
          <section
            aria-labelledby="email-us-title"
            className="rounded-(--radius-card) bg-night p-5 text-white shadow-soft sm:p-6 lg:col-start-2 lg:row-start-1"
          >
            <h2 id="email-us-title" className="flex items-center gap-2 text-xl font-semibold text-white">
              <Mail aria-hidden className="size-5 text-gold" />
              {copy.email.title}
            </h2>
            <p className="mt-2 text-sm text-white/80">{copy.email.line}</p>
            {/* CONFIRM customer-service address (copy deck §5, item 32) */}
            <a
              href={`mailto:${copy.email.address}`}
              className="mt-1 inline-flex min-h-11 items-center break-all font-display text-lg font-semibold text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
            >
              {copy.email.address}
            </a>
            <p className="mt-1 text-sm text-white/80">{copy.email.reply}</p>
          </section>

          <section
            aria-labelledby="contact-form-title"
            className="rounded-(--radius-card) border border-line bg-paper p-5 shadow-soft sm:p-8 lg:col-start-1 lg:row-span-2 lg:row-start-1"
          >
            <h2 id="contact-form-title" className="text-2xl font-semibold leading-tight sm:text-3xl">
              {copy.formTitle}
            </h2>
            <ContactForm copy={contactFormCopy} topics={CONTACT_TOPICS} className="mt-6" />
          </section>

          <section aria-labelledby="quick-answers-title" className="lg:col-start-2 lg:row-start-2">
            <h2 id="quick-answers-title" className="mb-3 text-xl font-semibold">
              {copy.quickTitle}
            </h2>
            <InfoLinkList links={copy.quickLinks} label={copy.quickTitle} />
          </section>
        </div>
      </div>
    </InfoPageShell>
  );
}
