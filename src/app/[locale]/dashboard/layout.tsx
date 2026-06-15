import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, LogOut, ChevronRight, UserCircle } from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";

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

  const navItems = isArtisan ? [
    { href: `/${locale}/dashboard`, label: locale === "ar" ? "نظرة عامة" : "Overview", icon: LayoutDashboard },
    { href: `/${locale}/dashboard/profile`, label: locale === "ar" ? "ملفي الشخصي" : "My Profile", icon: UserCircle },
    { href: `/${locale}/dashboard/products`, label: locale === "ar" ? "منتجاتي" : "My Products", icon: Package },
    { href: `/${locale}/dashboard/orders`, label: locale === "ar" ? "الطلبات" : "Orders", icon: ShoppingBag },
  ] : [
    { href: `/${locale}/dashboard`, label: locale === "ar" ? "نظرة عامة" : "Overview", icon: LayoutDashboard },
    { href: `/${locale}/dashboard/profile`, label: locale === "ar" ? "ملفي الشخصي" : "My Profile", icon: UserCircle },
    { href: `/${locale}/dashboard/services`, label: locale === "ar" ? "خدماتي" : "My Services", icon: Package },
    { href: `/${locale}/dashboard/bookings`, label: locale === "ar" ? "الحجوزات" : "Bookings", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-desert-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-desert-200 flex flex-col fixed h-full z-40 hidden lg:flex">
        {/* Logo */}
        <div className="p-6 border-b border-desert-100">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sand-500 to-clay-700 flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-clay-800 text-sm">
              {isArtisan ? "Artisan" : "Provider"} <span className="text-sand-500">Dashboard</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-clay-600 hover:bg-desert-50 hover:text-sand-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-desert-100">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 px-4 py-3 text-sm text-clay-500 hover:text-clay-700 rounded-xl hover:bg-desert-50 transition-colors mb-1"
          >
            ← {locale === "ar" ? "العودة للموقع" : "Back to Gallery"}
          </Link>
          <form action={logoutAction.bind(null, locale)}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {locale === "ar" ? "تسجيل الخروج" : "Sign Out"}
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <DashboardMobileNav locale={locale} role={session.role} />

      {/* Main — extra bottom padding on mobile to clear the tab bar */}
      <main className="flex-1 lg:ml-64 pt-0 pb-16 lg:pb-0">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
