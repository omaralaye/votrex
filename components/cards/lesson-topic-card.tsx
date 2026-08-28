import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLinkIcon, ChevronRightIcon, DocumentIcon } from "@/components/icons";

export interface LessonTopicCardProps {
  title?: string;
  description?: string;
  courseTitle?: string;
  courseIconIdentifier?: string;
  moduleLabel?: string;
  moduleTitle?: string;
  lessonLabel?: string;
  keyPoints?: string[];
  href?: string;
  onViewLesson?: () => void;
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
    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white flex items-center justify-center font-bold text-[10px] select-none shrink-0">
      ✦
    </div>
  );
}

export function LessonTopicCard({
  title = "Data Fetching & Caching",
  description = "Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance.",
  courseTitle = "Next.js for Production",
  courseIconIdentifier = "nextjs",
  moduleLabel = "Module 5",
  keyPoints = ["Fetching strategies", "Caching techniques", "Revalidation methods"],
  href,
  onViewLesson,
  className = "",
}: LessonTopicCardProps) {
  const cardContent = (
    <div
      className={`group flex flex-col md:flex-row items-stretch bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-[20px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200 gap-5 sm:gap-6 ${className}`}
    >
      {/* Left Column: Key Points Summary Box */}
      <div className="relative w-full md:w-[240px] lg:w-[260px] aspect-[16/10] md:aspect-auto shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
        <div>
          {/* Top Left Icon */}
          <div className="mb-2 text-[#64748B]">
            <DocumentIcon size={18} className="text-[#94A3B8]" />
          </div>

          {/* Bullet List of Key Points */}
          <ul className="space-y-1.5 text-[12px] font-sans text-[#475569]">
            {keyPoints.slice(0, 3).map((pt, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#94A3B8]">•</span>
                <span className="line-clamp-1">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Right Checkmark */}
        <div className="flex justify-end pt-2">
          <div className="w-5 h-5 rounded-full bg-[#475569] text-white flex items-center justify-center shadow-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Column: Content and Metadata */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Top Row: Course Header + Lesson Badge */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2 text-[13px] font-sans font-medium text-[#475569]">
              <CourseMiniBadge iconIdentifier={courseIconIdentifier} courseTitle={courseTitle} />
              <span className="truncate max-w-[240px] sm:max-w-[320px]">{courseTitle}</span>
            </div>
            <Badge variant="lesson">LESSON</Badge>
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

        {/* Bottom Row: Module Label & View Lesson Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F1F5F9] text-sans">
          <div className="text-[12px] text-[#64748B]">
            <span>{moduleLabel}</span>
          </div>

          <div
            onClick={onViewLesson}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#EA580C] hover:text-[#C2410C] transition-colors cursor-pointer"
          >
            <span>View lesson</span>
            <ExternalLinkIcon size={14} className="text-[#EA580C]" />
            <ChevronRightIcon size={14} className="text-[#EA580C]" />
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
