import React from "react";
import { TrendingUp, Check } from "lucide-react";

interface StatsCardsProps {
  totalCount: number;
  maleCount: number;
  femaleCount: number;
  activeGenderFilter: string;
  onSelectFilter: (gender: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalCount,
  maleCount,
  femaleCount,
  activeGenderFilter,
  onSelectFilter,
}) => {
  const malePercentage =
    totalCount > 0 ? ((maleCount / totalCount) * 100).toFixed(1) : "0";
  const femalePercentage =
    totalCount > 0 ? ((femaleCount / totalCount) * 100).toFixed(1) : "0";

  const cards = [
    {
      id: "total",
      filterValue: "all",
      title: "Total Person Registered",
      count: totalCount,
      headerBg: "bg-[#1f3e6d]",
      headerText: "text-white",
      badgeBg: "bg-[#162c54] text-white border border-[#2a4e88]",
      badgeText: "100%",
      badgeIcon: <TrendingUp className="w-3 h-3 text-white inline mr-0.5" />,
      subtitle: "All registered profiles",
      accentColor: "#1f3e6d",
      waveColor: "rgba(31, 62, 109, 0.5)",
    },
    {
      id: "male",
      filterValue: "Male",
      title: "Male Count",
      count: maleCount,
      headerBg: "bg-[#FCF1D0]",
      headerText: "text-black",
      badgeBg: "bg-[#162c54] text-white border border-[#2a4e88]",
      badgeText: `${malePercentage}%`,
      badgeIcon: (
        <span className="text-[10px] mr-0.5 font-bold text-white">♂</span>
      ),
      subtitle: `${maleCount} registered males`,
      accentColor: "#1f3e6d",
      waveColor: "rgba(31, 62, 109, 0.5)",
    },
    {
      id: "female",
      filterValue: "Female",
      title: "Female Count",
      count: femaleCount,
      headerBg: "bg-[#FCF1D0]",
      headerText: "text-black",
      badgeBg: "bg-[#162c54] text-white border border-[#2a4e88]",
      badgeText: `${femalePercentage}%`,
      badgeIcon: (
        <span className="text-[10px] mr-0.5 font-bold text-white">♀</span>
      ),
      subtitle: `${femaleCount} registered females`,
      accentColor: "#1f3e6d",
      waveColor: "rgba(31, 62, 109, 0.5)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
      {cards.map((card) => {
        const isSelected =
          card.filterValue === "all"
            ? activeGenderFilter === "all"
            : activeGenderFilter.toLowerCase() ===
              card.filterValue.toLowerCase();

        return (
          <div
            key={card.id}
            onClick={() => onSelectFilter(card.filterValue)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectFilter(card.filterValue);
              }
            }}
            className={`group bg-[#0c1836] rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col text-left relative shadow-sm hover:shadow-md focus:outline-none ${
              isSelected
                ? "border-[#fdf0d5] ring-2 ring-[#fdf0d5]/30 shadow-md"
                : "border-[#162c54] hover:border-[#1f3e6d]"
            }`}
          >
            {/* Top Colored Header Banner matching the palette */}
            <div
              className={`w-full px-5 py-2.5 ${card.headerBg} ${card.headerText} flex items-center justify-between font-bold text-xs sm:text-sm select-none transition-opacity`}
            >
              <span className="truncate tracking-tight">{card.title}</span>
              {isSelected && (
                <span className="flex items-center gap-1 text-[11px] font-bold bg-[#050c1e] text-[#fdf0d5] px-2 py-0.5 rounded-full border border-[#fdf0d5]/30 shadow-xs">
                  <Check className="w-3 h-3 text-[#fdf0d5]" />
                  <span>Filtered</span>
                </span>
              )}
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative bg-[#0c1836] overflow-hidden min-h-[96px]">
              {/* Numbers & Badges */}
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#fdf0d5] font-mono tracking-tight tabular-nums">
                    {card.count}
                  </span>

                  {/* Badge pill matching reference image */}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums shadow-xs ${card.badgeBg}`}
                  >
                    {card.badgeIcon}
                    <span>{card.badgeText}</span>
                  </span>
                </div>

                {/* Subtitle */}
                <p className="text-xs text-slate-400 font-normal mt-1.5 tracking-tight">
                  {card.subtitle}
                </p>
              </div>

              {/* Decorative soft wave art in bottom-right matching reference image */}
              <svg
                className="absolute right-0 bottom-0 pointer-events-none w-28 h-20 sm:w-32 sm:h-24 opacity-80 transition-transform group-hover:scale-105 duration-300"
                viewBox="0 0 140 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M0 100C40 90 70 60 90 40C110 20 125 10 140 0V100H0Z"
                  fill={card.waveColor}
                />
                <path
                  d="M30 100C65 95 90 75 110 50C125 30 135 15 140 5V100H30Z"
                  fill={card.waveColor}
                  opacity="0.6"
                />
                <circle
                  cx="120"
                  cy="80"
                  r="28"
                  fill={card.waveColor}
                  opacity="0.4"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};
