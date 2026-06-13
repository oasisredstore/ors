import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { EditProductForm } from "@/components/dashboard/EditProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditProductPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/login`);

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        artisan: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, nameAr: true },
    }),
  ]);

  if (!product) notFound();

  // Check ownership — artisan can only edit their own products; admin can edit all
  if (session.role !== "ADMIN" && product.artisan.userId !== session.userId) {
    redirect(`/${locale}/dashboard/products`);
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/${locale}/dashboard/products`}
          className="text-clay-400 hover:text-clay-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-clay-800">
            {locale === "ar" ? "تعديل المنتج" : "Edit Product"}
          </h1>
          <p className="text-clay-400 text-sm mt-0.5">
            {locale === "ar"
              ? `تعديل: ${product.name}`
              : `Editing: ${product.name}`}
          </p>
        </div>
      </div>

      <EditProductForm
        locale={locale}
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          nameAr: product.nameAr,
          description: product.description,
          descriptionAr: product.descriptionAr,
          categoryId: product.categoryId,
          material: product.material,
          dimensions: product.dimensions,
          origin: product.origin,
          price: product.price,
          stockQty: product.stockQty,
          isPublished: product.isPublished,
          isFeatured: product.isFeatured,
          images: product.images.map((img) => ({
            url: img.url,
            isPrimary: img.isPrimary,
          })),
        }}
      />
    </div>
  );
}
