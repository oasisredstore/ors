"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Globe,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Send,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

/* Inline SVGs for brand icons not available in this lucide version */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
);

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations("nav");
  const isAr = locale === "ar";

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to real newsletter API
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="bg-clay-900 text-desert-200">
      {/* Newsletter Banner */}
      <div className="border-b border-clay-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-start">
              <h3 className="font-display text-xl font-bold text-white mb-1">
                {isAr ? "ابقَ على اطّلاع 🌅" : "Stay in the Loop 🌅"}
              </h3>
              <p className="text-sm text-clay-400">
                {isAr
                  ? "أخبار الحرفيين، التخفيضات، والمهرجانات مباشرة إلى بريدك"
                  : "Artisan news, deals & festivals delivered to your inbox"}
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 bg-oasis-900/50 border border-oasis-700 text-oasis-300 px-6 py-3 rounded-2xl">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {isAr ? "تم الاشتراك! شكراً لك ✨" : "Subscribed! Thank you ✨"}
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletter}
                className="flex gap-2 w-full md:w-auto"
                dir={isAr ? "rtl" : "ltr"}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAr ? "بريدك الإلكتروني..." : "your@email.com"}
                  required
                  className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-clay-800 border border-clay-700 text-sm text-white placeholder:text-clay-500 focus:border-sand-500 focus:ring-2 focus:ring-sand-500/20 outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-3 bg-sand-500 hover:bg-sand-400 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  {isAr ? "اشتراك" : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-display font-bold text-sm">
                  {isAr ? "ق" : "G"}
                </span>
              </div>
              <span className="font-display font-bold text-lg text-white group-hover:text-sand-400 transition-colors">
                {isAr ? "قورارة" : "Gourara"}
                <span className="text-sand-400">{isAr ? " للحرف" : " Crafts"}</span>
              </span>
            </Link>

            <p className="text-sm text-clay-400 leading-relaxed mb-6">
              {isAr
                ? "بوابتك الشاملة لتيميمون وقورارة. تراث، حرف يدوية، إقامة وجولات في مكان واحد."
                : "Your gateway to Timimoun & Gourara. Heritage, handcrafts, stays & tours — all in one place."}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/apctimimoun/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-clay-800 hover:bg-blue-600 flex items-center justify-center text-clay-300 hover:text-white transition-all"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.youtube.com/channel/UCjhBNCYSMy7rN1OjhdoZeBQ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-clay-800 hover:bg-red-600 flex items-center justify-center text-clay-300 hover:text-white transition-all"
              >
                <YoutubeIcon />
              </a>
              <a
                href="https://wa.me/213660945221"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-clay-800 hover:bg-green-600 flex items-center justify-center text-clay-300 hover:text-white transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`/${locale === "ar" ? "en" : "ar"}`}
                aria-label="Switch Language"
                className="w-9 h-9 rounded-full bg-clay-800 hover:bg-sand-500 flex items-center justify-center text-clay-300 hover:text-white transition-all"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              {isAr ? "استكشف" : "Explore"}
            </h4>
            <ul className="space-y-3">
              {[
                { label: isAr ? "جميع المنتجات" : "All Products", href: `/${locale}/products` },
                { label: isAr ? "الخدمات السياحية" : "Tourism Services", href: `/${locale}/services` },
                { label: isAr ? "الحرفيون والشركاء" : "Artisans & Partners", href: `/${locale}/artisans` },
                { label: isAr ? "المتحف الافتراضي" : "Virtual Museum", href: `/${locale}/heritage` },
                { label: isAr ? "عن قورارة" : "About Gourara", href: `/${locale}/about` },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-1.5 text-sm text-clay-400 hover:text-sand-400 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              {isAr ? "للشركاء والحرفيين" : "For Partners"}
            </h4>
            <ul className="space-y-3">
              {[
                { label: isAr ? "انضم كحرفي" : "Join as Artisan", href: `/${locale}/auth/artisan/register` },
                { label: isAr ? "سجّل كمزوّد خدمة" : "Register as Provider", href: `/${locale}/auth/provider/register` },
                { label: isAr ? "لوحة التحكم" : "Partner Dashboard", href: `/${locale}/dashboard` },
                { label: isAr ? "خطط الأسعار" : "Pricing Plans", href: `/${locale}/pricing` },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-1.5 text-sm text-clay-400 hover:text-sand-400 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              {isAr ? "تواصل معنا" : "Contact"}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-clay-400">
                <MapPin className="w-4 h-4 mt-0.5 text-sand-400 shrink-0" />
                <span>Igasten Deldoul, Timimoun, Wilaya 49</span>
              </li>
              <li>
                <a
                  href="mailto:larbilarbi12275@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-clay-400 hover:text-sand-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-sand-400 shrink-0" />
                  larbilarbi12275@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+213660945221"
                  className="flex items-center gap-2.5 text-sm text-clay-400 hover:text-sand-400 transition-colors"
                  dir="ltr"
                >
                  <Phone className="w-4 h-4 text-sand-400 shrink-0" />
                  +213 660 945 221
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/213660945221"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-clay-400 hover:text-green-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-green-500 shrink-0" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-clay-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-clay-500">
            © {new Date().getFullYear()}{" "}
            {isAr ? "قورارة للحرف" : "Gourara Crafts"}.{" "}
            {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <div className="flex items-center gap-4 text-xs text-clay-500">
            <a href="#" className="hover:text-sand-400 transition-colors">
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </a>
            <span className="text-clay-700">·</span>
            <a href="#" className="hover:text-sand-400 transition-colors">
              {isAr ? "شروط الخدمة" : "Terms of Service"}
            </a>
            <span className="text-clay-700">·</span>
            <span className="text-clay-600">
              {isAr ? "صُنع بـ ❤️ في الجزائر" : "Made with ❤️ in Algeria"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
