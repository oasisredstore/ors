"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { providerRegisterAction } from "@/actions/auth.actions";
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";

export default function ProviderRegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const { locale = "en" } = useParams<{ locale: string }>();
  const isAr = locale === "ar";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await providerRegisterAction(new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(`/${locale}/pricing`);
  }

  return (
    <div className="min-h-screen bg-desert-gradient flex items-center justify-center px-4 py-12 relative">
      <Link
        href={`/${locale}/auth/login`}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-clay-600 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-sm backdrop-blur-sm transition-all font-semibold text-sm z-10"
      >
        <ArrowLeft className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
        {isAr ? "العودة لتسجيل الدخول" : "Back to Login"}
      </Link>

      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-oasis-500 to-oasis-700 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-2xl">🏨</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-clay-800">
              {isAr ? "تسجيل مقدم خدمة سياحية" : "Register as Service Provider"}
            </h1>
            <p className="text-sm text-clay-400 mt-1">
              {isAr
                ? "فندق، مرشد سياحي، أو وكالة"
                : "Hotel, Tour Guide, or Travel Agency"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business info */}
            <div className="p-4 bg-oasis-50 rounded-2xl border border-oasis-100 mb-2">
              <p className="text-xs font-semibold text-oasis-700 mb-3 uppercase tracking-wide">
                {isAr ? "معلومات النشاط" : "Business Information"}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-clay-700 block mb-1.5">
                    {isAr ? "نوع النشاط" : "Service Type"}
                  </label>
                  <select
                    name="role"
                    required
                    className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 bg-white outline-none focus:border-oasis-500 focus:ring-2 focus:ring-oasis-100 transition-all"
                  >
                    <option value="">{isAr ? "-- اختر نوع النشاط --" : "-- Select type --"}</option>
                    <option value="HOTEL">{isAr ? "فندق" : "Hotel"}</option>
                    <option value="GUEST_HOUSE">{isAr ? "بيت سياحي" : "Guest House"}</option>
                    <option value="GUIDE">{isAr ? "مرشد سياحي" : "Tour Guide"}</option>
                    <option value="AGENCY">{isAr ? "وكالة سياحية" : "Travel Agency"}</option>
                  </select>
                </div>
                <Input
                  id="businessName"
                  name="businessName"
                  label={isAr ? "اسم النشاط التجاري" : "Business Name"}
                  placeholder={isAr ? "مثال: فندق واحة تيميمون" : "e.g. Timimoun Oasis Hotel"}
                  required
                />
                <Input
                  id="location"
                  name="location"
                  label={t("location")}
                  placeholder={isAr ? "تيميمون، الجزائر" : "Timimoun, Algeria"}
                />
                <div>
                  <label className="text-sm font-medium text-clay-700 block mb-1.5">
                    {t("bio")}
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder={
                      isAr
                        ? "احك قصتك وصف خدماتك..."
                        : "Describe your services..."
                    }
                    className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 placeholder:text-clay-400 outline-none focus:border-oasis-500 focus:ring-2 focus:ring-oasis-100 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Personal info */}
            <div className="p-4 bg-desert-50 rounded-2xl border border-desert-100">
              <p className="text-xs font-semibold text-clay-600 mb-3 uppercase tracking-wide">
                {isAr ? "المعلومات الشخصية" : "Personal Information"}
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    id="firstName"
                    name="firstName"
                    label={t("firstName")}
                    placeholder={isAr ? "الاسم الأول" : "First name"}
                    required
                  />
                  <Input
                    id="lastName"
                    name="lastName"
                    label={t("lastName")}
                    placeholder={isAr ? "اللقب" : "Last name"}
                    required
                  />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label={t("email")}
                  placeholder={isAr ? "بريدك الإلكتروني" : "your@email.com"}
                  required
                />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  label={t("phone")}
                  placeholder="+213 6XX XXX XXX"
                />
                {/* Password with show/hide */}
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    label={t("password")}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 bottom-2.5 text-clay-400 hover:text-clay-700 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" isLoading={loading} className="w-full mt-2">
              {isAr ? "تسجيل واختيار الخطة" : "Register & Choose Plan"}
            </Button>

            {/* Security Notice */}
            <div className="p-3 bg-desert-50 border border-desert-200 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-oasis-600 shrink-0 mt-0.5" />
              <p className="text-xs text-clay-500 leading-relaxed">
                {isAr
                  ? "بياناتك محمية بتشفير SSL. سيتم مراجعة حسابك من قِبل الفريق قبل التفعيل."
                  : "Your data is SSL-encrypted. Your account will be reviewed by our team before activation."}
              </p>
            </div>
          </form>

          <p className="text-center text-sm text-clay-500 mt-4">
            {t("hasAccount")}{" "}
            <Link href={`/${locale}/auth/login`} className="text-sand-600 font-semibold hover:text-sand-700">
              {t("login")}
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-4">
          <Lock className="w-3 h-3 text-clay-400" />
          <p className="text-xs text-clay-400">
            {isAr ? "سياسة الخصوصية · شروط الخدمة" : "Privacy Policy · Terms of Service"}
          </p>
        </div>
      </div>
    </div>
  );
}
