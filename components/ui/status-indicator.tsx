import React from "react";
import { CheckCircleIcon, InProgressIcon, PlayIcon, LockIcon } from "@/components/icons";

export type StatusType = "in-progress" | "completed" | "now-playing" | "locked";

export interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  className = "",
}: StatusIndicatorProps) {
  const config = {
    "in-progress": {
      defaultLabel: "In Progress",
      icon: <InProgressIcon size={18} className="text-[#F97316] animate-spin" style={{ animationDuration: "3s" }} />,
      textClass: "text-[#0F172A]",
    },
    completed: {
      defaultLabel: "Completed",
      icon: <CheckCircleIcon size={18} className="text-[#16A34A]" />,
      textClass: "text-[#0F172A]",
    },
    "now-playing": {
      defaultLabel: "Now Playing",
      icon: <PlayIcon size={18} filled className="text-[#F97316]" />,
      textClass: "text-[#0F172A]",
    },
    locked: {
      defaultLabel: "Locked",
      icon: <LockIcon size={18} className="text-[#334155]" />,
      textClass: "text-[#0F172A]",
    },
  }[status];

  return (
    <div className={`inline-flex items-center gap-2 text-[14px] font-medium font-sans ${config.textClass} ${className}`}>
      <span className="flex items-center shrink-0">{config.icon}</span>
      <span>{label || config.defaultLabel}</span>
    </div>
  );
}
