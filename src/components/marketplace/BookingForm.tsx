"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export function BookingForm({
  serviceId,
  price,
  locale,
  isLoggedIn,
  serviceType,
}: {
  serviceId: string;
  price: number;
  locale: string;
  isLoggedIn: boolean;
  serviceType?: string;
}) {
  const isAr = locale === "ar";
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isAccommodation = ["ROOM", "GUEST_HOUSE", "TENT", "HOMESTAY"].includes(serviceType || "");
  
  let nights = 1;
  if (isAccommodation && startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime > 0) {
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  const estimatedTotal = price * guests * (isAccommodation ? Math.max(nights, 1) : 1);

  async function handleBook(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error(isAr ? "يرجى تسجيل الدخول للحجز" : "Please log in to book");
      // Optionally redirect to login here
      return;
    }

    setLoading(true);
    // TODO: In a real implementation, call a Server Action to create the Booking in DB
    // await createBookingAction(...)
    setTimeout(() => {
      setLoading(false);
      toast.success(
        isAr 
          ? "تم إرسال طلب الحجز بنجاح! سيقوم المزود بالتواصل معك." 
          : "Booking request sent successfully! The provider will contact you."
      );
    }, 1500);
  }

  return (
    <form onSubmit={handleBook} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-clay-600 block mb-1">
            {isAr ? "تاريخ البدء" : "Start Date"}
          </label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-desert-300 px-3 py-2 text-sm text-clay-800 focus:border-sand-500 focus:ring-2 focus:ring-sand-100 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-clay-600 block mb-1">
            {isAr ? "تاريخ الانتهاء" : "End Date"}
          </label>
          <input
            type="date"
            required
            min={startDate || new Date().toISOString().split('T')[0]}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-desert-300 px-3 py-2 text-sm text-clay-800 focus:border-sand-500 focus:ring-2 focus:ring-sand-100 outline-none"
          />
        </div>
      </div>
      
      <div>
        <label className="text-xs font-semibold text-clay-600 block mb-1">
          {isAr ? "عدد الأفراد" : "Guests"}
        </label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
          required
          className="w-full rounded-xl border border-desert-300 px-3 py-2 text-sm text-clay-800 focus:border-sand-500 focus:ring-2 focus:ring-sand-100 outline-none"
        />
      </div>

      <div className="flex items-center justify-between py-3 border-t border-desert-200 mt-2">
        <span className="font-semibold text-clay-700">
          {isAr ? "الإجمالي التقريبي" : "Estimated Total"}
          {isAccommodation && nights > 1 && (
            <span className="text-xs text-clay-400 font-normal block">
              ({nights} {isAr ? "ليالي" : "nights"} × {guests} {isAr ? "أشخاص" : "guests"})
            </span>
          )}
        </span>
        <span className="font-bold text-lg text-oasis-600">{estimatedTotal} DZD</span>
      </div>

      <Button
        type="submit"
        isLoading={loading}
        className="w-full bg-sand-600 hover:bg-sand-700 text-white"
      >
        {isAr ? "تأكيد طلب الحجز" : "Confirm Booking Request"}
      </Button>
      
      {!isLoggedIn && (
        <p className="text-xs text-center text-clay-500 mt-2">
          {isAr ? "يجب تسجيل الدخول لإتمام الحجز" : "You must log in to complete the booking"}
        </p>
      )}
    </form>
  );
}
