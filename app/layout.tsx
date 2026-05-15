import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://pinpeak.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "PinPeak — Download Pinterest Videos & Images in 4K",
    template: "%s · PinPeak",
  },
  description:
    "Download Pinterest videos and images instantly in HD, Full HD, 2K, 4K, and Original Resolution — without watermark and with zero quality loss.",
  keywords: [
    "pinterest downloader",
    "pinterest video downloader",
    "pinterest 4k downloader",
    "pinterest image downloader",
    "save pinterest video",
    "no watermark pinterest",
  ],
  openGraph: {
    type: "website",
    title: "PinPeak — Download Pinterest in 4K",
    description:
      "Save any Pinterest pin in HD, 2K, 4K and Original Resolution. No watermark. No compression.",
    url: SITE,
    siteName: "PinPeak",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PinPeak — Download Pinterest in 4K",
    description:
      "Save Pinterest videos & images in original 4K quality, no watermark.",
  },
  alternates: { canonical: SITE },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#07070a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="relative">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
