import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/session";

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

  // Filter based on query string
  let typeFilter: any = undefined;
  if (type === "accommodation") {
    typeFilter = { in: ["ROOM", "TENT", "GUEST_HOUSE"] };
  } else if (type === "tour") {
    typeFilter = "TOUR";
  }

  const services = await prisma.service.findMany({
    where: { 
      isPublished: true,
      ...(typeFilter ? { type: typeFilter } : {})
    },
    include: {
      provider: true,
      images: { where: { isPrimary: true }, take: 1 }
    },
    orderBy: { createdAt: "desc" }
  });

  const pageTitle = type === "accommodation" 
    ? (isAr ? "أماكن الإقامة السياحية" : "Accommodations & Stays")
    : type === "tour"
    ? (isAr ? "الجولات والتجارب" : "Tours & Experiences")
    : (isAr ? "جميع الخدمات السياحية" : "All Tourism Services");

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl font-bold text-clay-900 mb-4">{pageTitle}</h1>
            <p className="text-clay-500 max-w-2xl mx-auto">
              {isAr 
                ? "اكتشف أفضل الخيارات لإقامتك وتجاربك في واحة تيميمون الساحرة" 
                : "Discover the best options for your stay and experiences in the charming Timimoun Oasis"}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Link 
              href={`/${locale}/services`} 
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${!type ? 'bg-clay-900 text-white shadow-md' : 'bg-white text-clay-600 border border-clay-200 hover:bg-clay-50'}`}
            >
              {isAr ? "الكل" : "All"}
            </Link>
            <Link 
              href={`/${locale}/services?type=accommodation`} 
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${type === 'accommodation' ? 'bg-clay-900 text-white shadow-md' : 'bg-white text-clay-600 border border-clay-200 hover:bg-clay-50'}`}
            >
              {isAr ? "أماكن إقامة" : "Accommodations"}
            </Link>
            <Link 
              href={`/${locale}/services?type=tour`} 
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${type === 'tour' ? 'bg-clay-900 text-white shadow-md' : 'bg-white text-clay-600 border border-clay-200 hover:bg-clay-50'}`}
            >
              {isAr ? "جولات وتجارب" : "Tours"}
            </Link>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service: any) => (
                <Link href={`/${locale}/services/${service.slug}`} key={service.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-desert-100 hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/3] bg-desert-100 relative overflow-hidden">
                    {service.images[0] ? (
                      <Image src={service.images[0].url} alt={service.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        {service.type === "TOUR" ? "🐪" : "🏨"}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-clay-900 shadow-sm">
                      {service.price} DZD
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-clay-900 mb-1">{locale === "ar" && service.nameAr ? service.nameAr : service.name}</h3>
                    <p className="text-sm text-clay-500 flex items-center gap-1 mb-3">
                      <span className="text-oasis-600">📍</span> {service.provider.location || "Timimoun"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-sand-100 text-sand-700 px-2 py-1 rounded font-medium">{service.type}</span>
                      <span className="text-xs text-clay-500">
                        {isAr ? `يتسع لـ ${service.capacity}` : `Capacity: ${service.capacity}`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌵</div>
              <h3 className="text-xl font-bold text-clay-800 mb-2">
                {isAr ? "لا توجد خدمات متاحة حالياً" : "No services available currently"}
              </h3>
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
