import Link from "next/link";
import { House, List } from "@phosphor-icons/react/dist/ssr";
import { LogoutButton } from "@/components/admin/LogoutButton";

interface AdminTopbarProps {
  email: string;
  onMenuClick: () => void;
}

export function AdminTopbar({ email, onMenuClick }: AdminTopbarProps) {
  return (
    <div className="flex items-center justify-between gap-x-4 bg-white border-b border-gray-100 px-4 sm:px-8 py-4">
      <div className="flex items-center gap-x-3">
        {/* Hamburger — mobile only, opens the sidebar drawer */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-slate-600 transition-colors hover:text-primary hover:border-primary"
          aria-label="Toggle menu"
        >
          <List className="w-5 h-5" weight="bold" />
        </button>

        <Link
          href="/"
          title="View site"
          aria-label="View site"
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-slate-600 transition-colors hover:text-primary hover:border-primary"
        >
          <House className="w-5 h-5" weight="bold" />
        </Link>
      </div>

      <div className="flex items-center gap-x-4">
        <p className="hidden sm:block text-sm text-slate-800/60">
          Signed in as <span className="font-bold text-slate-800">{email}</span>
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}