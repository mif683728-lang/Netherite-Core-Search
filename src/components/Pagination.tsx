import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
}

export default function Pagination({ currentPage, onPageChange, hasMore }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>
      
      <div className="flex items-center gap-2">
        <span className="text-zinc-500 text-sm">Page</span>
        <span className="w-8 h-8 flex items-center justify-center rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-bold">
          {currentPage}
        </span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
