import type { Metadata, Viewport } from "next";
import "./globals.css";
import AnalyticsWrapper from "@/utils/AnalyticsWrapper";
import { eudoxusSans } from "./fonts";
import Script from "next/script";
import { IconSprite } from "@/components/utility/IconSprite";
import { SiteChrome } from "@/components/SiteChrome";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/utils/auth";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.paramparadivyaayurved.com.np";

export const metadata: Metadata = {
  title: "Parampara Divya Ayurved - Authentic Ayurvedic Care in Kathmandu",
  description:
    "Parampara Divya Ayurved provides personalized Ayurvedic care in Pipalbot, Boudha, Kathmandu, Nepal. Offering Ayurvedic consultation, holistic wellness care, pathology laboratory services, and natural approaches for various health concerns in a caring environment.",
  keywords: [
    "Parampara Divya Ayurved",
    "Parampara Divya Ayurvedic",
    "Ayurvedic clinic",
    "Ayurvedic clinic Kathmandu",
    "Ayurvedic clinic Boudha",
    "Ayurvedic clinic Chabahil",
    "Ayurvedic clinic Gokarneshwor",
    "best Ayurvedic clinic Kathmandu",
    "best Ayurvedic clinic Boudha",
    "best Ayurvedic clinic Chabahil",
    "best Ayurvedic clinic Gokarneshwor",
    "Ayurvedic treatment Kathmandu",
    "Ayurvedic treatment Boudha",
    "Ayurvedic treatment Chabahil",
    "Ayurvedic treatment Gokarneshwor",
    "Ayurvedic doctor Kathmandu",
    "Ayurvedic doctor Boudha",
    "Ayurvedic doctor Chabahil",
    "Ayurvedic doctor Gokarneshwor",
    "Ayurvedic consultation Kathmandu",
    "Ayurvedic consultation Boudha",
    "Ayurvedic consultation Chabahil",
    "Ayurvedic consultation Gokarneshwor",
    "Ayurvedic medicine Kathmandu",
    "Ayurvedic medicine Boudha",
    "Ayurvedic medicine Chabahil",
    "Ayurvedic medicine Gokarneshwor",
    "Ayurvedic healthcare Kathmandu",
    "Ayurvedic healthcare Boudha",
    "Ayurvedic healthcare Chabahil",
    "Ayurvedic healthcare Gokarneshwor",
    "holistic healthcare Kathmandu",
    "holistic healthcare Boudha",
    "holistic healthcare Chabahil",
    "holistic healthcare Gokarneshwor",
    "natural treatment Kathmandu",
    "natural treatment Boudha",
    "natural treatment Chabahil",
    "natural treatment Gokarneshwor",
    "Ayurvedic wellness Kathmandu",
    "Ayurvedic wellness Boudha",
    "Ayurvedic wellness Chabahil",
    "Ayurvedic wellness Gokarneshwor",
    "Ayurvedic clinic near Chabahil",
    "Ayurvedic clinic near Gokarneshwor",
    "Ayurvedic clinic in Pipalbot",
    "Ayurvedic clinic Pipalbot Boudha",
    "pathology laboratory Kathmandu",
    "pathology laboratory Boudha",
    "pathology laboratory Chabahil",
    "pathology laboratory Gokarneshwor",
    "CBC test Kathmandu",
    "CBC test Boudha",
    "CBC test Chabahil",
    "CBC test Gokarneshwor",
    "blood sugar test Kathmandu",
    "blood sugar test Boudha",
    "blood sugar test Chabahil",
    "blood sugar test Gokarneshwor",
    "LFT test Kathmandu",
    "LFT test Boudha",
    "LFT test Chabahil",
    "LFT test Gokarneshwor",
    "RFT test Kathmandu",
    "RFT test Boudha",
    "RFT test Chabahil",
    "RFT test Gokarneshwor",
    "lipid profile test Kathmandu",
    "lipid profile test Boudha",
    "lipid profile test Chabahil",
    "lipid profile test Gokarneshwor",
    "uric acid test Kathmandu",
    "uric acid test Chabahil",
    "uric acid test Boudha",
    "uric acid test Gokarneshwor",
    "urine routine test Kathmandu",
    "urine routine test Boudha",
    "urine routine test Chabahil",
    "urine routine test Gokarneshwor",
    "stool routine test Kathmandu",
    "stool routine test Boudha",
    "stool routine test Chabahil",
    "stool routine test Gokarneshwor",
    "serology test Kathmandu",
    "serology test Boudha",
    "serology test Chabahil",
    "serology test Gokarneshwor",
    "joint pain Ayurvedic treatment",
    "migraine Ayurvedic treatment",
    "eczema Ayurvedic treatment",
    "sinusitis Ayurvedic treatment",
    "women's health Ayurvedic care",
    "Ayurvedic health clinic Nepal",
    "Parampara Divya Ayurved Nepal",
  ],
  authors: [{ name: "Parampara Divya Ayurved" }],
  creator: "Parampara Divya Ayurved",
  publisher: "Parampara Divya Ayurved",
  metadataBase: new URL("https://www.paramparadivyaayurved.com.np"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon_io/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon_io/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon.ico",
        sizes: "32x32",
      },
    ],
    shortcut: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png",
  },
  manifest: "/favicon_io/site.webmanifest",
  openGraph: {
    title: "Parampara Divya Ayurved - Ayurvedic Care in Kathmandu",
    description:
      "Parampara Divya Ayurved provides personalized Ayurvedic consultation and holistic healthcare in Pipalbot, Boudha, Kathmandu, along with diagnostic and pathology laboratory services.",
    type: "website",
    locale: "en_US",
    url: `${baseURL}`,
    siteName: "Parampara Divya Ayurved",
    images: [
      {
        url: `${baseURL}/images/preview.webp`,
        width: 1200,
        height: 630,
        alt: "Parampara Divya Ayurved Preview",
      },
    ],
  },
  category: "health",
  classification: "Ayurvedic Clinic",
  referrer: "origin-when-cross-origin",
  applicationName: "Parampara Divya Ayurved",
  generator: "Next.js",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Checked here (rather than fetching /api/admin/me client-side inside
  // Header) so the correct icon/link renders on the very first paint —
  // no flash of "Admin Login" before a client fetch resolves.
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const isAdminLoggedIn = token ? Boolean(await verifySessionToken(token)) : false;

  return (
    <html lang="en">
      <head>
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify("structured_data_from_constants"),
          }}
        /> */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          strategy="afterInteractive"
        />
      </head>

      <body
        className={`${eudoxusSans.variable} flex min-h-screen flex-col`}
        suppressHydrationWarning={true}
      >
        <IconSprite />
        <SiteChrome isAdminLoggedIn={isAdminLoggedIn}>
          <main id="main" className="flex flex-1 flex-col">
            {children}
          </main>
        </SiteChrome>
        <AnalyticsWrapper />
      </body>
    </html>
  );
}