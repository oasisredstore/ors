"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  nameAr: string;
  origin: string;
  originAr: string;
  avatar?: string;
  avatarEmoji: string;
  rating: number;
  text: string;
  textAr: string;
  productType: string;
  productTypeAr: string;
  verified: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Amira Boudiaf",
    nameAr: "أميرة بوضياف",
    origin: "Algiers, Algeria",
    originAr: "الجزائر العاصمة",
    avatarEmoji: "👩🏽",
    rating: 5,
    text: "The traditional carpet I purchased is absolutely stunning. The intricate Saharan patterns and the vibrant colors are just as described. It now takes center stage in my living room!",
    textAr: "السجادة التقليدية التي اشتريتها رائعة بحق. الأنماط الصحراوية المعقدة والألوان الزاهية تماماً كما وصفت. أصبحت نقطة الجذب الرئيسية في غرفة معيشتي!",
    productType: "Traditional Carpet",
    productTypeAr: "سجادة تقليدية",
    verified: true,
  },
  {
    id: "2",
    name: "Youssef El Fassi",
    nameAr: "يوسف الفاسي",
    origin: "Casablanca, Morocco",
    originAr: "الدار البيضاء، المغرب",
    avatarEmoji: "👨🏽",
    rating: 5,
    text: "I booked a desert tour through Red Oasis Artisan and it was a life-changing experience. Our guide was incredibly knowledgeable about the Gourara culture and the Saharan landscape.",
    textAr: "حجزت جولة صحراوية عبر واحة الأحمر وكانت تجربة غيّرت حياتي. كان مرشدنا على دراية واسعة بثقافة قورارة والمنظر الطبيعي للصحراء.",
    productType: "Desert Tour",
    productTypeAr: "جولة صحراوية",
    verified: true,
  },
  {
    id: "3",
    name: "Isabelle Fontaine",
    nameAr: "إيزابيل فونتين",
    origin: "Lyon, France",
    originAr: "ليون، فرنسا",
    avatarEmoji: "👩🏻",
    rating: 5,
    text: "The silver jewelry I ordered arrived beautifully packaged. The craftsmanship is exquisite — I can see the hundreds of hours of work that went into each piece. Will definitely order again!",
    textAr: "وصلت المجوهرات الفضية التي طلبتها في تغليف رائع. الحرفية رائعة — يمكنني رؤية مئات ساعات العمل التي دخلت في كل قطعة. سأطلب مرة أخرى بالتأكيد!",
    productType: "Silver Jewelry",
    productTypeAr: "مجوهرات فضية",
    verified: true,
  },
  {
    id: "4",
    name: "Omar Khelifi",
    nameAr: "عمر خليفي",
    origin: "Oran, Algeria",
    originAr: "وهران، الجزائر",
    avatarEmoji: "👨🏽‍🦱",
    rating: 5,
    text: "The guesthouse booking was seamless and the accommodation was beyond beautiful. Waking up to the view of the red Saharan dunes is something I will never forget.",
    textAr: "حجز الضيافة كان سلساً والإقامة كانت جميلة بشكل استثنائي. الاستيقاظ على منظر الكثبان الصحراوية الحمراء شيء لن أنساه أبداً.",
    productType: "Guesthouse Stay",
    productTypeAr: "إقامة بيت ضيافة",
    verified: true,
  },
  {
    id: "5",
    name: "Sara Hendricks",
    nameAr: "سارة هندريكس",
    origin: "Toronto, Canada",
    originAr: "تورنتو، كندا",
    avatarEmoji: "👩🏼",
    rating: 5,
    text: "As a traveler who has visited many cultures, the artisan work from Timimoun stands out for its authenticity. The pottery I bought tells a story that transcends borders.",
    textAr: "كمسافرة زرت ثقافات كثيرة، تتميز أعمال الحرفيين من تيميمون بأصالتها. الفخار الذي اشتريته يروي قصة تتجاوز الحدود.",
    productType: "Traditional Pottery",
    productTypeAr: "فخار تقليدي",
    verified: true,
  },
  {
    id: "6",
    name: "Amine Rahmani",
    nameAr: "أمين رحماني",
    origin: "Constantine, Algeria",
    originAr: "قسنطينة، الجزائر",
    avatarEmoji: "👨🏽‍🦳",
    rating: 5,
    text: "Bought a handwoven basket for my mother and she was moved to tears — she said it reminded her of her childhood in the oasis. The quality and authenticity are unmatched.",
    textAr: "اشتريت سلة مُنسجة يدوياً لأمي فأبكتها — قالت إنها ذكّرتها بطفولتها في الواحة. الجودة والأصالة لا مثيل لهما.",
    productType: "Handwoven Basket",
    productTypeAr: "سلة منسوجة يدوياً",
    verified: true,
  },
];

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${starSize} ${
            i < rating ? "fill-amber-400 text-amber-400" : "fill-clay-600 text-clay-600"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  locale,
  isActive,
}: {
  testimonial: Testimonial;
  locale: string;
  isActive: boolean;
}) {
  const isAr = locale === "ar";
  return (
    <div
      className={`relative flex flex-col bg-white/5 backdrop-blur-sm border rounded-3xl p-8 transition-all duration-500 h-full ${
        isActive
          ? "border-sand-400/50 shadow-2xl shadow-sand-900/30 scale-100 opacity-100"
          : "border-white/10 scale-95 opacity-60"
      }`}
    >
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 opacity-20">
        <Quote className="w-10 h-10 text-sand-300" />
      </div>

      {/* Stars */}
      <StarRating rating={testimonial.rating} size="md" />

      {/* Review text */}
      <p className="mt-5 text-clay-200 leading-relaxed flex-1 text-sm md:text-base">
        {isAr ? testimonial.textAr : testimonial.text}
      </p>

      {/* Product type badge */}
      <div className="mt-5 inline-flex">
        <span className="px-3 py-1 bg-sand-500/20 border border-sand-400/30 rounded-full text-xs font-semibold text-sand-300">
          {isAr ? testimonial.productTypeAr : testimonial.productType}
        </span>
      </div>

      {/* Author */}
      <div className="mt-6 flex items-center gap-4 pt-5 border-t border-white/10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sand-400 to-oasis-500 flex items-center justify-center text-2xl shadow-lg flex-shrink-0 overflow-hidden">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <span>{testimonial.avatarEmoji}</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white">
              {isAr ? testimonial.nameAr : testimonial.name}
            </p>
            {testimonial.verified && (
              <span className="text-xs bg-oasis-500/30 text-oasis-300 px-2 py-0.5 rounded-full border border-oasis-400/30">
                {isAr ? "✓ مُحقَّق" : "✓ Verified"}
              </span>
            )}
          </div>
          <p className="text-sm text-clay-400 mt-0.5">
            {isAr ? testimonial.originAr : testimonial.origin}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const visibleCount = 3;
  const totalSlides = TESTIMONIALS.length;

  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < visibleCount; i++) {
      items.push(TESTIMONIALS[(activeIndex + i) % totalSlides]);
    }
    return items;
  };

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    autoPlayRef.current = setInterval(next, 4500);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, activeIndex]);

  const handleNavClick = (fn: () => void) => {
    setIsAutoPlaying(false);
    fn();
  };

  const visibleItems = getVisibleItems();

  return (
    <section className="py-28 bg-clay-900 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-sand-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-oasis-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-sand-500/20 border border-sand-400/30 rounded-full text-sand-300 text-sm font-semibold mb-4">
            {isAr ? "❤️ آراء زوارنا" : "❤️ What Visitors Say"}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            {isAr ? "تجارب حقيقية من قورارة" : "Real Experiences from Gourara"}
          </h2>
          <p className="text-clay-400 max-w-2xl mx-auto text-lg">
            {isAr
              ? "آلاف الزوار من حول العالم اختاروا قورارة للحرف لتجربة لا تُنسى في قلب الصحراء"
              : "Thousands of visitors from around the world chose Gourara Crafts for an unforgettable experience in the heart of the Sahara"}
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
          {[
            { value: "4.9", label: isAr ? "متوسط التقييم" : "Average Rating", icon: "⭐" },
            { value: "500+", label: isAr ? "تقييم موثّق" : "Verified Reviews", icon: "✅" },
            { value: "98%", label: isAr ? "رضا العملاء" : "Customer Satisfaction", icon: "💎" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-3xl font-bold text-white font-display">{stat.value}</div>
              <div className="text-sm text-clay-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials grid (desktop: 3, mobile: 1) */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-10">
          {visibleItems.map((testimonial, i) => (
            <TestimonialCard
              key={`${testimonial.id}-${activeIndex}-${i}`}
              testimonial={testimonial}
              locale={locale}
              isActive={i === 1}
            />
          ))}
        </div>

        {/* Mobile: single card */}
        <div className="md:hidden mb-10">
          <TestimonialCard
            testimonial={TESTIMONIALS[activeIndex]}
            locale={locale}
            isActive={true}
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => handleNavClick(prev)}
            aria-label={isAr ? "السابق" : "Previous"}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-sand-500/30 hover:border-sand-400/50 flex items-center justify-center text-clay-300 hover:text-white transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleNavClick(() => setActiveIndex(i))}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-6 h-2.5 bg-sand-400"
                    : "w-2.5 h-2.5 bg-clay-600 hover:bg-clay-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => handleNavClick(next)}
            aria-label={isAr ? "التالي" : "Next"}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-sand-500/30 hover:border-sand-400/50 flex items-center justify-center text-clay-300 hover:text-white transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
