"use client";

import Image from "next/image";

import { surfaceBorderClass } from "@/lib/surface-border";

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
  const sizeClass = boost ? "size-full scale-[1.12]" : "size-full";

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
      width={64}
      height={64}
      className={`${sizeClass} ${objectClass}`}
      draggable={false}
    />
  );
}

export function HeroAiSubsPill() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-3 rounded-full border bg-card/75 px-3.5 py-2 backdrop-blur-sm dark:bg-card/55 sm:gap-3.5 sm:px-4 sm:py-2.5",
        surfaceBorderClass,
      )}
    >
      <div className="flex shrink-0 items-center pl-0.5" aria-hidden>
        {IDE_LOGOS.map((logo, index) => (
          <motion.span
            key={logo.src}
            className={cn(
              "relative flex size-7 shrink-0 cursor-default overflow-hidden rounded-[0.45rem] border border-solid will-change-transform sm:size-8 sm:rounded-[0.5rem]",
              surfaceBorderClass,
            )}
            style={{
              zIndex: index + 1,
              marginLeft: index === 0 ? 0 : "-0.55rem",
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
        className="h-5 w-px shrink-0 bg-border/80 sm:h-6"
      />

      <p className="min-w-0 text-left font-rounded text-fluid-pill-label font-bold text-muted-foreground sm:whitespace-nowrap">
        Utilize com sua IDE favorita
      </p>
    </div>
  );
}
