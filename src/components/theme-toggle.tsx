"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const options = [
  { value: "system", icon: Monitor, label: "Tema do sistema" },
  { value: "light", icon: Sun, label: "Tema claro" },
  { value: "dark", icon: Moon, label: "Tema escuro" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current =
    theme === "light" || theme === "dark" ? theme : "system";
  const activeIndex = options.findIndex((option) => option.value === current);

  return (
    <div className="relative inline-flex items-center rounded-full bg-neutral-900/90 p-1 backdrop-blur-sm">
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 size-6 rounded-full bg-white/15 transition-transform duration-200 ease-out"
        style={{
          transform: mounted ? `translateX(${activeIndex * 100}%)` : undefined,
        }}
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
              "relative z-10 flex size-6 items-center justify-center rounded-full transition-colors",
              isActive ? "text-white" : "text-white/45 hover:text-white/75",
            )}
          >
            <Icon className="size-3.5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
