"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginAction } from "@/actions/auth.actions";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const { locale = "en" } = useParams<{ locale: string }>();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await loginAction(new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.role === "ADMIN") {
      router.push(`/${locale}/admin`);
    } else if (result.role === "ARTISAN") {
      router.push(`/${locale}/dashboard`);
    } else {
      router.push(`/${locale}`);
    }
    // B12 FIX: router.refresh() after router.push() is a no-op — the current
    // page is unmounted before refresh could run. Removed dead code.
  }

  return (
    <div className="min-h-screen bg-desert-gradient flex items-center justify-center px-4 relative">
      <Link 
        href={`/${locale}`} 
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-clay-600 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-sm backdrop-blur-sm transition-all font-semibold text-sm z-10"
      >
        <ArrowLeft className={`w-4 h-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
        {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
      </Link>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sand-500 to-clay-700 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white font-display font-bold text-xl">R</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-clay-800">
              {t("login")}
            </h1>
            <p className="text-sm text-clay-400 mt-1">RedOasisArtisan</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              label={t("email")}
              placeholder="you@example.com"
              required
            />
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
                className="absolute right-3 bottom-2.5 text-clay-400 hover:text-clay-700"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
            >
              {t("login")}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-clay-500">
              {t("noAccount")}{" "}
              <Link
                href={`/${locale}/auth/register`}
                className="text-sand-600 font-semibold hover:text-sand-700"
              >
                {t("register")}
              </Link>
            </p>
            <p className="text-sm text-clay-500">
              Artisan?{" "}
              <Link
                href={`/${locale}/auth/artisan/register`}
                className="text-oasis-600 font-semibold hover:text-oasis-700"
              >
                {t("artisanRegister")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
