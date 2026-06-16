import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// B8 FIX: List every origin that is allowed to call server actions.
// Without the production domain here, all server-action form submissions
// (login, checkout, etc.) will be rejected with a CSRF origin error after
// deployment.
const allowedOrigins = [
  "localhost:3000",
  process.env.NEXT_PUBLIC_APP_URL,
].filter((o): o is string => Boolean(o));

const nextConfig: NextConfig = {
  // B9 FIX: Removed `unoptimized: true` so that Next.js Image Optimization
  // is active. This dramatically reduces bandwidth and improves LCP scores.
  // Local /uploads/ files are in public/ and are optimized automatically.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
  // C9 FIX: Add security headers to every response.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            // Baseline CSP — tighten further once all inline styles/scripts
            // have been migrated to external files or hashed.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // needed for Next.js dev
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://api.dicebear.com",
              "connect-src 'self'",
              "frame-ancestors 'self'",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withPWA(withNextIntl(nextConfig));
