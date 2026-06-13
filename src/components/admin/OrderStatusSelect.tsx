"use client";

import { updateOrderStatusAction } from "@/actions/order.actions";
import { useState } from "react";
import toast from "react-hot-toast";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
  isRTL?: boolean;
}

const STATUS_OPTIONS: { value: OrderStatus; labelEn: string; labelAr: string }[] =
  [
    { value: "PENDING", labelEn: "Pending", labelAr: "قيد الانتظار" },
    { value: "CONFIRMED", labelEn: "Confirmed", labelAr: "مؤكد" },
    { value: "PROCESSING", labelEn: "Processing", labelAr: "جاري التحضير" },
    { value: "SHIPPED", labelEn: "Shipped", labelAr: "تم الشحن" },
    { value: "DELIVERED", labelEn: "Delivered", labelAr: "تم التوصيل" },
    { value: "CANCELLED", labelEn: "Cancelled", labelAr: "ملغى" },
  ];

export function OrderStatusSelect({
  orderId,
  currentStatus,
  isRTL = false,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as OrderStatus;
    setLoading(true);
    const result = await updateOrderStatusAction(orderId, newStatus);
    setLoading(false);
    if (result.success) {
      setStatus(newStatus);
      toast.success(isRTL ? "تم تحديث الحالة" : "Status updated");
    } else {
      toast.error(isRTL ? "فشل التحديث" : "Update failed");
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="text-xs border border-desert-200 rounded-lg px-2 py-1.5 text-clay-700 bg-white focus:outline-none focus:border-sand-400 disabled:opacity-50 cursor-pointer"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {isRTL ? opt.labelAr : opt.labelEn}
        </option>
      ))}
    </select>
  );
}
