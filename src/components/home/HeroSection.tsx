"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, Sparkles, Search, MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface HeroSectionProps {
  locale: string;
}

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <p
        className="font-display font-bold text-sand-300"
        style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}
      >
        {value}
      </p>
      <p className="text-sm text-white/65 mt-0.5 font-medium">{label}</p>
    </div>
  );
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("home.hero");
  const isRTL = locale === "ar";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  // Parallax effect on scroll
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/${locale}/products`);
    }
  };

  const stats = [
    { value: "50+",  label: locale === "ar" ? "إقامة وجولة"   : "Stays & Tours" },
    { value: "100+", label: locale === "ar" ? "شريك محلي"      : "Local Partners" },
    { value: "300+", label: locale === "ar" ? "منتج حرفي"      : "Artisan Products" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax Background Image */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{ transform: `translateY(${scrollY * 0.35}px)` }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: "url('/images/timimoun/timimoun_oasis_sunset.webp')" }}
        />
      </div>

      {/* Multi-layer overlays */}
      <div className="absolute inset-0 overlay-toub" />
      <div className="absolute inset-0 bg-hero-gradient mix-blend-multiply opacity-55" />

      {/* Decorative Islamic geometric pattern */}
      <div className="absolute inset-0 opacity-8">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,2 58,16 58,44 30,58 2,44 2,16" fill="none" stroke="white" strokeWidth="0.8" />
              <polygon points="30,10 50,20 50,40 30,50 10,40 10,20" fill="none" stroke="white" strokeWidth="0.4" />
              <circle cx="30" cy="30" r="3" fill="none" stroke="rgba(222,176,72,0.4)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      {/* Floating ambient orbs */}
      <div
        className="absolute top-24 left-12 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-float"
        style={{ background: "rgba(222, 176, 72, 0.12)" }}
      />
      <div
        className="absolute bottom-32 right-16 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-float-delayed"
        style={{ background: "rgba(25, 114, 168, 0.10)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(192,74,26,0.25) 0%, transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-36">
        <div className={`max-w-3xl ${isRTL ? "mr-auto" : ""}`}>

          {/* Premium badge */}
          <div
            className="inline-flex items-center gap-2.5 border text-white text-xs font-semibold px-4 py-2 rounded-full mb-8 animate-fade-in-up uppercase tracking-wider"
            style={{
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255,255,255,0.22)",
              animationDelay: "0s",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {t("badge")}
          </div>

          {/* Main heading */}
          <h1
            className="font-display font-bold text-white leading-tight mb-6 animate-fade-in-up text-fluid-hero"
            style={{ animationDelay: "0.12s", textShadow: "0 2px 24px rgba(0,0,0,0.40)" }}
          >
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl text-white/75 leading-relaxed mb-10 max-w-2xl animate-fade-in-up"
            style={{ animationDelay: "0.22s" }}
          >
            {t("subtitle")}
          </p>

          {/* Search bar */}
          <div
            className="animate-fade-in-up w-full max-w-2xl"
            style={{ animationDelay: "0.34s" }}
          >
            <form
              onSubmit={handleSearch}
              className="relative flex items-center rounded-2xl p-2 transition-all duration-300 shadow-2xl"
              style={{
                background: searchFocused ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.12)",
                backdropFilter: "blur(20px)",
                border: searchFocused
                  ? "1px solid rgba(222,176,72,0.60)"
                  : "1px solid rgba(255,255,255,0.22)",
                boxShadow: searchFocused
                  ? "0 0 0 3px rgba(222,176,72,0.15), 0 20px 60px rgba(0,0,0,0.35)"
                  : "0 8px 40px rgba(0,0,0,0.30)",
              }}
            >
              <div className="pl-4 pr-2 flex items-center justify-center">
                <Search className="w-5 h-5 text-white/60" />
              </div>
              <input
                type="text"
                placeholder={locale === "ar" ? "ابحث عن فندق، رحلة، أو منتج..." : "Search for a hotel, tour, or product..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                dir={isRTL ? "rtl" : "ltr"}
                className="flex-1 bg-transparent border-none text-white placeholder-white/50 focus:ring-0 outline-none text-base"
              />
              <button
                type="submit"
                className="btn-pulsing flex items-center gap-2 bg-sand-500 hover:bg-sand-400 text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all shadow-lg text-sm"
                style={{ boxShadow: "0 4px 20px rgba(192,74,26,0.45)" }}
              >
                {locale === "ar" ? "بحث" : "Search"}
              </button>
            </form>

            {/* Quick links */}
            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm text-white/70 font-medium"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {locale === "ar" ? "تيميمون المركز" : "Timimoun Center"}
              </span>
              <Link href={`/${locale}/services?type=accommodation`} className="hover:text-amber-300 hover:underline underline-offset-2 transition-all">
                {locale === "ar" ? "الفنادق والإقامات" : "Hotels & Stays"}
              </Link>
              <Link href={`/${locale}/services?type=tour`} className="hover:text-amber-300 hover:underline underline-offset-2 transition-all">
                {locale === "ar" ? "الجولات السياحية" : "Desert Tours"}
              </Link>
              <Link href={`/${locale}/products`} className="hover:text-amber-300 hover:underline underline-offset-2 transition-all">
                {locale === "ar" ? "المنتجات الحرفية" : "Artisan Crafts"}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div
            className={`flex flex-wrap gap-10 mt-16`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {stats.map((stat, i) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                label={stat.label}
                delay={600 + i * 150}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-breathe z-10">
        <ChevronDown className="w-5 h-5 text-white/40" />
        <ChevronDown className="w-5 h-5 text-white/25 -mt-3" />
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0,50 C200,100 400,20 600,60 C800,100 1100,10 1440,50 L1440,100 L0,100 Z"
            fill="#FEFCF8"
            opacity="1"
          />
        </svg>
      </div>
    </section>
  );
}
