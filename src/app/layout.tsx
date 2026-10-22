import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portad.vishmuka.in"),
  title: {
    default: "PortaD — the open way to move your data",
    template: "%s · PortaD",
  },
  description:
    "Local-first, verifiable SaaS workspace migrations: export, validate, transform and import with checksums, resumable checkpoints and a round-trip diff.",
  applicationName: "PortaD",
  openGraph: {
    type: "website",
    siteName: "PortaD",
    title: "PortaD — the open way to move your data",
    description:
      "Local-first, verifiable SaaS workspace migrations with checksums, resumable checkpoints and a round-trip diff.",
    url: "https://portad.vishmuka.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "PortaD — the open way to move your data",
    description:
      "Local-first, verifiable SaaS workspace migrations with a round-trip diff.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050d1f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}