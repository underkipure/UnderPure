import React from "react";

const ReviewsPagination = ({
  reviewsCount,
  totalCount,
  hasMore,
  isLoadingMore,
  handleLoadMore,
}) => {
  return (
    <div className="mt-8 mb-4 flex flex-col items-center justify-center text-center bg-surface-1 border border-brand/15 p-6 rounded-sm">
      <p className="text-[13px] text-warm-gray font-serif mb-2">
        Showing <span className="font-bold text-ivory">{reviewsCount}</span> of{" "}
        <span className="font-bold text-ivory">{totalCount}</span> Reviews
      </p>

      {totalCount > 0 && (
        <div className="w-full max-w-xs bg-white/10 h-1.5 rounded-full overflow-hidden mb-4">
          <div
            className="bg-brand h-full transition-all duration-300"
            style={{
              width: `${Math.min(
                100,
                Math.round((reviewsCount / totalCount) * 100)
              )}%`,
            }}
          />
        </div>
      )}

      {hasMore ? (
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="border border-brand/40 bg-surface-2 px-8 py-2.5 text-xs uppercase tracking-widest font-bold text-ivory hover:bg-brand hover:text-black transition-all duration-200 disabled:opacity-50 min-w-[200px] flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow"
        >
          {isLoadingMore ? (
            <>
              <span className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin"></span>
              LOADING MORE REVIEWS...
            </>
          ) : (
            "LOAD MORE REVIEWS"
          )}
        </button>
      ) : totalCount > 0 ? (
        <span className="text-[11px] uppercase tracking-widest text-warm-gray/60 font-medium">
          ✓ All {totalCount} reviews loaded
        </span>
      ) : null}
    </div>
  );
};

export default ReviewsPagination;
