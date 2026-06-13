import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { MapPin, Package, Star, Mail, MessageCircle } from "lucide-react";
import Image from "next/image";

interface ArtisanProfilePageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export async function generateMetadata({ params }: ArtisanProfilePageProps) {
  const { slug } = await params;
  const artisan = await prisma.artisan.findUnique({ where: { slug } });
  if (!artisan) return { title: "Artisan Not Found" };
  return {
    title: `${artisan.shopName} — RedOasisArtisan`,
    description: artisan.bio || `Shop handmade crafts from ${artisan.shopName}`,
  };
}

export default async function ArtisanProfilePage({ params }: ArtisanProfilePageProps) {
  const { locale, slug } = await params;
  const session = await getSession();
  const user = session ? { name: session.email.split("@")[0], role: session.role } : null;
  const isAr = locale === "ar";

  const artisan = await prisma.artisan.findUnique({
    where: { slug, isApproved: true },
    include: {
      user: { select: { firstName: true, lastName: true } },
      products: {
        where: { isPublished: true },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          reviews: { select: { rating: true } },
          category: { select: { name: true, nameAr: true } },
        },
        orderBy: { isFeatured: "desc" },
      },
    },
  });

  if (!artisan) notFound();

  // Compute overall rating across all products
  const allRatings = artisan.products.flatMap((p) => p.reviews.map((r) => r.rating));
  const avgRating = allRatings.length > 0
    ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
    : null;

  const bio = isAr ? artisan.bioAr : artisan.bio;

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50 pt-16">

        {/* Cover Hero */}
        <div className="relative h-56 sm:h-72 overflow-hidden bg-gradient-to-br from-clay-900 via-clay-800 to-sand-800">
          {/* Geometric pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="profile-hex" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                  <polygon points="24,2 46,13 46,35 24,46 2,35 2,13" fill="none" stroke="white" strokeWidth="1.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#profile-hex)" />
            </svg>
          </div>

          {/* Actual cover image */}
          {artisan.coverUrl && (
            <Image
              src={artisan.coverUrl}
              alt={`${artisan.shopName} cover`}
              fill
              className="object-cover"
              priority
            />
          )}

          {/* Bottom gradient fade into the page */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-desert-50 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Profile Card — pulled up over the cover */}
          <div className="bg-white rounded-3xl border border-desert-200 shadow-xl -mt-20 mb-10 p-6 sm:p-8 relative">
            <div className={`flex flex-col sm:flex-row gap-6 items-start ${isAr ? "sm:flex-row-reverse" : ""}`}>

              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sand-400 to-clay-700 flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg border-4 border-white shrink-0 overflow-hidden">
                {artisan.avatarUrl ? (
                  <Image
                    src={artisan.avatarUrl}
                    alt={artisan.shopName}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  artisan.shopName.charAt(0)
                )}
              </div>

              {/* Info */}
              <div className={`flex-1 min-w-0 ${isAr ? "text-right" : ""}`}>
                <h1 className="font-display text-3xl font-bold text-clay-800 leading-tight">
                  {artisan.shopName}
                </h1>
                {artisan.specialization && (
                  <p className="text-oasis-600 font-medium mt-1">{artisan.specialization}</p>
                )}

                <div className={`flex flex-wrap gap-4 mt-3 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                  {artisan.location && (
                    <div className="flex items-center gap-1.5 text-sm text-clay-500">
                      <MapPin className="w-4 h-4 text-sand-500 shrink-0" />
                      {artisan.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-clay-500">
                    <Package className="w-4 h-4 text-sand-500 shrink-0" />
                    {artisan.products.length} {isAr ? "منتج" : "products"}
                  </div>
                  {avgRating !== null && (
                    <div className="flex items-center gap-1.5 text-sm text-amber-600 font-semibold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                      {avgRating.toFixed(1)}
                      <span className="text-clay-400 font-normal">
                        ({allRatings.length} {isAr ? "تقييم" : "reviews"})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact buttons */}
              <div className={`flex gap-2 shrink-0 ${isAr ? "mr-auto" : "ml-auto"}`}>
                {artisan.whatsapp && (
                  <a
                    href={`https://wa.me/${artisan.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    {isAr ? "واتساب" : "WhatsApp"}
                  </a>
                )}
                {artisan.email && (
                  <a
                    href={`mailto:${artisan.email}`}
                    className="flex items-center gap-2 bg-sand-500 hover:bg-sand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:shadow-md"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    {isAr ? "بريد" : "Email"}
                  </a>
                )}
              </div>
            </div>

            {/* Bio */}
            {bio && (
              <p className={`mt-5 text-clay-600 leading-relaxed border-t border-desert-100 pt-5 ${isAr ? "text-right" : ""}`}>
                {bio}
              </p>
            )}
          </div>

          {/* Products */}
          <div className="mb-16">
            <div className={`flex items-center justify-between mb-6 ${isAr ? "flex-row-reverse" : ""}`}>
              <h2 className="font-display text-2xl font-bold text-clay-800">
                {isAr ? "منتجات الحرفي" : "Products"}
              </h2>
              {artisan.products.length > 0 && (
                <span className="text-sm text-clay-400">
                  {artisan.products.length} {isAr ? "منتج" : "items"}
                </span>
              )}
            </div>

            {artisan.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {artisan.products.map((product) => {
                  const avgProductRating =
                    product.reviews.length > 0
                      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
                      : undefined;

                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      nameAr={product.nameAr}
                      imageUrl={product.images[0]?.url}
                      artisanName={artisan.shopName}
                      artisanSlug={artisan.slug}
                      categoryName={product.category.name}
                      categoryNameAr={product.category.nameAr}
                      rating={avgProductRating}
                      reviewCount={product.reviews.length}
                      locale={locale}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-desert-200">
                <p className="text-5xl mb-4">🏺</p>
                <p className="text-clay-400 font-medium">
                  {isAr ? "لا منتجات بعد" : "No products listed yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
