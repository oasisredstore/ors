"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { artisanRegisterAction } from "@/actions/auth.actions";

export default function ArtisanRegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const { locale = "en" } = useParams<{ locale: string }>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await artisanRegisterAction(new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(`/${locale}/dashboard`);
    // B12 FIX: router.refresh() after router.push() is a no-op. Removed.
  }

  return (
    <div className="min-h-screen bg-desert-gradient flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-oasis-500 to-oasis-700 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-2xl">🏺</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-clay-800">
              {t("artisanRegister")}
            </h1>
            <p className="text-sm text-clay-400 mt-1">
              Your account will be reviewed before activation
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-oasis-50 rounded-2xl border border-oasis-100 mb-2">
              <p className="text-xs font-semibold text-oasis-700 mb-3 uppercase tracking-wide">Shop Information</p>
              <div className="space-y-4">
                <Input
                  id="shopName"
                  name="shopName"
                  label={t("shopName")}
                  placeholder="My Saharan Pottery Shop"
                  required
                />
                <Input
                  id="specialization"
                  name="specialization"
                  label={t("specialization")}
                  placeholder="Pottery, Textiles, Palm Crafts..."
                />
                <Input
                  id="location"
                  name="location"
                  label={t("location")}
                  placeholder="Timimoun, Algeria"
                />
                <div>
                  <label className="text-sm font-medium text-clay-700 block mb-1.5">
                    {t("bio")}
                  </label>
                  <textarea
                    name="bio"
                    rows={3}
                    placeholder="Tell your story and describe your craft..."
                    className="w-full rounded-xl border border-desert-300 px-4 py-2.5 text-clay-800 placeholder:text-clay-400 outline-none focus:border-oasis-500 focus:ring-2 focus:ring-oasis-100 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-desert-50 rounded-2xl border border-desert-100">
              <p className="text-xs font-semibold text-clay-600 mb-3 uppercase tracking-wide">Personal Information</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input id="firstName" name="firstName" label={t("firstName")} required />
                  <Input id="lastName" name="lastName" label={t("lastName")} required />
                </div>
                <Input id="email" name="email" type="email" label={t("email")} required />
                <Input id="phone" name="phone" type="tel" label={t("phone")} />
                <Input id="password" name="password" type="password" label={t("password")} required />
              </div>
            </div>

            <Button type="submit" size="lg" isLoading={loading} className="w-full mt-2">
              Submit Application
            </Button>
          </form>

          <p className="text-center text-sm text-clay-500 mt-4">
            {t("hasAccount")}{" "}
            <Link href={`/${locale}/auth/login`} className="text-sand-600 font-semibold">
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
