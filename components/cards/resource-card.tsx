import React from "react";
import { DocumentIcon, ExternalLinkIcon } from "@/components/icons";

export interface ResourceCardProps {
  title?: string;
  description?: string;
  fileFormat?: string;
  fileSize?: string;
  href?: string;
  onOpen?: () => void;
  className?: string;
}

export function ResourceCard({
  title = "Caching and Revalidation Guide",
  description = "Deep dive into Next.js caching strategies.",
  fileFormat = "PDF",
  fileSize = "1.2 MB",
  href = "#",
  onOpen,
  className = "",
}: ResourceCardProps) {
  return (
    <div
      className={`flex flex-col justify-between bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div>
        {/* Resource Icon */}
        <div className="text-[#0F172A] mb-3">
          <DocumentIcon size={24} />
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
          <span>{fileFormat}</span>
          <span className="mx-1.5">•</span>
          <span>{fileSize}</span>
        </div>

        <a
          href={href}
          onClick={onOpen}
          className="text-[#F97316] hover:text-[#EA580C] transition-colors"
          aria-label={`Open ${title}`}
        >
          <ExternalLinkIcon size={16} />
        </a>
      </div>
    </div>
  );
}
