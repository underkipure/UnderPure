import React from 'react';

export default function CategoryStatusLegend() {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-x-6 gap-y-2.5 text-[10px] uppercase tracking-widest text-gray-400 border-y border-black/5 py-3 px-1">
      <span className="font-semibold text-gray-500 mb-1 sm:mb-0">Key:</span>
      <div className="flex flex-wrap gap-2 sm:gap-6">
        <span className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 border border-green-200 bg-green-50 text-green-700">
            Visible
          </span>
          = shown on site
        </span>
        <span className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 border border-blue-200 bg-blue-50 text-blue-700">
            Header ✓
          </span>
          = in top nav
        </span>
        <span className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 border border-gray-200 bg-gray-50 text-gray-400">
            Header —
          </span>
          = hidden from top nav
        </span>
      </div>
    </div>
  );
}
