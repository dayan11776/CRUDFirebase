import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Plus,
  RotateCcw,
} from "lucide-react";
import {
  FilterState,
  SortColumn,
  SortDirection,
  SortState,
} from "../types/contact";

interface TableToolbarProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  sortState: SortState;
  onSortChange: (column: SortColumn, direction?: SortDirection) => void;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  totalContacts: number;
  filteredCount: number;
  genderCounts: Record<string, number>;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
  sortState,
  onSortChange,
  onOpenAddModal,
  onExportCSV,
  onExportJSON,
  totalContacts,
  filteredCount,
  genderCounts,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node)
      ) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActiveFilters =
    Boolean(filterState.searchQuery) || filterState.gender !== "all";

  const genderOptions = [
    { id: "all", label: "All Genders", count: totalContacts },
    { id: "Male", label: "Male", count: genderCounts["Male"] || 0 },
    { id: "Female", label: "Female", count: genderCounts["Female"] || 0 },
  ];

  const sortColumns: { value: SortColumn; label: string }[] = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "contactNumber", label: "Contact Number" },
    { value: "gender", label: "Gender" },
  ];

  return (
    <div className="bg-[#0c1836] border border-[#162c54] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Search Bar & Action Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input Container */}
        <div className="flex-1 flex items-center gap-2 max-w-xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder={
                filterState.searchField === "all"
                  ? "Search by name, email, contact number, or gender..."
                  : `Search within ${filterState.searchField}...`
              }
              className="w-full pl-9 pr-9 py-2 text-sm bg-[#050c1e] border border-[#162c54] rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#fdf0d5] focus:border-[#fdf0d5] transition-colors shadow-xs"
            />
            {filterState.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: "" })}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#fdf0d5]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Field Target Selector */}
          <select
            value={filterState.searchField}
            onChange={(e) =>
              onFilterChange({
                searchField: e.target.value as FilterState["searchField"],
              })
            }
            aria-label="Search within specific field"
            className="hidden sm:block py-2 px-3 text-xs font-semibold text-slate-200 bg-[#050c1e] border border-[#162c54] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#fdf0d5] shadow-xs cursor-pointer hover:bg-[#0f1f42]"
          >
            <option value="all">All Fields</option>
            <option value="name">Name Only</option>
            <option value="email">Email Only</option>
            <option value="contactNumber">Contact Number</option>
            <option value="gender">Gender Only</option>
          </select>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Sorting Button / Dropdown */}
          <div className="flex items-center border border-[#162c54] rounded-lg bg-[#050c1e] overflow-hidden shadow-xs">
            <div className="px-2 py-1.5 flex items-center gap-1.5 text-xs text-slate-400 font-medium border-r border-[#162c54] bg-[#0c1836]">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Sort:</span>
            </div>
            <select
              value={sortState.column}
              onChange={(e) =>
                onSortChange(e.target.value as SortColumn, sortState.direction)
              }
              className="py-1.5 px-2 text-xs font-semibold text-slate-200 bg-transparent focus:outline-none cursor-pointer"
              aria-label="Select sort column"
            >
              {sortColumns.map((col) => (
                <option
                  key={col.value}
                  value={col.value}
                  className="bg-[#0c1836] text-slate-200"
                >
                  {col.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                onSortChange(
                  sortState.column,
                  sortState.direction === "asc" ? "desc" : "asc",
                )
              }
              title={`Switch to ${sortState.direction === "asc" ? "Descending" : "Ascending"} order`}
              aria-label={`Toggle sort order. Currently ${sortState.direction === "asc" ? "Ascending" : "Descending"}`}
              className="px-2.5 py-1.5 hover:bg-[#102146] text-slate-300 border-l border-[#162c54] transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              {sortState.direction === "asc" ? (
                <>
                  <ArrowUp className="w-3.5 h-3.5 text-[#fdf0d5]" />
                  <span className="hidden md:inline">Asc</span>
                </>
              ) : (
                <>
                  <ArrowDown className="w-3.5 h-3.5 text-[#fdf0d5]" />
                  <span className="hidden md:inline">Desc</span>
                </>
              )}
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-2 text-xs font-semibold text-slate-200 bg-[#050c1e] border border-[#162c54] rounded-lg hover:bg-[#0f1f42] hover:text-[#fdf0d5] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              aria-expanded={showExportMenu}
              aria-haspopup="true"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export</span>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-44 bg-[#0c1836] border border-[#162c54] rounded-lg shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportCSV();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#13274e] hover:text-[#fdf0d5] flex items-center justify-between cursor-pointer"
                >
                  <span>Export as CSV</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    .csv
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportJSON();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#13274e] hover:text-[#fdf0d5] flex items-center justify-between border-t border-[#162c54] cursor-pointer"
                >
                  <span>Export as JSON</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    .json
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={onResetFilters}
            title="Reset data to initial sample set"
            aria-label="Reset to default sample contacts"
            className="p-2 text-slate-400 bg-[#050c1e] border border-[#162c54] rounded-lg hover:text-[#fdf0d5] hover:bg-[#0f1f42] transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Add Contact Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#1f3e6d] hover:bg-[#28508a] active:bg-[#162f55] border border-[#2a4e88] rounded-lg transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Gender Filter Options & State Feedback */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#162c54]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Gender:</span>
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-[#050c1e] border border-[#162c54] rounded-lg shrink-0">
            {genderOptions.map((opt) => {
              const isActive = filterState.gender === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onFilterChange({ gender: opt.id })}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-[#1f3e6d] text-[#fdf0d5] shadow-xs border border-[#2a4e88]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#0c1836]"
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`font-mono text-[10px] tabular-nums ${
                      isActive ? "text-[#fdf0d5]" : "text-slate-500"
                    }`}
                  >
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status indicator & Clear Filter */}
        <div className="flex items-center gap-2.5 text-xs text-slate-400 shrink-0">
          <span>
            Showing{" "}
            <strong className="font-bold text-[#fdf0d5] tabular-nums">
              {filteredCount}
            </strong>{" "}
            of{" "}
            <strong className="font-bold text-[#fdf0d5] tabular-nums">
              {totalContacts}
            </strong>{" "}
            entries
          </span>
          {hasActiveFilters && (
            <>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[#fdf0d5] hover:underline underline-offset-2 font-medium transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
