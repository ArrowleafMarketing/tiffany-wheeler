"use client";

import { LoaderCircle, Play, RotateCcw } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export type VideoSource = { src: string; type: string; media?: string };
/** A WebVTT file for a `<track>`: captions by default. */
export type VideoTrack = { src: string; srcLang: string; label: string; kind?: "captions" | "subtitles" };

type Props = {
  /** Analytics id, e.g. "trailer". */
  videoId: string;
  /** Accessible name of the <video> and the analytics title. */
  videoTitle: string;
  sources: VideoSource[];
  /** Caption files; the first one is on by default. */
  tracks?: VideoTrack[];
  /** Server-rendered poster image that fills the frame until playback starts. */
  poster: ReactNode;
  playLabel: string;
  /** Longer description of the play button (duration, sound). */
  playDescription: string;
  /** Shown over the last frame when the video ends; it receives focus then. */
  endCard?: ReactNode;
  /** Accessible name of the end card (required for it to be announced when it takes focus). */
  endCardLabel?: string;
  replayLabel?: string;
  /**
   * Stop here (seconds) and show the end card, as if the clip ended: a teaser
   * of a longer video. Scrubbing past it lands on the end card too.
   */
  stopAt?: number;
  /** Plain link to the file for visitors without JavaScript. */
  fallbackHref: string;
  /** "compact" = smaller play control, for narrow portrait frames. */
  size?: "default" | "compact";
  /** Frame classes: aspect ratio, rounding, shadow. */
  className?: string;
};

type State = "idle" | "starting" | "playing" | "ended";

/**
 * Click-to-play video with sound. Nothing but the poster image downloads until
 * the visitor presses play (`preload="none"`, no `poster` attribute). Fires
 * `video_play` once, on the first play.
 */
export function VideoPlayer({
  videoId,
  videoTitle,
  sources,
  tracks = [],
  poster,
  playLabel,
  playDescription,
  endCard,
  endCardLabel,
  replayLabel,
  stopAt,
  fallbackHref,
  size = "default",
  className,
}: Props) {
  const descriptionId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const endCardRef = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);
  const focusOnPlay = useRef(false);
  const focusEndCard = useRef(false);
  const [state, setState] = useState<State>("idle");

  const start = () => {
    const video = videoRef.current;
    if (!video) return;
    setState("starting");
    focusOnPlay.current = true;
    // play() must run inside the tap handler for sound to be allowed (iOS, in-app browsers).
    video.play().catch(() => {
      // Autoplay refused: hand over to the native controls.
      setState("playing");
    });
  };

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    // The end card (and the focused replay button) unmounts: hand focus back to the player.
    focusOnPlay.current = true;
    setState("playing");
    video.play().catch(() => {});
  };

  // The play button unmounts once playback starts; move keyboard focus to the
  // player (it only becomes focusable once `controls` is on, hence the effect).
  useEffect(() => {
    if (state !== "playing" || !focusOnPlay.current) return;
    focusOnPlay.current = false;
    videoRef.current?.focus({ preventScroll: true });
  }, [state]);

  // When the clip ends the native controls go away; move focus to the end card
  // (a labelled group) instead of letting it fall to <body>. Only when focus was
  // inside the player, so a visitor who scrolled on isn't pulled back.
  useEffect(() => {
    if (state !== "ended" || !focusEndCard.current) return;
    focusEndCard.current = false;
    endCardRef.current?.focus({ preventScroll: true });
  }, [state]);

  const finish = (video: HTMLVideoElement) => {
    if (!endCard) return;
    const root = video.parentElement;
    focusEndCard.current = Boolean(root && root.contains(document.activeElement));
    setState("ended");
  };

  const showPoster = state === "idle" || state === "starting";

  return (
    <div className={cn("relative isolate overflow-hidden bg-night", className)}>
      <video
        ref={videoRef}
        aria-label={videoTitle}
        playsInline
        preload="none"
        controls={!showPoster && state !== "ended"}
        className="absolute inset-0 size-full object-cover"
        onPlay={() => {
          if (tracked.current) return;
          tracked.current = true;
          track("video_play", { video_id: videoId, video_title: videoTitle });
        }}
        onPlaying={() => setState("playing")}
        onEnded={(e) => finish(e.currentTarget)}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (stopAt === undefined || state === "ended" || video.currentTime < stopAt) return;
          video.pause();
          finish(video);
        }}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} media={s.media} />
        ))}
        {tracks.map((t, i) => (
          <track key={t.src} kind={t.kind ?? "captions"} src={t.src} srcLang={t.srcLang} label={t.label} default={i === 0} />
        ))}
      </video>

      {showPoster ? (
        <div className="absolute inset-0">
          {poster}
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-night/55 via-night/5 to-transparent" />
          <button
            type="button"
            onClick={start}
            disabled={state === "starting"}
            aria-describedby={descriptionId}
            className="group absolute inset-0 flex flex-col items-center justify-end gap-3 p-4 text-white sm:p-6"
          >
            <span
              aria-hidden
              className={cn(
                "absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/95 text-night shadow-lift transition-transform duration-200 group-hover:scale-105",
                size === "compact" ? "size-14" : "size-16 sm:size-20",
              )}
            >
              {state === "starting" ? (
                <LoaderCircle className="size-7 animate-spin" />
              ) : (
                <Play className={cn("translate-x-0.5 fill-current", size === "compact" ? "size-6" : "size-7 sm:size-8")} />
              )}
            </span>
            <span className="inline-flex min-h-11 items-center rounded-full bg-night/80 px-4 text-sm font-semibold backdrop-blur-sm sm:text-base">
              {playLabel}
            </span>
          </button>
          <span id={descriptionId} className="sr-only">
            {playDescription}
          </span>
          <noscript>
            <a href={fallbackHref} className="absolute inset-0 z-10" aria-label={playDescription} />
          </noscript>
        </div>
      ) : null}

      {state === "ended" && endCard ? (
        <div
          ref={endCardRef}
          tabIndex={-1}
          role="group"
          aria-label={endCardLabel}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-night/85 p-4 text-center text-white outline-none backdrop-blur-sm focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-gold"
        >
          {endCard}
          {replayLabel ? (
            <button
              type="button"
              onClick={replay}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-white/85 hover:text-white"
            >
              <RotateCcw aria-hidden className="size-4" />
              {replayLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
