"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerAction } from "@/actions/auth.actions";
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";

function PasswordStrength({ password }: { password: string }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const labelsAr = ["ضعيف جداً", "ضعيف", "مقبول", "قوي"];
  const labelsEn = ["Very weak", "Weak", "Fair", "Strong"];
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const textColors = ["text-red-500", "text-orange-500", "text-yellow-600", "text-green-600"];

  if (!password) return null;
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < score ? colors[score - 1] : "bg-desert-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const { locale = "en" } = useParams<{ locale: string }>();
  const isAr = locale === "ar";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await registerAction(new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(`/${locale}`);
  }

  return (
    <div className="min-h-screen bg-desert-gradient flex items-center justify-center px-4 py-12 relative">
      <Link
        href={`/${locale}`}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-clay-600 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-sm backdrop-blur-sm transition-all font-semibold text-sm z-10"
      >
        <ArrowLeft className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
        {isAr ? "العودة للرئيسية" : "Back to Home"}
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sand-500 to-clay-700 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white font-display font-bold text-xl">
                {isAr ? "ق" : "G"}
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-clay-800">
              {t("register")}
            </h1>
            <p className="text-sm text-clay-400 mt-1">
              {isAr ? "قورارة للحرف" : "Gourara Crafts"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Password + show/hide + strength meter */}
            <div>
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
              <PasswordStrength password={password} />
            </div>

            <Button type="submit" size="lg" isLoading={loading} className="w-full mt-2">
              {t("register")}
            </Button>
          </form>

          {/* Security / Privacy Notice */}
          <div className="mt-5 p-3 bg-desert-50 border border-desert-200 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-oasis-600 shrink-0 mt-0.5" />
            <p className="text-xs text-clay-500 leading-relaxed">
              {isAr
                ? "بياناتك محمية بتشفير SSL آمن. لن نشارك معلوماتك مع أي طرف ثالث."
                : "Your data is protected with SSL encryption. We never share your info with third parties."}
            </p>
          </div>

          <p className="text-center text-sm text-clay-500 mt-5">
            {t("hasAccount")}{" "}
            <Link
              href={`/${locale}/auth/login`}
              className="text-sand-600 font-semibold hover:text-sand-700"
            >
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
