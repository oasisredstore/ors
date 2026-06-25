import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { verifyToken, maybeRefreshToken } from "./lib/auth";

const intlMiddleware = createMiddleware(routing);

const ARTISAN_PATHS = ["/dashboard"];
const ADMIN_PATHS = ["/admin"];
const PROTECTED_PATHS = ["/account", "/checkout", "/cart", "/messages", "/wishlist"];

const THIRTY_DAYS = 60 * 60 * 24 * 30; // seconds

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

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

    if (!token) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      // Token invalid or expired → clear cookie and redirect to login
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("token");
      return res;
    }

    if (isAdminPath && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    if (isArtisanPath && payload.role !== "ARTISAN" && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    // ── Rolling session: refresh token if expiring within 7 days ──────────
    const newToken = await maybeRefreshToken(token);
    const response = intlMiddleware(request);
    if (newToken) {
      response.cookies.set("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: THIRTY_DAYS,
        path: "/",
      });
    }
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*|uploads|images|icons).*)",
  ],
};
