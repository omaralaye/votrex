import React from "react";
import { SearchIcon } from "@/components/icons";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingElement?: React.ReactNode;
  showSearchShortcut?: boolean;
}

export function Input({
  leadingIcon,
  trailingElement,
  showSearchShortcut = false,
  className = "",
  placeholder = "Search anything...",
  ...props
}: InputProps) {
  return (
    <div className="relative flex items-center w-full">
      {leadingIcon ? (
        <span className="absolute left-3.5 flex items-center pointer-events-none text-[#64748B]">
          {leadingIcon}
        </span>
      ) : showSearchShortcut ? (
        <span className="absolute left-3.5 flex items-center pointer-events-none text-[#64748B]">
          <SearchIcon size={18} />
        </span>
      ) : null}

      <input
        className={`w-full h-[44px] bg-white border border-[#E2E8F0] rounded-[12px] text-[14px] text-[#0F172A] placeholder-[#94A3B8] font-sans transition-colors duration-150 focus:outline-none focus:border-[#FB923C] focus:ring-2 focus:ring-[#FB923C]/20 shadow-sm ${
          leadingIcon || showSearchShortcut ? "pl-10" : "px-4"
        } ${trailingElement || showSearchShortcut ? "pr-14" : "px-4"} ${className}`}
        placeholder={placeholder}
        {...props}
      />

      {showSearchShortcut && (
        <span className="absolute right-3 flex items-center pointer-events-none">
          <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] rounded-[6px]">
            ⌘ K
          </kbd>
        </span>
      )}

      {trailingElement && !showSearchShortcut && (
        <span className="absolute right-3 flex items-center text-[#64748B]">
          {trailingElement}
        </span>
      )}
    </div>
  );
}
