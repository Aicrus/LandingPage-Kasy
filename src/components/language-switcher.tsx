"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { AnimatePresence, motion } from "@/lib/motion";
import { surfaceBorderClass } from "@/lib/surface-border";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { value: "pt", label: "Português" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((lang) => lang.value === locale) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectLocale(value: (typeof LANGUAGES)[number]["value"]) {
    setOpen(false);
    router.replace(pathname, { locale: value });
  }

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("label")}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border py-1.5 pr-2.5 pl-2.5 text-xs font-medium",
          "bg-background/80 text-muted-foreground shadow-sm backdrop-blur-md transition-colors hover:text-foreground",
          surfaceBorderClass,
        )}
      >
        <Globe className="size-3.5" aria-hidden />
        <span className="whitespace-nowrap">{current.label}</span>
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute bottom-full left-0 z-20 mb-2 min-w-[10.5rem] origin-bottom-left rounded-2xl border p-1.5",
              "sm:left-auto sm:right-0 sm:origin-bottom-right",
              "bg-background/95 shadow-[0_12px_36px_-8px_rgba(3,26,24,0.28)] backdrop-blur-md dark:shadow-[0_12px_36px_-8px_rgba(0,0,0,0.5)]",
              surfaceBorderClass,
            )}
          >
            {LANGUAGES.map((lang) => {
              const isActive = lang.value === locale;

              return (
                <button
                  key={lang.value}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => selectLocale(lang.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {lang.label}
                  {isActive ? <Check className="size-3.5 shrink-0" aria-hidden /> : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
