"use client";

import { useEffect } from "react";
import { TESTIMONIALS } from "@/constants";
import { useSectionFade } from "@/hooks/useSectionFade";

declare global {
  interface Window {
    Swiper: any;
  }
}

export const Testimonial = () => {
  const { ref, isVisible } = useSectionFade<HTMLElement>();

  useEffect(() => {
    let swiperInstance: any;
    let pollInterval: ReturnType<typeof setInterval> | undefined;

    const initSwiper = () => {
      if (typeof window.Swiper === "undefined") return false;

      swiperInstance = new window.Swiper(".swiper-1", {
        direction: "horizontal",
        loop: true,
        autoplay: {
          delay: 2000,
          pauseOnMouseEnter: true,
        },
        slidesPerView: 1,
        spaceBetween: 20,
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
      return true;
    };

    if (!initSwiper()) {
      pollInterval = setInterval(() => {
        if (initSwiper() && pollInterval) clearInterval(pollInterval);
      }, 100);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      swiperInstance?.destroy(true, true);
    };
  }, []);

  return (
    <section ref={ref} className={`section py-16 ${isVisible ? "" : "section-fade"}`}>
            <div className="container">
                <div className="bg-[#d9e3be] rounded-3xl p-10 md:px-16 md:py-[3.5rem] lg:py-20 xl:py-24">
                    {/* TESTIMONIAL info contents */}
                    <div className="flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:items-center gap-y-4">
                        {/* Left Side */}
                        <div className="text-center lg:text-start">
                            {/* Title */}
                            <h3 className="text-sm text-primary font-bold mb-3">TESTIMONIAL</h3>
                            {/* Subtitle */}
                            <p className="text-slate-800 text-3xl xs:text-4xl lg:max-w-[400px] leading-snug xs:leading-snug font-bold">What people have said about us</p>
                        </div>
                        {/* Right Side */}
                        <p className="text-center lg:text-start lg:max-w-sm text-[15px] font-medium text-slate-800/70 -mb-8">Real experiences from real patients who trusted us with their smiles.</p>
                    </div>
                    {/* User TESTIMONIAL */}
                    <div className="swiper swiper-1">
                        <div className="swiper-wrapper mt-28">
                            {/* TESTIMONIAL item */}
                            {TESTIMONIALS.map((testimonial, index) => (
                                <div key={index} className="swiper-slide relative bg-white rounded-3xl p-8">
                                {/* User Avatar image */}
                                <div className="absolute mx-auto w-max left-0 right-0 top-0 translate-y-[-50%] border-8 rounded-full border-[#D9EBFA]">
                                    <img src={testimonial.img} alt="user-avatar-1" />
                                </div>
                                <div className="text-center mt-8">
                                    {/* User Name */}
                                    <p className="font-bold text-slate-800 mb-2">{testimonial.name}</p>
                                    {/* User Comment */}
                                    <p className="text-[15px] font-medium text-slate-800/70">{testimonial.comment}</p>
                                    <div className="flex items-center justify-center mt-6">
                                        {[...Array(5)].map((_, starIndex) => (
                                            <svg
                                                key={starIndex}
                                                className={`w-5 h-5 ${
                                                    starIndex < testimonial.star
                                                        ? "text-orange-star"
                                                        : "text-gray-400/90"
                                                }`}
                                            >
                                                <use href="#star"></use>
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className="swiper-pagination" />
                    </div>
                </div>
            </div>
        </section>
  );
};