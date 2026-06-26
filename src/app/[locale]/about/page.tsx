import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Globe, MapPin, ShoppingBag, CalendarDays, Landmark, TrendingUp, Smartphone, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

interface AboutPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "من نحن — قورارة للحرف" : "About — Gourara Crafts",
    description: locale === "ar"
      ? "اكتشف قصة قورارة للحرف وحرفيي تيميمون، الجزائر."
      : "Discover the story of Gourara Crafts and the artisans of Timimoun, Algeria.",
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
      <main className={`min-h-screen bg-desert-50 ${isAr ? "rtl" : "ltr"}`}>
        
        {/* Hero */}
        <section className="relative bg-clay-900 text-white pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-sand-500 blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-oasis-500 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-orange-500 blur-3xl opacity-20" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center z-10">
            <h1 className="font-display text-4xl lg:text-6xl font-bold mb-6 leading-tight mt-6">
              {t("title")}
            </h1>
            <p className="text-sand-100 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Our Story - OPTION 3 */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative">
                <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-sand-400 to-clay-800" />
                  <Image src="/images/products/sand_collage.png" alt="Sahara" fill className="object-cover opacity-80 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-clay-900 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white">
                      <h3 className="font-display text-2xl font-bold mb-2">
                        {isAr ? "رؤية للمستقبل" : "Vision for the future"}
                      </h3>
                      <p className="text-sm text-sand-100 leading-relaxed">
                        {isAr ? "تمكين الاقتصاد المحلي والحفاظ على التراث من خلال الرقمنة." : "Empowering the local economy and preserving heritage through digitization."}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Decorative floating element */}
                <div className={`absolute -top-6 ${isAr ? '-left-6' : '-right-6'} w-32 h-32 bg-oasis-100 rounded-full mix-blend-multiply blur-2xl opacity-70`} />
              </div>
              
              <div>
                <div className="inline-flex items-center gap-2 bg-sand-50 text-sand-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-sand-200 tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  {isAr ? "الصحراء الجزائرية" : "Algerian Sahara"}
                </div>
                <h2 className="font-display text-3xl lg:text-5xl font-bold text-clay-900 mb-8 leading-tight">
                  {t("histoire.title")}
                </h2>
                <div className="space-y-6 text-clay-600 text-lg leading-relaxed">
                  <p className="font-medium text-clay-800 border-l-4 border-sand-500 pl-4 py-1" style={{ borderLeftColor: isAr ? 'transparent' : '', borderRight: isAr ? '4px solid #c8965a' : '', paddingRight: isAr ? '1rem' : '', paddingLeft: isAr ? '0' : '' }}>
                    {t("histoire.p1")}
                  </p>
                  <p>
                    {t("histoire.p2")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Showcase (Mockups) */}
        <section className="py-24 bg-desert-50 border-y border-desert-200 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-clay-900 mb-4">
                {t("showcase.title")}
              </h2>
              <p className="text-clay-500 max-w-2xl mx-auto text-lg">
                {t("showcase.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mockup 1 */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-desert-200 hover:-translate-y-2 transition-transform duration-500">
                <div className="bg-clay-100 px-4 py-3 flex items-center gap-2 border-b border-clay-200">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-48 bg-gradient-to-br from-sand-100 to-orange-50 flex flex-col items-center justify-center relative p-6">
                  <div className="absolute inset-x-4 top-4 bottom-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm flex flex-col items-center justify-center p-4">
                    <ShoppingBag className="w-10 h-10 text-sand-600 mb-3" />
                    <div className="w-24 h-2 bg-sand-200 rounded-full mb-2"></div>
                    <div className="w-16 h-2 bg-sand-200 rounded-full"></div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-clay-900 text-lg mb-2">{t("showcase.marketplace.title")}</h3>
                  <p className="text-sm text-clay-500 leading-relaxed">{t("showcase.marketplace.desc")}</p>
                </div>
              </div>

              {/* Mockup 2 */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-desert-200 hover:-translate-y-2 transition-transform duration-500 md:-translate-y-4">
                <div className="bg-clay-100 px-4 py-3 flex items-center gap-2 border-b border-clay-200">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-48 bg-gradient-to-br from-oasis-100 to-green-50 flex flex-col items-center justify-center relative p-6">
                  <div className="absolute inset-x-4 top-4 bottom-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm flex flex-col items-center justify-center p-4">
                    <CalendarDays className="w-10 h-10 text-oasis-600 mb-3" />
                    <div className="flex gap-2 mb-2 w-full justify-center">
                      <div className="w-12 h-8 bg-oasis-200/50 rounded-lg"></div>
                      <div className="w-12 h-8 bg-oasis-200/50 rounded-lg"></div>
                      <div className="w-12 h-8 bg-oasis-600 rounded-lg shadow-sm"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-clay-900 text-lg mb-2">{t("showcase.booking.title")}</h3>
                  <p className="text-sm text-clay-500 leading-relaxed">{t("showcase.booking.desc")}</p>
                </div>
              </div>

              {/* Mockup 3 */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-desert-200 hover:-translate-y-2 transition-transform duration-500">
                <div className="bg-clay-100 px-4 py-3 flex items-center gap-2 border-b border-clay-200">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-48 bg-gradient-to-br from-clay-200 to-clay-100 flex flex-col items-center justify-center relative p-6">
                  <div className="absolute inset-x-4 top-4 bottom-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm flex flex-col items-center justify-center p-4 overflow-hidden">
                    <Landmark className="w-10 h-10 text-clay-600 mb-3" />
                    <div className="grid grid-cols-3 gap-2 w-full">
                       <div className="h-10 bg-clay-300/50 rounded-md"></div>
                       <div className="h-10 bg-clay-300/50 rounded-md"></div>
                       <div className="h-10 bg-clay-300/50 rounded-md"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-clay-900 text-lg mb-2">{t("showcase.museum.title")}</h3>
                  <p className="text-sm text-clay-500 leading-relaxed">{t("showcase.museum.desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expanded Partner CTA */}
        <section className="py-24 bg-clay-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sand-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-oasis-500/10 blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  {t("partners.title")}
                </h2>
                <p className="text-clay-300 text-lg mb-10 leading-relaxed">
                  {t("partners.subtitle")}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sand-500/20 flex items-center justify-center shrink-0">
                      <Globe className="w-6 h-6 text-sand-400" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{t("partners.benefits.global")}</h4>
                      <p className="text-sm text-clay-400 leading-relaxed">
                        {isAr ? "افتح أبواب عملك للعالم واستقبل سياحاً من مختلف الدول." : "Open your doors to the world and welcome tourists from everywhere."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-oasis-500/20 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-6 h-6 text-oasis-400" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{t("partners.benefits.direct")}</h4>
                      <p className="text-sm text-clay-400 leading-relaxed">
                        {isAr ? "نظام حجز سلس يزيد من مبيعاتك وإيراداتك مباشرة." : "Seamless booking system to increase your sales and revenue directly."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Smartphone className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{t("partners.benefits.digital")}</h4>
                      <p className="text-sm text-clay-400 leading-relaxed">
                        {isAr ? "لوحة تحكم ذكية لإدارة منتجاتك وخدماتك بكل سهولة." : "Smart dashboard to manage your products and services with ease."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{t("partners.benefits.heritage")}</h4>
                      <p className="text-sm text-clay-400 leading-relaxed">
                        {isAr ? "كن جزءاً من منصة تساهم في التنمية المستدامة وحفظ التراث." : "Be part of a platform that contributes to sustainable development."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/${locale}/auth/artisan/register`}
                    className="inline-flex items-center justify-center gap-2 bg-sand-500 hover:bg-sand-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-sand-500/25"
                  >
                    {t("partners.ctaArtisan")}
                    {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  </Link>
                  <Link
                    href={`/${locale}/auth/provider/register`}
                    className="inline-flex items-center justify-center gap-2 bg-clay-800 hover:bg-clay-700 text-white font-bold px-8 py-4 rounded-xl transition-all border border-clay-700 hover:border-clay-600"
                  >
                    {t("partners.ctaProvider")}
                  </Link>
                </div>
              </div>
              
              <div className="hidden lg:block relative">
                <div className="relative w-full aspect-square max-w-md mx-auto">
                   <div className="absolute inset-0 bg-gradient-to-tr from-sand-500 to-oasis-500 rounded-full blur-3xl opacity-30 animate-pulse" />
                   <div className="absolute inset-4 bg-clay-800 rounded-[3rem] border border-clay-700 shadow-2xl flex flex-col overflow-hidden">
                      {/* Fake App UI */}
                      <div className="h-16 border-b border-clay-700 flex items-center justify-between px-6 bg-clay-900/50">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sand-400 to-orange-500"></div>
                           <div className="w-24 h-3 bg-clay-700 rounded-full"></div>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-clay-700 flex items-center justify-center">
                           <div className="w-4 h-4 bg-sand-500 rounded-sm"></div>
                         </div>
                      </div>
                      <div className="flex-1 p-6 flex flex-col gap-4">
                         <div className="w-3/4 h-6 bg-clay-700 rounded-md"></div>
                         <div className="flex gap-3">
                            <div className="w-16 h-8 bg-sand-500/20 text-sand-400 rounded-full flex items-center justify-center text-xs font-bold">New</div>
                            <div className="w-16 h-8 bg-clay-700 rounded-full"></div>
                         </div>
                         <div className="flex-1 bg-clay-900/50 rounded-2xl border border-clay-700 mt-4 flex items-center justify-center relative overflow-hidden">
                            <TrendingUp className="w-16 h-16 text-sand-500/50" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Materials & Techniques */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-clay-900 mb-4">
                {t("techniques.title")}
              </h2>
              <div className="w-24 h-1 bg-sand-500 mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TECHNIQUES.map(({ emoji, keyEn, color }) => (
                <div
                  key={keyEn}
                  className={`rounded-3xl border bg-gradient-to-br ${color} p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}
                >
                  <div className="text-5xl mb-6 bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm">{emoji}</div>
                  <h3 className="font-bold text-clay-900 text-xl mb-3">
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

        {/* Team & Credits */}
        <section className="py-24 bg-desert-50 border-t border-desert-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl font-bold text-clay-900 mb-6">
              {isAr ? "فريق العمل" : "Our Team"}
            </h2>
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-desert-200 mb-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <div className="w-16 h-16 mx-auto bg-sand-200 rounded-full mb-3 flex items-center justify-center text-xl">🎓</div>
                  <h4 className="font-bold text-clay-800">{isAr ? "بلقاسيمي سعاد" : "Souad Belkacemi"}</h4>
                </div>
                <div>
                  <div className="w-16 h-16 mx-auto bg-sand-200 rounded-full mb-3 flex items-center justify-center text-xl">🎓</div>
                  <h4 className="font-bold text-clay-800">{isAr ? "مصطفاوي خديجة" : "Khadidja Mostefaoui"}</h4>
                </div>
                <div>
                  <div className="w-16 h-16 mx-auto bg-sand-200 rounded-full mb-3 flex items-center justify-center text-xl">🎓</div>
                  <h4 className="font-bold text-clay-800">{isAr ? "غرايبي العربي" : "Larbi Gheraibi"}</h4>
                </div>
                <div>
                  <div className="w-16 h-16 mx-auto bg-sand-200 rounded-full mb-3 flex items-center justify-center text-xl">🎓</div>
                  <h4 className="font-bold text-clay-800">{isAr ? "اصغير عبد الحميد" : "Abdelhamid Seghir"}</h4>
                </div>
              </div>
              <div className="p-5 bg-sand-50 rounded-2xl border border-sand-200 text-clay-700 text-sm md:text-base leading-relaxed">
                {isAr ? (
                  <div className="text-center space-y-2">
                    <p className="font-bold text-clay-800 mb-3">تم هذا العمل تحت إشراف:</p>
                    <p className="font-medium">🎓 د. جعفري مبارك</p>
                    <p className="font-medium">🎓 د. بورقيق عبد الكريم</p>
                    <p className="font-medium">🎓 د. ياحي توفيق</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <p className="font-bold text-clay-800 mb-3">This work was supervised by:</p>
                    <p className="font-medium">🎓 Dr. Djafri Mubarak</p>
                    <p className="font-medium">🎓 Dr. Bourkaib Abdelkrim</p>
                    <p className="font-medium">🎓 Dr. Yahi Tawfiq</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer locale={locale} />
    </>
  );
}
