"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

import { bunnyEmbedSrc } from "@/lib/bunny-stream";
import type { ChangelogMedia } from "@/lib/changelog";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ChangelogMediaBlockProps = {
  media: ChangelogMedia;
  locale: string;
};

const mediaFrameClass =
  "overflow-hidden rounded-xl border border-border/60 bg-muted/20 xl:rounded-2xl";

function ChangelogImage({
  media,
}: {
  media: Extract<ChangelogMedia, { type: "image" }>;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const src =
    mounted && resolvedTheme === "dark" && media.srcDark
      ? media.srcDark
      : media.src;

  const isPhone = media.layout === "phone";

  return (
    <figure className={cn("not-prose", isPhone && "flex justify-center")}>
      <div
        className={cn(
          mediaFrameClass,
          isPhone ? "w-full max-w-[17.5rem] p-3 md:max-w-[19rem] md:p-4 xl:max-w-[22rem] xl:p-5 2xl:max-w-[24rem]" : "w-full",
        )}
      >
        <Image
          src={src}
          alt={media.alt}
          width={media.width ?? 1600}
          height={media.height ?? 900}
          className={cn(
            "h-auto w-full",
            isPhone && "max-h-[28rem] object-contain object-top xl:max-h-[32rem] 2xl:max-h-[36rem]",
          )}
          sizes={
            isPhone
              ? "(max-width: 768px) 280px, (max-width: 1280px) 304px, (max-width: 1536px) 352px, 384px"
              : "(max-width: 768px) 100vw, (max-width: 1280px) 736px, (max-width: 1536px) 704px, 768px"
          }
        />
      </div>
    </figure>
  );
}

function ChangelogMp4({
  media,
}: {
  media: Extract<ChangelogMedia, { type: "mp4" }>;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(false);
  const reducedMotion = useReducedMotion() ?? false;

  const startAt = media.startAt ?? 0;
  const src = startAt > 0 ? `${media.src}#t=${startAt}` : media.src;
  const shouldAutoplay = media.autoplayInView ?? false;
  const shouldLoop = media.loop ?? false;

  const seekToStart = useCallback((video: HTMLVideoElement) => {
    if (startAt > 0 && video.currentTime < startAt) {
      video.currentTime = startAt;
    }
  }, [startAt]);

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !shouldAutoplay || reducedMotion || !inViewRef.current) return;

    video.defaultMuted = true;
    video.muted = true;
    seekToStart(video);

    if (video.paused) {
      void video.play().catch(() => {
        /* autoplay blocked until user gesture */
      });
    }
  }, [reducedMotion, seekToStart, shouldAutoplay]);

  const syncInView = useCallback(
    (isIntersecting: boolean) => {
      inViewRef.current = isIntersecting;
      const video = videoRef.current;
      if (!video) return;

      if (!isIntersecting || reducedMotion) {
        video.pause();
        return;
      }

      tryPlay();
    },
    [reducedMotion, tryPlay],
  );

  useEffect(() => {
    if (!shouldAutoplay) return;

    const shell = shellRef.current;
    if (!shell) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        syncInView(entry.isIntersecting);
      },
      { rootMargin: "20% 0px", threshold: 0.08 },
    );

    observer.observe(shell);

    const rect = shell.getBoundingClientRect();
    const initiallyVisible =
      rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
    if (initiallyVisible) {
      syncInView(true);
    }

    return () => observer.disconnect();
  }, [shouldAutoplay, syncInView]);

  useEffect(() => {
    if (!shouldAutoplay) return;

    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", tryPlay);
    window.addEventListener("pointerdown", tryPlay, { once: true });

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", tryPlay);
      window.removeEventListener("pointerdown", tryPlay);
    };
  }, [shouldAutoplay, tryPlay]);

  return (
    <figure className="not-prose">
      <div ref={shellRef} className="overflow-hidden rounded-xl bg-black xl:rounded-2xl">
        <video
          ref={videoRef}
          src={src}
          title={media.title}
          aria-label={media.title}
          className={cn(
            "aspect-video w-full bg-black object-cover",
            shouldAutoplay && "pointer-events-none",
          )}
          controls={!shouldAutoplay}
          playsInline
          preload={shouldAutoplay ? "auto" : "metadata"}
          muted
          disablePictureInPicture
          onVolumeChange={(event) => {
            event.currentTarget.muted = true;
          }}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            video.muted = true;
            seekToStart(video);
            if (inViewRef.current) tryPlay();
          }}
          onCanPlay={() => {
            if (inViewRef.current) tryPlay();
          }}
          onEnded={(event) => {
            if (!shouldLoop) return;
            const video = event.currentTarget;
            video.muted = true;
            seekToStart(video);
            void video.play();
          }}
        />
      </div>
    </figure>
  );
}

function ChangelogBunny({
  media,
  locale,
}: {
  media: Extract<ChangelogMedia, { type: "bunny" }>;
  locale: string;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  const shouldAutoplay = media.autoplayInView ?? false;
  const shouldLoop = media.loop ?? false;
  const showPlayer = !shouldAutoplay || (inView && !reducedMotion);

  useEffect(() => {
    if (!shouldAutoplay) return;

    const shell = shellRef.current;
    if (!shell) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: "20% 0px", threshold: 0.08 },
    );

    observer.observe(shell);

    const checkInitial = () => {
      const rect = shell.getBoundingClientRect();
      const initiallyVisible =
        rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
      if (initiallyVisible) {
        setInView(true);
      }
    };

    checkInitial();
    requestAnimationFrame(checkInitial);

    return () => observer.disconnect();
  }, [shouldAutoplay]);

  const src = bunnyEmbedSrc(media.videoId, {
    autoplay: shouldAutoplay,
    muted: true,
    loop: shouldLoop,
    preload: true,
    compactControls: true,
    playerjs: false,
    instanceKey: `changelog-mcp-${locale}`,
  });

  return (
    <figure className="not-prose">
      <div
        ref={shellRef}
        className={cn(
          "relative aspect-video overflow-hidden rounded-xl bg-black xl:rounded-2xl",
          shouldAutoplay && "pointer-events-none",
        )}
      >
        {showPlayer ? (
          <iframe
            src={src}
            title={media.title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            className="absolute inset-0 size-full border-0"
          />
        ) : null}
      </div>
    </figure>
  );
}

export function ChangelogMediaBlock({ media, locale }: ChangelogMediaBlockProps) {
  if (media.type === "image") {
    return <ChangelogImage media={media} />;
  }

  if (media.type === "mp4") {
    return <ChangelogMp4 media={media} />;
  }

  return <ChangelogBunny media={media} locale={locale} />;
}
