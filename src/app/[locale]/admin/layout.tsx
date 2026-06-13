import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";
import {
  LayoutDashboard, Users, UserCheck, Package,
  BarChart3, LogOut, ChevronRight, ChevronLeft,
} from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

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

  const navItems = [
    { href: `/${locale}/admin`, labelEn: "Overview",   labelAr: "نظرة عامة",    icon: LayoutDashboard },
    { href: `/${locale}/admin/users`,     labelEn: "Users",     labelAr: "المستخدمون",  icon: Users },
    { href: `/${locale}/admin/artisans`,  labelEn: "Artisans",  labelAr: "الحرفيون",    icon: UserCheck },
    { href: `/${locale}/admin/products`,  labelEn: "Products",  labelAr: "المنتجات",    icon: Package },
    { href: `/${locale}/admin/analytics`, labelEn: "Analytics", labelAr: "الإحصائيات", icon: BarChart3 },
  ];

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div
      className={`min-h-screen bg-desert-50 flex ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Mobile Navigation — top bar + slide-in drawer */}
      <AdminMobileNav locale={locale} />

      {/* Desktop Sidebar */}
      <aside
        className={`w-64 bg-clay-900 flex flex-col fixed h-full z-40 hidden lg:flex ${
          isRTL ? "right-0" : "left-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-clay-800">
          <Link href={`/${locale}`} className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center shrink-0">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <span className={`font-display font-bold text-white text-sm ${isRTL ? "text-right" : ""}`}>
              {isRTL ? (
                <>لوحة <span className="text-sand-400">الإدارة</span></>
              ) : (
                <>Admin <span className="text-sand-400">Panel</span></>
              )}
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-clay-300 hover:bg-clay-800 hover:text-sand-400 transition-colors group ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isRTL ? item.labelAr : item.labelEn}
                </span>
              </div>
              <ChevronIcon className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-clay-800 space-y-1">
          <Link
            href={`/${locale}`}
            className={`flex items-center gap-3 px-4 py-3 text-sm text-clay-400 hover:text-clay-200 rounded-xl hover:bg-clay-800 transition-colors ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {isRTL ? (
              <><ChevronRight className="w-4 h-4" /> العودة للمتجر</>
            ) : (
              <><ChevronLeft className="w-4 h-4" /> Back to Store</>
            )}
          </Link>
          <form action={logoutAction.bind(null, locale)}>
            <button
              type="submit"
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-clay-800 rounded-xl transition-colors ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <LogOut className="w-4 h-4" />
              {isRTL ? "تسجيل الخروج" : "Sign Out"}
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content — top padding on mobile for the fixed top bar */}
      <main className={`flex-1 ${isRTL ? "lg:mr-64" : "lg:ml-64"} pt-14 lg:pt-0`}>
        {children}
      </main>
    </div>
  );
}
