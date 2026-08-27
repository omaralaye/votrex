import React from "react";

export function BottomBarsGraphic() {
  const bars = [
    { height: "45%", color: "from-[#F97316]/50 via-[#FB923C]/25 to-transparent" },
    { height: "72%", color: "from-[#FB923C]/60 via-[#FDBA74]/30 to-transparent" },
    { height: "88%", color: "from-[#F97316]/65 via-[#FB923C]/35 to-transparent" },
    { height: "65%", color: "from-[#FB923C]/55 via-[#FED7AA]/30 to-transparent" },
    { height: "50%", color: "from-[#FDBA74]/50 via-[#FED7AA]/20 to-transparent" },
    { height: "38%", color: "from-[#FED7AA]/40 via-[#FFEEE5]/20 to-transparent" },
    { height: "30%", color: "from-[#FFEEE5]/35 via-[#FED7AA]/15 to-transparent" },
    { height: "52%", color: "from-[#FDBA74]/50 via-[#FED7AA]/25 to-transparent" },
    { height: "76%", color: "from-[#FB923C]/65 via-[#FDBA74]/35 to-transparent" },
    { height: "92%", color: "from-[#F97316]/70 via-[#FB923C]/40 to-transparent" },
    { height: "68%", color: "from-[#FB923C]/55 via-[#FED7AA]/30 to-transparent" },
    { height: "58%", color: "from-[#FDBA74]/50 via-[#FED7AA]/25 to-transparent" },
    { height: "74%", color: "from-[#FB923C]/60 via-[#FDBA74]/35 to-transparent" },
    { height: "95%", color: "from-[#F97316]/75 via-[#FB923C]/45 to-transparent" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 right-0 h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden select-none"
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-x-0 bottom-0 h-[240px] bg-gradient-to-t from-[#F97316]/25 via-[#FB923C]/10 to-transparent blur-2xl" />

      {/* Grid of stylized vertical columns */}
      <div className="absolute inset-x-0 bottom-0 h-full flex items-end justify-between px-6 sm:px-10 lg:px-12 gap-2 sm:gap-3 lg:gap-4 max-w-[1440px] mx-auto">
        {bars.map((bar, index) => (

          <div
            key={index}
            style={{ height: bar.height }}
            className={`flex-1 rounded-t-sm sm:rounded-t bg-gradient-to-t ${bar.color} backdrop-blur-[1px] transition-all duration-700`}
          />
        ))}
      </div>

      {/* Foreground bottom gradient overlay for smooth blend */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#F97316]/30 via-[#FB923C]/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-[#F97316]/20" />
    </div>
  );
}
