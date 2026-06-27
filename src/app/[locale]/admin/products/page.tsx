import { prisma } from "@/lib/prisma";
import { adminToggleFeaturedAction, adminTogglePublishAction } from "@/actions/product.actions";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { Star, StarOff, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const PAGE_SIZE = 50;

interface AdminProductsPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminProductsPage({ params, searchParams }: AdminProductsPageProps) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  // C6 FIX: Paginate — previously loaded ALL products into memory.
  const rawPage = (await searchParams).page;
  const page = Math.max(1, parseInt(rawPage ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      include: {
        artisan: { select: { shopName: true } },
        category: { select: { name: true, nameAr: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const basePath = `/${locale}/admin/products`;

  const headers = isRTL
    ? ["المنتج", "الحرفي", "الفئة", "المادة", "مميز", "الحالة", "نشر", "حذف"]
    : ["Product", "Artisan", "Category", "Material", "Featured", "Status", "Publish", "Delete"];

  return (
    <div className="p-6 lg:p-8">
      <div className={`mb-8 ${isRTL ? "text-right" : ""}`}>
        <h1 className="font-display text-3xl font-bold text-clay-800">
          {isRTL ? "إدارة المنتجات" : "Product Management"}
        </h1>
        <p className="text-clay-400 text-sm mt-1">
          {isRTL
            ? `${totalCount} منتج · صفحة ${page} من ${totalPages}`
            : `${totalCount} products · page ${page} of ${totalPages}`}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" dir={isRTL ? "rtl" : "ltr"}>
            <thead className="bg-desert-50 border-b border-desert-200">
              <tr>
                {headers.map(h => (
                  <th key={h} className={`text-xs font-semibold text-clay-500 uppercase px-4 py-3.5 whitespace-nowrap ${isRTL ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-desert-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-desert-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="relative w-10 h-10 bg-desert-100 rounded-lg flex items-center justify-center text-lg shrink-0 overflow-hidden">
                        {product.images[0]?.url
                          ? <Image src={product.images[0].url} alt={product.name} fill className="object-cover" sizes="40px" />
                          : "🏺"}
                      </div>
                      <p className={`text-sm font-medium text-clay-800 max-w-[140px] truncate ${isRTL ? "text-right" : ""}`}>
                        {isRTL && product.nameAr ? product.nameAr : product.name}
                      </p>
                    </div>
                  </td>
                  <td className={`px-4 py-4 text-sm text-clay-600 ${isRTL ? "text-right" : ""}`}>{product.artisan.shopName}</td>
                  <td className={`px-4 py-4 text-sm text-clay-500 ${isRTL ? "text-right" : ""}`}>
                    {isRTL ? product.category.nameAr : product.category.name}
                  </td>
                  <td className={`px-4 py-4 text-sm text-clay-500 ${isRTL ? "text-right" : ""}`}>
                    {product.material || "—"}
                  </td>
                  <td className="px-4 py-4">
                    <form action={adminToggleFeaturedAction.bind(null, product.id)}>
                      <button type="submit"
                        className={`p-1.5 rounded-lg transition-colors ${product.isFeatured ? "text-amber-500 hover:bg-amber-50" : "text-clay-300 hover:bg-desert-50 hover:text-amber-400"}`}
                        title={isRTL ? (product.isFeatured ? "إلغاء التمييز" : "تمييز") : (product.isFeatured ? "Remove featured" : "Mark featured")}>
                        {product.isFeatured ? <Star className="w-4 h-4 fill-amber-400" /> : <StarOff className="w-4 h-4" />}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.isPublished ? "bg-green-100 text-green-700" : "bg-clay-100 text-clay-500"}`}>
                      {product.isPublished ? (isRTL ? "منشور" : "Live") : (isRTL ? "مسودة" : "Draft")}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <form action={adminTogglePublishAction.bind(null, product.id)}>
                      <button
                        type="submit"
                        title={isRTL
                          ? (product.isPublished ? "إخفاء المنتج" : "نشر المنتج")
                          : (product.isPublished ? "Unpublish" : "Publish")}
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.isPublished
                            ? "text-green-600 hover:bg-red-50 hover:text-red-500"
                            : "text-clay-300 hover:bg-green-50 hover:text-green-600"
                        }`}
                      >
                        {product.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-4">
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-16 text-clay-400">
              <p className="text-4xl mb-3">🏺</p>
              <p className="text-sm">{isRTL ? "لا توجد منتجات بعد." : "No products yet."}</p>
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
