import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CatalogItemCard } from "@/components/marketplace/CatalogItemCard";
import { getSession } from "@/lib/session";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface ProductsPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
  searchParams: Promise<{ category?: string; search?: string; sort?: string; region?: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "السوق الشامل — قورارة للحرف" : "Marketplace — Gourara Crafts",
    description: "Browse authentic handmade crafts, tours, accommodations, and more in Timimoun.",
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
  const { category, sort, region } = await searchParams;
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
      ...(category && category !== "all-services" && category !== "all-products" && { category: { slug: category } }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { nameAr: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(region && {
        OR: [
          { origin: { contains: region } },
          { artisan: { location: { contains: region } } },
        ],
      }),
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      artisan: { select: { shopName: true, slug: true, location: true } },
      reviews: { select: { rating: true } },
      category: { select: { name: true, nameAr: true } },
    },
    orderBy,
  });

  const services = await prisma.service.findMany({
    where: {
      isPublished: true,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { nameAr: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(region && {
        provider: { location: { contains: region } }
      }),
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      provider: { select: { businessName: true, slug: true, location: true } },
      reviews: { select: { rating: true } },
    },
    orderBy,
  });

  // Combine into a unified items array
  let allItems: any[] = [];
  
  if (!category || category === "all-products") {
    allItems = [...allItems, ...products.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      nameAr: p.nameAr,
      imageUrl: p.images[0]?.url,
      providerName: p.artisan.shopName,
      providerSlug: p.artisan.slug,
      categoryOrType: locale === "ar" ? p.category.nameAr : p.category.name,
      price: p.price,
      itemType: "PRODUCT",
      rating: p.reviews.length > 0 ? p.reviews.reduce((a: number, r: any) => a + r.rating, 0) / p.reviews.length : undefined,
      reviewCount: p.reviews.length,
      createdAt: p.createdAt,
      location: p.artisan.location,
    }))];
  } else if (category && category !== "all-services") {
    // A specific product category
    allItems = [...allItems, ...products.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      nameAr: p.nameAr,
      imageUrl: p.images[0]?.url,
      providerName: p.artisan.shopName,
      providerSlug: p.artisan.slug,
      categoryOrType: locale === "ar" ? p.category.nameAr : p.category.name,
      price: p.price,
      itemType: "PRODUCT",
      rating: p.reviews.length > 0 ? p.reviews.reduce((a: number, r: any) => a + r.rating, 0) / p.reviews.length : undefined,
      reviewCount: p.reviews.length,
      createdAt: p.createdAt,
      location: p.artisan.location,
    }))];
  }

  if (!category || category === "all-services" || category === "ACCOMMODATION" || category === "TOUR" || category === "WORKSHOP" || category === "TRANSPORT") {
    const filteredServices = services.filter((s: any) => {
      if (!category || category === "all-services") return true;
      if (category === "ACCOMMODATION") return s.type === "ROOM" || s.type === "TENT";
      return s.type === category;
    });

    allItems = [...allItems, ...filteredServices.map((s: any) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      nameAr: s.nameAr,
      imageUrl: s.images[0]?.url,
      providerName: s.provider.businessName,
      providerSlug: s.provider.slug,
      categoryOrType: s.type, // Will be translated in card or we can do it here
      price: s.price,
      itemType: s.type,
      rating: s.reviews.length > 0 ? s.reviews.reduce((a: number, r: any) => a + r.rating, 0) / s.reviews.length : undefined,
      reviewCount: s.reviews.length,
      createdAt: s.createdAt,
      location: s.provider.location,
    }))];
  }

  // Re-sort combined array
  if (sort === "az") {
    allItems.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const selectedCategory = category
    ? categories.find((c) => c.slug === category)
    : null;

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className="min-h-screen bg-desert-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-clay-800 mb-2">
              {category === "all-products" ? (locale === "ar" ? "جميع المنتجات الحرفية" : "All Handcrafts")
              : category === "all-services" ? (locale === "ar" ? "جميع الخدمات والأنشطة" : "All Services & Activities")
              : category === "ACCOMMODATION" ? (locale === "ar" ? "أماكن الإقامة" : "Accommodations")
              : category === "TOUR" ? (locale === "ar" ? "الجولات السياحية" : "Tours")
              : category === "WORKSHOP" ? (locale === "ar" ? "ورشات العمل" : "Workshops")
              : category === "TRANSPORT" ? (locale === "ar" ? "خدمات النقل" : "Transport")
              : selectedCategory ? (locale === "ar" ? selectedCategory.nameAr : selectedCategory.name)
              : (locale === "ar" ? "السوق الشامل (الكل)" : "All Marketplace Items")}
            </h1>
            <p className="text-clay-500">
              {allItems.length} {locale === "ar" ? "عنصر متاح" : "items available"}
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
                      {locale === "ar" ? "السوق الشامل (الكل)" : "All Marketplace"}
                    </a>
                  </li>

                  <li className="mt-3 mb-1 pt-2 border-t border-desert-100">
                    <span className="px-3 text-xs font-bold text-clay-400 uppercase tracking-wider">
                      {locale === "ar" ? "الخدمات والأنشطة" : "Services & Activities"}
                    </span>
                  </li>
                  <li>
                    <a href={`/${locale}/products?category=all-services`} className={`block px-3 py-2 rounded-xl text-sm transition-colors ${category === "all-services" ? "bg-sand-100 text-sand-700 font-semibold" : "text-clay-600 hover:bg-desert-50"}`}>
                      {locale === "ar" ? "كل الخدمات" : "All Services"}
                    </a>
                  </li>
                  <li>
                    <a href={`/${locale}/products?category=ACCOMMODATION`} className={`block px-3 py-2 rounded-xl text-sm transition-colors ${category === "ACCOMMODATION" ? "bg-sand-100 text-sand-700 font-semibold" : "text-clay-600 hover:bg-desert-50"}`}>
                      🏨 {locale === "ar" ? "إقامة" : "Accommodations"}
                    </a>
                  </li>
                  <li>
                    <a href={`/${locale}/products?category=TOUR`} className={`block px-3 py-2 rounded-xl text-sm transition-colors ${category === "TOUR" ? "bg-sand-100 text-sand-700 font-semibold" : "text-clay-600 hover:bg-desert-50"}`}>
                      🐪 {locale === "ar" ? "جولات" : "Tours"}
                    </a>
                  </li>
                  <li>
                    <a href={`/${locale}/products?category=WORKSHOP`} className={`block px-3 py-2 rounded-xl text-sm transition-colors ${category === "WORKSHOP" ? "bg-sand-100 text-sand-700 font-semibold" : "text-clay-600 hover:bg-desert-50"}`}>
                      🎨 {locale === "ar" ? "ورشات عمل" : "Workshops"}
                    </a>
                  </li>
                  <li>
                    <a href={`/${locale}/products?category=TRANSPORT`} className={`block px-3 py-2 rounded-xl text-sm transition-colors ${category === "TRANSPORT" ? "bg-sand-100 text-sand-700 font-semibold" : "text-clay-600 hover:bg-desert-50"}`}>
                      🚙 {locale === "ar" ? "نقل" : "Transport"}
                    </a>
                  </li>

                  <li className="mt-3 mb-1 pt-2 border-t border-desert-100">
                    <span className="px-3 text-xs font-bold text-clay-400 uppercase tracking-wider">
                      {locale === "ar" ? "المنتجات الحرفية" : "Handcrafts"}
                    </span>
                  </li>
                  <li>
                    <a href={`/${locale}/products?category=all-products`} className={`block px-3 py-2 rounded-xl text-sm transition-colors ${category === "all-products" ? "bg-sand-100 text-sand-700 font-semibold" : "text-clay-600 hover:bg-desert-50"}`}>
                      🏺 {locale === "ar" ? "كل المنتجات" : "All Products"}
                    </a>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <a
                        href={`/${locale}/products?category=${cat.slug}`}
                        className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                          category === cat.slug
                            ? "bg-sand-100 text-sand-700 font-semibold"
                            : "text-clay-600 hover:bg-desert-50 pl-8"
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
                      href={`/${locale}/products?${category ? `category=${category}&` : ""}${opt.value ? `sort=${opt.value}&` : ""}${region ? `region=${region}` : ""}`}
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

                <hr className="my-4 border-desert-200" />

                <h3 className="font-semibold text-clay-800 mb-3 text-sm">
                  {locale === "ar" ? "البلدية / القصر" : "Municipality"}
                </h3>
                <form method="GET" className="space-y-2">
                  {category && <input type="hidden" name="category" value={category} />}
                  {sort && <input type="hidden" name="sort" value={sort} />}
                  {search && <input type="hidden" name="search" value={search} />}
                  <select 
                    name="region" 
                    className="w-full bg-white border border-desert-200 rounded-xl px-3 py-2.5 text-sm text-clay-700 focus:outline-none focus:ring-2 focus:ring-sand-100 focus:border-sand-400"
                    defaultValue={region || ""}
                  >
                    <option value="">{locale === "ar" ? "كل بلديات تيميمون" : "All Municipalities"}</option>
                    {[
                      { value: "Timimoun", labelAr: "تيميمون", labelEn: "Timimoun" },
                      { value: "Ouled Said", labelAr: "أولاد سعيد", labelEn: "Ouled Said" },
                      { value: "Aougrout", labelAr: "أوقروت", labelEn: "Aougrout" },
                      { value: "Deldoul", labelAr: "دلدول", labelEn: "Deldoul" },
                      { value: "Metarfa", labelAr: "المطارفة", labelEn: "Metarfa" },
                      { value: "Tinerkouk", labelAr: "تينركوك", labelEn: "Tinerkouk" },
                      { value: "Ksar Kaddour", labelAr: "قصر قدور", labelEn: "Ksar Kaddour" },
                      { value: "Charouine", labelAr: "شروين", labelEn: "Charouine" },
                      { value: "Talmine", labelAr: "طالمين", labelEn: "Talmine" },
                      { value: "Ouled Aissa", labelAr: "أولاد عيسى", labelEn: "Ouled Aissa" },
                    ].map(m => (
                      <option key={m.value} value={m.value}>
                        {locale === "ar" ? m.labelAr : m.labelEn}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="w-full bg-sand-100 hover:bg-sand-200 text-sand-700 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                    {locale === "ar" ? "تطبيق الفلتر" : "Apply Filter"}
                  </button>
                </form>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Search Bar */}
              <form className="mb-6" method="GET">
                {/* Preserve category/region filter */}
                {category && <input type="hidden" name="category" value={category} />}
                {region && <input type="hidden" name="region" value={region} />}
                {sort && <input type="hidden" name="sort" value={sort} />}
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
                      href={`/${locale}/products?${category ? `category=${encodeURIComponent(category)}&` : ""}${region ? `region=${encodeURIComponent(region)}` : ""}`}
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

              {allItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {allItems.map((item: any) => (
                    <CatalogItemCard
                      key={`${item.itemType}-${item.id}`}
                      id={item.id}
                      slug={item.slug}
                      name={item.name}
                      nameAr={item.nameAr}
                      imageUrl={item.imageUrl}
                      providerName={item.providerName}
                      providerSlug={item.providerSlug}
                      categoryOrType={item.categoryOrType}
                      price={item.price}
                      itemType={item.itemType}
                      rating={item.rating}
                      reviewCount={item.reviewCount}
                      locale={locale}
                      location={item.location}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-desert-200">
                  <p className="text-5xl mb-4">🔍</p>
                  <p className="text-clay-500 font-medium">
                    {locale === "ar" ? "لا توجد عناصر" : "No items found"}
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
