import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cancelBookingAction } from "@/actions/booking.actions";
import {
  User, ShoppingBag, CalendarDays, Star, MessageCircle,
  Mail, Phone, MapPin, CheckCircle, Clock, XCircle, Ban,
} from "lucide-react";
import { AdBanner } from "@/components/shared/AdBanner";

interface AccountPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}

async function getUserData(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: { orderBy: { isDefault: "desc" } },
      orders: {
        include: {
          items: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } },
          address: true,
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      bookings: {
        include: {
          service: {
            include: {
              provider: true,
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      reviews: {
        include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      touristConversations: {
        include: {
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { updatedAt: "desc" },
        take: 20,
      },
    },
  });
}

function StatusBadge({ status, isAr }: { status: string; isAr: boolean }) {
  const map: Record<string, { en: string; ar: string; cls: string; icon: React.ReactNode }> = {
    PENDING:   { en: "Pending",   ar: "قيد الانتظار", cls: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3 h-3" /> },
    CONFIRMED: { en: "Confirmed", ar: "مؤكد",         cls: "bg-green-100 text-green-700",  icon: <CheckCircle className="w-3 h-3" /> },
    REJECTED:  { en: "Rejected",  ar: "مرفوض",        cls: "bg-red-100 text-red-700",      icon: <XCircle className="w-3 h-3" /> },
    CANCELLED: { en: "Cancelled", ar: "ملغي",         cls: "bg-gray-100 text-gray-600",    icon: <Ban className="w-3 h-3" /> },
    COMPLETED: { en: "Completed", ar: "مكتمل",        cls: "bg-blue-100 text-blue-700",    icon: <CheckCircle className="w-3 h-3" /> },
    DELIVERED: { en: "Delivered", ar: "تم التوصيل",   cls: "bg-blue-100 text-blue-700",    icon: <CheckCircle className="w-3 h-3" /> },
    SHIPPED:   { en: "Shipped",   ar: "تم الشحن",     cls: "bg-indigo-100 text-indigo-700",icon: <Clock className="w-3 h-3" /> },
    PROCESSING:{ en: "Processing",ar: "قيد المعالجة", cls: "bg-orange-100 text-orange-700",icon: <Clock className="w-3 h-3" /> },
  };
  const info = map[status] ?? { en: status, ar: status, cls: "bg-gray-100 text-gray-600", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${info.cls}`}>
      {info.icon}
      {isAr ? info.ar : info.en}
    </span>
  );
}

export default async function AccountPage({ params, searchParams }: AccountPageProps) {
  const { locale } = await params;
  const { tab = "bookings" } = await searchParams;
  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/login`);

  const user = await getUserData(session.userId);
  if (!user) redirect(`/${locale}/auth/login`);

  const isAr = locale === "ar";
  const navUser = { name: user.firstName, role: user.role };

  const tabs = [
    { id: "bookings", label: isAr ? "حجوزاتي" : "My Bookings", icon: CalendarDays, count: user.bookings.length },
    { id: "orders",   label: isAr ? "طلباتي"   : "My Orders",   icon: ShoppingBag, count: user.orders.length },
    { id: "reviews",  label: isAr ? "تقييماتي" : "My Reviews",  icon: Star,        count: user.reviews.length },
    { id: "messages", label: isAr ? "رسائلي"   : "Messages",    icon: MessageCircle, count: user.touristConversations.length },
    { id: "profile",  label: isAr ? "ملفي"     : "Profile",     icon: User,         count: undefined },
  ];

  const unreadMessages = user.touristConversations.filter(
    (c) => c.messages[0] && !c.messages[0].isRead && c.messages[0].senderId !== session.userId
  ).length;

  return (
    <>
      <Navbar locale={locale} user={navUser} />
      <main className="min-h-screen bg-desert-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8 bg-white rounded-3xl border border-desert-200 p-6 shadow-toub relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sable-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="w-20 h-20 rounded-2xl bg-hero-gradient flex items-center justify-center text-white text-3xl font-display font-bold shrink-0 shadow-inner">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl font-bold text-clay-800">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex flex-wrap gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-clay-500"><Mail className="w-3 h-3" />{user.email}</span>
                {user.phone && <span className="flex items-center gap-1 text-xs text-clay-500"><Phone className="w-3 h-3" />{user.phone}</span>}
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs text-clay-400">{isAr ? "نوع الحساب" : "Account Type"}</p>
              <p className="font-semibold text-clay-700 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-desert-200 rounded-2xl p-1.5 mb-6 overflow-x-auto shadow-sm">
            {tabs.map((t) => (
              <Link
                key={t.id}
                href={`/${locale}/account?tab=${t.id}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  tab === t.id
                    ? "bg-clay-900 text-white shadow-sm"
                    : "text-clay-600 hover:bg-desert-50"
                }`}
                id={`tab-${t.id}`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
                {t.id === "messages" && unreadMessages > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
                {t.count !== undefined && t.count > 0 && t.id !== "messages" && (
                  <span className="ml-1 bg-desert-100 text-clay-500 text-xs rounded-full px-1.5 py-0.5">
                    {t.count}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Tab Content */}

          {/* BOOKINGS */}
          {tab === "bookings" && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-clay-800">
                {isAr ? "حجوزاتي السياحية" : "My Tourism Bookings"}
              </h2>
              {user.bookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-desert-100 p-12 text-center">
                  <span className="text-5xl block mb-3">🏨</span>
                  <p className="text-clay-500">{isAr ? "لا توجد حجوزات بعد" : "No bookings yet"}</p>
                  <Link href={`/${locale}/services`} className="mt-4 inline-block text-sm text-sand-600 font-semibold hover:text-sand-700">
                    {isAr ? "استعرض الخدمات ←" : "Browse Services →"}
                  </Link>
                </div>
              ) : (
                user.bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl border border-desert-200 p-5 flex flex-col sm:flex-row gap-4 shadow-sm">
                    <div className="w-20 h-20 rounded-xl bg-desert-100 shrink-0 overflow-hidden relative">
                      {booking.service.images[0]?.url ? (
                        <img src={booking.service.images[0].url} alt={booking.service.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl absolute inset-0 flex items-center justify-center">🏨</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-clay-800">
                          {isAr && booking.service.nameAr ? booking.service.nameAr : booking.service.name}
                        </h3>
                        <StatusBadge status={booking.status} isAr={isAr} />
                      </div>
                      <p className="text-xs text-clay-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" />
                        {booking.service.provider.businessName} — {booking.service.provider.location || "Timimoun"}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-clay-600">
                        <span>📅 {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}</span>
                        <span>👥 {booking.guestsCount} {isAr ? "ضيف" : "guests"}</span>
                        <span className="font-semibold text-clay-800">💰 {booking.totalAmount.toLocaleString()} DZD</span>
                      </div>
                      {booking.notes && (
                        <p className="mt-2 text-xs text-clay-400 italic">{booking.notes}</p>
                      )}
                    </div>
                    {["PENDING", "CONFIRMED"].includes(booking.status) && (
                      <form
                        action={async () => {
                          "use server";
                          await cancelBookingAction(booking.id);
                        }}
                        className="shrink-0 self-start"
                      >
                        <button
                          type="submit"
                          className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          id={`cancel-booking-${booking.id}`}
                        >
                          {isAr ? "إلغاء الحجز" : "Cancel"}
                        </button>
                      </form>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ORDERS */}
          {tab === "orders" && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-clay-800">
                {isAr ? "طلبات المنتجات الحرفية" : "Handicraft Orders"}
              </h2>
              {user.orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-desert-100 p-12 text-center">
                  <span className="text-5xl block mb-3">🏺</span>
                  <p className="text-clay-500">{isAr ? "لا توجد طلبات بعد" : "No orders yet"}</p>
                  <Link href={`/${locale}/products`} className="mt-4 inline-block text-sm text-sand-600 font-semibold hover:text-sand-700">
                    {isAr ? "استعرض المنتجات ←" : "Browse Products →"}
                  </Link>
                </div>
              ) : (
                user.orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-desert-200 p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-desert-100">
                      <div>
                        <p className="text-xs text-clay-400">{isAr ? "رقم الطلب" : "Order ID"}</p>
                        <p className="font-mono text-sm text-clay-700">{order.id.slice(0, 12)}...</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-clay-400">{isAr ? "التاريخ" : "Date"}</p>
                        <p className="text-sm text-clay-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <StatusBadge status={order.status} isAr={isAr} />
                      <div className="text-right">
                        <p className="text-xs text-clay-400">{isAr ? "الإجمالي" : "Total"}</p>
                        <p className="font-bold text-clay-900">{order.totalAmount.toLocaleString()} DZD</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-desert-100 overflow-hidden shrink-0">
                            {item.product.images[0]?.url ? (
                              <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="flex items-center justify-center w-full h-full text-lg">🏺</span>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-clay-800 line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-clay-400">×{item.quantity} · {item.unitPrice} DZD</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* REVIEWS */}
          {tab === "reviews" && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-clay-800">
                {isAr ? "تقييماتي" : "My Reviews"}
              </h2>
              {user.reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-desert-100 p-12 text-center">
                  <span className="text-5xl block mb-3">⭐</span>
                  <p className="text-clay-500">{isAr ? "لم تترك أي تقييم بعد" : "You haven't written any reviews yet"}</p>
                </div>
              ) : (
                user.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl border border-desert-200 p-5 flex gap-4 shadow-sm">
                    <div className="w-14 h-14 rounded-xl bg-desert-100 shrink-0 overflow-hidden">
                      {review.product.images[0]?.url ? (
                        <img src={review.product.images[0].url} alt={review.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-2xl">🏺</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-clay-800 mb-1">{review.product.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-current" : "text-gray-200 fill-current"}`} />
                        ))}
                      </div>
                      {review.comment && <p className="text-sm text-clay-600">{review.comment}</p>}
                      <p className="text-xs text-clay-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MESSAGES */}
          {tab === "messages" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-clay-800">
                  {isAr ? "رسائلي" : "My Messages"}
                </h2>
                <Link
                  href={`/${locale}/services`}
                  className="text-sm text-sand-600 font-semibold hover:text-sand-700"
                >
                  {isAr ? "ابحث عن خدمة للتواصل ←" : "Find a service to contact →"}
                </Link>
              </div>
              {user.touristConversations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-desert-100 p-12 text-center">
                  <span className="text-5xl block mb-3">💬</span>
                  <p className="text-clay-500">{isAr ? "لا توجد رسائل بعد" : "No messages yet"}</p>
                  <p className="text-xs text-clay-400 mt-2">
                    {isAr ? "يمكنك التواصل مع مزودي الخدمات وصفحات الحرفيين" : "Contact service providers or artisans from their profile pages"}
                  </p>
                </div>
              ) : (
                user.touristConversations.map((conv) => {
                  const lastMsg = conv.messages[0];
                  const isUnread = lastMsg && !lastMsg.isRead && lastMsg.senderId !== session.userId;
                  return (
                    <Link
                      key={conv.id}
                      href={`/${locale}/messages/${conv.id}`}
                      className={`block bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all ${isUnread ? "border-sand-400 bg-sand-50/30" : "border-desert-200"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sand-300 to-clay-600 flex items-center justify-center text-white font-bold shrink-0">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className={`text-sm font-semibold text-clay-800 truncate ${isUnread ? "font-bold" : ""}`}>
                              {conv.subject}
                            </h3>
                            {isUnread && <span className="w-2 h-2 bg-sand-500 rounded-full shrink-0" />}
                          </div>
                          {lastMsg && (
                            <p className="text-xs text-clay-500 truncate">{lastMsg.body}</p>
                          )}
                          <p className="text-xs text-clay-400 mt-1">
                            {new Date(conv.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="bg-white rounded-2xl border border-desert-200 p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-clay-800 mb-6">
                {isAr ? "معلوماتي الشخصية" : "Personal Information"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: isAr ? "الاسم الأول" : "First Name", value: user.firstName },
                  { label: isAr ? "اسم العائلة" : "Last Name", value: user.lastName },
                  { label: isAr ? "البريد الإلكتروني" : "Email", value: user.email },
                  { label: isAr ? "رقم الهاتف" : "Phone", value: user.phone || "—" },
                ].map((field) => (
                  <div key={field.label} className="bg-desert-50 rounded-xl p-4">
                    <p className="text-xs text-clay-400 mb-1">{field.label}</p>
                    <p className="font-medium text-clay-800">{field.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-desert-100">
                <p className="text-xs text-clay-400">
                  {isAr ? "لتغيير كلمة المرور أو البريد الإلكتروني، تواصل مع الدعم." : "To change your password or email, contact support."}
                </p>
              </div>
            </div>
          )}

        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12">
           <AdBanner position="sidebar" locale={locale} />
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
