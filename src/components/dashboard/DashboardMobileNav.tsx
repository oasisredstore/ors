"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardMobileNavProps {
  locale: string;
}

export function DashboardMobileNav({ locale }: DashboardMobileNavProps) {
  const pathname = usePathname();
  const isAr = locale === "ar";

  const navItems = [
    { href: `/${locale}/dashboard`, label: isAr ? "الرئيسية" : "Overview", icon: LayoutDashboard, exact: true },
    { href: `/${locale}/dashboard/profile`, label: isAr ? "ملفي" : "Profile", icon: UserCircle, exact: false },
    { href: `/${locale}/dashboard/products`, label: isAr ? "منتجاتي" : "Products", icon: Package, exact: false },
    { href: `/${locale}/dashboard/orders`, label: isAr ? "الطلبات" : "Orders", icon: ShoppingBag, exact: false },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-desert-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
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
                "flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-all duration-200",
                isActive
                  ? "text-sand-600"
                  : "text-clay-400 hover:text-clay-600"
              )}
            >
              <div
                className={cn(
                  "relative p-1.5 rounded-xl transition-all duration-200",
                  isActive && "bg-sand-50"
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-xl bg-sand-100 animate-pulse-once" />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5 relative z-10 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
