import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Globe, Heart, Award, MapPin } from "lucide-react";

interface AboutPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "من نحن — ريد أوزيس أرتيزان" : "About — RedOasisArtisan",
    description: locale === "ar"
      ? "اكتشف قصة ريد أوزيس أرتيزان وحرفيي تيميمون، الجزائر."
      : "Discover the story of RedOasisArtisan and the artisans of Timimoun, Algeria.",
  };
}

const TECHNIQUES = [
  { emoji: "🏺", keyEn: "pottery", color: "from-orange-100 to-orange-50 border-orange-200" },
  { emoji: "🧵", keyEn: "weaving", color: "from-blue-100 to-blue-50 border-blue-200" },
  { emoji: "👜", keyEn: "leather", color: "from-amber-100 to-amber-50 border-amber-200" },
  { emoji: "🌿", keyEn: "palm", color: "from-green-100 to-green-50 border-green-200" },
];

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const session = await getSession();
  const user = session ? { name: session.email.split("@")[0], role: session.role } : null;
  const t = await getTranslations("about");
  const isAr = locale === "ar";

  const artisans = await prisma.artisan.findMany({
    where: { isApproved: true, isActive: true },
    include: { user: true },
    take: 6,
  });

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50">
        {/* Hero */}
        <section className="relative bg-clay-900 text-white pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-sand-500 blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-oasis-500 blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block bg-sand-500/20 text-sand-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-sand-500/30">
              {isAr ? "🌵 تيميمون، الجزائر" : "🌵 Timimoun, Algeria"}
            </span>
            <h1 className="font-display text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {t("title")}
            </h1>
            <p className="text-clay-300 text-lg leading-relaxed max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Notre Histoire */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className={isAr ? "order-2" : "order-1"}>
                <div className="inline-flex items-center gap-2 bg-sand-50 text-sand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-sand-200">
                  <MapPin className="w-3.5 h-3.5" />
                  {isAr ? "الصحراء الجزائرية" : "Algerian Sahara"}
                </div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-clay-800 mb-6">
                  {t("histoire.title")}
                </h2>
                <div className="space-y-4 text-clay-600 leading-relaxed">
                  <p>{t("histoire.content")}</p>
                  <p>{t("mission.content")}</p>
                </div>
              </div>
              <div className={`${isAr ? "order-1" : "order-2"} relative`}>
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-sand-200 to-clay-300 shadow-2xl">
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {["🏺", "🧵", "👜", "🌿"].map((emoji, i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-white/60 backdrop-blur flex items-center justify-center text-5xl shadow-sm">
                          {emoji}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-sand-500 text-white rounded-2xl px-5 py-3 shadow-xl">
                  <p className="font-bold text-2xl">1000+</p>
                  <p className="text-xs text-sand-100">{isAr ? "سنة من التراث" : "Years of heritage"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission pillars */}
        <section className="py-20 bg-desert-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-clay-800 mb-3">
                {t("mission.title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Award, titleKey: "authentic", color: "bg-sand-500" },
                { icon: Globe, titleKey: "heritage", color: "bg-oasis-500" },
                { icon: Heart, titleKey: "impact", color: "bg-rose-500" },
                { icon: Leaf, titleKey: "quality", color: "bg-green-600" },
              ].map(({ icon: Icon, titleKey, color }) => (
                <div key={titleKey} className="bg-white rounded-2xl border border-desert-200 p-6 text-center hover:shadow-lg transition-shadow">
                  <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-clay-800 mb-2">
                    {isAr
                      ? titleKey === "authentic" ? "100% أصيل"
                        : titleKey === "heritage" ? "تراث ثقافي"
                        : titleKey === "impact" ? "اكتشاف وتواصل"
                        : "جودة عالية"
                      : titleKey === "authentic" ? "100% Authentic"
                        : titleKey === "heritage" ? "Cultural Heritage"
                        : titleKey === "impact" ? "Discover & Connect"
                        : "Premium Quality"}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Materials & Techniques */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-clay-800 mb-3">
                {t("techniques.title")}
              </h2>
              <p className="text-clay-500 max-w-xl mx-auto">
                {isAr
                  ? "تقنيات الحرف اليدوية المتوارثة عبر الأجيال في الصحراء الجزائرية"
                  : "Traditional craft techniques passed down through generations in the Algerian Sahara"}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TECHNIQUES.map(({ emoji, keyEn, color }) => (
                <div
                  key={keyEn}
                  className={`rounded-2xl border bg-gradient-to-br ${color} p-6 hover:shadow-lg transition-all hover:-translate-y-1`}
                >
                  <div className="text-4xl mb-4">{emoji}</div>
                  <h3 className="font-bold text-clay-800 text-lg mb-2">
                    {t(`techniques.${keyEn}.name` as Parameters<typeof t>[0])}
                  </h3>
                  <p className="text-sm text-clay-600 leading-relaxed">
                    {t(`techniques.${keyEn}.desc` as Parameters<typeof t>[0])}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Artisans showcase */}
        {artisans.length > 0 && (
          <section className="py-20 bg-clay-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-14">
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-3">
                  {isAr ? "حرفيونا" : "Our Artisans"}
                </h2>
                <p className="text-clay-400">
                  {isAr
                    ? "المبدعون الذين يحيون التراث بأيديهم الماهرة"
                    : "The talented creators who keep the heritage alive"}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {artisans.map((artisan) => (
                  <Link
                    key={artisan.id}
                    href={`/${locale}/artisans/${artisan.slug}`}
                    className="group text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sand-400 to-oasis-500 flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold group-hover:scale-110 transition-transform overflow-hidden">
                      {artisan.avatarUrl ? (
                        <Image
                          src={artisan.avatarUrl}
                          alt={artisan.shopName}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      ) : (
                        artisan.shopName.charAt(0)
                      )}
                    </div>
                    <p className="text-white text-xs font-semibold group-hover:text-sand-400 transition-colors">
                      {artisan.shopName}
                    </p>
                    {artisan.location && (
                      <p className="text-clay-500 text-xs mt-0.5">{artisan.location}</p>
                    )}
                  </Link>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link
                  href={`/${locale}/artisans`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-sand-500 to-sand-600 text-white font-semibold px-8 py-3.5 rounded-full hover:shadow-lg transition-all"
                >
                  {isAr ? "عرض جميع الحرفيين" : "View All Artisans"}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 bg-desert-gradient">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold text-clay-800 mb-4">
              {isAr ? "هل أنت حرفي؟" : "Are you an artisan?"}
            </h2>
            <p className="text-clay-500 mb-8">
              {isAr
                ? "انضم إلى منصتنا وشارك إبداعاتك مع العالم"
                : "Join our platform and share your creations with the world"}
            </p>
            <Link
              href={`/${locale}/auth/artisan/register`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-clay-800 to-clay-900 text-white font-semibold px-8 py-3.5 rounded-full hover:shadow-xl transition-all"
            >
              {isAr ? "انضم كحرفي" : "Join as Artisan"}
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
