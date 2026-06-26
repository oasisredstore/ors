"use client";

import { useEffect, useState } from "react";

export function SplashIntro() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    // Phase 1: Enter — animate in (0 → 800ms)
    const holdTimer = setTimeout(() => setPhase("hold"), 800);
    // Phase 2: Hold (800ms → 2000ms)
    const exitTimer = setTimeout(() => setPhase("exit"), 2000);
    // Phase 3: Exit — fade out, then remove from DOM
    const removeTimer = setTimeout(() => setShow(false), 3000);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center pointer-events-none transition-opacity duration-700 ease-in-out ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "linear-gradient(160deg, #1E1410 0%, #362420 40%, #4F3C32 70%, #1E1410 100%)" }}
      aria-hidden="true"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl animate-float"
          style={{ background: "rgba(192, 74, 26, 0.15)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-delayed"
          style={{ background: "rgba(204, 144, 32, 0.10)" }}
        />
        {/* Zenete geometric pattern overlay */}
        <div className="absolute inset-0 pattern-zenete opacity-5" />
      </div>

      {/* Central content */}
      <div
        className={`relative flex flex-col items-center gap-6 px-8 max-w-2xl mx-auto transition-all duration-700 ease-out ${
          phase === "enter"
            ? "opacity-0 scale-95 translate-y-4"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        {/* Logo mark with animated rings */}
        <div className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32">
          {/* Pulse rings */}
          <span
            className="absolute inset-0 rounded-full border-2 border-amber-400/40"
            style={{ animation: "splashRing 2.5s ease-out infinite" }}
          />
          <span
            className="absolute inset-0 rounded-full border border-amber-300/20"
            style={{ animation: "splashRing 2.5s ease-out infinite", animationDelay: "0.8s" }}
          />
          {/* Logo circle */}
          <div
            className="relative z-10 w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-2xl animate-breathe"
            style={{
              background: "linear-gradient(135deg, #DEB048 0%, #C04A1A 50%, #762C0C 100%)",
              boxShadow: "0 0 60px rgba(204, 144, 32, 0.30), 0 0 120px rgba(192, 74, 26, 0.15)",
            }}
          >
            <span
              className="font-arabic font-black text-white"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
            >
              ق
            </span>
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1
            className="font-arabic font-bold leading-snug"
            style={{
              fontSize: "clamp(1.25rem, 4vw, 2rem)",
              background: "linear-gradient(135deg, #FDE047 0%, #DEB048 50%, #CC9020 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 4px 12px rgba(204, 144, 32, 0.25))",
            }}
            dir="rtl"
          >
            قورارة للحرف
          </h1>
          <p
            className="font-arabic text-base md:text-lg mt-2"
            style={{ color: "rgba(233, 217, 184, 0.70)" }}
            dir="rtl"
          >
            التسويق الرقمي للوجهات السياحية الصحراوية بإقليم قورارة
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: i === 1 ? "#DEB048" : "rgba(222, 176, 72, 0.40)",
                animation: `breathe 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
