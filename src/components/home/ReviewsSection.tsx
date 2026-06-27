import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Star, MessageSquare, ExternalLink } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    product: {
      name: string;
      nameAr: string | null;
      slug: string;
      images: { url: string }[];
      artisan: {
        shopName: string;
        slug: string;
      };
    };
  };
  locale: string;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, locale }: ReviewCardProps) {
  const isAr = locale === "ar";
  const userName =
    review.user.firstName
      ? `${review.user.firstName} ${review.user.lastName ?? ""}`.trim()
      : review.user.email.split("@")[0];

  const initial = userName.charAt(0).toUpperCase();
  const productName =
    isAr && review.product.nameAr ? review.product.nameAr : review.product.name;

  const relativeTime = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return isAr ? "اليوم" : "Today";
    if (days === 1) return isAr ? "أمس" : "Yesterday";
    if (days < 7) return isAr ? `منذ ${days} أيام` : `${days} days ago`;
    if (days < 30) return isAr ? `منذ ${Math.floor(days / 7)} أسابيع` : `${Math.floor(days / 7)}w ago`;
    if (days < 365) return isAr ? `منذ ${Math.floor(days / 30)} شهور` : `${Math.floor(days / 30)}mo ago`;
    return isAr ? `منذ ${Math.floor(days / 365)} سنوات` : `${Math.floor(days / 365)}y ago`;
  };

  return (
    <div className="group bg-white rounded-2xl border border-desert-100 p-6 hover:border-sand-300 hover:shadow-xl transition-all duration-300 flex flex-col gap-4">
      {/* Product info */}
      <Link
        href={`/${locale}/products/${review.product.slug}`}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="w-14 h-14 rounded-xl bg-desert-50 overflow-hidden flex-shrink-0 border border-desert-100">
          {review.product.images[0] ? (
            <Image
              src={review.product.images[0].url}
              alt={productName}
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🏺</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-clay-800 text-sm truncate leading-snug">{productName}</p>
          <p className="text-xs text-clay-400 mt-0.5">
            {isAr ? "بقلم " : "by "}{review.product.artisan.shopName}
          </p>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-clay-300 group-hover:text-sand-500 flex-shrink-0 transition-colors" />
      </Link>

      {/* Rating */}
      <div className="flex items-center justify-between">
        <StarRow rating={review.rating} />
        <span className="text-xs text-clay-400">{relativeTime(review.createdAt)}</span>
      </div>

      {/* Comment */}
      {review.comment ? (
        <p className="text-sm text-clay-600 leading-relaxed line-clamp-3">{review.comment}</p>
      ) : (
        <p className="text-sm text-clay-400 italic flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          {isAr ? "لا يوجد تعليق" : "No comment provided"}
        </p>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-desert-50 mt-auto">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sand-400 to-oasis-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {initial}
        </div>
        <div>
          <p className="text-sm font-semibold text-clay-700">{userName}</p>
          <p className="text-xs text-clay-400">
            {isAr ? "عميل موثّق ✓" : "Verified Customer ✓"}
          </p>
        </div>
        <div className="ms-auto">
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              review.rating >= 4
                ? "bg-green-50 text-green-600"
                : review.rating === 3
                ? "bg-amber-50 text-amber-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {"⭐".repeat(review.rating)}
          </span>
        </div>
      </div>
    </div>
  );
}

async function getTopReviews() {
  try {
    return await prisma.review.findMany({
      where: { isVisible: true, rating: { gte: 4 }, comment: { not: null } },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        product: {
          select: {
            name: true,
            nameAr: true,
            slug: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true },
            },
            artisan: {
              select: { shopName: true, slug: true },
            },
          },
        },
      },
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      take: 6,
    });
  } catch {
    return [];
  }
}

interface ReviewsSectionProps {
  locale: string;
}

export async function ReviewsSection({ locale }: ReviewsSectionProps) {
  const reviews = await getTopReviews();
  const isAr = locale === "ar";

  if (reviews.length === 0) return null;

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="py-24 bg-desert-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-clay-800 font-display">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-clay-500 text-sm">
                ({reviews.length} {isAr ? "تقييم حديث" : "recent reviews"})
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-clay-800">
              {isAr ? "ما يقوله عملاؤنا" : "What Our Customers Say"}
            </h2>
            <p className="text-clay-500 mt-3 max-w-lg text-lg">
              {isAr
                ? "تقييمات حقيقية من عملاء حقيقيين — شفافية تامة"
                : "Real reviews from real customers — complete transparency"}
            </p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sand-500 hover:bg-sand-600 text-white font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-sand-500/30 text-sm whitespace-nowrap"
          >
            {isAr ? "تصفح المنتجات" : "Browse Products"}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review as any}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
