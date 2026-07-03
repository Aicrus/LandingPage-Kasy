"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { motion, useReducedMotion } from "@/lib/motion";
import { surfaceBorderClass } from "@/lib/surface-border";
import { cn } from "@/lib/utils";

const options = [
  { value: "system", icon: Monitor, label: "Tema do sistema" },
  { value: "light", icon: Sun, label: "Tema claro" },
  { value: "dark", icon: Moon, label: "Tema escuro" },
] as const;

const segmentClass =
  "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const current =
    theme === "light" || theme === "dark" ? theme : "system";
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === current),
  );

  return (
    <div
      role="group"
      aria-label="Tema da interface"
      className={cn(
        "relative inline-flex items-center rounded-full border p-1",
        "bg-background/80 shadow-sm backdrop-blur-md",
        surfaceBorderClass,
      )}
    >
      <motion.span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1 left-1 size-7 rounded-full",
          "bg-secondary shadow-[inset_0_1px_0_rgb(255_255_255/0.45)]",
          "dark:bg-white/12 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]",
          !mounted && "opacity-0",
        )}
        initial={false}
        animate={{ x: `${activeIndex * 100}%` }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 520, damping: 34, mass: 0.75 }
        }
      />

      {options.map(({ value, icon: Icon, label }) => {
        const isActive = mounted && current === value;

        return (
          <button
            key={value}
            type="button"
            aria-label={label}
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
                "size-[15px] shrink-0 stroke-[1.75]",
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
