"use client";

import { Play, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

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

  /** Depois do primeiro play, só o Bunny (sem overlay nosso). */
  const [playerStarted, setPlayerStarted] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const bunnyRef = useRef<BunnyEmbedHandle>(null);
  const fullscreenBunnyRef = useRef<BunnyEmbedHandle>(null);
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
    setFullscreenOpen(false);
  }, [videoId]);

  /** Play inicial (vidro). */
  function handlePlay() {
    if (fullscreenOpen || playerStarted) return;

    if (!isLgUp) {
      setPlayerStarted(true);
      setFullscreenOpen(true);
      return;
    }

    setPlayerStarted(true);
    bunnyRef.current?.play();
  }

  const closeFullscreen = useCallback(() => {
    fullscreenBunnyRef.current?.pause();
    setFullscreenOpen(false);
  }, []);

  function handleDoubleClickVideo() {
    if (playerStarted && !fullscreenOpen) {
      bunnyRef.current?.toggleFullscreen();
      return;
    }

    setPlayerStarted(true);

    if (!isLgUp) {
      setFullscreenOpen(true);
      return;
    }

    bunnyRef.current?.play();
    window.setTimeout(() => bunnyRef.current?.toggleFullscreen(), 400);
  }

  useEffect(() => {
    if (!fullscreenOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeFullscreen();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenOpen, closeFullscreen]);

  const bunnyPreloadedInline = !fullscreenOpen;
  /** Vidro só no loop. Sem pause. Sem segundo play. */
  const showGlassOverlay = !fullscreenOpen && !playerStarted;

  return (
    <>
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
            onDoubleClick={
              playerStarted ? handleDoubleClickVideo : undefined
            }
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
              "bg-[#0b0d13]",
              "transform-gpu [backface-visibility:hidden]",
            )}
          >
            {bunnyPreloadedInline ? (
              <div
                className={cn(
                  "absolute inset-0 z-0",
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
                />
              </div>
            ) : null}

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

      {fullscreenOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black lg:hidden">
          <div className="relative aspect-video w-full max-w-[100vw] max-h-[100dvh]">
            <BunnyEmbed
              ref={fullscreenBunnyRef}
              videoId={videoId}
              title={t("videoTitle")}
              autoplay
              mute={false}
              interactive
            />
          </div>

          <button
            type="button"
            aria-label={t("close")}
            onClick={(event) => {
              event.stopPropagation();
              closeFullscreen();
            }}
            className={cn(
              "absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-10",
              "flex size-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-md",
              "transition-opacity duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
            )}
          >
            <X className="size-5 text-white" strokeWidth={1.75} />
          </button>
        </div>
      ) : null}
    </>
  );
}
