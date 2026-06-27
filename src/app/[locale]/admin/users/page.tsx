import { prisma } from "@/lib/prisma";
import { toggleUserActiveAction } from "@/actions/admin.actions";

import { Badge } from "@/components/ui/Badge";
import { UserX, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 50;

interface AdminUsersPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminUsersPage({ params, searchParams }: AdminUsersPageProps) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  // C6 FIX: Paginate — previously loaded ALL users into memory.
  const rawPage = (await searchParams).page;
  const page = Math.max(1, parseInt(rawPage ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["CUSTOMER"] } },
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.user.count({ where: { role: { in: ["CUSTOMER"] } } }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const basePath = `/${locale}/admin/users`;

  const headers = isRTL
    ? ["الإجراءات", "الحالة", "تاريخ الانضمام", "الطلبات", "الهاتف", "البريد الإلكتروني", "الاسم"]
    : ["Name", "Email", "Phone", "Orders", "Joined", "Status", "Actions"];

  return (
    <div className="p-6 lg:p-8">
      <div className={`mb-8 ${isRTL ? "text-right" : ""}`}>
        <h1 className="font-display text-3xl font-bold text-clay-800">
          {isRTL ? "إدارة المستخدمين" : "User Management"}
        </h1>
        <p className="text-clay-400 text-sm mt-1">
          {isRTL
            ? `${totalCount} عميل مسجل · صفحة ${page} من ${totalPages}`
            : `${totalCount} customers · page ${page} of ${totalPages}`}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" dir={isRTL ? "rtl" : "ltr"}>
            <thead className="bg-desert-50 border-b border-desert-200">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    className={`text-xs font-semibold text-clay-500 uppercase px-5 py-3.5 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-desert-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-desert-50 transition-colors">
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sand-300 to-oasis-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <p className={`font-medium text-clay-800 text-sm ${isRTL ? "text-right" : ""}`}>
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </td>
                  <td className={`px-5 py-4 text-sm text-clay-600 ${isRTL ? "text-right" : ""}`}>{user.email}</td>
                  <td className={`px-5 py-4 text-sm text-clay-500 ${isRTL ? "text-right" : ""}`}>{user.phone || "—"}</td>
                  <td className={`px-5 py-4 text-sm font-semibold text-clay-700 ${isRTL ? "text-right" : ""}`}>{user._count.orders}</td>
                  <td className={`px-5 py-4 text-xs text-clay-400 ${isRTL ? "text-right" : ""}`}>
                    {new Date(user.createdAt).toLocaleDateString(isRTL ? "ar-DZ" : "en-US")}
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <Badge variant={user.isActive ? "success" : "danger"}>
                      {user.isActive
                        ? (isRTL ? "نشط" : "Active")
                        : (isRTL ? "موقوف" : "Suspended")}
                    </Badge>
                  </td>
                  {/* Action */}
                  <td className="px-5 py-4">
                    <form action={toggleUserActiveAction.bind(null, user.id)}>
                      <button
                        type="submit"
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                          user.isActive
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        } ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        {user.isActive ? (
                          <><UserX className="w-3.5 h-3.5" /> {isRTL ? "إيقاف" : "Suspend"}</>
                        ) : (
                          <><UserCheck className="w-3.5 h-3.5" /> {isRTL ? "تفعيل" : "Activate"}</>
                        )}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className={`text-center py-16 text-clay-400 ${isRTL ? "text-right px-8" : ""}`}>
              <p className="text-4xl mb-3">👥</p>
              <p className="text-sm">{isRTL ? "لا يوجد مستخدمون بعد." : "No customers yet."}</p>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <a
            href={hasPrev ? `${basePath}?page=${page - 1}` : undefined}
            aria-disabled={!hasPrev}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              hasPrev ? "border-desert-200 text-clay-700 hover:bg-desert-50" : "border-transparent text-clay-300 pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {isRTL ? "السابق" : "Prev"}
          </a>
          <span className="text-sm text-clay-500">{page} / {totalPages}</span>
          <a
            href={hasNext ? `${basePath}?page=${page + 1}` : undefined}
            aria-disabled={!hasNext}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              hasNext ? "border-desert-200 text-clay-700 hover:bg-desert-50" : "border-transparent text-clay-300 pointer-events-none"
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
