import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import { getCurrentUser } from "@/lib/auth";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { COOKIE_NAMES } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = createMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `(function(){try{var k=${JSON.stringify(COOKIE_NAMES.theme)};var t=localStorage.getItem(k)||"system";var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var dark=t==="dark"||(t==="system"&&d);document.documentElement.classList.toggle("dark",dark);}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang={siteConfig.defaultLocale}
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans antialiased"
        suppressHydrationWarning
      >
        <Script id="pulse-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <AppProviders initialUser={user}>{children}</AppProviders>
      </body>
    </html>
  );
}
