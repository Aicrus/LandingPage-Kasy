"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";

import {
  disableYouTubeCaptions,
  loadYouTubeIframeApi,
  preferYouTubeQuality,
  type YoutubeQualityHint,
  type YouTubePlayer,
} from "@/lib/youtube";
import { cn } from "@/lib/utils";

export type YouTubeEmbedHandle = {
  play: () => void;
  pause: () => void;
  /** Tela cheia do player (duplo clique / API). */
  toggleFullscreen: () => void;
};

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  /**
   * Loop mudo sem controles (preview antes do play).
   * Bufferiza o mesmo vídeo do YouTube; sem som até o play do usuário.
   */
  previewLoop?: boolean;
  /**
   * Se false, o iframe ignora o mouse (evita chrome do YouTube no hover do loop).
   */
  interactive?: boolean;
  /** Autoplay ao montar (modo ativo com som, após gesto). */
  autoplay?: boolean;
  mute?: boolean;
  className?: string;
  onPlayingChange?: (playing: boolean) => void;
  onPreloaded?: () => void;
};

/**
 * Player YouTube via IFrame API.
 * Preview: mudo + sem chrome. Ativo: controles nativos + som.
 */
export const YouTubeEmbed = forwardRef<YouTubeEmbedHandle, YouTubeEmbedProps>(
  function YouTubeEmbed(
    {
      videoId,
      title,
      previewLoop = false,
      interactive = true,
      autoplay = true,
      mute = false,
      className,
      onPlayingChange,
      onPreloaded,
    },
    ref,
  ) {
    const reactId = useId().replace(/:/g, "");
    const hostId = `yt-host-${reactId}`;
    const playerRef = useRef<YouTubePlayer | null>(null);
    const onPlayingChangeRef = useRef(onPlayingChange);
    const onPreloadedRef = useRef(onPreloaded);
    const previewReadyRef = useRef(false);
    const userStartedRef = useRef(false);
    onPlayingChangeRef.current = onPlayingChange;
    onPreloadedRef.current = onPreloaded;

    useImperativeHandle(ref, () => ({
      play() {
        const player = playerRef.current;
        if (!player) return;

        if (!userStartedRef.current) {
          userStartedRef.current = true;
          player.seekTo(0, true);
        }

        player.unMute();
        player.setVolume(100);
        player.playVideo();
      },
      pause() {
        playerRef.current?.pauseVideo();
      },
      toggleFullscreen() {
        const iframe = playerRef.current?.getIframe();
        if (!iframe) return;

        const doc = document as Document & {
          webkitFullscreenElement?: Element | null;
          webkitExitFullscreen?: () => Promise<void> | void;
        };
        const active =
          document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;

        if (active) {
          if (document.exitFullscreen) void document.exitFullscreen();
          else void doc.webkitExitFullscreen?.();
          return;
        }

        const req =
          iframe.requestFullscreen?.bind(iframe) ??
          (
            iframe as HTMLIFrameElement & {
              webkitRequestFullscreen?: () => Promise<void> | void;
            }
          ).webkitRequestFullscreen?.bind(iframe);

        void req?.();
      },
    }));

    useEffect(() => {
      const iframe = playerRef.current?.getIframe();
      if (!iframe) return;
      iframe.style.pointerEvents = interactive ? "auto" : "none";
    }, [interactive]);

    useEffect(() => {
      let cancelled = false;
      let player: YouTubePlayer | null = null;
      previewReadyRef.current = false;
      userStartedRef.current = false;

      const quality: YoutubeQualityHint = preferYouTubeQuality();
      const startMuted = previewLoop || mute;
      const startAutoplay = previewLoop || autoplay;
      // Preview: sem barra/config. Ativo: controles + fullscreen.
      const showControls = previewLoop ? 0 : 1;

      void loadYouTubeIframeApi().then(() => {
        if (cancelled || !window.YT?.Player) return;

        const host = document.getElementById(hostId);
        if (!host) return;

        player = new window.YT.Player(hostId, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: startAutoplay ? 1 : 0,
            mute: startMuted ? 1 : 0,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            controls: showControls,
            // Fullscreen no duplo clique (mesmo no preview; botão some com controls:0)
            fs: 1,
            disablekb: previewLoop ? 1 : 0,
            iv_load_policy: 3,
            cc_load_policy: 0,
            vq: quality,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: { target: YouTubePlayer }) => {
              if (cancelled) return;
              playerRef.current = event.target;
              disableYouTubeCaptions(event.target);

              const iframe = event.target.getIframe();
              iframe.setAttribute("allowfullscreen", "true");
              iframe.setAttribute(
                "allow",
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
              );
              if (previewLoop) {
                iframe.style.pointerEvents = "none";
              }

              if (previewLoop) {
                event.target.mute();
                event.target.playVideo();
                return;
              }

              if (!mute) {
                event.target.unMute();
                event.target.setVolume(100);
              }

              if (autoplay) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: { data: number; target: YouTubePlayer }) => {
              if (cancelled || !window.YT) return;
              disableYouTubeCaptions(event.target);

              const { PLAYING, PAUSED, ENDED, BUFFERING } = window.YT.PlayerState;

              // Preview: mantém loop mudo (não pausa)
              if (previewLoop && !userStartedRef.current) {
                if (event.data === PLAYING && !previewReadyRef.current) {
                  previewReadyRef.current = true;
                  onPreloadedRef.current?.();
                }
                if (event.data === ENDED) {
                  event.target.seekTo(0, true);
                  event.target.mute();
                  event.target.playVideo();
                }
                return;
              }

              if (event.data === ENDED) {
                event.target.seekTo(0, true);
                event.target.playVideo();
                onPlayingChangeRef.current?.(true);
                return;
              }

              if (event.data === PLAYING || event.data === BUFFERING) {
                onPlayingChangeRef.current?.(true);
              } else if (event.data === PAUSED) {
                onPlayingChangeRef.current?.(false);
              }
            },
            onApiChange: (event: { target: YouTubePlayer }) => {
              disableYouTubeCaptions(event.target);
            },
          },
        }) as YouTubePlayer;

        playerRef.current = player;
      });

      return () => {
        cancelled = true;
        playerRef.current = null;
        try {
          player?.destroy();
        } catch {
          /* ignore */
        }
      };
    }, [autoplay, hostId, mute, previewLoop, videoId]);

    return (
      <div
        className={cn(
          "absolute inset-0 overflow-hidden bg-black",
          "transform-gpu [backface-visibility:hidden]",
          !interactive && "pointer-events-none",
          className,
        )}
        aria-label={title}
      >
        <div
          id={hostId}
          className={cn(
            "absolute -inset-px size-[calc(100%+2px)]",
            "[&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:size-full",
            "[&_iframe]:border-0 [&_iframe]:outline-none",
            // Filho com pointer-events:auto furaria o none do pai; força no iframe
            !interactive && "pointer-events-none [&_iframe]:!pointer-events-none",
          )}
        />
      </div>
    );
  },
);
