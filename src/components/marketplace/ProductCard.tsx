"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Eye, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useWishlistStore } from "@/store/wishlistStore";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  imageUrl?: string | null;
  artisanName: string;
  artisanSlug: string;
  categoryName?: string;
  categoryNameAr?: string;
  rating?: number;
  reviewCount?: number;
  locale: string;
}

export function ProductCard({
  id,
  slug,
  name,
  nameAr,
  imageUrl,
  artisanName,
  artisanSlug,
  categoryName,
  categoryNameAr,
  rating,
  reviewCount,
  locale,
}: ProductCardProps) {
  const t = useTranslations("product");
  const isAr = locale === "ar";
  const displayName = isAr && nameAr ? nameAr : name;
  const displayCategory = isAr && categoryNameAr ? categoryNameAr : categoryName;
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(id);

  return (
    <Link href={`/${locale}/products/${slug}`} className="block group">
      <div
        className="product-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-desert-100 transition-all duration-300 hover:-translate-y-1"
        suppressHydrationWarning
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-desert-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={displayName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl">🏺</div>
            </div>
          )}

          {/* View Details overlay */}
          <div className="absolute inset-0 bg-clay-900/0 group-hover:bg-clay-900/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
              <div className="bg-white/90 backdrop-blur-sm text-clay-800 text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
                <Eye className="w-3.5 h-3.5" />
                {isAr ? "عرض التفاصيل" : "View Details"}
              </div>
            </div>
          </div>

          {/* Category badge */}
          {displayCategory && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm text-clay-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                {displayCategory}
              </span>
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
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
              wishlisted
                ? "bg-red-50 text-red-500 scale-110"
                : "bg-white/90 text-clay-400 hover:text-red-400 hover:scale-110"
            }`}
          >
            <Heart className={`w-4 h-4 transition-all ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/${locale}/artisans/${artisanSlug}`;
            }}
            className="text-xs text-oasis-600 font-medium hover:text-oasis-700 transition-colors cursor-pointer"
          >
            {artisanName}
          </span>
          <h3 className="mt-1 font-semibold text-clay-800 text-sm leading-tight line-clamp-2 group-hover:text-sand-600 transition-colors">
            {displayName}
          </h3>

          {/* Rating */}
          {rating !== undefined && (
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs text-clay-600">
                {rating.toFixed(1)} ({reviewCount ?? 0})
              </span>
            </div>
          )}

          {/* Artisan craft tag */}
          <div className="mt-3 flex items-center gap-1.5">
            <span className="text-xs text-clay-400 italic">
              {isAr ? "صنع يدوي أصيل" : "Authentic handcraft"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
