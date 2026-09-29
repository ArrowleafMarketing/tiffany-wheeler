import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EmailSheetRoot } from "@/components/marketing/email-sheet-root";

// Full storefront chrome. Ad landing pages live in the (lp) group with a
// minimal header instead.
export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      {/* Each page renders its own <main id="main"> (the skip link target). */}
      {children}
      <SiteFooter />
      {/* The Family Activity Pack bottom sheet: renders nothing until it's due (never on /checkout). */}
      <EmailSheetRoot />
    </>
  );
}
