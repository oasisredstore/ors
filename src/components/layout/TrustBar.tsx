"use client";

import { useTranslations } from "next-intl";
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
  },
  {
    key: "returns",
    icon: RotateCcw,
    color: "text-sand-600",
    bg: "bg-sand-50",
  },
  {
    key: "securePay",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "support",
    icon: Headphones,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    key: "giftService",
    icon: Gift,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
] as const;

const LABELS_AR: Record<string, { title: string; desc: string }> = {
  freeShipping: { title: "توصيل مجاني", desc: "للطلبات فوق 5000 دج" },
  returns: { title: "استرجاع مضمون", desc: "خلال 3 أيام" },
  securePay: { title: "دفع آمن 100%", desc: "حماية كاملة لبياناتك" },
  support: { title: "دعم 24/7", desc: "فريق متخصص بخدمتك" },
  giftService: { title: "خدمة الهدايا", desc: "تغليف وإرسال هدايا" },
};

const LABELS_EN: Record<string, { title: string; desc: string }> = {
  freeShipping: { title: "Free Shipping", desc: "On orders above 5000 DZD" },
  returns: { title: "Easy Returns", desc: "Within 3 days" },
  securePay: { title: "100% Secure Pay", desc: "Your data is protected" },
  support: { title: "24/7 Support", desc: "Dedicated expert team" },
  giftService: { title: "Gift Service", desc: "Wrapping & delivery" },
};

export function TrustBar({ locale = "en" }: TrustBarProps) {
  const isAr = locale === "ar";
  const labels = isAr ? LABELS_AR : LABELS_EN;

  return (
    <div className="w-full bg-white border-b border-desert-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-stretch overflow-x-auto scrollbar-none divide-x divide-desert-100 rtl:divide-x-reverse">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            const label = labels[item.key];

            return (
              <div
                key={item.key}
                className="flex items-center gap-2.5 px-4 py-2.5 shrink-0 group cursor-default"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                    item.bg
                  )}
                >
                  <Icon className={cn("w-4 h-4", item.color)} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-clay-800 whitespace-nowrap leading-tight">
                    {label.title}
                  </p>
                  <p className="text-[10px] text-clay-400 whitespace-nowrap leading-tight mt-0.5">
                    {label.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
