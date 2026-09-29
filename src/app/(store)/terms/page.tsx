// LEGAL REVIEW NEEDED: plain-English template for a small US store (Shopify
// checkout, email marketing, Meta/Google pixels). Makes no compliance
// certification claims. Have a lawyer review before launch.

import type { Metadata } from "next";
import { InfoPageShell } from "@/components/info/info-page-shell";
import { LegalDocument } from "@/components/info/legal-document";
import { POLICIES_UPDATED, legalCopy, termsCopy as copy } from "@/content/info";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <InfoPageShell
      eyebrow={legalCopy.eyebrow}
      title={copy.title}
      intro={copy.intro}
      meta={`${legalCopy.updatedLabel} ${POLICIES_UPDATED}`}
    >
      <LegalDocument sections={copy.sections} tocLabel={legalCopy.tocLabel} />
    </InfoPageShell>
  );
}
