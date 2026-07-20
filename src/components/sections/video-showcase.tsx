"use client";

import { Pause, Play, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  YouTubeEmbed,
  type YouTubeEmbedHandle,
} from "@/components/youtube-embed";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { getShowcaseYouTubeId } from "@/lib/youtube";

const LG_MEDIA = "(min-width: 1024px)";

const CONTROLS_HIDE_DELAY_MS = 250;

/** Loop de fundo — toca mudo até a pessoa dar play. */
const LOOP_VIDEO_SRC =
  "https://framerusercontent.com/assets/t3oWwHTiHPdqvISgXglF9dJecA.mp4";

/** Fallback local se ainda não houver ID do YouTube em `YOUTUBE_SHOWCASE_VIDEO`. */
const VIDEO_SRC =
  "https://framerusercontent.com/assets/P3x9QvFGoxzu1AUq58rA1x2gNA.mp4";

const YOUTUBE_VIDEO_ID = getShowcaseYouTubeId();

/** Botão de vidro (só no loop, antes do YouTube). */
const glassPlayButtonClass =
  "flex size-12 items-center justify-center rounded-xl sm:size-14 sm:rounded-2xl bg-white/15 backdrop-blur-md transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 motion-safe:group-active:scale-95";

export function VideoShowcase() {
  const t = useTranslations("videoShowcase");
  const [playing, setPlaying] = useState(false);
  /** Depois do primeiro play, o YouTube fica montado (pause não volta ao loop). */
  const [youtubeStarted, setYoutubeStarted] = useState(false);
  const youtubeStartedRef = useRef(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inlineVideoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const youtubeRef = useRef<YouTubeEmbedHandle>(null);
  const fullscreenYoutubeRef = useRef<YouTubeEmbedHandle>(null);
  const reducedMotion = useReducedMotion();
  const isLgUp = useMediaQuery(LG_MEDIA);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const width = useTransform(scrollYProgress, [0, 1], ["52vw", "74vw"]);
  // Sem CSS scale no frame com YouTube: scale em iframe gera linha/hairline no pause.
  const scaleLoop = useTransform(scrollYProgress, [0, 1], [0.55, 0.92]);
  const groupY = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const groupOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const videoOverlapMarginTop = useTransform(scrollYProgress, [0, 0.55], [36, -96]);
  const textOpacity = useTransform(scrollYProgress, [0.38, 0.72], [1, 0]);
  const textY = useTransform(scrollYProgress, [0.38, 0.72], [0, -72]);
  const widthMobile = useTransform(scrollYProgress, [0, 1], ["72vw", "82vw"]);
  const videoGapMobile = useTransform(scrollYProgress, [0, 0.55], [24, 10]);

  function clearHideTimeout() {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  }

  function scheduleHide() {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(
      () => setControlsVisible(false),
      CONTROLS_HIDE_DELAY_MS,
    );
  }

  function handleMouseMove() {
    if (!playing) return;
    setControlsVisible(true);
    scheduleHide();
  }

  /** Play/pause nosso (YouTube fica com pointer-events off para o duplo clique chegar). */
  function handleToggle() {
    if (fullscreenOpen) {
      if (YOUTUBE_VIDEO_ID) {
        if (playing) {
          fullscreenYoutubeRef.current?.pause();
          setPlaying(false);
          setControlsVisible(true);
          clearHideTimeout();
        } else {
          fullscreenYoutubeRef.current?.play();
          setPlaying(true);
          setControlsVisible(true);
          scheduleHide();
        }
        return;
      }

      const video = fullscreenVideoRef.current;
      if (!video) return;

      if (playing) {
        video.pause();
        setPlaying(false);
        setControlsVisible(true);
        clearHideTimeout();
      } else {
        void video.play();
        setPlaying(true);
        setControlsVisible(true);
        scheduleHide();
      }
      return;
    }

    // YouTube já ativo no inline: play/pause via API (iframe não recebe clique)
    if (YOUTUBE_VIDEO_ID && youtubeStarted) {
      if (playing) {
        youtubeRef.current?.pause();
        setPlaying(false);
        setControlsVisible(true);
        clearHideTimeout();
      } else {
        youtubeRef.current?.play();
        setPlaying(true);
        setControlsVisible(true);
        scheduleHide();
      }
      return;
    }

    if (playing) {
      inlineVideoRef.current?.pause();
      setPlaying(false);
      setControlsVisible(true);
      clearHideTimeout();
      return;
    }

    if (!isLgUp) {
      youtubeStartedRef.current = true;
      setYoutubeStarted(true);
      setPlaying(true);
      setFullscreenOpen(true);
      return;
    }

    // Desktop: revela o YouTube já pré-carregado (mudo → unmute + início)
    youtubeStartedRef.current = true;
    setYoutubeStarted(true);
    setPlaying(true);
    setControlsVisible(false);
    if (YOUTUBE_VIDEO_ID) {
      queueMicrotask(() => youtubeRef.current?.play());
    } else {
      setControlsVisible(true);
      scheduleHide();
    }
  }

  const closeFullscreen = useCallback(() => {
    fullscreenYoutubeRef.current?.pause();
    fullscreenVideoRef.current?.pause();
    setFullscreenOpen(false);
    setPlaying(false);
    setControlsVisible(true);
    clearHideTimeout();
  }, []);

  function handleDoubleClickVideo() {
    if (showYoutubeInline) {
      youtubeRef.current?.toggleFullscreen();
      return;
    }

    if (YOUTUBE_VIDEO_ID) {
      youtubeStartedRef.current = true;
      setYoutubeStarted(true);
      setPlaying(true);
      setControlsVisible(false);
      if (!isLgUp) {
        setFullscreenOpen(true);
        return;
      }
      queueMicrotask(() => youtubeRef.current?.play());
      window.setTimeout(() => youtubeRef.current?.toggleFullscreen(), 450);
      return;
    }

    const video = inlineVideoRef.current;
    if (video?.requestFullscreen) void video.requestFullscreen();
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

  const showYoutubeInline =
    Boolean(YOUTUBE_VIDEO_ID) && youtubeStarted && !fullscreenOpen;

  /** YouTube montado cedo (loop mudo / pré-carga), mesmo antes do play. */
  const youtubePreloadedInline =
    Boolean(YOUTUBE_VIDEO_ID) && !fullscreenOpen;

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
          reducedMotion
            ? undefined
            : { y: groupY, opacity: groupOpacity }
        }
        className="flex w-full flex-col items-center"
      >
        <motion.p
          aria-hidden
          style={
            reducedMotion
              ? undefined
              : { opacity: textOpacity, y: textY }
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
          onMouseMove={handleMouseMove}
          onDoubleClick={handleDoubleClickVideo}
          title={showYoutubeInline ? t("doubleClickFullscreen") : undefined}
          style={
            reducedMotion
              ? { width: "min(82vw, 48rem)" }
              : isLgUp
                ? YOUTUBE_VIDEO_ID
                  ? // YouTube (pré-carga ou ativo): sem scale (evita linha no iframe)
                    { width, marginTop: videoOverlapMarginTop, scale: 1 }
                  : { width, scale: scaleLoop, marginTop: videoOverlapMarginTop }
                : { width: widthMobile, marginTop: videoGapMobile }
          }
          className={cn(
            "group relative z-10 aspect-video overflow-hidden",
            "rounded-[1.5rem] sm:rounded-[2rem]",
            "bg-[#0b0d13]",
            YOUTUBE_VIDEO_ID && "transform-gpu [backface-visibility:hidden]",
          )}
        >
          {youtubePreloadedInline ? (
            <div
              className={cn(
                "absolute inset-0 z-0",
                youtubeStarted ? "z-[1]" : "pointer-events-none",
              )}
            >
              <YouTubeEmbed
                ref={youtubeRef}
                videoId={YOUTUBE_VIDEO_ID!}
                title={t("youtubeTitle")}
                previewLoop
                // Sempre off: o overlay captura clique e duplo clique (fullscreen)
                interactive={false}
                onPlayingChange={(isPlaying) => {
                  if (youtubeStartedRef.current) setPlaying(isPlaying);
                }}
              />
            </div>
          ) : null}

          {/* Fallback MP4 só se não houver YouTube */}
          {!YOUTUBE_VIDEO_ID && !youtubeStarted && !fullscreenOpen ? (
            playing ? (
              <video
                ref={inlineVideoRef}
                src={VIDEO_SRC}
                autoPlay
                playsInline
                onPlay={scheduleHide}
                onEnded={() => {
                  setPlaying(false);
                  setControlsVisible(true);
                  clearHideTimeout();
                }}
                className="absolute inset-0 z-[1] size-full object-cover"
              />
            ) : (
              <video
                src={LOOP_VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 z-[1] size-full object-cover"
              />
            )
          ) : null}

          {/* Overlay sempre por cima: clique = play/pause, duplo = fullscreen */}
          <button
            type="button"
            aria-label={playing ? t("pause") : t("play")}
            onClick={handleToggle}
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
            <span
              className={cn(
                glassPlayButtonClass,
                playing && !controlsVisible ? "opacity-0" : "opacity-100",
              )}
            >
              {playing ? (
                <Pause className="size-6 text-white sm:size-7" strokeWidth={1.75} />
              ) : (
                <Play
                  className="size-6 translate-x-0.5 text-white sm:size-7"
                  strokeWidth={1.75}
                />
              )}
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>

    {fullscreenOpen ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black lg:hidden"
        onMouseMove={handleMouseMove}
      >
        {YOUTUBE_VIDEO_ID ? (
          <div
            className="relative aspect-video w-full max-w-[100vw] max-h-[100dvh]"
            onDoubleClick={() => fullscreenYoutubeRef.current?.toggleFullscreen()}
          >
            <YouTubeEmbed
              ref={fullscreenYoutubeRef}
              videoId={YOUTUBE_VIDEO_ID}
              title={t("youtubeTitle")}
              autoplay
              mute={false}
              interactive={false}
              onPlayingChange={setPlaying}
            />
          </div>
        ) : (
          <video
            ref={fullscreenVideoRef}
            src={VIDEO_SRC}
            autoPlay
            playsInline
            onPlay={() => {
              setPlaying(true);
              scheduleHide();
            }}
            onPause={() => {
              setPlaying(false);
              setControlsVisible(true);
              clearHideTimeout();
            }}
            onEnded={closeFullscreen}
            className="size-full object-contain"
          />
        )}

        <button
          type="button"
          aria-label={playing ? t("pause") : t("play")}
          onClick={handleToggle}
          onDoubleClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (YOUTUBE_VIDEO_ID) {
              fullscreenYoutubeRef.current?.toggleFullscreen();
              return;
            }
            const video = fullscreenVideoRef.current;
            if (video?.requestFullscreen) void video.requestFullscreen();
          }}
          className="absolute inset-0 z-20 flex size-full items-center justify-center outline-none"
        >
          <span
            className={cn(
              glassPlayButtonClass,
              playing && !controlsVisible ? "opacity-0" : "opacity-100",
            )}
          >
            {playing ? (
              <Pause className="size-6 text-white sm:size-7" strokeWidth={1.75} />
            ) : (
              <Play
                className="size-6 translate-x-0.5 text-white sm:size-7"
                strokeWidth={1.75}
              />
            )}
          </span>
        </button>

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
