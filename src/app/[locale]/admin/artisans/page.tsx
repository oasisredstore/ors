import { prisma } from "@/lib/prisma";
import { approveArtisanAction } from "@/actions/admin.actions";
import { UserCheck, MapPin, ChevronLeft, ChevronRight, Package, Clock, CheckCircle2 } from "lucide-react";

const PAGE_SIZE = 50;

interface AdminArtisansPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminArtisansPage({ params, searchParams }: AdminArtisansPageProps) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  const rawPage = (await searchParams).page;
  const page = Math.max(1, parseInt(rawPage ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [artisans, totalCount, pendingCount] = await Promise.all([
    prisma.artisan.findMany({
      include: {
        user: { select: { email: true, firstName: true, lastName: true, createdAt: true } },
        _count: { select: { products: true } },
      },
      orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
      take: PAGE_SIZE,
      skip,
    }),
    prisma.artisan.count(),
    prisma.artisan.count({ where: { isApproved: false } }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const basePath = `/${locale}/admin/artisans`;

  return (
    <div className="p-5 lg:p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className={isRTL ? "text-right" : ""}>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-clay-800">
            {isRTL ? "إدارة الحرفيين" : "Artisan Management"}
          </h1>
          <p className="text-clay-400 text-sm mt-1">
            {isRTL
              ? `${totalCount} حرفي مسجل · صفحة ${page} من ${totalPages}`
              : `${totalCount} artisans registered · page ${page} of ${totalPages}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-700">
                {pendingCount} {isRTL ? "معلق" : "pending"}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-green-700">
              {totalCount - pendingCount} {isRTL ? "معتمد" : "approved"}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full" dir={isRTL ? "rtl" : "ltr"}>
            <thead className="bg-desert-50 border-b border-desert-200">
              <tr>
                {(isRTL
                  ? ["الإجراء", "الحالة", "المنتجات", "تاريخ التسجيل", "الموقع", "المتجر", "الحرفي"]
                  : ["Artisan", "Shop", "Location", "Joined", "Products", "Status", "Action"]
                ).map((h) => (
                  <th
                    key={h}
                    className={`text-[10px] font-bold text-clay-400 uppercase tracking-wider px-5 py-3.5 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-desert-50">
              {artisans.map((artisan) => (
                <tr
                  key={artisan.id}
                  className={`hover:bg-desert-50/50 transition-colors ${!artisan.isApproved ? "bg-amber-50/30" : ""}`}
                >
                  {/* Artisan / Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sand-400 to-clay-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">
                          {artisan.user.firstName?.[0]}{artisan.user.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-clay-800 text-sm">
                          {artisan.user.firstName} {artisan.user.lastName}
                        </p>
                        <p className="text-[10px] text-clay-400">{artisan.user.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Shop */}
                  <td className={`px-5 py-4 ${isRTL ? "text-right" : ""}`}>
                    <p className="text-sm font-semibold text-clay-800">{artisan.shopName}</p>
                    {artisan.specialization && (
                      <p className="text-[10px] text-oasis-600 font-medium mt-0.5">{artisan.specialization}</p>
                    )}
                  </td>
                  {/* Location */}
                  <td className="px-5 py-4">
                    {artisan.location ? (
                      <div className="flex items-center gap-1 text-xs text-clay-500">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {artisan.location}
                      </div>
                    ) : (
                      <span className="text-[10px] text-clay-300">—</span>
                    )}
                  </td>
                  {/* Joined */}
                  <td className={`px-5 py-4 text-xs text-clay-400 ${isRTL ? "text-right" : ""}`}>
                    {new Date(artisan.user.createdAt).toLocaleDateString(isRTL ? "ar-DZ" : "en-US", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  {/* Products */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-clay-400" />
                      <span className="text-sm font-semibold text-clay-700">{artisan._count.products}</span>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      artisan.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {artisan.isApproved ? (
                        <><CheckCircle2 className="w-2.5 h-2.5" /> {isRTL ? "معتمد" : "Approved"}</>
                      ) : (
                        <><Clock className="w-2.5 h-2.5" /> {isRTL ? "معلق" : "Pending"}</>
                      )}
                    </span>
                  </td>
                  {/* Action */}
                  <td className="px-5 py-4">
                    {!artisan.isApproved && (
                      <form action={approveArtisanAction.bind(null, artisan.id)}>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 py-1.5 rounded-xl transition-all hover:shadow-md"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          {isRTL ? "قبول" : "Approve"}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {artisans.length === 0 && (
            <div className="text-center py-16 text-clay-400">
              <p className="text-4xl mb-3">👨‍🎨</p>
              <p className="text-sm">{isRTL ? "لا يوجد حرفيون بعد" : "No artisans yet"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <a
            href={hasPrev ? `${basePath}?page=${page - 1}` : undefined}
            aria-disabled={!hasPrev}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              hasPrev
                ? "border-desert-200 text-clay-700 hover:bg-desert-50 hover:border-sand-300"
                : "border-transparent text-clay-300 pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {isRTL ? "السابق" : "Prev"}
          </a>
          <span className="text-sm font-medium text-clay-600 bg-white border border-desert-200 px-4 py-2 rounded-xl">
            {page} / {totalPages}
          </span>
          <a
            href={hasNext ? `${basePath}?page=${page + 1}` : undefined}
            aria-disabled={!hasNext}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              hasNext
                ? "border-desert-200 text-clay-700 hover:bg-desert-50 hover:border-sand-300"
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
