import { VideoProviderInfo } from './types';

/**
 * Sanitizes any raw string to be a valid Sanity Document ID.
 * Sanity document IDs must only contain characters: [a-zA-Z0-9_.-]
 */
export function sanitizeSanityId(rawId: string): string {
  if (!rawId) return 'video-unknown';
  // Replace any character not in [a-zA-Z0-9_-] with hyphen for clean IDs
  let sanitized = rawId
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    // Collapse consecutive hyphens
    .replace(/-+/g, '-')
    // Trim hyphens from ends
    .replace(/^-+|-+$/g, '');

  if (!sanitized) {
    sanitized = 'video-' + Math.random().toString(36).substring(2, 9);
  }
  return sanitized;
}

/**
 * Extracts YouTube Video ID from standard YouTube URL formats.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Extracts Vimeo Video ID from Vimeo URLs.
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Extracts Bunny Stream Video / Library ID from Bunny URLs.
 */
export function extractBunnyInfo(url: string): { libraryId?: string; videoId?: string; streamId?: string } | null {
  if (!url) return null;
  if (!url.includes('bunny') && !url.includes('mediadelivery.net')) {
    return null;
  }
  // Patterns like: https://iframe.mediadelivery.net/embed/12345/67890-abcdef
  // or https://video.bunnycdn.com/play/12345/67890-abcdef
  const embedMatch = url.match(/mediadelivery\.net\/embed\/([^/]+)\/([^/?]+)/);
  if (embedMatch) {
    return {
      libraryId: embedMatch[1],
      videoId: embedMatch[2],
      streamId: `${embedMatch[1]}-${embedMatch[2]}`,
    };
  }

  const playMatch = url.match(/bunnycdn\.com\/play\/([^/]+)\/([^/?]+)/);
  if (playMatch) {
    return {
      libraryId: playMatch[1],
      videoId: playMatch[2],
      streamId: `${playMatch[1]}-${playMatch[2]}`,
    };
  }

  // Fallback for general bunny URLs
  const genericMatch = url.match(/([a-zA-Z0-9_-]{8,})/);
  return {
    videoId: genericMatch ? genericMatch[1] : 'bunny-video',
    streamId: genericMatch ? genericMatch[1] : 'bunny-video',
  };
}

/**
 * Parses any supported video URL into its normalized provider metadata.
 */
export function parseVideoUrl(url: string): VideoProviderInfo {
  const trimmed = (url || '').trim();

  // 1. YouTube
  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    return {
      provider: 'youtube',
      rawUrl: trimmed,
      videoId: ytId,
      embedUrl: `https://www.youtube.com/embed/${ytId}`,
      canonicalUrl: `https://www.youtube.com/watch?v=${ytId}`,
    };
  }

  // 2. Vimeo
  const vimeoId = extractVimeoId(trimmed);
  if (vimeoId) {
    return {
      provider: 'vimeo',
      rawUrl: trimmed,
      videoId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      canonicalUrl: `https://vimeo.com/${vimeoId}`,
    };
  }

  // 3. Bunny
  const bunnyInfo = extractBunnyInfo(trimmed);
  if (bunnyInfo) {
    const id = bunnyInfo.streamId || bunnyInfo.videoId || 'bunny-video';
    return {
      provider: 'bunny',
      rawUrl: trimmed,
      videoId: id,
      embedUrl: trimmed,
      canonicalUrl: trimmed,
    };
  }

  // 4. Direct / MP4 / Generic URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // Generate clean identifier from URL pathname
    try {
      const parsed = new URL(trimmed);
      const cleanPath = parsed.pathname.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9_-]/g, '-');
      const videoId = cleanPath || sanitizeSanityId(parsed.hostname);
      return {
        provider: 'direct',
        rawUrl: trimmed,
        videoId,
        embedUrl: trimmed,
        canonicalUrl: trimmed,
      };
    } catch {
      // Fallback
    }
  }

  const fallbackId = sanitizeSanityId(trimmed);
  return {
    provider: 'unknown',
    rawUrl: trimmed,
    videoId: fallbackId,
    canonicalUrl: trimmed,
  };
}

/**
 * Generates a deterministic, Sanity-compliant document ID for a given video URL or explicit ID.
 * Examples:
 * - https://www.youtube.com/watch?v=gSSsZReIFRk -> "video-yt-gSSsZReIFRk"
 * - https://vimeo.com/76979871 -> "video-vimeo-76979871"
 * - https://iframe.mediadelivery.net/embed/123/abc -> "video-bunny-123-abc"
 */
export function generateDeterministicVideoId(url: string, explicitId?: string): string {
  if (explicitId && explicitId.trim()) {
    const sanitized = sanitizeSanityId(explicitId.trim());
    return sanitized.startsWith('video-') ? sanitized : `video-${sanitized}`;
  }

  const info = parseVideoUrl(url);
  switch (info.provider) {
    case 'youtube':
      return `video-yt-${sanitizeSanityId(info.videoId)}`;
    case 'vimeo':
      return `video-vimeo-${sanitizeSanityId(info.videoId)}`;
    case 'bunny':
      return `video-bunny-${sanitizeSanityId(info.videoId)}`;
    case 'direct':
    case 'unknown':
    default: {
      const sanitized = sanitizeSanityId(info.videoId);
      return `video-${sanitized}`;
    }
  }
}
