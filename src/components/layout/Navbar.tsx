"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Globe,
  User,
  LayoutDashboard,
  LogOut,
  Settings,
  Heart,
  ShoppingCart,
  Search,
  Download,
  MessageCircle,
  ChevronDown
} from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { logoutAction } from "@/actions/auth.actions";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/layout/SearchBar";

interface NavbarProps {
  locale: string;
  user?: { name: string; role: string } | null;
  transparentOnTop?: boolean;
}

export function Navbar({ locale, user, transparentOnTop = false }: NavbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cartCount = useCartStore((s) => s.totalItems());

  const otherLocale = locale === "en" ? "ar" : "en";
  const switchHref = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const isSolid = scrolled || !transparentOnTop;
  const isAr = locale === "ar";

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClasses = cn(
    "text-sm font-semibold transition-colors hover:text-sand-500",
    isSolid ? "text-clay-700" : "text-white/90"
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !transparentOnTop
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sand-400 to-clay-800 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <span
              className={cn(
                "font-display font-bold text-lg hidden sm:block transition-colors tracking-tight",
                isSolid ? "text-clay-900" : "text-white"
              )}
            >
              RedOasis<span className="text-sand-500">Artisan</span>
            </span>
          </Link>

          {/* Desktop Nav - Grouped & Minimalist */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href={`/${locale}/products`} className={navLinkClasses}>
              {t("marketplace")}
            </Link>

            {/* Services & Partners Dropdown */}
            <div className="relative group">
              <button className={cn(navLinkClasses, "flex items-center gap-1 py-4")}>
                {t("services_partners")} <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-56">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2 flex flex-col gap-1">
                  <Link href={`/${locale}/services?type=accommodation`} className="px-4 py-2 text-sm text-clay-700 font-medium hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors">
                    {isAr ? "أماكن الإقامة" : "Accommodations"}
                  </Link>
                  <Link href={`/${locale}/services?type=homestay`} className="px-4 py-2 text-sm text-clay-700 font-medium hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors">
                    {isAr ? "الإقامة لدى الساكنة" : "Homestays"}
                  </Link>
                  <Link href={`/${locale}/services?type=tour`} className="px-4 py-2 text-sm text-clay-700 font-medium hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors">
                    {isAr ? "الجولات والتجارب" : "Tours & Guides"}
                  </Link>
                  <Link href={`/${locale}/services`} className="px-4 py-2 text-sm text-clay-700 font-medium hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors border-t border-desert-100 mt-1 pt-2">
                    {t("services")}
                  </Link>
                  <Link href={`/${locale}/artisans`} className="px-4 py-2 text-sm text-clay-700 font-medium hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors">
                    {t("artisans")}
                  </Link>
                </div>
              </div>
            </div>

            {/* Explore Dropdown */}
            <div className="relative group">
              <button className={cn(navLinkClasses, "flex items-center gap-1 py-4")}>
                {t("explore")} <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-56">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2 flex flex-col gap-1">
                  <Link href={`/${locale}/heritage`} className="px-4 py-2.5 text-sm text-clay-700 font-medium hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors">
                    {isAr ? "المتحف والتراث" : "Heritage & Museum"}
                  </Link>
                  <Link href={`/${locale}/about`} className="px-4 py-2.5 text-sm text-clay-700 font-medium hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors">
                    {t("about")}
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Actions - Simplified */}
          <div className="flex items-center gap-1 sm:gap-2">
            <SearchBar locale={locale} scrolled={isSolid} />

            {/* Language Switcher - Icon & Abbreviation */}
            <Link
              href={switchHref}
              className={cn(
                "hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full transition-all border border-transparent",
                isSolid
                  ? "text-clay-600 hover:bg-desert-50 hover:border-desert-200"
                  : "text-white/80 hover:bg-white/10 hover:border-white/20"
              )}
            >
              <Globe className="w-4 h-4" />
              {otherLocale.toUpperCase()}
            </Link>

            {/* PWA Download Button - Icon Only on Desktop */}
            <button
              onClick={() => window.dispatchEvent(new Event("trigger-pwa-install"))}
              className={cn(
                "hidden sm:flex items-center justify-center p-2 rounded-full transition-all border border-transparent",
                isSolid
                  ? "text-sand-600 hover:bg-sand-50 hover:border-sand-200"
                  : "text-white/80 hover:bg-white/10 hover:border-white/20"
              )}
              title={isAr ? "تنزيل التطبيق" : "Install App"}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <Link
              href={`/${locale}/wishlist`}
              className={cn(
                "relative p-2 rounded-full transition-all border border-transparent",
                isSolid
                  ? "text-clay-600 hover:bg-desert-50 hover:border-desert-200"
                  : "text-white/80 hover:bg-white/10 hover:border-white/20"
              )}
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className={cn(
                "relative p-2 rounded-full transition-all border border-transparent",
                isSolid
                  ? "text-clay-600 hover:bg-desert-50 hover:border-desert-200"
                  : "text-white/80 hover:bg-white/10 hover:border-white/20"
              )}
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-sand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <div className="w-px h-6 bg-current opacity-20 mx-1 hidden sm:block"></div>

            {/* User Menu / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium transition-all border border-transparent",
                    isSolid
                      ? "text-clay-700 hover:bg-desert-50 hover:border-desert-200"
                      : "text-white hover:bg-white/10 hover:border-white/20"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sand-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2 z-50">
                    <div className="px-4 py-2 mb-2 border-b border-clay-100">
                       <p className="text-sm font-bold text-clay-900 truncate">{user.name}</p>
                       <p className="text-xs text-clay-500 capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
                    </div>
                    <Link
                      href={`/${locale}/account`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-clay-700 hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 opacity-70" /> {t("account")}
                    </Link>
                    <Link
                      href={`/${locale}/messages`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-clay-700 hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <MessageCircle className="w-4 h-4 opacity-70" /> {isAr ? "الرسائل" : "Messages"}
                    </Link>
                    {["ARTISAN", "HOTEL", "GUEST_HOUSE", "GUIDE", "AGENCY"].includes(user.role) && (
                      <Link
                        href={`/${locale}/dashboard`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-clay-700 hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 opacity-70" /> {t("dashboard")}
                      </Link>
                    )}
                    {user.role === "ADMIN" && (
                      <Link
                        href={`/${locale}/admin`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-clay-700 hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 opacity-70" /> {t("admin")}
                      </Link>
                    )}
                    <form action={logoutAction.bind(null, locale)}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4 opacity-70" /> {t("logout")}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`/${locale}/auth/login`}
                className="hidden sm:inline-flex items-center justify-center bg-clay-900 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-sand-500 shadow-sm hover:shadow-md transition-all"
              >
                {t("login")}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className={cn(
                "lg:hidden p-2 rounded-full transition-all ml-1",
                isSolid ? "text-clay-800 bg-desert-100/50" : "text-white bg-white/10"
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Structured */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-t border-desert-200 shadow-2xl absolute w-full max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = (new FormData(e.currentTarget).get("mobileSearch") as string || "").trim();
                setMobileOpen(false);
                if (q) window.location.href = `/${locale}/products?search=${encodeURIComponent(q)}`;
              }}
              className="flex items-center gap-2 px-4 py-3 bg-desert-50 rounded-2xl border border-desert-200"
            >
              <Search className="w-5 h-5 text-clay-400 shrink-0" />
              <input
                name="mobileSearch"
                placeholder={isAr ? "ابحث عن منتجات..." : "Search products..."}
                dir={isAr ? "rtl" : "ltr"}
                className="flex-1 bg-transparent text-sm text-clay-900 placeholder:text-clay-400 outline-none font-medium"
              />
            </form>

            <div className="space-y-1">
              <div className="px-4 py-2 mt-2 text-[10px] font-black text-sand-500 uppercase tracking-widest">{t("marketplace")}</div>
              <Link
                href={`/${locale}/products`}
                className="block px-4 py-3 text-clay-800 hover:bg-sand-50 hover:text-sand-600 rounded-2xl font-bold transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {t("products")}
              </Link>

              <div className="px-4 py-2 mt-4 text-[10px] font-black text-sand-500 uppercase tracking-widest">{t("services_partners")}</div>
              <Link
                href={`/${locale}/services?type=accommodation`}
                className="block px-4 py-2.5 text-clay-800 hover:bg-sand-50 hover:text-sand-600 rounded-xl font-bold transition-colors text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {isAr ? "أماكن الإقامة" : "Accommodations"}
              </Link>
              <Link
                href={`/${locale}/services?type=homestay`}
                className="block px-4 py-2.5 text-clay-800 hover:bg-sand-50 hover:text-sand-600 rounded-xl font-bold transition-colors text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {isAr ? "الإقامة لدى الساكنة" : "Homestays"}
              </Link>
              <Link
                href={`/${locale}/services?type=tour`}
                className="block px-4 py-2.5 text-clay-800 hover:bg-sand-50 hover:text-sand-600 rounded-xl font-bold transition-colors text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {isAr ? "الجولات والتجارب" : "Tours"}
              </Link>
              <Link
                href={`/${locale}/services`}
                className="block px-4 py-2.5 text-clay-800 hover:bg-sand-50 hover:text-sand-600 rounded-xl font-bold transition-colors text-sm border-t border-desert-100"
                onClick={() => setMobileOpen(false)}
              >
                {isAr ? "جميع الخدمات" : "All Services"}
              </Link>
              <Link
                href={`/${locale}/artisans`}
                className="block px-4 py-2.5 text-clay-800 hover:bg-sand-50 hover:text-sand-600 rounded-xl font-bold transition-colors text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {t("artisans")}
              </Link>

              <div className="px-4 py-2 mt-4 text-[10px] font-black text-sand-500 uppercase tracking-widest">{t("explore")}</div>
              <Link
                href={`/${locale}/heritage`}
                className="block px-4 py-3 text-clay-800 hover:bg-sand-50 hover:text-sand-600 rounded-2xl font-bold transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {isAr ? "المتحف والتراث" : "Heritage & Museum"}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="block px-4 py-3 text-clay-800 hover:bg-sand-50 hover:text-sand-600 rounded-2xl font-bold transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {t("about")}
              </Link>
            </div>

            <hr className="border-desert-200 my-4" />
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={switchHref}
                className="flex items-center justify-center gap-2 py-3 bg-desert-50 text-clay-700 rounded-xl font-bold border border-desert-200"
                onClick={() => setMobileOpen(false)}
              >
                <Globe className="w-4 h-4" />
                {otherLocale === "ar" ? "العربية" : "English"}
              </Link>
              
              <button
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new Event("trigger-pwa-install"));
                }}
                className="flex items-center justify-center gap-2 py-3 bg-desert-50 text-sand-600 rounded-xl font-bold border border-desert-200"
              >
                <Download className="w-4 h-4" />
                {isAr ? "تثبيت التطبيق" : "Install App"}
              </button>
            </div>

            {!user && (
              <Link
                href={`/${locale}/auth/login`}
                className="flex items-center justify-center w-full py-4 bg-clay-900 text-white rounded-xl font-bold mt-2 shadow-lg"
                onClick={() => setMobileOpen(false)}
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
