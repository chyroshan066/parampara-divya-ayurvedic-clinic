import type { Metadata } from "next";
import { ServicesGrid } from "./components/ServicesGrid";
import { SERVICES } from "@/constants";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.paramparadivyaayurved.com.np";

export const metadata: Metadata = {
  title: "Our Ayurvedic Services | Parampara Divya Ayurved",
  description:
    "Explore the Ayurvedic services at Parampara Divya Ayurved in Pipalbot, Boudha, Kathmandu — from Ayurvedic consultation and personalized treatments to wellness care and diagnostic laboratory services.",
  keywords: [
    "Ayurvedic services Kathmandu",
    "Ayurvedic services Boudha",
    "Ayurvedic services Chabahil",
    "Ayurvedic services Gokarneshwor",
    "Ayurvedic clinic Kathmandu",
    "Ayurvedic clinic Boudha",
    "Ayurvedic clinic Chabahil",
    "Ayurvedic clinic Gokarneshwor",
    "Ayurvedic consultation Kathmandu",
    "Ayurvedic consultation Boudha",
    "Ayurvedic consultation Chabahil",
    "Ayurvedic consultation Gokarneshwor",
    "Ayurvedic treatment Kathmandu",
    "Ayurvedic treatment Boudha",
    "Ayurvedic treatment Chabahil",
    "Ayurvedic treatment Gokarneshwor",
    "Ayurvedic medicine Kathmandu",
    "Ayurvedic medicine Boudha",
    "Ayurvedic medicine Chabahil",
    "Ayurvedic medicine Gokarneshwor",
    "Ayurvedic wellness Kathmandu",
    "Ayurvedic wellness Boudha",
    "Ayurvedic wellness Chabahil",
    "Ayurvedic wellness Gokarneshwor",
    "holistic healthcare Kathmandu",
    "holistic healthcare Boudha",
    "holistic healthcare Chabahil",
    "holistic healthcare Gokarneshwor",
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
    "uric acid test Boudha",
    "uric acid test Chabahil",
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
    "arthritis Ayurvedic treatment",
    "gout Ayurvedic treatment",
    "gastritis Ayurvedic treatment",
    "migraine Ayurvedic treatment",
    "piles Ayurvedic treatment",
    "fissure Ayurvedic treatment",
    "fistula Ayurvedic treatment",
    "sinusitis Ayurvedic treatment",
    "women's health Ayurvedic care",
    "Parampara Divya Ayurved services",
  ],
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Our Ayurvedic Services | Parampara Divya Ayurved",
    description:
      "Explore Ayurvedic consultation, personalized treatments, wellness care, and diagnostic laboratory services at Parampara Divya Ayurved in Pipalbot, Boudha, Kathmandu.",
    type: "website",
    locale: "en_US",
    url: `${baseURL}/services`,
    siteName: "Parampara Divya Ayurved",
    images: [
      {
        url: `${baseURL}/images/preview.webp`,
        width: 1200,
        height: 630,
        alt: "Parampara Divya Ayurved Services",
      },
    ],
  },
};

export default function ServicePage() {
  return (
    <>
      {/* JSON-LD: list of services for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: SERVICES.map((service, index) => ({
              "@type": "MedicalProcedure",
              position: index + 1,
              name: service.name,
            })),
          }),
        }}
      />

      <section className="section mb-32 pt-16 lg:pt-20">
        <div className="container">
          <div className="flex flex-col gap-14 lg:gap-y-16 xl:gap-y-20">
            {/* Page Header */}
            <div className="flex flex-col items-center text-center gap-y-4">
              {/* Eyebrow */}
              <h3 className="text-sm text-primary font-bold">OUR SERVICES</h3>
              {/* Heading */}
              <h1 className="text-slate-800 text-3xl xs:text-4xl lg:text-5xl max-w-2xl leading-snug xs:leading-snug lg:leading-snug font-bold">
                Complete Ayurvedic Care, All Under One Roof
              </h1>
              {/* Subtitle */}
              <p className="max-w-screen-xs lg:max-w-screen-sm text-[15px] font-medium text-slate-800/70">
                From Ayurvedic consultations to personalized treatments and diagnostic services, we provide holistic care tailored to your needs.
              </p>
            </div>

            {/* Full Services Grid */}
            <ServicesGrid />
          </div>
        </div>
      </section>
    </>
  );
}