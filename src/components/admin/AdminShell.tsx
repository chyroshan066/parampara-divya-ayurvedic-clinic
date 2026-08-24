"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

interface AdminShellProps {
  email: string;
  children: React.ReactNode;
}

export function AdminShell({ email, children }: AdminShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // Desktop sidebar starts expanded; the hamburger toggles this at >=md
  // the same way it toggles the mobile drawer at <md.
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  // Single handler for the one hamburger button. Only one of these two
  // states is ever visually relevant at a given viewport width (the other
  // side is hidden via the sidebar's own md: classes), so toggling both
  // unconditionally is safe and keeps the button's behavior simple.
  const handleMenuClick = () => {
    setIsMobileSidebarOpen((prev) => !prev);
    setIsDesktopSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar email={email} onMenuClick={handleMenuClick} />
        <main className="flex-1 px-4 sm:px-8 py-8">{children}</main>
      </div>
    </div>
  );
}