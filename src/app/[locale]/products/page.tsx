import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { getSession } from "@/lib/session";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface ProductsPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "المنتجات — ريد أوزيس أرتيزان" : "Products — RedOasisArtisan",
    description: "Browse authentic handmade Saharan crafts from local artisans in Timimoun, Algeria.",
    // C10 FIX: Use locale-appropriate OpenGraph locale code.
    openGraph: {
      locale: locale === "ar" ? "ar_DZ" : "en_US",
    },
  };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  // B3 FIX: Cap the search param length to prevent excessively long strings
  // from being reflected in the page and causing memory/rendering issues.
  const rawSearch = (await searchParams).search;
  const search = rawSearch?.slice(0, 200);
  const { category, sort } = await searchParams;
  const t = await getTranslations("product");
  const session = await getSession();

  // B4 FIX: Use firstName from the JWT (set since the last auth fix) so the
  // navbar greeting shows "Ahmed" instead of the email prefix "ahmed.benali".
  const user = session
    ? { name: session.firstName ?? session.email.split("@")[0], role: session.role }
    : null;

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // B2 FIX: The sort search param was parsed correctly but never applied to
  // the DB query — it always sorted by newest. Now the A-to-Z option works.
  const orderBy =
    sort === "az"
      ? { name: "asc" as const }
      : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { nameAr: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      artisan: { select: { shopName: true, slug: true } },
      reviews: { select: { rating: true } },
      category: { select: { name: true, nameAr: true } },
    },
    orderBy,
  });

  const selectedCategory = category
    ? categories.find((c) => c.slug === category)
    : null;

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-clay-800 mb-2">
              {selectedCategory
                ? locale === "ar"
                  ? selectedCategory.nameAr
                  : selectedCategory.name
                : locale === "ar"
                ? "جميع المنتجات"
                : "All Products"}
            </h1>
            <p className="text-clay-500">
              {products.length} {locale === "ar" ? "منتج" : "products found"}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-56 shrink-0">
              <div className="bg-white rounded-2xl border border-desert-200 p-5 sticky top-24">
                <h3 className="font-semibold text-clay-800 mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  {locale === "ar" ? "الفئات" : "Categories"}
                </h3>
                <ul className="space-y-1">
                  <li>
                    <a
                      href={`/${locale}/products`}
                      className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                        !category
                          ? "bg-sand-100 text-sand-700 font-semibold"
                          : "text-clay-600 hover:bg-desert-50"
                      }`}
                    >
                      {locale === "ar" ? "الكل" : "All"}
                    </a>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <a
                        href={`/${locale}/products?category=${cat.slug}`}
                        className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                          category === cat.slug
                            ? "bg-sand-100 text-sand-700 font-semibold"
                            : "text-clay-600 hover:bg-desert-50"
                        }`}
                      >
                        {locale === "ar" ? cat.nameAr : cat.name}
                      </a>
                    </li>
                  ))}
                </ul>

                <hr className="my-4 border-desert-200" />

                <h3 className="font-semibold text-clay-800 mb-3 text-sm">
                  {locale === "ar" ? "ترتيب حسب" : "Sort by"}
                </h3>
                <div className="space-y-1">
                  {[
                    { value: "", label: locale === "ar" ? "الأحدث" : "Newest" },
                    { value: "az", label: locale === "ar" ? "أ-ي (A-Z)" : "A to Z" },
                  ].map((opt) => (
                    <a
                      key={opt.value}
                      href={`/${locale}/products?${category ? `category=${category}&` : ""}${opt.value ? `sort=${opt.value}` : ""}`}
                      className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                        (sort || "") === opt.value
                          ? "bg-sand-100 text-sand-700 font-semibold"
                          : "text-clay-600 hover:bg-desert-50"
                      }`}
                    >
                      {opt.label}
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Search Bar */}
              <form className="mb-6" method="GET">
                {/* Preserve category filter */}
                {category && <input type="hidden" name="category" value={category} />}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-400 pointer-events-none" />
                  <input
                    name="search"
                    defaultValue={search}
                    placeholder={locale === "ar" ? "ابحث عن منتجات..." : "Search products..."}
                    className="w-full bg-white border border-desert-200 rounded-xl pl-10 pr-10 py-3 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 focus:ring-2 focus:ring-sand-100 transition-all"
                  />
                  {search && (
                    <a
                      href={`/${locale}/products${category ? `?category=${encodeURIComponent(category)}` : ""}`}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-clay-400 hover:text-clay-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {search && (
                  <p className="mt-2 text-sm text-clay-500">
                    {locale === "ar"
                      ? `نتائج البحث عن: "${search}"`
                      : `Showing results for: "${search}"`}
                  </p>
                )}
              </form>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const avgRating =
                      product.reviews.length > 0
                        ? product.reviews.reduce((a, r) => a + r.rating, 0) /
                          product.reviews.length
                        : undefined;

                    return (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        slug={product.slug}
                        name={product.name}
                        nameAr={product.nameAr}
                        imageUrl={product.images[0]?.url}
                        artisanName={product.artisan.shopName}
                        artisanSlug={product.artisan.slug}
                        categoryName={product.category.name}
                        categoryNameAr={product.category.nameAr}
                        rating={avgRating}
                        reviewCount={product.reviews.length}
                        locale={locale}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-desert-200">
                  <p className="text-5xl mb-4">🔍</p>
                  <p className="text-clay-500 font-medium">
                    {locale === "ar" ? "لا توجد منتجات" : "No products found"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
