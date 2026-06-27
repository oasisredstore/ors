"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone, Star } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Never show if already in standalone mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    // Check if user already dismissed (session-level)
    if (sessionStorage.getItem("pwa-prompt-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Delay to not compete with splash
      setTimeout(() => setShowPrompt(true), 3500);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    const triggerInstall = () => {
      if (deferredPrompt) {
        handleInstallClick();
      } else if (!isStandalone) {
        // iOS fallback
        const ua = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(ua);
        if (isIOS) {
          alert(
            "To install on iOS:\n\n" +
            "1. Tap the Share button (⬆️) at the bottom of Safari\n" +
            "2. Select 'Add to Home Screen'\n\n" +
            "لتثبيت التطبيق على iOS:\n" +
            "١. اضغط على زر 'مشاركة' (⬆️) أسفل Safari\n" +
            "٢. اختر 'إضافة إلى الشاشة الرئيسية'"
          );
        } else {
          alert(
            "To install:\nOpen browser menu (⋮) → 'Install App'\n\n" +
            "لتثبيت التطبيق:\nافتح قائمة المتصفح (⋮) ← 'تثبيت التطبيق'"
          );
        }
      }
    };

    window.addEventListener("trigger-pwa-install", triggerInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("trigger-pwa-install", triggerInstall);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredPrompt]);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
    setInstalling(false);
  };

  const dismissPrompt = () => {
    setDismissed(true);
    sessionStorage.setItem("pwa-prompt-dismissed", "1");
    setTimeout(() => setShowPrompt(false), 400);
  };

  if (!showPrompt) return null;

  return (
    <div
      className={`fixed bottom-20 lg:bottom-4 left-4 right-4 sm:left-auto sm:right-5 z-50 sm:max-w-[22rem] transition-all duration-500 ease-out ${
        dismissed ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
      style={{ animation: dismissed ? "none" : "slideInFromBottom 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-3xl shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #1E1410 0%, #362420 50%, #1E1410 100%)",
          border: "1px solid rgba(222, 176, 72, 0.25)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.50), 0 0 0 1px rgba(222,176,72,0.15)",
        }}
      >
        {/* Gold shimmer streak */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #DEB048, transparent)" }}
        />

        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(204, 144, 32, 0.12)" }}
        />

        <div className="relative z-10 p-5">
          <div className="flex items-start gap-4">
            {/* App icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: "linear-gradient(135deg, #DEB048 0%, #C04A1A 60%, #762C0C 100%)" }}
            >
              <span className="font-arabic font-black text-white text-xl">ق</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-bold text-white text-sm leading-tight">
                  Gourara Crafts
                </h3>
                <button
                  onClick={dismissPrompt}
                  className="p-1 rounded-full text-clay-500 hover:text-white hover:bg-clay-700 transition-colors shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-[10px] text-clay-400 ml-1">قورارة للحرف</span>
              </div>

              <p className="text-xs text-clay-300 leading-relaxed">
                Install for fast, offline access to artisan crafts & Saharan experiences.
              </p>
              <p className="text-[10px] text-clay-400 mt-0.5 font-arabic" dir="rtl">
                ثبّت التطبيق للوصول السريع والعمل بدون إنترنت
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5 mt-4">
            <button
              onClick={dismissPrompt}
              className="flex-1 py-2.5 text-clay-400 hover:text-clay-200 text-xs font-semibold rounded-xl transition-colors border border-clay-700 hover:border-clay-600"
            >
              Later
            </button>
            <button
              onClick={handleInstallClick}
              disabled={installing}
              className="flex-2 flex items-center justify-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-xl transition-all shadow-lg disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, #DEB048 0%, #C04A1A 100%)",
                boxShadow: "0 4px 16px rgba(192,74,26,0.45)",
                flex: 2,
              }}
            >
              {installing ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {installing ? "Installing..." : "Install Free"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
