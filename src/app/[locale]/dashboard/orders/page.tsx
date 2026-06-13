import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { PackageSearch, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface DashboardOrdersPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function DashboardOrdersPage({ params }: DashboardOrdersPageProps) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/login`);

  const artisan = await prisma.artisan.findUnique({
    where: { userId: session.userId },
  });

  if (!artisan) redirect(`/${locale}`);

  const isAr = locale === "ar";

  // Get all orders that contain at least one of this artisan's products
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: { artisanId: artisan.id },
        },
      },
    },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      address: { select: { city: true, wilaya: true, fullName: true, phone: true } },
      items: {
        where: { product: { artisanId: artisan.id } },
        include: {
          product: {
            select: {
              name: true,
              nameAr: true,
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
      payment: { select: { method: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Artisan revenue = sum of only their items
  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.subtotal, 0),
    0
  );

  return (
    <div className="p-6 lg:p-8">
      <div className={`mb-8 ${isAr ? "text-right" : ""}`}>
        <h1 className="font-display text-3xl font-bold text-clay-800">
          {isAr ? "طلباتي" : "My Orders"}
        </h1>
        <p className="text-clay-400 text-sm mt-1">
          {orders.length} {isAr ? "طلب" : "orders"} ·{" "}
          <span className="text-oasis-600 font-semibold">
            {formatPrice(totalRevenue)} {isAr ? "إجمالي الإيرادات" : "total revenue"}
          </span>
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-desert-200 p-16 text-center">
          <PackageSearch className="w-14 h-14 text-clay-200 mx-auto mb-4" />
          <p className="font-semibold text-clay-500">
            {isAr ? "لا توجد طلبات بعد" : "No orders yet"}
          </p>
          <p className="text-sm text-clay-400 mt-1">
            {isAr
              ? "ستظهر الطلبات هنا عندما يشتري العملاء منتجاتك"
              : "Orders will appear here when customers purchase your products"}
          </p>
          <Link
            href={`/${locale}/dashboard/products`}
            className="inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-sand-500 to-sand-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:shadow-md transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            {isAr ? "إدارة المنتجات" : "Manage Products"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-desert-200 overflow-hidden"
            >
              {/* Order Header */}
              <div
                className={`flex items-center justify-between px-5 py-4 bg-desert-50 border-b border-desert-100 ${isAr ? "flex-row-reverse" : ""}`}
              >
                <div className={isAr ? "text-right" : ""}>
                  <p className="font-mono text-xs text-clay-400">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-clay-400 mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                  <OrderStatusBadge status={order.status} locale={locale} />
                  <span className="font-bold text-clay-800">
                    {formatPrice(order.items.reduce((s, i) => s + i.subtotal, 0))}
                  </span>
                </div>
              </div>

              {/* Items from this artisan */}
              <div className="px-5 py-4">
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                      <div className="w-10 h-10 rounded-lg bg-desert-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {item.product.images[0]?.url ? (
                          <img
                            src={item.product.images[0].url}
                            alt=""
                            className="w-10 h-10 object-cover"
                          />
                        ) : (
                          <span>🏺</span>
                        )}
                      </div>
                      <div className={`flex-1 min-w-0 ${isAr ? "text-right" : ""}`}>
                        <p className="text-sm font-medium text-clay-800 truncate">
                          {isAr && item.product.nameAr ? item.product.nameAr : item.product.name}
                        </p>
                        <p className="text-xs text-clay-400">
                          × {item.quantity} · {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-clay-800 shrink-0">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Customer info */}
                <div className={`flex items-center justify-between pt-3 border-t border-desert-100 ${isAr ? "flex-row-reverse" : ""}`}>
                  <div className={isAr ? "text-right" : ""}>
                    <p className="text-xs font-medium text-clay-700">
                      {order.address.fullName}
                    </p>
                    <p className="text-xs text-clay-400">
                      {order.address.city}, {order.address.wilaya} · {order.address.phone}
                    </p>
                  </div>
                  <div className={`text-right ${isAr ? "text-left" : ""}`}>
                    <p className="text-xs text-clay-500">
                      {order.payment?.method === "CASH_ON_DELIVERY"
                        ? (isAr ? "الدفع عند الاستلام" : "Cash on Delivery")
                        : (isAr ? "تحويل بنكي" : "Bank Transfer")}
                    </p>
                    <p className={`text-xs font-semibold mt-0.5 ${order.payment?.status === "PAID" ? "text-green-600" : "text-amber-600"}`}>
                      {order.payment?.status === "PAID"
                        ? (isAr ? "مدفوع" : "PAID")
                        : (isAr ? "في انتظار الدفع" : "PENDING")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
