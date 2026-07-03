"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { heroPillSurfaceClass, surfaceBorderClass } from "@/lib/surface-border";

import { motion, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const IDE_LOGOS = [
  {
    src: "/assets/ide-logos/antigravity.png",
    alt: "Antigravity",
    rotate: -8,
    bg: "#ffffff",
    fit: "contain" as const,
  },
  { src: "/assets/ide-logos/claude.webp", alt: "Claude", rotate: 5, boost: true },
  {
    src: "/assets/ide-logos/cursor-light.svg",
    alt: "Cursor",
    rotate: -4,
    bg: "#ffffff",
    fit: "contain" as const,
  },
  {
    src: "/assets/ide-logos/openai-icon.svg",
    alt: "OpenAI",
    rotate: 9,
    boost: true,
  },
  {
    src: "/assets/ide-logos/opencode.svg",
    alt: "OpenCode",
    rotate: -6,
    boost: true,
  },
  { src: "/assets/ide-logos/kimi.svg", alt: "Kimi", rotate: 3, boost: true },
] as const;

const iconHoverSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 22,
  mass: 0.55,
};

function IdeLogo({
  src,
  alt,
  fit = "cover",
  boost = false,
}: {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  boost?: boolean;
}) {
  const isSvg = src.endsWith(".svg");
  const objectClass = fit === "contain" ? "object-contain p-0.5" : "object-cover";
  const sizeClass = boost ? "size-full scale-[1.14]" : "size-full";

  if (isSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- SVGs locais, sem pipeline do Image
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} ${objectClass}`}
        draggable={false}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={72}
      height={72}
      className={`${sizeClass} ${objectClass}`}
      draggable={false}
    />
  );
}

export function HeroAiSubsPill() {
  const reducedMotion = useReducedMotion();
  const t = useTranslations("heroAiSubsPill");

  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-3 rounded-full border-[1.5px] border-solid px-3.5 py-1 shadow-[0_1px_36px_-10px_rgba(26,30,44,0.02)] sm:gap-3.5 sm:px-4 sm:py-1.5 dark:shadow-[0_1px_36px_-10px_rgba(0,0,0,0.075)]",
        heroPillSurfaceClass,
        surfaceBorderClass,
      )}
    >
      <div className="flex shrink-0 items-center pl-0.5" aria-hidden>
        {IDE_LOGOS.map((logo, index) => (
          <motion.span
            key={logo.src}
            className={cn(
              "relative flex size-8 shrink-0 cursor-default overflow-hidden rounded-[0.45rem] border border-solid will-change-transform sm:size-[2.125rem] sm:rounded-[0.48rem]",
              surfaceBorderClass,
            )}
            style={{
              zIndex: index + 1,
              marginLeft: index === 0 ? 0 : "-0.44rem",
              rotate: `${logo.rotate}deg`,
              backgroundColor: "bg" in logo ? logo.bg : undefined,
            }}
            whileHover={
              reducedMotion
                ? undefined
                : { scale: 1.2, zIndex: 20, rotate: "0deg" }
            }
            transition={iconHoverSpring}
          >
            <IdeLogo
              src={logo.src}
              alt={logo.alt}
              fit={"fit" in logo ? logo.fit : "cover"}
              boost={"boost" in logo ? logo.boost : false}
            />
          </motion.span>
        ))}
      </div>

      <span
        aria-hidden
        className="h-3.5 w-px shrink-0 rounded-full bg-foreground/12 dark:bg-foreground/20 sm:h-4"
      />

      <p className="min-w-0 text-left font-rounded text-fluid-pill-label font-semibold text-muted-foreground sm:whitespace-nowrap">
        {t("label")}
      </p>
    </div>
  );
}
