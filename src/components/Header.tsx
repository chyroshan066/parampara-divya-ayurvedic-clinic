"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NAVLINKS } from "@/constants";
import Link from "next/link";
import { LockKey, SquaresFour } from "@phosphor-icons/react";

export const Header = ({ isAdminLoggedIn }: { isAdminLoggedIn: boolean }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const showMobileMenu = () => setIsMobileMenuOpen(true);
  const hideMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return; // plain route — let normal navigation happen

    const hash = href.slice(hashIndex); // e.g. "#contact"
    const targetPath = href.slice(0, hashIndex) || "/";

    e.preventDefault();

    if (pathname === targetPath) {
      // Already on the right page — just scroll, no navigation needed.
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate first (scroll: false so Next doesn't try its own,
      // less-reliable hash-scroll behavior), then let the effect below
      // scroll smoothly once the new page has rendered.
      router.push(href, { scroll: false });
    }
  };

  // After a cross-page hash navigation lands, scroll to the target
  // section smoothly. Handled manually rather than relying on Next's
  // built-in post-navigation hash scroll, which doesn't reliably respect
  // the global `scroll-behavior: smooth` CSS.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;

    const timer = setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    let ticking = false;

    const updateHeaderState = () => {
      const currentScrollY = window.scrollY;

      // Always show near the top of the page
      if (currentScrollY < 100) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down -> hide
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up -> show
        setIsHeaderVisible(true);
      }

      setIsScrolled(currentScrollY > 10);
      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderState);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Spacer to preserve layout height now that the header is fixed */}
      <div className="h-[100px]" />
      <header
        className="fixed top-0 left-0 w-full h-[100px] z-[999] bg-white transition-all"
        style={{
          transform: isHeaderVisible ? "translateY(0)" : "translateY(-100%)",
          transitionProperty: "transform, box-shadow",
          transitionDuration: "300ms",
          transitionTimingFunction: "ease-in-out",
          boxShadow: isScrolled ? "0 2px 10px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="container flex items-center h-full">
          <div className="flex justify-between items-center h-12 w-full">
          {/* Header Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
              src="/images/logo.webp"
              alt="Site-Logo"
            />
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
              Parampara Divya Ayurvedic
            </span>
          </a>
          {/* Header Menu */}
          <nav className="hidden lg:block">
            <ul className="flex gap-x-10 xl:gap-x-12 text-slate-800 text-sm font-bold child:transition-colors child:delay-75 child-hover:text-primary">
              {NAVLINKS.map((link, index) =>
                link.href.includes("#") ? (
                  <li key={index}>
                    <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                      {link.name}
                    </a>
                  </li>
                ) : (
                  <li key={index}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                )
              )}
            </ul>
          </nav>
          {/* Header Button + Admin Login */}
          <div className="hidden lg:flex items-center gap-x-3">
            <a
              className="h-full w-44 bg-primary text-white text-sm font-bold text-center leading-[3rem] rounded-xl transition-colors hover:bg-primary-hover"
              href="/#contact"
              onClick={(e) => handleNavClick(e, "/#contact")}
            >
              Book appointment
            </a>
            <a
              href={isAdminLoggedIn ? "/admin/dashboard" : "/admin/login"}
              title={isAdminLoggedIn ? "Dashboard" : "Admin Login"}
              aria-label={isAdminLoggedIn ? "Dashboard" : "Admin Login"}
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-gray-200 text-slate-500 transition-colors hover:text-primary hover:border-primary"
            >
              {isAdminLoggedIn ? (
                <SquaresFour className="w-5 h-5" weight="bold" />
              ) : (
                <LockKey className="w-5 h-5" weight="bold" />
              )}
            </a>
          </div>
          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden relative">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={showMobileMenu}
            >
              <svg className="w-8 h-8">
                <use href="#bars" />
              </svg>
            </button>
          </div>
        </div>
        </div>
      </header>

      {/*
        Mobile menu overlay + drawer rendered OUTSIDE the <header>.
        The header is animated with an inline `transform`, which makes it a
        containing block for any `position: fixed` descendants — if the
        drawer stayed inside the header, it would be positioned relative to
        the header's 100px box instead of the viewport. Keeping it as a
        sibling ensures it stays correctly pinned to the full viewport
        regardless of the header's slide animation.
      */}
      {/* Menu Background Overlay */}
      <div
        id="mobile-menu-overlay"
        className={`${
          isMobileMenuOpen ? "" : "hidden"
        } fixed inset-0 bg-black/40 transition-all z-[999]`}
        onClick={hideMobileMenu}
      />
      {/* Mobile Menu Container */}
      <div
        id="mobile-menu-container"
        className={`w-80 bg-white fixed top-0 ${
          isMobileMenuOpen ? "left-0" : "-left-80"
        } bottom-0 transition-all flex flex-col z-[999]`}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-b-gray-100/50">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              style={{ height: "32px", width: "auto", objectFit: "contain" }}
              src="/images/logo.webp"
              alt="logo"
            />
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
              Parampara Divya Ayurved
            </span>
          </div>
          <button type="button" id="close-button" onClick={hideMobileMenu}>
            <svg className="w-5 h-5">
              <use href="#close-mark" />
            </svg>
          </button>
        </div>
        {/* Mobile Menu Nav */}
        <nav className="p-4 grow">
          {/* Menu List */}
          <ul className="flex flex-col gap-y-5 text-slate-800 text-sm font-medium child:transition-colors child:delay-75 child-hover:text-primary">
            {NAVLINKS.map((link, index) =>
              link.href.includes("#") ? (
                <li key={index}>
                  <a
                    className="flex items-center gap-x-1"
                    href={link.href}
                    onClick={(e) => {
                      handleNavClick(e, link.href);
                      hideMobileMenu();
                    }}
                  >
                    <svg className="w-5 h-5">
                      <use href={`#${link.icon}`} />
                    </svg>
                    {link.name}
                  </a>
                </li>
              ) : (
                <li key={index}>
                  <Link
                    className="flex items-center gap-x-1"
                    href={link.href}
                    onClick={hideMobileMenu}
                  >
                    <svg className="w-5 h-5">
                      <use href={`#${link.icon}`} />
                    </svg>
                    {link.name}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
        {/* Buttons */}
        <div className="p-4 flex flex-col gap-y-3">
          <a
            className="block w-full h-12 leading-[2.8rem] bg-primary text-white text-sm font-bold text-center rounded-xl transition-colors hover:bg-indigo-800"
            href="/#contact"
            onClick={(e) => {
              handleNavClick(e, "/#contact");
              hideMobileMenu();
            }}
          >
            Book appointment
          </a>
          <a
            className="flex items-center justify-center gap-x-2 w-full h-11 text-sm font-bold text-slate-600 border border-gray-200 rounded-xl transition-colors hover:text-primary hover:border-primary"
            href={isAdminLoggedIn ? "/admin/dashboard" : "/admin/login"}
            onClick={hideMobileMenu}
          >
            {isAdminLoggedIn ? (
              <SquaresFour className="w-4 h-4" weight="bold" />
            ) : (
              <LockKey className="w-4 h-4" weight="bold" />
            )}
            {isAdminLoggedIn ? "Dashboard" : "Admin Login"}
          </a>
        </div>
      </div>
    </>
  );
};