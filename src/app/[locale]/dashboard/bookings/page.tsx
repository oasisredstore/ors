import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingActionButtons } from "@/components/dashboard/BookingActionButtons";
import { CalendarDays, Users, DollarSign, Clock } from "lucide-react";

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session || !["HOTEL", "GUEST_HOUSE", "GUIDE", "AGENCY"].includes(session.role)) {
    redirect(`/${locale}/auth/login`);
  }

  const isAr = locale === "ar";

  const provider = await prisma.serviceProvider.findUnique({
    where: { userId: session.userId },
    include: {
      services: {
        include: {
          bookings: {
            include: { user: true },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!provider) {
    return <div className="p-8 text-center">Provider profile not found.</div>;
  }

  const allBookings = provider.services
    .flatMap((s) =>
      s.bookings.map((b) => ({ ...b, serviceName: s.name, serviceNameAr: s.nameAr }))
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const pending = allBookings.filter((b) => b.status === "PENDING").length;
  const confirmed = allBookings.filter((b) => b.status === "CONFIRMED").length;
  const thisMonth = allBookings
    .filter((b) => {
      const now = new Date();
      return (
        b.status === "CONFIRMED" &&
        b.createdAt.getMonth() === now.getMonth() &&
        b.createdAt.getFullYear() === now.getFullYear()
      );
    })
    .reduce((acc, b) => acc + b.totalAmount, 0);

  const statusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      case "CONFIRMED": return "bg-green-100 text-green-700";
      case "REJECTED": return "bg-red-100 text-red-700";
      case "CANCELLED": return "bg-gray-100 text-gray-600";
      case "COMPLETED": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      PENDING: { en: "Pending", ar: "قيد الانتظار" },
      CONFIRMED: { en: "Confirmed", ar: "مؤكد" },
      REJECTED: { en: "Rejected", ar: "مرفوض" },
      CANCELLED: { en: "Cancelled", ar: "ملغي" },
      COMPLETED: { en: "Completed", ar: "مكتمل" },
    };
    return isAr ? labels[status]?.ar ?? status : labels[status]?.en ?? status;
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-clay-900 font-display">
          {isAr ? "طلبات الحجز" : "Booking Requests"}
        </h1>
        <p className="text-sm text-clay-500 mt-1">
          {isAr
            ? "إدارة طلبات الحجز الواردة من السياح."
            : "Manage incoming booking requests from tourists."}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: isAr ? "إجمالي الحجوزات" : "Total Bookings", value: allBookings.length, icon: CalendarDays, color: "bg-sand-50 text-sand-700" },
          { label: isAr ? "قيد الانتظار" : "Pending", value: pending, icon: Clock, color: "bg-yellow-50 text-yellow-700" },
          { label: isAr ? "مؤكدة" : "Confirmed", value: confirmed, icon: Users, color: "bg-green-50 text-green-700" },
          { label: isAr ? "إيرادات هذا الشهر" : "This Month Revenue", value: `${thisMonth.toLocaleString()} DZD`, icon: DollarSign, color: "bg-blue-50 text-blue-700" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-desert-200 p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-bold text-clay-800">{stat.value}</p>
            <p className="text-xs text-clay-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {allBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-desert-100 shadow-sm">
          <div className="w-16 h-16 bg-desert-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📅</span>
          </div>
          <h3 className="text-lg font-bold text-clay-900 mb-2">
            {isAr ? "لا توجد حجوزات بعد" : "No bookings yet"}
          </h3>
          <p className="text-clay-500 max-w-sm mx-auto">
            {isAr
              ? "بمجرد قيام السائح بحجز إحدى خدماتك، ستظهر طلبات الحجز هنا."
              : "Once a tourist books one of your services, the requests will appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-desert-50 text-clay-600 border-b border-desert-200">
                <tr>
                  <th className="px-5 py-4 font-semibold">{isAr ? "السائح" : "Tourist"}</th>
                  <th className="px-5 py-4 font-semibold">{isAr ? "الخدمة" : "Service"}</th>
                  <th className="px-5 py-4 font-semibold">{isAr ? "التواريخ" : "Dates"}</th>
                  <th className="px-5 py-4 font-semibold">{isAr ? "الضيوف" : "Guests"}</th>
                  <th className="px-5 py-4 font-semibold">{isAr ? "المبلغ" : "Amount"}</th>
                  <th className="px-5 py-4 font-semibold">{isAr ? "الحالة" : "Status"}</th>
                  <th className="px-5 py-4 font-semibold text-right">{isAr ? "إجراء" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-desert-100">
                {allBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-desert-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-clay-900">
                        {booking.user.firstName} {booking.user.lastName}
                      </p>
                      <p className="text-xs text-clay-500">{booking.user.phone || booking.user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-clay-700 text-xs max-w-[140px] truncate">
                      {isAr && booking.serviceNameAr ? booking.serviceNameAr : booking.serviceName}
                    </td>
                    <td className="px-5 py-4 text-clay-600 text-xs">
                      {new Date(booking.startDate).toLocaleDateString()} →<br />
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-center text-clay-700">
                      {booking.guestsCount}
                    </td>
                    <td className="px-5 py-4 font-semibold text-clay-900">
                      {booking.totalAmount.toLocaleString()} DZD
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(booking.status)}`}>
                        {statusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {booking.status === "PENDING" && (
                        <BookingActionButtons bookingId={booking.id} locale={locale} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
