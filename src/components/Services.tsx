"use client";

import { useState } from "react";
import { SERVICES } from "@/constants";
import Link from "next/link";
import { useSectionFade } from "@/hooks/useSectionFade";

export const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isHovering = hoveredIndex !== null;
  const { ref, isVisible } = useSectionFade<HTMLElement>();

  return (
    <section id="services" ref={ref} className={`section mb-32 ${isVisible ? "" : "section-fade"}`}>
      <div className="container">
        <div className="flex flex-col gap-14 lg:gap-y-16 xl:gap-y-20">
          {/* Service Info Contents */}
          <div
            className="services-contents flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:items-center gap-y-4 transition-all"
            style={{ opacity: isHovering ? 0.5 : 1 }}
          >
            {/* Left Side */}
            <div className="text-center lg:text-start">
              {/* Title */}
              <h3 className="text-sm text-primary font-bold mb-3">SERVICES</h3>
              {/* Subtitle */}
              <p className="text-slate-800 text-3xl xs:text-4xl lg:max-w-[340px] leading-snug xs:leading-snug font-bold">
                Holistic Care for Your Health & Well-Being
              </p>
            </div>
            {/* Right Side */}
            <p className="text-center lg:text-start lg:max-w-screen-xs text-[15px] font-medium text-slate-800/70 -mb-8">
              From Ayurvedic consultation and personalized treatment to pathology laboratory services, we provide comprehensive healthcare under one roof. Our approach combines traditional Ayurvedic practices with attentive, patient-focused care to support your overall health and wellness.
            </p>
          </div>
          {/* Services */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5 child:transition-all child-hover:shadow-2xl mt-6 lg:mt-0 child-hover:shadow-slate-400/20 child-hover:border-gray-100 child:cursor-pointer">
            {SERVICES.slice(0, 4).map((service, index) => (
              // Service Item
              <div
                key={index}
                className="services-item rounded-[32px] border p-4 flex flex-col gap-y-4"
                style={{
                  opacity: isHovering ? (hoveredIndex === index ? 1 : 0.5) : 1,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  className="w-full rounded-[32px]"
                  src={service.img}
                  alt={service.name}
                />
                <div className="text-center space-y-2">
                  <h3 className="text-slate-800 font-bold">{service.name}</h3>
                  <p className="text-[15px] font-medium text-slate-800/50">
                    {service.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* More Service Call to Action Button */}
          <div
            className="services-more transition-all"
            style={{ opacity: isHovering ? 0.5 : 1 }}
          >
            <Link
              href="/services"
              className="w-max mx-auto flex items-center gap-x-1 p-3 rounded-xl text-sm font-bold text-primary bg-primary/10 transition-colors hover:bg-primary/20"
            >
              View all service list
              <svg className="w-5 h-5">
                <use href="#arrow-right-circle" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};