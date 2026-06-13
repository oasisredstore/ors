"use client";

import { useEffect, useState } from "react";

export function SplashIntro() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Show the splash screen for 1.5 seconds, then start fading it out
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 1500);

    // Completely remove from DOM after 2.5 seconds to avoid blocking clicks
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-clay-900 transition-opacity duration-1000 ease-in-out pointer-events-none ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center px-6 max-w-5xl mx-auto">
        <h1 
          className="font-arabic font-bold text-4xl md:text-5xl lg:text-7xl leading-normal md:leading-relaxed"
          style={{
            background: "linear-gradient(135deg, #FDE047 0%, #EAB308 50%, #B45309 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0px 10px 20px rgba(234, 179, 8, 0.15))"
          }}
          dir="rtl"
        >
          التسويق الرقمي للمنتجات السياحية التقليدية بقورارة
        </h1>
      </div>
    </div>
  );
}
