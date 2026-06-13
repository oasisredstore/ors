import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { PackageSearch } from "lucide-react";

interface AccountOrdersPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function AccountOrdersPage({ params }: AccountOrdersPageProps) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/login`);

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-desert-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-clay-800">
            {locale === "ar" ? "طلباتي" : "My Orders"}
          </h1>
          <p className="text-clay-400 mt-1">
            {orders.length} {locale === "ar" ? "طلب" : "orders"}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-desert-200">
            <PackageSearch className="w-16 h-16 text-clay-200 mx-auto mb-4" />
            <p className="text-clay-500 font-medium">
              {locale === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
            </p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex mt-4 bg-sand-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-sand-600 transition-colors"
            >
              {locale === "ar" ? "ابدأ التسوق" : "Start Shopping"}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-desert-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-desert-100">
                  <div>
                    <p className="font-mono text-xs text-clay-400">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-clay-400 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="font-bold text-clay-800">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="px-5 py-4 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="w-12 h-12 rounded-xl border-2 border-white bg-desert-100 overflow-hidden shrink-0">
                        {item.product.images[0]?.url ? (
                          <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-lg">🏺</div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 rounded-xl border-2 border-white bg-desert-200 flex items-center justify-center text-xs font-semibold text-clay-600">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-clay-700 truncate">
                      {order.items[0]?.product.name}
                      {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                    </p>
                    <p className="text-xs text-clay-400">
                      {order.items.reduce((a, i) => a + i.quantity, 0)} items
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/order-confirmed/${order.id}`}
                    className="text-sm font-semibold text-sand-600 hover:text-sand-700 shrink-0 transition-colors"
                  >
                    {locale === "ar" ? "عرض" : "View"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
