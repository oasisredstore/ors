import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ServicesPage({
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
    include: { services: true },
  });

  if (!provider) {
    return (
      <div className="p-8 text-center text-clay-500">
        Provider profile not found.
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-clay-900 font-display">
            {isAr ? "الخدمات السياحية" : "Tourism Services"}
          </h1>
          <p className="text-sm text-clay-500 mt-1">
            {isAr
              ? "إدارة الغرف، الجولات السياحية، والخدمات الخاصة بك."
              : "Manage your rooms, tours, and services."}
          </p>
        </div>
        <Link
          href={`/${locale}/dashboard/services/new`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-oasis-600 text-white rounded-xl hover:bg-oasis-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          {isAr ? "إضافة خدمة جديدة" : "Add New Service"}
        </Link>
      </div>

      {provider.services.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-desert-100 shadow-sm">
          <div className="w-16 h-16 bg-desert-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🧳</span>
          </div>
          <h3 className="text-lg font-bold text-clay-900 mb-2">
            {isAr ? "لا توجد خدمات بعد" : "No services yet"}
          </h3>
          <p className="text-clay-500 max-w-sm mx-auto mb-6">
            {isAr
              ? "ابدأ بإضافة أول خدمة سياحية لك ليتمكن السياح من حجزها عبر المنصة."
              : "Start by adding your first tourism service so tourists can book it."}
          </p>
          <Link
            href={`/${locale}/dashboard/services/new`}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-oasis-600 text-white rounded-xl hover:bg-oasis-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            {isAr ? "إضافة خدمة" : "Add Service"}
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-desert-50 text-clay-600 border-b border-desert-200">
              <tr>
                <th className="px-6 py-4 font-semibold">{isAr ? "الخدمة" : "Service"}</th>
                <th className="px-6 py-4 font-semibold">{isAr ? "النوع" : "Type"}</th>
                <th className="px-6 py-4 font-semibold">{isAr ? "السعر" : "Price"}</th>
                <th className="px-6 py-4 font-semibold">{isAr ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-desert-100">
              {provider.services.map((service) => (
                <tr key={service.id} className="hover:bg-desert-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-clay-900">{isAr ? service.nameAr || service.name : service.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sand-100 text-sand-700">
                      {service.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-clay-600">
                    {service.price} DZD
                  </td>
                  <td className="px-6 py-4">
                    {service.isPublished ? (
                      <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded-full">Active</span>
                    ) : (
                      <span className="text-clay-500 font-medium text-xs bg-clay-100 px-2 py-1 rounded-full">Draft</span>
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
