import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "text";
  size?: "default" | "md" | "lg" | "sm";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "default",
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  // Base classes according to Button Specs (Height: 44px, Radius: 12px, Font: Inter Medium)
  const baseStyles =
    "inline-flex items-center justify-center font-medium font-sans rounded-[12px] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]/50 select-none cursor-pointer";

  const sizeStyles = {
    sm: "h-[36px] px-3 text-[13px] gap-1.5",
    md: "h-[44px] px-3 text-[14px] gap-2", // 0 12px
    default: "h-[44px] px-4 text-[14px] gap-2", // 0 16px
    lg: "h-[44px] px-4 text-[15px] gap-2", // 0 16px
  }[size];

  const variantStyles = {
    primary: disabled
      ? "bg-[#FED7AA] text-white/80 cursor-not-allowed shadow-none"
      : "bg-[#F97316] text-white hover:bg-[#EA580C] active:bg-[#C2410C] shadow-sm hover:shadow",
    secondary: disabled
      ? "bg-white border border-[#FED7AA]/60 text-[#FED7AA] cursor-not-allowed shadow-none"
      : "bg-white border border-[#FDBA74] text-[#F97316] hover:bg-[#FFF7ED] hover:border-[#FB923C] active:bg-[#FFEDD5] shadow-sm",
    tertiary: disabled
      ? "bg-[#FAFAFC] border border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed shadow-none"
      : "bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:bg-[#F1F5F9] shadow-sm",
    text: disabled
      ? "bg-transparent text-[#FED7AA] cursor-not-allowed p-0 h-auto"
      : "bg-transparent text-[#F97316] hover:text-[#EA580C] active:text-[#C2410C] p-0 h-auto",
  }[variant];

  const paddingReset = variant === "text" ? "!px-0 !h-auto" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${paddingReset} ${className}`}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
}
