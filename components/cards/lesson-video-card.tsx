import React from "react";
import { Badge } from "@/components/ui/badge";
import { PlayIcon } from "@/components/icons";

export interface LessonVideoCardProps {
  title?: string;
  description?: string;
  lessonLabel?: string;
  duration?: string;
  timestamp?: string;
  onWatch?: () => void;
  className?: string;
}

export function LessonVideoCard({
  title = "Data Fetching in Server Components",
  description = "Learn how to fetch data on the server using async/await and Next.js best practices.",
  lessonLabel = "Lesson 5.1",
  duration = "12:45",
  timestamp = "12:45",
  onWatch,
  className = "",
}: LessonVideoCardProps) {
  return (
    <div
      className={`flex flex-col justify-between bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div>
        {/* Badge */}
        <div className="mb-3">
          <Badge variant="video">VIDEO</Badge>
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
          <span>{lessonLabel}</span>
          <span className="mx-1.5">•</span>
          <span>{duration}</span>
        </div>

        <button
          onClick={onWatch}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer"
        >
          <PlayIcon size={16} filled className="text-[#F97316]" />
          <span>Watch from {timestamp}</span>
        </button>
      </div>
    </div>
  );
}
