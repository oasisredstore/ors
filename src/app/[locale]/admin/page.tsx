import { prisma } from "@/lib/prisma";
import { Users, UserCheck, Package, Star } from "lucide-react";
import Link from "next/link";

interface AdminPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  const [
    totalUsers, totalArtisans, pendingArtisans, totalProducts, publishedProducts, totalReviews,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.artisan.count(),
    prisma.artisan.count({ where: { isApproved: false } }),
    prisma.product.count(),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.review.count(),
  ]);

  const stats = [
    {
      labelEn: "Total Visitors",
      labelAr: "إجمالي الزوار",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      labelEn: "Artisans",
      labelAr: "الحرفيون",
      value: isRTL
        ? `${totalArtisans} (${pendingArtisans} في الانتظار)`
        : `${totalArtisans} (${pendingArtisans} pending)`,
      icon: UserCheck,
      color: "bg-oasis-50 text-oasis-600",
    },
    {
      labelEn: "Products",
      labelAr: "المنتجات",
      value: isRTL
        ? `${publishedProducts}/${totalProducts} منشور`
        : `${publishedProducts}/${totalProducts} live`,
      icon: Package,
      color: "bg-sand-50 text-sand-600",
    },
    {
      labelEn: "Reviews",
      labelAr: "التقييمات",
      value: totalReviews,
      icon: Star,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  // Recent products for overview
  const recentProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      artisan: { select: { shopName: true } },
      category: { select: { name: true, nameAr: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });

  return (
    <div className="p-6 lg:p-8">
      <div className={`mb-8 ${isRTL ? "text-right" : ""}`}>
        <h1 className="font-display text-3xl font-bold text-clay-800">
          {isRTL ? "لوحة الإدارة" : "Admin Dashboard"}
        </h1>
        <p className="text-clay-400 text-sm mt-1">
          {isRTL ? "نظرة عامة على منصة العرض" : "Platform overview and metrics"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.labelEn} className="bg-white rounded-2xl border border-desert-200 p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className={`text-xl font-bold text-clay-800 leading-tight ${isRTL ? "text-right" : ""}`}>
              {stat.value}
            </p>
            <p className={`text-xs text-clay-400 mt-1 ${isRTL ? "text-right" : ""}`}>
              {isRTL ? stat.labelAr : stat.labelEn}
            </p>
          </div>
        ))}
      </div>

      {/* Pending Artisans Alert */}
      {pendingArtisans > 0 && (
        <div className={`bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : ""}>
            <p className="font-semibold text-amber-800 text-sm">
              ⏳{" "}
              {isRTL
                ? `${pendingArtisans} حرفي بانتظار الموافقة`
                : `${pendingArtisans} artisan${pendingArtisans > 1 ? "s" : ""} awaiting approval`}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {isRTL ? "راجع وافق على طلبات الحرفيين" : "Review and approve artisan applications"}
            </p>
          </div>
          <Link
            href={`/${locale}/admin/artisans`}
            className="text-sm font-semibold text-amber-800 hover:text-amber-900 bg-amber-100 px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            {isRTL ? "← مراجعة" : "Review →"}
          </Link>
        </div>
      )}

      {/* Recent Products Table */}
      <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden">
        <div className={`p-5 border-b border-desert-100 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <h2 className="font-semibold text-clay-800">
            {isRTL ? "أحدث المنتجات" : "Recent Products"}
          </h2>
          <Link href={`/${locale}/admin/products`} className="text-sm text-sand-600 font-medium hover:text-sand-700">
            {isRTL ? "عرض الكل ←" : "View All →"}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" dir={isRTL ? "rtl" : "ltr"}>
            <thead className="bg-desert-50">
              <tr>
                {(isRTL
                  ? ["الحالة", "الفئة", "الحرفي", "المنتج"]
                  : ["Product", "Artisan", "Category", "Status"]
                ).map((h) => (
                  <th
                    key={h}
                    className={`text-xs font-semibold text-clay-500 uppercase px-5 py-3 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-desert-100">
              {recentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-desert-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-desert-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {product.images[0]?.url ? (
                          <img src={product.images[0].url} alt="" className="w-8 h-8 object-cover" />
                        ) : <span>🏺</span>}
                      </div>
                      <span className={`text-sm text-clay-700 ${isRTL ? "text-right" : ""}`}>
                        {isRTL && product.nameAr ? product.nameAr : product.name}
                      </span>
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-sm text-clay-600 ${isRTL ? "text-right" : ""}`}>
                    {product.artisan.shopName}
                  </td>
                  <td className={`px-5 py-3.5 text-sm text-clay-500 ${isRTL ? "text-right" : ""}`}>
                    {isRTL ? product.category.nameAr : product.category.name}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.isPublished ? "bg-green-100 text-green-700" : "bg-clay-100 text-clay-500"}`}>
                      {product.isPublished
                        ? (isRTL ? "منشور" : "Live")
                        : (isRTL ? "مسودة" : "Draft")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
