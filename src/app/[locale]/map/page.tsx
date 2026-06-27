import { prisma } from "@/lib/prisma";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSession } from "@/lib/session";
import { MapClientWrapper } from "@/components/map/MapClientWrapper";
import type { MapMarker } from "@/components/map/TimimounMap";
import { MapPin, Compass, Eye, Users, Building2, Map } from "lucide-react";
import Link from "next/link";

interface MapPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}

// Map algerian municipality names to approximate Timimoun-area coordinates
const LOCATION_COORDS: Record<string, [number, number]> = {
  "timimoun":   [29.2628, 0.2371],
  "تيميمون":   [29.2628, 0.2371],
  "aougrout":   [29.1550, 0.2800],
  "أوقروت":    [29.1550, 0.2800],
  "ksar kaddour": [29.2750, 0.2200],
  "charouine":  [29.0100, 0.2900],
  "شروين":     [29.0100, 0.2900],
  "ouled said": [29.2900, 0.2500],
  "متليلي":    [32.2700, 3.6700],
  "غرداية":    [32.4900, 3.6700],
  "adrar":      [27.8742, -0.2939],
  "أدرار":     [27.8742, -0.2939],
  "default":    [29.2628, 0.2371],
};

function getCoords(location: string | null): [number, number] {
  if (!location) return LOCATION_COORDS["default"];
  const lower = location.toLowerCase();
  for (const [key, coords] of Object.entries(LOCATION_COORDS)) {
    if (lower.includes(key)) return coords;
  }
  return LOCATION_COORDS["default"];
}

// Spread markers slightly so they don't overlap at same location
function jitterCoords(lat: number, lng: number, index: number): [number, number] {
  const angle = (index * 137.5 * Math.PI) / 180; // golden angle
  const radius = 0.003 + (index % 5) * 0.001;
  return [lat + Math.cos(angle) * radius, lng + Math.sin(angle) * radius];
}

async function getMapData() {
  const [artisans, accommodations, tours] = await Promise.all([
    prisma.artisan.findMany({
      where: { isApproved: true, isActive: true },
      select: { id: true, shopName: true, slug: true, location: true, specialization: true, avatarUrl: true },
      take: 20,
    }),
    prisma.service.findMany({
      where: { isPublished: true, type: { in: ["ROOM", "TENT"] } },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 15,
    }),
    prisma.service.findMany({
      where: { isPublished: true, type: "TOUR" },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 10,
    }),
  ]);

  const artisanMarkers: MapMarker[] = artisans.map((a, i) => {
    const base = getCoords(a.location);
    const [lat, lng] = jitterCoords(base[0], base[1], i);
    return {
      id: `artisan-${a.id}`,
      lat, lng,
      category: "artisan",
      title: a.shopName,
      titleAr: a.shopName,
      description: a.specialization ?? "Local artisan from Timimoun",
      descriptionAr: a.specialization ?? "حرفي محلي من تيميمون",
      imageUrl: a.avatarUrl ?? undefined,
      href: `/ar/artisans/${a.slug}`,
      badge: `🎨 ${a.specialization ?? "Artisan"}`,
      badgeAr: `🎨 ${a.specialization ?? "حرفي"}`,
    };
  });

  const stayMarkers: MapMarker[] = accommodations.map((s, i) => {
    const base = getCoords((s as any).location ?? null);
    const [lat, lng] = jitterCoords(base[0] + 0.005, base[1] - 0.005, i + 50);
    return {
      id: `stay-${s.id}`,
      lat, lng,
      category: "accommodation",
      title: s.name,
      titleAr: (s as any).nameAr ?? s.name,
      description: `${s.price} DZD / Night`,
      descriptionAr: `${s.price} دج / ليلة`,
      imageUrl: (s as any).images?.[0]?.url ?? undefined,
      href: `/ar/services/${s.slug}`,
      badge: "🏨 Stay",
      badgeAr: "🏨 إقامة",
    };
  });

  const tourMarkers: MapMarker[] = tours.map((t, i) => {
    const base = getCoords((t as any).location ?? null);
    const [lat, lng] = jitterCoords(base[0] - 0.008, base[1] + 0.008, i + 100);
    return {
      id: `tour-${t.id}`,
      lat, lng,
      category: "tour",
      title: t.name,
      titleAr: (t as any).nameAr ?? t.name,
      description: `${t.price} DZD`,
      descriptionAr: `${t.price} دج`,
      imageUrl: (t as any).images?.[0]?.url ?? undefined,
      href: `/ar/services/${t.slug}`,
      badge: "🐪 Tour",
      badgeAr: "🐪 جولة",
    };
  });

  return [...artisanMarkers, ...stayMarkers, ...tourMarkers];
}

export default async function MapPage({ params }: MapPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const session = await getSession();
  const user = session ? { name: session.firstName ?? session.email.split("@")[0], role: session.role } : null;

  const dynamicMarkers = await getMapData();

  const stats = [
    { icon: MapPin, value: "7", label: isAr ? "معالم سياحية" : "Landmarks", color: "text-amber-400" },
    { icon: Users, value: String(dynamicMarkers.filter(m => m.category === "artisan").length || "20+"), label: isAr ? "حرفي" : "Artisans", color: "text-orange-400" },
    { icon: Building2, value: String(dynamicMarkers.filter(m => m.category === "accommodation").length || "10+"), label: isAr ? "إقامة" : "Stays", color: "text-violet-400" },
    { icon: Compass, value: String(dynamicMarkers.filter(m => m.category === "tour").length || "5+"), label: isAr ? "جولة" : "Tours", color: "text-green-400" },
  ];

  return (
    <>
      <Navbar locale={locale} user={user} transparentOnTop={false} />

      <main className="min-h-screen bg-clay-900 pt-20">
        {/* Hero */}
        <section className="relative py-16 px-4 overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-semibold mb-6">
                <Map className="w-4 h-4 text-amber-400" />
                {isAr ? "دليل تيميمون التفاعلي" : "Interactive Timimoun Guide"}
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {isAr ? "اكتشف تيميمون\nعلى الخريطة" : "Explore Timimoun\non the Map"}
              </h1>
              <p className="text-clay-300 max-w-2xl mx-auto text-lg">
                {isAr
                  ? "خريطة تفاعلية تجمع معالم الواحة الحمراء، الحرفيين المحليين، أماكن الإقامة والجولات الصحراوية في مكان واحد"
                  : "An interactive map bringing together the Red Oasis landmarks, local artisans, stays and desert tours in one place"}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-white font-display">{stat.value}</div>
                  <div className="text-xs text-clay-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* The Map */}
            <MapClientWrapper markers={dynamicMarkers} locale={locale} height="600px" />

            {/* Instructions */}
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-clay-400">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-clay-500" />
                {isAr ? "اضغط على أي مؤشر لعرض تفاصيله" : "Click any pin to see details"}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-clay-500" />
                {isAr ? "استخدم الفلاتر أعلاه للتصفية" : "Use filters above to narrow down"}
              </span>
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-clay-500" />
                {isAr ? "يمكن تكبير الخريطة والتنقل فيها" : "Zoom and pan to explore"}
              </span>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-white text-center mb-8">
              {isAr ? "اكتشف أكثر" : "Discover More"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: `/${locale}/artisans`, emoji: "🎨", title: isAr ? "الحرفيون" : "Artisans", desc: isAr ? "تعرف على حرفيي تيميمون" : "Meet Timimoun's artisans" },
                { href: `/${locale}/services?type=accommodation`, emoji: "🏨", title: isAr ? "الإقامة" : "Stays", desc: isAr ? "احجز إقامتك في الواحة" : "Book your oasis stay" },
                { href: `/${locale}/services?type=tour`, emoji: "🐪", title: isAr ? "الجولات" : "Tours", desc: isAr ? "اكتشف الصحراء مع مرشد" : "Explore the desert with a guide" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{link.emoji}</span>
                  <div>
                    <p className="font-semibold text-white">{link.title}</p>
                    <p className="text-sm text-clay-400">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
