import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLinkIcon } from "@/components/icons";

export interface LessonTopicCardProps {
  title?: string;
  description?: string;
  moduleLabel?: string;
  onViewLesson?: () => void;
  className?: string;
}

export function LessonTopicCard({
  title = "Data Fetching & Caching",
  description = "Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance.",
  moduleLabel = "Module 5",
  onViewLesson,
  className = "",
}: LessonTopicCardProps) {
  return (
    <div
      className={`flex flex-col justify-between bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div>
        {/* Badge */}
        <div className="mb-3">
          <Badge variant="lesson">LESSON</Badge>
        </div>

        {/* Title */}
        <h3 className="font-sans font-semibold text-[17px] leading-[24px] text-[#0F172A] mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="font-sans text-[14px] leading-[20px] text-[#64748B] mb-6">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] font-sans">
        <div className="text-[12px] text-[#64748B]">
          <span>{moduleLabel}</span>
        </div>

        <button
          onClick={onViewLesson}
          className="inline-flex items-center gap-1 text-[13px] font-medium text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer"
        >
          <span>View lesson</span>
          <ExternalLinkIcon size={14} />
        </button>
      </div>
    </div>
  );
}
