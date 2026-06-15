import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    },
  });

  if (!provider) {
    return <div className="p-8 text-center">Provider profile not found.</div>;
  }

  const allBookings = provider.services.flatMap(s => s.bookings).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-clay-900 font-display">
          {isAr ? "طلبات الحجز" : "Booking Requests"}
        </h1>
        <p className="text-sm text-clay-500 mt-1">
          {isAr
            ? "إدارة طلبات الحجز الواردة من السياح والموافقة عليها."
            : "Manage incoming booking requests from tourists."}
        </p>
      </div>

      {allBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-desert-100 shadow-sm">
          <div className="w-16 h-16 bg-desert-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📅</span>
          </div>
          <h3 className="text-lg font-bold text-clay-900 mb-2">
            {isAr ? "لا توجد حجوزات بعد" : "No bookings yet"}
          </h3>
          <p className="text-clay-500 max-w-sm mx-auto mb-6">
            {isAr
              ? "بمجرد قيام السائح بحجز إحدى خدماتك، ستظهر طلبات الحجز هنا."
              : "Once a tourist books one of your services, the requests will appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-desert-50 text-clay-600 border-b border-desert-200">
              <tr>
                <th className="px-6 py-4 font-semibold">{isAr ? "السائح" : "Tourist"}</th>
                <th className="px-6 py-4 font-semibold">{isAr ? "التواريخ" : "Dates"}</th>
                <th className="px-6 py-4 font-semibold">{isAr ? "المبلغ" : "Amount"}</th>
                <th className="px-6 py-4 font-semibold">{isAr ? "الحالة" : "Status"}</th>
                <th className="px-6 py-4 font-semibold text-right">{isAr ? "إجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-desert-100">
              {allBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-desert-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-clay-900">{booking.user.firstName} {booking.user.lastName}</p>
                    <p className="text-xs text-clay-500">{booking.user.phone || booking.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-clay-600 text-xs">
                    {new Date(booking.startDate).toLocaleDateString()} <br/>
                    {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-clay-900">
                    {booking.totalAmount} DZD
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      booking.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {booking.status === "PENDING" && (
                      <div className="flex justify-end gap-2">
                        <button className="text-green-600 bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors">
                          {isAr ? "قبول" : "Accept"}
                        </button>
                        <button className="text-red-600 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors">
                          {isAr ? "رفض" : "Reject"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
