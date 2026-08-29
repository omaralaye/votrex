"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { PlayIcon, ExternalLinkIcon } from "@/components/icons";

// A stalled embed shows a spinner forever, so fail over to the error state
// when the player does not report a load within this window.
const LOAD_TIMEOUT_MS = 12000;

type PlaybackStatus = "idle" | "loading" | "ready" | "error";

interface VideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  startSeconds?: number;
  className?: string;
  /** Fires when the learner clicks play. */
  onPlay?: () => void;
  /** Fires once each time playback fails to load. */
  onPlaybackError?: (reason: string) => void;
}

/**
 * Extracts YouTube Video ID from various YouTube URL formats
 */
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Extracts Vimeo Video ID from Vimeo URLs
 */
function getVimeoId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Extracts Bunny Stream ID or URL
 */
function isBunnyUrl(url: string): boolean {
  if (!url) return false;
  return url.includes("bunny") || url.includes("mediadelivery.net");
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VideoPlayer({
  videoUrl,
  posterUrl,
  title = "Lesson Video",
  startSeconds = 0,
  className = "",
  onPlay,
  onPlaybackError,
}: VideoPlayerProps) {
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [attempt, setAttempt] = useState(0);
  // Guards the failure callback so a single stall reports one event.
  const reported = useRef(false);

  const embedInfo = useMemo(() => {
    if (!videoUrl) return null;

    const ytId = getYouTubeId(videoUrl);
    if (ytId) {
      const startParam = startSeconds > 0 ? `&start=${Math.floor(startSeconds)}` : "";
      return {
        type: "youtube" as const,
        id: ytId,
        src: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1${startParam}`,
      };
    }

    const vimeoId = getVimeoId(videoUrl);
    if (vimeoId) {
      const timeHash = startSeconds > 0 ? `#t=${Math.floor(startSeconds)}s` : "";
      return {
        type: "vimeo" as const,
        id: vimeoId,
        src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&badge=0&autopause=0${timeHash}`,
      };
    }

    if (isBunnyUrl(videoUrl)) {
      const startParam = startSeconds > 0 ? `?t=${Math.floor(startSeconds)}` : "";
      return {
        type: "bunny" as const,
        src: videoUrl.includes("?") ? `${videoUrl}&autoplay=true` : `${videoUrl}${startParam}`,
      };
    }

    // Direct MP4 or generic video URL
    return {
      type: "direct" as const,
      src: videoUrl,
    };
  }, [videoUrl, startSeconds]);

  const fail = (reason: string) => {
    if (reported.current) return;
    reported.current = true;
    setStatus("error");
    onPlaybackError?.(reason);
  };

  // Fail over when the embed does not load within the timeout window.
  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => fail("timeout"), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, attempt]);

  const startPlayback = () => {
    if (!embedInfo) return;
    reported.current = false;
    setStatus("loading");
    onPlay?.();
  };

  const retry = () => {
    reported.current = false;
    setAttempt((n) => n + 1);
    setStatus("loading");
  };

  const markReady = () => {
    setStatus((prev) => (prev === "loading" ? "ready" : prev));
  };

  const outerClass = `relative w-full aspect-video rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#0A0A0B] border border-[#1E293B]/80 shadow-[0_12px_40px_rgba(0,0,0,0.35)] select-none ${className}`;

  // Error state: retry and a link out to the source video.
  if (status === "error") {
    return (
      <div className={outerClass}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0F1D]">
          <div className="text-[#F97316]">
            <WarningIcon />
          </div>
          <div>
            <p className="font-sans font-semibold text-white text-[15px] sm:text-[16px]">
              This video could not load
            </p>
            <p className="font-sans text-white/70 text-[13px] sm:text-[14px] mt-1">
              Check your connection and try again.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-sans font-medium text-[14px] transition-colors cursor-pointer"
            >
              Try again
            </button>
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 text-white/90 hover:bg-white/10 font-sans font-medium text-[14px] transition-colors cursor-pointer"
              >
                <span>Open video</span>
                <ExternalLinkIcon size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading / ready state: render the embed with a spinner until it reports a load.
  if ((status === "loading" || status === "ready") && embedInfo) {
    return (
      <div className={outerClass}>
        {embedInfo.type === "direct" ? (
          <video
            key={attempt}
            src={embedInfo.src}
            controls
            autoPlay
            poster={posterUrl}
            onLoadedData={markReady}
            onError={() => fail("media_error")}
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            key={attempt}
            src={embedInfo.src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={markReady}
            onError={() => fail("embed_error")}
            className="w-full h-full border-0"
          />
        )}

        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0A0A0B] pointer-events-none">
            <div className="text-[#F97316]">
              <Spinner />
            </div>
            <span className="font-sans text-white/70 text-[13px]">Loading video…</span>
          </div>
        )}
      </div>
    );
  }

  // Idle state: poster with a play button, or an honest "no video" message.
  return (
    <div className={outerClass}>
      <div
        className={`relative w-full h-full flex items-center justify-center group ${embedInfo ? "cursor-pointer" : ""}`}
        onClick={embedInfo ? startPlayback : undefined}
      >
        {/* Poster or Fallback Graphic */}
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            sizes="(max-width: 1024px) 100vw, 900px"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0F1D] flex items-center justify-center">
            <div className="font-serif text-[120px] font-bold text-white/5 select-none">N</div>
          </div>
        )}

        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:via-black/20 transition-all duration-300" />

        {embedInfo ? (
          <div className="relative z-10 flex flex-col items-center gap-3">
            <button
              type="button"
              aria-label={`Play ${title}`}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white flex items-center justify-center shadow-[0_8px_32px_rgba(249,115,22,0.45)] group-hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span className="translate-x-0.5">
                <PlayIcon size={32} filled className="text-white" />
              </span>
            </button>
            <span className="text-white/90 font-sans font-medium text-[13px] sm:text-[14px] tracking-wide uppercase drop-shadow-md">
              Play Lesson Video
            </span>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-1 px-6 text-center">
            <span className="text-white/90 font-sans font-semibold text-[15px] sm:text-[16px]">
              No video for this lesson yet
            </span>
            <span className="text-white/60 font-sans text-[13px]">
              Check back soon — this lesson is still being recorded.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
