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
  ChevronDown,
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
    // Set initial state
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-user-menu]")) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActiveRoute = (href: string) => {
    const base = href.split("?")[0];
    if (base === `/${locale}`) return pathname === base;
    return pathname.startsWith(base);
  };

  const navLinkBase =
    "relative text-sm font-semibold transition-all duration-200 py-1";

  const getNavLinkClass = (href: string) => {
    const active = isActiveRoute(href);
    if (isSolid) {
      return cn(navLinkBase, active ? "text-sand-500" : "text-clay-700 hover:text-sand-500");
    }
    return cn(navLinkBase, active ? "text-amber-300" : "text-white hover:text-sand-300",
      "[text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isSolid
          ? "glass-navbar"
          : "bg-transparent border-b border-white/10"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #DEB048 0%, #C04A1A 60%, #762C0C 100%)",
                boxShadow: "0 2px 12px rgba(192,74,26,0.35)",
              }}
            >
              <span className="text-white font-display font-bold text-sm">
                {isAr ? "ق" : "G"}
              </span>
            </div>
            <span
              className={cn(
                "font-display font-bold text-lg hidden sm:block tracking-tight transition-colors duration-300",
                isSolid ? "text-clay-900" : "text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
              )}
            >
              {isAr ? "قورارة" : "Gourara"}
              <span className="text-sand-500">{isAr ? " للحرف" : " Crafts"}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            <Link href={`/${locale}/products`} className={getNavLinkClass(`/${locale}/products`)}>
              {t("marketplace")}
              {isActiveRoute(`/${locale}/products`) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 rounded-full bg-gradient-to-r from-sand-400 to-sand-600" />
              )}
            </Link>

            {/* Services & Partners Dropdown */}
            <div className="relative group">
              <button
                className={cn(
                  navLinkBase,
                  "flex items-center gap-1 py-5",
                  isSolid ? "text-clay-700 hover:text-sand-500" : "text-white hover:text-sand-300 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
                )}
              >
                {t("services_partners")}
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-60">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-desert-100/80 p-2 flex flex-col gap-0.5">
                  {[
                    { href: `/${locale}/services?type=accommodation`, label: isAr ? "أماكن الإقامة" : "Accommodations", emoji: "🏨" },
                    { href: `/${locale}/services?type=homestay`, label: isAr ? "الإقامة لدى الساكنة" : "Homestays", emoji: "🏡" },
                    { href: `/${locale}/services?type=tour`, label: isAr ? "الجولات والتجارب" : "Tours & Guides", emoji: "🗺️" },
                    { href: `/${locale}/services`, label: t("services"), emoji: "✨", divider: true },
                    { href: `/${locale}/artisans`, label: t("artisans"), emoji: "🤲" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors",
                        "text-clay-700 hover:bg-sand-50 hover:text-sand-600",
                        "item" in item && item.divider ? "border-t border-desert-100 mt-1 pt-3" : ""
                      )}
                    >
                      <span className="text-base">{item.emoji}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Explore Dropdown */}
            <div className="relative group">
              <button
                className={cn(
                  navLinkBase,
                  "flex items-center gap-1 py-5",
                  isSolid ? "text-clay-700 hover:text-sand-500" : "text-white hover:text-sand-300 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
                )}
              >
                {t("explore")}
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-52">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-desert-100/80 p-2 flex flex-col gap-0.5">
                  {[
                    { href: `/${locale}/map`, label: isAr ? "خريطة تيميمون 🗺️" : "Timimoun Map 🗺️", emoji: "📍" },
                    { href: `/${locale}/heritage`, label: isAr ? "المتحف والتراث" : "Heritage & Museum", emoji: "🏺" },
                    { href: `/${locale}/about`, label: t("about"), emoji: "🌅" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-clay-700 hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors"
                    >
                      <span className="text-base">{item.emoji}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <SearchBar locale={locale} scrolled={isSolid} />

            {/* Language Switcher */}
            <Link
              href={switchHref}
              className={cn(
                "hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full transition-all border",
                isSolid
                  ? "text-clay-600 border-transparent hover:bg-desert-50 hover:border-desert-200"
                  : "text-white border-white/30 hover:bg-white/15 hover:text-sand-200 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]"
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              {otherLocale.toUpperCase()}
            </Link>

            {/* PWA Download */}
            <button
              onClick={() => window.dispatchEvent(new Event("trigger-pwa-install"))}
              className={cn(
                "hidden sm:flex items-center justify-center w-9 h-9 rounded-full transition-all border",
                isSolid
                  ? "text-sand-600 border-transparent hover:bg-sand-50 hover:border-sand-200"
                  : "text-amber-300 border-white/15 hover:bg-white/10 hover:text-amber-200"
              )}
              title={isAr ? "تنزيل التطبيق" : "Install App"}
              aria-label={isAr ? "تنزيل التطبيق" : "Install App"}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <Link
              href={`/${locale}/wishlist`}
              className={cn(
                "relative flex items-center justify-center w-9 h-9 rounded-full transition-all border",
                isSolid
                  ? "text-clay-600 border-transparent hover:bg-desert-50 hover:border-desert-200"
                  : "text-white border-white/20 hover:bg-white/15 hover:text-sand-200"
              )}
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className={cn(
                "relative flex items-center justify-center w-9 h-9 rounded-full transition-all border",
                isSolid
                  ? "text-clay-600 border-transparent hover:bg-desert-50 hover:border-desert-200"
                  : "text-white border-white/20 hover:bg-white/15 hover:text-sand-200"
              )}
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-sand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <div className={cn("w-px h-5 mx-0.5 hidden sm:block opacity-20", isSolid ? "bg-clay-800" : "bg-white")} />

            {/* User Menu / Auth */}
            {user ? (
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-full transition-all"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-sand-400/30"
                    style={{ background: "linear-gradient(135deg, #DEB048, #C04A1A)" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-desert-100 p-2 z-50 animate-fade-in-scale">
                    <div className="px-4 py-3 mb-1 border-b border-clay-100">
                      <p className="text-sm font-bold text-clay-900 truncate">{user.name}</p>
                      <p className="text-xs text-clay-400 capitalize mt-0.5">{user.role.replace("_", " ").toLowerCase()}</p>
                    </div>
                    {[
                      { href: `/${locale}/account`, Icon: User, label: t("account") },
                      { href: `/${locale}/messages`, Icon: MessageCircle, label: isAr ? "الرسائل" : "Messages" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-clay-700 hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <item.Icon className="w-4 h-4 opacity-60" /> {item.label}
                      </Link>
                    ))}
                    {["ARTISAN", "HOTEL", "GUEST_HOUSE", "GUIDE", "AGENCY"].includes(user.role) && (
                      <Link
                        href={`/${locale}/dashboard`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-clay-700 hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 opacity-60" /> {t("dashboard")}
                      </Link>
                    )}
                    {user.role === "ADMIN" && (
                      <Link
                        href={`/${locale}/admin`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-clay-700 hover:bg-sand-50 hover:text-sand-600 rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 opacity-60" /> {t("admin")}
                      </Link>
                    )}
                    <form action={logoutAction.bind(null, locale)}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1 border-t border-clay-100 pt-2"
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
                className={cn(
                  "hidden sm:inline-flex items-center justify-center text-sm font-bold px-5 py-2 rounded-full transition-all shadow-sm",
                  isSolid
                    ? "bg-clay-900 text-white hover:bg-sand-600 hover:shadow-md"
                    : "bg-white/15 text-white border border-white/30 hover:bg-white/25 backdrop-blur-sm"
                )}
              >
                {t("login")}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className={cn(
                "lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all ml-1",
                isSolid ? "text-clay-800 bg-desert-100/60 hover:bg-desert-200" : "text-white bg-white/10 hover:bg-white/20"
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-t border-desert-100 shadow-2xl absolute w-full max-h-[calc(100vh-4.5rem)] overflow-y-auto animate-fade-in-scale">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = (new FormData(e.currentTarget).get("mobileSearch") as string || "").trim();
                setMobileOpen(false);
                if (q) window.location.href = `/${locale}/products?search=${encodeURIComponent(q)}`;
              }}
              className="flex items-center gap-2 px-4 py-3 bg-desert-50 rounded-2xl border border-desert-200 focus-within:border-sand-300 focus-within:ring-2 focus-within:ring-sand-100 transition-all"
            >
              <Search className="w-4 h-4 text-clay-400 shrink-0" />
              <input
                name="mobileSearch"
                placeholder={isAr ? "ابحث عن منتجات..." : "Search products..."}
                dir={isAr ? "rtl" : "ltr"}
                className="flex-1 bg-transparent text-sm text-clay-900 placeholder:text-clay-400 outline-none font-medium"
              />
            </form>

            <div className="space-y-1">
              {[
                { label: t("marketplace"), href: `/${locale}/products`, section: null },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-clay-800 hover:bg-sand-50 hover:text-sand-600 rounded-2xl font-bold transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="px-4 py-2 mt-2 text-[10px] font-black text-sand-500 uppercase tracking-widest">{t("services_partners")}</div>
              {[
                { href: `/${locale}/services?type=accommodation`, label: isAr ? "أماكن الإقامة" : "Accommodations" },
                { href: `/${locale}/services?type=homestay`, label: isAr ? "الإقامة لدى الساكنة" : "Homestays" },
                { href: `/${locale}/services?type=tour`, label: isAr ? "الجولات والتجارب" : "Tours" },
                { href: `/${locale}/services`, label: isAr ? "جميع الخدمات" : "All Services" },
                { href: `/${locale}/artisans`, label: t("artisans") },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-clay-700 hover:bg-sand-50 hover:text-sand-600 rounded-xl font-semibold transition-colors text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="px-4 py-2 mt-3 text-[10px] font-black text-sand-500 uppercase tracking-widest">{t("explore")}</div>
              {[
                { href: `/${locale}/heritage`, label: isAr ? "المتحف والتراث" : "Heritage & Museum" },
                { href: `/${locale}/about`, label: t("about") },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-clay-800 hover:bg-sand-50 hover:text-sand-600 rounded-2xl font-bold transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <hr className="border-desert-200" />

            <div className="grid grid-cols-2 gap-3">
              <Link
                href={switchHref}
                className="flex items-center justify-center gap-2 py-3 bg-desert-50 text-clay-700 rounded-xl font-bold border border-desert-200 hover:border-sand-300 transition-all"
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
                className="flex items-center justify-center gap-2 py-3 bg-sand-50 text-sand-600 rounded-xl font-bold border border-sand-200 hover:border-sand-400 transition-all"
              >
                <Download className="w-4 h-4" />
                {isAr ? "تثبيت التطبيق" : "Install App"}
              </button>
            </div>

            {!user && (
              <Link
                href={`/${locale}/auth/login`}
                className="flex items-center justify-center w-full py-4 rounded-xl font-bold mt-1 shadow-lg text-white transition-all hover:shadow-xl"
                style={{ background: "linear-gradient(135deg, #C04A1A 0%, #762C0C 100%)" }}
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
