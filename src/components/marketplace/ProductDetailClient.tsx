"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Star, Package, Ruler, MapPin, MessageCircle, Mail, ExternalLink, ShoppingCart, Check, Heart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { QRCodeShare } from "@/components/shared/QRCodeShare";
import { StickyProductActions } from "@/components/marketplace/StickyProductActions";

interface ProductDetailClientProps {
  product: {
    id: string;
    slug: string;
    name: string;
    nameAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    material?: string | null;
    dimensions?: string | null;
    origin?: string | null;
    price: number;
    stockQty: number;
    images: { url: string; altText?: string | null; isPrimary: boolean }[];
    artisan: {
      shopName: string;
      slug: string;
      bio?: string | null;
      bioAr?: string | null;
      avatarUrl?: string | null;
      whatsapp?: string | null;
      email?: string | null;
      location?: string | null;
      specialization?: string | null;
    };
    category: { name: string; nameAr: string };
    reviews: {
      rating: number;
      comment?: string | null;
      user: { firstName: string; lastName: string };
      createdAt: Date;
    }[];
  };
  locale: string;
}

export function ProductDetailClient({ product, locale }: ProductDetailClientProps) {
  const t = useTranslations("product");
  const [selectedImage, setSelectedImage] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted && isWishlisted(product.id);
  const isAr = locale === "ar";
  // Ref for the primary add-to-cart button — StickyProductActions watches this
  const cartButtonRef = useRef<HTMLDivElement>(null);

  const displayName = isAr && product.nameAr ? product.nameAr : product.name;
  const displayDesc = isAr && product.descriptionAr ? product.descriptionAr : product.description;
  const displayBio = isAr && product.artisan.bioAr ? product.artisan.bioAr : product.artisan.bio;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : null;

  const images = product.images.length > 0
    ? product.images
    : [{ url: "", altText: displayName, isPrimary: true }];

  const whatsappUrl = product.artisan.whatsapp
    ? `https://wa.me/${product.artisan.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
        isAr
          ? `مرحباً، أنا مهتم بمنتجك: ${displayName}`
          : `Hello, I'm interested in your product: ${displayName}`
      )}`
    : null;

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Images */}
      <div>
        <div className="relative aspect-square bg-desert-100 rounded-3xl overflow-hidden shadow-lg">
          {images[selectedImage]?.url ? (
            <Image
              src={images[selectedImage].url}
              alt={images[selectedImage].altText || displayName}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-7xl">🏺</div>
          )}
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="info">
              {isAr ? product.category.nameAr : product.category.name}
            </Badge>
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 mt-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === i ? "border-sand-500" : "border-desert-200"
                }`}
              >
                {img.url ? (
                  <Image src={img.url} alt={img.altText || ""} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl">🏺</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        {/* Rating */}
        {avgRating && (
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(avgRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-clay-200"
                }`}
              />
            ))}
            <span className="text-xs text-clay-500 ml-1">
              ({product.reviews.length} {isAr ? "تقييم" : "reviews"})
            </span>
          </div>
        )}

        <div className="flex items-start gap-3 mb-3">
          <h1 className="flex-1 font-display text-3xl lg:text-4xl font-bold text-clay-800">
            {displayName}
          </h1>
          <QRCodeShare url={`/${locale}/products/${product.slug}`} title={displayName} />
          <button
            onClick={() => toggleItem(product.id)}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`mt-1 p-2.5 rounded-xl border-2 transition-all duration-200 ${
              wishlisted
                ? "border-red-200 bg-red-50 text-red-500 scale-110"
                : "border-desert-200 text-clay-300 hover:border-red-200 hover:text-red-400 hover:bg-red-50"
            }`}
          >
            <Heart className={`w-5 h-5 transition-all ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>

        {/* Artisan credit */}
        <p className="text-sm text-clay-500 mb-6">
          {t("artisan")}:{" "}
          <a
            href={`/${locale}/artisans/${product.artisan.slug}`}
            className="text-sand-600 font-semibold hover:text-sand-700"
          >
            {product.artisan.shopName}
          </a>
          {product.artisan.location && (
            <span className="text-clay-400 ml-2">· {product.artisan.location}</span>
          )}
        </p>

        {displayDesc && (
          <p className="text-clay-600 leading-relaxed mb-6">{displayDesc}</p>
        )}

        {/* Product Details */}
        {(product.material || product.dimensions || product.origin) && (
          <div className="bg-desert-50 rounded-2xl p-4 mb-6 space-y-2.5">
            <p className="text-xs font-semibold text-clay-500 uppercase tracking-wide mb-3">
              {t("details")}
            </p>
            {product.material && (
              <div className="flex items-center gap-2 text-sm text-clay-700">
                <Package className="w-4 h-4 text-sand-500 shrink-0" />
                <span className="text-clay-500">{t("material")}:</span>
                <span className="font-medium">{product.material}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-center gap-2 text-sm text-clay-700">
                <Ruler className="w-4 h-4 text-sand-500 shrink-0" />
                <span className="text-clay-500">{t("dimensions")}:</span>
                <span className="font-medium">{product.dimensions}</span>
              </div>
            )}
            {product.origin && (
              <div className="flex items-center gap-2 text-sm text-clay-700">
                <MapPin className="w-4 h-4 text-sand-500 shrink-0" />
                <span className="text-clay-500">{isAr ? "المصدر" : "Origin"}:</span>
                <span className="font-medium">{product.origin}</span>
              </div>
            )}
          </div>
        )}

        {/* Price & Add to Cart */}
        <div ref={cartButtonRef} className="bg-gradient-to-br from-sand-50 to-desert-50 rounded-2xl p-5 mb-6 border border-sand-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              {product.price > 0 ? (
                <p className="text-3xl font-bold text-clay-800">
                  {formatPrice(product.price)}
                </p>
              ) : (
                <p className="text-base text-clay-500 italic">
                  {isAr ? "تواصل للسعر" : "Contact for price"}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className={`text-xs font-semibold ${
                product.stockQty > 0 ? "text-green-600" : "text-red-500"
              }`}>
                {product.stockQty > 0
                  ? (isAr ? `متوفر (${product.stockQty})` : `In stock (${product.stockQty})`)
                  : (isAr ? "نفد المخزون" : "Out of stock")}
              </p>
            </div>
          </div>
          {product.stockQty > 0 && product.price > 0 && (
            <button
              onClick={() => {
                addItem({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  nameAr: product.nameAr,
                  imageUrl: product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url,
                  price: product.price,
                  stockQty: product.stockQty,
                  artisanName: product.artisan.shopName,
                });
                setAdded(true);
                toast.success(isAr ? "تمت الإضافة إلى السلة" : "Added to cart");
                setTimeout(() => setAdded(false), 2000);
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-sand-500 to-sand-600 text-white hover:from-sand-600 hover:to-sand-700 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {added ? (
                <><Check className="w-4 h-4" />{isAr ? "تمت الإضافة!" : "Added!"}</>
              ) : (
                <><ShoppingCart className="w-4 h-4" />{isAr ? "أضف إلى السلة" : "Add to Cart"}</>
              )}
            </button>
          )}
        </div>

        {/* Contact Artisan Section */}
        <div className="border border-desert-200 rounded-2xl overflow-hidden mb-6">
          <button
            onClick={() => setContactOpen(!contactOpen)}
            className="w-full flex items-center justify-between px-5 py-4 bg-desert-50 hover:bg-desert-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              {product.artisan.avatarUrl ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={product.artisan.avatarUrl}
                    alt={product.artisan.shopName}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sand-400 to-oasis-500 flex items-center justify-center text-white font-bold text-sm">
                  {product.artisan.shopName.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-clay-800 text-sm">
                  {product.artisan.shopName}
                </p>
                {product.artisan.specialization && (
                  <p className="text-xs text-clay-400">{product.artisan.specialization}</p>
                )}
              </div>
            </div>
            <span className="text-sm font-semibold text-sand-600">
              {isAr ? "تواصل مع الحرفي ↓" : "Contact Artisan ↓"}
            </span>
          </button>

          {contactOpen && (
            <div className="px-5 py-4 space-y-3 bg-white">
              {displayBio && (
                <p className="text-sm text-clay-600 leading-relaxed border-b border-desert-100 pb-3">
                  {displayBio}
                </p>
              )}
              <div className="flex flex-col gap-2.5">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {isAr ? "تواصل عبر واتساب" : "WhatsApp"}
                    <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                  </a>
                )}
                {product.artisan.email && (
                  <a
                    href={`mailto:${product.artisan.email}?subject=${encodeURIComponent(
                      isAr ? `استفسار عن: ${displayName}` : `Inquiry about: ${displayName}`
                    )}`}
                    className="flex items-center gap-3 px-4 py-3 bg-sand-500 hover:bg-sand-600 text-white rounded-xl font-semibold text-sm transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {isAr ? "إرسال بريد إلكتروني" : "Send Email"}
                    <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                  </a>
                )}
                {!whatsappUrl && !product.artisan.email && (
                  <p className="text-sm text-clay-400 text-center py-2">
                    {isAr
                      ? "تواصل مع الحرفي عبر صفحة الحرفي"
                      : "Visit the artisan's page for contact details"}
                  </p>
                )}
                <a
                  href={`/${locale}/artisans/${product.artisan.slug}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-desert-300 text-clay-700 hover:bg-desert-50 rounded-xl text-sm font-medium transition-colors"
                >
                  {isAr ? "عرض ملف الحرفي" : "View Artisan Profile"}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Authenticity stamp */}
        <div className="flex items-center gap-3 text-sm text-clay-500 bg-desert-50 rounded-xl px-4 py-3">
          <span className="text-2xl">🏅</span>
          <p className="leading-snug">
            {isAr
              ? "منتج حرفي أصيل من تيميمون، الجزائر. كل قطعة مصنوعة يدوياً."
              : "Authentic artisanal piece from Timimoun, Algeria. Each item is uniquely handmade."}
          </p>
        </div>
      </div>
    </div>

    {/* Sticky Add to Cart / Buy Now bar */}
    <StickyProductActions
      product={product}
      triggerRef={cartButtonRef}
      locale={locale}
    />
    </>
  );
}
