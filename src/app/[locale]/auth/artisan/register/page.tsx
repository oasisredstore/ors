"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { artisanRegisterAction, providerRegisterAction } from "@/actions/auth.actions";
import {
  ArrowLeft,
  Store,
  TreePalm,
  Hotel,
  Compass,
  Building2,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────
   Vendor type config
   ────────────────────────────────────────────────── */
const VENDOR_TYPES = [
  {
    value: "ARTISAN",
    icon: Store,
    labelAr: "حرفي",
    labelEn: "Artisan",
    descAr: "حرف تقليدية، فخار، نسيج، مجوهرات...",
    descEn: "Traditional crafts, pottery, textiles, jewelry...",
    color: "from-sand-400 to-sand-600",
    bg: "bg-sand-50 border-sand-200 hover:border-sand-400",
    activeBg: "bg-sand-500 border-sand-500 text-white",
  },
  {
    value: "HOTEL",
    icon: Hotel,
    labelAr: "فندق",
    labelEn: "Hotel",
    descAr: "فندق، نزل، شقة مفروشة",
    descEn: "Hotel, inn, furnished apartment",
    color: "from-oasis-400 to-oasis-600",
    bg: "bg-oasis-50 border-oasis-200 hover:border-oasis-400",
    activeBg: "bg-oasis-600 border-oasis-600 text-white",
  },
  {
    value: "GUEST_HOUSE",
    icon: TreePalm,
    labelAr: "بيت ضيافة",
    labelEn: "Guest House",
    descAr: "بيت تقليدي، دار ضيافة",
    descEn: "Traditional home, guesthouse",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
    activeBg: "bg-emerald-600 border-emerald-600 text-white",
  },
  {
    value: "GUIDE",
    icon: Compass,
    labelAr: "مرشد سياحي",
    labelEn: "Tour Guide",
    descAr: "جولات سياحية، رحلات صحراوية",
    descEn: "Tourist tours, desert expeditions",
    color: "from-amber-400 to-amber-600",
    bg: "bg-amber-50 border-amber-200 hover:border-amber-400",
    activeBg: "bg-amber-500 border-amber-500 text-white",
  },
  {
    value: "AGENCY",
    icon: Building2,
    labelAr: "وكالة سياحية",
    labelEn: "Travel Agency",
    descAr: "وكالة سفر وتنظيم رحلات",
    descEn: "Travel agency & trip organizer",
    color: "from-indigo-400 to-indigo-600",
    bg: "bg-indigo-50 border-indigo-200 hover:border-indigo-400",
    activeBg: "bg-indigo-600 border-indigo-600 text-white",
  },
] as const;

/* ──────────────────────────────────────────────────
   Benefits list
   ────────────────────────────────────────────────── */
const BENEFITS_AR = [
  "متجر إلكتروني مجاني يصل إلى آلاف الزبائن",
  "لوحة تحكم ذكية لإدارة منتجاتك وطلباتك",
  "دعم متخصص من فريق قورارة للحرف",
  "تسويق مجاني عبر وسائل التواصل الاجتماعي",
  "إحصاءات ومبيعات لحظية في متناول يدك",
];

const BENEFITS_EN = [
  "Free online store reaching thousands of customers",
  "Smart dashboard to manage your products & orders",
  "Dedicated support from the Gourara Crafts team",
  "Free social media marketing promotion",
  "Real-time stats and sales analytics",
];

export default function ArtisanRegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const { locale = "en" } = useParams<{ locale: string }>();
  const isAr = locale === "ar";

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<string>("ARTISAN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("role", selectedType);

    let result;
    if (selectedType === "ARTISAN") {
      const artisanData = new FormData();
      artisanData.append("firstName", formData.get("firstName") as string);
      artisanData.append("lastName", formData.get("lastName") as string);
      artisanData.append("email", formData.get("email") as string);
      artisanData.append("password", formData.get("password") as string);
      artisanData.append("phone", formData.get("phone") as string);
      artisanData.append("shopName", formData.get("businessName") as string);
      artisanData.append("bio", formData.get("description") as string);
      artisanData.append("location", formData.get("location") as string);
      artisanData.append("specialization", formData.get("specialization") as string);
      result = await artisanRegisterAction(artisanData);
    } else {
      result = await providerRegisterAction(formData);
    }

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(`/${locale}/dashboard`);
  }

  const selectedVendor = VENDOR_TYPES.find((v) => v.value === selectedType)!;
  const benefits = isAr ? BENEFITS_AR : BENEFITS_EN;

  return (
    <div className="min-h-screen bg-gradient-to-br from-clay-900 via-clay-800 to-clay-900 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-oasis-500/10 rounded-full blur-3xl" />
      </div>

      {/* Back link */}
      <Link
        href={`/${locale}/auth/login`}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition-all font-semibold text-sm z-10"
      >
        <ArrowLeft className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
        {isAr ? "العودة لتسجيل الدخول" : "Back to Login"}
      </Link>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── Left: Benefits panel ── */}
          <div className="lg:col-span-2 text-white">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center text-sm font-bold shadow-lg">
                  {isAr ? "ق" : "G"}
                </div>
                <span className="font-display font-bold text-lg opacity-90">
                  {isAr ? "قورارة للحرف" : "Gourara Crafts"}
                </span>
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {isAr ? "افتح متجرك\nالإلكتروني مجاناً" : "Open Your\nFree Online Store"}
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                {isAr
                  ? "انضم إلى شبكة الحرفيين والخدمات السياحية في قورارة وابدأ بيع منتجاتك للعالم."
                  : "Join the Gourara artisan & tourism network and start selling your products to the world."}
              </p>
            </div>

            <ul className="space-y-3">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-white/90">
                  <CheckCircle2 className="w-5 h-5 text-sand-400 shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                {isAr ? "لديك حساب بالفعل؟" : "Already have an account?"}
              </p>
              <Link
                href={`/${locale}/auth/login`}
                className="flex items-center gap-2 text-sand-300 font-bold hover:text-sand-200 transition-colors"
              >
                {isAr ? "تسجيل الدخول" : "Sign In"}
                <ChevronRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>

          {/* ── Right: Form panel ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-2xl p-7 sm:p-9">

              {/* Step indicator */}
              <div className="flex items-center gap-3 mb-7">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all",
                  step >= 1 ? "bg-sand-500 text-white" : "bg-desert-100 text-clay-400"
                )}>1</div>
                <div className={cn("flex-1 h-1 rounded-full transition-all", step >= 2 ? "bg-sand-500" : "bg-desert-100")} />
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all",
                  step >= 2 ? "bg-sand-500 text-white" : "bg-desert-100 text-clay-400"
                )}>2</div>
              </div>

              {/* ── STEP 1: Choose type ── */}
              {step === 1 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-clay-800 mb-1">
                    {isAr ? "اختر نوع نشاطك" : "Choose your business type"}
                  </h2>
                  <p className="text-sm text-clay-400 mb-6">
                    {isAr ? "سيتم تخصيص تجربتك بناءً على اختيارك" : "Your experience will be tailored to your selection"}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                    {VENDOR_TYPES.map((type) => {
                      const Icon = type.icon;
                      const active = selectedType === type.value;
                      return (
                        <button
                          key={type.value}
                          onClick={() => setSelectedType(type.value)}
                          className={cn(
                            "flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200",
                            active
                              ? "border-sand-500 bg-sand-50 shadow-md"
                              : "border-desert-200 bg-white hover:border-sand-300 hover:shadow-sm"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            active
                              ? `bg-gradient-to-br ${type.color}`
                              : "bg-desert-100"
                          )}>
                            <Icon className={cn("w-5 h-5", active ? "text-white" : "text-clay-500")} />
                          </div>
                          <div className="min-w-0">
                            <p className={cn("font-bold text-sm", active ? "text-sand-700" : "text-clay-800")}>
                              {isAr ? type.labelAr : type.labelEn}
                            </p>
                            <p className="text-xs text-clay-400 mt-0.5 leading-snug">
                              {isAr ? type.descAr : type.descEn}
                            </p>
                          </div>
                          {active && (
                            <CheckCircle2 className="w-5 h-5 text-sand-500 shrink-0 ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setStep(2)}
                  >
                    {isAr ? "التالي ←" : "Continue →"}
                  </Button>
                </div>
              )}

              {/* ── STEP 2: Fill form ── */}
              {step === 2 && (
                <div>
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-sm text-clay-500 hover:text-clay-700 mb-5 transition-colors"
                  >
                    <ArrowLeft className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                    {isAr ? "تغيير نوع النشاط" : "Change business type"}
                  </button>

                  <div className="flex items-center gap-3 mb-6 p-3 bg-desert-50 rounded-2xl border border-desert-100">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shrink-0",
                      selectedVendor.color
                    )}>
                      <selectedVendor.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-clay-800">
                        {isAr ? selectedVendor.labelAr : selectedVendor.labelEn}
                      </p>
                      <p className="text-xs text-clay-400">
                        {isAr ? selectedVendor.descAr : selectedVendor.descEn}
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Business info */}
                    <div className="p-4 bg-oasis-50 rounded-2xl border border-oasis-100">
                      <p className="text-xs font-bold text-oasis-700 mb-3 uppercase tracking-wide">
                        {isAr ? "معلومات النشاط" : "Business Information"}
                      </p>
                      <div className="space-y-4">
                        <Input
                          id="businessName"
                          name="businessName"
                          label={t("businessName")}
                          placeholder={isAr ? "اسم متجرك أو مشروعك" : "Your shop / business name"}
                          required
                        />
                        <Input
                          id="specialization"
                          name="specialization"
                          label={t("specialization")}
                          placeholder={isAr ? "مثال: فخار، جولات صحراوية..." : "Pottery, desert tours..."}
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
                                : "Tell your story and describe your services..."
                            }
                            className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 placeholder:text-clay-400 outline-none focus:border-oasis-500 focus:ring-2 focus:ring-oasis-100 transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Personal info */}
                    <div className="p-4 bg-desert-50 rounded-2xl border border-desert-100">
                      <p className="text-xs font-bold text-clay-600 mb-3 uppercase tracking-wide">
                        {isAr ? "المعلومات الشخصية" : "Personal Information"}
                      </p>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <Input id="firstName" name="firstName" label={t("firstName")} required />
                          <Input id="lastName" name="lastName" label={t("lastName")} required />
                        </div>
                        <Input id="email" name="email" type="email" label={t("email")} required />
                        <Input id="phone" name="phone" type="tel" label={t("phone")} />
                        {/* Password + show/hide */}
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPw ? "text" : "password"}
                            label={t("password")}
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                      {isAr ? "إنشاء الحساب وتقديم الطلب" : "Create Account & Apply"}
                    </Button>

                    {/* Security Notice */}
                    <div className="p-3 bg-desert-50 border border-desert-200 rounded-xl flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-oasis-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-clay-500 leading-relaxed">
                        {isAr
                          ? "بياناتك محمية بتشفير SSL. سيتم مراجعة حسابك قبل التفعيل."
                          : "Your data is SSL-encrypted. Your account will be reviewed before activation."}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5">
                      <Lock className="w-3 h-3 text-clay-400" />
                      <p className="text-xs text-clay-400">
                        {isAr ? "سياسة الخصوصية · شروط الخدمة" : "Privacy Policy · Terms of Service"}
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
