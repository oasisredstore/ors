import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { CheckCircle, Package, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/ui/Badge";

interface OrderConfirmedPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function OrderConfirmedPage({ params }: OrderConfirmedPageProps) {
  const { locale, id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      },
      address: true,
      payment: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="min-h-screen bg-desert-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Banner */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-clay-800 mb-2">
            {locale === "ar" ? "تم تأكيد طلبك!" : "Order Confirmed!"}
          </h1>
          <p className="text-clay-500">
            {locale === "ar" ? "رقم الطلب" : "Order"} #{order.id.slice(-8).toUpperCase()}
          </p>
          <div className="mt-3">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden">
          {/* Items */}
          <div className="p-6 border-b border-desert-100">
            <h2 className="font-semibold text-clay-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-sand-500" />
              {locale === "ar" ? "المنتجات" : "Items"}
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-clay-700">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-clay-800">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-clay-800 text-lg mt-4 pt-4 border-t border-desert-100">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-6 border-b border-desert-100">
            <h2 className="font-semibold text-clay-800 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sand-500" />
              {locale === "ar" ? "عنوان التوصيل" : "Delivery Address"}
            </h2>
            <div className="text-sm text-clay-600 space-y-0.5">
              <p className="font-medium text-clay-800">{order.address.fullName}</p>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.wilaya}</p>
              <p>{order.address.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="p-6">
            <h2 className="font-semibold text-clay-800 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-sand-500" />
              {locale === "ar" ? "طريقة الدفع" : "Payment"}
            </h2>
            <p className="text-sm text-clay-600">
              {order.payment?.method === "CASH_ON_DELIVERY"
                ? locale === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"
                : locale === "ar" ? "تحويل بنكي" : "Bank Transfer"}
            </p>
            <p className="text-xs text-clay-400 mt-1">
              {locale === "ar" ? "تاريخ الطلب" : "Order date"}: {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 justify-center">
          <Link href={`/${locale}/account/orders`}>
            <Button variant="secondary">
              {locale === "ar" ? "طلباتي" : "My Orders"}
            </Button>
          </Link>
          <Link href={`/${locale}/products`}>
            <Button>
              {locale === "ar" ? "متابعة التسوق" : "Continue Shopping"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
