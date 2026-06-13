import { prisma } from "@/lib/prisma";
import { approveArtisanAction } from "@/actions/admin.actions";
import { UserCheck, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 50;

interface AdminArtisansPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminArtisansPage({ params, searchParams }: AdminArtisansPageProps) {
  const { locale } = await params;

  // C6 FIX: Paginate — previously loaded ALL artisans into memory.
  const rawPage = (await searchParams).page;
  const page = Math.max(1, parseInt(rawPage ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [artisans, totalCount] = await Promise.all([
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
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const basePath = `/${locale}/admin/artisans`;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-clay-800">Artisan Management</h1>
        <p className="text-clay-400 text-sm mt-1">
          {totalCount} artisans registered · page {page} of {totalPages}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-desert-50 border-b border-desert-200">
              <tr>
                {["Artisan", "Shop", "Location", "Products", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-clay-500 uppercase px-5 py-3.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-desert-100">
              {artisans.map((artisan) => (
                <tr key={artisan.id} className="hover:bg-desert-50 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-clay-800 text-sm">
                        {artisan.user.firstName} {artisan.user.lastName}
                      </p>
                      <p className="text-xs text-clay-400">{artisan.user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-clay-700">{artisan.shopName}</p>
                    {artisan.specialization && (
                      <p className="text-xs text-oasis-600">{artisan.specialization}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {artisan.location && (
                      <div className="flex items-center gap-1 text-xs text-clay-500">
                        <MapPin className="w-3 h-3" />
                        {artisan.location}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-clay-600">{artisan._count.products}</td>
                  <td className="px-5 py-4 text-xs text-clay-400">
                    {new Date(artisan.user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${artisan.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {artisan.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {!artisan.isApproved && (
                      <form action={approveArtisanAction.bind(null, artisan.id)}>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 text-xs font-semibold bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <ChevronLeft className="w-4 h-4" /> Prev
          </a>
          <span className="text-sm text-clay-500">{page} / {totalPages}</span>
          <a
            href={hasNext ? `${basePath}?page=${page + 1}` : undefined}
            aria-disabled={!hasNext}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              hasNext ? "border-desert-200 text-clay-700 hover:bg-desert-50" : "border-transparent text-clay-300 pointer-events-none"
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
