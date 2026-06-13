"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { createOrderAction, saveAddressAction } from "@/actions/order.actions";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MapPin, CreditCard, Banknote } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations("checkout");
  const { locale = "en" } = useParams<{ locale: string }>();
  const { items, totalPrice, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<"CASH_ON_DELIVERY" | "BANK_TRANSFER">("CASH_ON_DELIVERY");
  const [loading, setLoading] = useState(false);
  const [addressId, setAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 && !loading) {
      router.push(`/${locale}/products`);
    }
  }, [items, locale, router, loading]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      // Save address first
      const addrResult = await saveAddressAction(formData);
      if (!addrResult.success || !addrResult.addressId) {
        toast.error("Failed to save address");
        setLoading(false);
        return;
      }

      // Create order form data
      const orderFormData = new FormData();
      orderFormData.set("addressId", addrResult.addressId);
      orderFormData.set("paymentMethod", paymentMethod);
      orderFormData.set("notes", formData.get("notes") as string || "");

      const result = await createOrderAction(items, orderFormData);
      if (result.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }

      clearCart();
      router.push(`/${locale}/order-confirmed/${result.orderId}`);
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-desert-50 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-clay-800 mb-8">{t("title")}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Delivery + Payment */}
            <div className="lg:col-span-3 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-2xl border border-desert-200 p-6">
                <h2 className="font-semibold text-clay-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-sand-500" />
                  {t("delivery")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="fullName" name="fullName" label="Full Name" required />
                  <Input id="phone" name="phone" type="tel" label="Phone" required />
                  <Input id="wilaya" name="wilaya" label="Wilaya" placeholder="Adrar" required />
                  <Input id="city" name="city" label="City" placeholder="Timimoun" required />
                  <div className="sm:col-span-2">
                    <Input id="street" name="street" label="Street Address" required />
                  </div>
                  <Input id="postalCode" name="postalCode" label="Postal Code" />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-desert-200 p-6">
                <h2 className="font-semibold text-clay-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-sand-500" />
                  {t("payment")}
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      value: "CASH_ON_DELIVERY" as const,
                      label: t("cod"),
                      desc: t("codDesc"),
                      icon: Banknote,
                    },
                    {
                      value: "BANK_TRANSFER" as const,
                      label: t("bankTransfer"),
                      desc: t("bankDesc"),
                      icon: CreditCard,
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === opt.value
                          ? "border-sand-400 bg-sand-50"
                          : "border-desert-200 hover:border-sand-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentRadio"
                        value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)}
                        className="mt-1"
                      />
                      <opt.icon className="w-5 h-5 text-sand-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-clay-800 text-sm">{opt.label}</p>
                        <p className="text-xs text-clay-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-desert-200 p-6">
                <label className="text-sm font-medium text-clay-700 block mb-2">
                  {t("notes")}
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full rounded-xl border border-desert-300 px-4 py-3 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 resize-none"
                  placeholder="Special instructions, delivery notes..."
                />
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-desert-200 p-6 sticky top-24">
                <h2 className="font-semibold text-clay-800 mb-4">{t("summary")}</h2>

                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-desert-100 rounded-lg overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-lg">🏺</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-clay-700 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-clay-400">× {item.quantity}</p>
                      </div>
                      <p className="text-xs font-semibold text-clay-800 shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <hr className="border-desert-200 mb-4" />
                <div className="flex justify-between font-bold text-clay-800 text-lg mb-6">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice())}</span>
                </div>

                <Button type="submit" size="lg" isLoading={loading} className="w-full">
                  {t("placeOrder")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
