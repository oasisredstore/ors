import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "DZD"): string {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Translate service type enum to display label */
export function serviceTypeLabel(type: string, locale: string): string {
  const labels: Record<string, { ar: string; en: string }> = {
    ROOM:      { ar: "غرفة / إقامة",        en: "Room / Stay" },
    TENT:      { ar: "خيمة صحراوية",         en: "Desert Tent" },
    HOMESTAY:  { ar: "إقامة لدى الساكنة",    en: "Homestay" },
    TOUR:      { ar: "جولة إرشادية",          en: "Guided Tour" },
    WORKSHOP:  { ar: "ورشة تعليمية",          en: "Workshop" },
    TRANSPORT: { ar: "خدمة نقل",             en: "Transport" },
  };
  const entry = labels[type];
  if (!entry) return type;
  return locale === "ar" ? entry.ar : entry.en;
}

/** Return emoji for service type */
export function serviceTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    ROOM:      "🏨",
    TENT:      "⛺",
    HOMESTAY:  "🏡",
    TOUR:      "🐪",
    WORKSHOP:  "🎨",
    TRANSPORT: "🚌",
  };
  return emojis[type] ?? "✨";
}
