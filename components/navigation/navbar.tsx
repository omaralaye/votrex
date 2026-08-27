import React from "react";
import { VertexLogo, BellIcon } from "@/components/icons";

export interface NavbarProps {
  activeRoute?: "courses" | "my-learning";
  className?: string;
  onNavigate?: (route: "courses" | "my-learning") => void;
}

export function Navbar({ activeRoute = "courses", className = "", onNavigate }: NavbarProps) {
  return (
    <header className={`w-full ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand & Left Nav */}
        <div className="flex items-center gap-8 sm:gap-12">

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.("courses");
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <VertexLogo size={28} className="transition-transform group-hover:scale-105" />
            <span className="font-sans font-bold text-[20px] tracking-tight text-[#0F172A]">
              Vertex
            </span>
          </a>

          <nav className="flex items-center gap-7 sm:gap-9 text-[14px] font-sans">
            <button
              type="button"
              onClick={() => onNavigate?.("courses")}
              className={`transition-colors py-1 cursor-pointer font-medium ${
                activeRoute === "courses"
                  ? "text-[#0F172A] font-semibold"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Courses
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.("my-learning")}
              className={`transition-colors py-1 cursor-pointer ${
                activeRoute === "my-learning"
                  ? "text-[#0F172A] font-semibold"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              My Learning
            </button>
          </nav>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            aria-label="Notifications"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#334155] hover:text-[#0F172A] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <BellIcon size={20} />
          </button>

          {/* User Profile Avatar with photo matching design */}
          <div
            role="button"
            tabIndex={0}
            aria-label="User profile"
            className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm overflow-hidden cursor-pointer hover:ring-[#F97316]/50 transition-all flex items-center justify-center bg-[#FED7AA]"
          >
            {/* High quality portrait matching the design */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80"
              alt="User profile"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </header>
  );
}


