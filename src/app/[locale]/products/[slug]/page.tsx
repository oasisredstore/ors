import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailClient } from "@/components/marketplace/ProductDetailClient";
import { WriteReviewForm } from "@/components/marketplace/WriteReviewForm";

interface ProductDetailPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug, locale } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: locale === "ar" && product.nameAr ? product.nameAr : product.name,
    description: product.description || "Authentic handmade Saharan craft from Timimoun, Algeria",
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const session = await getSession();
  const user = session ? { name: session.email.split("@")[0], role: session.role } : null;
  const isAr = locale === "ar";

  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: {
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
      artisan: {
        select: {
          shopName: true,
          slug: true,
          bio: true,
          bioAr: true,
          avatarUrl: true,
          whatsapp: true,
          email: true,
          location: true,
          specialization: true,
        },
      },
      category: { select: { name: true, nameAr: true } },
      reviews: {
        where: { isVisible: true },
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!product) notFound();

  // Check if current user already reviewed this product
  let existingReview: { rating: number; comment: string | null } | null = null;
  if (session?.role === "CUSTOMER") {
    existingReview = await prisma.review.findUnique({
      where: { userId_productId: { userId: session.userId, productId: product.id } },
      select: { rating: true, comment: true },
    });
  }

  const canReview = session?.role === "CUSTOMER";

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-clay-400 mb-8">
            <a href={`/${locale}`} className="hover:text-sand-600">
              {isAr ? "الرئيسية" : "Home"}
            </a>
            {" / "}
            <a href={`/${locale}/products`} className="hover:text-sand-600">
              {isAr ? "المنتجات" : "Products"}
            </a>
            {" / "}
            <span className="text-clay-700">
              {isAr && product.nameAr ? product.nameAr : product.name}
            </span>
          </nav>

          <ProductDetailClient product={product} locale={locale} />

          {/* Reviews Section */}
          <section className="mt-16 pt-12 border-t border-desert-200">
            <h2 className={`font-display text-2xl font-bold text-clay-800 mb-6 ${isAr ? "text-right" : ""}`}>
              {isAr ? "التقييمات" : "Reviews"} ({product.reviews.length})
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reviews list */}
              <div className="lg:col-span-2">
                {product.reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.reviews.map((review, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-desert-200 p-5">
                        <div className={`flex items-center justify-between mb-2 ${isAr ? "flex-row-reverse" : ""}`}>
                          <span className="font-semibold text-clay-800 text-sm">
                            {review.user.firstName} {review.user.lastName}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <span key={j} className={`text-sm ${j < review.rating ? "text-amber-400" : "text-clay-200"}`}>★</span>
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className={`text-sm text-clay-600 leading-relaxed ${isAr ? "text-right" : ""}`}>{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-desert-200 p-10 text-center">
                    <p className="text-4xl mb-3">⭐</p>
                    <p className="text-clay-500 font-medium">
                      {isAr ? "لا توجد تقييمات بعد. كن أول من يقيّم!" : "No reviews yet. Be the first to review!"}
                    </p>
                  </div>
                )}
              </div>

              {/* Write review form or CTA */}
              <div className="lg:col-span-1">
                {canReview ? (
                  <WriteReviewForm
                    productId={product.id}
                    productSlug={product.slug}
                    locale={locale}
                    existingRating={existingReview?.rating}
                    existingComment={existingReview?.comment}
                  />
                ) : !session ? (
                  <div className="bg-desert-50 rounded-2xl border border-desert-200 p-6 text-center">
                    <p className="text-2xl mb-3">✍️</p>
                    <p className="text-sm text-clay-600 mb-4">
                      {isAr ? "سجّل دخولك لمشاركة تقييمك" : "Sign in to share your review"}
                    </p>
                    <a
                      href={`/${locale}/auth/login`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-sand-500 to-sand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-sand-600 hover:to-sand-700 transition-all"
                    >
                      {isAr ? "تسجيل الدخول" : "Sign In"}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
