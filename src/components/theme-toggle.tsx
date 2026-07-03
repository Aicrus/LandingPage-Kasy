"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { motion, useReducedMotion } from "@/lib/motion";
import { surfaceBorderClass } from "@/lib/surface-border";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "system", icon: Monitor, labelKey: "system" },
  { value: "light", icon: Sun, labelKey: "light" },
  { value: "dark", icon: Moon, labelKey: "dark" },
] as const;

const segmentClass =
  "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const current =
    mounted && (theme === "light" || theme === "dark") ? theme : "system";
  const activeIndex = Math.max(
    0,
    OPTIONS.findIndex((option) => option.value === current),
  );

  return (
    <div
      role="group"
      aria-label={t("groupLabel")}
      className={cn(
        "relative inline-flex items-center rounded-full border p-0.5",
        "bg-background/80 shadow-sm backdrop-blur-md",
        surfaceBorderClass,
      )}
    >
      {mounted ? (
        <motion.span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-0.5 left-0.5 size-6 rounded-full",
            "bg-secondary shadow-[inset_0_1px_0_rgb(255_255_255/0.45)]",
            "dark:bg-white/12 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]",
          )}
          initial={false}
          animate={{ x: `${activeIndex * 100}%` }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 520, damping: 34, mass: 0.75 }
          }
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-0.5 left-0.5 size-6 rounded-full opacity-0",
            "bg-secondary shadow-[inset_0_1px_0_rgb(255_255_255/0.45)]",
            "dark:bg-white/12 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]",
          )}
        />
      )}

      {OPTIONS.map(({ value, icon: Icon, labelKey }) => {
        const isActive = mounted && current === value;

        return (
          <button
            key={value}
            type="button"
            aria-label={t(labelKey)}
            aria-pressed={isActive}
            onClick={() => setTheme(value)}
            className={cn(
              segmentClass,
              "transition-colors duration-200",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/80",
            )}
          >
            <Icon
              className={cn(
                "size-3.5 shrink-0 stroke-[1.75]",
                "transition-[transform,opacity] duration-200",
                isActive ? "scale-100 opacity-100" : "scale-90 opacity-50",
              )}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
