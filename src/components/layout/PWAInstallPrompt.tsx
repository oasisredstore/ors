"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

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

  useEffect(() => {
    // Only show if not already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const handler = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI to notify the user they can add to home screen
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    
    // Check if app is installed after listener is set
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    const triggerInstall = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          setDeferredPrompt(null);
          setShowPrompt(false);
        });
      } else if (!isStandalone) {
        alert("لتثبيت التطبيق:\n\n📱 آيفون (iOS): اضغط على زر 'المشاركة' (Share) بالأسفل ثم اختر 'إضافة إلى الشاشة الرئيسية'.\n\n🤖 أندرويد (Android): إذا لم يظهر التثبيت الآلي، اضغط على خيارات المتصفح (النقاط الثلاث ⁝) بالأعلى واختر 'تثبيت التطبيق' (Install App).");
      }
    };

    window.addEventListener("trigger-pwa-install", triggerInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("trigger-pwa-install", triggerInstall);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 sm:max-w-sm animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-clay-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-clay-700 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-sand-500/20 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-sand-400 to-sand-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">تثبيت التطبيق</h3>
            <p className="text-xs text-clay-300">أضف قورارة إلى شاشتك</p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <button 
            onClick={handleInstallClick}
            className="bg-sand-500 hover:bg-sand-400 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-md"
          >
            تثبيت
          </button>
          <button 
            onClick={dismissPrompt}
            className="p-1.5 text-clay-400 hover:text-white hover:bg-clay-800 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
