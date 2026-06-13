import { prisma } from "@/lib/prisma";
import { Star, Users, Package, Eye } from "lucide-react";

interface AdminAnalyticsPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function AdminAnalyticsPage({ params }: AdminAnalyticsPageProps) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  // Products by category
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: { where: { isPublished: true } } } },
    },
    orderBy: { sortOrder: "asc" },
  });

  // Summary stats
  const [totalUsers, activeProducts, totalReviews, featuredProducts] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.review.count(),
    prisma.product.count({ where: { isFeatured: true } }),
  ]);

  const summaryStats = [
    { label: isRTL ? "الزوار المسجلون" : "Registered Visitors", value: totalUsers, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: isRTL ? "المنتجات النشطة" : "Active Products", value: activeProducts, icon: Eye, color: "text-oasis-600 bg-oasis-50" },
    { label: isRTL ? "التقييمات" : "Reviews", value: totalReviews, icon: Star, color: "text-amber-600 bg-amber-50" },
    { label: isRTL ? "المنتجات المميزة" : "Featured Products", value: featuredProducts, icon: Package, color: "text-sand-600 bg-sand-50" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className={`mb-8 ${isRTL ? "text-right" : ""}`}>
        <h1 className="font-display text-3xl font-bold text-clay-800">
          {isRTL ? "الإحصائيات" : "Analytics"}
        </h1>
        <p className="text-clay-400 text-sm mt-1">
          {isRTL ? "مؤشرات أداء المنصة" : "Platform performance metrics"}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-desert-200 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-clay-800">{stat.value}</p>
            <p className={`text-xs text-clay-400 mt-1 ${isRTL ? "text-right" : ""}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Products by Category */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6">
        <h2 className={`font-semibold text-clay-800 mb-5 ${isRTL ? "text-right" : ""}`}>
          {isRTL ? "المنتجات حسب الفئة" : "Products by Category"}
        </h2>
        <div className="space-y-4">
          {categories.filter(c => c._count.products > 0).map((cat) => {
            const pct = activeProducts > 0
              ? Math.round((cat._count.products / activeProducts) * 100)
              : 0;
            return (
              <div key={cat.id}>
                <div className={`flex items-center justify-between mb-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-sm text-clay-700 font-medium">{isRTL ? cat.nameAr : cat.name}</span>
                  <span className="text-sm text-clay-500">{cat._count.products} ({pct}%)</span>
                </div>
                <div className="h-2 bg-desert-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sand-500 to-sand-400 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {categories.every(c => c._count.products === 0) && (
            <p className="text-clay-400 text-sm text-center py-4">
              {isRTL ? "لا توجد منتجات بعد" : "No products yet"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
