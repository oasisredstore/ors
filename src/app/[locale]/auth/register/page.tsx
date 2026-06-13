"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerAction } from "@/actions/auth.actions";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const { locale = "en" } = useParams<{ locale: string }>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    // B12 FIX: router.refresh() after router.push() is a no-op. Removed.
  }

  return (
    <div className="min-h-screen bg-desert-gradient flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sand-500 to-clay-700 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white font-display font-bold text-xl">R</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-clay-800">
              {t("register")}
            </h1>
            <p className="text-sm text-clay-400 mt-1">Create your customer account</p>
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
                placeholder="Ahmed"
                required
              />
              <Input
                id="lastName"
                name="lastName"
                label={t("lastName")}
                placeholder="Benali"
                required
              />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              label={t("email")}
              placeholder="you@example.com"
              required
            />
            <Input
              id="phone"
              name="phone"
              type="tel"
              label={t("phone")}
              placeholder="+213 6XX XXX XXX"
            />
            <Input
              id="password"
              name="password"
              type="password"
              label={t("password")}
              placeholder="••••••••"
              required
            />
            <Button type="submit" size="lg" isLoading={loading} className="w-full mt-2">
              {t("register")}
            </Button>
          </form>

          <p className="text-center text-sm text-clay-500 mt-6">
            {t("hasAccount")}{" "}
            <Link
              href={`/${locale}/auth/login`}
              className="text-sand-600 font-semibold hover:text-sand-700"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
