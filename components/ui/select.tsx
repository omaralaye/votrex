import React from "react";
import { ChevronDownIcon } from "@/components/icons";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  placeholder?: string;
}

export function Select({
  options = [],
  placeholder,
  className = "",
  defaultValue,
  value,
  onChange,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="relative flex items-center w-full">
      <select
        className={`w-full h-[44px] bg-white border border-[#E2E8F0] rounded-[12px] px-4 pr-10 text-[14px] text-[#0F172A] font-medium font-sans appearance-none transition-colors duration-150 focus:outline-none focus:border-[#FB923C] focus:ring-2 focus:ring-[#FB923C]/20 shadow-sm cursor-pointer ${className}`}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <span className="absolute right-3.5 flex items-center pointer-events-none text-[#64748B]">
        <ChevronDownIcon size={18} />
      </span>
    </div>
  );
}
