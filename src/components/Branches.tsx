"use client";

import { Fragment, useEffect, useRef } from "react";
import { MapPin, Phone, Envelope, Clock } from "@phosphor-icons/react";
import { BRANCHES } from "@/constants";
import { useSectionFade } from "@/hooks/useSectionFade";

declare global {
    interface Window {
        Swiper: any;
    }
}

export const Branches = () => {
    const { ref, isVisible } = useSectionFade<HTMLElement>();

    // Same ref-based Swiper pattern as Doctors.tsx: pass real DOM nodes
    // (not CSS-selector strings) for the root/pagination/nav so they work
    // correctly regardless of where they sit in the DOM relative to
    // .swiper-3, and equalize card heights only after Swiper has actually
    // laid out the real column widths.
    const containerRef = useRef<HTMLDivElement>(null);
    const paginationRef = useRef<HTMLDivElement>(null);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        let swiperInstance: any;
        let pollInterval: ReturnType<typeof setInterval> | undefined;

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
                    delay: 3500,
                    pauseOnMouseEnter: true,
                },
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

            if (typeof document !== "undefined" && "fonts" in document) {
                document.fonts.ready.then(() => {
                    swiperInstance?.update();
                    equalizeCardHeights();
                });
            }

            equalizeCardHeights();

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
            id="branches"
            ref={ref}
            className={`section py-16 ${isVisible ? "" : "section-fade"}`}
        >
            <div className="container">
                {/* Section Header — same pattern as Doctors/Features */}
                <div className="flex flex-col items-center gap-y-4 text-center mb-12">
                    <h4 className="text-sm text-primary font-bold">OUR LOCATIONS</h4>
                    <p className="text-slate-800 text-4xl leading-snug font-bold sm:max-w-screen-sm">
                        Find a clinic near you
                    </p>
                    <p className="max-w-lg text-[15px] font-medium text-slate-800/70">
                        Visit us at any of our branches for the same quality,
                        patient-first dental care.
                    </p>
                </div>

                {/* Branch cards in a Swiper carousel showing 1/2/3 at a time
                    depending on viewport. */}
                <div className="swiper swiper-3" ref={containerRef}>
                    <div className="swiper-wrapper">
                        {BRANCHES.map((branch, index) => {
                            // Falls back to a maps search built from the
                            // address when a branch doesn't have a real
                            // mapUrl yet, so the button always works.
                            const directionsUrl =
                                branch.mapUrl ||
                                `https://www.google.com/maps?q=${encodeURIComponent(
                                    branch.address
                                )}`;

                            return (
                                <div
                                    key={index}
                                    className="swiper-slide h-auto !mb-0 p-2"
                                >
                                    <div
                                        ref={(el) => {
                                            cardRefs.current[index] = el;
                                        }}
                                        className="flex h-full flex-col gap-y-6 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm transition-all hover:shadow-2xl hover:shadow-slate-400/20 hover:-translate-y-1"
                                    >
                                        {/* Branch name + tag */}
                                        <div className="flex items-center gap-x-4">
                                            <img
                                                className="block w-14 h-14 shrink-0"
                                                src="/images/icons/home-icon.webp"
                                                alt="branch-icon"
                                            />
                                            <div>
                                                <p className="text-slate-800 text-lg font-bold leading-snug">
                                                    {branch.name}
                                                </p>
                                                <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mt-1">
                                                    {branch.tag}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Branch details. Every icon here
                                            comes from the same Phosphor set
                                            at the same size/weight so they
                                            stay visually consistent — mixing
                                            the raster icon set in with
                                            Phosphor's Phone icon was what
                                            caused the mismatch before. */}
                                        <div className="flex flex-col gap-y-3">
                                            <p className="flex items-start gap-x-3 text-[15px] font-medium text-slate-800/70">
                                                <MapPin
                                                    weight="fill"
                                                    className="w-5 h-5 mt-0.5 shrink-0 text-primary"
                                                />
                                                {branch.address}
                                            </p>
                                            <p className="flex items-start gap-x-3 text-[15px] font-medium text-slate-800/70">
                                                <Phone
                                                    weight="fill"
                                                    className="w-5 h-5 mt-0.5 shrink-0 text-primary"
                                                />
                                                <span>
                                                    {branch.phone
                                                        .split("/")
                                                        .map((part) => part.trim())
                                                        .map((part, i, arr) => (
                                                            <Fragment key={i}>
                                                                <span className="whitespace-nowrap">
                                                                    {part}
                                                                </span>
                                                                {i < arr.length - 1
                                                                    ? " / "
                                                                    : ""}
                                                            </Fragment>
                                                        ))}
                                                </span>
                                            </p>
                                            {/* Email — only rendered when present */}
                                            {branch.email && (
                                                <p className="flex items-center gap-x-3 text-[15px] font-medium text-slate-800/70 break-all">
                                                    <Envelope
                                                        weight="fill"
                                                        className="w-5 h-5 shrink-0 text-primary"
                                                    />
                                                    {branch.email}
                                                </p>
                                            )}
                                            {/* Hours — only rendered when present */}
                                            {branch.hours && (
                                                <p className="flex items-center gap-x-3 text-[15px] font-medium text-slate-800/70">
                                                    <Clock
                                                        weight="fill"
                                                        className="w-5 h-5 shrink-0 text-primary"
                                                    />
                                                    {branch.hours}
                                                </p>
                                            )}
                                        </div>

                                        {/* Get directions */}
                                        {branch.mapUrl && (<a
                                            href={directionsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-auto inline-flex h-11 items-center justify-center gap-x-2 rounded-xl bg-primary text-white text-sm font-bold transition-colors hover:bg-indigo-800"
                                        >
                                            Get Directions
                                            <svg className="w-5 h-5">
                                                <use href="#arrow-right-circle" />
                                            </svg>
                                        </a>)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pagination dots + prev/next arrows */}
                <div className="flex items-center justify-center gap-x-6 mt-10">
                    <button
                        ref={prevRef}
                        type="button"
                        aria-label="Previous branch"
                        className="branches-prev flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/20"
                        style={{ transform: "rotate(180deg)" }}
                    >
                        <svg className="w-6 h-6">
                            <use href="#arrow-right-circle" />
                        </svg>
                    </button>
                    <div
                        ref={paginationRef}
                        className="swiper-pagination !static !w-auto"
                    />
                    <button
                        ref={nextRef}
                        type="button"
                        aria-label="Next branch"
                        className="branches-next flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/20"
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