"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardSidebarLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export function DashboardSidebarLink({ href, label, icon: Icon, exact }: DashboardSidebarLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
        isActive
          ? "bg-gradient-to-r from-sand-50 to-amber-50 text-sand-700 shadow-sm"
          : "text-clay-500 hover:bg-desert-50 hover:text-clay-700"
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-sand-500 to-clay-600 rounded-r-full" />
      )}
      <Icon
        className={cn(
          "w-4 h-4 shrink-0 transition-transform duration-200",
          isActive ? "text-sand-600 scale-110" : "group-hover:scale-105"
        )}
      />
      <span className="flex-1">{label}</span>
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-sand-500 animate-pulse" />
      )}
    </Link>
  );
}
