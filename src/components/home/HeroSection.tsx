"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, Sparkles, Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("home.hero");
  const isRTL = locale === "ar";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/${locale}/products`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image & Gradient Overlay */}
      <div className="absolute inset-0 bg-[url('/images/timimoun/timimoun_oasis_sunset.webp')] bg-cover bg-center" />
      <div className="absolute inset-0 overlay-toub" />
      <div className="absolute inset-0 bg-hero-gradient mix-blend-multiply opacity-60" />

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,2 58,16 58,44 30,58 2,44 2,16" fill="none" stroke="white" strokeWidth="1" />
              <polygon points="30,10 50,20 50,40 30,50 10,40 10,20" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-sand-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-oasis-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-medium px-4 py-2 rounded-full mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-sand-300" />
            {t("badge")}
          </div>

          {/* Title */}
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {t("subtitle")}
          </p>

          {/* CTAs & Search */}
          <div
            className="animate-fade-in-up w-full max-w-2xl"
            style={{ animationDelay: "0.3s" }}
          >
            <form 
              onSubmit={handleSearch}
              className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 focus-within:ring-2 focus-within:ring-sand-400 focus-within:bg-white/20 transition-all duration-300 shadow-2xl"
            >
              <div className="pl-4 pr-2 flex items-center justify-center">
                <Search className="w-5 h-5 text-white/70" />
              </div>
              <input
                type="text"
                placeholder={locale === "ar" ? "ابحث عن فندق، رحلة، أو منتج..." : "Search for a hotel, tour, or product..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-white placeholder-white/60 focus:ring-0 outline-none text-base sm:text-lg"
              />
              <button
                type="submit"
                className="bg-sand-500 hover:bg-sand-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all shadow-lg hover:shadow-sand-500/50"
              >
                {locale === "ar" ? "بحث" : "Search"}
              </button>
            </form>
            
            <div className="flex items-center gap-4 mt-6 text-sm text-white/80 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-sand-400" />
                {locale === "ar" ? "تيميمون المركز" : "Timimoun Center"}
              </span>
              <Link href={`/${locale}/services?type=accommodation`} className="hover:text-sand-300 hover:underline transition-all">
                {locale === "ar" ? "الفنادق والإقامات" : "Hotels & Stays"}
              </Link>
              <Link href={`/${locale}/services?type=tour`} className="hover:text-sand-300 hover:underline transition-all">
                {locale === "ar" ? "الجولات السياحية" : "Tours"}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap gap-8 mt-14 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: "50+", label: locale === "ar" ? "إقامة وجولة" : "Stays & Tours" },
              { value: "100+", label: locale === "ar" ? "شريك محلي" : "Local Partners" },
              { value: "300+", label: locale === "ar" ? "منتج حرفي" : "Artisan Products" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-display font-bold text-sand-300">{stat.value}</p>
                <p className="text-sm text-white/70 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#fdf6e3"
          />
        </svg>
      </div>
    </section>
  );
}
