import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, LogOut,
  UserCircle, MessageCircle, CreditCard, Sparkles,
  ChevronRight, Store,
} from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";
import { DashboardSidebarLink } from "@/components/dashboard/DashboardSidebarLink";

interface DashboardLayoutProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { locale } = await params;
  const session = await getSession();
  const allowedRoles = ["ARTISAN", "ADMIN", "HOTEL", "GUEST_HOUSE", "GUIDE", "AGENCY"];
  if (!session || !allowedRoles.includes(session.role)) {
    redirect(`/${locale}/auth/login`);
  }

  const isArtisan = session.role === "ARTISAN";
  const isAr = locale === "ar";

  // Fetch user profile for sidebar display
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { firstName: true, lastName: true, email: true },
  });

  // Fetch artisan or provider shop name for display
  let shopName: string | null = null;
  let isApproved = false;
  if (isArtisan) {
    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      select: { shopName: true, isApproved: true },
    });
    shopName = artisan?.shopName ?? null;
    isApproved = artisan?.isApproved ?? false;
  } else {
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: session.userId },
      select: { businessName: true, isApproved: true },
    });
    shopName = provider?.businessName ?? null;
    isApproved = provider?.isApproved ?? false;
  }

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

  const roleLabel: Record<string, { en: string; ar: string }> = {
    ARTISAN: { en: "Artisan", ar: "حرفي" },
    HOTEL: { en: "Hotel", ar: "فندق" },
    GUEST_HOUSE: { en: "Guest House", ar: "بيت ضيافة" },
    GUIDE: { en: "Tour Guide", ar: "مرشد سياحي" },
    AGENCY: { en: "Agency", ar: "وكالة" },
    ADMIN: { en: "Admin", ar: "مسؤول" },
  };

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-desert-50 flex" dir={isAr ? "rtl" : "ltr"}>
      {/* Desktop Sidebar */}
      <aside
        className={`w-64 bg-white border-desert-200 flex flex-col fixed h-full z-40 hidden lg:flex shadow-[4px_0_24px_rgba(0,0,0,0.06)] ${
          isAr ? "right-0 border-l" : "left-0 border-r"
        }`}
      >
        {/* Logo & Brand */}
        <div className="px-5 py-5 border-b border-desert-100">
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sand-400 to-clay-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <div>
              <p className="font-display font-bold text-clay-800 text-sm leading-tight">Red Oasis</p>
              <p className="text-[10px] text-sand-500 font-medium leading-tight">
                {isAr ? roleLabel[session.role]?.ar : roleLabel[session.role]?.en} Dashboard
              </p>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="px-4 py-4 border-b border-desert-100 bg-gradient-to-br from-desert-50 to-sand-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sand-400 to-clay-600 flex items-center justify-center ring-2 ring-sand-200 shrink-0">
                <span className="text-white font-bold text-sm">{initials}</span>
              </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-clay-800 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-clay-400 truncate">{shopName ?? user?.email}</p>
            </div>
            {isApproved ? (
              <span className="flex items-center gap-0.5 text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full shrink-0">
                <Sparkles className="w-2.5 h-2.5" /> {isAr ? "معتمد" : "PRO"}
              </span>
            ) : (
              <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full shrink-0">
                {isAr ? "معلق" : "Pending"}
              </span>
            )}
          </div>
        </div>

        {/* Nav */}
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

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-desert-100 space-y-0.5">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-clay-500 hover:text-clay-700 rounded-xl hover:bg-desert-50 transition-colors group"
          >
            <Store className="w-4 h-4 shrink-0" />
            <span className="font-medium">{isAr ? "العودة للمتجر" : "Back to Store"}</span>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
          </Link>
          <form action={logoutAction.bind(null, locale)}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="font-medium">{isAr ? "تسجيل الخروج" : "Sign Out"}</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <DashboardMobileNav locale={locale} role={session.role} />

      {/* Main */}
      <main className={`flex-1 ${isAr ? "lg:mr-64" : "lg:ml-64"} pb-20 lg:pb-0`}>
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
