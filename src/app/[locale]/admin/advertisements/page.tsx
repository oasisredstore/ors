import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, ToggleLeft, ToggleRight, Megaphone } from "lucide-react";

async function toggleAdAction(adId: string, isActive: boolean) {
  "use server";
  await prisma.advertisement.update({
    where: { id: adId },
    data: { isActive: !isActive },
  });
}

async function createAdAction(formData: FormData) {
  "use server";
  await prisma.advertisement.create({
    data: {
      title: formData.get("title") as string,
      titleAr: (formData.get("titleAr") as string) || null,
      body: (formData.get("body") as string) || null,
      bodyAr: (formData.get("bodyAr") as string) || null,
      linkUrl: formData.get("linkUrl") as string,
      position: formData.get("position") as string,
      isActive: true,
      startsAt: new Date(),
      endsAt: new Date(formData.get("endsAt") as string),
    },
  });
}

export default async function AdvertisementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect(`/${locale}/auth/login`);

  const isAr = locale === "ar";

  const ads = await prisma.advertisement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-clay-900 font-display flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-sand-600" />
            {isAr ? "إدارة الإعلانات" : "Advertisement Manager"}
          </h1>
          <p className="text-sm text-clay-500 mt-1">
            {isAr ? "أنشئ وأدر إعلانات المنصة الداخلية" : "Create and manage internal platform advertisements"}
          </p>
        </div>
        <Link
          href={`#create-ad`}
          className="flex items-center gap-2 bg-clay-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-clay-800 transition-colors"
          id="create-ad-link"
        >
          <PlusCircle className="w-4 h-4" />
          {isAr ? "إضافة إعلان" : "New Ad"}
        </Link>
      </div>

      {/* Create Ad Form */}
      <div id="create-ad" className="bg-white rounded-2xl border border-desert-200 p-6 mb-8 shadow-sm">
        <h2 className="font-semibold text-clay-800 mb-5">
          {isAr ? "إنشاء إعلان جديد" : "Create New Advertisement"}
        </h2>
        <form action={createAdAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-clay-600 mb-1">Title (EN) *</label>
            <input name="title" required className="w-full px-3 py-2 border border-desert-200 rounded-lg text-sm" placeholder="Special offer: Discover Timimoun" />
          </div>
          <div>
            <label className="block text-xs font-medium text-clay-600 mb-1">العنوان (AR)</label>
            <input name="titleAr" className="w-full px-3 py-2 border border-desert-200 rounded-lg text-sm" placeholder="عرض خاص: اكتشف تيميمون" />
          </div>
          <div>
            <label className="block text-xs font-medium text-clay-600 mb-1">Description (EN)</label>
            <textarea name="body" rows={2} className="w-full px-3 py-2 border border-desert-200 rounded-lg text-sm resize-none" placeholder="Ad body text..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-clay-600 mb-1">الوصف (AR)</label>
            <textarea name="bodyAr" rows={2} className="w-full px-3 py-2 border border-desert-200 rounded-lg text-sm resize-none" placeholder="نص الإعلان..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-clay-600 mb-1">Link URL *</label>
            <input name="linkUrl" required className="w-full px-3 py-2 border border-desert-200 rounded-lg text-sm" placeholder="/en/services" />
          </div>
          <div>
            <label className="block text-xs font-medium text-clay-600 mb-1">Position *</label>
            <select name="position" className="w-full px-3 py-2 border border-desert-200 rounded-lg text-sm bg-white">
              <option value="homepage">Homepage Banner</option>
              <option value="services">Services Page</option>
              <option value="sidebar">Sidebar</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-clay-600 mb-1">Expires At *</label>
            <input name="endsAt" type="date" required className="w-full px-3 py-2 border border-desert-200 rounded-lg text-sm" />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sand-500 to-sand-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:from-sand-600 hover:to-sand-700 transition-all"
              id="submit-ad-btn"
            >
              {isAr ? "نشر الإعلان" : "Publish Ad"}
            </button>
          </div>
        </form>
      </div>

      {/* Ads Table */}
      {ads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-desert-100 p-12 text-center">
          <Megaphone className="w-10 h-10 text-clay-200 mx-auto mb-3" />
          <p className="text-clay-500">{isAr ? "لا توجد إعلانات بعد" : "No advertisements yet"}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-desert-50 border-b border-desert-200">
              <tr>
                <th className="px-5 py-4 text-left font-semibold text-clay-600">{isAr ? "العنوان" : "Title"}</th>
                <th className="px-5 py-4 text-left font-semibold text-clay-600">{isAr ? "الموضع" : "Position"}</th>
                <th className="px-5 py-4 text-left font-semibold text-clay-600">{isAr ? "تنتهي في" : "Expires"}</th>
                <th className="px-5 py-4 text-left font-semibold text-clay-600">{isAr ? "الحالة" : "Status"}</th>
                <th className="px-5 py-4 text-right font-semibold text-clay-600">{isAr ? "تحكم" : "Toggle"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-desert-100">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-desert-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-clay-900">{ad.title}</p>
                    {ad.titleAr && <p className="text-xs text-clay-400">{ad.titleAr}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 bg-sand-100 text-sand-700 rounded text-xs font-medium">{ad.position}</span>
                  </td>
                  <td className="px-5 py-4 text-clay-600 text-xs">
                    {new Date(ad.endsAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ad.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {ad.isActive ? (isAr ? "نشط" : "Active") : (isAr ? "متوقف" : "Paused")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <form action={toggleAdAction.bind(null, ad.id, ad.isActive)}>
                      <button
                        type="submit"
                        className={`p-2 rounded-lg transition-colors ${ad.isActive ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`}
                        title={ad.isActive ? "Pause" : "Activate"}
                        id={`toggle-ad-${ad.id}`}
                      >
                        {ad.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
