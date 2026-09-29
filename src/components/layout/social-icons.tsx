import type { SVGProps } from "react";
import { FOOTER } from "@/content/site";
import { cn } from "@/lib/cn";
import { SOCIAL } from "@/lib/store-config";

// Lucide has no brand marks, so these are small hand-drawn inline SVGs.

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
      focusable="false"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.35" cy="6.65" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...props}>
      <path d="M12 2.2c-5.4 0-9.8 4.4-9.8 9.8 0 4.9 3.6 9 8.3 9.7v-6.9H8v-2.8h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.8h-2.3v6.9c4.7-.7 8.3-4.8 8.3-9.7 0-5.4-4.4-9.8-9.8-9.8z" />
    </svg>
  );
}

type Props = {
  className?: string;
  /** "light" for cream/paper backgrounds, "dark" for night/ink ones. */
  tone?: "light" | "dark";
};

/** Instagram + Facebook links with 44px tap targets. */
export function SocialLinks({ className, tone = "light" }: Props) {
  const { instagram, facebook } = FOOTER.social;
  const links = [
    { href: SOCIAL.instagram, label: `${instagram.label}: ${instagram.handle}`, Icon: InstagramIcon },
    { href: SOCIAL.facebook, label: `${facebook.label}: ${facebook.handle}`, Icon: FacebookIcon },
  ];
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {links.map(({ href, label, Icon }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} (opens in a new tab)`}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full border transition-colors",
              tone === "light"
                ? "border-line bg-paper text-periwinkle-text hover:border-periwinkle hover:text-ink"
                : "border-white/20 text-white hover:border-gold hover:text-gold",
            )}
          >
            <Icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
