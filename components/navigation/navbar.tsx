import React from "react";
import { VertexLogo, BellIcon, UserIcon } from "@/components/icons";

export interface NavbarProps {
  activeRoute?: "courses" | "my-learning";
  className?: string;
}

export function Navbar({ activeRoute = "courses", className = "" }: NavbarProps) {
  return (
    <header className={`w-full bg-white border-b border-[#E2E8F0] ${className}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand & Left Nav */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <VertexLogo size={28} />
            <span className="font-sans font-bold text-[19px] tracking-tight text-[#0F172A]">
              Vertex
            </span>
          </div>

          <nav className="flex items-center gap-8 text-[14px] font-sans font-medium">
            <a
              href="#courses"
              className={`transition-colors py-1 ${
                activeRoute === "courses"
                  ? "text-[#F97316] font-semibold"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Courses
            </a>
            <a
              href="#my-learning"
              className={`transition-colors py-1 ${
                activeRoute === "my-learning"
                  ? "text-[#F97316] font-semibold"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              My Learning
            </a>
          </nav>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <BellIcon size={20} />
          </button>

          <div
            role="img"
            aria-label="User profile"
            className="w-9 h-9 rounded-full bg-[#FFEEE5] text-[#F97316] flex items-center justify-center font-medium text-[13px] border border-[#FED7AA]/60 cursor-pointer"
          >
            <UserIcon size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
