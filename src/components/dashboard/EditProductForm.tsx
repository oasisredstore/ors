"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateProductAction } from "@/actions/product.actions";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  nameAr: string;
}

interface ExistingProduct {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  categoryId: string;
  material: string | null;
  dimensions: string | null;
  origin: string | null;
  price: number;
  stockQty: number;
  isPublished: boolean;
  isFeatured: boolean;
  images: { url: string; isPrimary: boolean }[];
}

export function EditProductForm({
  locale,
  categories,
  product,
}: {
  locale: string;
  categories: Category[];
  product: ExistingProduct;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setNewImageFiles(files);
    setNewImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeNewImage = (i: number) => {
    setNewImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setNewImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    // Upload any new images
    const uploadedUrls: string[] = [];
    for (const file of newImageFiles) {
      const imgForm = new FormData();
      imgForm.set("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: imgForm });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
      } catch {
        // Skip failed upload
      }
    }

    if (uploadedUrls.length > 0) {
      formData.set("imageUrls", JSON.stringify(uploadedUrls));
    }

    const result = await updateProductAction(product.id, formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(locale === "ar" ? "تم تحديث المنتج!" : "Product updated!");
    router.push(`/${locale}/dashboard/products`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6 space-y-4">
        <h2 className="font-semibold text-clay-800">
          {locale === "ar" ? "معلومات المنتج" : "Product Information"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="name" name="name" label="Product Name (English)" defaultValue={product.name} required />
          <Input id="nameAr" name="nameAr" label="اسم المنتج (بالعربية)" defaultValue={product.nameAr ?? ""} />
        </div>
        <div>
          <label className="text-sm font-medium text-clay-700 block mb-1.5">Description (English)</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={product.description ?? ""}
            className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 focus:outline-none focus:border-sand-400 resize-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-clay-700 block mb-1.5">الوصف (بالعربية)</label>
          <textarea
            name="descriptionAr"
            rows={3}
            dir="rtl"
            defaultValue={product.descriptionAr ?? ""}
            className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 focus:outline-none focus:border-sand-400 resize-none"
          />
        </div>
      </div>

      {/* Category */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6 space-y-4">
        <h2 className="font-semibold text-clay-800">
          {locale === "ar" ? "التصنيف" : "Category"}
        </h2>
        <div>
          <label className="text-sm font-medium text-clay-700 block mb-1.5">Category</label>
          <select
            name="categoryId"
            defaultValue={product.categoryId}
            required
            className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 focus:outline-none focus:border-sand-400"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6 space-y-4">
        <h2 className="font-semibold text-clay-800">
          {locale === "ar" ? "تفاصيل الحرفة" : "Craft Details"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="material"
            name="material"
            label="Material"
            placeholder="Clay, Cotton..."
            defaultValue={product.material ?? ""}
          />
          <Input
            id="dimensions"
            name="dimensions"
            label="Dimensions"
            placeholder="20cm × 15cm"
            defaultValue={product.dimensions ?? ""}
          />
        </div>
        <Input
          id="origin"
          name="origin"
          label={locale === "ar" ? "مكان الصنع" : "Place of Origin"}
          placeholder="Timimoun, Adrar"
          defaultValue={product.origin ?? ""}
        />
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6 space-y-4">
        <h2 className="font-semibold text-clay-800">
          {locale === "ar" ? "السعر والمخزون" : "Pricing & Stock"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-clay-700 block mb-1.5">
              {locale === "ar" ? "السعر (دج)" : "Price (DZD)"}
            </label>
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="100"
                required
                defaultValue={product.price}
                className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 focus:outline-none focus:border-sand-400 pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-clay-400 font-medium">DZD</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-clay-700 block mb-1.5">
              {locale === "ar" ? "الكمية المتاحة" : "Stock Quantity"}
            </label>
            <input
              id="stockQty"
              name="stockQty"
              type="number"
              min="0"
              step="1"
              required
              defaultValue={product.stockQty}
              className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 focus:outline-none focus:border-sand-400"
            />
          </div>
        </div>
      </div>

      {/* Existing Images */}
      {product.images.length > 0 && (
        <div className="bg-white rounded-2xl border border-desert-200 p-6">
          <h2 className="font-semibold text-clay-800 mb-3">
            {locale === "ar" ? "الصور الحالية" : "Current Images"}
          </h2>
          <div className="flex gap-3 flex-wrap">
            {product.images.map((img, i) => (
              <div key={i} className="relative w-20 h-20">
                <img src={img.url} className="w-20 h-20 rounded-xl object-cover border border-desert-200" alt="" />
                {img.isPrimary && (
                  <span className="absolute bottom-0 left-0 right-0 bg-sand-500 text-white text-xs text-center rounded-b-xl py-0.5">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Images */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6">
        <h2 className="font-semibold text-clay-800 mb-2">
          {locale === "ar" ? "إضافة صور جديدة" : "Add New Images"}
        </h2>
        <p className="text-xs text-clay-400 mb-4">
          {locale === "ar"
            ? "الصور الجديدة ستُضاف إلى المنتج"
            : "New images will be appended to the product."}
        </p>

        {newImagePreviews.length > 0 && (
          <div className="flex gap-3 flex-wrap mb-4">
            {newImagePreviews.map((src, i) => (
              <div key={i} className="relative w-20 h-20">
                <img src={src} className="w-20 h-20 rounded-xl object-cover border border-desert-200" alt="" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-desert-300 rounded-xl p-8 cursor-pointer hover:border-sand-400 hover:bg-desert-50 transition-all">
          <Upload className="w-8 h-8 text-clay-300 mb-2" />
          <span className="text-sm text-clay-400">Click to upload images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      {/* Publish Toggle */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={product.isPublished}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-clay-200 peer-checked:bg-sand-500 rounded-full transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
          </div>
          <div>
            <p className="font-medium text-clay-800 text-sm">
              {locale === "ar" ? "نشر المنتج" : "Publish Product"}
            </p>
            <p className="text-xs text-clay-400">
              {locale === "ar" ? "سيظهر في المتجر مباشرةً" : "Will be visible to customers immediately"}
            </p>
          </div>
        </label>
      </div>

      <Button type="submit" size="lg" isLoading={loading}>
        {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
      </Button>
    </form>
  );
}
