import React from "react";
import { StatsIcon, ClockIcon, ModulesIcon } from "@/components/icons";

export interface CourseCardProps {
  title?: string;
  description?: string;
  level?: string;
  duration?: string;
  modulesCount?: number | string;
  icon?: React.ReactNode;
  className?: string;
}

export function CourseCard({
  title = "Next.js for Production",
  description = "Build scalable, high-performance web applications with Next.js.",
  level = "Intermediate",
  duration = "18h 24m",
  modulesCount = "12 modules",
  icon,
  className = "",
}: CourseCardProps) {
  return (
    <div
      className={`flex flex-col justify-between bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div>
        {/* Course Logo / Icon */}
        <div className="w-10 h-10 rounded-[10px] bg-black flex items-center justify-center text-white font-bold text-lg mb-4 shadow-sm">
          {icon || <span>N</span>}
        </div>

        {/* Title */}
        <h3 className="font-sans font-semibold text-[18px] leading-[26px] text-[#0F172A] mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="font-sans text-[14px] leading-[20px] text-[#64748B] mb-6">
          {description}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center flex-wrap gap-4 pt-4 border-t border-[#F1F5F9] text-[12px] text-[#64748B] font-sans">
        <div className="flex items-center gap-1.5">
          <StatsIcon size={15} className="text-[#94A3B8]" />
          <span>{level}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon size={15} className="text-[#94A3B8]" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ModulesIcon size={15} className="text-[#94A3B8]" />
          <span>{typeof modulesCount === "number" ? `${modulesCount} modules` : modulesCount}</span>
        </div>
      </div>
    </div>
  );
}
