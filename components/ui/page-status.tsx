import React from "react";
import Link from "next/link";
import { VertexLogo } from "@/components/icons";

/**
 * Minimal header for a route boundary. It carries no Clerk or data dependency,
 * so it still renders when the boundary is catching a failure in those. The
 * logo links home, which is the escape hatch a stuck learner reaches for.
 */
export function BoundaryHeader() {
  return (
    <div className="relative z-20 w-full border-b border-[#EBE8E3]/80 bg-[#FAF9F6]/90 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <VertexLogo size={28} className="transition-transform group-hover:scale-105" />
          <span className="font-sans font-bold text-[20px] tracking-tight text-[#0F172A]">Vertex</span>
        </Link>
        <Link
          href="/courses"
          className="text-[14px] font-sans font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          Courses
        </Link>
      </div>
    </div>
  );
}

/**
 * Full-height page shell shared by every route boundary state.
 */
export function BoundaryShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F6] text-[#0F172A] flex flex-col">
      <BoundaryHeader />
      <main className="flex-1 flex items-center justify-center px-6 py-20">{children}</main>
    </div>
  );
}

export interface PageStatusProps {
  title: string;
  message: string;
  children?: React.ReactNode;
}

/**
 * Message state (error or missing page) with an optional action row.
 */
export function PageStatus({ title, message, children }: PageStatusProps) {
  return (
    <BoundaryShell>
      <div className="w-full max-w-[440px] text-center flex flex-col items-center gap-5">
        <h1 className="font-serif text-[28px] sm:text-[32px] font-bold leading-tight text-[#0F172A]">
          {title}
        </h1>
        <p className="font-sans text-[15px] leading-relaxed text-[#475569]">{message}</p>
        {children ? <div className="mt-1 flex flex-wrap items-center justify-center gap-3">{children}</div> : null}
      </div>
    </BoundaryShell>
  );
}
