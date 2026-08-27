import React from "react";

export interface ProgressBarProps {
  progress: number; // 0 to 100
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  progress = 35,
  showLabel = true,
  className = "",
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`flex items-center gap-4 w-full ${className}`}>
      <div
        className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-[#F97316] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[13px] font-sans font-medium text-[#0F172A] whitespace-nowrap">
          <strong className="font-semibold text-[#0F172A]">{clampedProgress}%</strong>{" "}
          <span className="text-[#64748B] font-normal">complete</span>
        </span>
      )}
    </div>
  );
}
