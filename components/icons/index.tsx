import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  filled?: boolean;
}

// 06 ICONS - Outline & Filled

// 1. Bell Icon
export function BellIcon({ size = 24, className = "", filled = false, ...props }: IconProps) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// 2. Search Icon
export function SearchIcon({ size = 24, className = "", filled = false, ...props }: IconProps) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M11 2a9 9 0 1 0 5.618 16.032l4.175 4.175a1 1 0 0 0 1.414-1.414l-4.175-4.175A9 9 0 0 0 11 2zm-7 9a7 7 0 1 1 14 0 7 7 0 0 1-14 0z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// 3. Play Icon (Outline & Filled)
export function PlayIcon({ size = 24, className = "", filled = false, ...props }: IconProps) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="#FFFFFF" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Play Triangle Icon (simple)
export function PlayTriangleIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

// 4. Document / Note Icon
export function DocumentIcon({ size = 24, className = "", filled = false, ...props }: IconProps) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

// 5. Bookmark Icon
export function BookmarkIcon({ size = 24, className = "", filled = false, ...props }: IconProps) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// 6. Bar Chart / Level Icon
export function StatsIcon({ size = 24, className = "", filled = false, ...props }: IconProps) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <rect x="4" y="14" width="4" height="7" rx="1" />
        <rect x="10" y="9" width="4" height="12" rx="1" />
        <rect x="16" y="4" width="4" height="17" rx="1" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

// 7. Clock Icon
export function ClockIcon({ size = 24, className = "", filled = false, ...props }: IconProps) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 11h-4v-2h3V7h2v6z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// 8. User / Profile Icon
export function UserIcon({ size = 24, className = "", filled = false, ...props }: IconProps) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// 9. Chevron Right Icon
export function ChevronRightIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// Chevron Left Icon
export function ChevronLeftIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

// Chevron Down Icon
export function ChevronDownIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// External Link Icon
export function ExternalLinkIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// Lock Icon
export function LockIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Check Circle / Completed Icon
export function CheckCircleIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

// In Progress Spinner Icon
export function InProgressIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// Modules / Layers Icon
export function ModulesIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

// 14 PRINCIPLES ICONS

// Clarity First (Eye)
export function EyeIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// Consistency (4 Squares / Grid)
export function GridIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

// Focus & Calm (Target / Compass / Bullseye)
export function TargetIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

// Accessible (Person in circle)
export function AccessibilityIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="5" r="2" />
      <path d="m9 20 3-6 3 6" />
      <path d="m6 8 6 2 6-2" />
      <path d="M12 10v4" />
    </svg>
  );
}

// Star Icon
export function StarIcon({ size = 20, className = "", filled = false, ...props }: IconProps) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Arrow Right Icon
export function ArrowRightIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// Next.js Logo Mark
export function NextjsIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-black text-white flex items-center justify-center font-sans font-bold select-none shadow-sm ${className}`}
    >
      <svg width="60%" height="60%" viewBox="0 0 180 180" fill="none">
        <mask height="180" id="mask0_next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: "alpha" }}>
          <circle cx="90" cy="90" r="90" fill="black" />
        </mask>
        <g mask="url(#mask0_next)">
          <path
            d="M149.508 157.508L69.8398 54.457H54.457V125.543H67.2427V72.1834L139.733 166.027C143.204 163.421 146.478 160.569 149.508 157.508Z"
            fill="url(#paint0_linear_next)"
          />
          <rect fill="url(#paint1_linear_next)" height="71.0857" width="12.7857" x="112.757" y="54.457" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_next" x1="109" x2="144.5" y1="116.5" y2="160.5">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_next" x1="119.143" x2="119.143" y1="54.457" y2="125.543">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Docker Logo Mark
export function DockerIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl flex items-center justify-center select-none ${className}`}
    >
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none">
        {/* Containers */}
        <rect x="22" y="14" width="5.5" height="5" rx="0.5" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
        <rect x="29" y="14" width="5.5" height="5" rx="0.5" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
        <rect x="15" y="20.5" width="5.5" height="5" rx="0.5" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
        <rect x="22" y="20.5" width="5.5" height="5" rx="0.5" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
        <rect x="29" y="20.5" width="5.5" height="5" rx="0.5" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
        <rect x="36" y="20.5" width="5.5" height="5" rx="0.5" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
        <rect x="8" y="27" width="5.5" height="5" rx="0.5" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
        <rect x="15" y="27" width="5.5" height="5" rx="0.5" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
        <rect x="22" y="27" width="5.5" height="5" rx="0.5" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
        <rect x="29" y="27" width="5.5" height="5" rx="0.5" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
        <rect x="36" y="27" width="5.5" height="5" rx="0.5" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />

        {/* Whale Body */}
        <path
          d="M58 29.5C56.8 29 54.4 28.5 52 29.8C50.5 30.6 49.8 32 49.2 33.2C46.5 32.5 43.5 32.2 40 32.2C27.5 32.2 16.5 37.5 11 43C9 45 7 47.8 7 50.5C7 51.8 8.5 53 10.5 53C25 53 38.5 52.2 49.5 45.5C54.2 42.5 57.5 37.5 58 32V29.5Z"
          fill="#38BDF8"
          stroke="#0284C7"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Eye */}
        <circle cx="16" cy="41" r="1.8" fill="#0F172A" />
        {/* Spout */}
        <path d="M57.5 29.5C60.2 26.5 61.5 22.5 60 20C58 21.5 56 24 54.8 26.8" stroke="#0284C7" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// TypeScript Logo Mark
export function TypeScriptIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-[#3178C6] text-white flex items-center justify-center font-sans font-bold select-none shadow-sm ${className}`}
    >
      <span className="text-[20px] font-bold tracking-tight text-white pl-0.5 pt-0.5">TS</span>
    </div>
  );
}

// React Logo Mark
export function ReactIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-[#23272F] text-[#58C4DC] flex items-center justify-center select-none shadow-sm ${className}`}
    >
      <svg width="65%" height="65%" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#58C4DC" />
        <g stroke="#58C4DC" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    </div>
  );
}

// Node.js Logo Mark
export function NodejsIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-[#1E293B] text-[#5FA04E] flex items-center justify-center font-sans font-bold select-none shadow-sm ${className}`}
    >
      <span className="text-[19px] font-bold text-[#68A063]">node</span>
    </div>
  );
}

// Cloud / Infrastructure Logo Mark
export function CloudIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center select-none shadow-sm ${className}`}
    >
      <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    </div>
  );
}

// Database Logo Mark
export function DatabaseIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-[#336791] text-white flex items-center justify-center select-none shadow-sm ${className}`}
    >
      <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    </div>
  );
}

// AI / LLM Sparkle Logo Mark
export function AIIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#6366F1] to-[#4F46E5] text-white flex items-center justify-center select-none shadow-sm ${className}`}
    >
      <svg width="55%" height="55%" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
        <path d="M19 17L17.8 19.8L15 21L17.8 22.2L19 25L20.2 22.2L23 21L20.2 19.8L19 17Z" opacity="0.8" />
        <path d="M5 2L4.2 3.8L2.4 4.6L4.2 5.4L5 7.2L5.8 5.4L7.6 4.6L5.8 3.8L5 2Z" opacity="0.7" />
      </svg>
    </div>
  );
}

// Python Logo Mark
export function PythonIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-[#1E293B] flex items-center justify-center select-none shadow-sm ${className}`}
    >
      <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none">
        <path d="M11.9 2C8.3 2 8.5 3.5 8.5 3.5L8.5 5.1H12.1V5.6H5.2C2.8 5.6 2.8 8.1 2.8 8.1L2.8 10C2.8 11.8 4.3 11.8 4.3 11.8H5.9V10.2C5.9 8.6 7.3 8.6 7.3 8.6H12C13.6 8.6 13.6 7.2 13.6 7.2V3.7C13.6 2.1 11.9 2 11.9 2ZM10.4 3.3C10.8 3.3 11.1 3.6 11.1 4C11.1 4.4 10.8 4.7 10.4 4.7C10 4.7 9.7 4.4 9.7 4C9.7 3.6 10 3.3 10.4 3.3Z" fill="#38BDF8" />
        <path d="M12.1 22C15.7 22 15.5 20.5 15.5 20.5L15.5 18.9H11.9V18.4H18.8C21.2 18.4 21.2 15.9 21.2 15.9L21.2 14C21.2 12.2 19.7 12.2 19.7 12.2H18.1V13.8C18.1 15.4 16.7 15.4 16.7 15.4H12C10.4 15.4 10.4 16.8 10.4 16.8V20.3C10.4 21.9 12.1 22 12.1 22ZM13.6 20.7C13.2 20.7 12.9 20.4 12.9 20C12.9 19.6 13.2 19.3 13.6 19.3C14 19.3 14.3 19.6 14.3 20C14.3 20.4 14 20.7 13.6 20.7Z" fill="#FACC15" />
      </svg>
    </div>
  );
}

// Rust Logo Mark
export function RustIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-[#B7410E] text-white flex items-center justify-center font-sans font-bold select-none shadow-sm ${className}`}
    >
      <span className="text-[19px] font-bold tracking-tight text-white pl-0.5">🦀</span>
    </div>
  );
}

// Security / Shield Logo Mark
export function SecurityIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-gradient-to-br from-[#0F766E] to-[#115E59] text-white flex items-center justify-center select-none shadow-sm ${className}`}
    >
      <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </div>
  );
}

// Custom / General Course Logo Mark
export function CustomCourseIcon({ size = 48, className = "" }: { size?: number | string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center select-none shadow-sm ${className}`}
    >
      <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    </div>
  );
}

// Chevron Up Icon
export function ChevronUpIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

// Users Group Icon (2 people outline)
export function UsersGroupIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// Outline Layers Icon (App Router Foundations)
export function LayersOutlineIcon({ size = 40, className = "text-[#D8653F]", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} {...props}>
      {/* Top Layer */}
      <path
        d="M24 8L6 18L24 28L42 18L24 8Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Middle Layer */}
      <path
        d="M6 24L24 34L42 24"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom Layer */}
      <path
        d="M6 30L24 40L42 30"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Outline Database Cylinder Icon (Data Fetching & Caching)
export function DatabaseOutlineIcon({ size = 40, className = "text-[#D8653F]", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} {...props}>
      {/* Top Oval */}
      <ellipse cx="24" cy="14" rx="16" ry="6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Middle Tier */}
      <path d="M8 14V26C8 29.3 15.2 32 24 32C32.8 32 40 29.3 40 26V14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom Tier */}
      <path d="M8 26V36C8 39.3 15.2 42 24 42C32.8 42 40 39.3 40 36V26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Outline Speedometer / Gauge Icon (Performance Optimization)
export function GaugeOutlineIcon({ size = 40, className = "text-[#D8653F]", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} {...props}>
      {/* Gauge Outer Arc */}
      <path
        d="M9.5 35.5C6.1 31.4 4 26 4 20C4 8.95 12.95 0 24 0C35.05 0 44 8.95 44 20C44 26 41.9 31.4 38.5 35.5"
        transform="translate(0, 4)"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Tick Marks */}
      <line x1="12" y1="24" x2="15" y2="24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="24" y1="12" x2="24" y2="15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="36" y1="24" x2="33" y2="24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="15.5" y1="15.5" x2="17.6" y2="17.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="32.5" y1="15.5" x2="30.4" y2="17.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Needle */}
      <circle cx="24" cy="30" r="3" fill="currentColor" />
      <line x1="24" y1="30" x2="32" y2="18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Outline Cloud Icon (Deployment & Scaling)
export function CloudOutlineIcon({ size = 40, className = "text-[#D8653F]", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} {...props}>
      <path
        d="M13 36H35C39.42 36 43 32.42 43 28C43 23.82 39.81 20.39 35.73 20.04C34.72 13.19 28.84 8 21.6 8C13.54 8 7 14.54 7 22.6C7 23.44 7.07 24.26 7.21 25.06C4.24 26.33 2.2 29.35 2.2 32.8C2.2 37.33 5.87 41 10.4 41"
        transform="translate(1, -2)"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// High-fidelity Next.js Hero Cover Card Graphic
export function NextjsHeroCover({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full aspect-square rounded-[28px] sm:rounded-[32px] bg-black border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.22)] flex items-center justify-center overflow-hidden select-none group ${className}`}
    >
      {/* Subtle radial ambient highlight behind the logo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

      {/* Stylized high-contrast Next.js "N" logo */}
      <svg
        viewBox="0 0 180 180"
        className="w-[62%] h-[62%] transition-transform duration-500 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          {/* Left Vertical Bar */}
          <rect x="36" y="32" width="19" height="116" rx="2" fill="white" />

          {/* Right Vertical Bar with top highlight */}
          <rect x="125" y="32" width="19" height="116" rx="2" fill="url(#paint_right_bar)" />

          {/* Diagonal Slash with chrome/metallic gradient slice */}
          <path
            d="M37 34L142 147H123L37 54V34Z"
            fill="url(#paint_diagonal_slash)"
          />

          {/* Diagonal Metallic Reflection Slicing Line */}
          <line
            x1="98"
            y1="100"
            x2="148"
            y2="152"
            stroke="url(#paint_reflection_slit)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
        <defs>
          <linearGradient id="paint_right_bar" x1="134.5" y1="32" x2="134.5" y2="148" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="0.75" stopColor="white" stopOpacity="0.85" />
            <stop offset="1" stopColor="white" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="paint_diagonal_slash" x1="45" y1="42" x2="135" y2="145" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="0.45" stopColor="#E2E8F0" />
            <stop offset="0.75" stopColor="#94A3B8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#475569" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="paint_reflection_slit" x1="100" y1="102" x2="148" y2="152" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#CBD5E1" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Vertex Brand Logo Mark
export function VertexLogo({ size = 28, className = "" }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Stylized Vertex V mark in primary orange */}
      <path d="M4 6L16 26L28 6H21.5L16 17.5L10.5 6H4Z" fill="#F97316" />
      <path d="M10.5 6L16 17.5L21.5 6H17.5L16 9.5L14.5 6H10.5Z" fill="#FB923C" />
      <path d="M13 6L16 12L19 6H16.8L16 7.6L15.2 6H13Z" fill="#FDBA74" />
    </svg>
  );
}

// Folder Icon
export function FolderIcon({ size = 24, className = "", filled = false, ...props }: IconProps) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}




