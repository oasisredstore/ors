import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrustBar } from "@/components/layout/TrustBar";
import { HeroSection } from "@/components/home/HeroSection";
import { SplashIntro } from "@/components/home/SplashIntro";
import { VirtualMuseumSection } from "@/components/home/VirtualMuseumSection";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { AdBanner } from "@/components/shared/AdBanner";
import { Leaf, Globe, Heart, Award, UsersIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HomePageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

async function getFeaturedData() {
  const [products, categories, artisans, accommodations, tours] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        artisan: true,
        category: true,
        reviews: { select: { rating: true } },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.artisan.findMany({
      where: { isApproved: true, isActive: true },
      select: {
        id: true,
        shopName: true,
        slug: true,
        avatarUrl: true,
        location: true,
        specialization: true,
      },
      take: 4,
    }),
    prisma.service.findMany({
      where: { isPublished: true, type: { in: ["ROOM", "TENT"] } },
      include: {
        provider: true,
        images: { where: { isPrimary: true }, take: 1 }
      },
      take: 4,
    }),
    prisma.service.findMany({
      where: { isPublished: true, type: "TOUR" },
      include: {
        provider: true,
        images: { where: { isPrimary: true }, take: 1 }
      },
      take: 4,
    }),
  ]);

  return { products, categories, artisans, accommodations, tours };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const tWhy = await getTranslations("home.why");
  const session = await getSession();

  const { products, categories, artisans, accommodations, tours } = await getFeaturedData();

  const user = session
    ? {
        name: session.firstName ?? session.email.split("@")[0],
        role: session.role,
      }
    : null;

  const whyItems = [
    {
      icon: Award,
      title: tWhy("authentic.title"),
      desc: tWhy("authentic.desc"),
    },
    {
      icon: Globe,
      title: tWhy("heritage.title"),
      desc: tWhy("heritage.desc"),
    },
    {
      icon: Heart,
      title: tWhy("impact.title"),
      desc: tWhy("impact.desc"),
    },
    {
      icon: Leaf,
      title: tWhy("quality.title"),
      desc: tWhy("quality.desc"),
    },
  ];

  return (
    <>
      <SplashIntro />
      <Navbar locale={locale} user={user} transparentOnTop={true} />
      {/* Trust/value proposition bar */}
      <div className="pt-16 lg:pt-20">
        <TrustBar locale={locale} />
      </div>

      <main>
        {/* Hero */}
        <HeroSection locale={locale} />

        {/* Homepage Ad Banner */}
        <section className="py-4 bg-white px-4">
          <div className="max-w-7xl mx-auto">
            <AdBanner position="homepage" locale={locale} />
          </div>
        </section>

        {/* 1. Premium Accommodations Section (BMC Priority) */}
        {accommodations.length > 0 && (
          <section className="py-24 bg-clay-900 relative overflow-hidden">
            {/* Subtle luxury background glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-sand-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                    {locale === "ar" ? "أماكن إقامة ساحرة" : "Charming Stays"}
                  </h2>
                  <p className="text-clay-300 max-w-xl text-lg">
                    {locale === "ar" 
                      ? "اكتشف الفخامة في قلب الصحراء. احجز إقامتك في أجمل الفنادق والبيوت التقليدية في تيميمون." 
                      : "Discover luxury in the heart of the desert. Book your stay in the most beautiful hotels and traditional houses in Timimoun."}
                  </p>
                </div>
                <Link
                  href={`/${locale}/services?type=accommodation`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sand-600 hover:bg-sand-500 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-sand-500/30 text-sm whitespace-nowrap"
                >
                  {locale === "ar" ? "استعرض جميع الإقامات ←" : "Explore All Stays →"}
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {accommodations.map((stay: any) => (
                  <Link 
                    href={`/${locale}/services/${stay.slug}`} 
                    key={stay.id} 
                    className="group relative bg-clay-800 rounded-3xl overflow-hidden shadow-xl border border-clay-700 hover:border-sand-500/50 hover:shadow-2xl hover:shadow-sand-900/40 transition-all duration-500"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden">
                      {stay.images[0] ? (
                        <Image 
                          src={stay.images[0].url} 
                          alt={stay.name} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="absolute inset-0 bg-clay-800 flex items-center justify-center text-5xl">🏨</div>
                      )}
                      {/* Gradient Overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-clay-900 via-clay-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                      
                      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-sand-300 border border-sand-500/30">
                        {stay.price} DZD / {locale === "ar" ? "ليلة" : "Night"}
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-display text-xl font-bold text-white mb-2 leading-tight">
                          {locale === "ar" && stay.nameAr ? stay.nameAr : stay.name}
                        </h3>
                        <p className="text-sm text-clay-300 flex items-center gap-2">
                          <span className="text-sand-500">📍</span> {stay.provider.location || "Timimoun"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 2. Premium Tours Section (BMC Priority) */}
        {tours.length > 0 && (
          <section className="py-24 bg-desert-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-clay-900 mb-4">
                    {locale === "ar" ? "تجارب لا تُنسى" : "Unforgettable Experiences"}
                  </h2>
                  <p className="text-clay-500 max-w-xl text-lg">
                    {locale === "ar" 
                      ? "استكشف سحر الكثبان الرملية وعمق الثقافة مع أمهر المرشدين المحليين في واحة قورارة." 
                      : "Explore the magic of the dunes and the depth of culture with the most skilled local guides in the Gourara oasis."}
                  </p>
                </div>
                <Link
                  href={`/${locale}/services?type=tour`}
                  className="inline-flex items-center gap-2 text-oasis-700 font-bold hover:text-oasis-800 transition-colors text-sm uppercase tracking-wider"
                >
                  {locale === "ar" ? "كل الجولات ←" : "All Tours →"}
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tours.map((tour: any) => (
                  <Link 
                    href={`/${locale}/services/${tour.slug}`} 
                    key={tour.id} 
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-desert-100"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      {tour.images[0] ? (
                        <Image 
                          src={tour.images[0].url} 
                          alt={tour.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="absolute inset-0 bg-desert-100 flex items-center justify-center text-4xl">🐪</div>
                      )}
                      <div className="absolute top-4 left-4 bg-oasis-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-md">
                        {locale === "ar" ? "جولة إرشادية" : "Guided Tour"}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display font-bold text-lg text-clay-900 mb-4 line-clamp-2">
                        {locale === "ar" && tour.nameAr ? tour.nameAr : tour.name}
                      </h3>
                      <div className="flex items-center justify-between pt-4 border-t border-desert-100">
                        <span className="font-bold text-oasis-700 text-lg">{tour.price} DZD</span>
                        <div className="flex items-center gap-1 text-xs font-medium text-clay-500 bg-desert-50 px-2 py-1 rounded-md">
                          <UsersIcon className="w-3.5 h-3.5" />
                          <span>{tour.capacity} {locale === "ar" ? "أشخاص" : "Persons"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. Categories Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-clay-800 mb-3">
                {t("categories.title")}
              </h2>
              <p className="text-clay-500 max-w-xl mx-auto">{t("categories.subtitle")}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.length > 0
                ? categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/${locale}/products?category=${cat.slug}`}
                      className="group flex flex-col items-center gap-3 p-5 bg-desert-50 rounded-2xl border border-desert-100 hover:border-sand-400 hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-14 h-14 rounded-full bg-white group-hover:bg-sand-100 flex items-center justify-center text-2xl transition-colors shadow-sm">
                        {cat.imageUrl && (cat.imageUrl.startsWith("http") || cat.imageUrl.startsWith("/")) ? (
                          <Image
                            src={cat.imageUrl}
                            alt={cat.name}
                            width={56}
                            height={56}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">{cat.imageUrl || "🏺"}</span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-clay-700 group-hover:text-sand-600 text-center transition-colors">
                        {locale === "ar" ? cat.nameAr : cat.name}
                      </span>
                    </Link>
                  ))
                : Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton h-28 rounded-2xl" />
                  ))}
            </div>
          </div>
        </section>

        {/* 4. Virtual Museum Section */}
        <VirtualMuseumSection locale={locale} />

        {/* 5. Featured Products */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-display text-4xl font-bold text-clay-800 mb-3">
                  {t("featured.title")}
                </h2>
                <p className="text-clay-500 max-w-xl">{t("featured.subtitle")}</p>
              </div>
              <Link
                href={`/${locale}/products`}
                className="hidden sm:inline-flex items-center gap-2 text-sand-600 font-semibold hover:text-sand-700 transition-colors text-sm"
              >
                View All →
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const avgRating =
                    product.reviews.length > 0
                      ? product.reviews.reduce((a, r) => a + r.rating, 0) /
                        product.reviews.length
                      : undefined;

                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      nameAr={product.nameAr}
                      imageUrl={product.images[0]?.url}
                      artisanName={product.artisan.shopName}
                      artisanSlug={product.artisan.slug}
                      categoryName={product.category.name}
                      categoryNameAr={product.category.nameAr}
                      rating={avgRating}
                      reviewCount={product.reviews.length}
                      locale={locale}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-clay-400">
                <p className="text-6xl mb-4">🏺</p>
                <p>Products coming soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* 6. Artisans Section */}
        {artisans.length > 0 && (
          <section className="py-20 bg-desert-gradient">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-display text-4xl font-bold text-clay-800 mb-3">
                  {t("artisans.title")}
                </h2>
                <p className="text-clay-500">{t("artisans.subtitle")}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {artisans.map((artisan) => (
                  <Link
                    key={artisan.id}
                    href={`/${locale}/artisans/${artisan.slug}`}
                    className="group bg-white rounded-3xl p-6 text-center border border-desert-200 hover:border-sand-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sand-300 to-oasis-400 flex items-center justify-center mx-auto mb-4 text-3xl text-white font-bold group-hover:scale-105 transition-transform overflow-hidden">
                      {artisan.avatarUrl ? (
                        <Image
                          src={artisan.avatarUrl}
                          alt={artisan.shopName}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      ) : (
                        artisan.shopName.charAt(0)
                      )}
                    </div>
                    <h3 className="font-semibold text-clay-800 group-hover:text-sand-600 transition-colors">
                      {artisan.shopName}
                    </h3>
                    <p className="text-sm text-clay-400 mt-1">{artisan.location || "Timimoun"}</p>
                    {artisan.specialization && (
                      <p className="text-xs text-oasis-600 mt-2 font-medium">
                        {artisan.specialization}
                      </p>
                    )}
                  </Link>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  href={`/${locale}/artisans`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-sand-500 to-sand-600 text-white font-semibold px-8 py-3.5 rounded-full hover:shadow-lg transition-all"
                >
                  {t("artisans.viewAll")}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 7. Why Section */}
        <section className="py-20 bg-clay-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display text-4xl font-bold text-white mb-3">
                {tWhy("title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyItems.map((item) => (
                <div
                  key={item.title}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-sand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-sand-500 transition-colors duration-300">
                    <item.icon className="w-8 h-8 text-sand-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-clay-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
