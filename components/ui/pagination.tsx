import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage = 1,
  totalPages = 8,
  onPageChange,
  className = "",
}: PaginationProps) {
  // Static representation or interactive pages: 1, 2, 3, ..., 8
  const pages = [1, 2, 3, "...", totalPages];

  return (
    <nav aria-label="Pagination Navigation" className={`inline-flex items-center gap-1.5 font-sans ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex items-center justify-center w-8 h-8 rounded-[8px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#64748B] transition-colors cursor-pointer"
      >
        <ChevronLeftIcon size={16} />
      </button>

      {/* Page Numbers */}
      {pages.map((page, idx) => {
        if (page === "...") {
          return (
            <span key={`dots-${idx}`} className="flex items-center justify-center w-8 h-8 text-[13px] text-[#64748B] select-none">
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange?.(Number(page))}
            aria-current={isCurrent ? "page" : undefined}
            className={`flex items-center justify-center w-8 h-8 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer ${
              isCurrent
                ? "bg-[#F97316] text-white shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex items-center justify-center w-8 h-8 rounded-[8px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#64748B] transition-colors cursor-pointer"
      >
        <ChevronRightIcon size={16} />
      </button>
    </nav>
  );
}
