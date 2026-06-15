"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { submitServiceReviewAction } from "@/actions/service.actions";
import toast from "react-hot-toast";

interface WriteServiceReviewFormProps {
  serviceId: string;
  serviceSlug: string;
  locale: string;
  existingRating?: number;
  existingComment?: string | null;
}

export function WriteServiceReviewForm({
  serviceId,
  serviceSlug,
  locale,
  existingRating,
  existingComment,
}: WriteServiceReviewFormProps) {
  const isAr = locale === "ar";
  const [rating, setRating] = useState(existingRating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      toast.error(isAr ? "يرجى اختيار تقييم" : "Please select a rating");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("rating", String(rating));

    startTransition(async () => {
      const result = await submitServiceReviewAction(serviceId, serviceSlug, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(isAr ? "شكراً! تم نشر تقييمك." : "Thank you! Your review has been posted.");
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
        <p className="text-2xl mb-2">🎉</p>
        <p className="font-semibold text-green-800 text-sm">
          {isAr ? "تم نشر تقييمك بنجاح!" : "Your review has been published!"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-desert-200 p-6">
      <h3 className={`font-semibold text-clay-800 mb-4 ${isAr ? "text-right" : ""}`}>
        {existingRating
          ? (isAr ? "تعديل تقييمك" : "Edit Your Review")
          : (isAr ? "أضف تقييمك" : "Write a Review")}
      </h3>

      <form onSubmit={handleSubmit} dir={isAr ? "rtl" : "ltr"}>
        {/* Star Rating Picker */}
        <div className={`flex items-center gap-1.5 mb-4 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
          <span className="text-sm text-clay-500 mr-2">
            {isAr ? "التقييم:" : "Rating:"}
          </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-125 focus:outline-none"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= (hovered || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-clay-200"
                }`}
              />
            </button>
          ))}
          {(hovered || rating) > 0 && (
            <span className="text-sm text-clay-500 ml-2">
              {["", isAr ? "ضعيف" : "Poor", isAr ? "مقبول" : "Fair", isAr ? "جيد" : "Good", isAr ? "جيد جداً" : "Very Good", isAr ? "ممتاز" : "Excellent"][hovered || rating]}
            </span>
          )}
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className={`block text-sm font-medium text-clay-700 mb-2 ${isAr ? "text-right" : ""}`}>
            {isAr ? "تعليق (اختياري)" : "Comment (optional)"}
          </label>
          <textarea
            name="comment"
            defaultValue={existingComment ?? ""}
            rows={3}
            maxLength={1000}
            placeholder={isAr ? "شاركنا تجربتك مع هذه الخدمة..." : "Share your experience with this service..."}
            className={`w-full rounded-xl border border-desert-300 px-4 py-3 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 resize-none text-sm ${isAr ? "text-right" : ""}`}
          />
        </div>

        <button
          type="submit"
          disabled={isPending || rating === 0}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-sand-500 to-sand-600 text-white font-semibold text-sm hover:from-sand-600 hover:to-sand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? (isAr ? "جارٍ الإرسال..." : "Submitting...")
            : (isAr ? "نشر التقييم" : "Post Review")}
        </button>
      </form>
    </div>
  );
}
