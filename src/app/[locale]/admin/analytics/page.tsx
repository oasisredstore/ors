import { prisma } from "@/lib/prisma";
import { Star, Users, Package, Eye, TrendingUp, ShoppingBag, BarChart3 } from "lucide-react";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";

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
  const [totalUsers, activeProducts, totalReviews, featuredProducts, totalOrders, totalArtisans] =
    await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.review.count(),
      prisma.product.count({ where: { isFeatured: true } }),
      prisma.order.count(),
      prisma.artisan.count({ where: { isApproved: true } }),
    ]);

  // Orders by status for doughnut chart
  const ordersByStatusRaw = await prisma.order.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  const ordersByStatus = ordersByStatusRaw.map((s) => ({
    status: s.status,
    count: s._count.id,
  }));

  // Revenue data: last 7 days grouped by day
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: { notIn: ["CANCELLED"] },
    },
    select: { createdAt: true, totalAmount: true },
    orderBy: { createdAt: "asc" },
  });

  // Build 7-day revenue array
  const revenueMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    revenueMap[key] = 0;
  }
  recentOrders.forEach((o) => {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (key in revenueMap) revenueMap[key] += o.totalAmount;
  });
  const revenueData = Object.entries(revenueMap).map(([date, amount]) => ({
    date: new Date(date).toLocaleDateString(isRTL ? "ar-DZ" : "en-US", { month: "short", day: "numeric" }),
    amount,
  }));

  // Top artisans by product count
  const topArtisans = await prisma.artisan.findMany({
    where: { isApproved: true },
    include: {
      _count: { select: { products: { where: { isPublished: true } } } },
      user: { select: { firstName: true, lastName: true } },
    },
    orderBy: { products: { _count: "desc" } },
    take: 5,
  });

  // Top products (by order items)
  const topProductsRaw = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });
  const topProductIds = topProductsRaw.map((p) => p.productId);
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, nameAr: true },
  });
  const topProducts = topProductsRaw.map((p) => {
    const detail = topProductDetails.find((d) => d.id === p.productId);
    return {
      name: (isRTL && detail?.nameAr ? detail.nameAr : detail?.name) ?? "Unknown",
      sales: p._sum.quantity ?? 0,
    };
  });

  const summaryStats = [
    {
      label: isRTL ? "العملاء المسجلون" : "Registered Customers",
      value: totalUsers,
      icon: Users,
      gradient: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50",
      trend: null,
    },
    {
      label: isRTL ? "المنتجات النشطة" : "Active Products",
      value: activeProducts,
      icon: Eye,
      gradient: "from-oasis-500 to-emerald-500",
      bg: "bg-oasis-50",
      trend: null,
    },
    {
      label: isRTL ? "الطلبات" : "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      gradient: "from-purple-500 to-violet-500",
      bg: "bg-purple-50",
      trend: null,
    },
    {
      label: isRTL ? "الحرفيون المعتمدون" : "Approved Artisans",
      value: totalArtisans,
      icon: Users,
      gradient: "from-sand-500 to-amber-500",
      bg: "bg-sand-50",
      trend: null,
    },
    {
      label: isRTL ? "التقييمات" : "Reviews",
      value: totalReviews,
      icon: Star,
      gradient: "from-amber-500 to-yellow-500",
      bg: "bg-amber-50",
      trend: null,
    },
    {
      label: isRTL ? "المنتجات المميزة" : "Featured Products",
      value: featuredProducts,
      icon: Package,
      gradient: "from-rose-500 to-pink-500",
      bg: "bg-rose-50",
      trend: null,
    },
  ];

  return (
    <div className="p-5 lg:p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-clay-800 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-sand-600" />
          {isRTL ? "الإحصائيات والتحليلات" : "Analytics & Insights"}
        </h1>
        <p className="text-clay-400 text-sm mt-1">
          {isRTL ? "مؤشرات أداء المنصة التفصيلية" : "Detailed platform performance metrics"}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-2xl border border-white/80 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-sm`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-clay-800">{stat.value}</p>
            <p className={`text-[10px] text-clay-500 mt-0.5 leading-tight ${isRTL ? "text-right" : ""}`}>
              {stat.label}
            </p>
            {stat.trend && (
              <p className="text-[10px] font-semibold text-oasis-600 mt-1 flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> {stat.trend}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <AnalyticsCharts
        revenueData={revenueData}
        ordersByStatus={ordersByStatus}
        topProducts={topProducts}
      />

      {/* Bottom: Categories + Top Artisans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Products by Category */}
        <div className="bg-white rounded-2xl border border-desert-200 p-6 shadow-sm">
          <h2 className={`font-bold text-clay-800 mb-5 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Package className="w-4 h-4 text-sand-600" />
            {isRTL ? "المنتجات حسب الفئة" : "Products by Category"}
          </h2>
          <div className="space-y-4">
            {categories.filter((c) => c._count.products > 0).map((cat, idx) => {
              const pct =
                activeProducts > 0
                  ? Math.round((cat._count.products / activeProducts) * 100)
                  : 0;
              const colors = [
                "from-sand-400 to-amber-500",
                "from-oasis-400 to-emerald-500",
                "from-blue-400 to-indigo-500",
                "from-purple-400 to-violet-500",
                "from-rose-400 to-pink-500",
                "from-clay-400 to-clay-600",
              ];
              return (
                <div key={cat.id}>
                  <div className={`flex items-center justify-between mb-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="text-sm text-clay-700 font-medium">
                      {isRTL ? cat.nameAr : cat.name}
                    </span>
                    <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className="text-sm font-bold text-clay-800">{cat._count.products}</span>
                      <span className="text-xs text-clay-400">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-desert-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors[idx % colors.length]} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {categories.every((c) => c._count.products === 0) && (
              <p className="text-clay-400 text-sm text-center py-4">
                {isRTL ? "لا توجد منتجات بعد" : "No products yet"}
              </p>
            )}
          </div>
        </div>

        {/* Top Artisans */}
        <div className="bg-white rounded-2xl border border-desert-200 p-6 shadow-sm">
          <h2 className={`font-bold text-clay-800 mb-5 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Star className="w-4 h-4 text-amber-500" />
            {isRTL ? "أبرز الحرفيين" : "Top Artisans"}
          </h2>
          <div className="space-y-3">
            {topArtisans.length > 0 ? topArtisans.map((artisan, idx) => (
              <div key={artisan.id} className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="w-6 h-6 rounded-lg bg-desert-100 flex items-center justify-center text-xs font-bold text-clay-500 shrink-0">
                  {idx + 1}
                </span>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sand-400 to-clay-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">
                    {artisan.shopName?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-clay-800 truncate">{artisan.shopName}</p>
                  <p className="text-xs text-clay-400">
                    {artisan.user.firstName} {artisan.user.lastName}
                  </p>
                </div>
                <div className={`text-right ${isRTL ? "text-left" : ""}`}>
                  <p className="text-sm font-bold text-clay-800">{artisan._count.products}</p>
                  <p className="text-[10px] text-clay-400">{isRTL ? "منتج" : "products"}</p>
                </div>
              </div>
            )) : (
              <p className="text-clay-400 text-sm text-center py-6">
                {isRTL ? "لا حرفيين بعد" : "No artisans yet"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
