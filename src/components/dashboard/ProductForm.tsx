"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createProductAction } from "@/actions/product.actions";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  nameAr: string;
}

export function ProductForm({
  locale,
  categories,
}: {
  locale: string;
  categories: Category[];
  productId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    // Upload images first
    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
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

    formData.set("imageUrls", JSON.stringify(uploadedUrls));

    const result = await createProductAction(formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(locale === "ar" ? "تم إنشاء المنتج!" : "Product created!");
    router.push(`/${locale}/dashboard/products`);
  }

  const isAr = locale === "ar";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-5xl">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6 space-y-4">
        <h2 className="font-semibold text-clay-800">{isAr ? "معلومات المنتج" : "Product Information"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input id="name" name="name" label="Product Name (English)" required />
          <Input id="nameAr" name="nameAr" label="اسم المنتج (بالعربية)" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-clay-700 block mb-1.5">Description (English)</label>
            <textarea
              name="description"
              rows={4}
              className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 focus:outline-none focus:border-sand-400 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-clay-700 block mb-1.5">الوصف (بالعربية)</label>
            <textarea
              name="descriptionAr"
              rows={4}
              dir="rtl"
              className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 focus:outline-none focus:border-sand-400 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6 space-y-4">
        <h2 className="font-semibold text-clay-800">{isAr ? "التصنيف" : "Category"}</h2>
        <div>
          <label className="text-sm font-medium text-clay-700 block mb-1.5">{isAr ? "الفئة" : "Category"}</label>
          <select
            name="categoryId"
            required
            className="w-full md:w-1/2 rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 focus:outline-none focus:border-sand-400"
          >
            <option value="">{isAr ? "اختر فئة" : "Select a category"}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{isAr ? cat.nameAr : cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6 space-y-4">
        <h2 className="font-semibold text-clay-800">{isAr ? "تفاصيل الحرفة" : "Craft Details"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Input id="material" name="material" label={isAr ? "المواد المستخدمة" : "Material"} placeholder="Clay, Cotton..." />
          <Input id="dimensions" name="dimensions" label={isAr ? "الأبعاد" : "Dimensions"} placeholder="20cm × 15cm" />
          <Input id="origin" name="origin" label={isAr ? "مكان الصنع" : "Place of Origin"} placeholder="Timimoun, Adrar" />
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6 space-y-4">
        <h2 className="font-semibold text-clay-800">{isAr ? "السعر والمخزون" : "Pricing & Stock"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="sm:col-span-1 lg:col-span-2">
            <label className="text-sm font-medium text-clay-700 block mb-1.5">
              {isAr ? "السعر (دج)" : "Price (DZD)"}
            </label>
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="100"
                required
                placeholder="0"
                className={`w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 focus:outline-none focus:border-sand-400 ${isAr ? 'pl-14' : 'pr-14'}`}
              />
              <span className={`absolute top-1/2 -translate-y-1/2 text-xs text-clay-400 font-medium ${isAr ? 'left-4' : 'right-4'}`}>DZD</span>
            </div>
          </div>
          <div className="sm:col-span-1 lg:col-span-2">
            <label className="text-sm font-medium text-clay-700 block mb-1.5">
              {isAr ? "الكمية المتاحة" : "Stock Quantity"}
            </label>
            <input
              id="stockQty"
              name="stockQty"
              type="number"
              min="0"
              step="1"
              defaultValue="1"
              required
              className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 focus:outline-none focus:border-sand-400"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6">
        <h2 className="font-semibold text-clay-800 mb-2">{isAr ? "الصور" : "Product Images"}</h2>
        <p className="text-xs text-clay-400 mb-4">
          {isAr ? "ارفع حتى 5 صور. الأولى ستكون الصورة الرئيسية." : "Upload up to 5 images. First image will be the main product photo."}
        </p>

        {imagePreviews.length > 0 && (
          <div className="flex gap-4 flex-wrap mb-6">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-desert-200">
                <Image src={src} className="object-cover" alt="" fill unoptimized />
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-sand-500 text-white text-xs text-center rounded-b-xl py-1 font-medium">
                    {isAr ? "رئيسية" : "Main"}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className={`absolute -top-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-md ${isAr ? '-left-2' : '-right-2'}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-desert-300 rounded-xl p-10 cursor-pointer hover:border-sand-400 hover:bg-desert-50 transition-all">
          <Upload className="w-10 h-10 text-clay-300 mb-3" />
          <span className="text-sm font-medium text-clay-500">{isAr ? "اضغط لرفع الصور" : "Click to upload images"}</span>
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
        <label className="flex items-center gap-4 cursor-pointer w-fit">
          <div className="relative">
            <input type="checkbox" name="isPublished" value="true" className="sr-only peer" />
            <div className="w-12 h-7 bg-clay-200 peer-checked:bg-sand-500 rounded-full transition-colors" />
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isAr ? 'right-1 peer-checked:-translate-x-5' : 'left-1 peer-checked:translate-x-5'}`} />
          </div>
          <div>
            <p className="font-medium text-clay-800 text-sm">{isAr ? "نشر المنتج" : "Publish Product"}</p>
            <p className="text-xs text-clay-400">{isAr ? "سيظهر في المعرض مباشرةً" : "Will be visible in the gallery immediately"}</p>
          </div>
        </label>
      </div>

      <Button type="submit" size="lg" isLoading={loading}>
        {isAr ? "إنشاء المنتج" : "Create Product"}
      </Button>
    </form>
  );
}
