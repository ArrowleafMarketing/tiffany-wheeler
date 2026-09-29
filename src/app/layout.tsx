import type { Metadata, Viewport } from "next";
import { Caveat, Figtree } from "next/font/google";
import localFont from "next/font/local";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawerRoot } from "@/components/cart/cart-drawer-root";
import { RevealFallback } from "@/components/layout/reveal-fallback";
import { SkipLink } from "@/components/layout/skip-link";
import { SITE_URL } from "@/lib/store-config";
import "./globals.css";

// Fraunces (SIL OFL 1.1), latin subset instanced to the look we use everywhere:
// SOFT 100, WONK 0, opsz 40, variable weight. 37 KB instead of 121 KB. See
// src/app/fonts/README.md for how it was made.
const fraunces = localFont({
  src: "./fonts/fraunces-soft-latin.woff2",
  weight: "100 900",
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

// Only used for small eyebrows; don't compete with the LCP image for bandwidth.
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-caveat",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nephite Christmas & Easter Journey | Tiffany Wheeler",
    template: "%s | Tiffany Wheeler",
  },
  description:
    "Beautifully illustrated, Christ-centered holiday picture books by Tiffany Wheeler: Nephite Christmas and Easter Journey. Start a family tradition you’ll read every year.",
  openGraph: { siteName: "Tiffany Wheeler", type: "website", locale: "en_US" },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ec",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${figtree.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SkipLink />
        <RevealFallback />
        <CartProvider>
          {children}
          <CartDrawerRoot />
        </CartProvider>
      </body>
    </html>
  );
}
