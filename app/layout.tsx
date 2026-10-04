import type { Metadata } from "next";
import { Schibsted_Grotesk, Newsreader } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { jsonLd, organizationJsonLd, siteName, siteUrl, websiteJsonLd } from "@/lib/seo";

const sans = Schibsted_Grotesk({
  variable: "--ttp-font-sans-loaded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const serif = Newsreader({
  variable: "--ttp-font-serif-loaded",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const DEFAULT_TITLE = "TopToolsPick — Choose the right tool before you pay";
const DEFAULT_DESCRIPTION = "Independent research for the moment before you buy: ranked shortlists, honest comparisons and real alternatives across software, AI tools and digital services.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Pages now supply a bare title; the suffix is appended here in one place instead of
  // being hand-written into every page string.
  title: { default: DEFAULT_TITLE, template: `%s | ${siteName}` },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: siteUrl },
  openGraph: { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, url: siteUrl, siteName, type: "website" },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <head>
        {/* Google Analytics — plain tags so the script appears in the initial HTML */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4VVJW59JC3" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-4VVJW59JC3');` }} />
      </head>
      <body suppressHydrationWarning className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd())} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteJsonLd())} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--ink)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
