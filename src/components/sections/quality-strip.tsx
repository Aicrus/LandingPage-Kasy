"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useInView, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STATS_META = [
  { key: "backends", value: 3, suffix: "" },
  { key: "components", value: 60, suffix: "+" },
  { key: "platforms", value: 3, suffix: "" },
] as const;

type StatMeta = (typeof STATS_META)[number];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - (1 - progress) ** 3;
      setCount(Math.round(ease * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);

  return (
    <span className="font-heading text-[clamp(2rem,1.55rem+1.6vw,2.75rem)] font-bold tracking-[-0.03em] text-foreground tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export function QualityStrip() {
  const t = useTranslations("qualityStrip");
  const labels = t.raw("labels") as Record<StatMeta["key"], string>;
  const details = t.raw("details") as Record<StatMeta["key"], string>;
  const STATS = STATS_META.map((meta) => ({
    ...meta,
    label: labels[meta.key],
    detail: details[meta.key],
  }));
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });
  const active = reducedMotion || isInView;

  return (
    <div
      className={cn(
        "mx-auto w-full",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
      )}
    >
      <div
        ref={ref}
        className="mx-auto grid w-full max-w-[54rem] grid-cols-3 border-y border-border/70"
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.key}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-8 text-center sm:gap-1.5 sm:px-4 sm:py-9",
              "border-border/70",
              i < STATS.length - 1 ? "border-r" : "",
            )}
          >
            {active ? (
              <Counter target={stat.value} suffix={stat.suffix} />
            ) : (
              <span className="font-heading text-[clamp(2rem,1.55rem+1.6vw,2.75rem)] font-bold tracking-[-0.03em] text-foreground tabular-nums">
                0{stat.suffix}
              </span>
            )}
            <span className="text-[0.8125rem] text-muted-foreground sm:text-sm">
              {stat.label}
            </span>
            {stat.detail ? (
              <span className="max-w-[9.5rem] text-pretty text-[0.6875rem] leading-snug text-muted-foreground/75 sm:max-w-none sm:text-xs">
                {stat.detail}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
