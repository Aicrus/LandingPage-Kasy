"use client";

import { Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import {
  BunnyEmbed,
  type BunnyEmbedHandle,
} from "@/components/bunny-embed";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "@/lib/motion";
import { getShowcaseVideoId } from "@/lib/bunny-stream";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const LG_MEDIA = "(min-width: 1024px)";

/** Botão de vidro: só no loop, uma vez, antes do play com som. */
const glassPlayButtonClass =
  "flex size-12 items-center justify-center rounded-xl sm:size-14 sm:rounded-2xl bg-white/15 backdrop-blur-md transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 motion-safe:group-active:scale-95";

export function VideoShowcase() {
  const t = useTranslations("videoShowcase");
  const locale = useLocale();
  const videoId = getShowcaseVideoId(locale);

  /** Só some o vidro quando o vídeo com som de fato começou. */
  const [playerStarted, setPlayerStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const bunnyRef = useRef<BunnyEmbedHandle>(null);
  const reducedMotion = useReducedMotion();
  const isLgUp = useMediaQuery(LG_MEDIA);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const width = useTransform(scrollYProgress, [0, 1], ["52vw", "74vw"]);
  const groupY = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const groupOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const videoOverlapMarginTop = useTransform(
    scrollYProgress,
    [0, 0.55],
    [36, -96],
  );
  const textOpacity = useTransform(scrollYProgress, [0.38, 0.72], [1, 0]);
  const textY = useTransform(scrollYProgress, [0.38, 0.72], [0, -72]);
  const widthMobile = useTransform(scrollYProgress, [0, 1], ["72vw", "82vw"]);
  const videoGapMobile = useTransform(scrollYProgress, [0, 0.55], [24, 10]);

  useEffect(() => {
    setPlayerStarted(false);
  }, [videoId]);

  /** Um toque: play com som no mesmo player (mobile e desktop). Sem modal preto. */
  function handlePlay() {
    if (playerStarted) return;
    bunnyRef.current?.play();
  }

  function handleDoubleClickVideo() {
    if (playerStarted) {
      bunnyRef.current?.toggleFullscreen();
      return;
    }

    bunnyRef.current?.play();
    if (isLgUp) {
      window.setTimeout(() => bunnyRef.current?.toggleFullscreen(), 400);
    }
  }

  const showGlassOverlay = !playerStarted;

  return (
    <div
      ref={sectionRef}
      className={cn(
        "relative flex w-full flex-col items-center",
        "overflow-hidden max-lg:overflow-visible",
        "mt-[clamp(-3.5rem,-4vw,-2rem)]",
      )}
    >
      <motion.div
        style={
          reducedMotion ? undefined : { y: groupY, opacity: groupOpacity }
        }
        className="flex w-full flex-col items-center"
      >
        <motion.p
          aria-hidden
          style={
            reducedMotion ? undefined : { opacity: textOpacity, y: textY }
          }
          className={cn(
            "pointer-events-none relative z-0 select-none whitespace-nowrap uppercase",
            "bg-gradient-to-r from-primary to-primary/25 bg-clip-text text-transparent",
            "font-[family-name:var(--font-syne)] font-bold leading-none tracking-tight",
            "text-[clamp(2.75rem,10vw,8rem)]",
          )}
        >
          {t("bigLabel")}
        </motion.p>

        <motion.div
          onDoubleClick={playerStarted ? handleDoubleClickVideo : undefined}
          style={
            reducedMotion
              ? { width: "min(82vw, 48rem)" }
              : isLgUp
                ? { width, marginTop: videoOverlapMarginTop, scale: 1 }
                : { width: widthMobile, marginTop: videoGapMobile }
          }
          className={cn(
            "group relative z-10 aspect-video overflow-hidden",
            "rounded-[1.5rem] sm:rounded-[2rem]",
            // Sempre preto: frame de vídeo, não herda o background claro/escuro da LP
            "bg-black",
            "transform-gpu [backface-visibility:hidden]",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 z-0 bg-black",
              playerStarted ? "z-[1]" : "pointer-events-none",
            )}
          >
            <BunnyEmbed
              ref={bunnyRef}
              videoId={videoId}
              title={t("videoTitle")}
              previewLoop
              interactive={playerStarted}
              onUserStarted={() => setPlayerStarted(true)}
              onPlayingChange={(isPlaying) => {
                if (isPlaying) setPlayerStarted(true);
              }}
            />
          </div>

          {showGlassOverlay ? (
            <button
              type="button"
              aria-label={t("play")}
              onClick={handlePlay}
              onDoubleClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleDoubleClickVideo();
              }}
              className={cn(
                "absolute inset-0 z-20 flex size-full cursor-pointer items-center justify-center outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <span className={glassPlayButtonClass}>
                <Play
                  className="size-6 translate-x-0.5 text-white sm:size-7"
                  strokeWidth={1.75}
                />
              </span>
            </button>
          ) : null}
        </motion.div>
      </motion.div>
    </div>
  );
}
