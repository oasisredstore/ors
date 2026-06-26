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
  ExternalLink,
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
  const [loading, setLoading] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate brief delay
    await new Promise((r) => setTimeout(r, 600));
    setSubscribed(true);
    setLoading(false);
    setEmail("");
  }

  return (
    <footer
      style={{
        background: "linear-gradient(160deg, #1E1410 0%, #271912 40%, #1E1410 70%, #362420 100%)",
      }}
    >
      {/* Gold gradient divider */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(222,176,72,0.50), rgba(192,74,26,0.30), rgba(222,176,72,0.50), transparent)" }}
      />

      {/* Newsletter Banner */}
      <div
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-start">
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {isAr ? "ابقَ على اطّلاع 🌅" : "Stay in the Loop 🌅"}
              </h3>
              <p className="text-sm text-clay-400 max-w-xs">
                {isAr
                  ? "أخبار الحرفيين، التخفيضات، والمهرجانات مباشرة إلى بريدك"
                  : "Artisan news, deals & festivals delivered to your inbox"}
              </p>
            </div>

            {subscribed ? (
              <div
                className="flex items-center gap-3 px-6 py-4 rounded-2xl"
                style={{
                  background: "rgba(29, 127, 78, 0.12)",
                  border: "1px solid rgba(29, 127, 78, 0.30)",
                }}
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-semibold text-emerald-300">
                  {isAr ? "تم الاشتراك! شكراً لك ✨" : "Subscribed! Thank you ✨"}
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletter}
                className="flex gap-2.5 w-full md:w-auto"
                dir={isAr ? "rtl" : "ltr"}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAr ? "بريدك الإلكتروني..." : "your@email.com"}
                  required
                  className="flex-1 md:w-64 px-4 py-3 rounded-xl text-sm text-white placeholder:text-clay-500 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid rgba(222,176,72,0.50)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(222,176,72,0.10)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid rgba(255,255,255,0.12)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-3 text-white text-sm font-bold rounded-xl transition-all shadow-lg disabled:opacity-70 hover:shadow-xl hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #DEB048 0%, #C04A1A 100%)" }}
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isAr ? "اشتراك" : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-5 group">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(135deg, #DEB048 0%, #C04A1A 60%, #762C0C 100%)" }}
              >
                <span className="text-white font-display font-bold text-sm">
                  {isAr ? "ق" : "G"}
                </span>
              </div>
              <span className="font-display font-bold text-lg text-white group-hover:text-sand-300 transition-colors">
                {isAr ? "قورارة" : "Gourara"}
                <span style={{ color: "#DEB048" }}>{isAr ? " للحرف" : " Crafts"}</span>
              </span>
            </Link>

            <p className="text-sm text-clay-400 leading-relaxed mb-8">
              {isAr
                ? "بوابتك الشاملة لتيميمون وقورارة. تراث، حرف يدوية، إقامة وجولات في مكان واحد."
                : "Your gateway to Timimoun & Gourara. Heritage, handcrafts, stays & tours — all in one place."}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {[
                {
                  href: "https://www.facebook.com/apctimimoun/",
                  icon: <FacebookIcon />,
                  label: "Facebook",
                  hoverStyle: { background: "#1877F2" },
                },
                {
                  href: "https://www.youtube.com/channel/UCjhBNCYSMy7rN1OjhdoZeBQ",
                  icon: <YoutubeIcon />,
                  label: "YouTube",
                  hoverStyle: { background: "#FF0000" },
                },
                {
                  href: "https://wa.me/213660945221",
                  icon: <MessageCircle className="w-4 h-4" />,
                  label: "WhatsApp",
                  hoverStyle: { background: "#25D366" },
                },
                {
                  href: `/${locale === "ar" ? "en" : "ar"}`,
                  icon: <Globe className="w-4 h-4" />,
                  label: "Switch Language",
                  hoverStyle: { background: "#C04A1A" },
                  isLocal: true,
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.isLocal ? undefined : "_blank"}
                  rel={social.isLocal ? undefined : "noopener noreferrer"}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-clay-300 hover:text-white transition-all duration-300 group"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                  onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLElement).style, social.hoverStyle)}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-bold text-white mb-6 text-xs uppercase tracking-widest"
              style={{ borderBottom: "1px solid rgba(222,176,72,0.20)", paddingBottom: "12px" }}
            >
              {isAr ? "استكشف" : "Explore"}
            </h4>
            <ul className="space-y-3">
              {[
                { label: isAr ? "جميع المنتجات"        : "All Products",         href: `/${locale}/products` },
                { label: isAr ? "الخدمات السياحية"      : "Tourism Services",     href: `/${locale}/services` },
                { label: isAr ? "الحرفيون والشركاء"     : "Artisans & Partners",  href: `/${locale}/artisans` },
                { label: isAr ? "المتحف الافتراضي"      : "Virtual Museum",       href: `/${locale}/heritage` },
                { label: isAr ? "عن قورارة"             : "About Gourara",        href: `/${locale}/about` },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-1.5 text-sm text-clay-400 hover:text-sand-300 transition-all duration-200"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 className="font-bold text-white mb-6 text-xs uppercase tracking-widest"
              style={{ borderBottom: "1px solid rgba(222,176,72,0.20)", paddingBottom: "12px" }}
            >
              {isAr ? "للشركاء والحرفيين" : "For Partners"}
            </h4>
            <ul className="space-y-3">
              {[
                { label: isAr ? "انضم كحرفي"         : "Join as Artisan",       href: `/${locale}/auth/artisan/register` },
                { label: isAr ? "سجّل كمزوّد خدمة"    : "Register as Provider",  href: `/${locale}/auth/provider/register` },
                { label: isAr ? "لوحة التحكم"         : "Partner Dashboard",     href: `/${locale}/dashboard` },
                { label: isAr ? "خطط الأسعار"         : "Pricing Plans",         href: `/${locale}/pricing` },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-1.5 text-sm text-clay-400 hover:text-sand-300 transition-all duration-200"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-6 text-xs uppercase tracking-widest"
              style={{ borderBottom: "1px solid rgba(222,176,72,0.20)", paddingBottom: "12px" }}
            >
              {isAr ? "تواصل معنا" : "Contact"}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-clay-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#DEB048" }} />
                <span>Igasten Deldoul, Timimoun, Wilaya 49</span>
              </li>
              <li>
                <a
                  href="mailto:larbilarbi12275@gmail.com"
                  className="flex items-center gap-3 text-sm text-clay-400 hover:text-sand-300 transition-colors group"
                >
                  <Mail className="w-4 h-4 shrink-0 group-hover:text-sand-400 transition-colors" style={{ color: "#DEB048" }} />
                  larbilarbi12275@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+213660945221"
                  className="flex items-center gap-3 text-sm text-clay-400 hover:text-sand-300 transition-colors group"
                  dir="ltr"
                >
                  <Phone className="w-4 h-4 shrink-0" style={{ color: "#DEB048" }} />
                  +213 660 945 221
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/213660945221"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-clay-400 hover:text-green-400 transition-colors group"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 text-green-500" />
                  WhatsApp
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom gold divider */}
        <div
          className="h-px w-full mb-8"
          style={{ background: "linear-gradient(90deg, transparent, rgba(222,176,72,0.25), transparent)" }}
        />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-clay-500">
            © {new Date().getFullYear()}{" "}
            {isAr ? "قورارة للحرف" : "Gourara Crafts"}.{" "}
            {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <div className="flex items-center gap-4 text-xs text-clay-500">
            <a href="#" className="hover:text-sand-300 transition-colors">
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </a>
            <span className="text-clay-700">·</span>
            <a href="#" className="hover:text-sand-300 transition-colors">
              {isAr ? "شروط الخدمة" : "Terms of Service"}
            </a>
            <span className="text-clay-700">·</span>
            <span
              className="font-medium"
              style={{ color: "rgba(222,176,72,0.70)" }}
            >
              {isAr ? "صُنع بـ ❤️ في الجزائر" : "Made with ❤️ in Algeria"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
