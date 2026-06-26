"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AdminSidebarLinkProps {
  href: string;
  labelEn: string;
  labelAr: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number | null;
  isRTL: boolean;
}

export function AdminSidebarLink({
  href, labelEn, labelAr, icon: Icon, exact, badge, isRTL,
}: AdminSidebarLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
        isActive
          ? "bg-sand-500/15 text-sand-400 border border-sand-500/20"
          : "text-clay-400 hover:bg-clay-800 hover:text-clay-200"
      )}
    >
      {/* Active side bar */}
      {isActive && (
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-sand-400 to-sand-600 rounded-full",
            isRTL ? "right-0" : "left-0"
          )}
        />
      )}
      <Icon
        className={cn(
          "w-4 h-4 shrink-0 transition-all duration-200",
          isActive ? "text-sand-400 scale-110" : "group-hover:scale-105"
        )}
      />
      <span className="flex-1">{isRTL ? labelAr : labelEn}</span>
      {badge != null && badge > 0 && (
        <span className="min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      {isActive && !badge && (
        <span className="w-1.5 h-1.5 rounded-full bg-sand-400" />
      )}
    </Link>
  );
}
