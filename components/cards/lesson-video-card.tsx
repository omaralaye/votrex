import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PlayIcon, DocumentIcon, FolderIcon, ChevronRightIcon } from "@/components/icons";

export interface LessonVideoCardProps {
  title?: string;
  description?: string;
  courseTitle?: string;
  courseIconIdentifier?: string;
  moduleLabel?: string;
  moduleTitle?: string;
  lessonLabel?: string;
  duration?: string;
  timestamp?: string;
  startSeconds?: number;
  thumbnailUrl?: string;
  href?: string;
  onWatch?: () => void;
  className?: string;
}

function CourseMiniBadge({ iconIdentifier }: { iconIdentifier?: string; courseTitle?: string }) {
  const icon = (iconIdentifier || '').toLowerCase();
  
  if (icon.includes('next')) {
    return (
      <div className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center font-bold text-[11px] select-none shrink-0">
        N
      </div>
    );
  }
  if (icon.includes('react')) {
    return (
      <div className="w-5 h-5 rounded-md bg-[#23272F] text-[#58C4DC] flex items-center justify-center font-bold text-[10px] select-none shrink-0">
        ⚛
      </div>
    );
  }
  if (icon.includes('node')) {
    return (
      <div className="w-5 h-5 rounded-md bg-[#1E293B] text-[#68A063] flex items-center justify-center font-bold text-[9px] select-none shrink-0">
        JS
      </div>
    );
  }
  if (icon.includes('docker')) {
    return (
      <div className="w-5 h-5 rounded-md bg-[#0284C7] text-white flex items-center justify-center font-bold text-[10px] select-none shrink-0">
        🐳
      </div>
    );
  }
  if (icon.includes('typescript') || icon.includes('ts')) {
    return (
      <div className="w-5 h-5 rounded-md bg-[#3178C6] text-white flex items-center justify-center font-bold text-[9px] select-none shrink-0">
        TS
      </div>
    );
  }
  if (icon.includes('js') || icon.includes('javascript')) {
    return (
      <div className="w-5 h-5 rounded-md bg-[#FACC15] text-[#0F172A] flex items-center justify-center font-bold text-[9px] select-none shrink-0">
        JS
      </div>
    );
  }
  if (icon.includes('python')) {
    return (
      <div className="w-5 h-5 rounded-md bg-[#1E293B] text-[#FACC15] flex items-center justify-center font-bold text-[10px] select-none shrink-0">
        PY
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center font-bold text-[10px] select-none shrink-0">
      ✦
    </div>
  );
}

/**
 * High-fidelity Video Thumbnail Graphic matching the design specs
 */
function ThumbnailGraphic({
  iconIdentifier = "",
  title = "",
  thumbnailUrl,
}: {
  iconIdentifier?: string;
  title?: string;
  thumbnailUrl?: string;
}) {
  const icon = (iconIdentifier || "").toLowerCase();
  const lowerTitle = (title || "").toLowerCase();

  // If a real custom image thumbnail exists, render it
  if (thumbnailUrl && !thumbnailUrl.includes("picsum.photos")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
      />
    );
  }

  // 1. Next.js Graphic: Stylized large 'N' with dark gradient and subtle glow
  if (icon.includes("next")) {
    return (
      <div className="absolute inset-0 bg-[#0B0F19] flex items-center justify-center overflow-hidden">
        {/* Subtle ambient light */}
        <div className="absolute w-36 h-36 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <svg viewBox="0 0 180 180" className="w-[45%] h-[45%] select-none opacity-90" fill="none">
          <path
            d="M149.508 157.508L69.8398 54.457H54.457V125.543H67.2427V72.1834L139.733 166.027C143.204 163.421 146.478 160.569 149.508 157.508Z"
            fill="url(#vg_next_grad)"
          />
          <rect fill="url(#vg_next_bar)" height="71.0857" width="12.7857" x="112.757" y="54.457" />
          <defs>
            <linearGradient id="vg_next_grad" x1="109" x2="144.5" y1="116.5" y2="160.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="vg_next_bar" x1="119.143" x2="119.143" y1="54.457" y2="125.543" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0.35" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 2. React Graphic: Dark code editor with syntax colors
  if (icon.includes("react") || lowerTitle.includes("useeffect") || lowerTitle.includes("hook")) {
    return (
      <div className="absolute inset-0 bg-[#0B0F19] p-3.5 flex flex-col justify-center font-mono text-[9px] sm:text-[10px] leading-[1.35] select-none text-left overflow-hidden">
        <div>
          <span className="text-[#C084FC]">const</span> <span className="text-[#F472B6]">[users, setUsers]</span> = <span className="text-[#60A5FA]">useState</span>([]);
        </div>
        <div className="mt-1">
          <span className="text-[#60A5FA]">useEffect</span>(() =&gt; &#123;
        </div>
        <div className="pl-3 text-[#94A3B8]">
          <span className="text-[#38BDF8]">fetch</span>(<span className="text-[#4ADE80]">&apos;/api/users&apos;</span>)
        </div>
        <div className="pl-5 text-[#94A3B8]">
          .<span className="text-[#FBBF24]">then</span>(res =&gt; res.<span className="text-[#60A5FA]">json</span>())
        </div>
        <div className="pl-5 text-[#94A3B8]">
          .<span className="text-[#FBBF24]">then</span>(data =&gt; <span className="text-[#60A5FA]">setUsers</span>(data));
        </div>
        <div>&#125;, []);</div>
      </div>
    );
  }

  // 3. Node.js Graphic: Architecture Diagram (Client -> API Request -> Database)
  if (icon.includes("node") || lowerTitle.includes("rest") || lowerTitle.includes("api")) {
    return (
      <div className="absolute inset-0 bg-[#0B0F19] p-3 flex items-center justify-between px-4 sm:px-6 select-none">
        {/* Client Box */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-sans font-medium text-[#38BDF8]">Client</span>
          <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#38BDF8]/40 shadow-xs" />
        </div>

        {/* Arrow / API */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[8.5px] font-sans text-[#4ADE80] font-medium">API Request</span>
          <svg width="40" height="12" viewBox="0 0 40 12" fill="none" className="text-[#94A3B8]">
            <path d="M0 6H36M36 6L30 2M36 6L30 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Database Box */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-sans font-medium text-[#FB923C]">Database</span>
          <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#FB923C]/40 flex items-center justify-center">
            <div className="w-6 h-4 border border-[#FB923C]/60 rounded-xs" />
          </div>
        </div>
      </div>
    );
  }

  // 4. JavaScript / TypeScript Fetch API code snippet
  return (
    <div className="absolute inset-0 bg-[#0B0F19] p-3.5 flex flex-col justify-center font-mono text-[9px] sm:text-[10px] leading-[1.4] select-none text-left overflow-hidden">
      <div>
        <span className="text-[#C084FC]">const</span> <span className="text-[#F472B6]">data</span> = <span className="text-[#C084FC]">await</span> <span className="text-[#38BDF8]">fetch</span>(<span className="text-[#4ADE80]">&apos;/api/users&apos;</span>)
      </div>
      <div className="pl-3">
        .<span className="text-[#FBBF24]">then</span>(res =&gt; res.<span className="text-[#60A5FA]">json</span>())
      </div>
      <div className="pl-3">
        .<span className="text-[#F87171]">catch</span>(err =&gt; console.<span className="text-[#60A5FA]">error</span>(err))
      </div>
    </div>
  );
}

export function LessonVideoCard({
  title = "Data Fetching in Server Components",
  description = "Learn how to fetch data on the server using async/await and Next.js best practices for better performance.",
  courseTitle = "Next.js for Production",
  courseIconIdentifier = "nextjs",
  moduleTitle = "Data Fetching & Caching",
  lessonLabel = "Lesson 5.1",
  duration = "12:45",
  timestamp = "12:45",
  thumbnailUrl,
  href,
  onWatch,
  className = "",
}: LessonVideoCardProps) {
  const cardContent = (
    <div
      className={`group flex flex-col md:flex-row items-stretch bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-[20px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200 gap-5 sm:gap-6 ${className}`}
    >
      {/* Left Column: Video Thumbnail Preview Box */}
      <div className="relative w-full md:w-[240px] lg:w-[260px] aspect-[16/10] md:aspect-auto shrink-0 bg-[#0B0F19] rounded-xl overflow-hidden flex items-center justify-center border border-black/10 shadow-inner group-hover:border-black/20 transition-colors">
        <ThumbnailGraphic
          iconIdentifier={courseIconIdentifier}
          title={title}
          thumbnailUrl={thumbnailUrl}
        />

        {/* Center Play Button Overlay */}
        <div className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 group-hover:bg-white text-[#0F172A] shadow-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          <PlayIcon size={20} filled className="text-[#0F172A] translate-x-0.5" />
        </div>

        {/* Bottom-right Duration Overlay Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/85 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2 py-0.5 rounded-[6px] border border-white/10 shadow-sm">
          {timestamp || duration}
        </div>
      </div>

      {/* Right Column: Content and Metadata */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Top Row: Course Header + Video Badge */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2 text-[13px] font-sans font-medium text-[#475569]">
              <CourseMiniBadge iconIdentifier={courseIconIdentifier} courseTitle={courseTitle} />
              <span className="truncate max-w-[240px] sm:max-w-[320px]">{courseTitle}</span>
            </div>
            <Badge variant="video">VIDEO</Badge>
          </div>

          {/* Title */}
          <h3 className="font-serif font-semibold text-[18px] sm:text-[19px] leading-[26px] text-[#0F172A] group-hover:text-[#EA580C] transition-colors mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="font-sans text-[13.5px] sm:text-[14px] leading-[21px] text-[#64748B] line-clamp-2 mb-4">
            {description}
          </p>
        </div>

        {/* Bottom Row: Module / Lesson hierarchy & Watch Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F1F5F9] text-sans">
          <div className="flex items-center gap-2 text-[12px] text-[#64748B]">
            <div className="flex items-center gap-1">
              <DocumentIcon size={14} className="text-[#94A3B8]" />
              <span>{lessonLabel}</span>
            </div>
            {moduleTitle && (
              <>
                <span className="text-[#CBD5E1]">•</span>
                <div className="flex items-center gap-1">
                  <FolderIcon size={14} className="text-[#94A3B8]" />
                  <span className="truncate max-w-[200px]">{moduleTitle}</span>
                </div>
              </>
            )}
          </div>

          <div
            onClick={onWatch}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#EA580C] hover:text-[#C2410C] transition-colors cursor-pointer"
          >
            <PlayIcon size={14} filled className="text-[#EA580C]" />
            <span>Watch from {timestamp}</span>
            <ChevronRightIcon size={14} className="text-[#EA580C]" />
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onWatch} className="block no-underline">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
