import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  LayoutDashboard, Users, UserCheck, Package,
  BarChart3, LogOut, ChevronLeft, ChevronRight, Megaphone,
  ShoppingBag, Store, Shield,
} from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminSidebarLink } from "@/components/admin/AdminSidebarLink";

interface AdminLayoutProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect(`/${locale}/auth/login`);
  }

  const isRTL = locale === "ar";

  // Fetch pending counts for badges
  const [pendingArtisans, pendingOrders] = await Promise.all([
    prisma.artisan.count({ where: { isApproved: false } }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  // Fetch admin user details
  const adminUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { firstName: true, lastName: true, email: true },
  });

  const navItems = [
    {
      href: `/${locale}/admin`,
      labelEn: "Overview", labelAr: "نظرة عامة",
      icon: LayoutDashboard,
      exact: true,
      badge: null,
    },
    {
      href: `/${locale}/admin/users`,
      labelEn: "Users", labelAr: "المستخدمون",
      icon: Users,
      exact: false,
      badge: null,
    },
    {
      href: `/${locale}/admin/artisans`,
      labelEn: "Artisans", labelAr: "الحرفيون",
      icon: UserCheck,
      exact: false,
      badge: pendingArtisans > 0 ? pendingArtisans : null,
    },
    {
      href: `/${locale}/admin/products`,
      labelEn: "Products", labelAr: "المنتجات",
      icon: Package,
      exact: false,
      badge: null,
    },
    {
      href: `/${locale}/admin/orders`,
      labelEn: "Orders", labelAr: "الطلبات",
      icon: ShoppingBag,
      exact: false,
      badge: pendingOrders > 0 ? pendingOrders : null,
    },
    {
      href: `/${locale}/admin/analytics`,
      labelEn: "Analytics", labelAr: "الإحصائيات",
      icon: BarChart3,
      exact: false,
      badge: null,
    },
    {
      href: `/${locale}/admin/advertisements`,
      labelEn: "Advertisements", labelAr: "الإعلانات",
      icon: Megaphone,
      exact: false,
      badge: null,
    },
  ];

  const initials = `${adminUser?.firstName?.[0] ?? "A"}${adminUser?.lastName?.[0] ?? "D"}`.toUpperCase();

  return (
    <div
      className={`min-h-screen bg-[#0f1117] flex ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Mobile Navigation */}
      <AdminMobileNav locale={locale} pendingArtisans={pendingArtisans} pendingOrders={pendingOrders} />

      {/* Desktop Sidebar */}
      <aside
        className={`w-64 bg-clay-900 flex flex-col fixed h-full z-40 hidden lg:flex border-clay-800 shadow-xl ${
          isRTL ? "right-0 border-l" : "left-0 border-r"
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-clay-800">
          <Link href={`/${locale}`} className={`flex items-center gap-2.5 group`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sand-500 to-clay-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-tight">Red Oasis</p>
              <p className="text-[10px] text-sand-400 font-medium leading-tight flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" />
                {isRTL ? "لوحة الإدارة" : "Admin Panel"}
              </p>
            </div>
          </Link>
        </div>

        {/* Admin user card */}
        <div className="px-4 py-4 border-b border-clay-800 bg-clay-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sand-500 to-clay-600 flex items-center justify-center ring-2 ring-sand-500/30 shrink-0">
                <span className="text-white font-bold text-sm">{initials}</span>
              </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {adminUser?.firstName} {adminUser?.lastName}
              </p>
              <p className="text-[10px] text-clay-400 truncate">{adminUser?.email}</p>
            </div>
            <span className="text-[9px] font-bold bg-sand-500/20 text-sand-400 border border-sand-500/30 px-1.5 py-0.5 rounded-full shrink-0">
              ADMIN
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-clay-500 uppercase tracking-widest px-3 py-2">
            {isRTL ? "الإدارة" : "Management"}
          </p>
          {navItems.map((item) => (
            <AdminSidebarLink
              key={item.href}
              href={item.href}
              labelEn={item.labelEn}
              labelAr={item.labelAr}
              icon={item.icon}
              exact={item.exact}
              badge={item.badge}
              isRTL={isRTL}
            />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-clay-800 space-y-0.5">
          <Link
            href={`/${locale}`}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm text-clay-400 hover:text-clay-200 rounded-xl hover:bg-clay-800 transition-colors group`}
          >
            <Store className="w-4 h-4 shrink-0" />
            <span className="font-medium flex-1">{isRTL ? "العودة للمتجر" : "Back to Store"}</span>
            {isRTL ? (
              <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </Link>
          <form action={logoutAction.bind(null, locale)}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-clay-800 hover:text-red-300 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="font-medium">{isRTL ? "تسجيل الخروج" : "Sign Out"}</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${isRTL ? "lg:mr-64" : "lg:ml-64"} pt-14 lg:pt-0 bg-desert-50`}>
        {children}
      </main>
    </div>
  );
}
