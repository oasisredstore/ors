import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProfilePageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function DashboardProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/login`);

  const artisan = await prisma.artisan.findUnique({
    where: { userId: session.userId },
    select: {
      shopName: true,
      bio: true,
      bioAr: true,
      location: true,
      specialization: true,
      whatsapp: true,
      email: true,
      avatarUrl: true,
      coverUrl: true,
      isApproved: true,
    },
  });

  if (!artisan) redirect(`/${locale}`);

  const isAr = locale === "ar";

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className={`flex items-center gap-3 mb-8 ${isAr ? "flex-row-reverse" : ""}`}>
        <Link
          href={`/${locale}/dashboard`}
          className="text-clay-400 hover:text-clay-700 transition-colors"
        >
          <ArrowLeft className={`w-5 h-5 ${isAr ? "rotate-180" : ""}`} />
        </Link>
        <div>
          <h1 className={`font-display text-3xl font-bold text-clay-800 ${isAr ? "text-right" : ""}`}>
            {isAr ? "ملفي الشخصي" : "My Profile"}
          </h1>
          <p className={`text-clay-400 text-sm mt-0.5 ${isAr ? "text-right" : ""}`}>
            {isAr ? "تحديث معلومات متجرك الحرفي" : "Update your artisan shop information"}
          </p>
        </div>
      </div>

      {!artisan.isApproved && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className={`text-sm text-amber-800 font-medium ${isAr ? "text-right" : ""}`}>
            {isAr
              ? "⏳ حسابك في انتظار موافقة المشرف. يمكنك تحديث ملفك الشخصي الآن."
              : "⏳ Your account is pending admin approval. You can still update your profile."}
          </p>
        </div>
      )}

      <ProfileForm locale={locale} artisan={artisan} />
    </div>
  );
}
