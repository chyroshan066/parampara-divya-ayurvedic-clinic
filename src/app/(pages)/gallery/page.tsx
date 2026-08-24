import type { Metadata } from "next";
import { sql } from "@/utils/db";
import type { GalleryImageRecord } from "@/types/gallery";
import { GalleryGrid } from "./components/GalleryGrid";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.paramparadivyaayurved.com.np";

export const metadata: Metadata = {
  title: "Clinic Gallery | Parampara Divya Ayurved",
  description:
    "Take a look inside Parampara Divya Ayurved in Pipalbot, Boudha, Kathmandu — featuring our clinic, consultation spaces, healthcare facilities, Ayurvedic practitioners, and the team behind your care.",
  keywords: [
    "Parampara Divya Ayurved gallery",
    "Ayurvedic clinic photos Kathmandu",
    "Ayurvedic clinic photos Boudha",
    "Ayurvedic clinic photos Chabahil",
    "Ayurvedic clinic photos Gokarneshwor",
    "Ayurvedic clinic interior Kathmandu",
    "Ayurvedic clinic interior Boudha",
    "Ayurvedic clinic interior Chabahil",
    "Ayurvedic clinic interior Gokarneshwor",
    "Ayurvedic treatment room Kathmandu",
    "Ayurvedic treatment room Kathmandu",
    "Ayurvedic treatment room Boudha",
    "Ayurvedic treatment room Chabahil",
    "Ayurvedic treatment room Gokarneshwor",
    "Ayurvedic clinic photos Nepal",
    "Parampara Divya Ayurved clinic tour",
    "Ayurvedic clinic Pipalbot",
    "Ayurvedic clinic Boudha Kathmandu",
    "Ayurvedic clinic Chabahil Kathmandu",
    "Ayurvedic clinic Gokarneshwor Kathmandu",
    "modern Ayurvedic clinic Kathmandu",
    "modern Ayurvedic clinic Boudha",
    "modern Ayurvedic clinic Chabahil",
    "modern Ayurvedic clinic Gokarneshwor",
    "Ayurvedic healthcare Kathmandu",
    "Ayurvedic healthcare Boudha",
    "Ayurvedic healthcare Chabahil",
    "Ayurvedic healthcare Gokarneshwor",
    "Ayurvedic practitioners Kathmandu",
    "Ayurvedic practitioners Boudha",
    "Ayurvedic practitioners Chabahil",
    "Ayurvedic practitioners Gokarneshwor",
    "pathology laboratory Boudha",
    "pathology laboratory Chabahil",
    "pathology laboratory Gokarneshwor",
    "pathology laboratory Kathmandu",
  ],
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Clinic Gallery | Parampara Divya Ayurved",
    description:
      "A look inside Parampara Divya Ayurved in Pipalbot, Boudha, Kathmandu, including our clinic, consultation spaces, facilities, and healthcare team.",
    type: "website",
    locale: "en_US",
    url: `${baseURL}/gallery`,
    siteName: "Parampara Divya Ayurved",
    images: [
      {
        url: `${baseURL}/images/preview.webp`,
        width: 1200,
        height: 630,
        alt: "Parampara Divya Ayurved Clinic Gallery",
      },
    ],
  },
};

export default async function GalleryPage() {
  const images = (await sql`
    select id, src, public_id, alt, category, resource_type, created_at
    from gallery_images
    order by created_at desc
  `) as GalleryImageRecord[];

  return (
    <section className="section mb-32 pt-16 lg:pt-20">
      <div className="container">
        <div className="flex flex-col gap-14 lg:gap-y-16 xl:gap-y-20">
          {/* Page Header — same pattern as /services */}
          <div className="flex flex-col items-center text-center gap-y-4">
            {/* Eyebrow */}
            <h3 className="text-sm text-primary font-bold">OUR GALLERY</h3>
            {/* Heading */}
            <h1 className="text-slate-800 text-3xl xs:text-4xl lg:text-5xl max-w-2xl leading-snug xs:leading-snug lg:leading-snug font-bold">
              A closer look inside our clinic
            </h1>
            {/* Subtitle */}
            <p className="max-w-screen-xs lg:max-w-screen-sm text-[15px] font-medium text-slate-800/70">
              From our treatment rooms to the equipment and team behind every
              visit — see the space where your care happens.
            </p>
          </div>

          {/* Filterable gallery grid */}
          <GalleryGrid images={images} />
        </div>
      </div>
    </section>
  );
}