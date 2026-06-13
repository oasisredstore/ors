import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 50;

interface AdminOrdersPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
  searchParams: Promise<{ page?: string }>;
}

const STATUS_LABELS: Record<string,{en:string;ar:string}> = {
  PENDING:    {en:"Pending",    ar:"قيد الانتظار"},
  CONFIRMED:  {en:"Confirmed",  ar:"مؤكد"},
  PROCESSING: {en:"Processing", ar:"جاري التحضير"},
  SHIPPED:    {en:"Shipped",    ar:"تم الشحن"},
  DELIVERED:  {en:"Delivered",  ar:"تم التوصيل"},
  CANCELLED:  {en:"Cancelled",  ar:"ملغى"},
};

export default async function AdminOrdersPage({ params, searchParams }: AdminOrdersPageProps) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  // C6 FIX: Paginate the query — previously this loaded ALL orders into memory.
  const rawPage = (await searchParams).page;
  const page = Math.max(1, parseInt(rawPage ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: { select: { firstName: true, lastName: true } },
        items: { include: { product: { select: { name: true, nameAr: true } } } },
        address: { select: { city: true, wilaya: true } },
        payment: { select: { method: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.order.count(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const headers = isRTL
    ? ["التحديث","التاريخ","الحالة","الدفع","المجموع","المنتجات","العميل","رقم الطلب"]
    : ["Order","Customer","Items","Total","Payment","Status","Date","Update"];

  const basePath = `/${locale}/admin/orders`;

  return (
    <div className="p-6 lg:p-8">
      <div className={`mb-8 ${isRTL?"text-right":""}`}>
        <h1 className="font-display text-3xl font-bold text-clay-800">
          {isRTL ? "إدارة الطلبات" : "Orders Management"}
        </h1>
        <p className="text-clay-400 text-sm mt-1">
          {isRTL
            ? `${totalCount} طلب إجمالاً · صفحة ${page} من ${totalPages}`
            : `${totalCount} total orders · page ${page} of ${totalPages}`}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" dir={isRTL?"rtl":"ltr"}>
            <thead className="bg-desert-50 border-b border-desert-200">
              <tr>
                {headers.map(h => (
                  <th key={h} className={`text-xs font-semibold text-clay-500 uppercase px-4 py-3.5 whitespace-nowrap ${isRTL?"text-right":"text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-desert-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-desert-50 transition-colors">
                  <td className={`px-4 py-4 ${isRTL?"text-right":""}`}>
                    <p className="text-xs font-mono text-clay-500">#{order.id.slice(-8).toUpperCase()}</p>
                  </td>
                  <td className={`px-4 py-4 ${isRTL?"text-right":""}`}>
                    <p className="text-sm font-medium text-clay-800">{order.user.firstName} {order.user.lastName}</p>
                    <p className="text-xs text-clay-400">{order.address.city}, {order.address.wilaya}</p>
                  </td>
                  <td className={`px-4 py-4 ${isRTL?"text-right":""}`}>
                    <div className="text-xs text-clay-600 space-y-0.5">
                      {order.items.slice(0,2).map(item => (
                        <p key={item.id} className="truncate max-w-[120px]">
                          {isRTL && item.product.nameAr ? item.product.nameAr : item.product.name} ×{item.quantity}
                        </p>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-clay-400">+{order.items.length-2} {isRTL?"المزيد":"more"}</p>
                      )}
                    </div>
                  </td>
                  <td className={`px-4 py-4 text-sm font-bold text-clay-800 ${isRTL?"text-right":""}`}>
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className={`px-4 py-4 ${isRTL?"text-right":""}`}>
                    <p className="text-xs text-clay-600">
                      {order.payment?.method==="CASH_ON_DELIVERY"
                        ? (isRTL?"الدفع عند الاستلام":"COD")
                        : (isRTL?"تحويل بنكي":"Bank")}
                    </p>
                    <p className={`text-xs font-medium ${order.payment?.status==="PAID"?"text-green-600":"text-amber-600"}`}>
                      {order.payment?.status==="PAID"?(isRTL?"مدفوع":"PAID"):(isRTL?"معلق":"PENDING")}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className={`px-4 py-4 text-xs text-clay-400 ${isRTL?"text-right":""}`}>
                    {new Date(order.createdAt).toLocaleDateString(isRTL?"ar-DZ":"en-US")}
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} isRTL={isRTL}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length===0 && (
            <div className="text-center py-16 text-clay-400">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-sm">{isRTL?"لا توجد طلبات بعد.":"No orders yet."}</p>
            </div>
          )}
        </div>
      </div>

      {/* C6: Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <a
            href={hasPrev ? `${basePath}?page=${page - 1}` : undefined}
            aria-disabled={!hasPrev}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              hasPrev
                ? "border-desert-200 text-clay-700 hover:bg-desert-50"
                : "border-transparent text-clay-300 pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {isRTL ? "السابق" : "Prev"}
          </a>
          <span className="text-sm text-clay-500">
            {isRTL ? `${page} / ${totalPages}` : `${page} / ${totalPages}`}
          </span>
          <a
            href={hasNext ? `${basePath}?page=${page + 1}` : undefined}
            aria-disabled={!hasNext}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              hasNext
                ? "border-desert-200 text-clay-700 hover:bg-desert-50"
                : "border-transparent text-clay-300 pointer-events-none"
            }`}
          >
            {isRTL ? "التالي" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
