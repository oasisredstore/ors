"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, User, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  locale: string;
  user?: { name: string; role: string } | null;
}

export function BottomNav({ locale, user }: BottomNavProps) {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);
  const isAr = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    {
      id: "home",
      href: `/${locale}`,
      icon: Home,
      label: isAr ? "الرئيسية" : "Home",
      exact: true,
    },
    {
      id: "categories",
      href: `/${locale}/products`,
      icon: LayoutGrid,
      label: isAr ? "التصنيفات" : "Browse",
    },
    {
      id: "search",
      href: `/${locale}/products?focus=search`,
      icon: Search,
      label: isAr ? "بحث" : "Search",
    },
    {
      id: "account",
      href: user
        ? `/${locale}/account`
        : `/${locale}/auth/login`,
      icon: User,
      label: isAr ? "حسابي" : "Account",
    },
    {
      id: "cart",
      href: `/${locale}/cart`,
      icon: ShoppingCart,
      label: isAr ? "السلة" : "Cart",
      badge: mounted && cartCount > 0 ? cartCount : null,
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href || pathname === `/${locale}`;
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      aria-label="Bottom navigation"
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-desert-200 shadow-[0_-4px_24px_rgba(30,20,16,0.08)]" />

      <div className="relative flex items-stretch justify-around h-16 px-1">
        {tabs.map((tab) => {
          const active = isActive(tab.href, tab.exact);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 px-1 py-2 transition-all duration-200 relative group",
                active ? "text-sand-600" : "text-clay-400 hover:text-clay-700"
              )}
              aria-label={tab.label}
            >
              {/* Active indicator pill */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-sand-400 to-sand-600" />
              )}

              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    active ? "scale-110" : "group-hover:scale-105"
                  )}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-sand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm">
                    {tab.badge > 9 ? "9+" : tab.badge}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  "text-[10px] font-semibold leading-none transition-all",
                  active ? "text-sand-600" : "text-clay-400"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom safe area (for phones with home bar) */}
      <div className="h-safe-area-inset-bottom bg-white/80" />
    </nav>
  );
}
