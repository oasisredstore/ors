"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, UserCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardMobileNavProps {
  locale: string;
  role: string;
}

export function DashboardMobileNav({ locale, role }: DashboardMobileNavProps) {
  const pathname = usePathname();
  const isAr = locale === "ar";
  const isArtisan = role === "ARTISAN";

  const navItems = isArtisan ? [
    { href: `/${locale}/dashboard`, labelEn: "Overview", labelAr: "الرئيسية", icon: LayoutDashboard, exact: true },
    { href: `/${locale}/dashboard/profile`, labelEn: "Profile", labelAr: "ملفي", icon: UserCircle, exact: false },
    { href: `/${locale}/dashboard/products`, labelEn: "Products", labelAr: "منتجاتي", icon: Package, exact: false },
    { href: `/${locale}/dashboard/orders`, labelEn: "Orders", labelAr: "الطلبات", icon: ShoppingBag, exact: false },
    { href: `/${locale}/messages`, labelEn: "Messages", labelAr: "الرسائل", icon: MessageCircle, exact: false },
  ] : [
    { href: `/${locale}/dashboard`, labelEn: "Overview", labelAr: "الرئيسية", icon: LayoutDashboard, exact: true },
    { href: `/${locale}/dashboard/profile`, labelEn: "Profile", labelAr: "ملفي", icon: UserCircle, exact: false },
    { href: `/${locale}/dashboard/services`, labelEn: "Services", labelAr: "خدماتي", icon: Package, exact: false },
    { href: `/${locale}/dashboard/bookings`, labelEn: "Bookings", labelAr: "الحجوزات", icon: ShoppingBag, exact: false },
    { href: `/${locale}/messages`, labelEn: "Messages", labelAr: "الرسائل", icon: MessageCircle, exact: false },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-desert-200 shadow-[0_-4px_24px_rgba(0,0,0,0.10)]"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold transition-all duration-200 relative",
                isActive ? "text-sand-600" : "text-clay-400 hover:text-clay-600"
              )}
            >
              {/* Active top gradient bar */}
              {isActive && (
                <span className="absolute top-0 left-2 right-2 h-0.5 bg-gradient-to-r from-sand-500 to-clay-600 rounded-full" />
              )}

              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all duration-200",
                  isActive ? "bg-gradient-to-br from-sand-100 to-amber-50" : ""
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive && "scale-110"
                  )}
                />
              </div>
              <span className="uppercase tracking-wide">
                {isAr ? item.labelAr : item.labelEn}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
