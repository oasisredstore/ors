import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { PWAInstallPrompt } from "@/components/layout/PWAInstallPrompt";
import { Chatbot } from "@/components/shared/Chatbot";
import { BottomNav } from "@/components/layout/BottomNav";
import { getSession } from "@/lib/session";
import "@/app/globals.css";

// B1 FIX: The variable was previously named --font-inter even though DM Sans
// is loaded. Corrected to --font-dm-sans to avoid collision if Inter is ever
// added separately, and to match the globals.css token name update.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// C10: Metadata with a dynamic openGraph locale is generated per-page
// using generateMetadata. The static metadata here provides fallbacks.
export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: {
    default: "قورارة للحرف — Gourara Crafts | Authentic Saharan Handmade",
    template: "%s | قورارة للحرف",
  },
  description:
    "Discover handcrafted treasures from Timimoun and the Algerian Sahara. Premium authentic pottery, textiles, palm crafts and traditional artisan works.",
  keywords: [
    "Saharan crafts",
    "Algerian handmade",
    "Timimoun artisan",
    "traditional pottery",
    "Saharan marketplace",
    "حرف صحراوية",
    "تيميمون",
  ],
  openGraph: {
    type: "website",
    siteName: "قورارة للحرف — Gourara Crafts",
    // C10 FIX: locale is now set per-page in generateMetadata where the
    // locale param is available. This static fallback covers the root layout.
    locale: "en_US",
  },
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  const messages = await getMessages();
  const isRTL = locale === "ar";

  // Provide user context to BottomNav for role-aware tabs
  const session = await getSession();
  const navUser = session
    ? { name: session.firstName ?? session.email.split("@")[0], role: session.role }
    : null;

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${dmSans.variable} ${playfair.variable} ${notoArabic.variable}`}
      suppressHydrationWarning
    >
      <body className={`${isRTL ? "font-arabic" : ""} pb-[4.5rem] lg:pb-0`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <PWAInstallPrompt />
          <Chatbot locale={locale} />
          {/* Mobile Super App bottom navigation */}
          <BottomNav locale={locale} user={navUser} />
          <Toaster
            position={isRTL ? "bottom-left" : "bottom-right"}
            toastOptions={{
              style: {
                background: "#1E1410",
                color: "#FBF7EE",
                borderRadius: "14px",
                border: "1px solid rgba(204, 144, 32, 0.25)",
                boxShadow: "0 8px 32px rgba(30, 20, 16, 0.40)",
                fontFamily: isRTL
                  ? "var(--font-noto-arabic), sans-serif"
                  : "var(--font-inter), sans-serif",
                fontSize: "0.875rem",
              },
              success: {
                iconTheme: { primary: "#1D7F4E", secondary: "#FBF7EE" },
              },
              error: {
                iconTheme: { primary: "#C04A1A", secondary: "#FBF7EE" },
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
