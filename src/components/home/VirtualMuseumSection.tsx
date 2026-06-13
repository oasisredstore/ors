"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Info } from "lucide-react";

interface MuseumItem {
  id: string;
  image: string;
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
}

const museumItems: MuseumItem[] = [
  {
    id: "foggara",
    image: "/images/products/sand_collage.png",
    title: "The Foggara System",
    titleAr: "نظام الفُقّارة العبقري",
    desc: "An ancient, ingenious underground water channel system that sustains life in the Timimoun oasis, distributing water equitably among the palm groves.",
    descAr: "نظام ري جوفي عبقري وهندسة تقليدية متوارثة، يقوم بتوزيع مياه الواحات بعدالة متناهية بنظام 'القصري'، وهو شريان الحياة في قورارة.",
  },
  {
    id: "fatiss",
    image: "/images/products/fatiss_carpet.png",
    title: "Zenete Weaving (Fatiss)",
    titleAr: "النسيج الزناتي (سجاد الفاتيس)",
    desc: "A masterpiece of Saharan heritage. The geometric diamonds deflect the 'evil eye', while the chevrons symbolize water and fertility in the arid desert.",
    descAr: "تحفة التراث الزناتي. ترمز المعينات الهندسية إلى درء 'العين الحاسدة'، بينما تمثل الخطوط المتعرجة الماء والخصوبة في قلب الصحراء القاحلة.",
  },
  {
    id: "tadara",
    image: "/images/products/tadara_plate.png",
    title: "The Conical Tadara",
    titleAr: "التادارة المخروطية",
    desc: "Crafted tightly from sun-dried date-palm fronds, the Tadara is traditionally used to keep bread warm and protect dates from relentless desert sand.",
    descAr: "طبق السعف المخروطي المنسوج بدقة وإحكام من سعف النخيل، يُستخدم تقليدياً لحفظ الخبز دافئاً وحماية التمر من رمال الصحراء المتطايرة.",
  },
  {
    id: "barrad",
    image: "/images/products/barrad_jar.png",
    title: "The Barrad (Red Clay)",
    titleAr: "البرّاد (فخار تيميمون الأحمر)",
    desc: "The 'refrigerator of the Sahara'. Made from porous red Gourara clay, it allows water to slowly evaporate through its walls, naturally cooling the contents.",
    descAr: "ثلاجة الصحراء الطبيعية. جرة تُصنع من طين قورارة الأحمر المسامي، تسمح بتبخر الماء ببطء عبر جدرانها لتبريد محتواها بشكل طبيعي جداً.",
  },
];

export function VirtualMuseumSection({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-clay-900 text-sand-50 relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-sand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-oasis-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-sand-500/20 text-sand-400 font-semibold text-sm mb-6 uppercase tracking-wider border border-sand-500/30">
            <Info className="w-4 h-4" />
            {isAr ? "معرض التراث" : "Heritage Gallery"}
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {isAr ? "المتحف الافتراضي لقورارة" : "Gourara Virtual Museum"}
          </h2>
          <p className="text-clay-300 max-w-2xl mx-auto text-lg leading-relaxed">
            {isAr 
              ? "اكتشف القصة والروح وراء كل قطعة. لا تشتري مجرد منتج، بل اقتنِ جزءاً من حضارة الصحراء الممتدة لآلاف السنين."
              : "Discover the story and soul behind every piece. Don't just buy a product, acquire a piece of millennia-old Saharan civilization."}
          </p>
        </div>

        {/* Museum Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {museumItems.map((item, index) => (
            <div 
              key={item.id}
              className={`group relative rounded-3xl overflow-hidden bg-clay-800 border border-clay-700 transition-all duration-1000 delay-${index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image Area */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-clay-900 via-transparent to-transparent z-10 opacity-80" />
                <Image
                  src={item.image}
                  alt={isAr ? item.titleAr : item.title}
                  fill
                  className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Content Overlay */}
                <div className={`absolute bottom-0 inset-x-0 p-6 sm:p-8 z-20 flex flex-col justify-end ${isAr ? "text-right" : "text-left"}`}>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3 drop-shadow-md">
                    {isAr ? item.titleAr : item.title}
                  </h3>
                  <div className="w-12 h-1 bg-sand-500 mb-4 transition-all duration-500 group-hover:w-24" />
                  <p className="text-clay-200 text-sm sm:text-base leading-relaxed transform transition-all duration-500 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    {isAr ? item.descAr : item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
