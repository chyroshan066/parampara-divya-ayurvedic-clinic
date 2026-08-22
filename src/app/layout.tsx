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
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.omkapandentalktm.com.np";

export const metadata: Metadata = {
  title: "Om Kapan Dental - Advanced Dental Care in Nepal",
  description:
    "Om Kapan Dental offers comprehensive dental care in Kapan Bhrikuti Chowk, Kathmandu, Nepal. Expert dentists providing treatments such as dental implants, braces, root canal therapy, cosmetic dentistry, teeth whitening, and preventive oral care in a modern, comfortable clinic.",
  keywords: [
    "Om Kapan Dental",
    "dental clinic",
    "dentist Kathmandu",
    "dentist kapan",
    "dentist boudha",
    "dentist bhrikuti chowk",
    "dental implants Kathmandu",
    "dental implants kapan",
    "dental implants boudha",
    "dental implants bhrikuti chowk",
    "braces Kathmandu",
    "braces kapan",
    "braces boudha",
    "braces bhrikuti chowk",
    "cosmetic dentistry Kathmandu",
    "cosmetic dentistry kapan",
    "cosmetic dentistry boudha",
    "cosmetic dentistry bhrikuti chowk",
    "root canal Kathmandu",
    "root canal kapan",
    "root canal boudha",
    "root canal bhrikuti chowk",
    "teeth whitening Kathmandu",
    "teeth whitening kapan",
    "teeth whitening boudha",
    "teeth whitening bhrikuti chowk",
    "orthodontics Kathmandu",
    "orthodontics kapan",
    "orthodontics boudha",
    "orthodontics bhrikuti chowk",
    "best dentist Kathmandu",
    "best dentist kapan",
    "best dentist boudha",
    "best dentist bhrikuti chowk",
    "dental care Nepal",
    "oral surgery Kathmandu",
    "oral surgery kapan",
    "oral surgery boudha",
    "oral surgery bhrikuti chowk",
    "family dentist Kathmandu",
    "family dentist kapan",
    "family dentist boudha",
    "family dentist bhrikuti chowk",
    "tooth extraction Kathmandu",
    "tooth extraction kapan",
    "tooth extraction boudha",
    "tooth extraction bhrikuti chowk",
    "dental checkup Kathmandu",
    "dental checkup kapan",
    "dental checkup boudha",
    "dental checkup bhrikuti chowk",
    "gum treatment Kathmandu",
    "gum treatment kapan",
    "gum treatment boudha",
    "gum treatment bhrikuti chowk",
    "pediatric dentist Kathmandu",
    "pediatric dentist kapan",
    "pediatric dentist boudha",
    "pediatric dentist bhrikuti chowk",
    "affordable dental care Kathmandu",
    "affordable dental care kapan",
    "affordable dental care boudha",
    "affordable dental care bhrikuti chowk",
    "emergency dental Kathmandu",
    "emergency dental kapan",
    "emergency dental boudha",
    "emergency dental bhrikuti chowk",
    "dental hygiene Kathmandu",
    "dental hygiene kapan",
    "dental hygiene boudha",
    "dental hygiene bhrikuti chowk",
    "Om Kapan Dental Nepal",
  ],
  authors: [{ name: "Om Kapan Dental" }],
  creator: "Om Kapan Dental",
  publisher: "Om Kapan Dental",
  metadataBase: new URL("https://www.omkapandentalktm.com.np"),
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
    title: "Om Kapan Dental - Advanced Dental Care in Nepal",
    description:
      "Expert dentists in Kapan Bhrikuti Chowk, Kathmandu offering dental implants, braces, root canals, cosmetic dentistry, and preventive care in a modern, patient-friendly clinic.",
    type: "website",
    locale: "en_US",
    url: `${baseURL}`,
    siteName: "Om Kapan Dental",
    images: [
      {
        url: `${baseURL}/images/preview.webp`,
        width: 1200,
        height: 630,
        alt: "Om Kapan Dental Preview",
      },
    ],
  },
  category: "health",
  classification: "Dental Clinic",
  referrer: "origin-when-cross-origin",
  applicationName: "Om Kapan Dental",
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