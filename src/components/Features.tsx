"use client";

import { FEATURES } from "@/constants";
import { useSectionFade } from "@/hooks/useSectionFade";

export const Features = () => {
  const { ref, isVisible } = useSectionFade<HTMLElement>();

  return (
  <section ref={ref} className={`section py-16 ${isVisible ? "" : "section-fade"}`}>
    <div className="container">
      {/* Feature Container */}
      <div className="bg-[#dbe9c5] p-10 sm:p-12 md:px-16 md:py-[3.5rem] lg:px-32 lg:py-20 xl:py-24 xl:px-60 rounded-3xl">
        {/* Feature info */}
        <div className="flex flex-col gap-y-4 mb-12 sm:mb-14 md:mb-16 lg:mb-20 text-center lg:text-start">
          {/* Title */}
          <h4 className="text-sm text-primary font-bold">Features</h4>
          {/* Subtitle */}
          <p className="text-slate-800 text-4xl leading-snug font-bold">
            Specialized care through experience
          </p>
          {/* Description */}
          <p className="text-[15px] font-medium text-slate-800/50">
            Every treatment is backed by strict safety standards, a full range
            of services, and a team that puts your comfort first.
          </p>
        </div>
        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-14">
          {FEATURES.map((feature, index) => (
            // Feature item
            <div
              key={index}
              className="flex items-center flex-col xs:flex-row sm:flex-col lg:flex-row gap-4"
            >
              {/* Feature image */}
              <div className="w-16 h-16 shrink-0">
                <img src={feature.img} alt={feature.title} />
              </div>
              {/* Feature Content */}
              <div className="text-center xs:text-start sm:text-center lg:text-start">
                {/* Feature item title */}
                <p className="text-slate-800 font-bold mb-1">{feature.title}</p>
                {/* Feature item Description */}
                <p className="text-sm font-medium text-slate-800/50">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};