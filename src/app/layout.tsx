import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import CookieConsent from "@/components/CookieConsent";
import { env } from "@/lib/env";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: "CoupenOfficial – Verified Coupons, Deals & Promo Codes",
    template: "%s | CoupenOfficial"
  },
  description:
    "Discover verified coupon codes, exclusive deals and honest reviews at CoupenOfficial. Save money on thousands of brands with our hand-tested promo codes.",
  keywords: ["coupon codes", "promo codes", "deals", "discount codes", "verified coupons"],
  authors: [{ name: "CoupenOfficial" }],
  creator: "CoupenOfficial",
  openGraph: {
    siteName: "CoupenOfficial",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "CoupenOfficial – Verified Coupons & Deals"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    creator: "@coupenofficial",
    images: ["/og-default.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" }
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Inline script to prevent flash of wrong colour scheme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=document.documentElement;if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark');}else{d.classList.remove('dark');}}catch(e){}})();`
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased">
        <SkipLink />
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
