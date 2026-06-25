"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus, Minus, ShoppingBag, MapPin, ChevronDown, Truck, Tag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────
   Algerian Wilayas with base shipping cost
   ────────────────────────────────────────── */
const WILAYAS = [
  { code: "01", name: "Adrar", nameAr: "أدرار", cost: 1200 },
  { code: "02", name: "Chlef", nameAr: "الشلف", cost: 900 },
  { code: "03", name: "Laghouat", nameAr: "الأغواط", cost: 800 },
  { code: "04", name: "Oum El Bouaghi", nameAr: "أم البواقي", cost: 900 },
  { code: "05", name: "Batna", nameAr: "باتنة", cost: 950 },
  { code: "06", name: "Béjaïa", nameAr: "بجاية", cost: 1000 },
  { code: "07", name: "Biskra", nameAr: "بسكرة", cost: 750 },
  { code: "08", name: "Béchar", nameAr: "بشار", cost: 1100 },
  { code: "09", name: "Blida", nameAr: "البليدة", cost: 800 },
  { code: "10", name: "Bouïra", nameAr: "البويرة", cost: 850 },
  { code: "16", name: "Alger", nameAr: "الجزائر العاصمة", cost: 900 },
  { code: "17", name: "Djelfa", nameAr: "الجلفة", cost: 750 },
  { code: "28", name: "M'Sila", nameAr: "المسيلة", cost: 800 },
  { code: "29", name: "Mascara", nameAr: "معسكر", cost: 900 },
  { code: "30", name: "Ouargla", nameAr: "ورقلة", cost: 700 },
  { code: "32", name: "El Bayadh", nameAr: "البيض", cost: 850 },
  { code: "33", name: "Illizi", nameAr: "إليزي", cost: 1300 },
  { code: "44", name: "Aïn Defla", nameAr: "عين الدفلى", cost: 850 },
  { code: "46", name: "Aïn Témouchent", nameAr: "عين تموشنت", cost: 950 },
  { code: "47", name: "Ghardaïa", nameAr: "غرداية", cost: 600 },
  { code: "48", name: "Relizane", nameAr: "غليزان", cost: 900 },
  { code: "49", name: "Timimoun", nameAr: "تيميمون", cost: 0 },  // Free for local
  { code: "50", name: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار", cost: 1400 },
  { code: "58", name: "In Salah", nameAr: "عين صالح", cost: 1200 },
  { code: "59", name: "In Guezzam", nameAr: "عين قزام", cost: 1400 },
] as const;

const FREE_SHIPPING_THRESHOLD = 5000; // DZD

/* ──────────────────────────────────────────
   Shipping Calculator Widget
   ────────────────────────────────────────── */
function ShippingCalculator({
  locale,
  subtotal,
}: {
  locale: string;
  subtotal: number;
}) {
  const isAr = locale === "ar";
  const [open, setOpen] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [city, setCity] = useState("");
  const [calculated, setCalculated] = useState<{ cost: number; wilaya: string } | null>(null);

  const wilayaData = WILAYAS.find((w) => w.code === selectedWilaya);

  function handleCalculate() {
    if (!wilayaData) return;
    const cost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : wilayaData.cost;
    setCalculated({ cost, wilaya: isAr ? wilayaData.nameAr : wilayaData.name });
  }

  return (
    <div className="border border-desert-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-desert-50 hover:bg-desert-100 transition-colors text-sm font-semibold text-clay-700"
      >
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-sand-500" />
          {isAr ? "احسب تكلفة التوصيل" : "Calculate Shipping"}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-clay-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="px-4 py-4 space-y-3 bg-white border-t border-desert-100">
          {/* Wilaya select */}
          <div>
            <label className="text-xs font-semibold text-clay-500 block mb-1.5">
              {isAr ? "الولاية" : "Wilaya (Province)"}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-400 rtl:left-auto rtl:right-3" />
              <select
                value={selectedWilaya}
                onChange={(e) => {
                  setSelectedWilaya(e.target.value);
                  setCalculated(null);
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-desert-300 bg-white text-sm text-clay-800 focus:border-sand-400 focus:ring-2 focus:ring-sand-100 outline-none appearance-none rtl:pl-4 rtl:pr-9"
              >
                <option value="">{isAr ? "-- اختر الولاية --" : "-- Select Wilaya --"}</option>
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {isAr ? `${w.code} - ${w.nameAr}` : `${w.code} - ${w.name}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="text-xs font-semibold text-clay-500 block mb-1.5">
              {isAr ? "المدينة / البلدية" : "City / Municipality"}
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={isAr ? "مثال: تيميمون" : "e.g. Timimoun"}
              className="w-full px-4 py-2.5 rounded-xl border border-desert-300 bg-white text-sm text-clay-800 placeholder:text-clay-400 focus:border-sand-400 focus:ring-2 focus:ring-sand-100 outline-none"
            />
          </div>

          {/* Free shipping note */}
          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <p className="text-xs text-oasis-700 bg-oasis-50 border border-oasis-100 rounded-lg px-3 py-2">
              {isAr
                ? `أضف ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} للحصول على توصيل مجاني! 🚀`
                : `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} for FREE shipping! 🚀`}
            </p>
          )}

          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            disabled={!selectedWilaya}
            className="w-full py-2.5 bg-gradient-to-r from-sand-500 to-sand-600 text-white text-sm font-semibold rounded-xl hover:from-sand-600 hover:to-sand-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isAr ? "احسب" : "Calculate"}
          </button>

          {/* Result */}
          {calculated && (
            <div
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold border",
                calculated.cost === 0
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-sand-50 border-sand-200 text-clay-800"
              )}
            >
              <span>
                {isAr ? `التوصيل إلى ${calculated.wilaya}` : `Shipping to ${calculated.wilaya}`}
              </span>
              <span>
                {calculated.cost === 0
                  ? isAr
                    ? "✅ مجاني"
                    : "✅ Free"
                  : formatPrice(calculated.cost)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   Coupon Widget
   ────────────────────────────────────────── */
function CouponField({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Demo: accept "GOURARA10" for 10% off
  function handleApply() {
    if (code.trim().toUpperCase() === "GOURARA10") {
      setApplied("GOURARA10");
      setError("");
    } else {
      setError(isAr ? "رمز الخصم غير صالح" : "Invalid coupon code");
    }
  }

  return (
    <div className="border border-desert-200 rounded-2xl overflow-hidden">
      <div className="px-4 py-3.5 bg-desert-50 flex items-center gap-2">
        <Tag className="w-4 h-4 text-sand-500" />
        <span className="text-sm font-semibold text-clay-700">
          {isAr ? "رمز الخصم" : "Coupon Code"}
        </span>
      </div>
      <div className="px-4 py-4 bg-white border-t border-desert-100">
        {applied ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <span className="text-sm font-bold text-green-700">
              🎉 {isAr ? `تم تطبيق كود "${applied}"` : `"${applied}" applied!`}
            </span>
            <button
              onClick={() => { setApplied(null); setCode(""); }}
              className="text-green-500 hover:text-green-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(""); }}
                placeholder={isAr ? "أدخل رمز الخصم" : "Enter coupon code"}
                className="flex-1 px-4 py-2.5 rounded-xl border border-desert-300 bg-white text-sm text-clay-800 placeholder:text-clay-400 focus:border-sand-400 focus:ring-2 focus:ring-sand-100 outline-none"
              />
              <button
                onClick={handleApply}
                disabled={!code.trim()}
                className="px-4 py-2.5 bg-clay-900 text-white text-sm font-semibold rounded-xl hover:bg-clay-800 transition-colors disabled:opacity-40"
              >
                {isAr ? "تطبيق" : "Apply"}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            <p className="text-xs text-clay-400 mt-2">
              {isAr ? "جرب: GOURARA10 للحصول على خصم 10%" : "Try: GOURARA10 for 10% off"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Main Cart Page
   ────────────────────────────────────────── */
export default function CartPage() {
  const t = useTranslations("cart");
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const { locale = "en" } = useParams<{ locale: string }>();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-desert-50 pt-24 pb-24 flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-desert-50 pt-24 pb-24 px-4">
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
            <div className="bg-white rounded-2xl border border-desert-200 p-6 sticky top-24 space-y-4">
              <h2 className="font-semibold text-clay-800 text-lg">{t("total")}</h2>

              <div className="space-y-3">
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

              {/* Shipping Calculator */}
              <ShippingCalculator locale={locale} subtotal={totalPrice()} />

              {/* Coupon */}
              <CouponField locale={locale} />

              <Link href={`/${locale}/checkout`}>
                <Button size="lg" className="w-full">{t("checkout")}</Button>
              </Link>
              <Link
                href={`/${locale}/products`}
                className="block text-center text-sm text-clay-400 hover:text-sand-600 mt-1 transition-colors"
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
