"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, UserCircle, MessageCircle, CreditCard } from "lucide-react";
import { DashboardSidebarLink } from "./DashboardSidebarLink";

interface DashboardSidebarNavProps {
  locale: string;
  role: string;
}

export function DashboardSidebarNav({ locale, role }: DashboardSidebarNavProps) {
  const isArtisan = role === "ARTISAN";
  const isAr = locale === "ar";

  const navItems = isArtisan ? [
    { href: `/${locale}/dashboard`, labelEn: "Overview", labelAr: "نظرة عامة", icon: LayoutDashboard, exact: true },
    { href: `/${locale}/dashboard/profile`, labelEn: "My Profile", labelAr: "ملفي الشخصي", icon: UserCircle, exact: false },
    { href: `/${locale}/dashboard/products`, labelEn: "My Products", labelAr: "منتجاتي", icon: Package, exact: false },
    { href: `/${locale}/dashboard/orders`, labelEn: "Orders", labelAr: "الطلبات", icon: ShoppingBag, exact: false },
    { href: `/${locale}/messages`, labelEn: "Messages", labelAr: "الرسائل", icon: MessageCircle, exact: false },
  ] : [
    { href: `/${locale}/dashboard`, labelEn: "Overview", labelAr: "نظرة عامة", icon: LayoutDashboard, exact: true },
    { href: `/${locale}/dashboard/profile`, labelEn: "My Profile", labelAr: "ملفي الشخصي", icon: UserCircle, exact: false },
    { href: `/${locale}/dashboard/services`, labelEn: "My Services", labelAr: "خدماتي", icon: Package, exact: false },
    { href: `/${locale}/dashboard/bookings`, labelEn: "Bookings", labelAr: "الحجوزات", icon: ShoppingBag, exact: false },
    { href: `/${locale}/messages`, labelEn: "Messages", labelAr: "الرسائل", icon: MessageCircle, exact: false },
    { href: `/${locale}/pricing`, labelEn: "Subscription", labelAr: "الاشتراك", icon: CreditCard, exact: false },
  ];

  return (
    <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
      <p className="text-[10px] font-bold text-clay-300 uppercase tracking-widest px-3 py-2">
        {isAr ? "القائمة" : "Navigation"}
      </p>
      {navItems.map((item) => (
        <DashboardSidebarLink
          key={item.href}
          href={item.href}
          label={isAr ? item.labelAr : item.labelEn}
          icon={item.icon}
          exact={item.exact}
        />
      ))}
    </nav>
  );
}
