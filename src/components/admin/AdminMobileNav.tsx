"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UserCheck, Package,
  BarChart3, LogOut, Menu, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { cn } from "@/lib/utils";

interface AdminMobileNavProps {
  locale: string;
}

export function AdminMobileNav({ locale }: AdminMobileNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const isAr = locale === "ar";

  const navItems = [
    { href: `/${locale}/admin`, labelEn: "Overview", labelAr: "نظرة عامة", icon: LayoutDashboard, exact: true },
    { href: `/${locale}/admin/users`, labelEn: "Users", labelAr: "المستخدمون", icon: Users, exact: false },
    { href: `/${locale}/admin/artisans`, labelEn: "Artisans", labelAr: "الحرفيون", icon: UserCheck, exact: false },
    { href: `/${locale}/admin/products`, labelEn: "Products", labelAr: "المنتجات", icon: Package, exact: false },
    { href: `/${locale}/admin/analytics`, labelEn: "Analytics", labelAr: "الإحصائيات", icon: BarChart3, exact: false },
  ];

  const currentPage = navItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-clay-900 border-b border-clay-800 h-14 flex items-center px-4 gap-3"
        dir={isAr ? "rtl" : "ltr"}
      >
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-xl text-clay-300 hover:bg-clay-800 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse ml-auto" : ""}`}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center shrink-0">
            <span className="text-white font-display font-bold text-xs">R</span>
          </div>
          <span className="font-display font-bold text-white text-sm">
            {isAr ? <><span className="text-sand-400">الإدارة</span></> : <><span className="text-sand-400">Admin</span> Panel</>}
          </span>
        </div>

        {currentPage && (
          <span className="ml-auto text-clay-400 text-xs font-medium truncate">
            {isAr ? currentPage.labelAr : currentPage.labelEn}
          </span>
        )}
      </header>

      {/* Drawer Backdrop */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Slide-in Drawer */}
      <div
        className={cn(
          "lg:hidden fixed top-0 bottom-0 z-[60] w-72 bg-clay-900 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl",
          isAr ? "right-0" : "left-0",
          drawerOpen
            ? "translate-x-0"
            : isAr
            ? "translate-x-full"
            : "-translate-x-full"
        )}
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-clay-800">
          <div className={`flex items-center gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-white text-sm">
              {isAr ? <>لوحة <span className="text-sand-400">الإدارة</span></> : <>Admin <span className="text-sand-400">Panel</span></>}
            </span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-clay-400 hover:bg-clay-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                  isAr ? "flex-row-reverse" : "",
                  isActive
                    ? "bg-sand-500/20 text-sand-400 border border-sand-500/30"
                    : "text-clay-300 hover:bg-clay-800 hover:text-white"
                )}
              >
                <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-sand-400")} />
                <span>{isAr ? item.labelAr : item.labelEn}</span>
                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full bg-sand-400 ${isAr ? "mr-auto" : "ml-auto"}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-clay-800 space-y-1">
          <Link
            href={`/${locale}`}
            onClick={() => setDrawerOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm text-clay-400 hover:text-clay-200 rounded-xl hover:bg-clay-800 transition-colors",
              isAr ? "flex-row-reverse" : ""
            )}
          >
            {isAr ? (
              <><ChevronRight className="w-4 h-4" /> العودة للمتجر</>
            ) : (
              <><ChevronLeft className="w-4 h-4" /> Back to Store</>
            )}
          </Link>
          <form action={logoutAction.bind(null, locale)}>
            <button
              type="submit"
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-clay-800 rounded-xl transition-colors",
                isAr ? "flex-row-reverse" : ""
              )}
            >
              <LogOut className="w-4 h-4" />
              {isAr ? "تسجيل الخروج" : "Sign Out"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
