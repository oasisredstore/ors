"use client";

import { useTransition } from "react";
import { confirmBookingAction, rejectBookingAction } from "@/actions/booking.actions";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface BookingActionButtonsProps {
  bookingId: string;
  locale: string;
}

export function BookingActionButtons({ bookingId, locale }: BookingActionButtonsProps) {
  const isAr = locale === "ar";
  const [isPendingConfirm, startConfirm] = useTransition();
  const [isPendingReject, startReject] = useTransition();

  function handleConfirm() {
    startConfirm(async () => {
      const result = await confirmBookingAction(bookingId);
      if (result.error) toast.error(result.error);
      else toast.success(isAr ? "تم قبول الحجز ✓" : "Booking confirmed ✓");
    });
  }

  function handleReject() {
    startReject(async () => {
      const result = await rejectBookingAction(bookingId);
      if (result.error) toast.error(result.error);
      else toast.success(isAr ? "تم رفض الحجز" : "Booking rejected");
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={handleConfirm}
        disabled={isPendingConfirm || isPendingReject}
        className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors text-xs font-semibold disabled:opacity-50"
        id={`confirm-booking-${bookingId}`}
      >
        {isPendingConfirm ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5" />
        )}
        {isAr ? "قبول" : "Accept"}
      </button>
      <button
        onClick={handleReject}
        disabled={isPendingConfirm || isPendingReject}
        className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold disabled:opacity-50"
        id={`reject-booking-${bookingId}`}
      >
        {isPendingReject ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <XCircle className="w-3.5 h-3.5" />
        )}
        {isAr ? "رفض" : "Reject"}
      </button>
    </div>
  );
}
