import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface NewProductPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/login`);

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, nameAr: true },
  });

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
            {locale === "ar" ? "إضافة منتج جديد" : "Add New Product"}
          </h1>
          <p className="text-clay-400 text-sm mt-0.5">
            {locale === "ar" ? "أضف تفاصيل منتجك الجديد" : "Fill in the details for your new product"}
          </p>
        </div>
      </div>

      <ProductForm locale={locale} categories={categories} />
    </div>
  );
}
