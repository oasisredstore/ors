import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { verifyToken } from "./lib/auth";

const intlMiddleware = createMiddleware(routing);

const ARTISAN_PATHS = ["/dashboard"];
const ADMIN_PATHS = ["/admin"];
const PROTECTED_PATHS = ["/account", "/checkout", "/cart"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";

  const isArtisanPath = ARTISAN_PATHS.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );
  const isAdminPath = ADMIN_PATHS.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );
  const isProtectedPath = PROTECTED_PATHS.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (isArtisanPath || isAdminPath || isProtectedPath) {
    const token = request.cookies.get("token")?.value;
    const locale = pathname.startsWith("/ar") ? "ar" : "en";

    if (!token) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }



    if (isAdminPath && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    if (isArtisanPath && payload.role !== "ARTISAN" && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*|uploads|images|icons).*)",
  ],
};

