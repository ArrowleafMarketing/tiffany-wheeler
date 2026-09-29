import { SiteHeader } from "@/components/layout/site-header";
import { LpDeadlineBar } from "@/components/lp/lp-deadline-bar";
import { LpFooter } from "@/components/lp/lp-footer";

// Paid-traffic landing pages (/lp/*): the real deadline in one fixed bar, a
// header with the logo (not a link) and the cart, and a minimal footer with the
// Church disclaimer. No nav, no footer signup, and no email bottom sheet: that
// lives in the (store) layout only.
export default function LandingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <LpDeadlineBar />
      <SiteHeader minimal />
      {/* Each page renders its own <main id="main"> (the skip link target). */}
      {children}
      <LpFooter />
    </>
  );
}
