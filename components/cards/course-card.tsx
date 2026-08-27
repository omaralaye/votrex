import React from "react";
import { StatsIcon, ClockIcon, DocumentIcon } from "@/components/icons";

export interface CourseCardProps {
  title: string;
  description: string;
  level: string;
  duration: string;
  modulesCount: number | string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CourseCard({
  title = "Next.js for Production",
  description = "Build scalable, high-performance web applications with Next.js.",
  level = "Intermediate",
  duration = "18h 24m",
  modulesCount = "12 modules",
  icon,
  className = "",
  onClick,
}: CourseCardProps) {
  const formattedModules = typeof modulesCount === "number" ? `${modulesCount} modules` : modulesCount;

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col justify-between bg-white border border-[#E2E8F0] rounded-[20px] p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-200 cursor-pointer ${className}`}
    >
      <div>
        {/* Course Logo / Icon */}
        <div className="mb-6 inline-block transition-transform duration-200 group-hover:scale-105">
          {icon}
        </div>

        {/* Title */}
        <h3 className="font-serif font-semibold text-[20px] leading-[28px] text-[#0F172A] mb-3 group-hover:text-[#F97316] transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="font-sans text-[14px] leading-[22px] text-[#64748B] mb-8">
          {description}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] text-[12px] text-[#64748B] font-sans">
        <div className="flex items-center gap-1.5">
          <StatsIcon size={14} className="text-[#94A3B8]" />
          <span>{level}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon size={14} className="text-[#94A3B8]" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DocumentIcon size={14} className="text-[#94A3B8]" />
          <span>{formattedModules}</span>
        </div>
      </div>
    </div>
  );
}

