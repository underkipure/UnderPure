import React from "react";
import { Loader2 } from "lucide-react";

export default function SurveysLoadMore({
  displayedCount,
  totalCount,
  hasMore,
  isLoadingMore,
  onLoadMore,
}) {
  if (!hasMore) return null;

  return (
    <div className="p-6 border-t border-gray-100 flex flex-col items-center justify-center gap-3 bg-gray-50/30">
      <div className="text-xs text-gray-500 font-medium">
        Showing <span className="text-black font-bold">{displayedCount}</span> of{" "}
        <span className="text-black font-bold">{totalCount}</span> survey reports
      </div>
      <div className="w-48 bg-gray-200 h-1.5 rounded-full overflow-hidden mb-1">
        <div
          className="bg-black h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(
              100,
              Math.round((displayedCount / (totalCount || 1)) * 100)
            )}%`,
          }}
        />
      </div>
      <button
        onClick={onLoadMore}
        disabled={isLoadingMore}
        className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none rounded-none flex items-center justify-center gap-2 shadow-sm cursor-pointer"
      >
        {isLoadingMore ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading more reports...</span>
          </>
        ) : (
          <span>Load More Reports</span>
        )}
      </button>
    </div>
  );
}
