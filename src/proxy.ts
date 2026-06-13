import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { verifyToken } from "./lib/auth";
import { prisma } from "./lib/prisma";

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

    // C2 FIX: Verify the user is still active on every protected request.
    // A JWT can live for 7 days; without this check, a deactivated user's
    // token remains valid until it naturally expires. We do a lightweight
    // DB lookup on protected routes only to close this gap.
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { isActive: true },
    });
    if (!dbUser || !dbUser.isActive) {
      const response = NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
      // Clear the stale token so the login page doesn't immediately re-auth
      response.cookies.delete("token");
      return response;
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
    "/((?!api|_next/static|_next/image|favicon.ico|uploads|images).*)",
  ],
};

