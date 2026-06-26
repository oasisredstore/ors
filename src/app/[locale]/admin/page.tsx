import { prisma } from "@/lib/prisma";
import {
  Users, UserCheck, Package, Star, ShoppingBag,
  TrendingUp, Clock, CheckCircle2, XCircle, ArrowRight,
  AlertTriangle, Eye,
} from "lucide-react";
import Link from "next/link";

interface AdminPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  const [
    totalUsers,
    totalArtisans,
    pendingArtisans,
    totalProducts,
    publishedProducts,
    totalReviews,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.artisan.count(),
    prisma.artisan.count({ where: { isApproved: false } }),
    prisma.product.count(),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.review.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
  ]);

  // Recent products
  const recentProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      artisan: { select: { shopName: true } },
      category: { select: { name: true, nameAr: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });

  // Recent orders for activity feed
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
  });

  // Pending artisans list
  const pendingArtisanList = await prisma.artisan.findMany({
    where: { isApproved: false },
    take: 3,
    include: { user: { select: { firstName: true, lastName: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const approvalRate = totalArtisans > 0
    ? Math.round(((totalArtisans - pendingArtisans) / totalArtisans) * 100)
    : 0;
  const publishRate = totalProducts > 0
    ? Math.round((publishedProducts / totalProducts) * 100)
    : 0;
  const deliveryRate = totalOrders > 0
    ? Math.round((deliveredOrders / totalOrders) * 100)
    : 0;

  const stats = [
    {
      labelEn: "Customers",
      labelAr: "العملاء",
      value: totalUsers,
      icon: Users,
      gradient: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50",
      href: `/${locale}/admin/users`,
    },
    {
      labelEn: "Artisans",
      labelAr: "الحرفيون",
      value: `${totalArtisans}`,
      subValue: pendingArtisans > 0 ? `${pendingArtisans} ${isRTL ? "معلق" : "pending"}` : null,
      icon: UserCheck,
      gradient: "from-oasis-500 to-emerald-500",
      bg: "bg-oasis-50",
      href: `/${locale}/admin/artisans`,
      alert: pendingArtisans > 0,
    },
    {
      labelEn: "Products",
      labelAr: "المنتجات",
      value: `${publishedProducts}/${totalProducts}`,
      subValue: isRTL ? "منشور" : "live",
      icon: Package,
      gradient: "from-sand-500 to-amber-500",
      bg: "bg-sand-50",
      href: `/${locale}/admin/products`,
    },
    {
      labelEn: "Orders",
      labelAr: "الطلبات",
      value: totalOrders,
      subValue: pendingOrders > 0 ? `${pendingOrders} ${isRTL ? "قيد الانتظار" : "pending"}` : null,
      icon: ShoppingBag,
      gradient: "from-purple-500 to-violet-500",
      bg: "bg-purple-50",
      href: `/${locale}/admin/orders`,
      alert: pendingOrders > 0,
    },
    {
      labelEn: "Reviews",
      labelAr: "التقييمات",
      value: totalReviews,
      icon: Star,
      gradient: "from-amber-500 to-yellow-500",
      bg: "bg-amber-50",
      href: null,
    },
  ];

  const kpis = [
    { labelEn: "Artisan Approval Rate", labelAr: "معدل قبول الحرفيين", value: approvalRate, icon: CheckCircle2, color: "text-oasis-600" },
    { labelEn: "Product Publish Rate", labelAr: "معدل نشر المنتجات", value: publishRate, icon: Eye, color: "text-blue-600" },
    { labelEn: "Delivery Rate", labelAr: "معدل التوصيل", value: deliveryRate, icon: TrendingUp, color: "text-sand-600" },
  ];

  const orderStatusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-oasis-100 text-oasis-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  const orderStatusLabels: Record<string, { en: string; ar: string }> = {
    PENDING: { en: "Pending", ar: "قيد الانتظار" },
    CONFIRMED: { en: "Confirmed", ar: "مؤكد" },
    PROCESSING: { en: "Processing", ar: "جاري التحضير" },
    SHIPPED: { en: "Shipped", ar: "تم الشحن" },
    DELIVERED: { en: "Delivered", ar: "تم التوصيل" },
    CANCELLED: { en: "Cancelled", ar: "ملغى" },
  };

  return (
    <div className="p-5 lg:p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-clay-800">
          {isRTL ? "لوحة الإدارة 🛡️" : "Admin Dashboard 🛡️"}
        </h1>
        <p className="text-clay-400 text-sm mt-1">
          {isRTL ? "نظرة عامة على أداء المنصة" : "Platform performance overview"}
        </p>
      </div>

      {/* Pending Artisans Alert */}
      {pendingArtisans > 0 && (
        <div className={`bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className={isRTL ? "text-right" : ""}>
              <p className="font-bold text-amber-800 text-sm">
                {isRTL
                  ? `${pendingArtisans} حرفي بانتظار الموافقة`
                  : `${pendingArtisans} artisan${pendingArtisans > 1 ? "s" : ""} awaiting approval`}
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                {isRTL ? "راجع وافق على طلبات الحرفيين الجدد" : "Review and approve new artisan applications"}
              </p>
            </div>
          </div>
          <Link
            href={`/${locale}/admin/artisans`}
            className="flex items-center gap-1.5 text-sm font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            {isRTL ? "مراجعة" : "Review"} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const card = (
            <div
              className={`${stat.bg} rounded-2xl border border-white/80 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${stat.href ? "cursor-pointer" : ""}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className={`text-xl lg:text-2xl font-bold text-clay-800 leading-tight ${isRTL ? "text-right" : ""}`}>
                {stat.value}
              </p>
              {stat.subValue && (
                <p className={`text-[10px] font-semibold mt-0.5 ${stat.alert ? "text-amber-600" : "text-clay-400"}`}>
                  {stat.subValue}
                </p>
              )}
              <p className={`text-[11px] text-clay-400 mt-1 ${isRTL ? "text-right" : ""}`}>
                {isRTL ? stat.labelAr : stat.labelEn}
              </p>
            </div>
          );
          return stat.href ? (
            <Link key={stat.labelEn} href={stat.href} className="block">{card}</Link>
          ) : (
            <div key={stat.labelEn}>{card}</div>
          );
        })}
      </div>

      {/* KPI Bar */}
      <div className="bg-white rounded-2xl border border-desert-200 p-5 shadow-sm">
        <h2 className={`font-bold text-clay-800 text-sm mb-4 ${isRTL ? "text-right" : ""}`}>
          {isRTL ? "مؤشرات الأداء الرئيسية" : "Key Performance Indicators"}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.labelEn} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <kpi.icon className={`w-4 h-4 mr-1 ${kpi.color}`} />
                <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}%</span>
              </div>
              <div className="h-1.5 bg-desert-100 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${
                    kpi.color.includes("oasis") ? "from-oasis-400 to-oasis-600" :
                    kpi.color.includes("blue") ? "from-blue-400 to-blue-600" :
                    "from-sand-400 to-sand-600"
                  } transition-all duration-700`}
                  style={{ width: `${kpi.value}%` }}
                />
              </div>
              <p className="text-[10px] text-clay-400 font-medium">
                {isRTL ? kpi.labelAr : kpi.labelEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column: Recent Products + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Products Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-desert-200 shadow-sm overflow-hidden">
          <div className={`px-5 py-4 border-b border-desert-100 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <h2 className="font-bold text-clay-800">{isRTL ? "أحدث المنتجات" : "Recent Products"}</h2>
            <Link href={`/${locale}/admin/products`} className="text-xs font-semibold text-sand-600 hover:text-sand-700 flex items-center gap-1">
              {isRTL ? "عرض الكل" : "View All"} <ArrowRight className="w-3 h-3" />
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
                      className={`text-[10px] font-bold text-clay-400 uppercase tracking-wider px-5 py-3 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-desert-50">
                {recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-desert-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-desert-100 overflow-hidden shrink-0 flex items-center justify-center ring-1 ring-desert-200">
                          {product.images[0]?.url ? (
                            <img src={product.images[0].url} alt="" className="w-8 h-8 object-cover" />
                          ) : (
                            <span className="text-base">🏺</span>
                          )}
                        </div>
                        <span className="text-sm text-clay-700 font-medium truncate max-w-[120px]">
                          {isRTL && product.nameAr ? product.nameAr : product.name}
                        </span>
                      </div>
                    </td>
                    <td className={`px-5 py-3 text-sm text-clay-500 ${isRTL ? "text-right" : ""}`}>
                      {product.artisan.shopName}
                    </td>
                    <td className={`px-5 py-3 text-xs text-clay-400 ${isRTL ? "text-right" : ""}`}>
                      {isRTL ? product.category.nameAr : product.category.name}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${product.isPublished ? "bg-green-100 text-green-700" : "bg-clay-100 text-clay-500"}`}>
                        {product.isPublished ? (isRTL ? "منشور" : "Live") : (isRTL ? "مسودة" : "Draft")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          {/* Pending Artisans Quick Review */}
          {pendingArtisanList.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
              <div className={`px-4 py-3 border-b border-amber-100 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-clay-800">{isRTL ? "حرفيون معلقون" : "Pending Artisans"}</h3>
                </div>
                <span className="w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingArtisans}
                </span>
              </div>
              <div className="divide-y divide-amber-50">
                {pendingArtisanList.map((artisan) => (
                  <div key={artisan.id} className={`px-4 py-3 flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-amber-700">
                        {artisan.user.firstName?.[0]}{artisan.user.lastName?.[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-clay-800 truncate">
                        {artisan.user.firstName} {artisan.user.lastName}
                      </p>
                      <p className="text-[10px] text-clay-400 truncate">{artisan.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 bg-amber-50">
                <Link
                  href={`/${locale}/admin/artisans`}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center justify-center gap-1"
                >
                  {isRTL ? "مراجعة الكل" : "Review All"} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Recent Orders Feed */}
          <div className="bg-white rounded-2xl border border-desert-200 shadow-sm overflow-hidden">
            <div className={`px-4 py-3 border-b border-desert-100 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <h3 className="text-sm font-bold text-clay-800">{isRTL ? "آخر الطلبات" : "Recent Orders"}</h3>
              <Link href={`/${locale}/admin/orders`} className="text-[10px] font-semibold text-sand-600 hover:text-sand-700">
                {isRTL ? "الكل" : "All"}
              </Link>
            </div>
            <div className="divide-y divide-desert-50">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <div key={order.id} className={`px-4 py-3 flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-7 h-7 rounded-lg bg-desert-100 flex items-center justify-center shrink-0">
                    {order.status === "DELIVERED" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : order.status === "CANCELLED" ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-clay-800 truncate">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-[10px] text-clay-400">
                      #{order.id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${orderStatusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {isRTL ? orderStatusLabels[order.status]?.ar : orderStatusLabels[order.status]?.en}
                  </span>
                </div>
              )) : (
                <div className="py-8 text-center text-clay-300">
                  <p className="text-sm">{isRTL ? "لا طلبات بعد" : "No orders yet"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
