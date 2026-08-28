"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { PlayIcon } from "@/components/icons";

interface VideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  startSeconds?: number;
  className?: string;
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

export function VideoPlayer({
  videoUrl,
  posterUrl,
  title = "Lesson Video",
  startSeconds = 0,
  className = "",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

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

  // If user hasn't clicked play yet, or if we want to show the initial iframe
  return (
    <div
      className={`relative w-full aspect-video rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#0A0A0B] border border-[#1E293B]/80 shadow-[0_12px_40px_rgba(0,0,0,0.35)] select-none ${className}`}
    >
      {isPlaying && embedInfo ? (
        embedInfo.type === "direct" ? (
          <video
            src={embedInfo.src}
            controls
            autoPlay
            poster={posterUrl}
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={embedInfo.src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        )
      ) : (
        <div className="relative w-full h-full flex items-center justify-center group cursor-pointer" onClick={() => setIsPlaying(true)}>
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
              Play Lesson Video
            </span>
          </div>

          {/* Progress Simulation Bar in Screenshot */}
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-center justify-between text-white/80 font-sans text-[12px] sm:text-[13px]">
            <div className="flex items-center gap-3 flex-1 mr-4">
              <span className="text-white font-medium">12:45 / 1:28:00</span>
              <div className="flex-1 h-1 sm:h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#F97316] rounded-full w-[25%]" />
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
