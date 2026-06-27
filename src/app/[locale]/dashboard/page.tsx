import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  Package, Star, Eye, ImageIcon, Plus, ShoppingBag,
  MessageCircle, User, TrendingUp, CheckCircle2, Clock,
  Sparkles, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

  /* ─── ARTISAN DASHBOARD ─── */
  if (isArtisan) {
    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: {
        user: { select: { firstName: true, lastName: true } },
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

    const [totalProducts, publishedProducts, featuredProducts, totalReviews, pendingOrders] = await Promise.all([
      prisma.product.count({ where: { artisanId: artisan.id } }),
      prisma.product.count({ where: { artisanId: artisan.id, isPublished: true } }),
      prisma.product.count({ where: { artisanId: artisan.id, isFeatured: true } }),
      prisma.review.count({ where: { product: { artisanId: artisan.id } } }),
      prisma.order.count({
        where: {
          items: { some: { product: { artisanId: artisan.id } } },
          status: "PENDING",
        },
      }),
    ]);

    // Profile completion score
    const completionItems = [
      { done: !!artisan.bio, label: isAr ? "السيرة الذاتية" : "Bio" },
      { done: !!artisan.location, label: isAr ? "الموقع" : "Location" },
      { done: !!artisan.whatsapp, label: isAr ? "واتساب" : "WhatsApp" },
      { done: !!artisan.coverUrl, label: isAr ? "صورة الغلاف" : "Cover Image" },
      { done: totalProducts > 0, label: isAr ? "منتج واحد على الأقل" : "First Product" },
    ];
    const completionScore = Math.round(
      (completionItems.filter((i) => i.done).length / completionItems.length) * 100
    );

    const stats = [
      {
        label: isAr ? "إجمالي المنتجات" : "Total Products",
        value: totalProducts,
        icon: Package,
        gradient: "from-sand-500 to-sand-600",
        bg: "from-sand-50 to-amber-50",
        trend: publishedProducts > 0 ? `${publishedProducts} ${isAr ? "منشور" : "live"}` : null,
      },
      {
        label: isAr ? "المنشورة" : "Published",
        value: publishedProducts,
        icon: Eye,
        gradient: "from-oasis-500 to-oasis-600",
        bg: "from-oasis-50 to-emerald-50",
        trend: totalProducts > 0 ? `${Math.round((publishedProducts / totalProducts) * 100)}%` : null,
      },
      {
        label: isAr ? "المميزة" : "Featured",
        value: featuredProducts,
        icon: Star,
        gradient: "from-amber-500 to-yellow-500",
        bg: "from-amber-50 to-yellow-50",
        trend: null,
      },
      {
        label: isAr ? "التقييمات" : "Reviews",
        value: totalReviews,
        icon: ImageIcon,
        gradient: "from-blue-500 to-indigo-500",
        bg: "from-blue-50 to-indigo-50",
        trend: null,
      },
    ];

    const quickActions = [
      { href: `/${locale}/dashboard/products/new`, label: isAr ? "إضافة منتج" : "Add Product", icon: Plus, color: "bg-gradient-to-br from-sand-500 to-sand-600 text-white" },
      { href: `/${locale}/dashboard/orders`, label: isAr ? "الطلبات" : "Orders", icon: ShoppingBag, color: pendingOrders > 0 ? "bg-amber-500 text-white" : "bg-white border border-desert-200 text-clay-700", badge: pendingOrders > 0 ? pendingOrders : null },
      { href: `/${locale}/messages`, label: isAr ? "الرسائل" : "Messages", icon: MessageCircle, color: "bg-white border border-desert-200 text-clay-700" },
      { href: `/${locale}/dashboard/profile`, label: isAr ? "تعديل الملف" : "Edit Profile", icon: User, color: "bg-white border border-desert-200 text-clay-700" },
    ];

    return (
      <div className="p-5 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-clay-800">
              {isAr ? `مرحباً، ${artisan.shopName} 👋` : `Welcome back, ${artisan.shopName} 👋`}
            </h1>
            <p className="text-clay-400 text-sm mt-1">
              {isAr ? "إليك نظرة عامة على متجرك اليوم" : "Here's what's happening with your shop today"}
            </p>
          </div>
          {!artisan.isApproved && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 hidden lg:flex">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 font-medium">
                {isAr ? "في انتظار موافقة المشرف" : "Pending admin approval"}
              </p>
            </div>
          )}
          {artisan.isApproved && (
            <div className="hidden lg:flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-2.5">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-700">{isAr ? "حساب معتمد" : "Verified Account"}</span>
            </div>
          )}
        </div>

        {/* Mobile pending warning */}
        {!artisan.isApproved && (
          <div className="lg:hidden flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700 font-medium">
              {isAr ? "⏳ حسابك في انتظار موافقة المشرف." : "⏳ Your account is pending admin approval."}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`relative flex flex-col items-center gap-2 p-3 lg:p-4 rounded-2xl text-center shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${action.color}`}
            >
              {action.badge && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {action.badge}
                </span>
              )}
              <action.icon className="w-5 h-5" />
              <span className="text-[10px] lg:text-xs font-semibold leading-tight">
                {action.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.bg} rounded-2xl border border-white/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-clay-800">{stat.value}</p>
              <p className="text-xs text-clay-500 mt-0.5">{stat.label}</p>
              {stat.trend && (
                <p className="text-[10px] font-semibold text-oasis-600 mt-1 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> {stat.trend}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Profile Completion */}
        {completionScore < 100 && (
          <div className="bg-white rounded-2xl border border-desert-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-clay-800">
                  {isAr ? "اكتمال الملف الشخصي" : "Profile Completion"}
                </h3>
                <p className="text-xs text-clay-400 mt-0.5">
                  {isAr ? "أكمل ملفك لتحسين ظهورك" : "Complete your profile to boost visibility"}
                </p>
              </div>
              <span className={`text-xl font-bold ${completionScore >= 80 ? "text-oasis-600" : completionScore >= 50 ? "text-amber-600" : "text-red-500"}`}>
                {completionScore}%
              </span>
            </div>
            <div className="h-2 bg-desert-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-sand-500 to-oasis-500 rounded-full transition-all duration-700"
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
              {completionItems.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${item.done ? "text-oasis-500" : "text-clay-200"}`}
                  />
                  <span className={`text-[10px] ${item.done ? "text-clay-600 line-through" : "text-clay-400"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href={`/${locale}/dashboard/profile`}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sand-600 hover:text-sand-700"
            >
              {isAr ? "إكمال الملف" : "Complete Profile"} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Recent Products */}
        <div className="bg-white rounded-2xl border border-desert-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-desert-100">
            <h2 className="font-bold text-clay-800">{isAr ? "أحدث المنتجات" : "Recent Products"}</h2>
            <Link
              href={`/${locale}/dashboard/products`}
              className="text-xs font-semibold text-sand-600 hover:text-sand-700 flex items-center gap-1"
            >
              {isAr ? "عرض الكل" : "View All"} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-desert-50">
            {artisan.products.length > 0 ? (
              artisan.products.map((p) => {
                const avgRating =
                  p.reviews.length > 0
                    ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length
                    : null;
                return (
                  <div key={p.id} className="flex items-center gap-3.5 px-5 py-3 hover:bg-desert-50 transition-colors">
                    <div className="relative w-11 h-11 rounded-xl bg-desert-100 flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-desert-200">
                      {p.images[0]?.url ? (
                        <Image src={p.images[0].url} alt={p.name} fill className="object-cover" sizes="44px" />
                      ) : (
                        <span className="text-xl">🏺</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-clay-800 truncate">{p.name}</p>
                      {avgRating && (
                        <p className="text-xs text-amber-500 flex items-center gap-0.5">
                          ★ {avgRating.toFixed(1)}
                          <span className="text-clay-300 ml-1">({p.reviews.length})</span>
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        p.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-clay-100 text-clay-500"
                      }`}
                    >
                      {p.isPublished ? (isAr ? "منشور" : "Live") : (isAr ? "مسودة" : "Draft")}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <p className="text-3xl mb-2">🏺</p>
                <p className="text-sm text-clay-400">
                  {isAr ? "لا توجد منتجات بعد" : "No products yet"}
                </p>
              </div>
            )}
          </div>
          <div className="px-5 py-4 bg-desert-50/50">
            <Link
              href={`/${locale}/dashboard/products/new`}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-sand-500 to-sand-600 hover:from-sand-600 hover:to-sand-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              {isAr ? "إضافة منتج جديد" : "Add New Product"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─── PROVIDER DASHBOARD ─── */
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

  const [totalServices, publishedServices, totalBookings, totalReviews] = await Promise.all([
    prisma.service.count({ where: { providerId: provider.id } }),
    prisma.service.count({ where: { providerId: provider.id, isPublished: true } }),
    prisma.booking.count({ where: { service: { providerId: provider.id } } }),
    prisma.serviceReview.count({ where: { service: { providerId: provider.id } } }),
  ]);

  const pendingBookings = await prisma.booking.count({
    where: { service: { providerId: provider.id }, status: "PENDING" },
  });

  const completionItems = [
    { done: !!provider.description, label: isAr ? "الوصف" : "Description" },
    { done: !!provider.location, label: isAr ? "الموقع" : "Location" },
    { done: !!provider.contactPhone, label: isAr ? "الهاتف" : "Phone" },
    { done: !!provider.coverUrl, label: isAr ? "صورة الغلاف" : "Cover Image" },
    { done: totalServices > 0, label: isAr ? "خدمة واحدة على الأقل" : "First Service" },
  ];
  const completionScore = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) * 100
  );

  const stats = [
    {
      label: isAr ? "إجمالي الخدمات" : "Total Services",
      value: totalServices,
      icon: Package,
      gradient: "from-sand-500 to-sand-600",
      bg: "from-sand-50 to-amber-50",
      trend: publishedServices > 0 ? `${publishedServices} ${isAr ? "منشور" : "live"}` : null,
    },
    {
      label: isAr ? "المنشورة" : "Published",
      value: publishedServices,
      icon: Eye,
      gradient: "from-oasis-500 to-oasis-600",
      bg: "from-oasis-50 to-emerald-50",
      trend: null,
    },
    {
      label: isAr ? "الحجوزات" : "Bookings",
      value: totalBookings,
      icon: ShoppingBag,
      gradient: "from-amber-500 to-yellow-500",
      bg: "from-amber-50 to-yellow-50",
      trend: pendingBookings > 0 ? `${pendingBookings} ${isAr ? "جديد" : "pending"}` : null,
    },
    {
      label: isAr ? "التقييمات" : "Reviews",
      value: totalReviews,
      icon: Star,
      gradient: "from-blue-500 to-indigo-500",
      bg: "from-blue-50 to-indigo-50",
      trend: null,
    },
  ];

  const quickActions = [
    { href: `/${locale}/dashboard/services`, label: isAr ? "إضافة خدمة" : "Add Service", icon: Plus, color: "bg-gradient-to-br from-sand-500 to-sand-600 text-white" },
    { href: `/${locale}/dashboard/bookings`, label: isAr ? "الحجوزات" : "Bookings", icon: ShoppingBag, color: pendingBookings > 0 ? "bg-amber-500 text-white" : "bg-white border border-desert-200 text-clay-700", badge: pendingBookings > 0 ? pendingBookings : null },
    { href: `/${locale}/messages`, label: isAr ? "الرسائل" : "Messages", icon: MessageCircle, color: "bg-white border border-desert-200 text-clay-700" },
    { href: `/${locale}/dashboard/profile`, label: isAr ? "تعديل الملف" : "Edit Profile", icon: User, color: "bg-white border border-desert-200 text-clay-700" },
  ];

  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-clay-800">
            {isAr ? `مرحباً، ${provider.businessName} 👋` : `Welcome back, ${provider.businessName} 👋`}
          </h1>
          <p className="text-clay-400 text-sm mt-1">
            {isAr ? "إليك نظرة عامة على نشاطك التجاري اليوم" : "Here's your business overview for today"}
          </p>
        </div>
        {provider.isApproved ? (
          <div className="hidden lg:flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-2.5">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-green-700">{isAr ? "حساب معتمد" : "Verified Account"}</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700 font-medium">
              {isAr ? "في انتظار موافقة المشرف" : "Pending admin approval"}
            </p>
          </div>
        )}
      </div>

      {!provider.isApproved && (
        <div className="lg:hidden flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            {isAr ? "⏳ حسابك في انتظار موافقة المشرف." : "⏳ Your account is pending admin approval."}
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`relative flex flex-col items-center gap-2 p-3 lg:p-4 rounded-2xl text-center shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${action.color}`}
          >
            {action.badge && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {action.badge}
              </span>
            )}
            <action.icon className="w-5 h-5" />
            <span className="text-[10px] lg:text-xs font-semibold leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.bg} rounded-2xl border border-white/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-sm`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-clay-800">{stat.value}</p>
            <p className="text-xs text-clay-500 mt-0.5">{stat.label}</p>
            {stat.trend && (
              <p className="text-[10px] font-semibold text-oasis-600 mt-1 flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> {stat.trend}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Profile Completion */}
      {completionScore < 100 && (
        <div className="bg-white rounded-2xl border border-desert-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-clay-800">
                {isAr ? "اكتمال الملف الشخصي" : "Profile Completion"}
              </h3>
              <p className="text-xs text-clay-400 mt-0.5">
                {isAr ? "أكمل ملفك لتحسين ظهورك" : "Complete your profile to boost visibility"}
              </p>
            </div>
            <span className={`text-xl font-bold ${completionScore >= 80 ? "text-oasis-600" : completionScore >= 50 ? "text-amber-600" : "text-red-500"}`}>
              {completionScore}%
            </span>
          </div>
          <div className="h-2 bg-desert-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-sand-500 to-oasis-500 rounded-full transition-all duration-700"
              style={{ width: `${completionScore}%` }}
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            {completionItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${item.done ? "text-oasis-500" : "text-clay-200"}`} />
                <span className={`text-[10px] ${item.done ? "text-clay-600 line-through" : "text-clay-400"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <Link
            href={`/${locale}/dashboard/profile`}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sand-600 hover:text-sand-700"
          >
            {isAr ? "إكمال الملف" : "Complete Profile"} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Recent Services */}
      <div className="bg-white rounded-2xl border border-desert-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-desert-100">
          <h2 className="font-bold text-clay-800">{isAr ? "أحدث الخدمات" : "Recent Services"}</h2>
          <Link
            href={`/${locale}/dashboard/services`}
            className="text-xs font-semibold text-sand-600 hover:text-sand-700 flex items-center gap-1"
          >
            {isAr ? "عرض الكل" : "View All"} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-desert-50">
          {provider.services.length > 0 ? (
            provider.services.map((s) => {
              const avgRating =
                s.reviews.length > 0
                  ? s.reviews.reduce((a, r) => a + r.rating, 0) / s.reviews.length
                  : null;
              return (
                <div key={s.id} className="flex items-center gap-3.5 px-5 py-3 hover:bg-desert-50 transition-colors">
                  <div className="relative w-11 h-11 rounded-xl bg-desert-100 flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-desert-200">
                    {s.images[0]?.url ? (
                      <Image src={s.images[0].url} alt={s.name} fill className="object-cover" sizes="44px" />
                    ) : (
                      <span className="text-xl">🏨</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-clay-800 truncate">{s.name}</p>
                    {avgRating && (
                      <p className="text-xs text-amber-500 flex items-center gap-0.5">
                        ★ {avgRating.toFixed(1)}
                        <span className="text-clay-300 ml-1">({s.reviews.length})</span>
                      </p>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.isPublished ? "bg-green-100 text-green-700" : "bg-clay-100 text-clay-500"}`}>
                    {s.isPublished ? (isAr ? "منشور" : "Live") : (isAr ? "مسودة" : "Draft")}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <p className="text-3xl mb-2">🏨</p>
              <p className="text-sm text-clay-400">
                {isAr ? "لا توجد خدمات بعد" : "No services yet"}
              </p>
            </div>
          )}
        </div>
        <div className="px-5 py-4 bg-desert-50/50">
          <Link
            href={`/${locale}/dashboard/services`}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-sand-500 to-sand-600 hover:from-sand-600 hover:to-sand-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            {isAr ? "إضافة خدمة جديدة" : "Add New Service"}
          </Link>
        </div>
      </div>
    </div>
  );
}
