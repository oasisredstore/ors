"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "@/components/map/TimimounMap";

// Leaflet must be loaded client-side only — ssr: false is allowed in Client Components
const TimimounMapDynamic = dynamic(
  () => import("@/components/map/TimimounMap").then((m) => m.TimimounMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-3xl bg-[#1a1a2e] flex items-center justify-center border border-white/10" style={{ height: "600px" }}>
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🗺️</div>
          <p className="text-white/60 text-sm">جاري تحميل الخريطة...</p>
          <p className="text-white/30 text-xs mt-1">Loading map...</p>
        </div>
      </div>
    ),
  }
);

interface MapClientWrapperProps {
  markers: MapMarker[];
  locale: string;
  height?: string;
}

export function MapClientWrapper({ markers, locale, height = "600px" }: MapClientWrapperProps) {
  return <TimimounMapDynamic markers={markers} locale={locale} height={height} />;
}
