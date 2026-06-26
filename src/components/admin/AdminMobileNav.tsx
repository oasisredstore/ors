"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UserCheck, Package,
  BarChart3, LogOut, Menu, X, ChevronLeft, ChevronRight,
  ShoppingBag, Megaphone, Shield, Store,
} from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { cn } from "@/lib/utils";

interface AdminMobileNavProps {
  locale: string;
  pendingArtisans?: number;
  pendingOrders?: number;
}

export function AdminMobileNav({ locale, pendingArtisans = 0, pendingOrders = 0 }: AdminMobileNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const isAr = locale === "ar";

  const navItems = [
    { href: `/${locale}/admin`, labelEn: "Overview", labelAr: "نظرة عامة", icon: LayoutDashboard, exact: true, badge: null },
    { href: `/${locale}/admin/users`, labelEn: "Users", labelAr: "المستخدمون", icon: Users, exact: false, badge: null },
    { href: `/${locale}/admin/artisans`, labelEn: "Artisans", labelAr: "الحرفيون", icon: UserCheck, exact: false, badge: pendingArtisans > 0 ? pendingArtisans : null },
    { href: `/${locale}/admin/products`, labelEn: "Products", labelAr: "المنتجات", icon: Package, exact: false, badge: null },
    { href: `/${locale}/admin/orders`, labelEn: "Orders", labelAr: "الطلبات", icon: ShoppingBag, exact: false, badge: pendingOrders > 0 ? pendingOrders : null },
    { href: `/${locale}/admin/analytics`, labelEn: "Analytics", labelAr: "الإحصائيات", icon: BarChart3, exact: false, badge: null },
    { href: `/${locale}/admin/advertisements`, labelEn: "Ads", labelAr: "الإعلانات", icon: Megaphone, exact: false, badge: null },
  ];

  const currentPage = navItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );

  const totalPending = pendingArtisans + pendingOrders;

  return (
    <>
      {/* Mobile Top Bar */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-clay-900/95 backdrop-blur-md border-b border-clay-800 h-14 flex items-center px-4 gap-3 shadow-lg"
        dir={isAr ? "rtl" : "ltr"}
      >
        <button
          onClick={() => setDrawerOpen(true)}
          className="relative p-2 rounded-xl text-clay-300 hover:bg-clay-800 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
          {/* Total pending dot */}
          {totalPending > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center shrink-0">
            <span className="text-white font-display font-bold text-xs">R</span>
          </div>
          <span className="font-display font-bold text-white text-sm">
            {isAr ? <><span className="text-sand-400">الإدارة</span></> : <>Admin <span className="text-sand-400">Panel</span></>}
          </span>
        </div>

        {currentPage && (
          <div className={`${isAr ? "mr-auto" : "ml-auto"} flex items-center gap-1.5`}>
            <currentPage.icon className="w-3.5 h-3.5 text-clay-400" />
            <span className="text-clay-400 text-xs font-medium truncate">
              {isAr ? currentPage.labelAr : currentPage.labelEn}
            </span>
          </div>
        )}
      </header>

      {/* Drawer Backdrop */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Slide-in Drawer */}
      <div
        className={cn(
          "lg:hidden fixed top-0 bottom-0 z-[60] w-72 bg-clay-900 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl border-clay-800",
          isAr ? "right-0 border-l" : "left-0 border-r",
          drawerOpen
            ? "translate-x-0"
            : isAr
            ? "translate-x-full"
            : "-translate-x-full"
        )}
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-clay-800 bg-clay-800/40">
          <div className={`flex items-center gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center shadow-md">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-tight">Red Oasis</p>
              <p className="text-[10px] text-sand-400 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" />
                {isAr ? "لوحة الإدارة" : "Admin Panel"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-clay-400 hover:bg-clay-700 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-clay-500 uppercase tracking-widest px-3 py-2">
            {isAr ? "الإدارة" : "Management"}
          </p>
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isAr ? "flex-row-reverse" : "",
                  isActive
                    ? "bg-sand-500/15 text-sand-400 border border-sand-500/20"
                    : "text-clay-300 hover:bg-clay-800 hover:text-white"
                )}
              >
                {isActive && (
                  <span className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-sand-400 to-sand-600 rounded-full",
                    isAr ? "right-0" : "left-0"
                  )} />
                )}
                <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-sand-400")} />
                <span className="flex-1">{isAr ? item.labelAr : item.labelEn}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="px-3 py-3 border-t border-clay-800 space-y-0.5">
          <Link
            href={`/${locale}`}
            onClick={() => setDrawerOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm text-clay-400 hover:text-clay-200 rounded-xl hover:bg-clay-800 transition-colors",
              isAr ? "flex-row-reverse" : ""
            )}
          >
            <Store className="w-4 h-4 shrink-0" />
            <span className="flex-1 font-medium">{isAr ? "العودة للمتجر" : "Back to Store"}</span>
            {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </Link>
          <form action={logoutAction.bind(null, locale)}>
            <button
              type="submit"
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-clay-800 hover:text-red-300 rounded-xl transition-colors",
                isAr ? "flex-row-reverse" : ""
              )}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="font-medium">{isAr ? "تسجيل الخروج" : "Sign Out"}</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
