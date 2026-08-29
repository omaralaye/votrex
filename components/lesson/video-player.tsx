"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import { PlayIcon } from "@/components/icons";

interface VideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  startSeconds?: number;
  courseSlug?: string;
  lessonSlug?: string;
  duration?: string;
  className?: string;
  onPlay?: () => void;
  onWatchDepth?: (depthPercentage: number) => void;
  onComplete?: () => void;
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

function parseDurationToSeconds(durationStr?: string): number {
  if (!durationStr) return 900;
  const trimmed = durationStr.trim().toLowerCase();

  // Format: "12:45" or "1:12:45"
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":").map((p) => parseFloat(p) || 0);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
  }

  // Format: "1h 28m" or "2h 30m" or "45m" or "15m"
  let totalSec = 0;
  const hourMatch = trimmed.match(/(\d+)\s*h/);
  const minMatch = trimmed.match(/(\d+)\s*m/);
  const secMatch = trimmed.match(/(\d+)\s*s/);

  if (hourMatch) totalSec += parseInt(hourMatch[1], 10) * 3600;
  if (minMatch) totalSec += parseInt(minMatch[1], 10) * 60;
  if (secMatch) totalSec += parseInt(secMatch[1], 10);

  return totalSec > 0 ? totalSec : 900;
}

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function VideoPlayer({
  videoUrl,
  posterUrl,
  title = "Lesson Video",
  startSeconds = 0,
  courseSlug,
  lessonSlug,
  duration,
  className = "",
  onPlay,
  onWatchDepth,
  onComplete,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTimestampBanner, setShowTimestampBanner] = useState(startSeconds > 0);
  const trackedMilestonesRef = useRef<Set<number>>(new Set());
  const playbackStartTimeRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const totalDurationSeconds = useMemo(() => parseDurationToSeconds(duration), [duration]);

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

    // Direct MP4 or generic video URL with optional media fragment
    const directSrc = startSeconds > 0 ? `${videoUrl}#t=${Math.floor(startSeconds)}` : videoUrl;
    return {
      type: "direct" as const,
      src: directSrc,
    };
  }, [videoUrl, startSeconds]);

  const triggerWatchDepth = useCallback(
    (depthPercentage: number, currentTimeSec: number, totalDurationSec: number) => {
      if (trackedMilestonesRef.current.has(depthPercentage)) return;
      trackedMilestonesRef.current.add(depthPercentage);

      posthog.capture("video_watch_depth", {
        depth_percentage: depthPercentage,
        current_time: Math.round(currentTimeSec),
        duration: Math.round(totalDurationSec),
        video_title: title,
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
      });

      onWatchDepth?.(depthPercentage);

      if (depthPercentage === 100) {
        onComplete?.();
      }
    },
    [title, courseSlug, lessonSlug, onWatchDepth, onComplete]
  );

  const seekToTime = useCallback(
    (seconds: number) => {
      const sec = Math.max(0, Math.floor(seconds));

      if (videoRef.current) {
        videoRef.current.currentTime = sec;
        videoRef.current.play().catch(() => {});
      }

      if (iframeRef.current?.contentWindow) {
        // YouTube API seek
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: "seekTo",
            args: [sec, true],
          }),
          "*"
        );

        // Vimeo API seek
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            method: "setCurrentTime",
            value: sec,
          }),
          "*"
        );

        // Bunny Stream seek
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "seek",
            time: sec,
          }),
          "*"
        );
      }

      posthog.capture("video_seeked", {
        target_seconds: sec,
        video_title: title,
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
      });
    },
    [title, courseSlug, lessonSlug]
  );

  const handlePlay = () => {
    setIsPlaying(true);
    playbackStartTimeRef.current = Date.now();

    posthog.capture("video_played", {
      video_url: videoUrl,
      video_provider: embedInfo?.type || "unknown",
      title,
      start_seconds: startSeconds,
      is_resumed: startSeconds > 0,
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      duration,
    });

    if (startSeconds > 0) {
      posthog.capture("video_resume_used", {
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
        resume_position_seconds: startSeconds,
        video_title: title,
        source: "timestamp_link",
      });
    }

    onPlay?.();
  };

  // Watch depth tracker for iframe & simulated playback
  useEffect(() => {
    if (!isPlaying) return;

    const milestones = [25, 50, 75, 90, 100];
    const interval = setInterval(() => {
      if (!playbackStartTimeRef.current) return;
      const elapsedSeconds = (Date.now() - playbackStartTimeRef.current) / 1000 + startSeconds;
      const currentProgress = Math.min(100, (elapsedSeconds / totalDurationSeconds) * 100);

      for (const m of milestones) {
        if (currentProgress >= m) {
          triggerWatchDepth(m, elapsedSeconds, totalDurationSeconds);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, startSeconds, totalDurationSeconds, triggerWatchDepth]);

  // YouTube / Vimeo postMessage listener for ended events
  useEffect(() => {
    if (!isPlaying) return;

    const handleWindowMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === "string") {
          const parsed = JSON.parse(event.data);
          // YouTube ended event: info === 0
          if (parsed.event === "onStateChange" && parsed.info === 0) {
            triggerWatchDepth(100, totalDurationSeconds, totalDurationSeconds);
          }
        }
      } catch {
        // non-JSON message
      }
    };

    window.addEventListener("message", handleWindowMessage);
    return () => window.removeEventListener("message", handleWindowMessage);
  }, [isPlaying, totalDurationSeconds, triggerWatchDepth]);

  // Direct video element seeking on load
  const handleDirectVideoReady = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (startSeconds > 0 && Math.abs(video.currentTime - startSeconds) > 1) {
      video.currentTime = startSeconds;
    }
  };

  return (
    <div
      className={`relative w-full aspect-video rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#0A0A0B] border border-[#1E293B]/80 shadow-[0_12px_40px_rgba(0,0,0,0.35)] select-none group ${className}`}
    >
      {/* On-Site Timestamp Starting Pill Overlay */}
      {showTimestampBanner && startSeconds > 0 && (
        <div className="absolute top-3.5 left-3.5 z-30 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-[#EA580C]/40 text-white shadow-lg animate-fade-in transition-all">
          <div className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
          <span className="font-sans text-[12px] font-medium text-white/90">
            Playing from <strong className="text-[#EA580C] font-semibold">{formatTime(startSeconds)}</strong>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              seekToTime(0);
              setShowTimestampBanner(false);
            }}
            className="ml-1 text-[11px] font-sans font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
          >
            Restart from 00:00
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTimestampBanner(false);
            }}
            className="text-white/40 hover:text-white text-[13px] ml-0.5 leading-none transition-colors"
            aria-label="Dismiss timestamp notice"
          >
            ✕
          </button>
        </div>
      )}

      {isPlaying && embedInfo ? (
        embedInfo.type === "direct" ? (
          <video
            ref={videoRef}
            src={embedInfo.src}
            controls
            autoPlay
            poster={posterUrl}
            onLoadedMetadata={handleDirectVideoReady}
            onCanPlay={handleDirectVideoReady}
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              const currentTime = video.currentTime;
              const dur = video.duration || totalDurationSeconds;
              if (dur > 0) {
                const pct = (currentTime / dur) * 100;
                const milestones = [25, 50, 75, 90, 100];
                for (const m of milestones) {
                  if (pct >= m) {
                    triggerWatchDepth(m, currentTime, dur);
                  }
                }
              }
            }}
            onPause={(e) => {
              const video = e.currentTarget;
              const currentTime = video.currentTime;
              const dur = video.duration || totalDurationSeconds;
              posthog.capture("video_paused", {
                current_time: Math.round(currentTime),
                duration: Math.round(dur),
                depth_percentage: Math.round((currentTime / dur) * 100),
                video_title: title,
                course_slug: courseSlug,
                lesson_slug: lessonSlug,
              });
            }}
            onEnded={(e) => {
              const video = e.currentTarget;
              const dur = video.duration || totalDurationSeconds;
              triggerWatchDepth(100, dur, dur);
            }}
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            ref={iframeRef}
            src={embedInfo.src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        )
      ) : (
        <div
          className="relative w-full h-full flex items-center justify-center group cursor-pointer"
          onClick={handlePlay}
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
              <div className="font-serif text-[120px] font-bold text-white/5 select-none">
                N
              </div>
            </div>
          )}

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:via-black/20 transition-all duration-300" />

          {/* Center Play Button */}
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
              {startSeconds > 0
                ? `Resume at ${formatTime(startSeconds)}`
                : "Play Lesson Video"}
            </span>
          </div>

          {/* Progress Simulation Bar with Start Marker */}
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-center justify-between text-white/80 font-sans text-[12px] sm:text-[13px]">
            <div className="flex items-center gap-3 flex-1 mr-4">
              <span className="text-white font-medium">
                {startSeconds > 0
                  ? `${formatTime(startSeconds)} / ${duration || "1:28:00"}`
                  : `00:00 / ${duration || "1:28:00"}`}
              </span>
              <div className="flex-1 h-1 sm:h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F97316] rounded-full"
                  style={{
                    width: `${Math.max(
                      5,
                      startSeconds > 0 ? Math.min(100, (startSeconds / totalDurationSeconds) * 100) : 15
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-white/70">
              <span>1x</span>
              <span className="border border-white/40 px-1 py-0.2 rounded text-[10px] uppercase font-bold">CC</span>
              <button type="button" aria-label="Settings" className="hover:text-white transition-colors">⚙</button>
              <button type="button" aria-label="Fullscreen" className="hover:text-white transition-colors">⛶</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
