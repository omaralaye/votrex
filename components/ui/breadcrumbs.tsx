import React from "react";
import { ChevronRightIcon } from "@/components/icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-[13px] font-sans ${className}`}>
      <ol className="flex items-center flex-wrap gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isCurrent;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={isLast ? "font-medium text-[#0F172A]" : "text-[#64748B]"}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="text-[#94A3B8] select-none">
                  <ChevronRightIcon size={14} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
