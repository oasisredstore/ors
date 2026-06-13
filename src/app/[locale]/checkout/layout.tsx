import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSession } from "@/lib/session";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  const user = session
    ? { name: session.firstName ?? session.email.split("@")[0], role: session.role }
    : null;

  return (
    <>
      <Navbar locale={locale} user={user} />
      {children}
      <Footer locale={locale} />
    </>
  );
}
