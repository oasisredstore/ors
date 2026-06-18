import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { MapPin, Package, Star, Mail, MessageCircle } from "lucide-react";
import Image from "next/image";
import { QRCodeShare } from "@/components/shared/QRCodeShare";

interface ArtisanProfilePageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export async function generateMetadata({ params }: ArtisanProfilePageProps) {
  const { slug } = await params;
  const artisan = await prisma.artisan.findUnique({ where: { slug } });
  if (!artisan) return { title: "Artisan Not Found" };
  return {
    title: `${artisan.shopName} — قورارة أطلس`,
    description: artisan.bio || `Shop handmade crafts from ${artisan.shopName}`,
  };
}

export default async function ArtisanProfilePage({ params }: ArtisanProfilePageProps) {
  const { locale, slug } = await params;
  const session = await getSession();
  const user = session ? { name: session.email.split("@")[0], role: session.role } : null;
  const isAr = locale === "ar";

  let partnerData: any = await prisma.artisan.findUnique({
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

  let partnerType = "ARTISAN";

  if (!partnerData) {
    partnerData = await prisma.serviceProvider.findUnique({
      where: { slug, isApproved: true },
      include: {
        user: { select: { firstName: true, lastName: true } },
        services: {
          where: { isPublished: true },
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            reviews: { select: { rating: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (partnerData) {
      partnerType = "PROVIDER";
    }
  }

  if (!partnerData) notFound();

  // Normalize data for UI
  const name = partnerType === "ARTISAN" ? partnerData.shopName : partnerData.businessName;
  const specialization = partnerType === "ARTISAN" ? partnerData.specialization : (isAr ? "مزود خدمة" : "Service Provider");
  const bio = isAr ? (partnerData.bioAr || partnerData.descriptionAr || partnerData.bio || partnerData.description) : (partnerData.bio || partnerData.description);
  const location = partnerData.location;
  const avatarUrl = partnerData.avatarUrl;
  const coverUrl = partnerData.coverUrl;
  const email = partnerType === "ARTISAN" ? partnerData.user.email : partnerData.contactEmail;
  const phone = partnerType === "ARTISAN" ? partnerData.phone : partnerData.contactPhone;
  const items = partnerType === "ARTISAN" ? partnerData.products : partnerData.services;
  
  // Compute overall rating across all items
  const allRatings = items.flatMap((p: any) => p.reviews.map((r: any) => r.rating));
  const avgRating = allRatings.length > 0
    ? allRatings.reduce((a: number, b: number) => a + b, 0) / allRatings.length
    : null;

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
          {coverUrl && (
            <Image
              src={coverUrl}
              alt={`${name} cover`}
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
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  name.charAt(0)
                )}
              </div>

              {/* Info */}
              <div className={`flex-1 min-w-0 ${isAr ? "text-right" : ""}`}>
                <h1 className="font-display text-3xl font-bold text-clay-800 leading-tight">
                  {name}
                </h1>
                {specialization && (
                  <p className="text-oasis-600 font-medium mt-1">{specialization}</p>
                )}

                <div className={`flex flex-wrap gap-4 mt-3 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                  {location && (
                    <div className="flex items-center gap-1.5 text-sm text-clay-500">
                      <MapPin className="w-4 h-4 text-sand-500 shrink-0" />
                      {location}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-clay-500">
                    <Package className="w-4 h-4 text-sand-500 shrink-0" />
                    {items.length} {partnerType === "ARTISAN" ? (isAr ? "منتج" : "products") : (isAr ? "خدمة" : "services")}
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
              <div className={`flex flex-wrap gap-2 shrink-0 ${isAr ? "mr-auto" : "ml-auto"}`}>
                <QRCodeShare url={`/${locale}/artisans/${slug}`} title={name} />
                {phone && (
                  <a
                    href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    {isAr ? "تواصل" : "WhatsApp"}
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
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

          {/* Items List */}
          <div className="mb-16">
            <div className={`flex items-center justify-between mb-6 ${isAr ? "flex-row-reverse" : ""}`}>
              <h2 className="font-display text-2xl font-bold text-clay-800">
                {partnerType === "ARTISAN" ? (isAr ? "منتجات الحرفي" : "Products") : (isAr ? "الخدمات المقدمة" : "Services")}
              </h2>
              {items.length > 0 && (
                <span className="text-sm text-clay-400">
                  {items.length} {partnerType === "ARTISAN" ? (isAr ? "منتج" : "items") : (isAr ? "خدمة" : "services")}
                </span>
              )}
            </div>

            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item: any) => {
                  const avgItemRating =
                    item.reviews.length > 0
                      ? item.reviews.reduce((a: number, r: any) => a + r.rating, 0) / item.reviews.length
                      : undefined;

                  if (partnerType === "ARTISAN") {
                    return (
                      <ProductCard
                        key={item.id}
                        id={item.id}
                        slug={item.slug}
                        name={item.name}
                        nameAr={item.nameAr}
                        imageUrl={item.images[0]?.url}
                        artisanName={name}
                        artisanSlug={slug}
                        categoryName={item.category.name}
                        categoryNameAr={item.category.nameAr}
                        rating={avgItemRating}
                        reviewCount={item.reviews.length}
                        locale={locale}
                      />
                    );
                  } else {
                    return (
                      <a
                        href={`/${locale}/services/${item.slug}`}
                        key={item.id}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-desert-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
                      >
                        <div className="aspect-[4/3] bg-desert-100 relative overflow-hidden">
                          {item.images[0] ? (
                            <Image
                              src={item.images[0].url}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">
                              {item.type === "ACCOMMODATION" ? "🏨" : item.type === "TOUR" ? "🐪" : item.type === "TRANSPORT" ? "🚙" : "🎨"}
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-clay-900 shadow-sm">
                            {item.price} DZD
                          </div>
                          {avgItemRating && (
                            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white flex items-center gap-1">
                              ★ {avgItemRating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="text-xs font-bold text-oasis-600 mb-1 tracking-wider">{item.type}</div>
                          <h3 className="font-bold text-clay-900 leading-tight mb-2 group-hover:text-sand-600 transition-colors">
                            {isAr && item.nameAr ? item.nameAr : item.name}
                          </h3>
                        </div>
                      </a>
                    );
                  }
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-desert-200">
                <p className="text-5xl mb-4">{partnerType === "ARTISAN" ? "🏺" : "🤝"}</p>
                <p className="text-clay-400 font-medium">
                  {isAr ? "لا توجد عناصر بعد" : "No items listed yet."}
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
