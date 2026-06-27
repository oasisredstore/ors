"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";

interface ProductsFiltersProps {
  locale: string;
  initialSearch?: string;
  initialMinPrice?: number;
  initialMaxPrice?: number;
  /** Absolute maximum price from DB (to set range ceiling) */
  maxPriceInDB: number;
}

function formatPrice(value: number, locale: string): string {
  return locale === "ar"
    ? `${value.toLocaleString("ar-DZ")} دج`
    : `${value.toLocaleString("en-DZ")} DZD`;
}

export function ProductsFilters({
  locale,
  initialSearch = "",
  initialMinPrice,
  initialMaxPrice,
  maxPriceInDB,
}: ProductsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAr = locale === "ar";

  // ── Search state ─────────────────────────────────────────────────────────
  const [query, setQuery] = useState(initialSearch);
  
  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";
    setQuery(currentSearch);
  }, [searchParams]);

  // ── Price range state ─────────────────────────────────────────────────────
  const ceiling = maxPriceInDB > 0 ? maxPriceInDB : 100_000;
  const [minVal, setMinVal] = useState(initialMinPrice ?? 0);
  const [maxVal, setMaxVal] = useState(initialMaxPrice ?? ceiling);
  const [priceOpen, setPriceOpen] = useState(
    initialMinPrice !== undefined || initialMaxPrice !== undefined
  );
  const rangeRef = useRef<HTMLDivElement>(null);
  const priceApplyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Push URL helper ───────────────────────────────────────────────────────
  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(overrides).forEach(([key, val]) => {
        if (val === undefined || val === "") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      // page reset
      params.delete("page");
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  // ── Search trigger on Enter is handled in the input onKeyDown ───────────

  // ── Price range push (debounced 600ms after drag ends) ────────────────────
  const applyPrice = useCallback(
    (min: number, max: number) => {
      if (priceApplyRef.current) clearTimeout(priceApplyRef.current);
      priceApplyRef.current = setTimeout(() => {
        router.push(
          buildUrl({
            minPrice: min > 0 ? String(min) : undefined,
            maxPrice: max < ceiling ? String(max) : undefined,
          }),
          { scroll: false }
        );
      }, 600);
    },
    [buildUrl, ceiling, router]
  );

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Number(e.target.value), maxVal - 500);
    setMinVal(v);
    applyPrice(v, maxVal);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(Number(e.target.value), minVal + 500);
    setMaxVal(v);
    applyPrice(minVal, v);
  };

  const clearPrice = () => {
    setMinVal(0);
    setMaxVal(ceiling);
    router.push(buildUrl({ minPrice: undefined, maxPrice: undefined }), {
      scroll: false,
    });
  };

  // Track fill percentage for the slider track
  const minPct = (minVal / ceiling) * 100;
  const maxPct = (maxVal / ceiling) * 100;

  const hasPriceFilter =
    (initialMinPrice !== undefined && initialMinPrice > 0) ||
    (initialMaxPrice !== undefined && initialMaxPrice < ceiling);

  return (
    <div className="space-y-4">
      {/* ── Search input ───────────────────────────────────────────────── */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-400 pointer-events-none"
          style={isAr ? { left: "auto", right: "1rem" } : {}}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const trimmed = query.trim();
              const current = searchParams.get("search") ?? "";
              if (trimmed !== current) {
                router.push(buildUrl({ search: trimmed || undefined }), { scroll: false });
              }
            }
          }}
          placeholder={isAr ? "ابحث عن منتجات..." : "Search products..."}
          dir={isAr ? "rtl" : "ltr"}
          className="w-full bg-white border border-desert-200 rounded-xl py-3 text-clay-800 placeholder:text-clay-400 focus:outline-none focus:border-sand-400 focus:ring-2 focus:ring-sand-100 transition-all text-sm"
          style={isAr ? { paddingRight: "2.75rem", paddingLeft: "2.5rem" } : { paddingLeft: "2.75rem", paddingRight: "2.5rem" }}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              if (searchParams.get("search")) {
                router.push(buildUrl({ search: undefined }), { scroll: false });
              }
            }}
            className="absolute top-1/2 -translate-y-1/2 p-1 text-clay-400 hover:text-clay-600 transition-colors"
            style={isAr ? { left: "0.5rem" } : { right: "0.5rem" }}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {query.trim() && (
        <p className="text-xs text-clay-500 -mt-2">
          {isAr
            ? `نتائج البحث عن: "${query.trim()}"`
            : `Results for: "${query.trim()}"`}
        </p>
      )}

      {/* ── Price range accordion ──────────────────────────────────────── */}
      <div className="bg-white border border-desert-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setPriceOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-clay-800 hover:bg-desert-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-sand-500" />
            {isAr ? "نطاق السعر" : "Price Range"}
            {hasPriceFilter && (
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-sand-500" />
            )}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-clay-400 transition-transform duration-200 ${priceOpen ? "rotate-180" : ""}`}
          />
        </button>

        {priceOpen && (
          <div className="px-4 pb-4 pt-1 space-y-4">
            {/* Price labels */}
            <div className="flex items-center justify-between text-xs font-bold text-clay-600">
              <span
                className="px-2 py-1 bg-desert-50 rounded-lg border border-desert-200"
              >
                {formatPrice(minVal, locale)}
              </span>
              <span className="text-clay-300">—</span>
              <span
                className="px-2 py-1 bg-desert-50 rounded-lg border border-desert-200"
              >
                {formatPrice(maxVal, locale)}
              </span>
            </div>

            {/* Dual-range slider */}
            <div ref={rangeRef} className="relative h-6 flex items-center">
              {/* Track background */}
              <div className="absolute w-full h-1.5 rounded-full bg-desert-200" />
              {/* Active track fill */}
              <div
                className="absolute h-1.5 rounded-full bg-gradient-to-r from-sand-400 to-sand-600"
                style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
              />
              {/* Min thumb */}
              <input
                type="range"
                min={0}
                max={ceiling}
                step={500}
                value={minVal}
                onChange={handleMinChange}
                className="absolute w-full h-full opacity-0 cursor-pointer"
                style={{ zIndex: minVal > ceiling * 0.8 ? 5 : 3 }}
                aria-label={isAr ? "الحد الأدنى للسعر" : "Minimum price"}
              />
              {/* Max thumb */}
              <input
                type="range"
                min={0}
                max={ceiling}
                step={500}
                value={maxVal}
                onChange={handleMaxChange}
                className="absolute w-full h-full opacity-0 cursor-pointer"
                style={{ zIndex: 4 }}
                aria-label={isAr ? "الحد الأقصى للسعر" : "Maximum price"}
              />
              {/* Visual thumb: min */}
              <div
                className="absolute w-5 h-5 bg-white border-2 border-sand-500 rounded-full shadow-md pointer-events-none transition-transform hover:scale-110"
                style={{ left: `calc(${minPct}% - 10px)` }}
              />
              {/* Visual thumb: max */}
              <div
                className="absolute w-5 h-5 bg-white border-2 border-sand-500 rounded-full shadow-md pointer-events-none transition-transform hover:scale-110"
                style={{ left: `calc(${maxPct}% - 10px)` }}
              />
            </div>

            {/* Quick presets */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { min: 0, max: 5000, label: isAr ? "أقل من 5K" : "< 5K" },
                { min: 5000, max: 20000, label: isAr ? "5K – 20K" : "5K – 20K" },
                { min: 20000, max: 50000, label: isAr ? "20K – 50K" : "20K – 50K" },
                { min: 50000, max: ceiling, label: isAr ? "أكثر من 50K" : "> 50K" },
              ].map((preset) => {
                const active =
                  minVal === preset.min &&
                  maxVal === Math.min(preset.max, ceiling);
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      const newMax = Math.min(preset.max, ceiling);
                      setMinVal(preset.min);
                      setMaxVal(newMax);
                      applyPrice(preset.min, newMax);
                    }}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                      active
                        ? "bg-sand-500 text-white border-sand-500 shadow-sm"
                        : "bg-desert-50 text-clay-600 border-desert-200 hover:border-sand-300 hover:text-sand-600"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {hasPriceFilter && (
              <button
                type="button"
                onClick={clearPrice}
                className="w-full text-xs text-clay-400 hover:text-clay-700 transition-colors py-1 border-t border-desert-100 pt-2"
              >
                {isAr ? "× إعادة تعيين السعر" : "× Reset price"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
