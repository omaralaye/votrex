import React from "react";
import { EyeIcon, GridIcon, TargetIcon, AccessibilityIcon } from "@/components/icons";

export interface Principle {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const vertexPrinciples: Principle[] = [
  {
    icon: <EyeIcon size={24} className="text-[#0F172A]" />,
    title: "Clarity First",
    description: "Every element should communicate clearly.",
  },
  {
    icon: <GridIcon size={24} className="text-[#0F172A]" />,
    title: "Consistency",
    description: "Use components and patterns consistently across the platform.",
  },
  {
    icon: <TargetIcon size={24} className="text-[#0F172A]" />,
    title: "Focus & Calm",
    description: "Remove noise and help learners focus on what matters.",
  },
  {
    icon: <AccessibilityIcon size={24} className="text-[#0F172A]" />,
    title: "Accessible",
    description: "Design with accessibility and inclusivity in mind.",
  },
];

export function PrinciplesGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ${className}`}>
      {vertexPrinciples.map((principle, index) => (
        <div key={index} className="flex items-start gap-3.5">
          <div className="shrink-0 mt-0.5">{principle.icon}</div>
          <div>
            <h4 className="font-sans font-semibold text-[14px] leading-[20px] text-[#0F172A]">
              {principle.title}
            </h4>
            <p className="font-sans text-[12px] leading-[18px] text-[#64748B] mt-0.5">
              {principle.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
