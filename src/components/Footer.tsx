import { CONATACTS, QUICK_LINKS, SOCIAL_LINKS } from "@/constants";
import Link from "next/link";

export const Footer = () => (
  <footer className="bg-[#50793c]">
    <div className="container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-10 xl:gap-x-20 text-white py-16">
        {/* About me in Footer */}
        <div className="sm:col-span-2 lg:col-span-1">
          {/* Logo + brand name, side by side */}
          <div className="flex items-center gap-x-4">
            {/* Logo — constrained to a fixed, balanced size (previously had
                no width/height, so it rendered at the source image's full,
                huge natural dimensions) */}
            <img
              src="/images/logo.webp"
              alt="logo-footer"
              className="h-16 w-16 object-contain"
            />
            {/* Added: brand name beside the logo, in white */}
            <p className="text-[18px] font-bold text-white">Parampara Divya Ayurvedic</p>
          </div>
          {/* Description */}
          <p className="text-[15px] text-white/70  mt-4">
            Trusted Ayurvedic care in Pipalbot, Boudha, Kathmandu — offering personalized Ayurvedic consultation, traditional treatments, wellness care, and diagnostic services with an experienced, patient-focused approach.
          </p>
          {/* Social in Footer */}
          <div className="mt-8">
            <p className="text-[13px] font-medium text-white/70 mb-4">
              FOLLOW US ON
            </p>
            <div className="flex items-center gap-x-4 child:transition-colors child:bg-white/90 child-hover:bg-white child:p-2 child:rounded-lg">
              {SOCIAL_LINKS.map((link, index) => (
                <a key={index} href={link.href} target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path fill="#1e293b" d={link.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* Quick Access in Footer */}
        <div>
          {/* Title */}
          <p className="text-[13px] font-medium text-white/70 mb-6">
            QUICK LINKS
          </p>
          {/* Quick Access List */}
          <ul className="flex flex-col gap-y-4 text-[15px]">
            {QUICK_LINKS.map((link, index) => (
              // Quick Access Item
              <li key={index}>
                <Link className="quick-access-item" href={link.href}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Conact Us in Footer */}
        <div>
          {/* Title */}
          <p className="text-[13px] font-medium text-white/70">
            CONTACT & INFORMATION
          </p>
          {/* Contact Info List */}
          <div className="flex flex-col gap-y-4 mt-6">
            {CONATACTS.map((contact, index) => (
              // Contact Info Item
              <div key={index} className="flex items-center gap-x-4">
                {/* Info Icon */}
                <img
                  className="h-14 w-14"
                  src={contact.img}
                  alt={contact.alt}
                />
                {/* Info Contents */}
                <div>
                  <p className="text-[14px] font-medium text-white/70 mb-1">
                    {contact.name}
                  </p>
                  {/* Added: split the opening hours into two lines
                      (Sun-Fri vs Saturday) instead of a single value string.
                      I don't have @/constants here, so this matches on the
                      "Open Hour" label seen in the design — let me know if
                      the actual key in CONATACTS is named differently. */}
                  {contact.name === "Open Hour" ? (
                    <div className="font-bold">
                      <p>8:00 AM - 7:00 PM</p>
                      {/* <p>Saturday: 9:00 AM - 5:00 PM</p> */}
                    </div>
                  ) : (
                    <p className="font-bold">{contact.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom credit bar — separated from the main footer grid by a
          hairline divider. Swap the placeholder name/href below with your
          actual studio name and URL. */}
      <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-y-3 text-[13px] text-white/60">
        <p>
          &copy; {new Date().getFullYear()} Parampara Divya Ayurvedic. All rights
          reserved.
        </p>
        <p>
          Crafted by{" "}
          <a
            // href="https://your-website.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white/80 hover:text-white transition-colors"
          >
            ORBIXXANO
          </a>
        </p>
      </div>
    </div>
  </footer>
);