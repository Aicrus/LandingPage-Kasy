"use client";

import Image from "next/image";

import { motion, useReducedMotion } from "@/lib/motion";

const IDE_LOGOS = [
  {
    src: "/assets/ide-logos/antigravity.png",
    alt: "Antigravity",
    rotate: -8,
    bg: "#ffffff",
    fit: "contain" as const,
  },
  { src: "/assets/ide-logos/claude.webp", alt: "Claude", rotate: 5 },
  {
    src: "/assets/ide-logos/cursor-light.svg",
    alt: "Cursor",
    rotate: -4,
    bg: "#ffffff",
    fit: "contain" as const,
  },
  { src: "/assets/ide-logos/openai-icon.svg", alt: "OpenAI", rotate: 9 },
  { src: "/assets/ide-logos/opencode.svg", alt: "OpenCode", rotate: -6 },
  { src: "/assets/ide-logos/kimi.svg", alt: "Kimi", rotate: 3 },
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
}: {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
}) {
  const isSvg = src.endsWith(".svg");
  const objectClass = fit === "contain" ? "object-contain p-0.5" : "object-cover";

  if (isSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- SVGs locais, sem pipeline do Image
      <img
        src={src}
        alt={alt}
        className={`size-full ${objectClass}`}
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
      className={`size-full ${objectClass}`}
      draggable={false}
    />
  );
}

export function HeroAiSubsPill() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-border/60 bg-card/75 px-3.5 py-2 shadow-[0_1px_3px_rgba(26,30,44,0.05),0_8px_24px_-10px_rgba(26,30,44,0.12)] backdrop-blur-sm dark:bg-card/55 dark:shadow-[0_1px_3px_rgba(0,0,0,0.22),0_8px_24px_-10px_rgba(0,0,0,0.35)] sm:gap-3.5 sm:px-4 sm:py-2.5">
      <div className="flex shrink-0 items-center pl-0.5" aria-hidden>
        {IDE_LOGOS.map((logo, index) => (
          <motion.span
            key={logo.src}
            className="relative flex size-7 shrink-0 cursor-default overflow-hidden rounded-[0.45rem] border-2 border-background shadow-sm will-change-transform sm:size-8 sm:rounded-[0.5rem]"
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
            />
          </motion.span>
        ))}
      </div>

      <span
        aria-hidden
        className="h-5 w-px shrink-0 bg-border/80 sm:h-6"
      />

      <p className="min-w-0 text-left font-rounded text-xs font-medium leading-snug text-muted-foreground sm:text-sm sm:whitespace-nowrap">
        Kasy funciona com sua IDE favorita
      </p>
    </div>
  );
}
