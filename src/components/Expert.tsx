"use client";

import { useSectionFade } from "@/hooks/useSectionFade";

export const Expert = () => {
    const { ref, isVisible } = useSectionFade<HTMLElement>();

    return (
    <section ref={ref} className={`section py-16 ${isVisible ? "" : "section-fade"}`}>
            <div className="container">
                <div className="flex flex-col lg:flex-row items-center gap-x-20 gap-y-12">
                    {/* Emergency Contents */}
                    <div className="flex flex-col gap-y-4 text-center lg:text-start">
                        {/* Title */}
                        <h4 className="text-sm text-primary font-bold">EXPERTS IN AYURVEDIC CARE</h4>
                        {/* Subtitle */}
                        <p className="text-slate-800 text-4xl leading-snug font-bold sm:max-w-screen-sm">Authentic Ayurvedic care guided by experience.</p>
                        {/* Description */}
                        <p className="max-w-lg lg:max-w-md mx-auto lg:mx-0 text-[15px] font-medium text-slate-800/70">OOur experienced Ayurvedic practitioners provide personalized consultations and traditional Ayurvedic care with a thoughtful approach to each patient's individual needs.</p>
                        <div className="flex flex-col gap-y-2 child:text-[#181945] child:text-[15px] child:font-medium mt-4">
                            <p className="flex items-center gap-x-2">
                                <svg className="w-5 h-5 text-primary">
                                    <use href="#check-circle"></use>
                                </svg>
                                Experienced Ayurvedic Practitioners
                            </p>
                            <p className="flex items-center gap-x-2">
                                <svg className="w-5 h-5 text-primary">
                                    <use href="#check-circle"></use>
                                </svg>
                                Personalized & Holistic Care
                            </p>
                        </div>
                    </div>
                     {/* Emergency image */}
                     <div className="flex order-first lg:order-last">
                        <img className="hidden lg:block" src="/images/expert-in-ayurvedic-desktop.webp" alt="expert-in-dental-desktop.png" />
                        <img className="lg:hidden" src="/images/expert-in-ayurvedic-mobile.webp" alt="expert-in-dental-mobile.png" />
                    </div>
                </div>
            </div>
        </section>
    );
};