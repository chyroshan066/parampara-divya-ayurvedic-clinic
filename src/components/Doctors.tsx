"use client";

import { useEffect, useRef } from "react";
import { useSectionFade } from "@/hooks/useSectionFade";
import { DOCTORS } from "@/constants";

declare global {
  interface Window {
    Swiper: any;
  }
}

export const Doctors = () => {
    const { ref, isVisible } = useSectionFade<HTMLElement>();

    // Refs to the actual DOM nodes for Swiper's root, pagination, and nav
    // controls. Passing real elements (instead of CSS-selector strings)
    // matters here: when Swiper is given a string, it only searches inside
    // its own root element for a match. Our pagination dots and prev/next
    // buttons intentionally live in a separate row below the cards (not
    // nested inside .swiper-2), so a string selector like ".swiper-pagination"
    // or ".doctors-next" would never find them — that's why the dots never
    // rendered and the arrows weren't actually wired up before. Refs
    // sidestep that scoping entirely.
    const containerRef = useRef<HTMLDivElement>(null);
    const paginationRef = useRef<HTMLDivElement>(null);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        let swiperInstance: any;
        let pollInterval: ReturnType<typeof setInterval> | undefined;

        // Equalizes card heights in JS rather than leaning on flexbox
        // stretch (which didn't hold up in practice). Measures each card's
        // own natural height, then applies the tallest one to all of them
        // as a min-height floor.
        //
        // Deliberately called only from inside initSwiper below (after
        // Swiper has actually finished laying out the real 1/2/3-column
        // widths), not as an independent effect on mount. On first paint,
        // before Swiper's JS applies its narrow column widths, cards render
        // near full width and the long qualification lines still fit on
        // one line — measuring at that point locks in a too-small height
        // that never grows back once Swiper narrows the columns and the
        // text re-wraps to two lines a moment later.
        const equalizeCardHeights = () => {
            const cards = cardRefs.current.filter(
                (el): el is HTMLDivElement => el !== null
            );
            if (!cards.length) return;

            cards.forEach((el) => {
                el.style.minHeight = "";
            });

            requestAnimationFrame(() => {
                const tallest = Math.max(
                    ...cards.map((el) => el.getBoundingClientRect().height)
                );
                cards.forEach((el) => {
                    el.style.minHeight = `${tallest}px`;
                });
            });
        };


        const initSwiper = () => {
            if (typeof window.Swiper === "undefined" || !containerRef.current) {
                return false;
            }

            swiperInstance = new window.Swiper(containerRef.current, {
                direction: "horizontal",
                loop: true,
                autoplay: {
                    delay: 3000,
                    pauseOnMouseEnter: true,
                },
                // Re-measures slide height if the DOM inside this section
                // changes after mount (e.g. content swapping in later).
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 24,
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                },
                pagination: {
                    el: paginationRef.current,
                    clickable: true,
                },
                navigation: {
                    nextEl: nextRef.current,
                    prevEl: prevRef.current,
                },
            });

            // Belt-and-braces re-measure once the real webfont has swapped
            // in. A fallback font can wrap the longer qualification lines
            // (e.g. "Prosthodontist, Implantologist and TMJ Specialist")
            // differently than the final font, which leaves the equalized
            // height stale.
            if (typeof document !== "undefined" && "fonts" in document) {
                document.fonts.ready.then(() => {
                    swiperInstance?.update();
                    equalizeCardHeights();
                });
            }

            // Swiper has now applied the real narrow column widths, so this
            // is the first point where measuring card heights is reliable.
            equalizeCardHeights();

            // Re-run whenever Swiper recalculates layout (e.g. a
            // breakpoint changes slidesPerView on window resize), and also
            // listen to window resize directly as a fallback.
            swiperInstance.on("resize", equalizeCardHeights);
            swiperInstance.on("breakpoint", equalizeCardHeights);
            window.addEventListener("resize", equalizeCardHeights);

            return true;
        };

        if (!initSwiper()) {
            pollInterval = setInterval(() => {
                if (initSwiper() && pollInterval) clearInterval(pollInterval);
            }, 100);
        }

        return () => {
            if (pollInterval) clearInterval(pollInterval);
            window.removeEventListener("resize", equalizeCardHeights);
            swiperInstance?.destroy(true, true);
        };
    }, []);

    return (
        <section
            id="team"
            ref={ref}
            className={`section py-16 ${isVisible ? "" : "section-fade"}`}
        >
            <div className="container">
                {/* Section Header */}
                <div className="flex flex-col items-center gap-y-4 text-center mb-12">
                    <h4 className="text-sm text-primary font-bold">OUR TEAM</h4>
                    <p className="text-slate-800 text-4xl leading-snug font-bold sm:max-w-screen-sm">
                        Meet Our Ayurvedic Care Team
                    </p>
                    <p className="max-w-lg text-[15px] font-medium text-slate-800/70">
                        Our experienced Ayurvedic practitioners and healthcare professionals are committed to providing personalized, thoughtful care with a focus on your individual health and well-being.
                    </p>
                </div>

                {/* Doctor cards in a Swiper carousel showing 1/2/3 at a time
                    depending on viewport. */}
                <div className="swiper swiper-2" ref={containerRef}>
                    <div className="swiper-wrapper">
                        {DOCTORS.map((doctor, index) => (
                            <div key={index} className="swiper-slide h-auto !mb-0 p-2">
                                <div
                                    ref={(el) => {
                                        cardRefs.current[index] = el;
                                    }}
                                    className="flex h-full flex-col items-center text-center gap-y-3 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm transition-all hover:shadow-2xl hover:shadow-slate-400/20 hover:-translate-y-1"
                                >
                                    {/* Photo */}
                                    {/* <img
                                        src={doctor.img}
                                        alt={doctor.name}
                                        className="w-28 h-28 rounded-full object-cover border-4 border-primary/10"
                                    /> */}
                                    {/* Name + qualification grouped up top; the
                                        badge is pushed to the bottom via
                                        mt-auto so it lines up across cards
                                        even when the qualification text wraps
                                        to two lines on some cards. */}
                                    <div className="flex flex-col items-center gap-y-3">
                                        <p className="text-slate-800 text-lg font-bold mt-2">
                                            {doctor.name}
                                        </p>
                                        <p className="text-primary text-sm font-bold">
                                            {doctor.qualification}
                                        </p>
                                    </div>
                                    {/* <span className="mt-auto bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                        NMC No: {doctor.nmcNo}
                                    </span> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination dots + prev/next arrows, wired up via refs
                    above so they work correctly despite living outside the
                    .swiper-2 root. `!static` keeps the dots as a normal
                    flex item in this row instead of Swiper's default
                    position:absolute placement. */}
                <div className="flex items-center justify-center gap-x-6 mt-10">
                    <button
                        ref={prevRef}
                        type="button"
                        aria-label="Previous dentist"
                        className="doctors-prev flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/20"
                        style={{ transform: "rotate(180deg)" }}
                    >
                        <svg className="w-6 h-6">
                            <use href="#arrow-right-circle" />
                        </svg>
                    </button>
                    <div ref={paginationRef} className="swiper-pagination !static !w-auto" />
                    <button
                        ref={nextRef}
                        type="button"
                        aria-label="Next dentist"
                        className="doctors-next flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/20"
                    >
                        <svg className="w-6 h-6">
                            <use href="#arrow-right-circle" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};