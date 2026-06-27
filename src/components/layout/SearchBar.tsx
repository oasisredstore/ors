"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  locale: string;
  scrolled: boolean;
}

export function SearchBar({ locale, scrolled }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd+K / Ctrl+K shortcut
  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === "Escape") {
      setOpen(false);
      setValue("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  useEffect(() => {
    if (open) {
      // Small timeout ensures the element is visible before focusing
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    setValue(current);
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    setOpen(false);
    // Removed setValue("") here to keep the search text visible when navigating
    router.push(`/${locale}/products?search=${encodeURIComponent(q)}`);
  }

  const isAr = locale === "ar";

  return (
    <div className="relative flex items-center">
      {/* Collapsed pill trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Search"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 group",
            scrolled
              ? "text-clay-600 hover:bg-desert-100"
              : "text-white/80 hover:bg-white/10"
          )}
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:block text-xs opacity-60 font-mono border border-current/30 rounded px-1.5 py-0.5 leading-tight">
            ⌘K
          </span>
        </button>
      )}

      {/* Expanded form */}
      {open && (
        <form onSubmit={handleSubmit} className="flex items-center">
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all duration-200 w-48 sm:w-64",
              "bg-white border-sand-400 shadow-lg"
            )}
          >
            <Search className="w-4 h-4 text-clay-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={isAr ? "ابحث..." : "Search..."}
              dir={isAr ? "rtl" : "ltr"}
              className="flex-1 min-w-0 text-sm text-clay-800 placeholder:text-clay-400 bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => { setOpen(false); setValue(""); }}
              className="text-clay-400 hover:text-clay-600 transition-colors shrink-0"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
