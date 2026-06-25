"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Search,
  User,
  ShoppingCart,
  X,
  Compass,
  ShoppingBag,
  Hotel,
  Tent,
  Map,
  Landmark,
  Users,
  LayoutDashboard,
  LogIn,
  Heart,
  MessageCircle,
  Download,
  Globe,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  locale: string;
  user?: { name: string; role: string } | null;
}

/* ─── Explore Drawer Sections ────────────────────────────────────────────── */
const getExploreItems = (locale: string, isAr: boolean) => [
  {
    group: isAr ? "🛍️ السوق" : "🛍️ Marketplace",
    items: [
      {
        href: `/${locale}/products`,
        emoji: "🧵",
        label: isAr ? "جميع المنتجات" : "All Products",
        desc: isAr ? "سجاد، فخار، سعف..." : "Carpets, pottery, crafts...",
        color: "bg-sand-50 border-sand-200",
      },
      {
        href: `/${locale}/artisans`,
        emoji: "🤲",
        label: isAr ? "الحرفيون" : "Artisans",
        desc: isAr ? "تعرّف على صانعيها" : "Meet the makers",
        color: "bg-desert-50 border-desert-200",
      },
    ],
  },
  {
    group: isAr ? "🏨 السياحة والإقامة" : "🏨 Tourism & Stay",
    items: [
      {
        href: `/${locale}/services?type=accommodation`,
        emoji: "🏨",
        label: isAr ? "أماكن الإقامة" : "Accommodations",
        desc: isAr ? "فنادق وبيوت ضيافة" : "Hotels & guesthouses",
        color: "bg-oasis-50 border-oasis-200",
      },
      {
        href: `/${locale}/services?type=tour`,
        emoji: "🗺️",
        label: isAr ? "جولات وتجارب" : "Tours & Guides",
        desc: isAr ? "استكشف الصحراء" : "Explore the desert",
        color: "bg-emerald-50 border-emerald-200",
      },
      {
        href: `/${locale}/services?type=homestay`,
        emoji: "🏡",
        label: isAr ? "إقامة لدى الساكنة" : "Homestays",
        desc: isAr ? "عيش تجربة أصيلة" : "Authentic local stays",
        color: "bg-amber-50 border-amber-200",
      },
      {
        href: `/${locale}/services`,
        emoji: "✨",
        label: isAr ? "جميع الخدمات" : "All Services",
        desc: isAr ? "استعرض كل ما هو متاح" : "Browse everything",
        color: "bg-purple-50 border-purple-200",
      },
    ],
  },
  {
    group: isAr ? "🏛️ التراث والاستكشاف" : "🏛️ Heritage & Explore",
    items: [
      {
        href: `/${locale}/heritage`,
        emoji: "🏺",
        label: isAr ? "المتحف الافتراضي" : "Virtual Museum",
        desc: isAr ? "تراث قورارة العريق" : "Gourara's heritage",
        color: "bg-clay-50 border-clay-200",
      },
      {
        href: `/${locale}/about`,
        emoji: "🌅",
        label: isAr ? "عن قورارة" : "About Gourara",
        desc: isAr ? "تيميمون والصحراء الجزائرية" : "Timimoun & Algerian Sahara",
        color: "bg-orange-50 border-orange-200",
      },
    ],
  },
];

export function BottomNav({ locale, user }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAr = locale === "ar";
  const otherLocale = locale === "ar" ? "en" : "ar";
  const switchHref = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const isPartner =
    user &&
    ["ARTISAN", "HOTEL", "GUEST_HOUSE", "GUIDE", "AGENCY"].includes(user.role);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (base === `/${locale}`) return pathname === base;
    return pathname.startsWith(base);
  };

  /* ── Main 5 tabs ── */
  const tabs = [
    {
      id: "home",
      href: `/${locale}`,
      Icon: Home,
      label: isAr ? "الرئيسية" : "Home",
    },
    {
      id: "search",
      href: `/${locale}/products?focus=search`,
      Icon: Search,
      label: isAr ? "بحث" : "Search",
    },
    // Center — Explore (opens drawer)
    null,
    {
      id: "account",
      href: user
        ? isAdmin
          ? `/${locale}/admin`
          : isPartner
          ? `/${locale}/dashboard`
          : `/${locale}/account`
        : `/${locale}/auth/login`,
      Icon: isAdmin || isPartner ? LayoutDashboard : user ? User : LogIn,
      label: isAr
        ? isAdmin
          ? "الإدارة"
          : isPartner
          ? "لوحتي"
          : user
          ? "حسابي"
          : "دخول"
        : isAdmin
        ? "Admin"
        : isPartner
        ? "Dashboard"
        : user
        ? "Account"
        : "Login",
    },
    {
      id: "cart",
      href: `/${locale}/cart`,
      Icon: ShoppingCart,
      label: isAr ? "السلة" : "Cart",
      badge: mounted && cartCount > 0 ? cartCount : null,
    },
  ];

  const exploreItems = getExploreItems(locale, isAr);

  return (
    <>
      {/* ── Bottom Bar ─────────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        aria-label="Mobile navigation"
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl border-t border-desert-200 shadow-[0_-8px_32px_rgba(30,20,16,0.12)]" />

        <div className="relative flex items-stretch h-16 px-2">
          {tabs.map((tab, idx) => {
            // Center button — Explore
            if (tab === null) {
              return (
                <div key="explore-center" className="flex-1 flex items-center justify-center">
                  <button
                    onClick={() => setDrawerOpen(true)}
                    aria-label={isAr ? "استكشف" : "Explore"}
                    className={cn(
                      "relative -top-4 w-14 h-14 rounded-full shadow-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300 active:scale-95",
                      drawerOpen
                        ? "bg-clay-900 shadow-clay-900/40"
                        : "bg-gradient-to-br from-sand-400 to-clay-700 shadow-sand-400/40"
                    )}
                  >
                    {drawerOpen ? (
                      <X className="w-6 h-6 text-white" strokeWidth={2.5} />
                    ) : (
                      <Compass className="w-6 h-6 text-white" strokeWidth={2} />
                    )}
                  </button>
                </div>
              );
            }

            const active = isActive(tab.href);
            const Icon = tab.Icon;

            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 px-1 py-2 relative group transition-all duration-200",
                  active ? "text-sand-600" : "text-clay-400 hover:text-clay-600"
                )}
                aria-label={tab.label}
              >
                {/* Active pill at top */}
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-sand-400 to-sand-600" />
                )}

                <div className="relative">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      active ? "scale-110" : "group-hover:scale-105"
                    )}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                  {/* Badge */}
                  {"badge" in tab && tab.badge && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-sand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm">
                      {tab.badge > 9 ? "9+" : tab.badge}
                    </span>
                  )}
                </div>

                <span
                  className={cn(
                    "text-[9px] font-bold leading-none transition-all",
                    active ? "text-sand-600" : "text-clay-400"
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Center label */}
        <div className="relative flex justify-center -mt-1 pb-safe">
          <span className={cn(
            "text-[9px] font-bold leading-none transition-all",
            drawerOpen ? "text-clay-600" : "text-sand-500"
          )}>
            {isAr ? "استكشف" : "Explore"}
          </span>
        </div>

        {/* Home bar safe area */}
        <div className="h-safe-area-inset-bottom bg-white/90" />
      </nav>

      {/* ── Explore Drawer ─────────────────────────────────────────────── */}
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-clay-900/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 lg:hidden rounded-t-3xl bg-white shadow-2xl transition-transform duration-500 ease-out",
          "max-h-[85vh] overflow-y-auto pb-safe",
          drawerOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      >
        {/* Drawer handle */}
        <div className="sticky top-0 bg-white z-10 pt-3 pb-2 px-4 flex flex-col items-center border-b border-desert-100">
          <div className="w-10 h-1 rounded-full bg-desert-200 mb-3" />
          <div className="flex items-center justify-between w-full">
            <h2 className="font-display text-lg font-bold text-clay-900">
              {isAr ? "استكشف قورارة" : "Explore Gourara"}
            </h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-full bg-desert-100 text-clay-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick user actions strip */}
        {user && (
          <div className="px-4 pt-4 pb-2 flex gap-2">
            <Link
              href={`/${locale}/messages`}
              onClick={() => setDrawerOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-desert-50 border border-desert-200 rounded-xl text-xs font-bold text-clay-700"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {isAr ? "الرسائل" : "Messages"}
            </Link>
            <Link
              href={`/${locale}/wishlist`}
              onClick={() => setDrawerOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600"
            >
              <Heart className="w-3.5 h-3.5" />
              {isAr ? "المفضلة" : "Wishlist"}
              {mounted && wishlistCount > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href={switchHref}
              onClick={() => setDrawerOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-desert-50 border border-desert-200 rounded-xl text-xs font-bold text-clay-700"
            >
              <Globe className="w-3.5 h-3.5" />
              {otherLocale === "ar" ? "ع" : "EN"}
            </Link>
          </div>
        )}

        {/* Sections */}
        <div className="px-4 py-4 space-y-6">
          {exploreItems.map((section) => (
            <div key={section.group}>
              <p className="text-[11px] font-black text-clay-400 uppercase tracking-widest mb-3 px-1">
                {section.group}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-2xl border transition-all active:scale-95",
                      isActive(item.href)
                        ? "border-sand-400 bg-sand-50 shadow-sm"
                        : item.color
                    )}
                  >
                    <span className="text-2xl shrink-0 leading-none">{item.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-clay-900 leading-tight">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-clay-400 mt-0.5 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Partner CTA */}
          {!user && (
            <div className="mt-2 bg-gradient-to-br from-clay-900 to-clay-800 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">🤝</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">
                  {isAr ? "انضم كشريك" : "Become a Partner"}
                </p>
                <p className="text-[10px] text-clay-300 mt-0.5">
                  {isAr ? "حرفي، فندق، مرشد سياحي..." : "Artisan, hotel, tour guide..."}
                </p>
              </div>
              <Link
                href={`/${locale}/auth/artisan/register`}
                onClick={() => setDrawerOpen(false)}
                className="shrink-0 bg-sand-400 hover:bg-sand-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
              >
                {isAr ? "سجّل" : "Join"}
              </Link>
            </div>
          )}

          {/* Install PWA */}
          <button
            onClick={() => {
              setDrawerOpen(false);
              window.dispatchEvent(new Event("trigger-pwa-install"));
            }}
            className="w-full flex items-center justify-center gap-2 py-3 border border-desert-200 rounded-2xl text-sm font-bold text-clay-600 bg-desert-50"
          >
            <Download className="w-4 h-4" />
            {isAr ? "تثبيت التطبيق" : "Install App"}
          </button>

          {/* Login/Logout */}
          {!user ? (
            <Link
              href={`/${locale}/auth/login`}
              onClick={() => setDrawerOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-clay-900 text-white rounded-2xl text-sm font-bold shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              {isAr ? "تسجيل الدخول" : "Sign In"}
            </Link>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-desert-50 rounded-2xl border border-desert-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sand-400 to-orange-500 flex items-center justify-center text-white font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-clay-900 truncate">{user.name}</p>
                <p className="text-xs text-clay-400 capitalize">{user.role.replace("_", " ").toLowerCase()}</p>
              </div>
              <Link
                href={`/${locale}/account`}
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-bold text-sand-600 border border-sand-300 px-3 py-1.5 rounded-full"
              >
                {isAr ? "الحساب" : "Profile"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
