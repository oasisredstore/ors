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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/services`, label: t("services") },
    { href: `/${locale}/products`, label: t("products") },
    { href: `/${locale}/artisans`, label: t("artisans") },
    { href: `/${locale}/about`, label: t("about") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !transparentOnTop
          ? "bg-white/90 backdrop-blur-md shadow-md border-b border-desert-200"
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
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sand-500 to-clay-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <span
              className={cn(
                "font-display font-bold text-lg hidden sm:block transition-colors",
                isSolid ? "text-clay-800" : "text-white"
              )}
            >
              RedOasis<span className="text-sand-400">Artisan</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-sand-500",
                  isSolid ? "text-clay-700" : "text-white/90"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <SearchBar locale={locale} scrolled={isSolid} />
            {/* Language Switcher */}
            <Link
              href={switchHref}
              className={cn(
                "hidden sm:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all",
                isSolid
                  ? "text-clay-700 hover:bg-desert-100"
                  : "text-white/90 hover:bg-white/10"
              )}
            >
              <Globe className="w-4 h-4" />
              {otherLocale === "ar" ? "العربية" : "English"}
            </Link>

            {/* PWA Download Button */}
            <button
              onClick={() => window.dispatchEvent(new Event("trigger-pwa-install"))}
              className={cn(
                "hidden sm:flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full transition-all",
                isSolid
                  ? "bg-sand-500/10 text-sand-600 hover:bg-sand-500 hover:text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              <Download className="w-4 h-4" />
              <span className="hidden lg:block">{locale === "ar" ? "تنزيل التطبيق" : "App"}</span>
            </button>

            {/* Wishlist */}
            <Link
              href={`/${locale}/wishlist`}
              className={cn(
                "relative p-2 rounded-full transition-all",
                isSolid
                  ? "text-clay-700 hover:bg-desert-100"
                  : "text-white/90 hover:bg-white/10"
              )}
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className={cn(
                "relative p-2 rounded-full transition-all",
                isSolid
                  ? "text-clay-700 hover:bg-desert-100"
                  : "text-white/90 hover:bg-white/10"
              )}
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-sand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                    isSolid
                      ? "text-clay-700 hover:bg-desert-100"
                      : "text-white hover:bg-white/10"
                  )}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sand-400 to-oasis-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-desert-200 py-2 z-50">
                    <Link
                      href={`/${locale}/account`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-clay-700 hover:bg-desert-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" /> {t("account")}
                    </Link>
                    {user.role === "ARTISAN" && (
                      <Link
                        href={`/${locale}/dashboard`}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-clay-700 hover:bg-desert-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" /> {t("dashboard")}
                      </Link>
                    )}
                    {user.role === "ADMIN" && (
                      <Link
                        href={`/${locale}/admin`}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-clay-700 hover:bg-desert-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" /> {t("admin")}
                      </Link>
                    )}
                    <hr className="my-1 border-desert-200" />
                    <form action={logoutAction.bind(null, locale)}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> {t("logout")}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`/${locale}/auth/login`}
                className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-sand-500 to-sand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:from-sand-600 hover:to-sand-700 shadow-md hover:shadow-lg transition-all"
              >
                {t("login")}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className={cn(
                "lg:hidden p-2 rounded-full transition-all",
                isSolid ? "text-clay-700" : "text-white"
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-desert-200 shadow-xl">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = (new FormData(e.currentTarget).get("mobileSearch") as string || "").trim();
                setMobileOpen(false);
                if (q) window.location.href = `/${locale}/products?search=${encodeURIComponent(q)}`;
              }}
              className="flex items-center gap-2 px-3 py-2.5 bg-desert-50 rounded-xl border border-desert-200 mb-2"
            >
              <Search className="w-4 h-4 text-clay-400 shrink-0" />
              <input
                name="mobileSearch"
                placeholder={locale === "ar" ? "ابحث عن منتجات..." : "Search products..."}
                dir={locale === "ar" ? "rtl" : "ltr"}
                className="flex-1 bg-transparent text-sm text-clay-800 placeholder:text-clay-400 outline-none"
              />
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-clay-700 hover:bg-desert-100 rounded-xl font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-desert-200" />
            {!user && (
              <Link
                href={`/${locale}/auth/login`}
                className="block px-4 py-2.5 text-sand-600 font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                {t("login")}
              </Link>
            )}
            <Link
              href={switchHref}
              className="flex items-center gap-2 px-4 py-2.5 text-clay-600"
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
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-sand-500 to-sand-600 text-white font-semibold rounded-xl mt-4"
            >
              <Download className="w-4 h-4" />
              {locale === "ar" ? "تثبيت التطبيق على الهاتف" : "Install Mobile App"}
            </button>
          </div>
        </div>
      )}
    </header>
  );

}
