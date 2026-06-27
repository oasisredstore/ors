import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdBanner } from "@/components/shared/AdBanner";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/session";
import { Users } from "lucide-react";
import { serviceTypeLabel, serviceTypeEmoji } from "@/lib/utils";

export default async function ServicesListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  const { type } = await searchParams;
  const isAr = locale === "ar";

  const session = await getSession();
  const user = session ? { name: session.firstName ?? session.email.split("@")[0], role: session.role } : null;

  // Build type filter
  let typeFilter: { in?: string[]; equals?: string } | undefined = undefined;
  if (type === "accommodation") {
    typeFilter = { in: ["ROOM", "TENT", "HOMESTAY"] };
  } else if (type === "homestay") {
    typeFilter = { equals: "HOMESTAY" };
  } else if (type === "tour") {
    typeFilter = { equals: "TOUR" };
  } else if (type === "workshop") {
    typeFilter = { equals: "WORKSHOP" };
  } else if (type === "transport") {
    typeFilter = { equals: "TRANSPORT" };
  }

  const services = await prisma.service.findMany({
    where: {
      isPublished: true,
      ...(typeFilter ? { type: typeFilter as any } : {}),
    },
    include: {
      provider: true,
      images: { where: { isPrimary: true }, take: 1 },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const filterTabs = [
    { key: undefined, label: isAr ? "الكل" : "All" },
    { key: "accommodation", label: isAr ? "أماكن إقامة" : "Accommodations" },
    { key: "tour", label: isAr ? "جولات وتجارب" : "Tours" },
    { key: "workshop", label: isAr ? "ورشات تعليمية" : "Workshops" },
    { key: "homestay", label: isAr ? "إقامة لدى الساكنة" : "Homestays" },
    { key: "transport", label: isAr ? "النقل" : "Transport" },
  ];

  const pageTitle =
    type === "accommodation" ? (isAr ? "أماكن الإقامة السياحية" : "Accommodations & Stays") :
    type === "tour"          ? (isAr ? "الجولات والتجارب"       : "Tours & Experiences") :
    type === "workshop"      ? (isAr ? "الورشات التعليمية"       : "Educational Workshops") :
    type === "homestay"      ? (isAr ? "الإقامة في البيوت لدى الساكنة" : "Homestay Accommodations") :
    type === "transport"     ? (isAr ? "خدمات النقل"            : "Transport Services") :
                               (isAr ? "جميع الخدمات السياحية"   : "All Tourism Services");


  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50 pt-24 pb-20 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* AdBanner for services page */}
          <div className="mb-8">
            <AdBanner position="services" locale={locale} />
          </div>

          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl font-bold text-clay-900 mb-4">{pageTitle}</h1>
            <p className="text-clay-500 max-w-2xl mx-auto">
              {isAr
                ? "اكتشف أفضل الخيارات لإقامتك وتجاربك في واحة تيميمون الساحرة"
                : "Discover the best options for your stay and experiences in the charming Timimoun Oasis"}
            </p>
          </div>

          {/* Filter Tabs — desktop: centered wrap | mobile: horizontal scroll strip */}
          <div className="hidden sm:flex flex-wrap justify-center gap-2 mb-10">
            {filterTabs.map((tab) => (
              <Link
                key={tab.key ?? "all"}
                href={tab.key ? `/${locale}/services?type=${tab.key}` : `/${locale}/services`}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  type === tab.key
                    ? "bg-clay-900 text-white shadow-md"
                    : "bg-white text-clay-600 border border-clay-200 hover:bg-clay-50 hover:border-clay-300"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Mobile: single-row horizontal chip strip */}
          <div className="sm:hidden overflow-x-auto scrollbar-none -mx-4 px-4 mb-8">
            <div className="flex gap-2 pb-1 w-max">
              {filterTabs.map((tab) => (
                <Link
                  key={tab.key ?? "all"}
                  href={tab.key ? `/${locale}/services?type=${tab.key}` : `/${locale}/services`}
                  className={`flex items-center px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${
                    type === tab.key
                      ? "bg-clay-900 text-white border-clay-900 shadow-sm"
                      : "bg-white text-clay-700 border-desert-200"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {services.map((service: any) => {
                const avgRating = service.reviews.length > 0
                  ? service.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / service.reviews.length
                  : null;
                return (
                  <Link
                    href={`/${locale}/services/${service.slug}`}
                    key={service.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-desert-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] bg-desert-100 relative overflow-hidden">
                      {service.images[0] ? (
                        <Image
                          src={service.images[0].url}
                          alt={service.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                          {serviceTypeEmoji(service.type)}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-clay-900 shadow-sm">
                        {service.price} DZD
                      </div>
                      {avgRating && (
                        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white flex items-center gap-1">
                          ★ {avgRating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-clay-900 mb-1 line-clamp-1">
                        {isAr && service.nameAr ? service.nameAr : service.name}
                      </h3>
                      <p className="text-sm text-clay-500 flex items-center gap-1 mb-3">
                        <span className="text-oasis-600">📍</span>
                        {service.provider.location || "Timimoun"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-sand-100 text-sand-700 px-2 py-1 rounded font-medium">
                          {serviceTypeLabel(service.type, locale)}
                        </span>
                        <span className="text-xs text-clay-500 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {service.capacity}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌵</div>
              <h3 className="text-xl font-bold text-clay-800 mb-2">
                {isAr ? "لا توجد خدمات متاحة حالياً" : "No services available currently"}
              </h3>
              <p className="text-clay-500">
                {isAr ? "جرّب تصفحاً مختلفاً" : "Try a different filter"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
