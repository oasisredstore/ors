"use client";

import { useRef, useEffect, useState } from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBarProps {
  locale?: string;
}

const TRUST_ITEMS = [
  {
    key: "freeShipping",
    icon: Truck,
    color: "text-oasis-400",
    bg: "bg-oasis-900/40",
    border: "border-oasis-700/50",
    iconBg: "bg-oasis-800/60",
    gradient: "from-oasis-500/10 to-transparent",
  },
  {
    key: "returns",
    icon: RotateCcw,
    color: "text-sand-400",
    bg: "bg-sand-900/40",
    border: "border-sand-700/50",
    iconBg: "bg-sand-800/60",
    gradient: "from-sand-500/10 to-transparent",
  },
  {
    key: "securePay",
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-950/50",
    border: "border-emerald-800/50",
    iconBg: "bg-emerald-900/60",
    gradient: "from-emerald-500/10 to-transparent",
  },
  {
    key: "support",
    icon: Headphones,
    color: "text-indigo-400",
    bg: "bg-indigo-950/50",
    border: "border-indigo-800/50",
    iconBg: "bg-indigo-900/60",
    gradient: "from-indigo-500/10 to-transparent",
  },
  {
    key: "giftService",
    icon: Gift,
    color: "text-rose-400",
    bg: "bg-rose-950/50",
    border: "border-rose-800/50",
    iconBg: "bg-rose-900/60",
    gradient: "from-rose-500/10 to-transparent",
  },
] as const;

const LABELS_AR: Record<string, { title: string; desc: string }> = {
  freeShipping: { title: "توصيل مجاني",    desc: "للطلبات فوق 5000 دج" },
  returns:      { title: "استرجاع مضمون",   desc: "خلال 3 أيام" },
  securePay:    { title: "دفع آمن 100%",    desc: "حماية كاملة لبياناتك" },
  support:      { title: "دعم 24/7",        desc: "فريق متخصص بخدمتك" },
  giftService:  { title: "خدمة الهدايا",    desc: "تغليف وإرسال هدايا" },
};

const LABELS_EN: Record<string, { title: string; desc: string }> = {
  freeShipping: { title: "Free Shipping",    desc: "On orders above 5000 DZD" },
  returns:      { title: "Easy Returns",     desc: "Within 3 days" },
  securePay:    { title: "100% Secure Pay",  desc: "Your data is protected" },
  support:      { title: "24/7 Support",     desc: "Dedicated expert team" },
  giftService:  { title: "Gift Service",     desc: "Wrapping & delivery" },
};

export function TrustBar({ locale = "en" }: TrustBarProps) {
  const isAr = locale === "ar";
  const labels = isAr ? LABELS_AR : LABELS_EN;
  const scrollRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Entrance animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll animation on mobile
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId: number;
    let direction = 1;
    let pos = 0;
    let paused = false;

    // Delay start to ensure layout is fully rendered
    const startTimeout = setTimeout(() => {
      const animate = () => {
        if (paused) {
          animId = requestAnimationFrame(animate);
          return;
        }
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 10) {
          // Not enough content to scroll — skip
          return;
        }

        pos += direction * 0.5;
        if (pos >= maxScroll) { direction = -1; pos = maxScroll; }
        if (pos <= 0)         { direction = 1;  pos = 0; }

        el.scrollLeft = isAr ? -pos : pos;
        animId = requestAnimationFrame(animate);
      };

      const pause  = () => { paused = true; };
      const resume = () => { paused = false; };

      animId = requestAnimationFrame(animate);
      el.addEventListener("touchstart", pause,  { passive: true });
      el.addEventListener("touchend",   resume, { passive: true });
      el.addEventListener("mouseenter", pause);
      el.addEventListener("mouseleave", resume);
    }, 400);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(animId);
    };
  }, [isAr]);

  return (
    <div
      ref={barRef}
      className="w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1E1410 0%, #2D1C14 35%, #1E1410 65%, #362420 100%)",
        borderBottom: "1px solid rgba(222, 176, 72, 0.15)",
      }}
    >
      {/* Animated gradient shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(222,176,72,0.04) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmerGold 4s ease-in-out infinite",
        }}
      />

      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(222,176,72,0.40), transparent)",
        }}
      />

      {/* Desktop: horizontal bar */}
      <div
        className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 divide-x divide-clay-800 rtl:divide-x-reverse"
        dir={isAr ? "rtl" : "ltr"}
      >
        {TRUST_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const label = labels[item.key];
          return (
            <div
              key={item.key}
              className={cn(
                "flex items-center gap-3 px-5 py-3 flex-1 group cursor-default transition-all duration-700 ease-out",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md",
                  item.iconBg
                )}
              >
                <Icon className={cn("w-4 h-4", item.color)} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-bold text-white whitespace-nowrap leading-tight group-hover:text-sand-200 transition-colors">
                  {label.title}
                </p>
                <p className="text-[10px] text-clay-400 whitespace-nowrap mt-0.5 group-hover:text-clay-300 transition-colors">
                  {label.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: scrollable pill strip */}
      <div className="md:hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #1E1410, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #1E1410, transparent)" }} />
        <div
          ref={scrollRef}
          className="flex items-center gap-2.5 px-6 py-3 overflow-x-auto scrollbar-none"
          dir={isAr ? "rtl" : "ltr"}
        >
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            const label = labels[item.key];
            return (
              <div
                key={item.key}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-full border shrink-0 transition-all backdrop-blur-sm",
                  item.bg, item.border
                )}
              >
                <Icon className={cn("w-3 h-3 shrink-0", item.color)} strokeWidth={2.5} />
                <span className="text-[11px] font-bold text-white/90 whitespace-nowrap">
                  {label.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
