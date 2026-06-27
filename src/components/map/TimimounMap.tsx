"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, X, ExternalLink, Star } from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Data Types                                                           */
/* ------------------------------------------------------------------ */
export type MarkerCategory = "landmark" | "artisan" | "accommodation" | "tour";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  category: MarkerCategory;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  imageUrl?: string;
  rating?: number;
  href?: string;
  badge?: string;
  badgeAr?: string;
}

/* ------------------------------------------------------------------ */
/* Static Landmark Data — Timimoun                                      */
/* ------------------------------------------------------------------ */
export const TIMIMOUN_LANDMARKS: MapMarker[] = [
  {
    id: "lm-oasis",
    lat: 29.2628, lng: 0.2371,
    category: "landmark",
    title: "Timimoun Oasis Center", titleAr: "مركز واحة تيميمون",
    description: "The heart of the red oasis, surrounded by ancient palm groves.",
    descriptionAr: "قلب الواحة الحمراء المحاط بغابات النخيل العريقة.",
    badge: "🌴 Oasis", badgeAr: "🌴 واحة",
  },
  {
    id: "lm-ksar",
    lat: 29.2649, lng: 0.2350,
    category: "landmark",
    title: "Ancient Ksar (Old Fortress)", titleAr: "القصر القديم",
    description: "A UNESCO-listed mud-brick fortress dating back centuries.",
    descriptionAr: "قلعة طينية تاريخية مدرجة في التراث العالمي تعود لقرون.",
    badge: "🏛️ Heritage", badgeAr: "🏛️ تراث",
  },
  {
    id: "lm-mosque",
    lat: 29.2612, lng: 0.2365,
    category: "landmark",
    title: "Grand Mosque of Timimoun", titleAr: "الجامع الكبير",
    description: "The iconic mosque with traditional Sudano-Sahelian architecture.",
    descriptionAr: "الجامع الشهير بهندسته السودانية-الساحلية التقليدية.",
    badge: "🕌 Mosque", badgeAr: "🕌 مسجد",
  },
  {
    id: "lm-sebkha",
    lat: 29.2510, lng: 0.2500,
    category: "landmark",
    title: "Sebkha (Salt Lake)", titleAr: "الشط الملحي",
    description: "A breathtaking salt lake that glitters pink at sunset.",
    descriptionAr: "بحيرة ملحية خلابة تتوهج بالوردي عند الغروب.",
    badge: "🌅 Sunset", badgeAr: "🌅 غروب",
  },
  {
    id: "lm-market",
    lat: 29.2658, lng: 0.2380,
    category: "landmark",
    title: "Weekly Market (Souk)", titleAr: "السوق الأسبوعي",
    description: "The vibrant traditional market, alive every Thursday.",
    descriptionAr: "السوق التقليدي النابض بالحياة، يُقام كل خميس.",
    badge: "🛒 Market", badgeAr: "🛒 سوق",
  },
  {
    id: "lm-dunes",
    lat: 29.2400, lng: 0.2600,
    category: "landmark",
    title: "Red Sand Dunes", titleAr: "الكثبان الرملية الحمراء",
    description: "Stunning crimson dunes stretching to the horizon.",
    descriptionAr: "كثبان رملية حمراء رائعة تمتد إلى الأفق.",
    badge: "🏜️ Desert", badgeAr: "🏜️ صحراء",
  },
  {
    id: "lm-foggara",
    lat: 29.2700, lng: 0.2300,
    category: "landmark",
    title: "Foggara (Ancient Irrigation)", titleAr: "الفقارة (الري العتيق)",
    description: "Ancient underground water channels, an engineering marvel.",
    descriptionAr: "قنوات مائية جوفية قديمة، معجزة هندسية أمازيغية.",
    badge: "💧 Foggara", badgeAr: "💧 فقارة",
  },
];

/* ------------------------------------------------------------------ */
/* Category Config                                                      */
/* ------------------------------------------------------------------ */
const CATEGORY_CONFIG: Record<MarkerCategory, { color: string; emoji: string; labelAr: string; label: string; pulse: string }> = {
  landmark:      { color: "#f59e0b", emoji: "🏛️", label: "Landmark",      labelAr: "معلم",     pulse: "bg-amber-400" },
  artisan:       { color: "#f97316", emoji: "🎨", label: "Artisan",       labelAr: "حرفي",     pulse: "bg-orange-400" },
  accommodation: { color: "#8b5cf6", emoji: "🏨", label: "Stay",          labelAr: "إقامة",    pulse: "bg-violet-400" },
  tour:          { color: "#22c55e", emoji: "🐪", label: "Tour",          labelAr: "جولة",     pulse: "bg-green-400" },
};

/* ------------------------------------------------------------------ */
/* Popup Component                                                      */
/* ------------------------------------------------------------------ */
function MarkerPopup({
  marker,
  locale,
  onClose,
}: {
  marker: MapMarker;
  locale: string;
  onClose: () => void;
}) {
  const isAr = locale === "ar";
  const cfg = CATEGORY_CONFIG[marker.category];
  const title = isAr ? marker.titleAr : marker.title;
  const desc = isAr ? marker.descriptionAr : marker.description;
  const badge = isAr ? marker.badgeAr : marker.badge;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-80 max-w-[90vw] animate-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Image or gradient header */}
        <div
          className="h-24 relative flex items-end p-4"
          style={{
            background: marker.imageUrl
              ? `url(${marker.imageUrl}) center/cover`
              : `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}44)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {badge && (
            <span
              className="relative z-10 text-xs font-bold px-2 py-1 rounded-full text-white"
              style={{ background: cfg.color }}
            >
              {badge}
            </span>
          )}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">{title}</h3>
          {desc && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{desc}</p>}

          {marker.rating && (
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < marker.rating! ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
              ))}
              <span className="text-xs text-gray-500 ms-1">({marker.rating}/5)</span>
            </div>
          )}

          {marker.href && (
            <Link
              href={marker.href}
              className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-xl text-white transition-all hover:opacity-90"
              style={{ background: cfg.color }}
            >
              {isAr ? "عرض التفاصيل" : "View Details"}
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Map Component                                                   */
/* ------------------------------------------------------------------ */
interface TimimounMapProps {
  markers?: MapMarker[];
  locale: string;
  height?: string;
}

export function TimimounMap({ markers = [], locale, height = "500px" }: TimimounMapProps) {
  const isAr = locale === "ar";
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markerRefs = useRef<any[]>([]);
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);
  const [activeFilter, setActiveFilter] = useState<MarkerCategory | "all">("all");
  const [isLoaded, setIsLoaded] = useState(false);

  const allMarkers = [...TIMIMOUN_LANDMARKS, ...markers];
  const filteredMarkers = activeFilter === "all"
    ? allMarkers
    : allMarkers.filter(m => m.category === activeFilter);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Dynamically import Leaflet (client-only)
    import("leaflet").then((L) => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      let container = L.DomUtil.get(mapRef.current!);
      if (container != null) {
        (container as any)._leaflet_id = null;
      }

      const map = L.map(mapRef.current!, {
        center: [29.2628, 0.2371],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Dark Matter tiles — free, no API key
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      // Custom zoom control
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.attribution({ position: "bottomleft", prefix: "© OSM / CARTO" }).addTo(map);

      leafletMap.current = map;
      setIsLoaded(true);
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Update markers when filter changes
  useEffect(() => {
    if (!leafletMap.current || !isLoaded) return;

    import("leaflet").then((L) => {
      // Remove old markers
      markerRefs.current.forEach(m => m.remove());
      markerRefs.current = [];

      filteredMarkers.forEach((marker) => {
        const cfg = CATEGORY_CONFIG[marker.category];

        // Custom SVG icon
        const svgIcon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:36px;height:36px">
              <div style="
                position:absolute;inset:0;
                background:${cfg.color};
                border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);
                border:3px solid white;
                box-shadow:0 4px 12px rgba(0,0,0,0.4);
              "></div>
              <div style="
                position:absolute;inset:0;
                display:flex;align-items:center;justify-content:center;
                font-size:14px;
              ">${cfg.emoji}</div>
            </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        const leafletMarker = L.marker([marker.lat, marker.lng], { icon: svgIcon })
          .addTo(leafletMap.current);

        leafletMarker.on("click", () => {
          setActiveMarker((prev) => (prev?.id === marker.id ? null : marker));
          leafletMap.current.panTo([marker.lat, marker.lng], { animate: true, duration: 0.5 });
        });

        markerRefs.current.push(leafletMarker);
      });
    });
  }, [filteredMarkers, isLoaded]);

  const categories: Array<{ key: MarkerCategory | "all"; labelAr: string; label: string; emoji: string }> = [
    { key: "all", label: "All", labelAr: "الكل", emoji: "🗺️" },
    { key: "landmark", label: "Landmarks", labelAr: "المعالم", emoji: "🏛️" },
    { key: "artisan", label: "Artisans", labelAr: "الحرفيون", emoji: "🎨" },
    { key: "accommodation", label: "Stays", labelAr: "الإقامة", emoji: "🏨" },
    { key: "tour", label: "Tours", labelAr: "الجولات", emoji: "🐪" },
  ];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl" style={{ height }}>
      {/* Filter pills — floating on top of map */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-2 flex-wrap justify-center px-4">
        {categories.map((cat) => {
          const count = cat.key === "all" ? allMarkers.length : allMarkers.filter(m => m.category === cat.key).length;
          if (count === 0 && cat.key !== "all") return null;
          return (
            <button
              key={cat.key}
              onClick={() => { setActiveFilter(cat.key); setActiveMarker(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shadow-md backdrop-blur-md border ${
                activeFilter === cat.key
                  ? "bg-white text-gray-900 border-white shadow-lg scale-105"
                  : "bg-black/50 text-white border-white/20 hover:bg-black/70"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{isAr ? cat.labelAr : cat.label}</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#1a1a2e] flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-4xl animate-bounce mb-3">🗺️</div>
            <p className="text-white/60 text-sm">{isAr ? "جاري تحميل الخريطة..." : "Loading map..."}</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Active marker popup */}
      {activeMarker && (
        <MarkerPopup
          marker={activeMarker}
          locale={locale}
          onClose={() => setActiveMarker(null)}
        />
      )}

      {/* Legend — bottom left on desktop */}
      <div className="hidden md:flex absolute bottom-4 right-4 z-[500] flex-col gap-1.5 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10">
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2 text-xs text-white">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
            <span>{isAr ? cfg.labelAr : cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
