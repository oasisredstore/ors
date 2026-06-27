"use client";

import { useState, useTransition } from "react";
import { updateArtisanProfileAction } from "@/actions/artisan.actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { User, MapPin, Phone, Mail, Image as ImageIcon, FileText, Globe } from "lucide-react";

interface ProfileFormProps {
  locale: string;
  artisan: {
    shopName: string;
    bio: string | null;
    bioAr: string | null;
    location: string | null;
    specialization: string | null;
    whatsapp: string | null;
    email: string | null;
    avatarUrl: string | null;
    coverUrl: string | null;
  };
}

export function ProfileForm({ locale, artisan }: ProfileFormProps) {
  const isAr = locale === "ar";
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState(artisan.avatarUrl || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateArtisanProfileAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(isAr ? "تم حفظ الملف الشخصي بنجاح!" : "Profile saved successfully!");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} dir={isAr ? "rtl" : "ltr"} className="space-y-6">
      {/* Avatar Preview */}
      <div className={`flex items-center gap-5 mb-2 ${isAr ? "flex-row-reverse" : ""}`}>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sand-300 to-oasis-400 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shrink-0">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" onError={() => setAvatarPreview("")} />
          ) : (
            artisan.shopName.charAt(0)
          )}
        </div>
        <div className="flex-1">
          <label className={`block text-sm font-medium text-clay-700 mb-1.5 ${isAr ? "text-right" : ""}`}>
            <ImageIcon className="w-4 h-4 inline-block mr-1.5" />
            {isAr ? "رابط الصورة الشخصية" : "Avatar URL"}
          </label>
          <input
            name="avatarUrl"
            type="url"
            defaultValue={artisan.avatarUrl || ""}
            placeholder="https://..."
            onChange={(e) => setAvatarPreview(e.target.value)}
            className={`w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 text-sm ${isAr ? "text-right" : ""}`}
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6">
        <h2 className={`font-semibold text-clay-800 mb-5 flex items-center gap-2 ${isAr ? "flex-row-reverse text-right" : ""}`}>
          <User className="w-4 h-4 text-sand-500" />
          {isAr ? "المعلومات الأساسية" : "Basic Information"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              id="shopName"
              name="shopName"
              label={isAr ? "اسم المتجر *" : "Shop Name *"}
              defaultValue={artisan.shopName}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium text-clay-700 mb-1.5 ${isAr ? "text-right" : ""}`}>
              <Globe className="w-4 h-4 inline-block mr-1.5" />
              {isAr ? "التخصص" : "Specialization"}
            </label>
            <input
              name="specialization"
              defaultValue={artisan.specialization || ""}
              placeholder={isAr ? "مثال: السجاد التقليدي" : "e.g. Traditional Carpets"}
              className={`w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 text-sm ${isAr ? "text-right" : ""}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium text-clay-700 mb-1.5 ${isAr ? "text-right" : ""}`}>
              <MapPin className="w-4 h-4 inline-block mr-1.5" />
              {isAr ? "الموقع" : "Location"}
            </label>
            <input
              name="location"
              defaultValue={artisan.location || ""}
              placeholder={isAr ? "مثال: تيميمون، أدرار" : "e.g. Timimoun, Adrar"}
              className={`w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 text-sm ${isAr ? "text-right" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6">
        <h2 className={`font-semibold text-clay-800 mb-5 flex items-center gap-2 ${isAr ? "flex-row-reverse text-right" : ""}`}>
          <FileText className="w-4 h-4 text-sand-500" />
          {isAr ? "النبذة التعريفية" : "Biography"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium text-clay-700 mb-1.5 ${isAr ? "text-right" : ""}`}>
              {isAr ? "النبذة بالإنجليزية" : "Bio (English)"}
            </label>
            <textarea
              name="bio"
              defaultValue={artisan.bio || ""}
              rows={3}
              maxLength={1000}
              placeholder="Tell your story as an artisan..."
              className="w-full rounded-xl border border-desert-300 px-4 py-3 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 resize-none text-sm"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium text-clay-700 mb-1.5 text-right`}>
              النبذة بالعربية
            </label>
            <textarea
              name="bioAr"
              defaultValue={artisan.bioAr || ""}
              rows={3}
              maxLength={1000}
              dir="rtl"
              placeholder="اكتب قصتك كحرفي..."
              className="w-full rounded-xl border border-desert-300 px-4 py-3 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 resize-none text-sm text-right"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6">
        <h2 className={`font-semibold text-clay-800 mb-5 flex items-center gap-2 ${isAr ? "flex-row-reverse text-right" : ""}`}>
          <Phone className="w-4 h-4 text-sand-500" />
          {isAr ? "بيانات التواصل" : "Contact Details"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium text-clay-700 mb-1.5 ${isAr ? "text-right" : ""}`}>
              <Phone className="w-4 h-4 inline-block mr-1.5" />
              {isAr ? "واتساب" : "WhatsApp"}
            </label>
            <input
              name="whatsapp"
              type="tel"
              defaultValue={artisan.whatsapp || ""}
              placeholder="+213 555 123456"
              className={`w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 text-sm ${isAr ? "text-right" : ""}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium text-clay-700 mb-1.5 ${isAr ? "text-right" : ""}`}>
              <Mail className="w-4 h-4 inline-block mr-1.5" />
              {isAr ? "البريد الإلكتروني" : "Email"}
            </label>
            <input
              name="email"
              type="email"
              defaultValue={artisan.email || ""}
              placeholder="artisan@example.com"
              className={`w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 text-sm ${isAr ? "text-right" : ""}`}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium text-clay-700 mb-1.5 ${isAr ? "text-right" : ""}`}>
              <ImageIcon className="w-4 h-4 inline-block mr-1.5" />
              {isAr ? "صورة الغلاف (اختيارية)" : "Cover Image URL (optional)"}
            </label>
            <input
              name="coverUrl"
              type="url"
              defaultValue={artisan.coverUrl || ""}
              placeholder="https://..."
              className={`w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 text-sm ${isAr ? "text-right" : ""}`}
            />
          </div>
        </div>
      </div>

      <Button type="submit" isLoading={isPending} size="lg" className="w-full">
        {isAr ? "حفظ التغييرات" : "Save Changes"}
      </Button>
    </form>
  );
}
