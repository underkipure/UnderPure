import React from "react";
import { Search } from "lucide-react";

export default function SurveysToolbar({
  searchQuery,
  setSearchQuery,
  totalMatching,
  displayedCount,
}) {
  return (
    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by email, words, or feedback..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border-gray-200 rounded-lg text-sm focus:border-black focus:ring-black"
        />
      </div>
      {totalMatching > 0 && (
        <div className="text-xs text-gray-500 font-medium">
          Showing {displayedCount} of {totalMatching} matching reports
        </div>
      )}
    </div>
  );
}
