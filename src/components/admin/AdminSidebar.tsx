"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquaresFour, CalendarCheck, Images, X } from "@phosphor-icons/react";
import { useClickOutside } from "@/hooks/useClickOutside";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: SquaresFour },
  { name: "Appointments", href: "/admin/appointments", icon: CalendarCheck },
  { name: "Gallery", href: "/admin/gallery", icon: Images },
];

function SidebarNav({
  pathname,
  onNavigate,
  isCollapsed,
}: {
  pathname: string | null;
  onNavigate?: () => void;
  isCollapsed?: boolean;
}) {
  return (
    <nav className="flex flex-col gap-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        // if (item.comingSoon) {
        //   return (
        //     <div
        //       key={item.href}
        //       title="Coming soon"
        //       className="flex items-center justify-between gap-x-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed"
        //     >
        //       <span className="flex items-center gap-x-3">
        //         <Icon className="w-5 h-5" weight="bold" />
        //         {item.name}
        //       </span>
        //       <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-slate-400">
        //         Soon
        //       </span>
        //     </div>
        //   );
        // }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={isCollapsed ? item.name : undefined}
            className={`flex items-center gap-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
              isCollapsed ? "justify-center px-0" : ""
            } ${
              isActive
                ? "bg-primary text-white"
                : "text-slate-600 hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" weight="bold" />
            {!isCollapsed && item.name}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBrand({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <div
      className={`flex items-center gap-x-2 px-2 ${
        isCollapsed ? "justify-center px-0" : ""
      }`}
    >
      <img
        style={{ height: "32px", width: "auto", objectFit: "contain" }}
        src="/images/logo.webp"
        alt="Om Kapan Dental"
      />
      {!isCollapsed && (
        <span className="text-slate-800 font-bold text-base">Admin</span>
      )}
    </div>
  );
}

interface AdminSidebarProps {
  isMobileOpen: boolean;
  isDesktopCollapsed?: boolean;
  onClose: () => void;
}

export function AdminSidebar({
  isMobileOpen,
  isDesktopCollapsed,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const mobileSidebarRef = useRef<HTMLElement>(null);

  // Same hook DatePicker/TimePicker already use — detects clicks by
  // comparing the actual event target against this ref, so it works
  // regardless of any backdrop z-index/stacking-context uncertainty.
  useClickOutside(mobileSidebarRef, onClose, isMobileOpen);

  return (
    <>
      {/* --- Desktop: always-visible, in normal document flow. Width
          animates between the full 64 (w-64) and a collapsed icon-only
          20 (w-20) based on the hamburger toggle in AdminTopbar. --- */}
      <aside
        className={`hidden md:flex shrink-0 flex-col bg-white border-r border-gray-100 px-4 py-6 transition-all duration-300 ${
          isDesktopCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="mb-8">
          <SidebarBrand isCollapsed={isDesktopCollapsed} />
        </div>
        <SidebarNav pathname={pathname} isCollapsed={isDesktopCollapsed} />
      </aside>

      {/* --- Mobile: overlay backdrop + slide-in drawer, hidden entirely
          above the md breakpoint. Uses the same left-offset slide
          technique (not translate-x transform utilities) as Header.tsx's
          mobile menu, since that's the pattern already proven to work
          in this codebase. Closing on outside-click is handled by
          useClickOutside above (via mobileSidebarRef) rather than this
          backdrop's own onClick, so the backdrop is purely visual here. --- */}
      <div
        className={`${
          isMobileOpen ? "" : "hidden"
        } fixed inset-0 bg-black/40 transition-all z-40 md:hidden pointer-events-none`}
      />
      <aside
        ref={mobileSidebarRef}
        className={`w-72 bg-white fixed top-0 ${
          isMobileOpen ? "left-0" : "-left-72"
        } bottom-0 z-50 flex flex-col px-4 py-6 border-r border-gray-100 transition-all md:hidden`}
      >
        <div className="flex items-center justify-between mb-8">
          <SidebarBrand />
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 transition-colors hover:bg-gray-100 hover:text-slate-600"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" weight="bold" />
          </button>
        </div>
        <SidebarNav pathname={pathname} onNavigate={onClose} />
      </aside>
    </>
  );
}