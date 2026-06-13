import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Package } from "lucide-react";

interface ArtisansPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export async function generateMetadata({ params }: ArtisansPageProps) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "حرفيونا — ريد أوزيس أرتيزان" : "Our Artisans — RedOasisArtisan",
    description: "Meet the talented local artisans from Timimoun who create our authentic Saharan crafts.",
  };
}

export default async function ArtisansPage({ params }: ArtisansPageProps) {
  const { locale } = await params;
  const session = await getSession();
  const user = session ? { name: session.email.split("@")[0], role: session.role } : null;

  const artisans = await prisma.artisan.findMany({
    where: { isApproved: true, isActive: true },
    include: {
      user: { select: { firstName: true, lastName: true } },
      _count: { select: { products: { where: { isPublished: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="font-display text-5xl font-bold text-clay-800 mb-4">
              {locale === "ar" ? "حرفيونا" : "Our Artisans"}
            </h1>
            <p className="text-clay-500 max-w-xl mx-auto text-lg">
              {locale === "ar"
                ? "تعرف على الحرفيين الموهوبين من تيميمون الذين يصنعون حرفنا الصحراوية الأصيلة"
                : "Meet the talented artisans from Timimoun who bring Saharan craftsmanship to the world"}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artisans.map((artisan) => (
              <Link
                key={artisan.id}
                href={`/${locale}/artisans/${artisan.slug}`}
                className="group bg-white rounded-3xl border border-desert-200 overflow-hidden hover:border-sand-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Cover */}
                <div className="h-28 bg-gradient-to-br from-sand-200 via-desert-200 to-oasis-100 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id={`pattern-${artisan.id}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                          <polygon points="15,2 28,8 28,22 15,28 2,22 2,8" fill="none" stroke="#c8965a" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#pattern-${artisan.id})`} />
                    </svg>
                  </div>
                  {artisan.coverUrl && (
                    <Image src={artisan.coverUrl} alt="" fill className="object-cover" />
                  )}
                </div>

                <div className="px-5 pb-5">
                  {/* Avatar */}
                  <div className="relative -mt-10 mb-3">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sand-400 to-clay-700 flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg border-4 border-white overflow-hidden">
                      {artisan.avatarUrl ? (
                        <Image src={artisan.avatarUrl} alt={artisan.shopName} width={80} height={80} className="object-cover" />
                      ) : (
                        artisan.shopName.charAt(0)
                      )}
                    </div>
                  </div>

                  <h2 className="font-display text-lg font-bold text-clay-800 group-hover:text-sand-600 transition-colors leading-tight">
                    {artisan.shopName}
                  </h2>

                  {artisan.specialization && (
                    <p className="text-xs text-oasis-600 font-medium mt-1">{artisan.specialization}</p>
                  )}

                  <div className="flex items-center gap-1 mt-2 text-xs text-clay-400">
                    <MapPin className="w-3 h-3" />
                    {artisan.location || "Timimoun, Algeria"}
                  </div>

                  {artisan.bio && (
                    <p className="text-xs text-clay-500 mt-3 line-clamp-2 leading-relaxed">
                      {artisan.bio}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-sand-600">
                    <Package className="w-3.5 h-3.5" />
                    {artisan._count.products} {locale === "ar" ? "منتج" : "products"}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {artisans.length === 0 && (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🏺</p>
              <p className="text-clay-400">
                {locale === "ar" ? "لا يوجد حرفيون بعد" : "No artisans yet. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
