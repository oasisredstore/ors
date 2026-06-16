import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Megaphone } from "lucide-react";

interface AdBannerProps {
  position?: "homepage" | "services" | "sidebar";
  locale: string;
}

export async function AdBanner({ position = "homepage", locale }: AdBannerProps) {
  const isAr = locale === "ar";
  const now = new Date();

  const ad = await prisma.advertisement.findFirst({
    where: {
      position,
      isActive: true,
      startsAt: { lte: now },
      endsAt: { gte: now },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!ad) return null;

  const title = isAr && ad.titleAr ? ad.titleAr : ad.title;
  const body = isAr && ad.bodyAr ? ad.bodyAr : ad.body;

  return (
    <Link
      href={ad.linkUrl}
      className="block group relative bg-desert-gradient rounded-xl overflow-hidden shadow-toub hover:shadow-toub-hover transition-all duration-300 hover:-translate-y-0.5 border border-[#E9D9B8] mb-8"
      id={`ad-banner-${ad.id}`}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center">
        {ad.imageUrl && (
          <div className="relative w-full md:w-1/3 h-40 md:h-32 shrink-0 bg-sable-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={ad.imageUrl} 
              alt={title} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        )}
        <div className="flex-1 min-w-0 p-5 md:p-6 flex flex-col md:flex-row items-center gap-4 w-full">
          {!ad.imageUrl && (
            <div className="w-12 h-12 rounded-full bg-sand-50 flex items-center justify-center shrink-0 border border-sand-200">
              <Megaphone className="w-6 h-6 text-sand-600" />
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block px-2 py-0.5 bg-oasis-50 text-[10px] font-bold uppercase tracking-widest text-oasis-700 rounded-full mb-1 border border-oasis-100">
              {isAr ? "شريك RedOasis" : "RedOasis Partner"}
            </span>
            <p className="text-clay-800 font-display font-bold text-xl leading-tight">{title}</p>
            {body && <p className="text-clay-600 text-sm mt-1 line-clamp-2">{body}</p>}
          </div>
          <div className="text-sand-600 group-hover:text-sand-700 transition-colors shrink-0 text-sm font-semibold flex items-center gap-1 bg-white px-4 py-2 rounded-lg shadow-sm border border-sand-100">
            {isAr ? "تفاصيل" : "Learn more"}
            <svg className={`w-4 h-4 transform group-hover:translate-x-1 transition-transform ${isAr ? 'rtl-flip' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
