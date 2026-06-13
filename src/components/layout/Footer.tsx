"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Share2, Globe, MessageCircle, Mail, MapPin, Phone } from "lucide-react";

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations("nav");

  return (
    <footer className="bg-clay-900 text-desert-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">R</span>
              </div>
              <span className="font-display font-bold text-lg text-white">
                RedOasis<span className="text-sand-400">Artisan</span>
              </span>
            </div>
            <p className="text-sm text-clay-300 leading-relaxed mb-5">
              Preserving Saharan heritage through authentic handmade craftsmanship from Timimoun, Algeria.
            </p>
            <div className="flex items-center gap-3">
              {[Share2, Globe, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-clay-800 hover:bg-sand-500 flex items-center justify-center text-clay-300 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { label: t("products"), href: `/${locale}/products`, key: "products" },
                { label: t("artisans"), href: `/${locale}/artisans`, key: "artisans" },
                { label: locale === "ar" ? "التصنيفات" : "Categories", href: `/${locale}/products?sort=newest`, key: "categories" },
              ].map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-clay-300 hover:text-sand-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Artisans */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Artisans</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Register as Artisan", href: `/${locale}/auth/artisan/register` },
                { label: "Artisan Dashboard", href: `/${locale}/dashboard` },
                { label: "How it Works", href: `/${locale}` },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-clay-300 hover:text-sand-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-clay-300">
                <MapPin className="w-4 h-4 mt-0.5 text-sand-400 shrink-0" />
                Igasten Deldoul, Timimoun, Algeria
              </li>
              <li className="flex items-center gap-2.5 text-sm text-clay-300">
                <Mail className="w-4 h-4 text-sand-400" />
                hello@redoasisartisan.dz
              </li>
              <li className="flex items-center gap-2.5 text-sm text-clay-300">
                <Phone className="w-4 h-4 text-sand-400" />
                +213 664 664 617
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-clay-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-clay-500">
            © {new Date().getFullYear()} RedOasisArtisan. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-clay-500">
            <a href="#" className="hover:text-sand-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sand-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
