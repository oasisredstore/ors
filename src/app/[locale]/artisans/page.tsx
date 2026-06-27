import { prisma } from "@/lib/prisma";

import { getSession } from "@/lib/session";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Package, SlidersHorizontal, UserCircle2 } from "lucide-react";

interface ArtisansPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; q?: string }>;
}

export async function generateMetadata({ params }: ArtisansPageProps) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "شركاؤنا — قورارة للحرف" : "Our Partners — Gourara Crafts",
    description: "Meet the talented local partners from Timimoun, including artisans, guides, and tourism agencies.",
  };
}

export default async function ArtisansPage({ params, searchParams }: ArtisansPageProps) {
  const { locale } = await params;
  const { type, q } = await searchParams;
  const session = await getSession();
  const user = session ? { name: session.firstName ?? session.email.split("@")[0], role: session.role } : null;

  const artisans = await prisma.artisan.findMany({
    where: { isApproved: true, isActive: true },
    include: {
      user: { select: { firstName: true, lastName: true } },
      _count: { select: { products: { where: { isPublished: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  const providers = await prisma.serviceProvider.findMany({
    where: { isApproved: true, isActive: true },
    include: {
      user: { select: { firstName: true, lastName: true, role: true } },
      _count: { select: { services: { where: { isPublished: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Normalize into a single Partners array
  let partners = [
    ...artisans.map(a => ({
      id: a.id,
      name: a.shopName,
      slug: a.slug,
      type: locale === "ar" ? "حرفي / صانع تقليدي" : "Artisan",
      rawType: "ARTISAN",
      location: a.location,
      bio: a.bio,
      avatarUrl: a.avatarUrl,
      coverUrl: a.coverUrl,
      itemsCount: a._count.products,
      itemsLabel: locale === "ar" ? "منتج" : "products",
    })),
    ...providers.map(p => {
      let typeLabel = "مزود خدمة";
      if (locale === "ar") {
        if (p.user.role === "HOTEL") typeLabel = "فندق";
        if (p.user.role === "GUEST_HOUSE") typeLabel = "دار ضيافة";
        if (p.user.role === "GUIDE") typeLabel = "مرشد سياحي";
        if (p.user.role === "AGENCY") typeLabel = "وكالة سياحية";
        if ((p.user.role as string) === "TRANSPORT") typeLabel = "نقل";
      } else {
        if (p.user.role === "HOTEL") typeLabel = "Hotel";
        if (p.user.role === "GUEST_HOUSE") typeLabel = "Guest House";
        if (p.user.role === "GUIDE") typeLabel = "Tour Guide";
        if (p.user.role === "AGENCY") typeLabel = "Tourism Agency";
        if ((p.user.role as string) === "TRANSPORT") typeLabel = "Transport";
      }
      return {
        id: p.id,
        name: p.businessName,
        slug: p.slug,
        type: typeLabel,
        rawType: p.user.role,
        location: p.location,
        bio: p.description,
        avatarUrl: p.avatarUrl,
        coverUrl: null,
        itemsCount: p._count.services,
        itemsLabel: locale === "ar" ? "خدمة" : "services",
      };
    })
  ].sort((a, b) => a.name.localeCompare(b.name));

  // Apply filters
  if (type && type !== "ALL") {
    partners = partners.filter(p => p.rawType === type || (type === 'ACCOMMODATION' && (p.rawType === 'HOTEL' || p.rawType === 'GUEST_HOUSE')));
  }

  if (q) {
    const searchLower = q.toLowerCase();
    partners = partners.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      (p.bio && p.bio.toLowerCase().includes(searchLower)) ||
      (p.location && p.location.toLowerCase().includes(searchLower))
    );
  }

  const partnerTypes = [
    { value: "ALL", labelAr: "الكل", labelEn: "All" },
    { value: "ARTISAN", labelAr: "حرفيون", labelEn: "Artisans" },
    { value: "ACCOMMODATION", labelAr: "إقامات وفنادق", labelEn: "Accommodations" },
    { value: "GUIDE", labelAr: "مرشدون", labelEn: "Guides" },
    { value: "AGENCY", labelAr: "وكالات سياحية", labelEn: "Agencies" },
    { value: "TRANSPORT", labelAr: "نقل سياحي", labelEn: "Transport" },
  ];

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-display text-5xl font-bold text-clay-800 mb-4">
              {locale === "ar" ? "دليل الشركاء" : "Partners Directory"}
            </h1>
            <p className="text-clay-500 max-w-xl mx-auto text-lg mb-8" dir="auto">
              {locale === "ar"
                ? "دليلك الشامل للتعرف على شركائنا المحليين في تيميمون، من حرفيين، مرشدين، وأصحاب فنادق ودور ضيافة"
                : "Your comprehensive guide to local partners in Timimoun, from artisans to guides and hoteliers"}
            </p>

            {/* Search & Filter Bar */}
            <form className="max-w-4xl mx-auto bg-white p-3 rounded-2xl shadow-sm border border-desert-200 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-clay-400" />
                </div>
                <input
                  type="text"
                  name="q"
                  defaultValue={q || ""}
                  placeholder={locale === "ar" ? "ابحث عن شريك، فندق، أو حرفي..." : "Search for a partner..."}
                  className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-desert-50 text-clay-800 placeholder-clay-400 focus:ring-2 focus:ring-sand-500 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <select
                  name="type"
                  defaultValue={type || "ALL"}
                  className="block w-full sm:w-48 pl-3 pr-10 py-3 text-clay-700 bg-desert-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-sand-500 appearance-none font-medium cursor-pointer"
                >
                  {partnerTypes.map(pt => (
                    <option key={pt.value} value={pt.value}>
                      {locale === "ar" ? pt.labelAr : pt.labelEn}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-sand-600 hover:bg-sand-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  {locale === "ar" ? "بحث" : "Search"}
                </button>
              </div>
            </form>
          </div>

          {/* ── Mobile: horizontal type chip strip ── */}
          <div className="lg:hidden mb-6 overflow-x-auto scrollbar-none -mx-4 px-4">
            <div className="flex gap-2 pb-1 w-max">
              {partnerTypes.map(pt => (
                <a
                  key={pt.value}
                  href={`/${locale}/artisans?type=${pt.value}${q ? `&q=${q}` : ""}`}
                  className={`flex items-center px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${
                    (type || "ALL") === pt.value
                      ? "bg-clay-900 text-white border-clay-900 shadow-sm"
                      : "bg-white text-clay-700 border-desert-200"
                  }`}
                >
                  {locale === "ar" ? pt.labelAr : pt.labelEn}
                </a>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {partners.map((partner) => (
              <Link
                key={partner.id}
                href={`/${locale}/artisans/${partner.slug}`}
                className="group bg-white rounded-3xl border border-desert-200 overflow-hidden hover:border-sand-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Cover */}
                <div className="h-28 bg-gradient-to-br from-sand-200 via-desert-200 to-oasis-100 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id={`pattern-${partner.id}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                          <polygon points="15,2 28,8 28,22 15,28 2,22 2,8" fill="none" stroke="#c8965a" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#pattern-${partner.id})`} />
                    </svg>
                  </div>
                  {partner.coverUrl && (
                    <img src={partner.coverUrl} alt="" className="object-cover w-full h-full" />
                  )}
                </div>

                <div className="px-5 pb-5">
                  {/* Avatar */}
                  <div className="relative -mt-10 mb-3">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sand-400 to-clay-700 flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg border-4 border-white overflow-hidden">
                      {partner.avatarUrl ? (
                        <img src={partner.avatarUrl} alt={partner.name} width={80} height={80} className="object-cover rounded-2xl border-4 border-white" />
                      ) : (
                        <span className="drop-shadow-sm">{partner.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </div>

                  <h2 className="font-display text-lg font-bold text-clay-800 group-hover:text-sand-600 transition-colors leading-tight">
                    {partner.name}
                  </h2>

                  <p className="text-xs text-oasis-600 font-medium mt-1">{partner.type}</p>

                  <div className="flex items-center gap-1 mt-2 text-xs text-clay-400">
                    <MapPin className="w-3 h-3" />
                    {partner.location || "Timimoun, Algeria"}
                  </div>

                  {partner.bio && (
                    <p className="text-xs text-clay-500 mt-3 line-clamp-2 leading-relaxed" dir="auto">
                      {partner.bio}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-sand-600">
                    <Package className="w-3.5 h-3.5" />
                    {partner.itemsCount} {partner.itemsLabel}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {partners.length === 0 && (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🤝</p>
              <p className="text-clay-400">
                {locale === "ar" ? "لا يوجد شركاء بعد" : "No partners yet. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
