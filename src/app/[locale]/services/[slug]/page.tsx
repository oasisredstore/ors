import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import { Calendar, Users, MapPin, CheckCircle, Star } from "lucide-react";
import { BookingForm } from "@/components/marketplace/BookingForm";
import { WriteServiceReviewForm } from "@/components/marketplace/WriteServiceReviewForm";
import { ContactProviderButton } from "@/components/shared/ContactProviderButton";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const session = await getSession();
  const user = session ? { name: session.firstName ?? session.email.split("@")[0], role: session.role } : null;
  const isAr = locale === "ar";

  const service = await prisma.service.findUnique({
    where: { slug, isPublished: true },
    include: {
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
      provider: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          description: true,
          descriptionAr: true,
          avatarUrl: true,
          location: true,
          contactPhone: true,
          contactEmail: true,
        },
      },
      reviews: {
        where: { isVisible: true },
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!service) notFound();

  // Check if current user already reviewed this service
  let existingReview: { rating: number; comment: string | null } | null = null;
  if (session?.role === "CUSTOMER") {
    existingReview = await prisma.serviceReview.findUnique({
      where: { userId_serviceId: { userId: session.userId, serviceId: service.id } },
      select: { rating: true, comment: true },
    });
  }

  const canReview = session?.role === "CUSTOMER";

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-clay-400 mb-8" dir={isAr ? "rtl" : "ltr"}>
            <a href={`/${locale}`} className="hover:text-sand-600">
              {isAr ? "الرئيسية" : "Home"}
            </a>
            {" / "}
            <span className="text-clay-700">
              {isAr && service.nameAr ? service.nameAr : service.name}
            </span>
          </nav>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-desert-200" dir={isAr ? "rtl" : "ltr"}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Gallery */}
              <div className="relative aspect-square lg:aspect-auto lg:h-full bg-desert-100">
                {service.images[0] ? (
                  <Image
                    src={service.images[0].url}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    {service.type === "TOUR" ? "🐪" : "🏨"}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-oasis-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  {service.type}
                </div>
              </div>

              {/* Service Details & Booking */}
              <div className="p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <h1 className="font-display text-4xl font-bold text-clay-900 mb-4">
                    {isAr && service.nameAr ? service.nameAr : service.name}
                  </h1>
                  
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-desert-100">
                    <div className="flex flex-col">
                      <span className="text-sm text-clay-500">{isAr ? "السعر" : "Price"}</span>
                      <span className="text-2xl font-bold text-oasis-600">{service.price} DZD</span>
                    </div>
                    <div className="w-px h-10 bg-desert-200"></div>
                    <div className="flex flex-col">
                      <span className="text-sm text-clay-500">{isAr ? "المزود" : "Provider"}</span>
                      <span className="font-semibold text-clay-800">{service.provider.businessName}</span>
                    </div>
                  </div>

                  <p className="text-clay-600 leading-relaxed mb-8">
                    {isAr && service.descriptionAr ? service.descriptionAr : service.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="flex items-center gap-3 text-clay-700 bg-desert-50 p-3 rounded-xl border border-desert-100">
                      <Users className="w-5 h-5 text-oasis-600" />
                      <span className="text-sm font-medium">
                        {service.type === "ROOM" || service.type === "TENT"
                          ? (isAr ? `${service.capacity} سرير` : `${service.capacity} Beds`)
                          : (isAr ? `تتسع لـ ${service.capacity} أشخاص` : `Capacity: ${service.capacity} persons`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-clay-700 bg-desert-50 p-3 rounded-xl border border-desert-100">
                      <MapPin className="w-5 h-5 text-oasis-600" />
                      <span className="text-sm font-medium">
                        {service.provider.location || "Timimoun"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact + Booking */}
                <div className="space-y-4">
                  {/* Contact Provider Button */}
                  {/* Provider Info Card */}
                  <div className="bg-white p-6 rounded-2xl border border-desert-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      {service.provider.avatarUrl ? (
                        <Image src={service.provider.avatarUrl} alt={service.provider.businessName} width={60} height={60} className="rounded-full object-cover" />
                      ) : (
                        <div className="w-14 h-14 bg-desert-100 rounded-full flex items-center justify-center text-xl">👤</div>
                      )}
                      <div>
                        <h3 className="font-bold text-clay-900">{service.provider.businessName}</h3>
                        <p className="text-sm text-clay-500">{service.provider.location || "Timimoun"}</p>
                      </div>
                    </div>
                    {(service.provider.description || service.provider.descriptionAr) && (
                      <p className="text-sm text-clay-600 mb-4 pb-4 border-b border-desert-100">
                        {isAr && service.provider.descriptionAr ? service.provider.descriptionAr : service.provider.description}
                      </p>
                    )}
                    <div className="space-y-2 mb-4">
                      {service.provider.contactPhone && (
                        <div className="flex items-center gap-2 text-sm text-clay-700">
                          <span>📞</span> <a href={`tel:${service.provider.contactPhone.replace(/\s+/g, '')}`} className="hover:text-oasis-600 hover:underline">{service.provider.contactPhone}</a>
                        </div>
                      )}
                      {service.provider.contactEmail && (
                        <div className="flex items-center gap-2 text-sm text-clay-700">
                          <span>✉️</span> <a href={`mailto:${service.provider.contactEmail}`} className="hover:text-oasis-600 hover:underline">{service.provider.contactEmail}</a>
                        </div>
                      )}
                    </div>
                    {session ? (
                      <ContactProviderButton
                        providerId={service.provider.id}
                        artisanId={undefined}
                        name={service.provider.businessName}
                        locale={locale}
                      />
                    ) : (
                      <a
                        href={`/${locale}/auth/login`}
                        className="block w-full text-center bg-desert-100 text-clay-600 py-2 rounded-xl text-sm font-semibold hover:bg-desert-200"
                      >
                        {isAr ? "سجل الدخول للمراسلة" : "Login to message"}
                      </a>
                    )}
                  </div>
                  {/* Booking Form Component */}
                  <div className="bg-sand-50 p-6 rounded-2xl border border-sand-200">
                    <h3 className="font-bold text-clay-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-sand-600" />
                      {isAr ? "حجز الخدمة" : "Book this service"}
                    </h3>
                    <BookingForm serviceId={service.id} price={service.price} serviceType={service.type} locale={locale} isLoggedIn={!!session} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="mt-16 pt-12 border-t border-desert-200" dir={isAr ? "rtl" : "ltr"}>
            <h2 className="font-display text-2xl font-bold text-clay-800 mb-6">
              {isAr ? "التقييمات" : "Reviews"} ({service.reviews.length})
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reviews list */}
              <div className="lg:col-span-2">
                {service.reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.reviews.map((review, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-desert-200 p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-clay-800 text-sm">
                            {review.user.firstName} {review.user.lastName}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <span key={j} className={`text-sm ${j < review.rating ? "text-amber-400" : "text-clay-200"}`}>★</span>
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-clay-600 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-desert-200 p-10 text-center">
                    <p className="text-4xl mb-3">⭐</p>
                    <p className="text-clay-500 font-medium">
                      {isAr ? "لا توجد تقييمات بعد. كن أول من يقيّم!" : "No reviews yet. Be the first to review!"}
                    </p>
                  </div>
                )}
              </div>

              {/* Write review form or CTA */}
              <div className="lg:col-span-1">
                {canReview ? (
                  <WriteServiceReviewForm
                    serviceId={service.id}
                    serviceSlug={service.slug}
                    locale={locale}
                    existingRating={existingReview?.rating}
                    existingComment={existingReview?.comment}
                  />
                ) : !session ? (
                  <div className="bg-desert-50 rounded-2xl border border-desert-200 p-6 text-center">
                    <p className="text-2xl mb-3">✍️</p>
                    <p className="text-sm text-clay-600 mb-4">
                      {isAr ? "سجّل دخولك لمشاركة تقييمك" : "Sign in to share your review"}
                    </p>
                    <a
                      href={`/${locale}/auth/login`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-sand-500 to-sand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-sand-600 hover:to-sand-700 transition-all"
                    >
                      {isAr ? "تسجيل الدخول" : "Sign In"}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
