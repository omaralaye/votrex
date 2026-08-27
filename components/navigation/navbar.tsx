import React from "react";
import { VertexLogo, BellIcon } from "@/components/icons";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

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
        <div className="flex items-center gap-3 sm:gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="text-[14px] font-medium text-[#334155] hover:text-[#0F172A] px-3.5 py-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="text-[14px] font-medium text-white bg-[#0F172A] hover:bg-[#1E293B] px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Sign Up
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <button
              type="button"
              aria-label="Notifications"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#334155] hover:text-[#0F172A] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <BellIcon size={20} />
            </button>
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9",
                  },
                }}
              />
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}


