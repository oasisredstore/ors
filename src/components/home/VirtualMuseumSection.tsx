"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info, ArrowRight } from "lucide-react";

interface MuseumItem {
  id: string;
  image: string;
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
  badge: string;
  badgeAr: string;
}

const museumItems: MuseumItem[] = [
  {
    id: "foggara",
    image: "/images/products/sand_collage.png",
    title: "The Foggara System",
    titleAr: "نظام الفُقّارة العبقري",
    desc: "An ancient, ingenious underground water channel system that sustains life in the Timimoun oasis, distributing water equitably among the palm groves.",
    descAr: "نظام ري جوفي عبقري وهندسة تقليدية متوارثة، يقوم بتوزيع مياه الواحات بعدالة متناهية بنظام 'القصري'، وهو شريان الحياة في قورارة.",
    badge: "Engineering",
    badgeAr: "هندسة",
  },
  {
    id: "fatiss",
    image: "/images/products/fatiss_carpet.png",
    title: "Zenete Weaving (Fatiss)",
    titleAr: "النسيج الزناتي (سجاد الفاتيس)",
    desc: "A masterpiece of Saharan heritage. The geometric diamonds deflect the 'evil eye', while the chevrons symbolize water and fertility in the arid desert.",
    descAr: "تحفة التراث الزناتي. ترمز المعينات الهندسية إلى درء 'العين الحاسدة'، بينما تمثل الخطوط المتعرجة الماء والخصوبة في قلب الصحراء القاحلة.",
    badge: "Textile",
    badgeAr: "نسيج",
  },
  {
    id: "tadara",
    image: "/images/products/tadara_plate.png",
    title: "The Conical Tadara",
    titleAr: "التادارة المخروطية",
    desc: "Crafted tightly from sun-dried date-palm fronds, the Tadara is traditionally used to keep bread warm and protect dates from relentless desert sand.",
    descAr: "طبق السعف المخروطي المنسوج بدقة وإحكام من سعف النخيل، يُستخدم تقليدياً لحفظ الخبز دافئاً وحماية التمر من رمال الصحراء المتطايرة.",
    badge: "Palm Craft",
    badgeAr: "سعف",
  },
  {
    id: "barrad",
    image: "/images/products/barrad_jar.png",
    title: "The Barrad (Red Clay)",
    titleAr: "البرّاد (فخار تيميمون الأحمر)",
    desc: "The 'refrigerator of the Sahara'. Made from porous red Gourara clay, it allows water to slowly evaporate through its walls, naturally cooling the contents.",
    descAr: "ثلاجة الصحراء الطبيعية. جرة تُصنع من طين قورارة الأحمر المسامي، تسمح بتبخر الماء ببطء عبر جدرانها لتبريد محتواها بشكل طبيعي جداً.",
    badge: "Pottery",
    badgeAr: "فخار",
  },
];

export function VirtualMuseumSection({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #1E1410 0%, #2D1C14 30%, #1E1410 60%, #3C2508 100%)",
      }}
    >
      {/* Ambient background glows */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(204,144,32,0.35) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, rgba(25,114,168,0.30) 0%, transparent 70%)" }}
      />

      {/* Geometric overlay */}
      <div className="absolute inset-0 pattern-moucharabieh opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full mb-8 text-sm font-bold uppercase tracking-widest"
            style={{
              background: "rgba(204, 144, 32, 0.12)",
              border: "1px solid rgba(222, 176, 72, 0.30)",
              color: "#DEB048",
            }}
          >
            <Info className="w-4 h-4" />
            {isAr ? "معرض التراث" : "Heritage Gallery"}
          </div>

          <h2
            className="font-display font-bold text-white mb-6 text-fluid-xl"
          >
            {isAr ? "المتحف الافتراضي لقورارة" : "Gourara Virtual Museum"}
          </h2>

          {/* Animated underline */}
          <div className="flex justify-center mb-8">
            <div
              className="h-0.5 rounded-full transition-all duration-1500 ease-out"
              style={{
                background: "linear-gradient(90deg, transparent, #DEB048, #C04A1A, #DEB048, transparent)",
                width: isVisible ? "200px" : "0px",
                transitionDuration: "1.2s",
              }}
            />
          </div>

          <p className="text-clay-300 max-w-2xl mx-auto text-lg leading-relaxed">
            {isAr
              ? "اكتشف القصة والروح وراء كل قطعة. لا تشتري مجرد منتج، بل اقتنِ جزءاً من حضارة الصحراء الممتدة لآلاف السنين."
              : "Discover the story and soul behind every piece. Don't just buy a product, acquire a piece of millennia-old Saharan civilization."}
          </p>
        </div>

        {/* Museum Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {museumItems.map((item, index) => (
            <div
              key={item.id}
              className={`group relative rounded-3xl overflow-hidden transition-all duration-1000 ease-out cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
              style={{
                transitionDelay: `${index * 180}ms`,
                boxShadow: hoveredId === item.id
                  ? "0 32px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(222,176,72,0.25)"
                  : "0 8px 32px rgba(0,0,0,0.40)",
                transform: hoveredId === item.id ? "translateY(-6px)" : undefined,
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {/* Multi-layer gradients */}
                <div className="absolute inset-0 z-10"
                  style={{
                    background: "linear-gradient(to top, rgba(30,20,16,0.95) 0%, rgba(30,20,16,0.45) 45%, rgba(30,20,16,0.10) 100%)"
                  }}
                />
                <div
                  className="absolute inset-0 z-10 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(135deg, rgba(192,74,26,0.15) 0%, transparent 60%)",
                    opacity: hoveredId === item.id ? 1 : 0,
                  }}
                />

                <Image
                  src={item.image}
                  alt={isAr ? item.titleAr : item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  style={{ transform: hoveredId === item.id ? "scale(1.08)" : "scale(1)" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Badge */}
                <div className="absolute top-5 left-5 z-20">
                  <span
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: "rgba(30,20,16,0.80)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(222,176,72,0.30)",
                      color: "#DEB048",
                    }}
                  >
                    {isAr ? item.badgeAr : item.badge}
                  </span>
                </div>

                {/* Content overlay */}
                <div className={`absolute bottom-0 inset-x-0 p-6 sm:p-8 z-20 ${isAr ? "text-right" : "text-left"}`}>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.60)" }}>
                    {isAr ? item.titleAr : item.title}
                  </h3>

                  {/* Expanding underline */}
                  <div
                    className="h-0.5 rounded-full mb-4 transition-all duration-500 ease-out"
                    style={{
                      background: "linear-gradient(90deg, #DEB048, #C04A1A)",
                      width: hoveredId === item.id ? "80px" : "40px",
                    }}
                  />

                  <p
                    className="text-clay-200 text-sm sm:text-base leading-relaxed transition-all duration-500"
                    style={{
                      maxHeight: hoveredId === item.id ? "120px" : "0px",
                      opacity: hoveredId === item.id ? 1 : 0,
                      overflow: "hidden",
                    }}
                  >
                    {isAr ? item.descAr : item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-14 transition-all duration-1000 ease-out delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href={`/${locale}/heritage`}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:-translate-y-1 group"
            style={{
              background: "linear-gradient(135deg, rgba(222,176,72,0.15) 0%, rgba(192,74,26,0.15) 100%)",
              border: "1px solid rgba(222,176,72,0.30)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.30)",
            }}
          >
            <span>{isAr ? "استكشف المتحف الكامل" : "Explore the Full Museum"}</span>
            <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}
