import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { TogglePublishButton, DeleteProductDashboardButton } from "@/components/dashboard/ProductActionButtons";

interface DashboardProductsPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function DashboardProductsPage({ params }: DashboardProductsPageProps) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/login`);

  const artisan = await prisma.artisan.findUnique({
    where: { userId: session.userId },
  });
  if (!artisan) redirect(`/${locale}`);

  const products = await prisma.product.findMany({
    where: { artisanId: artisan.id },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const isAr = locale === "ar";

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-clay-800">
            {isAr ? "منتجاتي" : "My Products"}
          </h1>
          <p className="text-clay-400 text-sm mt-1">
            {products.length} {isAr ? "منتج" : "products"}
          </p>
        </div>
        <Link
          href={`/${locale}/dashboard/products/new`}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-sand-500 to-sand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:from-sand-600 hover:to-sand-700 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          {isAr ? "إضافة منتج" : "Add Product"}
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-desert-200">
          <p className="text-5xl mb-4">🏺</p>
          <p className="text-clay-500 mb-6">
            {isAr ? "لا توجد منتجات بعد" : "No products yet"}
          </p>
          <Link
            href={`/${locale}/dashboard/products/new`}
            className="inline-flex items-center gap-2 bg-sand-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-sand-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isAr ? "إضافة أول منتج" : "Add your first product"}
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-desert-50 border-b border-desert-200">
                <tr>
                  {[
                    isAr ? "المنتج" : "Product",
                    isAr ? "الفئة" : "Category",
                    isAr ? "المادة" : "Material",
                    isAr ? "الحالة" : "Status",
                    isAr ? "الإجراءات" : "Actions",
                  ].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-clay-500 uppercase tracking-wide px-5 py-3.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-desert-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-desert-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-desert-100 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                          {product.images[0]?.url ? (
                            <img src={product.images[0].url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : "🏺"}
                        </div>
                        <div>
                          <p className="font-medium text-clay-800 text-sm">{product.name}</p>
                          {product.nameAr && (
                            <p className="text-xs text-clay-400">{product.nameAr}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-clay-600">
                      {isAr ? product.category.nameAr : product.category.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-clay-500">
                      {product.material || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.isPublished ? "bg-green-100 text-green-700" : "bg-clay-100 text-clay-500"}`}>
                        {product.isPublished ? (isAr ? "منشور" : "Published") : (isAr ? "مسودة" : "Draft")}
                      </span>
                      {product.isFeatured && (
                        <span className="ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-sand-100 text-sand-700">
                          {isAr ? "مميز" : "Featured"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${locale}/dashboard/products/${product.id}`}
                          className="p-1.5 text-clay-400 hover:text-sand-600 hover:bg-sand-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <TogglePublishButton productId={product.id} isPublished={product.isPublished} />
                        <DeleteProductDashboardButton productId={product.id} />
                      </div>
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
