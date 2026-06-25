"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Check, Zap } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface StickyProductActionsProps {
  product: {
    id: string;
    slug: string;
    name: string;
    nameAr?: string | null;
    price: number;
    stockQty: number;
    images: { url: string; isPrimary: boolean }[];
    artisan: { shopName: string };
  };
  triggerRef: React.RefObject<HTMLElement | null>;
  locale: string;
}

export function StickyProductActions({
  product,
  triggerRef,
  locale,
}: StickyProductActionsProps) {
  const { addItem } = useCartStore();
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const isAr = locale === "ar";

  const displayName = isAr && product.nameAr ? product.nameAr : product.name;
  const inStock = product.stockQty > 0 && product.price > 0;

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when the primary add-to-cart button scrolls OUT of view
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerRef]);

  function handleAddToCart() {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      nameAr: product.nameAr,
      imageUrl: product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url,
      price: product.price,
      stockQty: product.stockQty,
      artisanName: product.artisan.shopName,
    });
    setAdded(true);
    toast.success(isAr ? "تمت الإضافة إلى السلة ✓" : "Added to cart ✓");
    setTimeout(() => setAdded(false), 2500);
  }

  if (!inStock) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 lg:bottom-0",
        // On mobile we sit above the BottomNav (64px = h-16)
        "pb-16 lg:pb-0",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      )}
      aria-hidden={!visible}
    >
      <div className="bg-white/95 backdrop-blur-xl border-t border-desert-200 shadow-[0_-8px_32px_rgba(30,20,16,0.12)] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          {/* Product mini-info */}
          <div className="flex-1 min-w-0 hidden sm:block">
            <p className="text-sm font-bold text-clay-800 truncate">{displayName}</p>
            <p className="text-lg font-bold text-sand-600">{formatPrice(product.price)}</p>
          </div>

          {/* Price shown on mobile only */}
          <p className="text-lg font-bold text-sand-600 sm:hidden shrink-0">
            {formatPrice(product.price)}
          </p>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className={cn(
              "flex items-center justify-center gap-2 flex-1 sm:flex-none sm:w-48 py-3 rounded-xl font-bold text-sm transition-all duration-200",
              added
                ? "bg-green-500 text-white"
                : "bg-gradient-to-r from-sand-500 to-sand-600 text-white hover:from-sand-600 hover:to-sand-700 shadow-md hover:shadow-lg active:scale-[0.97]"
            )}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                {isAr ? "تمت الإضافة!" : "Added!"}
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {isAr ? "أضف للسلة" : "Add to Cart"}
              </>
            )}
          </button>

          {/* Buy now */}
          <Link
            href={`/${locale}/cart`}
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 flex-1 sm:flex-none sm:w-40 py-3 rounded-xl font-bold text-sm bg-clay-900 text-white hover:bg-clay-800 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.97]"
          >
            <Zap className="w-4 h-4" />
            {isAr ? "اشتر الآن" : "Buy Now"}
          </Link>
        </div>
      </div>
    </div>
  );
}
