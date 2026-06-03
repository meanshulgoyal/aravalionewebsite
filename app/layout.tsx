import type { Metadata } from "next";
import "./globals.css";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: `${company.shortName} | ${company.tagline}`,
  description:
    "ARAVALI ONE PRIVATE LIMITED delivers infrastructure material supply, mining, crushing, logistics and documentation-led execution across India.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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
