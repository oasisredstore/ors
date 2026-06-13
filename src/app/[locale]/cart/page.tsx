"use client";

import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CartPage() {
  const t = useTranslations("cart");
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const { locale = "en" } = useParams<{ locale: string }>();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-desert-50 pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-clay-200 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-clay-800 mb-2">{t("empty")}</h2>
          <p className="text-clay-400 mb-8">{t("emptyDesc")}</p>
          <Link href={`/${locale}/products`}>
            <Button size="lg">{t("continueShopping")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-desert-50 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-clay-800 mb-8">{t("title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-desert-200 p-4 flex gap-4 items-center"
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-desert-100 shrink-0">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-2xl">🏺</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${locale}/products/${item.slug}`}
                    className="font-semibold text-clay-800 hover:text-sand-600 transition-colors text-sm line-clamp-2"
                  >
                    {locale === "ar" && item.nameAr ? item.nameAr : item.name}
                  </Link>
                  <p className="text-xs text-clay-400 mt-0.5">{item.artisanName}</p>
                  <p className="font-bold text-clay-800 mt-1">{formatPrice(item.price)}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-desert-300 flex items-center justify-center text-clay-600 hover:bg-desert-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-semibold text-clay-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stockQty}
                    className="w-8 h-8 rounded-full border border-desert-300 flex items-center justify-center text-clay-600 hover:bg-desert-100 transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal + Remove */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-clay-800 text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 mt-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-desert-200 p-6 sticky top-24">
              <h2 className="font-semibold text-clay-800 text-lg mb-5">{t("total")}</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-clay-600">
                  <span>{t("subtotal")}</span>
                  <span>{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm text-clay-600">
                  <span>{t("shipping")}</span>
                  <span className="text-oasis-600 font-medium">{t("shippingNote")}</span>
                </div>
                <hr className="border-desert-200" />
                <div className="flex justify-between font-bold text-clay-800 text-lg">
                  <span>{t("total")}</span>
                  <span>{formatPrice(totalPrice())}</span>
                </div>
              </div>

              <Link href={`/${locale}/checkout`}>
                <Button size="lg" className="w-full">{t("checkout")}</Button>
              </Link>
              <Link
                href={`/${locale}/products`}
                className="block text-center text-sm text-clay-400 hover:text-sand-600 mt-3 transition-colors"
              >
                {t("continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
