import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [jumpInput, setJumpInput] = useState("");

  if (totalItems === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis window
  const getPageNumbers = () => {
    const delta = 1;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (typeof i === "number") {
        if (l !== undefined) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = i;
      }
    }

    return rangeWithDots;
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpInput("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-1 text-xs text-slate-400">
      {/* Left: Entries status & Page size limit selector */}
      <div className="flex items-center flex-wrap gap-3">
        <span className="text-slate-400">
          Showing{" "}
          <span className="font-bold text-[#fdf0d5] tabular-nums">
            {startItem}
          </span>{" "}
          to{" "}
          <span className="font-bold text-[#fdf0d5] tabular-nums">
            {endItem}
          </span>{" "}
          of{" "}
          <span className="font-bold text-[#fdf0d5] tabular-nums">
            {totalItems}
          </span>{" "}
          records
        </span>

        <span aria-hidden="true" className="hidden sm:inline text-slate-600">
          ·
        </span>

        {/* Display limit control */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="pageSizeSelect" className="text-slate-400">
            Display limit:
          </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="py-1 px-2 border border-[#162c54] rounded-md bg-[#050c1e] text-[#fdf0d5] font-semibold focus:outline-none focus:border-[#fdf0d5] cursor-pointer shadow-xs tabular-nums text-xs"
          >
            <option value={10} className="bg-[#0c1836] text-slate-200">
              10 per page (default)
            </option>
            <option value={20} className="bg-[#0c1836] text-slate-200">
              20 per page
            </option>
            <option value={50} className="bg-[#0c1836] text-slate-200">
              50 per page
            </option>
          </select>
        </div>
      </div>

      {/* Right: Page navigation buttons & Jump to page */}
      <div className="flex items-center flex-wrap gap-2 justify-end">
        {/* Jump to page form */}
        {totalPages > 3 && (
          <form
            onSubmit={handleJumpSubmit}
            className="hidden lg:flex items-center gap-1.5 mr-2"
          >
            <span className="text-slate-400 text-xs">Jump to:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder="#"
              className="w-12 py-1 px-1.5 border border-[#162c54] rounded text-center text-xs text-[#fdf0d5] bg-[#050c1e] focus:outline-none focus:border-[#fdf0d5] tabular-nums"
              aria-label="Jump to page number"
            />
            <button
              type="submit"
              disabled={!jumpInput}
              className="py-1 px-2 border border-[#162c54] bg-[#13274e] hover:bg-[#1f3e6d] disabled:opacity-40 text-[#fdf0d5] font-semibold rounded text-xs transition-colors cursor-pointer"
            >
              Go
            </button>
          </form>
        )}

        <div className="flex items-center gap-1">
          {/* First Page */}
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md border border-[#162c54] bg-[#050c1e] hover:bg-[#102144] hover:text-[#fdf0d5] disabled:opacity-30 disabled:pointer-events-none text-slate-300 transition-colors cursor-pointer"
            title="First page"
            aria-label="First page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          {/* Previous Page */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md border border-[#162c54] bg-[#050c1e] hover:bg-[#102144] hover:text-[#fdf0d5] disabled:opacity-30 disabled:pointer-events-none text-slate-300 transition-colors flex items-center gap-1 pr-2 cursor-pointer"
            title="Previous page"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">Prev</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1 px-0.5">
            {getPageNumbers().map((page, idx) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-7 h-7 flex items-center justify-center text-slate-500 select-none text-xs"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-7 h-7 text-xs font-bold rounded-md transition-all flex items-center justify-center tabular-nums cursor-pointer ${
                    isActive
                      ? "bg-[#FCF1D0] text-black shadow-xs border border-[#2a4e88]"
                      : "border border-[#162c54] bg-[#050c1e] text-slate-300 hover:bg-[#102144] hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md border border-[#162c54] bg-[#050c1e] hover:bg-[#102144] hover:text-[#fdf0d5] disabled:opacity-30 disabled:pointer-events-none text-slate-300 transition-colors flex items-center gap-1 pl-2 cursor-pointer"
            title="Next page"
            aria-label="Next page"
          >
            <span className="hidden sm:inline font-semibold">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Last Page */}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md border border-[#162c54] bg-[#050c1e] hover:bg-[#102144] hover:text-[#fdf0d5] disabled:opacity-30 disabled:pointer-events-none text-slate-300 transition-colors cursor-pointer"
            title="Last page"
            aria-label="Last page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
