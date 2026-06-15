import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Package, Star, Eye, ImageIcon } from "lucide-react";
import Link from "next/link";

interface DashboardPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/login`);

  const isArtisan = session.role === "ARTISAN";
  const isAr = locale === "ar";

  if (isArtisan) {
    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: {
        products: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            reviews: { select: { rating: true } },
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!artisan) redirect(`/${locale}`);

    const totalProducts = await prisma.product.count({ where: { artisanId: artisan.id } });
    const publishedProducts = await prisma.product.count({ where: { artisanId: artisan.id, isPublished: true } });
    const featuredProducts = await prisma.product.count({ where: { artisanId: artisan.id, isFeatured: true } });
    const totalReviews = await prisma.review.count({ where: { product: { artisanId: artisan.id } } });

    const stats = [
      { label: isAr ? "إجمالي المنتجات" : "Total Products", value: totalProducts, icon: Package, color: "bg-sand-100 text-sand-700" },
      { label: isAr ? "المنشورة" : "Published", value: publishedProducts, icon: Eye, color: "bg-oasis-100 text-oasis-700" },
      { label: isAr ? "المميزة" : "Featured", value: featuredProducts, icon: Star, color: "bg-amber-100 text-amber-700" },
      { label: isAr ? "التقييمات" : "Reviews", value: totalReviews, icon: ImageIcon, color: "bg-blue-100 text-blue-700" },
    ];

    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-clay-800">
            {isAr ? `مرحباً، ${artisan.shopName}` : `Welcome, ${artisan.shopName}`}
          </h1>
          {!artisan.isApproved && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800 font-medium">
                {isAr ? "⏳ حسابك في انتظار موافقة المشرف. سيتم إعلامك عند القبول." : "⏳ Your account is pending admin approval."}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-desert-200 p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-clay-800">{stat.value}</p>
              <p className="text-xs text-clay-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-desert-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-clay-800">{isAr ? "أحدث المنتجات" : "Recent Products"}</h2>
            <Link href={`/${locale}/dashboard/products`} className="text-sm text-sand-600 hover:text-sand-700 font-medium">
              {isAr ? "عرض الكل" : "View All"}
            </Link>
          </div>
          <div className="space-y-3">
            {artisan.products.length > 0 ? (
              artisan.products.map((p) => {
                const avgRating = p.reviews.length > 0 ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length : null;
                return (
                  <div key={p.id} className="flex items-center gap-3 py-2 border-b border-desert-100 last:border-0">
                    <div className="w-10 h-10 rounded-lg bg-desert-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {p.images[0]?.url ? <img src={p.images[0].url} alt={p.name} className="w-10 h-10 object-cover" /> : <span className="text-lg">🏺</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-clay-800 truncate">{p.name}</p>
                      {avgRating && <p className="text-xs text-amber-500">★ {avgRating.toFixed(1)}</p>}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.isPublished ? "bg-green-100 text-green-700" : "bg-clay-100 text-clay-500"}`}>
                      {p.isPublished ? (isAr ? "منشور" : "Live") : (isAr ? "مسودة" : "Draft")}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-clay-400 text-center py-6">{isAr ? "لا توجد منتجات بعد" : "No products yet."}</p>
            )}
          </div>
          <Link href={`/${locale}/dashboard/products/new`} className="mt-4 block text-center bg-gradient-to-r from-sand-500 to-sand-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:from-sand-600 hover:to-sand-700 transition-all">
            + {isAr ? "إضافة منتج جديد" : "Add New Product"}
          </Link>
        </div>
      </div>
    );
  } else {
    // Provider Dashboard
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: session.userId },
      include: {
        services: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            reviews: { select: { rating: true } },
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!provider) redirect(`/${locale}`);

    const totalServices = await prisma.service.count({ where: { providerId: provider.id } });
    const publishedServices = await prisma.service.count({ where: { providerId: provider.id, isPublished: true } });
    const totalBookings = await prisma.booking.count({ where: { service: { providerId: provider.id } } });
    const totalReviews = await prisma.serviceReview.count({ where: { service: { providerId: provider.id } } });

    const stats = [
      { label: isAr ? "إجمالي الخدمات" : "Total Services", value: totalServices, icon: Package, color: "bg-sand-100 text-sand-700" },
      { label: isAr ? "المنشورة" : "Published", value: publishedServices, icon: Eye, color: "bg-oasis-100 text-oasis-700" },
      { label: isAr ? "الحجوزات" : "Bookings", value: totalBookings, icon: Star, color: "bg-amber-100 text-amber-700" },
      { label: isAr ? "التقييمات" : "Reviews", value: totalReviews, icon: ImageIcon, color: "bg-blue-100 text-blue-700" },
    ];

    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-clay-800">
            {isAr ? `مرحباً، ${provider.businessName}` : `Welcome, ${provider.businessName}`}
          </h1>
          {!provider.isApproved && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800 font-medium">
                {isAr ? "⏳ حسابك في انتظار موافقة المشرف. سيتم إعلامك عند القبول." : "⏳ Your account is pending admin approval."}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-desert-200 p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-clay-800">{stat.value}</p>
              <p className="text-xs text-clay-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-desert-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-clay-800">{isAr ? "أحدث الخدمات" : "Recent Services"}</h2>
            <Link href={`/${locale}/dashboard/services`} className="text-sm text-sand-600 hover:text-sand-700 font-medium">
              {isAr ? "عرض الكل" : "View All"}
            </Link>
          </div>
          <div className="space-y-3">
            {provider.services.length > 0 ? (
              provider.services.map((s) => {
                const avgRating = s.reviews.length > 0 ? s.reviews.reduce((a, r) => a + r.rating, 0) / s.reviews.length : null;
                return (
                  <div key={s.id} className="flex items-center gap-3 py-2 border-b border-desert-100 last:border-0">
                    <div className="w-10 h-10 rounded-lg bg-desert-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {s.images[0]?.url ? <img src={s.images[0].url} alt={s.name} className="w-10 h-10 object-cover" /> : <span className="text-lg">🏨</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-clay-800 truncate">{s.name}</p>
                      {avgRating && <p className="text-xs text-amber-500">★ {avgRating.toFixed(1)}</p>}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.isPublished ? "bg-green-100 text-green-700" : "bg-clay-100 text-clay-500"}`}>
                      {s.isPublished ? (isAr ? "منشور" : "Live") : (isAr ? "مسودة" : "Draft")}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-clay-400 text-center py-6">{isAr ? "لا توجد خدمات بعد" : "No services yet."}</p>
            )}
          </div>
          <Link href={`/${locale}/dashboard/services/new`} className="mt-4 block text-center bg-gradient-to-r from-sand-500 to-sand-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:from-sand-600 hover:to-sand-700 transition-all">
            + {isAr ? "إضافة خدمة جديدة" : "Add New Service"}
          </Link>
        </div>
      </div>
    );
  }
}
