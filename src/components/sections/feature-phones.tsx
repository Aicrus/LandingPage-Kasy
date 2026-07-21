"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PhoneCopy = {
  title: string;
  description: string;
};

type PhoneMeta = {
  key: string;
  video: string;
  poster: string;
};

const PHONES_META: PhoneMeta[] = [
  {
    key: "drive",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/a2787388-4456-4446-88fb-c0de05d10517/play_720p.mp4",
    poster: "/images/gallery/vertical-1.jpg",
  },
  {
    key: "paywall",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/45b7d167-c2df-4537-9dbf-9bf57744b875/play_720p.mp4",
    poster: "/images/gallery/vertical-2.jpg",
  },
  {
    key: "supportChat",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/adfa5e78-6f50-4850-853e-5971f6435eeb/play_720p.mp4",
    poster: "/images/gallery/vertical-3.jpg",
  },
  {
    key: "featureRequests",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/fc7f031f-04a3-47bd-88e9-7c917b87e202/play_720p.mp4",
    poster: "/images/gallery/vertical-4.jpg",
  },
  {
    key: "kanban",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/5a1557ed-ed95-43e4-b8c3-448f6771aa9a/play_720p.mp4",
    poster: "/images/gallery/app-screen-schedule.jpg",
  },
  {
    key: "fullReview",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/72a27566-4fa5-4054-879c-e2ca652d0a99/play_720p.mp4",
    poster: "/images/gallery/app-screen-homeapp.png",
  },
];

/** Corpo do aparelho na moldura 1080×1920 (sem alterar o PNG). */
const PHONE_BODY_INSET = {
  top: "2.5%",
  right: "9.5%",
  bottom: "2.5%",
  left: "9.5%",
} as const;

const IPHONE_FRAME = "/assets/iphone-frame.png";

function PhoneScreen({
  video,
  poster,
  title,
}: {
  video: string;
  poster: string;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const [inView, setInView] = useState(false);
  const shouldLoad = Boolean(video);

  const tryPlay = useCallback(() => {
    const node = videoRef.current;
    if (!node || reducedMotion) return;

    node.defaultMuted = true;
    node.muted = true;
    node.playsInline = true;

    if (node.paused) {
      void node.play().catch(() => {
        /* autoplay bloqueado: tenta de novo no próximo gesto/visibilidade */
      });
    }
  }, [reducedMotion]);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "20% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !shouldLoad) return;

    if (reducedMotion || !inView) {
      node.pause();
      return;
    }

    tryPlay();

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
  }, [inView, reducedMotion, shouldLoad, tryPlay]);

  const onCanPlay = useCallback(() => {
    setVideoReady(true);
    tryPlay();
  }, [tryPlay]);

  const onError = useCallback(() => setVideoReady(false), []);

  return (
    <div
      ref={shellRef}
      className={cn(
        "relative mx-auto w-full max-w-[11.5rem] sm:max-w-[13rem] lg:max-w-[14.75rem]",
        "aspect-[1080/1920]",
      )}
    >
      {/* Mesmo tamanho do iPhone; a moldura original recorta a tela. */}
      <div
        className="absolute z-0 overflow-hidden rounded-[14%/7%] bg-black"
        style={{
          top: PHONE_BODY_INSET.top,
          right: PHONE_BODY_INSET.right,
          bottom: PHONE_BODY_INSET.bottom,
          left: PHONE_BODY_INSET.left,
        }}
      >
        <Image
          src={poster}
          alt=""
          fill
          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 15rem"
          className={cn(
            "object-cover transition-opacity duration-500",
            videoReady ? "opacity-0" : "opacity-100",
          )}
          aria-hidden
        />

        {shouldLoad ? (
          <video
            ref={videoRef}
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-500",
              videoReady ? "opacity-100" : "opacity-0",
            )}
            src={video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label={title}
            onCanPlay={onCanPlay}
            onLoadedData={onCanPlay}
            onPlaying={() => setVideoReady(true)}
            onError={onError}
          />
        ) : null}
      </div>

      <Image
        src={IPHONE_FRAME}
        alt=""
        fill
        unoptimized
        sizes="(max-width: 640px) 46vw, (max-width: 1024px) 24vw, 15rem"
        className="pointer-events-none z-10 object-contain drop-shadow-[0_18px_36px_rgba(4,43,89,0.22)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
        aria-hidden
        priority={false}
      />
    </div>
  );
}

export function FeaturePhones() {
  const t = useTranslations("featurePhones");
  const phonesCopy = t.raw("items") as Record<string, PhoneCopy>;
  const phones = PHONES_META.map((meta) => ({
    ...meta,
    ...phonesCopy[meta.key],
  }));

  return (
    <section
      id="feature-phones"
      aria-label={t("ariaLabel")}
      className={cn(
        "mx-auto w-full",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[clamp(2.5rem,5vw,4rem)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <div
        className={cn(
          "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10",
          "lg:grid-cols-3 lg:gap-x-8",
          "max-sm:-mx-[clamp(0.25rem,1vw,0.75rem)]",
        )}
      >
        {phones.map((phone, index) => (
          <Reveal key={phone.key} delay={0.04 * index} className="min-w-0">
            <figure className="flex flex-col items-center gap-3.5 sm:gap-4">
              <PhoneScreen
                video={phone.video}
                poster={phone.poster}
                title={phone.title}
              />
              <figcaption className="w-full max-w-[14.5rem] text-center">
                <h3
                  className={cn(
                    "text-pretty font-heading font-bold text-foreground",
                    "text-[0.9375rem] leading-snug tracking-[-0.01em] sm:text-base",
                  )}
                >
                  {phone.title}
                </h3>
                <p className="mt-1 text-pretty text-[0.8125rem] leading-snug text-muted-foreground sm:text-sm">
                  {phone.description}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
