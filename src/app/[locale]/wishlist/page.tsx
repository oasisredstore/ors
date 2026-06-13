"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

interface WishlistProduct {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  price: number;
  images: { url: string; isPrimary: boolean }[];
  artisan: { shopName: string; slug: string };
  category: { name: string; nameAr: string };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function WishlistPage() {
  const { locale = "en" } = useParams<{ locale: string }>();
  const isAr = locale === "ar";
  const { items, removeItem } = useWishlistStore();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProducts([]);
      setLoading(false);
      return;
    }

    const params = new URLSearchParams();
    items.forEach((id) => params.append("ids", id));

    fetch(`/api/wishlist?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [items]);

  return (
    <div className="min-h-screen bg-desert-50 pt-24 pb-16 px-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`mb-8 ${isAr ? "text-right" : ""}`}>
          <h1 className="font-display text-4xl font-bold text-clay-800 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-400 fill-red-400" />
            {isAr ? "قائمة المفضلة" : "My Wishlist"}
          </h1>
          {items.length > 0 && (
            <p className="text-clay-400 mt-2 text-sm">
              {items.length} {isAr ? "منتج" : `item${items.length !== 1 ? "s" : ""}`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-desert-200 overflow-hidden animate-pulse">
                <div className="aspect-square bg-desert-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-desert-100 rounded w-1/3" />
                  <div className="h-4 bg-desert-100 rounded w-2/3" />
                  <div className="h-3 bg-desert-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-desert-200 p-16 text-center">
            <Heart className="w-16 h-16 text-clay-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-clay-600 mb-2">
              {isAr ? "قائمة المفضلة فارغة" : "Your wishlist is empty"}
            </h2>
            <p className="text-clay-400 text-sm mb-6">
              {isAr ? "اضغط على ♥ على أي منتج لإضافته هنا" : "Click ♥ on any product to save it here"}
            </p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sand-500 to-sand-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-sand-600 hover:to-sand-700 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              {isAr ? "تصفح المنتجات" : "Browse Products"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => {
              const displayName = isAr && product.nameAr ? product.nameAr : product.name;
              const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
              const displayCategory = isAr ? product.category.nameAr : product.category.name;

              return (
                <div key={product.id} className="bg-white rounded-2xl border border-desert-200 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  {/* Image */}
                  <Link href={`/${locale}/products/${product.slug}`}>
                    <div className="relative aspect-square overflow-hidden bg-desert-100">
                      {primaryImage?.url ? (
                        <Image
                          src={primaryImage.url}
                          alt={displayName}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🏺</div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-clay-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                          {displayCategory}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <Link href={`/${locale}/artisans/${product.artisan.slug}`}>
                      <span className="text-xs text-oasis-600 font-medium hover:text-oasis-700 transition-colors">
                        {product.artisan.shopName}
                      </span>
                    </Link>
                    <Link href={`/${locale}/products/${product.slug}`}>
                      <h3 className={`mt-1 font-semibold text-clay-800 text-sm leading-tight line-clamp-2 hover:text-sand-600 transition-colors ${isAr ? "text-right" : ""}`}>
                        {displayName}
                      </h3>
                    </Link>
                    {product.price > 0 && (
                      <p className="font-bold text-clay-800 mt-2 text-sm">{formatPrice(product.price)}</p>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2">
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="flex-1 text-center text-xs font-semibold py-2.5 rounded-xl bg-gradient-to-r from-sand-500 to-sand-600 text-white hover:from-sand-600 hover:to-sand-700 transition-all"
                      >
                        {isAr ? "عرض المنتج" : "View Product"}
                      </Link>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="w-9 h-9 rounded-xl border border-desert-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-all"
                        title={isAr ? "إزالة من المفضلة" : "Remove from wishlist"}
                      >
                        <Heart className="w-4 h-4 fill-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
