import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "video" | "lesson" | "popular" | "neutral";
  children: React.ReactNode;
}

export function Badge({
  variant = "video",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-sans text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-[6px]";

  const variantStyles = {
    video: "bg-[#FFEEE5] text-[#F97316]",
    lesson: "bg-[#EFF6FF] text-[#2563EB]",
    popular: "bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]/60",
    neutral: "bg-[#F1F5F9] text-[#64748B]",
  }[variant];

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </span>
  );
}
