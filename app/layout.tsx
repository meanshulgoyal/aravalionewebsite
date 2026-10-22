import type { Metadata } from "next";
import "./globals.css";
import { company } from "@/data/site";
import { getSiteUrl } from "@/lib/site-url";

const description =
  "ARAVALI ONE PRIVATE LIMITED delivers infrastructure material supply, mining, crushing, logistics and documentation-led execution across India.";

export const metadata: Metadata = {
  metadataBase: getSiteUrl() ?? undefined,
  title: {
    default: `${company.shortName} | ${company.tagline}`,
    template: `%s | ${company.shortName}`
  },
  description,
  alternates: getSiteUrl() ? { canonical: "/" } : undefined,
  openGraph: getSiteUrl() ? {
    type: "website",
    locale: "en_IN",
    siteName: company.name,
    title: `${company.shortName} | ${company.tagline}`,
    description,
    url: "/",
    images: [
      {
        url: "/social-preview",
        width: 1200,
        height: 630,
        alt: `${company.name} — ${company.tagline}`
      }
    ]
  } : undefined,
  twitter: getSiteUrl() ? {
    card: "summary_large_image",
    title: `${company.shortName} | ${company.tagline}`,
    description,
    images: ["/social-preview"]
  } : undefined,
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
