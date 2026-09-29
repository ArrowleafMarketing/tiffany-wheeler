import { Download, PackageCheck, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { InfoPageShell } from "@/components/info/info-page-shell";
import { LegalDocument } from "@/components/info/legal-document";
import { RichText } from "@/components/info/rich-text";
import { ButtonLink } from "@/components/ui/button";
import { returnsCopy as copy } from "@/content/info";

// CONFIRM every guarantee and return term on this page with Tiffany (copy deck
// §5, item 5): 30-day refund window, who pays return shipping, digital
// downloads non-refundable after download (except file errors / duplicate
// charges), made-to-order items replaced only if damaged.

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: "/returns" },
};

const promiseIcons = [ShieldCheck, PackageCheck, Download];

export default function ReturnsPage() {
  return (
    <InfoPageShell eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro}>
      <ul className="grid gap-3 sm:grid-cols-3">
        {copy.promises.map((promise, i) => {
          const Icon = promiseIcons[i] ?? ShieldCheck;
          return (
            <li key={promise.title} className="flex items-start gap-3 rounded-(--radius-card) border border-line bg-paper p-4 shadow-soft sm:block">
              <Icon aria-hidden className="mt-0.5 size-6 shrink-0 text-forest sm:mt-0" />
              <div className="sm:mt-2">
                <p className="font-semibold leading-snug text-ink">{promise.title}</p>
                <p className="mt-1 text-sm leading-snug text-muted">{promise.line}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-12">
        <LegalDocument sections={copy.sections} />
      </div>

      <section
        aria-labelledby="returns-help-title"
        className="mt-12 rounded-(--radius-card) bg-periwinkle-light p-5 sm:mt-14 sm:p-7"
      >
        <h2 id="returns-help-title" className="text-2xl font-semibold">
          {copy.help.title}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-body sm:text-lg">
          <RichText text={copy.help.line} />
        </p>
        <ButtonLink href={copy.help.cta.href} variant="outline" className="mt-4">
          {copy.help.cta.label}
        </ButtonLink>
      </section>
    </InfoPageShell>
  );
}
