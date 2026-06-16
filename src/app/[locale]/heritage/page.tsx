import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSession } from "@/lib/session";
import Link from "next/link";
import Image from "next/image";
import { Info, BookOpen, Landmark, Calendar, Palette, Sprout, MapPin, Phone, Globe } from "lucide-react";
import { timimounContacts } from "@/data/timimoun-contacts";

const heritageItems = [
  {
    id: "foggara",
    image: "/images/products/sand_collage.png",
    emoji: "💧",
    title: "The Foggara System",
    titleAr: "نظام الفُقّارة العبقري",
    period: "~3000 years old",
    periodAr: "عمره ~3000 سنة",
    desc: "An ancient, ingenious underground water channel system that sustains life in the Timimoun oasis, distributing water equitably among the palm groves using the 'Qassri' system — one of the most remarkable feats of pre-industrial hydraulic engineering on Earth.",
    descAr: "نظام ري جوفي عبقري وهندسة تقليدية متوارثة، يقوم بتوزيع مياه الواحات بعدالة متناهية بنظام 'القصري'، وهو شريان الحياة في قورارة ومن أروع إنجازات الهندسة المائية قبل الصناعية في العالم.",
  },
  {
    id: "fatiss",
    image: "/images/products/fatiss_carpet.png",
    emoji: "🎨",
    title: "Zenete Weaving (Fatiss)",
    titleAr: "النسيج الزناتي (سجاد الفاتيس)",
    period: "Medieval tradition",
    periodAr: "تراث قروسطي",
    desc: "A masterpiece of Saharan heritage. The geometric diamonds deflect the 'evil eye', while the chevrons symbolize water and fertility in the arid desert. Each carpet takes months to complete and encodes a visual language passed down through generations of Zenete Berber women.",
    descAr: "تحفة التراث الزناتي. ترمز المعينات الهندسية إلى درء 'العين الحاسدة'، بينما تمثل الخطوط المتعرجة الماء والخصوبة. كل سجادة تستغرق أشهراً وتُشفر لغة بصرية متوارثة بين نساء الزناتيين.",
  },
  {
    id: "tadara",
    image: "/images/products/tadara_plate.png",
    emoji: "🌿",
    title: "The Conical Tadara",
    titleAr: "التادارة المخروطية",
    period: "Ancient craft",
    periodAr: "حرفة أثرية",
    desc: "Crafted tightly from sun-dried date-palm fronds, the Tadara is traditionally used to keep bread warm and protect dates from relentless desert sand. Today it is also a decorative piece appreciated worldwide for its organic beauty.",
    descAr: "طبق السعف المخروطي المنسوج بدقة من سعف النخيل المجفف بالشمس، يُستخدم تقليدياً لحفظ الخبز دافئاً وحماية التمر. اليوم أصبح قطعة ديكورية تحظى بتقدير عالمي لجمالها الطبيعي.",
  },
  {
    id: "barrad",
    image: "/images/products/barrad_jar.png",
    emoji: "🏺",
    title: "The Barrad (Red Clay)",
    titleAr: "البرّاد (فخار تيميمون الأحمر)",
    period: "Saharan invention",
    periodAr: "اختراع صحراوي",
    desc: "The 'refrigerator of the Sahara'. Made from porous red Gourara clay, it allows water to slowly evaporate through its walls, naturally cooling the contents — an ancient zero-energy cooling technology still in use today.",
    descAr: "ثلاجة الصحراء الطبيعية. جرة من الطين الأحمر المسامي، تسمح بتبخر الماء ببطء عبر جدرانها لتبريد محتواها بشكل طبيعي — تقنية تبريد بلا طاقة عمرها آلاف السنين لا تزال مستخدمة.",
  },
];

const timeline = [
  { year: "~5000 BC", yearAr: "~5000 ق.م", event: "First human settlements in the Gourara region", eventAr: "أولى التجمعات البشرية في منطقة قورارة" },
  { year: "8th century", yearAr: "القرن 8", event: "Arrival of Islam and foundation of first ksour (fortified villages)", eventAr: "وصول الإسلام وتأسيس أول القصور (القرى المحصنة)" },
  { year: "14th century", yearAr: "القرن 14", event: "Peak of trans-Saharan trade routes through Timimoun", eventAr: "ذروة طرق التجارة العابرة للصحراء عبر تيميمون" },
  { year: "1852", yearAr: "1852", event: "French colonial expedition reaches Timimoun", eventAr: "وصول الحملة الاستعمارية الفرنسية إلى تيميمون" },
  { year: "1962", yearAr: "1962", event: "Independence of Algeria — Timimoun becomes wilaya", eventAr: "استقلال الجزائر — تيميمون تصبح ولاية" },
  { year: "2024", yearAr: "2024", event: "Launch of RedOasis platform to digitize heritage", eventAr: "إطلاق منصة ريد أوزيس لرقمنة التراث" },
];

const craftCategories = [
  { name: "Pottery", nameAr: "الفخار", emoji: "🏺", desc: "Red clay ceramics", descAr: "فخار الطين الأحمر" },
  { name: "Weaving", nameAr: "النسيج", emoji: "🎨", desc: "Geometric Fatiss carpets", descAr: "سجاد الفاتيس الهندسي" },
  { name: "Palm Crafts", nameAr: "سعف النخيل", emoji: "🌿", desc: "Baskets & Tadara plates", descAr: "سلال وطبق التادارة" },
  { name: "Leatherwork", nameAr: "الجلد", emoji: "🧶", desc: "Traditional tanning", descAr: "الدباغة التقليدية" },
  { name: "Jewelry", nameAr: "المجوهرات", emoji: "💎", desc: "Silver & amber", descAr: "الفضة والعنبر" },
  { name: "Calligraphy", nameAr: "الخط العربي", emoji: "✍️", desc: "Sacred Arabic script", descAr: "الخط العربي المقدس" },
];

export default async function HeritagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const session = await getSession();
  const user = session ? { name: session.firstName ?? session.email.split("@")[0], role: session.role } : null;

  // Workshop services for booking widget
  const workshops = await prisma.service.findMany({
    where: { isPublished: true, type: "WORKSHOP" },
    include: { provider: true, images: { where: { isPrimary: true }, take: 1 } },
    take: 4,
  });

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className={`min-h-screen pt-20 ${isAr ? "rtl" : "ltr"}`}>

        {/* Hero Banner */}
        <section className="relative bg-clay-900 py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/products/sand_collage.png')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-clay-900/80 via-clay-900/60 to-clay-900" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-500/20 text-sand-400 font-semibold text-sm mb-6 border border-sand-500/30">
              <Landmark className="w-4 h-4" />
              {isAr ? "التراث الثقافي" : "Cultural Heritage"}
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {isAr ? "المتحف الافتراضي لقورارة" : "Gourara Virtual Museum"}
            </h1>
            <p className="text-clay-300 text-xl max-w-3xl mx-auto leading-relaxed">
              {isAr
                ? "رحلة عبر آلاف السنين من الحضارة، التراث، والحرف اليدوية في أعماق الصحراء الجزائرية."
                : "A journey through thousands of years of civilization, heritage, and craft in the depths of the Algerian Sahara."}
            </p>
          </div>
        </section>

        {/* Heritage Gallery */}
        <section className="py-20 bg-clay-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-12">
              <Info className="w-6 h-6 text-sand-400" />
              <h2 className="font-display text-3xl font-bold text-white">
                {isAr ? "معرض التراث" : "Heritage Gallery"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {heritageItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-3xl overflow-hidden bg-clay-800 border border-clay-700 hover:border-sand-500/50 transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-clay-900 via-transparent to-transparent z-10" />
                    <Image
                      src={item.image}
                      alt={isAr ? item.titleAr : item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-black/40 backdrop-blur-md text-xs text-sand-300 px-3 py-1 rounded-full border border-sand-500/30">
                        {isAr ? item.periodAr : item.period}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{item.emoji}</span>
                      <h3 className="font-display text-xl font-bold text-white">
                        {isAr ? item.titleAr : item.title}
                      </h3>
                    </div>
                    <p className="text-clay-300 text-sm leading-relaxed">
                      {isAr ? item.descAr : item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Craft Categories */}
        <section className="py-20 bg-desert-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-12">
              <Palette className="w-6 h-6 text-sand-600" />
              <h2 className="font-display text-3xl font-bold text-clay-800">
                {isAr ? "موسوعة الحرف التقليدية" : "Traditional Crafts Encyclopedia"}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {craftCategories.map((craft) => (
                <Link
                  key={craft.name}
                  href={`/${locale}/products?category=${craft.name.toLowerCase().replace(" ", "-")}`}
                  className="group bg-white rounded-2xl p-5 text-center border border-desert-100 hover:border-sand-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="text-4xl block mb-3">{craft.emoji}</span>
                  <h3 className="font-semibold text-clay-800 text-sm group-hover:text-sand-600 transition-colors">
                    {isAr ? craft.nameAr : craft.name}
                  </h3>
                  <p className="text-xs text-clay-400 mt-1">{isAr ? craft.descAr : craft.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Historical Timeline */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-12">
              <Calendar className="w-6 h-6 text-oasis-600" />
              <h2 className="font-display text-3xl font-bold text-clay-800">
                {isAr ? "جدول زمني تاريخي" : "Historical Timeline"}
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-desert-200" />
              <div className="space-y-8">
                {timeline.map((event, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sand-400 to-clay-700 flex items-center justify-center shrink-0 relative z-10 shadow-md">
                      <Sprout className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-desert-50 rounded-2xl p-5 border border-desert-100">
                      <p className="text-xs font-bold text-sand-600 mb-1">
                        {isAr ? event.yearAr : event.year}
                      </p>
                      <p className="text-clay-700 font-medium">
                        {isAr ? event.eventAr : event.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Educational Workshops */}
        {workshops.length > 0 && (
          <section className="py-20 bg-desert-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-oasis-600" />
                <h2 className="font-display text-3xl font-bold text-clay-800">
                  {isAr ? "ورشات الحرف التعليمية" : "Educational Craft Workshops"}
                </h2>
              </div>
              <p className="text-clay-500 mb-10 max-w-2xl">
                {isAr
                  ? "احجز تجربة فريدة — تعلم الحرف التقليدية مباشرة من أيدي الحرفيين المحترفين."
                  : "Book a unique experience — learn traditional crafts directly from the hands of professional artisans."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {workshops.map((ws) => (
                  <Link
                    key={ws.id}
                    href={`/${locale}/services/${ws.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-desert-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] bg-desert-100 relative overflow-hidden">
                      {ws.images[0] ? (
                        <Image src={ws.images[0].url} alt={ws.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl">🎨</div>
                      )}
                      <div className="absolute top-3 left-3 bg-oasis-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {isAr ? "ورشة تعليمية" : "Workshop"}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-clay-900 mb-2 line-clamp-2">
                        {isAr && ws.nameAr ? ws.nameAr : ws.name}
                      </h3>
                      <p className="text-xs text-clay-500 mb-3">{ws.provider.businessName}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-oasis-700">{ws.price} DZD</span>
                        <span className="text-xs bg-desert-100 text-clay-600 px-2 py-1 rounded">
                          {isAr ? `${ws.capacity} مشارك` : `${ws.capacity} max`}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href={`/${locale}/services?type=workshop`}
                  className="inline-flex items-center gap-2 bg-oasis-600 hover:bg-oasis-700 text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  {isAr ? "عرض كل الورشات ←" : "View All Workshops →"}
                </Link>
              </div>
            </div>
          </section>
        )}
        {/* Local Contacts Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-12">
              <MapPin className="w-6 h-6 text-sand-500" />
              <h2 className="font-display text-3xl font-bold text-clay-800">
                {isAr ? "دليل قورارة المحلي" : "Gourara Local Guide"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {timimounContacts.map((contact) => (
                <div key={contact.id} className="bg-desert-50 rounded-2xl p-6 border border-desert-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-sand-600 bg-sand-100 px-2 py-1 rounded">
                      {contact.type.replace('_', ' ')}
                    </span>
                    {contact.isVerified && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-clay-800 mb-2">
                    {isAr && contact.nameAr ? contact.nameAr : contact.name}
                  </h3>
                  <p className="text-sm text-clay-600 mb-4 h-10 line-clamp-2">
                    {isAr && contact.descriptionAr ? contact.descriptionAr : contact.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-clay-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-clay-400 mt-0.5 shrink-0" />
                      <span>{contact.address}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-clay-400 shrink-0" />
                        <a href={`tel:${contact.phone}`} className="hover:text-sand-600">{contact.phone}</a>
                      </div>
                    )}
                    {contact.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-clay-400 shrink-0" />
                        <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-sand-600 truncate">{contact.website}</a>
                      </div>
                    )}
                  </div>
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
