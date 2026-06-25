"use client";

import { useRef, useEffect } from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBarProps {
  locale?: string;
}

const TRUST_ITEMS = [
  {
    key: "freeShipping",
    icon: Truck,
    color: "text-oasis-600",
    bg: "bg-oasis-50",
    border: "border-oasis-200",
    iconBg: "bg-oasis-100",
  },
  {
    key: "returns",
    icon: RotateCcw,
    color: "text-sand-600",
    bg: "bg-sand-50",
    border: "border-sand-200",
    iconBg: "bg-sand-100",
  },
  {
    key: "securePay",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
  },
  {
    key: "support",
    icon: Headphones,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    iconBg: "bg-indigo-100",
  },
  {
    key: "giftService",
    icon: Gift,
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
    iconBg: "bg-rose-100",
  },
] as const;

const LABELS_AR: Record<string, { title: string; desc: string }> = {
  freeShipping: { title: "توصيل مجاني", desc: "للطلبات فوق 5000 دج" },
  returns:      { title: "استرجاع مضمون", desc: "خلال 3 أيام" },
  securePay:    { title: "دفع آمن 100%", desc: "حماية كاملة لبياناتك" },
  support:      { title: "دعم 24/7", desc: "فريق متخصص بخدمتك" },
  giftService:  { title: "خدمة الهدايا", desc: "تغليف وإرسال هدايا" },
};

const LABELS_EN: Record<string, { title: string; desc: string }> = {
  freeShipping: { title: "Free Shipping", desc: "On orders above 5000 DZD" },
  returns:      { title: "Easy Returns", desc: "Within 3 days" },
  securePay:    { title: "100% Secure Pay", desc: "Your data is protected" },
  support:      { title: "24/7 Support", desc: "Dedicated expert team" },
  giftService:  { title: "Gift Service", desc: "Wrapping & delivery" },
};

export function TrustBar({ locale = "en" }: TrustBarProps) {
  const isAr = locale === "ar";
  const labels = isAr ? LABELS_AR : LABELS_EN;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll animation on mobile
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId: number;
    let direction = 1;
    let pos = 0;

    const animate = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      pos += direction * 0.5;
      if (pos >= maxScroll) { direction = -1; pos = maxScroll; }
      if (pos <= 0)         { direction = 1;  pos = 0; }

      el.scrollLeft = isAr ? -pos : pos;
      animId = requestAnimationFrame(animate);
    };

    // Pause on touch
    const pause = () => cancelAnimationFrame(animId);
    const resume = () => { animId = requestAnimationFrame(animate); };

    animId = requestAnimationFrame(animate);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, [isAr]);

  return (
    <div className="w-full bg-gradient-to-r from-clay-900 via-clay-800 to-clay-900 border-b border-clay-700">
      {/* Desktop: horizontal bar */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 divide-x divide-clay-700 rtl:divide-x-reverse">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          const label = labels[item.key];
          return (
            <div
              key={item.key}
              className="flex items-center gap-2.5 px-5 py-2.5 flex-1 group cursor-default"
            >
              <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                item.iconBg
              )}>
                <Icon className={cn("w-3.5 h-3.5", item.color)} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-bold text-white whitespace-nowrap leading-tight">
                  {label.title}
                </p>
                <p className="text-[10px] text-clay-400 whitespace-nowrap mt-0.5">
                  {label.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: scrollable pill strip */}
      <div
        ref={scrollRef}
        className="md:hidden flex items-center gap-2.5 px-4 py-2.5 overflow-x-auto scrollbar-none"
        dir={isAr ? "rtl" : "ltr"}
      >
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          const label = labels[item.key];
          return (
            <div
              key={item.key}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border shrink-0 transition-all",
                item.bg, item.border
              )}
            >
              <Icon className={cn("w-3 h-3 shrink-0", item.color)} strokeWidth={2.5} />
              <span className="text-[11px] font-bold text-clay-800 whitespace-nowrap">
                {label.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
