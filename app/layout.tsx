import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { jsonLd, organizationJsonLd, siteName, siteUrl, websiteJsonLd } from "@/lib/seo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

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
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd())} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteJsonLd())} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
