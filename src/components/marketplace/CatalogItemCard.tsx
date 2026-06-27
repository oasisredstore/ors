"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Eye, Heart, MapPin } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

interface CatalogItemCardProps {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  imageUrl?: string | null;
  providerName: string;
  providerSlug: string;
  categoryOrType: string;
  price?: number | null;
  itemType: "PRODUCT" | "ACCOMMODATION" | "TOUR" | "WORKSHOP" | "TRANSPORT" | "ROOM" | "TENT";
  rating?: number;
  reviewCount?: number;
  locale: string;
  location?: string | null;
}

export function CatalogItemCard({
  id,
  slug,
  name,
  nameAr,
  imageUrl,
  providerName,
  providerSlug,
  categoryOrType,
  price,
  itemType,
  rating,
  reviewCount,
  locale,
  location,
}: CatalogItemCardProps) {
  const isAr = locale === "ar";
  const displayName = isAr && nameAr ? nameAr : name;
  const { toggleItem, isWishlisted } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted && isWishlisted(id);

  // Styling and wording based on itemType
  const getTypeConfig = () => {
    switch (itemType) {
      case "PRODUCT":
        return { emoji: "🏺", label: isAr ? "منتج حرفي" : "Handcraft", bg: "bg-amber-100 text-amber-700", href: `/${locale}/products/${slug}` };
      case "ACCOMMODATION":
      case "ROOM":
        return { emoji: "🏨", label: isAr ? "غرفة/إقامة" : "Room", bg: "bg-blue-100 text-blue-700", href: `/${locale}/services/${slug}` };
      case "TENT":
        return { emoji: "⛺", label: isAr ? "خيمة/مخيم" : "Tent", bg: "bg-blue-100 text-blue-700", href: `/${locale}/services/${slug}` };
      case "TOUR":
        return { emoji: "🐪", label: isAr ? "جولة" : "Tour", bg: "bg-sand-100 text-sand-700", href: `/${locale}/services/${slug}` };
      case "WORKSHOP":
        return { emoji: "🎨", label: isAr ? "ورشة" : "Workshop", bg: "bg-rose-100 text-rose-700", href: `/${locale}/services/${slug}` };
      case "TRANSPORT":
        return { emoji: "🚙", label: isAr ? "نقل" : "Transport", bg: "bg-teal-100 text-teal-700", href: `/${locale}/services/${slug}` };
      default:
        return { emoji: "📦", label: "Item", bg: "bg-gray-100 text-gray-700", href: `/${locale}/products/${slug}` };
    }
  };

  const config = getTypeConfig();

  return (
    <Link href={config.href} className="block group">
      <div
        className="catalog-card bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-desert-100 transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full"
        suppressHydrationWarning
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-desert-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={displayName}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-5xl">{config.emoji}</div>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-3 right-3">
            <span className={`${config.bg} px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 backdrop-blur-md bg-opacity-90`}>
              <span>{config.emoji}</span>
              {config.label}
            </span>
          </div>

          {/* Price Badge */}
          {price !== undefined && price !== null && (
            <div className="absolute bottom-3 left-3 bg-clay-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {price} DZD
            </div>
          )}

          {/* Wishlist Heart button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleItem(id);
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
              wishlisted
                ? "bg-red-50 text-red-500 scale-110"
                : "bg-white/90 text-clay-400 hover:text-red-400 hover:scale-110"
            }`}
          >
            <Heart className={`w-4 h-4 transition-all ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-clay-400">
              {categoryOrType}
            </span>
            {rating !== undefined && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-bold">
                  {rating.toFixed(1)} <span className="font-normal opacity-70">({reviewCount ?? 0})</span>
                </span>
              </div>
            )}
          </div>
          
          <h3 className="font-display font-bold text-clay-900 text-lg leading-tight line-clamp-2 group-hover:text-sand-600 transition-colors mb-2">
            {displayName}
          </h3>

          <div className="mt-auto space-y-2 pt-4 border-t border-desert-50">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/${locale}/artisans/${providerSlug}`;
              }}
              className="flex items-center gap-2 group/provider cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-desert-200 flex items-center justify-center text-[10px] font-bold text-clay-600 shrink-0">
                {providerName.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-clay-600 group-hover/provider:text-oasis-600 transition-colors truncate">
                {providerName}
              </span>
            </div>

            {location && (
              <div className="flex items-center gap-1.5 text-xs text-clay-500">
                <MapPin className="w-3.5 h-3.5 text-clay-400" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
