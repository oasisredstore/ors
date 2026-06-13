import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "sand";
  className?: string;
}

const variantClasses = {
  default: "bg-clay-100 text-clay-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  sand: "bg-sand-100 text-sand-700",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Order Status Badge ───────────────────────────────────────────────────────

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { labelEn: string; labelAr: string; classes: string }
> = {
  PENDING:    { labelEn: "Pending",    labelAr: "قيد الانتظار",   classes: "bg-amber-100 text-amber-700" },
  CONFIRMED:  { labelEn: "Confirmed",  labelAr: "مؤكد",           classes: "bg-blue-100 text-blue-700" },
  PROCESSING: { labelEn: "Processing", labelAr: "جاري التحضير",   classes: "bg-purple-100 text-purple-700" },
  SHIPPED:    { labelEn: "Shipped",    labelAr: "تم الشحن",       classes: "bg-indigo-100 text-indigo-700" },
  DELIVERED:  { labelEn: "Delivered",  labelAr: "تم التوصيل",    classes: "bg-green-100 text-green-700" },
  CANCELLED:  { labelEn: "Cancelled",  labelAr: "ملغى",           classes: "bg-red-100 text-red-700" },
};

interface OrderStatusBadgeProps {
  status: string;
  locale?: string;
}

export function OrderStatusBadge({ status, locale }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status as OrderStatus];
  if (!config) return null;
  const label = locale === "ar" ? config.labelAr : config.labelEn;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.classes
      )}
    >
      {label}
    </span>
  );
}
