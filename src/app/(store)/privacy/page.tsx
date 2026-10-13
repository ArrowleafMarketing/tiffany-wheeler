import type { Metadata } from "next";
import { InfoPageShell } from "@/components/info/info-page-shell";
import { LegalDocument } from "@/components/info/legal-document";
import { POLICIES_UPDATED, legalCopy, privacyCopy as copy } from "@/content/info";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
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
