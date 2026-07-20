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
  type YouTubePlayer,
} from "@/lib/youtube";
import { cn } from "@/lib/utils";

export type YouTubeEmbedHandle = {
  play: () => void;
  pause: () => void;
};

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  /** Autoplay ao montar (com unmute após gesto do usuário). */
  autoplay?: boolean;
  mute?: boolean;
  className?: string;
  onPlayingChange?: (playing: boolean) => void;
};

/**
 * Player YouTube via IFrame API.
 * Controles nativos (play/pause) — evita o overlay central com linha/sombra defeituosa.
 */
export const YouTubeEmbed = forwardRef<YouTubeEmbedHandle, YouTubeEmbedProps>(
  function YouTubeEmbed(
    {
      videoId,
      title,
      autoplay = true,
      mute = false,
      className,
      onPlayingChange,
    },
    ref,
  ) {
    const reactId = useId().replace(/:/g, "");
    const hostId = `yt-host-${reactId}`;
    const playerRef = useRef<YouTubePlayer | null>(null);
    const onPlayingChangeRef = useRef(onPlayingChange);
    onPlayingChangeRef.current = onPlayingChange;

    useImperativeHandle(ref, () => ({
      play() {
        const player = playerRef.current;
        if (!player) return;
        if (!mute) player.unMute();
        player.playVideo();
      },
      pause() {
        playerRef.current?.pauseVideo();
      },
    }));

    useEffect(() => {
      let cancelled = false;
      let player: YouTubePlayer | null = null;

      void loadYouTubeIframeApi().then(() => {
        if (cancelled || !window.YT?.Player) return;

        const host = document.getElementById(hostId);
        if (!host) return;

        player = new window.YT.Player(hostId, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            mute: mute ? 1 : 0,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            // Controles nativos: play/pause na barra (sem overlay central com linha)
            controls: 1,
            fs: 0,
            iv_load_policy: 3,
            cc_load_policy: 0,
            vq: "hd1080",
            origin: window.location.origin,
          },
          events: {
            onReady: (event: { target: YouTubePlayer }) => {
              if (cancelled) return;
              playerRef.current = event.target;
              disableYouTubeCaptions(event.target);

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

              // Loop sem playlist: evita botões avançar/voltar
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
    }, [autoplay, hostId, mute, videoId]);

    return (
      <div
        className={cn("absolute inset-0 overflow-hidden bg-black", className)}
        aria-label={title}
      >
        <div
          id={hostId}
          className="size-full [&_iframe]:size-full [&_iframe]:border-0"
        />
      </div>
    );
  },
);
