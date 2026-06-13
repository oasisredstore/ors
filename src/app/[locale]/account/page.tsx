import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getInitials, formatDate } from "@/lib/utils";
import { User, ShoppingBag, MapPin, Phone, Mail } from "lucide-react";

interface AccountPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/login`);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      addresses: { where: { isDefault: true }, take: 1 },
      _count: { select: { orders: true } },
    },
  });

  if (!user) redirect(`/${locale}/auth/login`);

  return (
    <div className="min-h-screen bg-desert-50 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-clay-800 mb-8">
          {locale === "ar" ? "حسابي" : "My Account"}
        </h1>

        <div className="grid grid-cols-1 gap-5">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-desert-200 p-6">
            <div className="flex items-center gap-5 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sand-400 to-clay-700 flex items-center justify-center text-white text-xl font-bold">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-clay-800">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-clay-400 capitalize">{user.role.toLowerCase()}</p>
                <p className="text-xs text-clay-400 mt-0.5">
                  {locale === "ar" ? "عضو منذ" : "Member since"} {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-desert-100">
              <div className="flex items-center gap-3 text-sm text-clay-600">
                <Mail className="w-4 h-4 text-sand-500" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-3 text-sm text-clay-600">
                  <Phone className="w-4 h-4 text-sand-500" />
                  {user.phone}
                </div>
              )}
              {user.addresses[0] && (
                <div className="flex items-center gap-3 text-sm text-clay-600">
                  <MapPin className="w-4 h-4 text-sand-500" />
                  {user.addresses[0].city}, {user.addresses[0].wilaya}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href={`/${locale}/account/orders`}
              className="bg-white rounded-2xl border border-desert-200 p-5 hover:border-sand-400 hover:shadow-md transition-all group"
            >
              <ShoppingBag className="w-8 h-8 text-sand-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-2xl font-bold text-clay-800">{user._count.orders}</p>
              <p className="text-sm text-clay-400 mt-1">{locale === "ar" ? "إجمالي الطلبات" : "Total Orders"}</p>
            </Link>

            <div className="bg-white rounded-2xl border border-desert-200 p-5">
              <User className="w-8 h-8 text-oasis-500 mb-3" />
              <p className="text-2xl font-bold text-clay-800 capitalize">{user.role.toLowerCase()}</p>
              <p className="text-sm text-clay-400 mt-1">{locale === "ar" ? "نوع الحساب" : "Account Type"}</p>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white rounded-2xl border border-desert-200 overflow-hidden">
            {[
              { href: `/${locale}/account/orders`, label: locale === "ar" ? "طلباتي" : "My Orders", icon: ShoppingBag },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-5 py-4 hover:bg-desert-50 transition-colors border-b border-desert-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-sand-500" />
                  <span className="text-sm font-medium text-clay-700">{item.label}</span>
                </div>
                <span className="text-clay-300">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
