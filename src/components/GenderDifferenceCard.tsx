import React, { useState, useMemo } from "react";
import { Scale, Calendar, Users } from "lucide-react";
import { Contact, FilterState } from "../types/contact";

interface GenderDifferenceCardProps {
  contacts: Contact[];
  activeGenderFilter: string;
  onSelectGenderFilter: (gender: string) => void;
  filterState?: FilterState;
  onFilterChange?: (updates: Partial<FilterState>) => void;
}

export type DifferenceFilterMode = "date" | "age";

interface ChartPoint {
  id: string;
  label: string;
  fullLabel: string;
  female: number;
  male: number;
  diff: number; // positive = female lead, negative = male lead
  // Optional filter payloads
  monthIndex?: number;
  year?: number;
  ageMin?: number;
  ageMax?: number;
}

const shortMonthFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  timeZone: "UTC",
});
const fullMonthFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const GenderDifferenceCard: React.FC<GenderDifferenceCardProps> = ({
  contacts,
  activeGenderFilter,
  onSelectGenderFilter,
  filterState,
  onFilterChange,
}) => {
  // Toggle between 'date' and 'age' modes
  const [filterMode, setFilterMode] = useState<DifferenceFilterMode>("date");
  // Selected index defaults to the first available point.
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Build month buckets from the contacts received from Firestore.
  const monthData: ChartPoint[] = useMemo(() => {
    const monthBuckets = new Map<string, ChartPoint>();

    contacts.forEach((contact) => {
      if (!contact.createdAt) return;
      const createdAt = new Date(contact.createdAt);
      if (Number.isNaN(createdAt.getTime())) return;

      const monthIndex = createdAt.getUTCMonth();
      const year = createdAt.getUTCFullYear();
      const id = `m-${year}-${monthIndex}`;
      let bucket = monthBuckets.get(id);

      if (!bucket) {
        const monthDate = new Date(Date.UTC(year, monthIndex, 1));
        bucket = {
          id,
          label: `${shortMonthFormatter.format(monthDate)} ${year}`,
          fullLabel: fullMonthFormatter.format(monthDate),
          female: 0,
          male: 0,
          diff: 0,
          monthIndex,
          year,
        };
        monthBuckets.set(id, bucket);
      }

      if (contact.gender === "Female") bucket.female++;
      if (contact.gender === "Male") bucket.male++;
      bucket.diff = bucket.female - bucket.male;
    });

    return Array.from(monthBuckets.values()).sort(
      (a, b) =>
        (a.year ?? 0) - (b.year ?? 0) ||
        (a.monthIndex ?? 0) - (b.monthIndex ?? 0),
    );
  }, [contacts]);

  // Age-based Data (18-25, 26-35, 36-45, 46-55, 56+) computed directly from contacts
  const ageData: ChartPoint[] = useMemo(() => {
    const brackets = [
      {
        id: "a-0",
        label: "18–25",
        fullLabel: "Age 18 to 25",
        min: 18,
        max: 25,
      },
      {
        id: "a-1",
        label: "26–35",
        fullLabel: "Age 26 to 35",
        min: 26,
        max: 35,
      },
      {
        id: "a-2",
        label: "36–45",
        fullLabel: "Age 36 to 45",
        min: 36,
        max: 45,
      },
      {
        id: "a-3",
        label: "46–55",
        fullLabel: "Age 46 to 55",
        min: 46,
        max: 55,
      },
      {
        id: "a-4",
        label: "56+",
        fullLabel: "Age 56 and above",
        min: 56,
        max: 120,
      },
    ];

    return brackets.map((b) => {
      let female = 0;
      let male = 0;
      contacts.forEach((c) => {
        const age = c.age ?? 35;
        if (age >= b.min && age <= b.max) {
          if (c.gender === "Female") female++;
          else if (c.gender === "Male") male++;
        }
      });

      return {
        id: b.id,
        label: b.label,
        fullLabel: b.fullLabel,
        female,
        male,
        diff: female - male,
        ageMin: b.min,
        ageMax: b.max,
      };
    });
  }, [contacts]);

  const activeDataList = filterMode === "date" ? monthData : ageData;

  // Active point: hovered takes precedence, else selectedIdx (clamped)
  const activeIndex =
    activeDataList.length === 0
      ? null
      : hoveredIdx !== null
        ? Math.min(hoveredIdx, activeDataList.length - 1)
        : Math.min(selectedIdx, activeDataList.length - 1);

  const activePt =
    activeIndex === null ? undefined : activeDataList[activeIndex];

  const handlePointClick = (idx: number) => {
    setSelectedIdx(idx);
    const pt = activeDataList[idx];
    if (!onFilterChange || !pt) return;

    if (filterMode === "date") {
      if (pt.monthIndex === undefined || pt.year === undefined) return;
      if (
        filterState?.dateMonth?.monthIndex === pt.monthIndex &&
        filterState.dateMonth.year === pt.year
      ) {
        onFilterChange({ dateMonth: null });
      } else {
        onFilterChange({
          dateMonth: {
            monthIndex: pt.monthIndex,
            year: pt.year,
            label: pt.fullLabel,
          },
        });
      }
    } else {
      if (filterState?.ageRange?.min === pt.ageMin) {
        onFilterChange({ ageRange: null });
      } else {
        onFilterChange({
          ageRange: {
            min: pt.ageMin ?? 18,
            max: pt.ageMax ?? 25,
            label: pt.label,
          },
        });
      }
    }
  };

  // SVG Chart Geometry
  const width = 840;
  const height = 230;
  const padLeft = 45;
  const padRight = 35;
  const padTop = 25;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const largestValue = Math.max(
    0,
    ...activeDataList.flatMap((point) => [point.female, point.male]),
  );
  const yTickStep = Math.max(1, Math.ceil(largestValue / 7));
  const maxY = Math.max(
    yTickStep,
    Math.ceil(largestValue / yTickStep) * yTickStep,
  );

  const stepX =
    activeDataList.length > 1 ? chartW / (activeDataList.length - 1) : chartW;
  const singlePointOffset = activeDataList.length === 1 ? chartW / 2 : 0;

  const femalePoints = useMemo(() => {
    return activeDataList.map((d, i) => {
      const x = padLeft + singlePointOffset + i * stepX;
      const y = padTop + chartH - (d.female / maxY) * chartH;
      return { x, y, val: d.female };
    });
  }, [activeDataList, stepX, singlePointOffset, chartH, padLeft, padTop]);

  const malePoints = useMemo(() => {
    return activeDataList.map((d, i) => {
      const x = padLeft + singlePointOffset + i * stepX;
      const y = padTop + chartH - (d.male / maxY) * chartH;
      return { x, y, val: d.male };
    });
  }, [activeDataList, stepX, singlePointOffset, chartH, padLeft, padTop]);

  // Smooth Catmull-Rom spline path algorithm for flowing mountain curves
  const getSmoothSpline = (pts: { x: number; y: number }[], tension = 0.35) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const femaleSpline = useMemo(
    () => getSmoothSpline(femalePoints),
    [femalePoints],
  );
  const maleSpline = useMemo(() => getSmoothSpline(malePoints), [malePoints]);

  const baseY = padTop + chartH;

  const femaleArea = useMemo(() => {
    if (femalePoints.length === 0) return "";
    const firstX = femalePoints[0].x;
    const lastX = femalePoints[femalePoints.length - 1].x;
    return `${femaleSpline} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  }, [femaleSpline, femalePoints, baseY]);

  const maleArea = useMemo(() => {
    if (malePoints.length === 0) return "";
    const firstX = malePoints[0].x;
    const lastX = malePoints[malePoints.length - 1].x;
    return `${maleSpline} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  }, [maleSpline, malePoints, baseY]);

  const yAxisTicks = Array.from(
    { length: Math.floor(maxY / yTickStep) + 1 },
    (_, index) => maxY - index * yTickStep,
  );

  return (
    <div className="bg-[#0c1836] border border-[#162c54] rounded-2xl shadow-sm overflow-hidden transition-all duration-200">
      {/* Top Header Row with Mode Switcher & Interactive Filter Button */}
      <div className="px-5 py-4 bg-[#09142d] border-b border-[#162c54] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Description */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1f3e6d] border border-[#2a4e88] flex items-center justify-center text-white shadow-xs shrink-0">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Difference Between Male and Female
              </h3>
            </div>
          </div>
        </div>

        {/* Filter Controls & Difference Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* 1. Filter Mode Toggle Buttons (Date vs Age) */}
          <div className="flex items-center p-0.5 bg-[#050c1e] border border-[#162c54] rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => {
                setFilterMode("date");
                setSelectedIdx(0);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                filterMode === "date"
                  ? "bg-[#1f3e6d] text-white shadow-xs border border-[#2a4e88]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#0c1836]"
              }`}
              title="Filter by Registration Date Timeline"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Filter Date</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFilterMode("age");
                setSelectedIdx(1); // Reset to 26-35
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                filterMode === "age"
                  ? "bg-[#1f3e6d] text-white shadow-xs border border-[#2a4e88]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#0c1836]"
              }`}
              title="Filter by Age Demographic Groups"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Filter Age</span>
            </button>
          </div>

          {/* 2. Female / Male Legend Toggles */}
          <div className="hidden xl:flex items-center gap-3 text-xs pl-1">
            <button
              type="button"
              onClick={() =>
                onSelectGenderFilter(
                  activeGenderFilter === "Female" ? "all" : "Female",
                )
              }
              className={`flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                activeGenderFilter === "Female"
                  ? "text-[#f97316] font-bold underline underline-offset-4"
                  : "text-slate-300 hover:text-[#f97316]"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] shadow-xs" />
              <span>Female</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onSelectGenderFilter(
                  activeGenderFilter === "Male" ? "all" : "Male",
                )
              }
              className={`flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                activeGenderFilter === "Male"
                  ? "text-[#a855f7] font-bold underline underline-offset-4"
                  : "text-slate-300 hover:text-[#a855f7]"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] shadow-xs" />
              <span>Male</span>
            </button>
          </div>
        </div>
      </div>

      {/* SVG Smooth Curve Area Chart matching Reference 1 */}
      <div className="p-4 sm:p-5">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-48 sm:h-56 select-none"
            style={{ minWidth: "550px" }}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              {/* Female Orange/Coral Area Gradient */}
              <linearGradient id="femaleWaveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#ea580c" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#0c1836" stopOpacity="0.0" />
              </linearGradient>

              {/* Male Purple/Violet Area Gradient */}
              <linearGradient id="maleWaveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.48" />
                <stop offset="55%" stopColor="#7e22ce" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0c1836" stopOpacity="0.0" />
              </linearGradient>

              {/* Dot drop shadows */}
              <filter
                id="dot-shadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feDropShadow
                  dx="0"
                  dy="1.5"
                  stdDeviation="2"
                  floodColor="#000"
                  floodOpacity="0.6"
                />
              </filter>
            </defs>

            {/* Horizontal Grid lines matching 0, 5, 10, 15, 20, 25, 30, 35 */}
            {yAxisTicks.map((val) => {
              const y = padTop + chartH - (val / maxY) * chartH;
              return (
                <g key={`y-${val}`}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="#162c54"
                    strokeDasharray="2 3"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                  <text
                    x={padLeft - 10}
                    y={y + 3.5}
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Baseline X-axis */}
            <line
              x1={padLeft}
              y1={baseY}
              x2={width - padRight}
              y2={baseY}
              stroke="#1e3a6d"
              strokeWidth="1.5"
            />

            {/* Smooth Area Gradients Underneath Curves */}
            <path
              d={femaleArea}
              fill="url(#femaleWaveGrad)"
              className="transition-all duration-300"
            />
            <path
              d={maleArea}
              fill="url(#maleWaveGrad)"
              className="transition-all duration-300"
            />

            {/* Female Orange/Coral Line */}
            <path
              d={femaleSpline}
              fill="none"
              stroke="#f97316"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* Male Purple/Violet Line */}
            <path
              d={maleSpline}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* Active Guideline between Female and Male Marker Dots */}
            {activeIndex !== null && (
              <line
                x1={femalePoints[activeIndex]?.x ?? 0}
                y1={femalePoints[activeIndex]?.y ?? 0}
                x2={malePoints[activeIndex]?.x ?? 0}
                y2={malePoints[activeIndex]?.y ?? 0}
                stroke="#ffffff"
                strokeDasharray="2 2"
                strokeWidth="1.5"
                opacity="0.8"
              />
            )}

            {/* Interactive Column Hover Zones & Marker Dots */}
            {activeDataList.map((d, idx) => {
              const fPt = femalePoints[idx];
              const mPt = malePoints[idx];
              if (!fPt || !mPt) return null;
              const isSelected = activeIndex === idx;

              return (
                <g
                  key={`point-${d.id}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onClick={() => handlePointClick(idx)}
                  className="cursor-pointer"
                >
                  {/* Invisible hit-box */}
                  <rect
                    x={fPt.x - stepX / 2}
                    y={padTop}
                    width={stepX}
                    height={chartH + padBottom}
                    fill="transparent"
                  />

                  {/* Marker Dots (highlighted on active selection/hover) */}
                  {isSelected && (
                    <>
                      {/* Orange Dot for Female */}
                      <circle
                        cx={fPt.x}
                        cy={fPt.y}
                        r={5.5}
                        fill="#f97316"
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="url(#dot-shadow)"
                      />

                      {/* Purple Dot for Male */}
                      <circle
                        cx={mPt.x}
                        cy={mPt.y}
                        r={5.5}
                        fill="#a855f7"
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="url(#dot-shadow)"
                      />
                    </>
                  )}

                  {/* Month/Age Label on X-axis */}
                  <text
                    x={fPt.x}
                    y={baseY + 18}
                    fill={isSelected ? "#ffffff" : "#94a3b8"}
                    fontSize="11"
                    fontWeight={isSelected ? "bold" : "normal"}
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Helpful Hint Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 px-1 text-xs text-slate-400 gap-2 border-t border-[#162c54]/60 mt-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Active View:</span>
            <span>{activePt?.fullLabel ?? "No registration data"}</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#f97316] font-medium">
              {activePt?.female ?? 0} Female
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[#a855f7] font-medium">
              {activePt?.male ?? 0} Male
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>Click any point on the chart to filter the table below</span>
          </div>
        </div>
      </div>
    </div>
  );
};
